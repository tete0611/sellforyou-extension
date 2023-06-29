// 1688 페이지 삽입 스크립트

async function main() {
  // 데이터가 로드될 때까지 루프를 반복함
  while (true) {
    try {
      // 페이지뷰가 다른 경우를 구분하기 위한 변수 선언
      let domain = null;

      // 페이지뷰가 기존 것과 다른지 확인
      if (window.__STORE_DATA && window.__INIT_DATA) {
        Object.keys(window.__INIT_DATA.data).map((v) => {
          if (window.__INIT_DATA.data[v].componentType === '@ali/tdmod-od-pc-offer-price') {
            domain = v;
          }
        });
      }

      // 상품 수집에 필요한 정보
      let json = {
        ipageType: window.iDetailConfig && window.iDetailData ? 1 : window.__STORE_DATA && window.__INIT_DATA ? 2 : 0,
        iDetailConfig: window.iDetailConfig ?? window.__STORE_DATA.globalData,
        iDetailData: window.iDetailData ?? window.__INIT_DATA.globalData,
        offerDomain: domain ? window.__INIT_DATA.data[domain].data.offerDomain : null,
      };

      // 필수 데이터 체크
      if (json['ipageType'] && json['iDetailConfig'] && json['iDetailData']) {
        // 세션 스토리지로 데이터 공유할 때 주의사항
        // 1) sendMessage 사용 불가(삽입 스크립트와 크롬 확장프로그램 간 통신 방법은 스토리지가 유일함)
        // 2) 세션 스토리지 키 값이 충돌하지 않도록 고려해야 함
        sessionStorage.setItem('sfy-alibaba-item', JSON.stringify(json));

        // 필수 데이터가 수집되었을 경우 루프를 종료
        break;
      }

      // 1초마다 루프 반복
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (e) {
      // 1초마다 루프 반복
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

main();
