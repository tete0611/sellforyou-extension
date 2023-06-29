// 소싱기 스토리지

import QUERIES from '../../pages/Main/GraphQL/Queries';
import gql from '../../pages/Main/GraphQL/Requests';

import { runInAction, makeAutoObservable } from 'mobx';
import { getClock, getClockOffset, readFileBinary, sortBy, stringToArrayBuffer } from '../../pages/Tools/Common';

var XLSX = require('xlsx');

export class sourcing {
  searchInfo: any = {
    catId: '',
    query: '',

    dateStart: null,
    dateEnd: null,

    purchaseCnt: 0,
    reviewCount: 0,
    keepCnt: 0,

    maxLimits: 10,

    productSet: 'overseas',
    sort: 'review',

    includePlatinum: true,
    includePremium: true,
    includeBigPower: true,
    includePower: true,
    includePlant: true,
    includeSeed: true,

    exceptAliExpress: true,
    exceptCoupang: true,
    exceptQooten: true,

    progress: 0,
  };

  result: any = [];

  categoryInfo: any = {
    data: [],

    input: '',
    info: {
      code: null,
      name: '',
    },

    loading: false,
  };

  constructor() {
    makeAutoObservable(this);
  }

  // 네이버 카테고리 조회
  getCategoryList = async () => {
    if (this.categoryInfo.data.length > 0) {
      return;
    }

    this.categoryInfo.loading = true;

    let categories: any = await gql(QUERIES.SEARCH_CATEGORY_INFO_A077_BY_SOMEONE, {}, false);

    if (categories.errors) {
      return;
    }

    this.categoryInfo.data = categories.data.searchCategoryInfoA077BySomeone;
    this.categoryInfo.loading = false;
  };

  // 카테고리 입력정보
  setCategoryInput = (value: string) => {
    this.categoryInfo.input = value;
  };

  // 카테고리 설정정보
  setCategoryInfo = (value: any) => {
    this.categoryInfo.info = value;

    this.searchInfo.catId = value.code;
  };

  // 검색정보
  setSearchInfo = (data: any) => {
    this.searchInfo = data;
  };

  // 네이버쇼핑 상품검색
  searchProduct = async (e: any) => {
    let url: any;
    let urlParams: any = {
      catId: this.searchInfo.catId,
      frm: 'NVSHOVS',
      pagingIndex: 0,
      pagingSize: 80,
      productSet: this.searchInfo.productSet,
      query: this.searchInfo.query,
      sort: this.searchInfo.sort,
      viewType: 'list',
    };

    if (!urlParams.catId) {
      if (!urlParams.query) {
        alert('카테고리 또는 상품명을 입력해주세요.');

        return 0;
      }

      url = new URL('https://search.shopping.naver.com/search/all?');
    } else {
      if (!urlParams.query) {
        url = new URL('https://search.shopping.naver.com/search/category?');
      } else {
        url = new URL('https://search.shopping.naver.com/search/all?');
      }
    }

    let result: any = [];

    if (!this.searchInfo.dateStart) {
      const time = getClockOffset(0, -1, 0, 0, 0, 0);

      this.searchInfo.dateStart = `${time.YY}${time.MM}${time.DD}`;
    }

    if (!this.searchInfo.dateEnd) {
      const time = getClock();

      this.searchInfo.dateEnd = `${time.YY}${time.MM}${time.DD}`;
    }

    while (result.length < this.searchInfo.maxLimits) {
      if (urlParams.pagingIndex === 20) {
        break;
      }

      urlParams.pagingIndex += 1;
      url.search = new URLSearchParams(urlParams).toString();

      let sourceResp = await fetch(url);
      let sourceText = await sourceResp.text();
      let sourceHtml = new DOMParser().parseFromString(sourceText, 'text/html');
      let sourceElem: HTMLElement | null = sourceHtml.querySelector('#__NEXT_DATA__');
      let sourceJson = JSON.parse(sourceElem?.innerText ?? '{}');

      let products = sourceJson.props.pageProps.initialState.products.list;

      await Promise.all(
        products.map(async (v: any) => {
          if (
            parseInt(v.item.purchaseCnt) < this.searchInfo.purchaseCnt ||
            parseInt(v.item.reviewCount) < this.searchInfo.reviewCount ||
            parseInt(v.item.keepCnt ?? 0) < this.searchInfo.keepCnt ||
            parseInt(v.item.openDate) < parseInt(`${this.searchInfo.dateStart}000000`) ||
            parseInt(v.item.openDate) > parseInt(`${this.searchInfo.dateEnd}235959`) ||
            (v.item.mallName === 'aliexpress' && this.searchInfo.exceptAliExpress) ||
            (v.item.mallName === '쿠팡' && this.searchInfo.exceptCoupang) ||
            (v.item.mallName === 'Qoo10' && this.searchInfo.exceptQooten)
          ) {
            return;
          }

          let imageResp = await fetch(v.item.imageUrl);
          let imageBlob = await imageResp.blob();
          let imageBase64 = await readFileBinary(imageBlob);

          for (let i in result) {
            if (result[i].imageData === imageBase64) {
              return;
            }
          }

          let mall_name = '';

          if (v.item.mallInfoCache) {
            switch (v.item.mallInfoCache.mallGrade) {
              case 'M44001': {
                mall_name = '플래티넘';

                if (!this.searchInfo.includePlatinum) {
                  return;
                }

                break;
              }

              case 'M44002': {
                mall_name = '프리미엉';

                if (!this.searchInfo.includePremium) {
                  return;
                }

                break;
              }

              case 'M44003': {
                mall_name = '빅파워';

                if (!this.searchInfo.includeBigPower) {
                  return;
                }

                break;
              }

              case 'M44004': {
                mall_name = '파워';

                if (!this.searchInfo.includePower) {
                  return;
                }

                break;
              }

              case 'M44005': {
                mall_name = '새싹';

                if (!this.searchInfo.includePlant) {
                  return;
                }

                break;
              }

              case 'M44006': {
                mall_name = '씨앗';

                if (!this.searchInfo.includeSeed) {
                  return;
                }

                break;
              }

              default: {
                break;
              }
            }
          }

          let category_name = '';

          if (v.item.category1Name) {
            category_name += v.item.category1Name;

            if (v.item.category2Name) {
              category_name += ' > ';
            }
          }

          if (v.item.category2Name) {
            category_name += v.item.category2Name;

            if (v.item.category3Name) {
              category_name += ' > ';
            }
          }

          if (v.item.category3Name) {
            category_name += v.item.category3Name;

            if (v.item.category4Name) {
              category_name += ' > ';
            }
          }

          if (v.item.category4Name) {
            category_name += v.item.category4Name;
          }

          let time = `${v.item.openDate.substring(0, 4)}-${v.item.openDate.substring(4, 6)}-${v.item.openDate.substring(
            6,
            8
          )}`;

          result.push({
            rank: v.item.rank,
            productName: v.item.productName,
            time: time,
            purchaseCnt: v.item.purchaseCnt,
            reviewCount: v.item.reviewCount,
            keepCnt: v.item.keepCnt,
            price: v.item.price,
            mallName: v.item.mallName,
            mallGrade: mall_name,
            imageData: imageBase64,
            imageUrl: v.item.imageUrl,
            crUrl: v.item.adcrUrl ?? v.item.crUrl,
            url: url,
            categorySummary: category_name,
            categoryLarge: v.item.category1Name,
            categoryMedium: v.item.category2Name,
            categorySmall: v.item.category3Name,
            categoryDetail: v.item.category4Name,
          });

          return;
        })
      );

      if (result.length === 0) {
        alert('조건에 맞는 검색결과가 존재하지 않습니다.');

        return;
      }

      let percentage = Math.round((result.length * 100) / this.searchInfo.maxLimits);

      runInAction(() => {
        this.setSearchInfo({
          ...this.searchInfo,

          progress: percentage > 100 ? 100 : percentage,
        });
      });
    }

    result = result.slice(0, this.searchInfo.maxLimits);
    result =
      this.searchInfo.sort === 'review' ? sortBy(result, 'reviewCount', false) : sortBy(result, 'purchaseCnt', false);
    result.map((v: any, i: number) => {
      v.rank = i + 1;

      return;
    });

    runInAction(() => {
      this.result = result;

      this.setSearchInfo({
        ...this.searchInfo,

        progress: 0,
      });
    });
  };

  // 엑셀 다운로드
  download = async () => {
    if (this.result.length <= 0) {
      alert('소싱 결과를 찾을 수 없습니다.');

      return 0;
    }

    let t = getClock();

    let path_name = `상품소싱결과_${t.YY}-${t.MM}-${t.DD}-${t.hh}-${t.mm}-${t.ss}`;

    let result = sortBy(
      await Promise.all(
        this.result.map(async (v: any) => {
          let image_resp = await fetch(v.imageUrl);
          let image_blob = await image_resp.blob();
          let image_url = URL.createObjectURL(image_blob);
          let image_type = image_blob.type.split('/')[1];

          chrome.downloads.download({
            url: image_url,
            filename: `${path_name}/${v.rank}.${image_type}`,
            saveAs: false,
          });

          return {
            순번: v.rank,
            상품명: v.productName,
            등록일자: v.time,
            리뷰개수: v.reviewCount,
            구매개수: v.purchaseCnt,
            찜개수: v.keepCnt,
            판매가격: v.price,
            판매처: v.mallName,
            판매처등급: v.mallGrade,
            대표이미지: v.imageUrl,
            '카테고리(대분류)': v.categoryLarge,
            '카테고리(중분류)': v.categoryMedium,
            '카테고리(소분류)': v.categorySmall,
            '카테고리(세분류)': v.categoryDetail,
          };
        })
      ),
      '순번',
      true
    );

    let workbook = XLSX.utils.book_new();
    let worksheet = XLSX.utils.json_to_sheet(result);

    XLSX.utils.book_append_sheet(workbook, worksheet);

    let workdata = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

    // 임의의 가상 URL을 만들어 크롬 DOWNLOAD API를 사용할 수 있도록 적용
    let workurl = URL.createObjectURL(
      new Blob([stringToArrayBuffer(workdata)], {
        type: 'application/octet-stream',
      })
    );

    chrome.downloads.download({
      url: workurl,
      filename: `${path_name}/상품소싱목록.xlsx`,
      saveAs: false,
    });
  };
}
