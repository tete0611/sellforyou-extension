import { checkLogin } from './common/auth';
import { form } from './common/data';
import { injectScript } from './common/utils';
import { sleep } from '../../Tools/Common';

async function scrape(items: any, user: any) {
  let result: any = form;

  if (items.specsModule) {
    items.specsModule.props.map((v: any) => {
      result['item']['attr'].push(`${v.attrName}:${v.attrValue}`);
    })
  }

  if (items.shippingModule) {
    let shipping_list = items.shippingModule.generalFreightInfo.originalLayoutResultList;

    for (let i in shipping_list) {
      let shipping_data: any = {};

      shipping_data.name = shipping_list[i].bizData.company;

      if (shipping_list[i].bizData.shippingFee === "free") {
        shipping_data.value = 0;
        shipping_data.format = "무료 배송";
      } else {
        try {
          shipping_data.value = parseInt(shipping_list[i].bizData.formattedAmount.replace(/[₩, ]/g, ""));
          shipping_data.format = shipping_list[i].bizData.formattedAmount;
        } catch (e) {
          continue;
        }
      }

      if (shipping_list[i].bizData.company === "AliExpress Standard Shipping") {
        shipping_data.default = true;
      } else {
        shipping_data.default = false;
      }

      result['item']['props'].push(shipping_data);
    }
  }

  let thumnails = [];

  if (items.imageModule) {
    thumnails = items.imageModule.imagePathList;

    try {
      result['item']['video'] = "https://cloud.video.taobao.com/play/u/" + items.imageModule.videoUid + "/p/1/e/6/t/10301/" + items.imageModule.videoId.toString() + ".mp4";
    } catch (e) {
      console.log("알림: 동영상이 없는 상품입니다. (", e, ")");
    }
  }

  let desc_resp = await fetch(items.descriptionModule.descriptionUrl);
  let desc_text = await desc_resp.text();
  let desc_html: any = new DOMParser().parseFromString(desc_text, "text/html");

  let desc_scripts = desc_html.querySelectorAll("script");

  for (let i in desc_scripts) {
    try {
      desc_scripts[i].remove();
    } catch (e) {
      continue;
    }
  }

  let desc: any = desc_html.querySelectorAll("html > body img");
  let desc_imgs: any = [];

  for (let i in desc) {
    try {
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

  let desc_output = desc_html.querySelector("body").innerHTML;

  let iterator = document.createNodeIterator(desc_html.querySelector("body"), NodeFilter.SHOW_TEXT);
  let textnode;

  while (textnode = iterator.nextNode()) {
    const texts = textnode.textContent.split("\n").map((v: any) => v.trim()).filter((v: any) => v);

    texts.map((v: any) => {
      result['item']['desc_text'].push(v);
    })
  }

  result['item']['shopName'] = 'express';
  result['item']['url'] = `https://ko.aliexpress.com/item/${items.commonModule.productId}.html`;
  result['item']['num_iid'] = items.commonModule.productId.toString();
  result['item']['title'] = items.titleModule.subject;
  result['item']['price'] = items.priceModule.hasOwnProperty('minActivityAmount') ? items.priceModule.minActivityAmount.value.toString() : items.priceModule.minAmount.value.toString();
  result['item']['pic_url'] = /^https?:/.test(thumnails[0]) ? thumnails[0] : "http:" + thumnails[0];
  // result['item']['brand'] = "";
  result['item']['desc'] = desc_output;
  result['item']['desc_img'] = desc_imgs;
  result['item']['tmall'] = false;
  result['item']['shop_id'] = "express";

  try {
    for (let i in thumnails) {
      try {
        result['item']['item_imgs'].push({
          "url": /^https?:/.test(thumnails[i]) ? thumnails[i] : "http:" + thumnails[i]
        });
      } catch (e) {
        continue;
      }
    }
  } catch (e) {
    console.log("에러: 대표 이미지를 찾을 수 없습니다. (", e, ")");

    return { error: "대표 이미지를 찾을 수 없습니다." };
  }

  let delivery_code = "";

  try {
    for (let i in items.skuModule.productSKUPropertyList) {
      let skus = items.skuModule.productSKUPropertyList[i];

      for (let j in skus.skuPropertyValues) {
        if (skus.skuPropertyName === "배송지" || skus.skuPropertyName === "Ships From") {
          if (skus.skuPropertyValues[j].skuPropertySendGoodsCountryCode === "CN") {
            delivery_code = skus.skuPropertyId + ":" + skus.skuPropertyValues[j].propertyValueIdLong;
          }

          continue;
        }

        try {
          let num = skus.skuPropertyId + ":" + skus.skuPropertyValues[j].propertyValueIdLong;
          let name = skus.skuPropertyName + ":" + skus.skuPropertyValues[j].propertyValueDisplayName;
          let image = skus.skuPropertyValues[j].skuPropertyImagePath;

          if (image) {
            result['item']['prop_imgs']['prop_img'].push({
              "properties": num,
              "url": /^https?:/.test(image) ? image : "http:" + image
            });
          }

          result['item']['props_list'][num] = name;
        } catch (e) {
          console.log(e);

          continue;
        }
      }
    }
  } catch (e) {
    console.log(e);
  }

  try {
    for (let i in items.skuModule.skuPriceList) {
      let skus = items.skuModule.skuPriceList[i];

      let properties = skus.skuAttr.split(";");

      let properties_id = "";
      let properties_name = "";

      let matched = false;

      if (delivery_code === "") {
        matched = true;
      }

      for (let j = 0; j < properties.length; j++) {
        let properties_fixed = properties[j].replace(/#.+/, "");

        if (properties_fixed === delivery_code) {
          matched = true;

          continue;
        }

        if (j < properties.length) {
          properties_id += properties_fixed;
          properties_name += properties_fixed + ":" + result['item']['props_list'][properties_fixed];
        }

        if (j < properties.length - 1) {
          properties_id += ";"
          properties_name += ";"
        }
      }

      let quantity = skus.skuVal.availQuantity.toString();

      if (matched && quantity !== "0") {
        let promotion_price = skus.skuVal.skuActivityAmount ? skus.skuVal.skuActivityAmount.value : skus.skuVal.skuAmount ? skus.skuVal.skuAmount.value : skus.skuVal.actSkuMultiCurrencyCalPrice ?? skus.skuVal.skuMultiCurrencyCalPrice;

        result['item']['skus']['sku'].push({
          "price": promotion_price,
          "total_price": 0,
          "original_price": skus.skuVal.skuAmount ? skus.skuVal.skuAmount.value : skus.skuVal.actSkuMultiCurrencyCalPrice,
          "properties": properties_id,
          "properties_name": properties_name,
          "quantity": user.userInfo.collectStock === 0 ? quantity > 99999 ? "99999" : quantity.toString() : user.userInfo.collectStock.toString(),
          "sku_id": skus.skuIdStr
        });
      }
    }
  } catch (e) {
    console.log("에러: 옵션 세부정보를 가져오지 못했습니다. (", e, ")");

    return { error: "옵션 세부정보를 가져오지 못했습니다." };
  }

  let min_price = parseFloat(result['item']['price']);

  for (let i in result['item']['skus']['sku']) {
    if (i === "0") {
      min_price = parseFloat(result['item']['skus']['sku'][i]['price']);

      continue;
    }

    let cur_price = parseFloat(result['item']['skus']['sku'][i]['price']);

    if (min_price > cur_price) {
      min_price = cur_price;
    }
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
export class express {
  constructor() {
    checkLogin('express').then((auth) => {
      if (!auth) {
        return null;
      }
    });
  }

  async get(user: any) {
    sessionStorage.removeItem("sfy-express-item");

    injectScript('express');

    let timeout = 0;

    while (true) {
      if (timeout === user.userInfo.collectTimeout) {
        return { error: "알리익스프레스 접속상태가 원활하지 않습니다.\n잠시 후 다시시도해주세요." };
      }

      let data = sessionStorage.getItem('sfy-express-item');

      if (data) {
        let originalData = JSON.parse(data);

        console.log(originalData);

        return await scrape(originalData, user);
      }

      timeout++;

      await sleep(1000 * 1);
    }
  }

  async bulkTypeOne() {
    document.addEventListener('DOMNodeInserted', function (e: any) {
      try {
        if (e.target.getAttribute('href').includes('item')) {
          let input = document.createElement("input");
          let picker: any = document.getElementById('sfyPicker');

          input.id = e.target.getAttribute('href');
          input.className = "SELLFORYOU-CHECKBOX";
          input.checked = picker?.value === "false" ? false : true
          input.type = "checkbox";

          e.target.style.position = "relative";
          e.target.appendChild(input);
        }
      } catch (e) {
        return 0;
      }
    });
  }

  async bulkTypeTwo() {
    let timeout = 0;

    while (true) {
      if (timeout === 10) {
        return 0;
      }

      let count = 0;
      let products: any = document.querySelectorAll("#root > div.glosearch-wrap > div > div.main-content > div.right-menu > div > div.JIIxO > a");

      for (let i in products) {
        try {
          let input: any = document.createElement("input");
          let picker: any = document.getElementById('sfyPicker');

          input.id = products[i].getAttribute('href');
          input.className = "SELLFORYOU-CHECKBOX";
          input.checked = picker?.value === "false" ? false : true
          input.type = "checkbox";
          input.setAttribute('data-spm-anchor-id', 'a2g0o.productlist.0.0');

          products[i].style.position = "relative";
          products[i].appendChild(input);

          count++;
        } catch (e) {
          continue;
        }
      }

      if (count > 0) {
        return count;
      }

      await sleep(1000 * 1);

      timeout++;
    }
  }

  async bulkTypeThree() {
    let timeout = 0;

    while (true) {
      if (timeout === 10) {
        return 0;
      }

      let count = 0;
      let products: any = document.querySelectorAll("#node-gallery > div.module.m-o.m-o-large-all-detail > div > div a");

      for (let i in products) {
        try {
          let image = products[i].querySelector('img');

          if (!image) {
            continue;
          }

          let input: any = document.createElement("input");
          let picker: any = document.getElementById('sfyPicker');

          input.id = /^https?:/.test(products[i].getAttribute('href')) ? products[i].getAttribute('href') : "https:" + products[i].getAttribute('href');
          input.className = "SELLFORYOU-CHECKBOX";
          input.checked = picker?.value === "false" ? false : true
          input.type = "checkbox";
          input.setAttribute('data-spm-anchor-id', 'a2g0o.productlist.0.0');

          products[i].style.position = "relative";
          products[i].appendChild(input);

          count++;
        } catch (e) {
          continue;
        }
      }

      if (count > 0) {
        return count;
      }

      await sleep(1000 * 1);

      timeout++;
    }
  }
}
