import { checkLogin } from './common/auth';
import { form } from './common/data';
import { injectScript } from './common/utils';
import { sleep, getImageSize } from '../../Tools/Common';

// VVIC 상품정보 크롤링
async function scrape(items: any, user: any) {
  let result: any = form;

  result.user = user;

  let attrs = document.getElementsByClassName('attrs')[0].querySelectorAll('li');

  for (let i in attrs) {
    try {
      const text = attrs[i].textContent?.trim();

      if (!text) {
        continue;
      }

      result['item']['attr'].push(text);
    } catch (e) {
      continue;
    }
  }

  let thumnails: any = [];

  let imgs = document.querySelectorAll('#thumblist img');

  for (let i in imgs) {
    try {
      let img = imgs[i].getAttribute('big');

      if (img) {
        let img_fixed = /^https?:/.test(img) ? img : 'http:' + img;

        thumnails.push(img_fixed);
      }
    } catch (e) {
      continue;
    }
  }

  let desc_html: any = new DOMParser().parseFromString(items.descriptions, 'text/html');
  let desc_scripts = desc_html.querySelectorAll('script');

  for (let i in desc_scripts) {
    try {
      desc_scripts[i].remove();
    } catch (e) {
      continue;
    }
  }

  let desc: any = desc_html.querySelectorAll('html > body img');
  let desc_imgs: any = [];

  for (let i in desc) {
    try {
      if (desc[i].src) {
        if (desc[i].src.includes('.gif')) {
          desc[i].parentNode.removeChild(desc[i]);
        } else {
          const image: any = await getImageSize(desc[i].src); //해당 이미지 사이즈가 100x100 이하 제거
          if (image < 1000) {
            console.log('흰색 이미지', desc[i]);
            desc[i].parentNode.removeChild(desc[i]);
          } else {
            desc[i].src = desc[i].src;
            desc_imgs.push(desc[i].src);
          }
        }
      }
    } catch (e) {
      continue;
    }
  }

  let desc_href: any = desc_html.querySelectorAll('a');

  for (let i in desc_href) {
    try {
      desc_href[i].remove();
    } catch (e) {
      continue;
    }
  }

  let desc_output = desc_html.querySelector('body').innerHTML;

  let iterator = document.createNodeIterator(desc_html.querySelector('body'), NodeFilter.SHOW_TEXT);
  let textnode;

  while ((textnode = iterator.nextNode())) {
    const texts = textnode.textContent
      .split('\n')
      .map((v: any) => v.trim())
      .filter((v: any) => v);

    texts.map((v: any) => {
      result['item']['desc_text'].push(v);
    });
  }

  result['item']['shopName'] = 'vvic';
  result['item']['url'] = `https://www.vvic.com/item/${items.itemVid}`;
  result['item']['num_iid'] = items.itemVid;
  result['item']['title'] = items.title;
  result['item']['price'] = items.discountPrice;
  result['item']['pic_url'] = thumnails[0];
  // result['item']['brand'] = "";
  result['item']['desc'] = desc_output;
  result['item']['desc_img'] = desc_imgs;
  result['item']['tmall'] = false;
  result['item']['shop_id'] = 'vvic';

  try {
    result['item']['video'] = items.video;
  } catch (e) {
    console.log('알림: 동영상이 없는 상품입니다. (', e, ')');
  }

  try {
    for (let i in thumnails) {
      try {
        // let image: any = await getImageSize(thumnails[i]);
        // if (image < 1000) {
        //   console.log("썸네일 흰색 이미지 발견", thumnails[i]);
        // } else {
        //   result["item"]["item_imgs"].push({
        //     url: thumnails[i],
        //   });
        // }
        result['item']['item_imgs'].push({
          url: thumnails[i],
        });
      } catch (e) {
        continue;
      }
    }
  } catch (e) {
    console.log('에러: 대표 이미지를 찾을 수 없습니다. (', e, ')');

    return { error: '대표 이미지를 찾을 수 없습니다.' };
  }

  try {
    let colors = items.color.split(',');
    let colorIds = items.colorId.split(',');

    let sizes = items.size.split(',');
    let sizeIds = items.sizeId.split(',');

    for (let i in colorIds) {
      result['item']['props_list'][colorIds[i]] = '颜色:' + colors[i];

      if (items.colorPics[i]) {
        result['item']['prop_imgs']['prop_img'].push({
          properties: colorIds[i],
          url: /^https?:/.test(items.colorPics[i]) ? items.colorPics[i] : 'http:' + items.colorPics[i],
        });
      }
    }

    for (let i in sizeIds) {
      result['item']['props_list'][sizeIds[i]] = '尺码:' + sizes[i];
    }
  } catch (e) {
    console.log(e);
  }

  try {
    for (let i in items.skuMap) {
      let properties = items.skuMap[i].skuid.split(';');

      let properties_id = '';
      let properties_name = '';

      for (let j = 1; j < properties.length; j++) {
        if (j < properties.length - 1) {
          properties_id += properties[j];
          properties_name += properties[j] + ':' + result['item']['props_list'][properties[j]];
        }

        if (j < properties.length - 2) {
          properties_id += ';';
          properties_name += ';';
        }
      }

      let quantity = 999;
      console.log(items.skuMap[i].id.toString());
      if (quantity > 0) {
        result['item']['skus']['sku'].push({
          price: items.skuMap[i].discount_price ?? items.skuMap[i].price,
          total_price: 0,
          original_price: items.skuMap[i].price,
          properties: properties_id,
          properties_name: properties_name,
          quantity:
            user.userInfo.collectStock === 0
              ? quantity > 99999
                ? '99999'
                : quantity.toString()
              : user.userInfo.collectStock.toString(),
          sku_id: items.skuMap[i].id.toString(),
        });
      }
    }
  } catch (e) {
    console.log('에러: 옵션 세부정보를 가져오지 못했습니다. (', e, ')');

    return { error: '옵션 세부정보를 가져오지 못했습니다.' };
  }

  let min_price = parseFloat(result['item']['price']);

  for (let i in result['item']['skus']['sku']) {
    if (i === '0') {
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
    console.log('에러: 해당 상품은 일시적으로 품절되었습니다.');

    return { error: '해당 상품은 일시적으로 품절되었습니다.' };
  }

  return result;
}

async function bulkTypeTwo(user) {
  let timeout = 0;

  while (true) {
    if (timeout === 10) {
      return 0;
    }

    let count = 0;
    let products: any = document.querySelectorAll(
      'body > div.w.item-search-container > div.fl.search-main.j-search-main.item-search-main > div.goods-list.clearfix.type1 a'
    );

    for (let i in products) {
      try {
        let img = products[i].querySelector('img');

        if (img && products[i].getAttribute('href').includes('item')) {
          let input = document.createElement('input');
          let picker: any = document.getElementById('sfyPicker');

          input.id = window.location.origin + products[i].getAttribute('href');
          input.className = 'SELLFORYOU-CHECKBOX';
          input.checked = picker?.value === 'false' ? false : true;
          input.type = 'checkbox';

          if (user.userInfo.collectCheckPosition === 'L') {
            input.setAttribute('style', 'left: 0px !important');
          } else {
            input.setAttribute('style', 'right: 0px !important');
          }

          products[i].style.position = 'relative';
          products[i].parentNode.insertBefore(input, products[i].nextSibling);

          count++;
        }
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

async function bulkTypeThree(user) {
  let timeout = 0;

  while (true) {
    if (timeout === 10) {
      return 0;
    }

    let count = 0;
    let products: any = document.querySelectorAll('#content_all a');

    for (let i in products) {
      try {
        let img = products[i].querySelector('img');

        if (img && products[i].getAttribute('href').includes('item')) {
          let input = document.createElement('input');
          let picker: any = document.getElementById('sfyPicker');

          input.id = window.location.origin + products[i].getAttribute('href');
          input.className = 'SELLFORYOU-CHECKBOX';
          input.checked = picker?.value === 'false' ? false : true;
          input.type = 'checkbox';

          if (user.userInfo.collectCheckPosition === 'L') {
            input.setAttribute('style', 'left: 0px !important');
          } else {
            input.setAttribute('style', 'right: 0px !important');
          }

          products[i].style.position = 'relative';
          products[i].parentNode.insertBefore(input, products[i].nextSibling);

          count++;
        }
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

async function bulkTypeFour(user) {
  let timeout = 0;

  while (true) {
    if (timeout === 10) {
      return 0;
    }

    let count = 0;
    let products: any = document.querySelectorAll(
      'body > div.w > div.j-list-main.fl.search-main > div.goods-list.clearfix.type1 a'
    );

    for (let i in products) {
      try {
        let img = products[i].querySelector('img');

        if (img && products[i].getAttribute('href').includes('item')) {
          let input = document.createElement('input');

          input.id = window.location.origin + products[i].getAttribute('href');
          input.className = 'SELLFORYOU-CHECKBOX';
          input.checked = true;
          input.type = 'checkbox';

          if (user.userInfo.collectCheckPosition === 'L') {
            input.setAttribute('style', 'left: 0px !important');
          } else {
            input.setAttribute('style', 'right: 0px !important');
          }

          products[i].style.position = 'relative';
          products[i].parentNode.insertBefore(input, products[i].nextSibling);

          count++;
        }
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

export class vvic {
  constructor() {
    checkLogin('vvic').then((auth) => {
      if (!auth) {
        return null;
      }
    });
  }

  async get(user: any) {
    sessionStorage.removeItem('sfy-vvic-item');

    injectScript('vvic');

    let timeout = 0;

    while (true) {
      if (timeout === user.userInfo.collectTimeout) {
        return {
          error: 'VVIC 접속상태가 원활하지 않습니다.\n잠시 후 다시시도해주세요.',
        };
      }

      let data = sessionStorage.getItem('sfy-vvic-item');

      if (data) {
        let originalData = JSON.parse(data);

        // console.log(originalData);

        return await scrape(originalData, user);
      }

      timeout++;

      await sleep(1000 * 1);
    }
  }

  async bulkTypeOne(user, bulkType: number) {
    document.addEventListener('DOMNodeInserted', function (e: any) {
      try {
        if (e.target.tagName === 'LI') {
          let products = e.target.querySelectorAll('a');

          for (let i in products) {
            try {
              let img = products[i].querySelector('img');

              if (img && products[i].getAttribute('href').includes('item')) {
                let input = document.createElement('input');
                let picker: any = document.getElementById('sfyPicker');

                input.id = window.location.origin + products[i].getAttribute('href');
                input.className = 'SELLFORYOU-CHECKBOX';
                input.checked = picker?.value === 'false' ? false : true;
                input.type = 'checkbox';

                if (user.userInfo.collectCheckPosition === 'L') {
                  input.setAttribute('style', 'left: 0px !important');
                } else {
                  input.setAttribute('style', 'right: 0px !important');
                }

                products[i].style.position = 'relative';
                products[i].parentNode.insertBefore(input, products[i].nextSibling);
              }
            } catch (e) {
              continue;
            }
          }
        }
      } catch (e) {
        return 0;
      }
    });

    document.addEventListener('DOMContentLoaded', function (e: any) {
      switch (bulkType) {
        case 2: {
          bulkTypeTwo(user);

          break;
        }

        case 3: {
          bulkTypeThree(user);

          break;
        }

        case 4: {
          bulkTypeFour(user);

          break;
        }
      }
    });
  }
}
