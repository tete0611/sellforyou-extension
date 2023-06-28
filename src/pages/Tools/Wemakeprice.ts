import MUTATIONS from "../Main/GraphQL/Mutations";
import QUERIES from "../Main/GraphQL/Queries";
import gql from "../Main/GraphQL/Requests";
import { createTabCompletely, sendTabMessage } from "./ChromeAsync";

import { getClock, getClockOffset, getStoreTraceCodeV1, notificationByEveryTime, request, sendCallback, transformContent } from "./Common";
// 위메프 상품삭제 메시지 탭
async function deleteWemakeprice2(data: any) {
  const deleteResp: any = await request("https://wpartner.wemakeprice.com/product/setProdStatus.json", {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "sec-ch-ua": '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
    },
    referrer: "https://wpartner.wemakeprice.com/product/prodMain",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: `prodNo=${data}&prodStatusActionPolicy=S`,
    method: "POST",
    mode: "cors",
    credentials: "include",
  });

  const deleteJson: any = JSON.parse(deleteResp);
  return deleteJson;
}
// 위메프 상품수정 메시지 탭
async function editWemakeprice(data: any) {
  let productResp: any = await request("https://wpartner.wemakeprice.com/product/setProd.json", {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "ko,ko-KR;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
    },

    referrer: `https://wpartner.wemakeprice.com/product/prodSet?setType=update&title=&prodNo=${data.productId}`,
    referrerPolicy: "strict-origin-when-cross-origin",
    body: data.productContent,
    method: "POST",
    mode: "cors",
    credentials: "include",
  });

  let productJson: any = JSON.parse(productResp);
  return productJson;
}
// 위메프 상품등록 메시지 탭
async function uploadWemakeprice2(data: any) {
  let productResp: any = await request("https://wpartner.wemakeprice.com/product/setProd.json", {
    headers: {
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "ko,ko-KR;q=0.9,en-US;q=0.8,en;q=0.7",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
    },
    referrer: "https://wpartner.wemakeprice.com/product/prodSet?setType=set",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: data,
    method: "POST",
    mode: "cors",
    credentials: "include",
  });
  let test: any = JSON.parse(productResp);
  return test;
}

// 위메프 상품등록
async function uploadWemakeprice(productStore: any, commonStore: any, data: any) {
  if (!data) {
    return false;
  }

  let newTab: any = {};
  let shopName = data.DShopInfo.site_name;

  console.log(`(${shopName}) 등록정보:`, data);

  try {
    let time = getClock();

    let login_resp = await fetch("https://wpartner.wemakeprice.com/getLoginUser.json");
    let login_json = await login_resp.json();

    if (!login_json.userId) {
      productStore.addConsoleText(`(${shopName}) 파트너 로그인 실패`);
      notificationByEveryTime(`(${shopName}) 파트너 로그인 후 재시도 바랍니다.`);

      return false;
    }

    newTab = await createTabCompletely({ active: false, url: "https://wpartner.wemakeprice.com/" }, 10);

    if (!newTab.id) {
      productStore.addConsoleText(`(${shopName}) 위메프 접속 실패`);
      notificationByEveryTime(`(${shopName}) 위메프 접속에 실패하였습니다.`);

      return false;
    }

    if (login_json.userId !== commonStore.user.userInfo.wemakepriceId) {
      productStore.addConsoleText(`(${shopName}) 스토어 연동정보 확인 실패`);
      notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

      chrome.tabs.remove(newTab.id);

      return false;
    }

    const policy = commonStore.uploadInfo.markets.find((v: any) => v.code === data.DShopInfo.site_code)?.policyInfo ?? null;

    if (!policy) {
      productStore.addConsoleText(`(${shopName}) 발송정책 조회 실패`);
      notificationByEveryTime(`(${shopName}) 발송정책 조회에 실패하였습니다.`);

      return false;
    }

    let shipping_resp = await fetch(`https://wpartner.wemakeprice.com/partner/sellerShip/getSellerShipDetail.json?shipPolicyNo=${policy}`);
    let shipping_json = await shipping_resp.json();

    for (let product in data.DShopInfo.prod_codes) {
      try {
        let market_code = data.DShopInfo.prod_codes[product];
        let market_item = data.DShopInfo.DataDataSet.data[product];
        let market_optn = data.DShopInfo.DataDataSet.data_opt;

        if (commonStore.uploadInfo.stopped) {
          productStore.addConsoleText(`(${shopName}) [${market_code}] 업로드 중단`);

          chrome.tabs.remove(newTab.id);
          return false;
        }

        if (!market_item.cert) {
          if (!commonStore.uploadInfo.editable) {
            productStore.addRegisteredFailed(
              Object.assign(market_item, {
                error: "스토어에 이미 등록된 상품입니다.",
              })
            );
            productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);

            continue;
          }
        } else {
          if (commonStore.uploadInfo.editable) {
            productStore.addRegisteredFailed(
              Object.assign(market_item, {
                error: "상품 신규등록을 먼저 진행해주세요.",
              })
            );
            productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);

            continue;
          }
        }

        let name = market_item.name3.slice(0, 70);

        let productData: any = {
          action: "set",
          prodNo: "",
          dcateCd: market_item.cate_code,
          prodStatus: "",
          removeProdOptionNoStr: "",
          removeProdImgNoStr: "",
          removeProdFileNoStr: "",
          removeProdGnoticeNoStr: "",
          agreeNo: "",
          keywordWmp: "",
          keywordEp: "",
          shipPolicyNo: policy,
          parentProdNo: "",
          schCateType: "SCH",
          cateSchNm: "",
          prodNm: name,
          mallType: "NOR",
          prodType: "N",
          brandYn: "N",
          brandNo: "",
          makerYn: "N",
          makerNo: "",
          mdEmpNo: "2014041439",
          dispYn: "Y",
          taxYn: "Y",
          refPriceType: "ONL",
          originPrice: market_item.wprice1,
          salePrice: market_item.sprice,
          commissionType: "FR",
          commissionRate: "",
          commissionPrice: "",
          salePeriod: "A", //P
          saleStartDt: `${time.YY}-${time.MM}-${time.DD} ${time.hh}:00`,
          saleEndDt: "2037-12-31 23:00",
          stockCount: market_item.stock,
          saleStatus: "A",
          purchaseMinCount: "1",
          purchaseLimitYn: "N",
          basketLimitYn: "N",
          validPeriod: "PERIOD",
          validStartDt: "",
          validEndDt: "",
          validDay: "",
          storeZipcode: "",
          storeAddr1: "",
          storeAddr2: "",
          storeRoadAddr1: "",
          storeRoadAddr2: "",
          storeLatitude: "",
          storeLongitude: "",
          optSelUseYn: "N",
          optTxtUseYn: "N",
          sellerProdCd: market_code,
          contentsMakingType: "P",
          mainYnRadio: "0",

          "imgList[0].mainYn": "Y",
          "imgList[0].imgUrl": market_item.img1,
          "imgList[0].imgNo": "",
          "imgList[0].imgNm": "01.jpg",
          "imgList[0].imgWidth": "460",
          "imgList[0].imgHeight": "460",
          "imgList[0].useYn": "Y",
          "imgList[0].imgType": "MN",
          "imgList[0].priority": "0",

          "imgList[1].mainYn": "N",
          "imgList[1].imgUrl": market_item.img2,
          "imgList[1].imgNo": "",
          "imgList[1].imgNm": "02.jpg",
          "imgList[1].imgWidth": "460",
          "imgList[1].imgHeight": "460",
          "imgList[1].useYn": "Y",
          "imgList[1].imgType": "MN",
          "imgList[1].priority": "1",

          "imgList[2].mainYn": "N",
          "imgList[2].imgUrl": market_item.img3,
          "imgList[2].imgNo": "",
          "imgList[2].imgNm": "03.jpg",
          "imgList[2].imgWidth": "460",
          "imgList[2].imgHeight": "460",
          "imgList[2].useYn": "Y",
          "imgList[2].imgType": "MN",
          "imgList[2].priority": "2",

          "imgList[3].mainYn": "N",
          "imgList[3].imgUrl": market_item.img1,
          "imgList[3].imgNo": "",
          "imgList[3].imgNm": "04.jpg",
          "imgList[3].imgWidth": "600",
          "imgList[3].imgHeight": "400",
          "imgList[3].useYn": "Y",
          "imgList[3].imgType": "LST",
          "imgList[3].priority": "3",

          detailType: "HTML",
          claimShipFee: shipping_json.claimShipFee,
          releaseZipcode: shipping_json.releaseZipcode,
          releaseAddr1: shipping_json.releaseAddr1,
          releaseAddr2: shipping_json.releaseAddr2,
          releaseRoadAddr1: shipping_json.releaseRoadAddr1,
          releaseRoadAddr2: shipping_json.releaseRoadAddr2,
          returnZipcode: shipping_json.returnZipcode,
          returnAddr1: shipping_json.returnAddr1,
          returnAddr2: shipping_json.returnAddr2,
          returnRoadAddr1: shipping_json.returnRoadAddr1,
          returnRoadAddr2: shipping_json.returnRoadAddr2,
          releaseDay: shipping_json.releaseDay,
          holidayExceptYn: shipping_json.holidayExceptYn,

          checkboxAllNoticeExp: "기본 문구 입력",

          isbn13: "",
          isbn10: "",
          "certList[0].isCert": "N",
          "certList[0].certGroup": "KD",
          "certList[1].isCert": "N",
          "certList[1].certGroup": "LF",
          "certList[2].isCert": "N",
          "certList[2].certGroup": "ER",
          "certList[3].isCert": "N",
          "certList[3].certGroup": "RP",
          "certList[4].isCert": "N",
          "certList[4].certGroup": "LC",
          "cert.KD.isCert": "N",
          "labelList[0].useYn": "Y",
          "labelList[0].labelGroup": "P",
          "labelList[0].labelNo": "19",
          "labelList[1].labelGroup": "P",
          "labelList[1].labelNo": "20",
          "labelList[2].labelGroup": "P",
          "labelList[2].labelNo": "21",
          "labelList[3].labelGroup": "P",
          "labelList[3].labelNo": "22",
          epYn: "Y",
          reviewDisp: "N",
          adultLimitYn: "N",
          localLiquorYn: "N",
          parallelImportYn: "N",
          prodDesc: `
        ${getStoreTraceCodeV1(market_item.id, data.DShopInfo.site_code)}
        ${market_item.content2}${
            commonStore.user.userInfo.descriptionShowTitle === "Y"
              ? `<br /><br /><div style="text-align: center;">${market_item.name3}</div><br /><br />`
              : `<br /><br />`
          }${transformContent(market_item.content1)}${market_item.content3}`,
        };

        const itemInfo = productStore.itemInfo.items.find((v: any) => v.productCode === market_code);

        const sillCode = itemInfo[`sillCode${data.DShopInfo.site_code}`] ? itemInfo[`sillCode${data.DShopInfo.site_code}`] : "38";
        const sillData = itemInfo[`sillData${data.DShopInfo.site_code}`]
          ? JSON.parse(itemInfo[`sillData${data.DShopInfo.site_code}`])
          : [
              { code: "195", name: "품명 및 모델명", type: "input" },
              { code: "197", name: "법에 의한 인증, 허가 등을 받았음을 확인할 수 있는 경우 그에 대한 사항", type: "input" },
              { code: "198", name: "제조국 또는 원산지", type: "input" },
              { code: "201", name: "제조자, 수입품의 경우 수입자를 함께 표기", type: "input" },
              { code: "203", name: "A/S 책임자와 전화번호 또는 소비자상담 관련 전화번호", type: "input" },
            ];

        productData["gnoticeList[0].gnoticeNo"] = sillCode;
        productData["gnoticeList[0].useYn"] = "Y";
        productData["gnoticeList[0].prodGnoticeNo"] = "";

        sillData.map((v, i) => {
          productData[`gnoticeList[0].prodNoticeSetDtoList[${i}].prodDesc`] = v.value ?? "상세설명참조";
          productData[`gnoticeList[0].prodNoticeSetDtoList[${i}].noticeNo`] = v.code;
        });

        let option_length = 0;

        let group: any = {};

        let words = await gql(QUERIES.SELECT_WORD_TABLES_BY_SOMEONE, {}, false);
        let words_list = words.data.selectWordTablesBySomeone;

        let words_restrict: any = {};

        for (let i in words_list) {
          if (words_list[i].findWord && !words_list[i].replaceWord) {
            if (market_item.name3.includes(words_list[i].findWord)) {
              words_restrict["상품명"] = words_list[i].findWord;
            }
          }
        }

        for (let i in market_optn) {
          if (market_optn[i].code === market_code) {
            for (let j in market_optn[i]) {
              if (j.includes("misc") && market_optn[i][j] !== "") {
                group[market_optn[i][j]] = j.replace("misc", "opt");
              }

              if (j.includes("opt") && j !== "optimg" && market_optn[i][j] !== "") {
                for (let k in words_list) {
                  if (words_list[k].findWord && !words_list[k].replaceWord) {
                    if (market_optn[i][j].includes(words_list[k].findWord)) {
                      words_restrict["옵션명"] = words_list[k].findWord;
                    }
                  }
                }
              }
            }

            option_length += 1;
          }
        }

        if (Object.keys(words_restrict).length > 0) {
          let message = "";

          for (let i in words_restrict) {
            message += i + "에서 금지어(" + words_restrict[i] + ")가 발견되었습니다. ";
          }

          productStore.addRegisteredFailed(Object.assign(market_item, { error: message }));
          productStore.addConsoleText(`(${shopName}) [${market_code}] 금지어 발견됨`);

          await sendCallback(commonStore, data, market_code, parseInt(product), 2, message);

          continue;
        }

        if (option_length > 200) {
          productStore.addRegisteredFailed(
            Object.assign(market_item, {
              error: "옵션 개수가 200개를 초과하는 상품은 등록하실 수 없습니다.",
            })
          );
          productStore.addConsoleText(`(${shopName}) 상품 등록 실패`);

          await sendCallback(commonStore, data, market_code, parseInt(product), 2, "옵션 개수가 200개를 초과하는 상품은 등록하실 수 없습니다.");

          continue;
        }

        let option_count = Object.keys(group).length;

        if (option_count > 0) {
          productData["optSelUseYn"] = "Y";
          productData["optionDepth"] = option_count;
          productData["sOptType"] = "S";
          productData["sDepth"] = option_count;

          let option_list_count = 1;
          let option_data_count = 0;

          for (let i in group) {
            let option_string = ``;

            for (let j in market_optn) {
              if (market_optn[j].code === market_code) {
                option_string += market_optn[j][group[i]];
                option_string += ",";
              }
            }

            productData[`opt1[${option_list_count}]`] = i;
            productData[`opt2[${option_list_count}]`] = option_string.slice(0, option_string.length - 1);
            productData[`sOpt${option_list_count}Title`] = i;

            option_list_count += 1;
          }

          for (let i in market_optn) {
            if (market_optn[i].code === market_code) {
              if (market_optn[i].misc1 && market_optn[i].opt1) {
                productData[`optionList[${option_data_count}].opt1Val`] = market_optn[i].opt1;
              }

              if (market_optn[i].misc2 && market_optn[i].opt2) {
                productData[`optionList[${option_data_count}].opt2Val`] = market_optn[i].opt2;
              }

              if (market_optn[i].misc3 && market_optn[i].opt3) {
                productData[`optionList[${option_data_count}].opt3Val`] = market_optn[i].opt3;
              }

              productData[`optionList[${option_data_count}].optAddPrice`] = market_optn[i].price;
              productData[`optionList[${option_data_count}].stockCount`] = market_optn[i].stock;
              productData[`optionList[${option_data_count}].sellerOptCd`] = "";
              productData[`optionList[${option_data_count}].saleStatus`] = "A";
              productData[`optionList[${option_data_count}].dispYn`] = "Y";
              productData[`optionList[${option_data_count}].priority`] = option_data_count;
              productData[`optionList[${option_data_count}].useYn`] = "Y";

              option_data_count += 1;
            }
          }
        } else {
          productData["optSelUseYn"] = "N";
        }

        if (commonStore.uploadInfo.stopped) {
          productStore.addConsoleText(`(${shopName}) [${market_code}] 업로드 중단`);

          chrome.tabs.remove(newTab.id);

          return false;
        }

        if (!market_item.cert && commonStore.uploadInfo.editable) {
          let productId = market_item.name2;

          if (!productId) {
            productStore.addRegisteredFailed(Object.assign(market_item, { error: "상품 ID를 찾을 수 없습니다." }));
            productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 실패`);

            await sendCallback(commonStore, data, market_code, parseInt(product), 2, "상품 ID를 찾을 수 없습니다.");

            continue;
          }

          const searchResp = await fetch(`https://wpartner.wemakeprice.com/product/getDetail.json?prodNo=${productId}`, {
            headers: {
              accept: "application/json, text/javascript, */*; q=0.01",
              "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
              "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
              "sec-ch-ua": '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"Windows"',
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "x-requested-with": "XMLHttpRequest",
            },
            referrer: "https://wpartner.wemakeprice.com/product/prodMain",
            referrerPolicy: "strict-origin-when-cross-origin",
            body: null,
            method: "GET",
            mode: "cors",
            credentials: "include",
          });

          const searchJson = await searchResp.json();

          productData["action"] = "update";
          productData["prodNo"] = productId;
          productData["saleStartDt"] = searchJson.saleStartDt;

          let productContent: any = [];

          for (let property in productData) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(productData[property]);

            productContent.push(encodedKey + "=" + encodedValue);
          }

          productContent = productContent.join("&");

          productStore.addConsoleText(`(${shopName}) 상품 수정 중...`);
          productStore.addRegisteredQueue(market_item);

          let editdata: any = {
            productId,
            productContent,
          };

          let productJson: any = await sendTabMessage(newTab.id, {
            action: "edited-B719",
            source: editdata,
          });

          // let productResp = await fetch("https://wpartner.wemakeprice.com/product/setProd.json", {
          //   headers: {
          //     accept: "application/json, text/javascript, */*; q=0.01",
          //     "accept-language": "ko,ko-KR;q=0.9,en-US;q=0.8,en;q=0.7",
          //     "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          //     "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
          //     "sec-ch-ua-mobile": "?0",
          //     "sec-ch-ua-platform": '"Windows"',
          //     "sec-fetch-dest": "empty",
          //     "sec-fetch-mode": "cors",
          //     "sec-fetch-site": "same-origin",
          //     "x-requested-with": "XMLHttpRequest",
          //   },

          //   referrer: `https://wpartner.wemakeprice.com/product/prodSet?setType=update&title=&prodNo=${productId}`,
          //   referrerPolicy: "strict-origin-when-cross-origin",
          //   body: productContent,
          //   method: "POST",
          //   mode: "cors",
          //   credentials: "include",
          // });

          // let productJson = await productResp.json();

          if (productJson.errors) {
            productStore.addRegisteredFailed(Object.assign(market_item, { error: productJson.errors[0].detail }));
            productStore.addConsoleText(`(${shopName}) 상품 수정 실패`);

            await sendCallback(commonStore, data, market_code, parseInt(product), 2, productJson.errors[0].detail);
          } else {
            productStore.addRegisteredSuccess(Object.assign(market_item, { error: productJson[0].returnKey }));
            productStore.addConsoleText(`(${shopName}) 상품 수정 성공`);

            await sendCallback(commonStore, data, market_code, parseInt(product), 1, productJson[0].returnKey);
          }
        } else {
          let productContent: any = [];

          for (let property in productData) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(productData[property]);

            productContent.push(encodedKey + "=" + encodedValue);
          }

          productContent = productContent.join("&");

          productStore.addConsoleText(`(${shopName}) 상품 등록 중...`);
          productStore.addRegisteredQueue(market_item);

          let productJson: any = await sendTabMessage(newTab.id, {
            action: "upload-B719",
            source: productContent,
          });

          // let productResp = await fetch("https://wpartner.wemakeprice.com/product/setProd.json", {
          //   headers: {
          //     accept: "application/json, text/javascript, */*; q=0.01",
          //     "accept-language": "ko,ko-KR;q=0.9,en-US;q=0.8,en;q=0.7",
          //     "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          //     "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
          //     "sec-ch-ua-mobile": "?0",
          //     "sec-ch-ua-platform": '"Windows"',
          //     "sec-fetch-dest": "empty",
          //     "sec-fetch-mode": "cors",
          //     "sec-fetch-site": "same-origin",
          //     "x-requested-with": "XMLHttpRequest",
          //   },

          //   referrer: "https://wpartner.wemakeprice.com/product/prodSet?setType=set",
          //   referrerPolicy: "strict-origin-when-cross-origin",
          //   body: productContent,
          //   method: "POST",
          //   mode: "cors",
          //   credentials: "include",
          // });

          // let productJson = await productResp.json();

          if (productJson.errors) {
            productStore.addRegisteredFailed(Object.assign(market_item, { error: productJson.errors[0].detail }));
            productStore.addConsoleText(`(${shopName}) 상품 등록 실패`);

            await sendCallback(commonStore, data, market_code, parseInt(product), 2, productJson.errors[0].detail);
          } else {
            productStore.addRegisteredSuccess(Object.assign(market_item, { error: productJson[0].returnKey }));
            productStore.addConsoleText(`(${shopName}) 상품 등록 성공`);

            await sendCallback(commonStore, data, market_code, parseInt(product), 1, productJson[0].returnKey);
          }
        }
      } catch (e: any) {
        notificationByEveryTime(`(${shopName}) 업로드 도중 오류가 발생하였습니다. (${e.toString()})`);

        chrome.tabs.remove(newTab.id);
        continue;
      }
    }
  } catch (e: any) {
    productStore.addConsoleText(`(${shopName}) 업로드 중단`);
    notificationByEveryTime(`(${shopName}) 업로드 도중 오류가 발생하였습니다. (${e.toString()}`);
    chrome.tabs.remove(newTab.id);

    return false;
  }

  productStore.addConsoleText(`(${shopName}) 업로드 완료`);
  chrome.tabs.remove(newTab.id);

  return true;
}

// 위메프 상품 등록해제
async function deleteWemakeprice(productStore: any, commonStore: any, data: any) {
  if (!data) {
    return false;
  }

  let newTab: any = {};
  let shopName = data.DShopInfo.site_name;

  console.log(`(${shopName}) 등록정보:`, data);

  try {
    let login_resp = await fetch("https://wpartner.wemakeprice.com/getLoginUser.json");
    let login_json = await login_resp.json();

    if (!login_json.userId) {
      productStore.addConsoleText(`(${shopName}) 파트너 로그인 실패`);
      notificationByEveryTime(`(${shopName}) 파트너 로그인 후 재시도 바랍니다.`);

      return false;
    }

    newTab = await createTabCompletely({ active: false, url: "https://wpartner.wemakeprice.com/" }, 10);

    if (!newTab.id) {
      productStore.addConsoleText(`(${shopName}) 위메프 접속 실패`);
      notificationByEveryTime(`(${shopName}) 위메프 접속에 실패하였습니다.`);

      return false;
    }

    if (login_json.userId !== commonStore.user.userInfo.wemakepriceId) {
      productStore.addConsoleText(`(${shopName}) 스토어 연동정보 확인 실패`);
      notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

      return false;
    }

    for (let product in data.DShopInfo.prod_codes) {
      try {
        let market_code = data.DShopInfo.prod_codes[product];
        let market_item = data.DShopInfo.DataDataSet.data[product];

        if (market_item.cert) {
          continue;
        }

        let productId = market_item.name2;

        if (!productId) {
          continue;
        }

        let deleteJson: any = await sendTabMessage(newTab.id, {
          action: "delete-B719",
          source: productId,
        });

        // const deleteResp = await fetch("https://wpartner.wemakeprice.com/product/setProdStatus.json", {
        //   headers: {
        //     accept: "application/json, text/javascript, */*; q=0.01",
        //     "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        //     "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        //     "sec-ch-ua": '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
        //     "sec-ch-ua-mobile": "?0",
        //     "sec-ch-ua-platform": '"Windows"',
        //     "sec-fetch-dest": "empty",
        //     "sec-fetch-mode": "cors",
        //     "sec-fetch-site": "same-origin",
        //     "x-requested-with": "XMLHttpRequest",
        //   },
        //   referrer: "https://wpartner.wemakeprice.com/product/prodMain",
        //   referrerPolicy: "strict-origin-when-cross-origin",
        //   body: `prodNo=${productId}&prodStatusActionPolicy=S`,
        //   method: "POST",
        //   mode: "cors",
        //   credentials: "include",
        // });

        // const deleteJson = await deleteResp.json();

        if (!deleteJson.errors) {
          const progressValue = Math.round(((parseInt(product) + 1) * 100) / data.DShopInfo.prod_codes.length);

          commonStore.setDisabledProgressValue(data.DShopInfo.site_code, progressValue);

          await gql(MUTATIONS.UNLINK_PRODUCT_STORE, {
            productId: market_item.id,
            siteCode: data.DShopInfo.site_code,
          });
        } else {
          if (deleteJson.errors[0].code === "1027") {
            const progressValue = Math.round(((parseInt(product) + 1) * 100) / data.DShopInfo.prod_codes.length);

            commonStore.setDisabledProgressValue(data.DShopInfo.site_code, progressValue);

            await gql(MUTATIONS.UNLINK_PRODUCT_STORE, {
              productId: market_item.id,
              siteCode: data.DShopInfo.site_code,
            });
          }
        }
      } catch (e: any) {
        notificationByEveryTime(`(${shopName}) 상품 등록해제 도중 오류가 발생하였습니다. (${e.toString()})`);

        chrome.tabs.remove(newTab.id);
        continue;
      }
    }
  } catch (e: any) {
    productStore.addConsoleText(`(${shopName}) 상품 등록해제 중단`);
    notificationByEveryTime(`(${shopName}) 상품 등록해제 도중 오류가 발생하였습니다. (${e.toString()})`);

    chrome.tabs.remove(newTab.id);
    return false;
  }
  chrome.tabs.remove(newTab.id);
  productStore.addConsoleText(`(${shopName}) 상품 등록해제 완료`);

  return true;
}

// 위메프 신규주문조회
async function newOrderWemakeprice(commonStore: any, shopInfo: any) {
  const shopName = shopInfo.name;

  if (!shopInfo.connected || shopInfo.disabled) {
    return [];
  }

  try {
    let login_resp = await fetch("https://wpartner.wemakeprice.com/getLoginUser.json");
    let login_json = await login_resp.json();

    if (!login_json.userId) {
      notificationByEveryTime(`(${shopName}) 파트너 로그인 후 재시도 바랍니다.`);

      return [];
    }

    if (login_json.userId !== commonStore.user.userInfo.wemakepriceId) {
      notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

      return [];
    }

    const startDate = getClockOffset(0, 0, -7, 0, 0, 0);
    const endDate = getClock();

    const orderResp = await fetch(
      `https://wpartner.wemakeprice.com/ship/getOrderInfoList.json?confirmShipNoStr=&schTotalFlag=&schDateType=orderDt&schStartDate=${startDate.YY}-${startDate.MM}-${startDate.DD}&schEndDate=${endDate.YY}-${endDate.MM}-${endDate.DD}&schShipStatus=D1&schShipMethod=&schDelayShipInfoYn=&schType=&schValue=&schLimitCnt=100&schPageNo=1`,
      {
        headers: {
          accept: "application/json, text/javascript, */*; q=0.01",
          "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "sec-ch-ua": '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer: "https://wpartner.wemakeprice.com/ship/orderMain",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    );

    const orderJson: any = await orderResp.json();

    console.log(shopName, orderJson);

    return orderJson.map((v: any) => {
      return {
        productId: v.prodNo,
        marketCode: shopInfo.code,
        marketName: shopInfo.name,
        taobaoOrderNo: null,
        productName: v.prodNm,
        productOptionContents: v.soptTitle,
        sellerProductManagementCode: v.sellerProdCd,
        orderNo: v.orderOptNo,
        orderQuantity: v.prodQty,
        orderMemberName: v.buyerNm,
        orderMemberTelNo: v.buyerPhone,
        productPayAmt: parseInt(v.prodPrice),
        deliveryFeeAmt: parseInt(v.shipPrice),
        individualCustomUniqueCode: v.personalOverseaNo,
        receiverName: v.receiverNm,
        receiverTelNo1: v.phone,
        receiverIntegratedAddress: `${v.addr1} ${v.addr2}`,
        receiverZipCode: v.zipcode,
        productOrderMemo: v.message,
        shipNo: v.shipNo,
      };
    });
  } catch (e) {
    console.log(shopName, e);

    return [];
  }
}

// 위메프 발주확인 처리
async function productPreparedWemakeprice(commonStore: any, shopInfo: any, props: any) {
  let productshipNo: any = [];
  if (props !== "" && props.item.marketCode === "B719") {
    productshipNo.push(props.item.shipNo);
  } else {
    return;
  }
  console.log("productshipNo", productshipNo);
  const shopName = shopInfo.name;
  if (!shopInfo.connected || shopInfo.disabled) {
    return [];
  }
  try {
    let login_resp = await fetch("https://wpartner.wemakeprice.com/getLoginUser.json");
    let login_json = await login_resp.json();
    console.log("login_json", login_json);
    if (!login_json.userId) {
      notificationByEveryTime(`(${shopName}) 파트너 로그인 후 재시도 바랍니다.`);
      return [];
    }

    if (login_json.userId !== commonStore.user.userInfo.wemakepriceId) {
      notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

      return [];
    }

    productshipNo.map(async (v: any) => {
      const orderResp = await fetch(`https://wpartner.wemakeprice.com/ship/setConfirmOrder.json?shipNo=${v}&_=${new Date().getTime()}`, {
        headers: {
          accept: "application/json, text/javascript, */*; q=0.01",
          "accept-language": "ko,en-US;q=0.9,en;q=0.8,ko-KR;q=0.7",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "sec-ch-ua": '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer: "https://wpartner.wemakeprice.com/ship/orderMain",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
      });

      const orderJson: any = await orderResp.json();
      console.log(orderJson);
    });
  } catch (e) {
    console.log(shopName, e);

    return [];
  }
}

// 위메프 발송처리주문조회
async function deliveryOrderWemakeprice(commonStore: any, shopInfo: any) {
  const shopName = shopInfo.name;

  if (!shopInfo.connected || shopInfo.disabled) {
    return [];
  }

  try {
    let login_resp = await fetch("https://wpartner.wemakeprice.com/getLoginUser.json");
    let login_json = await login_resp.json();

    if (!login_json.userId) {
      notificationByEveryTime(`(${shopName}) 파트너 로그인 후 재시도 바랍니다.`);

      return [];
    }

    if (login_json.userId !== commonStore.user.userInfo.wemakepriceId) {
      notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

      return [];
    }

    const startDate = getClockOffset(0, 0, -7, 0, 0, 0);
    const endDate = getClock();

    const orderResp = await fetch(
      `https://wpartner.wemakeprice.com/ship/getOrderInfoList.json?confirmShipNoStr=&schTotalFlag=&schDateType=orderDt&schStartDate=${startDate.YY}-${startDate.MM}-${startDate.DD}&schEndDate=${endDate.YY}-${endDate.MM}-${endDate.DD}&schShipStatus=D1&schShipMethod=&schDelayShipInfoYn=&schType=&schValue=&schLimitCnt=100&schPageNo=1`,
      {
        headers: {
          accept: "application/json, text/javascript, */*; q=0.01",
          "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "sec-ch-ua": '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer: "https://wpartner.wemakeprice.com/ship/orderMain",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    );

    const orderJson: any = await orderResp.json();

    console.log(shopName, orderJson);

    return orderJson.map((v: any) => {
      return {
        productId: v.prodNo,
        marketCode: shopInfo.code,
        marketName: shopInfo.name,
        taobaoOrderNo: null,
        productName: v.prodNm,
        productOptionContents: v.soptTitle,
        sellerProductManagementCode: v.sellerProdCd,
        orderNo: v.orderOptNo,
        orderQuantity: v.prodQty,
        orderMemberName: v.buyerNm,
        orderMemberTelNo: v.buyerPhone,
        productPayAmt: parseInt(v.prodPrice),
        deliveryFeeAmt: parseInt(v.shipPrice),
        individualCustomUniqueCode: v.personalOverseaNo,
        receiverName: v.receiverNm,
        receiverTelNo1: v.phone,
        receiverIntegratedAddress: `${v.addr1} ${v.addr2}`,
        receiverZipCode: v.zipcode,
        productOrderMemo: v.message,
        shipNo: v.shipNo,
      };
    });
  } catch (e) {
    console.log(shopName, e);

    return [];
  }
}

export {
  deleteWemakeprice2,
  editWemakeprice,
  uploadWemakeprice2,
  uploadWemakeprice,
  deleteWemakeprice,
  newOrderWemakeprice,
  productPreparedWemakeprice,
  deliveryOrderWemakeprice,
};
