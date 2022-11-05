import html2canvas from 'html2canvas';

import { checkLogin } from './common/auth';
import { form } from './common/data';
import { injectScript } from './common/utils';
import { sleep } from '../../Tools/Common';
import { Buffer } from 'buffer';

const iconv = require('iconv-lite');

async function scrape(items: any, user: any) {
  let result: any = form;

  let attributes: any = document.getElementsByClassName('attributes-list')[0].querySelectorAll('li');

  for (let i in attributes) {
    try {
      const text = attributes[i].textContent.trim();

      if (!text) {
        continue;
      }

      result['item']['attr'].push(text);
    } catch (e) {
      continue;
    }
  }

  let details = items.price;
  let configs = items.config;

  let script_video = items.video;
  let script_option = items.sku.valItemInfo.skuMap;

  let price;

  try {
    if (details.promotion.promoData.def[0].price.includes("-")) {
      price = details.promotion.promoData.def[0].price.split("-")[0];
    } else {
      price = details.promotion.promoData.def[0].price;
    }
  } catch (e) {
    console.log("알림: 프로모션 가격 정보를 가져오지 못했습니다. 기본 가격으로 수집됩니다. (", e, ")");

    if (details.price.includes("-")) {
      price = details.price.split("-")[0];
    } else {
      price = details.price;
    }
  }

  let shipping_info = details.deliveryFee.data.serviceInfo.hasOwnProperty('sku') ? details.deliveryFee.data.serviceInfo.sku.default[0].info : details.deliveryFee.data.serviceInfo.list[0].info;
  let shipping_fee = parseFloat(shipping_info.replace(/[^\.0-9]/g, ''));

  result['item']['shopName'] = 'taobao';
  result['item']['url'] = `https://item.taobao.com/item.htm?id=${configs.idata.item.id}`
  result['item']['num_iid'] = configs.idata.item.id;
  result['item']['title'] = configs.idata.item.title;
  result['item']['price'] = shipping_fee > 0 ? (parseFloat(price) + shipping_fee).toString() : price;
  result['item']['pic_url'] = /^https?:/.test(configs.idata.item.pic) ? configs.idata.item.pic : "http:" + configs.idata.item.pic;
  // result['item']['brand'] = "";
  result['item']['post_fee'] = shipping_fee;
  result['item']['shop_id'] = "taobao";

  let desc_html: any = new DOMParser().parseFromString(items.desc, "text/html");
  let desc: any = desc_html.querySelectorAll("html > body img");
  let desc_imgs: any = [];

  let descTable = desc_html.querySelectorAll("html > body table");
  let descText = "";

  for (let i = 0; i < descTable.length; i++) {
    try {
      const images = descTable[i].querySelectorAll('img');

      if (images.length > 0) {
        continue;
      }

      if (descTable[i].outerHTML) {
        descTable[i].style.width = "750px";

        descText += descTable[i].outerHTML;
      }
    } catch (e) {
      continue;
    }
  }

  if (descText) {
    let test = document.createElement('div');

    test.id = 'capture';
    test.innerHTML = descText;
    test.style.display = "inline-block";

    document.body.appendChild(test);

    let canvas = await html2canvas(test, {
      useCORS: true,
      width: 750
    });

    let canvas_output = canvas.toDataURL('image/png');

    test.remove();

    desc_imgs.push(canvas_output);
  }

  for (let i in desc) {
    try {
      if (desc[i].getAttribute('data-ks-lazyload')) {
        desc[i].src = desc[i].getAttribute('data-ks-lazyload');
      }

      if (desc[i].getAttribute('data-src')) {
        desc[i].src = desc[i].getAttribute('data-src');
      }

      if (desc[i].src) {
        if (desc[i].src.includes(".gif")) {
          desc[i].parentNode.removeChild(desc[i]);
        } else {
          desc[i].src = desc[i].src;
          desc_imgs.push(desc[i].src);
        }
      }
    } catch (e) {
      continue;
    }
  }

  let desc_output = desc_html.querySelector("html > body").innerHTML;

  let iterator = document.createNodeIterator(desc_html.querySelector("html > body"), NodeFilter.SHOW_TEXT);
  let textnode;

  while (textnode = iterator.nextNode()) {
    const texts = textnode.textContent.split("\n").map((v: any) => v.trim()).filter((v: any) => v);

    texts.map((v: any) => {
      result['item']['desc_text'].push(v);
    })
  }

  result['item']['desc'] = desc_output;
  result['item']['desc_img'] = desc_imgs;

  try {
    result['item']['video'] = "https://cloud.video.taobao.com/play/u/" + script_video.videoOwnerId + "/p/1/e/6/t/1/" + script_video.videoId + ".mp4";
  } catch (e) {
    console.log("알림: 동영상이 없는 상품입니다. (", e, ")");
  }

  try {
    for (let i in configs.idata.item.auctionImages) {
      try {
        result['item']['item_imgs'].push({
          "url": /^https?:/.test(configs.idata.item.auctionImages[i]) ? configs.idata.item.auctionImages[i] : "http:" + configs.idata.item.auctionImages[i]
        });
      } catch (e) {
        continue;
      }
    }
  } catch (e) {
    console.log("에러: 대표 이미지를 찾을 수 없습니다. (", e, ")");

    return { error: "대표 이미지를 찾을 수 없습니다." };
  }

  let options = document.querySelectorAll('#J_isku > div ul');

  for (let i in options) {
    try {
      let id = options[i].querySelectorAll('li');
      let name = options[i].getAttribute('data-property');

      for (let j in id) {
        try {
          let img: any = id[j].querySelector('a');
          let num: any = id[j].getAttribute('data-value');

          let val = img.textContent;
          let url = img.style.backgroundImage.length ? img.style.backgroundImage.match(/(\/\/.*)"/)[1].replace(/_\d{2}x\d{2}.[a-zA-Z]{3}/, "") : "";

          if (url !== "") {
            result['item']['prop_imgs']['prop_img'].push({
              "properties": num,
              "url": /^https?:/.test(url) ? url : "http:" + url
            });
          }

          if (val !== null) {
            let value = val.trim() ?? items.sku.valItemInfo.propertyMemoMap[num];

            result['item']['props_list'][num] = name + ":" + value;
          }
        } catch (e) {
          continue;
        }
      }
    } catch (e) {
      continue;
    }
  }

  try {
    for (let i in script_option) {
      let properties = i.split(";");

      let properties_id = "";
      let properties_name = "";

      for (let j = 1; j < properties.length; j++) {
        if (j < properties.length - 1) {
          properties_id += properties[j];
          properties_name += properties[j] + ":" + result['item']['props_list'][properties[j]];
        }

        if (j < properties.length - 2) {
          properties_id += ";"
          properties_name += ";"
        }
      }

      if (result['item']['props_list'][properties[1]] !== undefined) {
        if (details.dynStock.sku.hasOwnProperty(i)) {
          let quantity = details.dynStock.sku[i].stock.toString();

          if (quantity !== "0") {
            let promotion_price = details.promotion.promoData[i] ? details.promotion.promoData[i][0].price : details.originalPrice[i].price;

            result['item']['skus']['sku'].push({
              "price": shipping_fee > 0 ? (parseFloat(promotion_price) + shipping_fee).toString() : promotion_price,
              "total_price": 0,
              "original_price": details.originalPrice.hasOwnProperty(i) ? details.originalPrice[i].price : "",
              "properties": properties_id,
              "properties_name": properties_name,
              "quantity": user.userInfo.collectStock === 0 ? quantity > 99999 ? "99999" : quantity.toString() : user.userInfo.collectStock.toString(),
              "sku_id": script_option[i].skuId
            });
          }
        }
      } else {
        //
      }
    }
  } catch (e) {
    console.log("에러: 옵션 세부정보를 가져오지 못했습니다. (", e, ")");

    return { error: "옵션 세부정보를 가져오지 못했습니다." };
  }

  let min_price = parseFloat(result['item']['price']);

  try {
    if (Object.keys(script_option).length > 0) {
      let priceList = result['item']['skus']['sku'].map((v: any) => {
        return v.price;
      });

      min_price = Math.min(...priceList);

      for (let i in result['item']['props_list']) {
        let matched = false;

        for (let j in result['item']['skus']['sku']) {
          if (result['item']['skus']['sku'][j]['properties'].includes(i)) {
            matched = true;

            break;
          }
        }

        if (matched) {
          continue;
        }

        delete result['item']['props_list'][i];
      }
    }
  } catch (e) {
    console.log("에러: 옵션 가격정보를 가져오지 못했습니다. (", e, ")");
  }

  if (parseFloat(result['item']['price']) !== min_price) {
    result['item']['price'] = min_price.toString();
  }

  if (Object.keys(result.item.props_list).length > 0 && result.item.skus.sku.length === 0) {
    console.log("에러: 해당 상품은 일시적으로 품절되었습니다.");

    return { error: "해당 상품은 일시적으로 품절되었습니다." };
  }

  return result;
}

export class taobao {
  constructor() {
    checkLogin('taobao').then((auth) => {
      if (!auth) {
        return null;
      }
    });
  }

  async get(user: any) {
    sessionStorage.removeItem("sfy-taobao-item");

    injectScript('taobao');

    let timeout = 0;

    while (true) {
      if (timeout === user.userInfo.collectTimeout) {
        return { error: "타오바오 접속상태가 원활하지 않습니다.\n잠시 후 다시시도해주세요." };
      }

      let data = sessionStorage.getItem('sfy-taobao-item');

      if (data) {
        let originalData = JSON.parse(data);

        let descResp = await fetch(originalData.descUrl);
        let descBuffer = await descResp.arrayBuffer();
        let descText = iconv.decode(Buffer.from(descBuffer), 'gbk').toString();

        originalData = {
          ...originalData,

          desc: descText,
        }

        console.log(originalData);

        return await scrape(originalData, user);
      }

      timeout++;

      await sleep(1000 * 1);
    }
  }

  async bulkTypeOne() {
    document.addEventListener('DOMNodeInserted', async (e: any) => {
      try {
        if (e.target.getAttribute('class') === 'm-feedback') {
          let products: any = document.querySelectorAll("#main > div:nth-child(3) > div.grid-left a");

          for (let i in products) {
            try {
              if (products[i].getAttribute('id').includes('J_Itemlist_PLink')) {
                let input: any = document.createElement("input");
                let picker: any = document.getElementById('sfyPicker');

                input.id = products[i].getAttribute('href');
                input.className = "SELLFORYOU-CHECKBOX";
                input.checked = picker?.value === "false" ? false : true
                input.type = "checkbox";

                const root = products[i].parentNode.parentNode.parentNode.parentNode;
                const medal = root.getElementsByClassName('icon-service-jinpaimaijia');

                input.setAttribute('medal', medal.length);

                products[i].parentNode.insertBefore(input, products[i].nextSibling);
              }
            } catch (e) {
              continue;
            }
          }

          return;
        }
      } catch (e) {
        //
      }
    });
  }

  async bulkTypeTwo() {
    let timeout = 0;

    while (true) {
      if (timeout === 100) {
        return 0;
      }

      let count = 0;
      let lines = document.querySelectorAll('div');
      let test: any = [];
      for (let i = 0; i < lines.length - 1; i++) {
        if (/item[0-9]*line[0-9]/.test(lines[i]?.getAttribute('class') ?? "")) {
          let links: any = lines[i].querySelectorAll('a');

          for (let j = 0; j < links.length - 1; j++) {
            let image = links[j].querySelector('img');
            if (!image) {
              continue;
            }

            let input: any = document.createElement("input");
            let picker: any = document.getElementById('sfyPicker');

            input.id = links[j].getAttribute('href');
            input.className = "SELLFORYOU-CHECKBOX";
            input.checked = picker?.value === "false" ? false : true
            input.type = "checkbox";

            links[j].parentNode.style.position = "relative";
            links[j].parentNode.insertBefore(input, links[j].nextSibling);

            count++;
          }
          test.push(links);
        }
      }

      if (count > 0) {
        return count;
      }

      await sleep(1000 * 2);

      timeout++;
    }
  }
}