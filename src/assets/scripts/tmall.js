// 티몰 페이지 삽입 스크립트
async function getImageMeta(src) {
  return new Promise(function (resolve, reject) {
    let image = new Image();

    image.onload = function () {
      resolve(image);
    };

    image.onerror = function () {
      console.log('error');
    };
    // image.onerror = reject;
    image.src = src;
  });
}

async function main() {
  // 데이터가 로드될 때까지 루프를 반복함
  let cnt = 0;

  while (true) {
    try {
      let json = {};
      console.log(window);
      // 페이지뷰가 다른 경우를 체크
      if (window.NEW_DETAIL_ENV) {
        try {
          //대충 돔에서 읽어오는건데 일단 어느정도 코드는 남겨놓음
          // let desc_output = "<p>";
          // let descDocument = document.querySelector("div.descV8-container").innerHTML;
          // let desc_html = new DOMParser().parseFromString(descDocument, "text/html");
          // let desc = desc_html.querySelectorAll("img");
          // let desc_imgs = [];
          // for (let i in desc) {
          //   try {
          //     if (desc[i].getAttribute("data-src")) {
          //       desc[i].src = desc[i].getAttribute("data-src");
          //     }
          //     if (desc[i].src) {
          //       if (desc[i].src.includes(".gif")) {
          //         desc[i].parentNode.removeChild(desc[i]);
          //       } else {
          //         const image = await getImageMeta(desc[i].src); //해당 이미지 사이즈가 100x100 이하 제거
          //         if (image.width < 10 || image.height < 10) {
          //           // console.log("흰색 이미지", desc[i]);
          //           desc[i].parentNode.removeChild(desc[i]);
          //         } else {
          //           desc[i].src = desc[i].src;
          //           desc_output += `<img align="absmiddle" src="${desc[i].src}">`;
          //           desc_imgs.push(desc[i].src);
          //         }
          //       }
          //     }
          //   } catch (e) {
          //     continue;
          //   }
          // }
          // desc_output += "<p>";

          json = {
            pageType: 2,
          };

          sessionStorage.setItem('sfy-tmall-item', JSON.stringify(json));
          break;
        } catch (e) {
          console.log(e);
          // 1초마다 루프 반복
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } else {
        // 이전 페이지뷰는 상세페이지 정보가 담겨 있지 않아 수동으로 가져와야 함
        let descUrl = null;

        // 상세페이지 정보를 가져오는 티몰 API 링크를 동적으로 찾음
        const scripts = document.getElementsByTagName('script');

        for (let i in scripts) {
          if (scripts[i].innerHTML && scripts[i].innerHTML.includes('TShop.Setup')) {
            const matched = scripts[i].innerHTML.match(/TShop\.Setup\(([\S\s]+)\);[\S\s]+\);/);
            const info = JSON.parse(matched[1]);

            descUrl = /^https?/.test(info.api.descUrl) ? info.api.descUrl : 'https:' + info.api.descUrl;

            break;
          }
        }

        // 페이지 로드가 완료되면 티몰에서 해당 이벤트를 발생시킴
        window.TShop.onProduct((e) => {
          json = {
            pageType: 1,
            itemDO: e.__attrVals.itemDO,
            buyPrice: e.__attrVals.buyPrice,
            desc: e.__attrVals.desc,
            descUrl,
            propertyPics: e.__attrVals.propertyPics,
            skuProp: e.__attrVals.skuProp,
            skuMap: e.__attrVals.skuMap,
            priceInfo: e.__attrVals.priceInfo,
            inventory: e.__attrVals.inventory,
            delivery: e.__attrVals.delivery,
          };
        });

        // 필수 데이터 체크
        if (
          json['itemDO'] &&
          json['buyPrice'] &&
          (json['desc'] || json['descUrl']) &&
          json['priceInfo'] &&
          json['inventory']
        ) {
          // 세션 스토리지로 데이터 공유할 때 주의사항
          // 1) sendMessage 사용 불가(삽입 스크립트와 크롬 확장프로그램 간 통신 방법은 스토리지가 유일함)
          // 2) 세션 스토리지 키 값이 충돌하지 않도록 고려해야 함
          sessionStorage.setItem('sfy-tmall-item', JSON.stringify(json));

          break;
        }
      }

      // 1초마다 루프 반복
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (e) {
      console.log(e);

      // 1초마다 루프 반복
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

main();
