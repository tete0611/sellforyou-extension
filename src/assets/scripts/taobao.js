// 타오바오 페이지 삽입 스크립트

async function main() {
  // 데이터가 로드될 때까지 루프를 반복함
  while (true) {
    try {
      var event = document.createEvent('Events');
      event.initEvent('keydown', true, true);
      event.keyCode = 13;
      document.getElementById('bd').dispatchEvent(event);
      document.getElementById('bd').click();
      console.log('g_config.descUrl', g_config);
      // 상품 수집에 필요한 정보
      let json = {
        price: g_config.sibRequest.data,
        config: g_config,
        sku: window.Hub.config.get('sku'),
        video: window.Hub.config.get('video'),
        descUrl: g_config.descUrl.split('?')[0],
      };

      // 세션 스토리지로 데이터 공유할 때 주의사항
      // 1) sendMessage 사용 불가(삽입 스크립트와 크롬 확장프로그램 간 통신 방법은 스토리지가 유일함)
      // 2) 세션 스토리지 키 값이 충돌하지 않도록 고려해야 함
      sessionStorage.setItem('sfy-taobao-item', JSON.stringify(json));

      // 필수 데이터가 수집되었을 경우 루프를 종료
      break;
    } catch (e) {
      console.log(e);

      // 1초마다 루프 반복
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

main();
