// 백그라운드 서비스워커 구현 시 주의사항
// 1) 기본적으로 구문이 5분 이상 유휴상태일 경우 비활성화됨
// 2) while문 또는 5분 이상 소요될 수 있는 지연 응답에 대한 구현 금지 (오류 추적이 어렵고, 메시지 채널이 닫히면 기능이 멈춤)

import QUERIES from "../Main/GraphQL/Queries";
import MUTATIONS from "../Main/GraphQL/Mutations";
import gql from "../Main/GraphQL/Requests";
import papagoTranslation from "../Tools/Translation";

import { coupangApiGateway } from "../Tools/Coupang";
import { createTabCompletely, getLocalStorage, queryTabs, sendTabMessage, setLocalStorage } from "../Tools/ChromeAsync";
import { getRandomIntInclusive } from "../Tools/Common";

// 티몰 상세페이지 요청 시 CORS 이슈 발생
// 이를 해결하기 위해 서비스워커에서 처리하지 않고 메시지 채널로 콘텐츠 스크립트에서 처리하도록 구현
// 티몰에 상품 수집하려고 페이지 들어가면 탭이 생겼다가 사라지는게 이 기능
async function tmallCORS(url) {
  const tab = await createTabCompletely({ active: false, url }, 5);
  const res = await sendTabMessage(tab.id, { action: "fetch", source: url });

  chrome.tabs.remove(tab.id);

  return res;
}

// 수집 정보를 탭별로 구분하여 로컬스토리지에 저장
// 서비스워커가 죽더라도 페이지 새로고침으로 중단된 지점으로부터 되살릴 수 있음
async function addBulkInfo(source: any, sender: any, isExcel: boolean) {
  const tabs: any = await queryTabs({});

  let bulkInfo: any = (await getLocalStorage("bulkInfo")) ?? [];

  bulkInfo = bulkInfo.filter((v: any) => {
    if (v.sender.tab.id === sender.tab.id) {
      if (source.retry) {
        sender = v.sender;
      }

      return false;
    }

    const matched = tabs.find((w: any) => w.id === v.sender.tab.id);

    if (!matched) {
      return false;
    }

    return true;
  });

  bulkInfo.push({
    current: 0,
    currentPage: 1,

    inputs: source.data,

    isBulk: true,
    isCancel: false,
    isComplete: false,
    isExcel,

    results: [],

    sender,
  });

  await setLocalStorage({ bulkInfo: bulkInfo });

  return await bulkNext(sender);
}

// 상품 데이터 가공
// onebound에는 상품 원본 데이터에 대한 정보, sellforyou에는 번역 데이터에 대한 정보
async function addToInventory(sender: any, origin: any) {
  // 상품 수집 실패 시
  if (origin.error) {
    return await finishCollect(sender, "failed", origin.error);
  }
  // 대량 수집 시 (대량수집 시) 설정해둔 값들을 불러 옴
  let collectInfo: any = (await getLocalStorage("collectInfo")) ?? [];
  let collect = collectInfo.find((v: any) => v.sender.tab.id === sender.tab.id);
  if (collect && collect.useStandardShipping) {
    if (origin.item.shop_id === "express" && !origin.item.props.find((v) => v.name === "AliExpress Standard Shipping")) {
      return await finishCollect(sender, "failed", "스탠다드 쉬핑 불가 상품입니다."); // finish로 그냥 에러내서 끝내버림 . skip 해버림.
    }
  }

  // 번역 데이터 초기화
  let result: any = {
    data: [
      {
        attr: {},
        taobaoNumIid: "",
        title: "",
        optionName: [],
        optionValue: [],
        video: "",
        description: "",
        isTranslated: false,
      },
    ],
  };

  // 번역 사전 생성
  let textdict: any = {};

  // 상품 속성정보 중 불필요한 문자열을 제거하고 번역 사전에 넣음
  origin.item.attr = origin.item.attr.map((v: any) => {
    const filtered = v.replace(/&.+;/, "");

    textdict[filtered] = filtered;

    return filtered;
  });

  // HTML특수문자(&nbsp; &amp;) 제거
  origin.item.title = origin.item.title.replace(/&.*;/, "");

  // * => X 처리
  origin.item.title = origin.item.title.replace(/[*]/gi, "x");

  // \ ? " < > => 공백 처리
  origin.item.title = origin.item.title.replace(/[\\\?\"<>,&]/gi, " ");

  // 아마존 또는 상품명이 중문이 아닌 경우 번역이 필요없음
  if (origin.item.shop_id.includes("amazon") || origin.item.title.replace(/[^\u4e00-\u9fff]/g, "").length > 0) {
    textdict[origin.item.title] = origin.item.title;
  }

  result.data[0].title = origin.item.title;

  let option_name: any = {};
  let option_value: any = {};

  // 옵션 정보를 순회하면서 데이터 가공 후 새로운 객체에 할당
  for (let i in origin.item.props_list) {
    let id = i.split(":");
    let options = origin.item.props_list[i].split(":");

    for (let j in options) {
      // * => X 처리
      options[j] = options[j].replace(/[*]/gi, "x");

      // \ / : * ? " < > => 공백 처리
      options[j] = options[j].replace(/[\\\?\"<>,]/gi, " ");

      // 아마존 또는 상품명이 중문이 아닌 경우 번역이 필요없음
      if (origin.item.shop_id.includes("amazon") || options[j].replace(/[^\u4e00-\u9fff]/g, "").length > 0) {
        textdict[options[j]] = options[j];
      }
    }

    option_name[id[0]] = options[0];
    option_value[i] = options[1];
  }

  // 옵션타입을 순회하면서 기본 데이터 생성
  for (let i in option_name) {
    result.data[0].optionName.push({
      taobaoPid: i,
      name: option_name[i],
    });
  }

  // 옵션값을 순회하면서 기본 데이터 생성
  for (let i in option_value) {
    let id = i.split(":");

    result.data[0].optionValue.push({
      taobaoPid: id[0],
      taobaoVid: id[1],
      name: option_value[i],
    });
  }

  // 상세페이지 텍스트도 번역 사전에 추가
  origin.item.desc_text.map((v: any) => {
    textdict[v] = v;
  });

  // 상품속성, 상세페이지, 타오바오상품ID, 동영상 설정
  result.data[0].attr = origin.item.attr;
  result.data[0].description = origin.item.desc;
  result.data[0].taobaoNumIid = origin.item.num_iid;
  result.data[0].video = origin.item.video;

  // 소싱처에 따른 번역 시작-끝 언어 설정
  // 1) 구문 실행 전 textdict에는 [원문]:[원문]으로 초기화 되어 있음
  // 2) 구문 실행 후 textdict에는 [원문]:[번역문] 형식으로 바뀜
  switch (origin.item.shop_id) {
    case "express": {
      break;
    }

    case "amazon-us": {
      textdict = await papagoTranslation(textdict, "en", "ko", null);

      break;
    }

    case "amazon-jp": {
      textdict = await papagoTranslation(textdict, "ja", "ko", null);

      break;
    }

    case "amazon-de": {
      textdict = await papagoTranslation(textdict, "de", "ko", null);

      break;
    }

    default: {
      textdict = await papagoTranslation(textdict, "zh-CN", "ko", null);

      break;
    }
  }

  if (textdict) {
    // 2)의 과정이 수행되는 구간 (사전을 순회하면서 실제 번역결과로 교체)
    for (let i in textdict) {
      try {
        if (origin.item.title === i) {
          result.data[0].title = origin.item.title.replaceAll(i, textdict[i]);
        }

        for (let j in result.data[0].optionName) {
          try {
            if (result.data[0].optionName[j].name === i) {
              result.data[0].optionName[j].name = result.data[0].optionName[j].name.replaceAll(i, textdict[i]);
            }
          } catch (e) {
            continue;
          }
        }

        for (let j in result.data[0].optionValue) {
          try {
            if (result.data[0].optionValue[j].name === i) {
              result.data[0].optionValue[j].name = result.data[0].optionValue[j].name.replaceAll(i, textdict[i]);
            }
          } catch (e) {
            continue;
          }
        }

        for (let j in result.data[0].attr) {
          try {
            if (result.data[0].attr[j] === i) {
              result.data[0].attr[j] = result.data[0].attr[j].replaceAll(i, textdict[i]);
            }
          } catch (e) {
            continue;
          }
        }

        result.data[0].description = result.data[0].description.replaceAll(i, textdict[i]);
      } catch (e) {
        continue;
      }
    }
  }

  // 상품 수집을 진행한 탭에서 수집 환경설정을 가져옴
  let bulkInfo: any = (await getLocalStorage("bulkInfo")) ?? [];
  let bulk = bulkInfo.find((v: any) => v.sender.tab.id === sender.tab.id);

  // 엑셀파일 수집이라면 상품명과 검색어태그는 엑셀파일에 입력한 정보로 변경
  if (bulk && bulk.isExcel) {
    const fixed = bulk.inputs.find((v: any) => v.url.includes(origin.item.num_iid));

    if (fixed) {
      origin.item.nick = fixed.productName;
      origin.item.desc_short = fixed.productTags;
    }
  }

  // origin.item.nick 데이터가 상품명 우선순위를 가짐
  let productName = result.data[0].title;

  if (origin.item.nick) {
    productName = origin.item.nick;
  }

  // 셀포유 유저정보를 불러옴
  const userJson = await gql(QUERIES.SELECT_MY_INFO_BY_USER, {}, false);

  // 유저정보를 가져오지 못했을 경우 수집 실패로 분류
  if (userJson.errors) {
    return await finishCollect(sender, "failed", userJson.errors[0].message);
  }
  //개인분류 대량수집 데이터
  if (collect && collect.myKeyward) {
    origin.item.myKeyward = collect.myKeyward.replace(/\s/g, "");
    result.data[0].myKeyward = collect.myKeyward.replace(/\s/g, "");
  }
  // 카테고리 사전설정 데이터 가져오기 (카테고리 수동설정)
  if (!collect || !collect.categoryId) {
    // 카테고리 사전설정값이 없는 경우 쿠팡 API를 통해 카테고리를 추천받음

    let accesskey = userJson.data.selectMyInfoByUser.userInfo.coupangAccessKey;
    let secretkey = userJson.data.selectMyInfoByUser.userInfo.coupangSecretKey;

    if (accesskey === "" && secretkey === "") {
      accesskey = "d3087930-fdd7-490e-aa06-da32f79cc9c2";
      secretkey = "5d4e2bce5dd8337285b634100c6a198d1b31327a";
    }

    let categoryJson = await coupangApiGateway({
      accesskey: accesskey,
      secretkey: secretkey,

      path: `/v2/providers/openapi/apis/api/v1/categorization/predict`,
      query: "",
      method: "POST",

      data: {
        productName: productName,
      },
    });

    if (categoryJson.code.ERROR || categoryJson.data.autoCategorizationPredictionResultType !== "SUCCESS") {
      return await finishCollect(sender, "failed", "카테고리 설정 도중 오류가 발생하였습니다.");
    }

    origin.item.cid = categoryJson.data.predictedCategoryId;
  } else {
    // 카테고리 사전설정값이 있는 경우 해당 카테고리번호를 할당

    origin.item.nid = collect.categoryId;
  }

  // 브랜드, 제조사, 모델명 자동할당
  origin.item.brand = result.data[0].attr.find((v: any) => v.split(":")[0].includes("브랜드"))?.split(":")[1] ?? "";
  origin.item.manufacturer = result.data[0].attr.find((v: any) => v.split(":")[0].includes("근원") || v.split(":")[0].includes("생산지"))?.split(":")[1] ?? "";
  origin.item.modelName = result.data[0].attr.find((v: any) => v.split(":")[0].includes("모델"))?.split(":")[1] ?? "";

  // 대표이미지 순서바꾸기 기능
  let src = parseInt(origin.user.userInfo.thumbnailRepresentNo) - 1;

  if (src > origin.item.item_imgs.length - 1) {
    src = origin.item.item_imgs.length - 1;
  } else if (src < 0) {
    src = getRandomIntInclusive(1, origin.item.item_imgs.length - 1);
  }

  if (src !== 0) {
    const temp = [...origin.item.item_imgs];

    temp[src] = origin.item.item_imgs[0];
    temp[0] = origin.item.item_imgs[src];

    origin.item.item_imgs = temp;
  }

  result.data[0].attr = JSON.stringify(result.data[0].attr);
  console.log("origin", origin);
  console.log(result);

  // 최종 가공 데이터를 백엔드에 보내서 DB에 추가하도록 요청
  const response = await gql(
    MUTATIONS.GET_TAOBAO_ITEM_USING_EXTENSION_BY_USER,
    {
      data: JSON.stringify({
        onebound: origin,
        sellforyou: result,
      }),
    },
    false
  );

  // 처리과정에 문제가 있는 경우 상품 수집 실패
  if (response.errors) {
    return await finishCollect(sender, "failed", response.errors[0].message);
  }

  const message = response.data.getTaobaoItemUsingExtensionByUser;

  // 응답에 따른 상품 수집 성공/실패 여부 처리
  return await finishCollect(sender, message.includes("상품 수집이 완료되었습니다.") ? "success" : "failed", message);
}

// 대량수집 다음 페이지 넘기기
async function bulkNext(sender) {
  let bulkInfo: any = (await getLocalStorage("bulkInfo")) ?? [];
  let bulk = bulkInfo.find((v: any) => v.sender.tab.id === sender.tab.id);

  if (!bulk) {
    return false;
  }

  if (bulk.isCancel || bulk.current === bulk.inputs.length) {
    // 대량수집을 중단했거나 마지막 페이지까지 수집한 경우
    bulk.isBulk = false;

    const tabs: any = await queryTabs({
      url: chrome.runtime.getURL("product/collected.html"),
    });

    // 상품목록 리프레쉬
    tabs.map((v: any) => {
      sendTabMessage(v.id, { action: "refresh" });
    });

    // 상품 수집 완료 알림
    sendTabMessage(bulk.sender.tab.id, {
      action: "collect-finish",
      source: bulk,
    });
  } else {
    // 대량수집이 진행 중인 경우
    const url = /^https?:/.test(bulk.inputs[bulk.current].url) ? bulk.inputs[bulk.current].url : "https:" + bulk.inputs[bulk.current].url;

    // 다음 페이지로 업데이트
    chrome.tabs.update(bulk.sender.tab.id, { url });

    bulk.current += 1;
  }

  // 변경 정보 업데이트
  await setLocalStorage({ bulkInfo: bulkInfo });

  return true;
}

// 대량수집 중단 버튼 클릭 시
async function bulkStop(sender) {
  let bulkInfo: any = (await getLocalStorage("bulkInfo")) ?? [];
  let bulk = bulkInfo.find((v: any) => v.sender.tab.id === sender.tab.id);

  if (!bulk) {
    return false;
  }

  bulk.isCancel = true;

  await setLocalStorage({ bulkInfo: bulkInfo });

  return true;
}

// 수집 종료 시(성공/실패)
async function finishCollect(sender: any, status: string, statusMessage: string) {
  let bulkInfo: any = (await getLocalStorage("bulkInfo")) ?? [];
  let bulk = bulkInfo.find((v: any) => v.sender.tab.id === sender.tab.id);

  if (bulk) {
    bulk.isComplete = true;
    bulk.results.push({
      checked: true,

      status,
      statusMessage,

      input: bulk.inputs[bulk.results.length],
    });

    await setLocalStorage({ bulkInfo: bulkInfo });
  }

  return { status, statusMessage };
}

// 유저 정보 가져오기, 에러나는 경우 로그인 유도
async function getUserInfo() {
  const response = await gql(QUERIES.SELECT_MY_INFO_BY_USER, {}, false);

  if (!response.data && !response.errors) {
    return null;
  }

  if (response.errors) {
    await createTabCompletely({ active: true, url: "/signin.html" }, 10);

    return null;
  }

  return response.data.selectMyInfoByUser;
}

// 대량 수집 중인지
async function isBulk(sender) {
  let bulkInfo: any = (await getLocalStorage("bulkInfo")) ?? [];
  let bulk = bulkInfo.find((v: any) => v.sender.tab.id === sender.tab.id);

  if (!bulk) {
    return false;
  }

  return bulk.isBulk;
}

// 확장 프로그램 메시지 터널
// 지연 응답 (시간이 걸리는 작업이 있을 경우) 반드시 RETURN TRUE로 해야함 안그러면 메시지 보내고 바로 닫음 EX) BREAK;
// 확장프로그램에서 async/await 지원 안하므로 구문 사용 금지 (Promise로 구현)
// 사용법 예시 addToInventory 함수를 외부에 async로 선언 후 promise 형태로 await (x) .then()형태로 사용해야함
// 안에서 async/ await 지원 안함
chrome.runtime.onMessage.addListener((request, sender: any, sendResponse) => {
  switch (request.action) {
    // 상품 수집 액션
    case "collect": {
      addToInventory(sender, request.source).then(sendResponse);

      return true;
    }

    // 대량 수집 액션
    case "collect-bulk": {
      addBulkInfo(request.source, sender, false).then(sendResponse);

      return true;
    }

    // 엑셀 수집 액션
    case "collect-product-excel": {
      addBulkInfo(request.source, sender, true).then(sendResponse);

      return true;
    }

    // 상품 수집 완료
    case "collect-finish": {
      bulkNext(sender).then(sendResponse);

      return true;
    }

    // 상품 수집 중지
    case "collect-stop": {
      bulkStop(sender).then(sendResponse);

      return true;
    }

    // 대량 수집 여부 확인
    case "is-bulk": {
      isBulk(sender).then(sendResponse);

      return true;
    }

    // 메시지를 보낸 탭 정보 확인
    case "tab-info": {
      sendResponse(sender);

      break;
    }

    // 열려있는 모든 탭 정보 확인
    case "tab-info-all": {
      queryTabs({}).then(sendResponse);

      return true;
    }

    // 유저 정보 전달
    case "user": {
      getUserInfo().then(sendResponse);

      return true;
    }

    // 타오바오 상세페이지 데이터 요청
    case "description": {
      fetch(request.source)
        .then((res) => res.text())
        .then(sendResponse);

      return true;
    }

    // 티몰 상세페이지 데이터 요청
    case "fetch": {
      tmallCORS(request.source).then(sendResponse);

      return true;
    }

    default:
      break;
  }
});
