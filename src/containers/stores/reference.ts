// 미사용 스토리지(키워드 추천)

import CryptoJS from "crypto-js";

import { runInAction, makeAutoObservable } from "mobx";
import { downloadExcel } from "../../pages/Tools/Common";

export class reference {
  searchInfo: any = {
    expose: 100,
    keyword: null,
    results: {
      naver: {
        dn: null,
        rt: null,
        ac: null,
      },

      coupang: {
        rt: null,
        ac: null,
      },

      street: {
        rt: null,
        ac: null,
      },

      gmarket: {
        rt: null,
        ac: null,
      },

      auction: {
        rt: null,
        ac: null,
      },

      interpark: {
        rt: null,
        ac: null,
      },

      wemakeprice: {
        rt: null,
        ac: null,
      },

      lotteon: {
        rt: null,
        ac: null,
      },

      tmon: {
        rt: null,
        ac: null,
      },
    },
    saveAuto: "N",
    progress: 0,
  };

  constructor() {
    makeAutoObservable(this);
  }

  setSearchInfo = (value: number) => {
    this.searchInfo = value;
  };

  searchKeyword = async () => {
    this.setSearchInfo({
      ...this.searchInfo,

      progress: 0,
    });

    if (!this.searchInfo.keyword) {
      alert("키워드를 입력해주세요.");

      return;
    }

    let refer_body = {
      method: "GET",
      path: "https://api.naver.com",
      query: "/keywordstool",
      params: `?hintKeywords=${encodeURI(this.searchInfo.keyword)}&showDetail=1`,
      data: {},
    };

    let now = new Date().getTime();

    const accesskey = "01000000002bb6eefe11996a564314121b57c8d70cf7435ccf640f458eb5094e4eba6a0696";
    const secretkey = "AQAAAAArtu7+EZlqVkMUEhtXyNcMIRQiJOWkR0m3rzMeoViXyw==";
    const base_str = `${now}.${refer_body.method}.${refer_body.query}`;
    const signature = CryptoJS.HmacSHA256(base_str, secretkey).toString(CryptoJS.enc.Base64);

    let naverDNHeader: any = {
      "X-Timestamp": now,
      "X-API-KEY": accesskey,
      "X-Customer": "2356466",
      "X-Signature": signature,
    };

    let naverDNResp = await fetch(`${refer_body.path}${refer_body.query}${refer_body.params}`, {
      headers: naverDNHeader,
    });

    let naverDNJson = await naverDNResp.json();
    let naverDNData = naverDNJson.keywordList.slice(0, 30).map((v) => v.relKeyword);

    let naverRTResp = await fetch(`https://search.shopping.naver.com/search/all?query=${this.searchInfo.keyword}`);
    let naverRTText = await naverRTResp.text();
    let naverRTHtml = new DOMParser().parseFromString(naverRTText, "text/html");
    let naverRTElem: any = naverRTHtml.querySelector("#__NEXT_DATA__");
    let naverRTJson = JSON.parse(naverRTElem.innerText);
    let naverRTData = naverRTJson.props.pageProps.initialState.relatedTags;

    let naverACResp = await fetch(
      `https://ac.shopping.naver.com/ac?frm=shopping&q=${encodeURI(
        this.searchInfo.keyword
      )}&q_enc=UTF-8&r_cr=110111&r_enc=UTF-8&r_format=json&r_lt=110111&r_unicode=0&st=110111&t_koreng=1`
    );
    let naverACJson = await naverACResp.json();
    let naverACData = naverACJson.items[1].map((v) => v[0]);

    let coupangRTResp = await fetch(`https://www.coupang.com/np/search?component=&q=${encodeURI(this.searchInfo.keyword)}&channel=user`);
    let coupangRTText = await coupangRTResp.text();
    let coupangRTHtml = new DOMParser().parseFromString(coupangRTText, "text/html");
    let coupangRTList = coupangRTHtml.querySelectorAll("head > meta");
    let coupangRTData: any = [];

    for (let i in coupangRTList) {
      try {
        if (coupangRTList[i].getAttribute("name") === "description") {
          let refContent: any = coupangRTList[i].getAttribute("content");
          let refContentList = refContent.split(",");

          for (let j = 0; j < refContentList.length; j++) {
            let refData = "";

            if (j === 0) {
              refData = refContentList[j].split(".")[1].trim();
            } else {
              refData = refContentList[j].trim();
            }

            if (refData.length > 0) {
              coupangRTData.push(refData);
            }
          }

          break;
        }
      } catch (e) {
        continue;
      }
    }

    let coupangACResp = await fetch(`https://www.coupang.com/np/search/autoComplete?callback=&keyword=${encodeURI(this.searchInfo.keyword)}`);
    let coupangACText = await coupangACResp.text();
    let coupangACJson = JSON.parse(coupangACText.slice(1, coupangACText.length - 1));
    let coupangACData = coupangACJson.map((v) => v.keyword);

    // let streetRTResp = await fetch(`https://search.11st.co.kr/Search.tmall?kwd=${encodeURI(encodeURI(sfyReference.value))}`, {
    //     "headers": {
    //         "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    //         "accept-language": "ko,ko-KR;q=0.9,en-US;q=0.8,en;q=0.7",
    //         "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"100\", \"Google Chrome\";v=\"100\"",
    //         "sec-ch-ua-mobile": "?0",
    //         "sec-ch-ua-platform": "\"Windows\"",
    //         "sec-fetch-dest": "document",
    //         "sec-fetch-mode": "navigate",
    //         "sec-fetch-site": "same-site",
    //         "sec-fetch-user": "?1",
    //         "upgrade-insecure-requests": "1"
    //     },
    //     "referrer": "https://www.11st.co.kr/",
    //     "referrerPolicy": "strict-origin-when-cross-origin",
    //     "body": null,
    //     "method": "GET",
    //     "mode": "cors",
    //     "credentials": "include"
    // });

    // let streetRTText = await streetRTResp.text();
    // let streetRTHtml = new DOMParser().parseFromString(streetRTText, 'text/html');
    // let streetRTList = streetRTHtml.querySelectorAll('body script');
    let streetRTData = [];

    let streetACResp = await fetch(
      `https://www.11st.co.kr/AutoCompleteAjaxAction.tmall?method=getAutoCompleteJson&q=${encodeURI(encodeURI(this.searchInfo.keyword))}&callback=`
    );
    let streetACText = await streetACResp.text();
    // let streetACJson = JSON.parse(streetACText.slice(1, streetACText.length - 1));
    // let streetACData = streetACJson.autoKeyword.map(v => v.KEYWORD);
    let streetACData = [];

    let gmarketRTResp = await fetch(`http://browse.gmarket.co.kr/search?keyword=${encodeURI(this.searchInfo.keyword)}`);
    let gmarketRTText = await gmarketRTResp.text();
    let gmarketRTHtml: any = new DOMParser().parseFromString(gmarketRTText, "text/html");
    let gmarketRTVars = gmarketRTHtml.querySelector("#initial-state").innerHTML;
    let gmarketRTJson = JSON.parse(gmarketRTVars.slice(29, gmarketRTVars.length));
    let gmarketRTData = gmarketRTJson.regions[1].modules[0].rows[0].viewModel.keywordList.map((v) => v.text);

    let gmarketACResp = await fetch(`https://frontapi.gmarket.co.kr/autocompleteV2/kr/json/${encodeURI(this.searchInfo.keyword)}`);
    let gmarketACJson = await gmarketACResp.json();
    let gmarketACData = gmarketACJson.Data.map((v) => v.Keyword);

    let auctionRTResp = await fetch(`http://browse.auction.co.kr/search?keyword=${encodeURI(this.searchInfo.keyword)}`);
    let auctionRTText = await auctionRTResp.text();
    let auctionRTHtml: any = new DOMParser().parseFromString(auctionRTText, "text/html");
    let auctionRTVars = auctionRTHtml.querySelector("#initial-state").innerHTML;
    let auctionRTJson = JSON.parse(auctionRTVars.slice(29, gmarketRTVars.length));
    let auctionRTData = auctionRTJson.regions[1].modules[0].rows[0].viewModel.keywordList.map((v) => v.text);

    let auctionACResp = await fetch("http://suggest.auction.co.kr/Suggest/SuggestWebService.asmx", {
      headers: {
        "content-type": "text/xml; charset=UTF-8",
        soapaction: '"ns/GetKeywordSuggest"',
      },
      body: `<?xml version='1.0' encoding='utf-8'?><soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'><soap:Body><GetKeywordSuggest xmlns='ns'><keywordHint>${encodeURI(
        this.searchInfo.keyword
      )}</keywordHint></GetKeywordSuggest></soap:Body></soap:Envelope>`,
      method: "POST",
    });

    let auctionACText = await auctionACResp.text();
    let auctionACXml = new DOMParser().parseFromString(auctionACText, "text/xml");
    let auctionACList = auctionACXml.getElementsByTagName("KeywordContents");
    let auctionACData: any = [];

    for (let i = 0; i < auctionACList.length; i++) {
      let keyword = auctionACList[i].getAttribute("Keyword");

      if (keyword) {
        auctionACData.push(keyword);
      }
    }

    let interparkRTResp = await fetch(`http://shopapi.interpark.com/niSearch/common/listRelatedKeyword.json?keyword=${encodeURI(this.searchInfo.keyword)}`);
    let interparkRTJson = await interparkRTResp.json();
    let interparkRTData = interparkRTJson.data.listRelatedKeyword;

    let interparkACResp = await fetch(`http://shop-searchcloud.interpark.com/autocmpl/select?res.euckr=false&q=${encodeURI(this.searchInfo.keyword)}`);
    let interparkACJson = await interparkACResp.json();
    let interparkACData = interparkACJson.all.map((v) => v.searchquery_raw);

    let wemakepRTResp = await fetch(
      `https://search.wemakeprice.com/api/wmpsearch/api/v3.0/wmp-search/search.json?keyword=${encodeURI(this.searchInfo.keyword)}`
    );
    let wemakepRTJson = await wemakepRTResp.json();
    let wemakepRTData = wemakepRTJson.data.relationKeyword;

    let wemakepACResp = await fetch(`https://front.wemakeprice.com/api/wmpsuggest/api_auto_search.json?os=pc&q=${encodeURI(this.searchInfo.keyword)}`);
    let wemakepACJson = await wemakepACResp.json();
    let wemakepACData = wemakepACJson.result_set.keywords;

    let tmonRTResp = await fetch(`https://search.tmon.co.kr/api/search/v4/deals?keyword=${encodeURI(this.searchInfo.keyword)}`);
    let tmonRTJson = await tmonRTResp.json();
    let tmonRTData = tmonRTJson.data.extraSearchResultInfo.relativeKeywords.map((v) => v.keyword);

    let tmonACResp = await fetch(
      `https://www.tmon.co.kr/api/direct/v1/searchextra2api/api/search/autocomplete/v2/pc?keyword=${encodeURI(this.searchInfo.keyword)}`
    );
    let tmonACJson = await tmonACResp.json();
    let tmonACData = tmonACJson.data.suggestKeywords.map((v) => v.suggestKeyword);

    let lotteonRTResp = await fetch(
      `https://www.lotteon.com/search/search/search.ecn?render=search&platform=pc&q=${encodeURI(this.searchInfo.keyword)}&mallId=1`
    );
    let lotteonRTText = await lotteonRTResp.text();
    let lotteonRTHtml = new DOMParser().parseFromString(lotteonRTText, "text/html");
    let lotteonRTList = lotteonRTHtml.getElementsByClassName("srchKeywordBox")[0].querySelectorAll("a");
    let lotteonRTData: any = [];

    for (let i in lotteonRTList) {
      try {
        if (lotteonRTList[i].getAttribute("class") === "srchKeyword") {
          lotteonRTData.push(lotteonRTList[i].innerText.trim());
        }
      } catch (e) {
        continue;
      }
    }

    let lotteonACResp = await fetch(`https://www.lotteon.com/search/api/v3/autoComplete.ecn?q=${encodeURI(this.searchInfo.keyword)}&mallCode=LTON`);
    let lotteonACJson = await lotteonACResp.json();
    let lotteonACData = lotteonACJson.result.keyword.map((v) => v.keyword);

    console.log(this.searchInfo.results);

    runInAction(() => {
      this.searchInfo.results.naver.dn = naverDNData;
      this.searchInfo.results.naver.rt = naverRTData;
      this.searchInfo.results.naver.ac = naverACData;
      this.searchInfo.results.coupang.rt = coupangRTData;
      this.searchInfo.results.coupang.ac = coupangACData;
      this.searchInfo.results.street.rt = streetRTData;
      this.searchInfo.results.street.ac = streetACData;
      this.searchInfo.results.gmarket.rt = gmarketRTData;
      this.searchInfo.results.gmarket.ac = gmarketACData;
      this.searchInfo.results.auction.rt = auctionRTData;
      this.searchInfo.results.auction.ac = auctionACData;
      this.searchInfo.results.interpark.rt = interparkRTData;
      this.searchInfo.results.interpark.ac = interparkACData;
      this.searchInfo.results.wemakeprice.rt = wemakepRTData;
      this.searchInfo.results.wemakeprice.ac = wemakepACData;
      this.searchInfo.results.lotteon.rt = lotteonRTData;
      this.searchInfo.results.lotteon.ac = lotteonACData;
      this.searchInfo.results.tmon.rt = tmonRTData;
      this.searchInfo.results.tmon.ac = tmonACData;
    });

    // let keywordList = document.getElementsByClassName('keywordItem');

    // for (let i = 0; i < keywordList.length; i++) {
    //     keywordList[i].addEventListener('click', (e) => {
    //         let keyword = e.target.innerText.replaceAll(" ", "");
    //         let keywordString = sfyReferenceResultText.value.replaceAll(" ", "");

    //         let checkList = keywordString.split(",")
    //         let checked = false;

    //         for (let i = 0; i < checkList.length; i++) {
    //             if (checkList[i] === "") {
    //                 continue;
    //             }

    //             if (checkList[i] === keyword) {
    //                 checked = true;

    //                 break;
    //             }
    //         }

    //         if (!checked) {
    //             sfyReferenceResultText.value += `${keyword}, `;

    //             for (let j = 0; j < keywordList.length; j++) {
    //                 str1 = keywordList[j].innerText.replaceAll(" ", "");
    //                 str2 = e.target.innerText.replaceAll(" ", "");

    //                 if (str1 === str2) {
    //                     keywordList[j].className = "keywordItem selected";
    //                 }
    //             }
    //         }
    //     })
    // }
  };

  download = () => {
    if (this.searchInfo.results.length <= 0) {
      alert("분석 결과를 찾을 수 없습니다.");

      return 0;
    }

    downloadExcel(this.searchInfo.results, `키워드분석`, `키워드분석`, false, "xlsx");
  };
}
