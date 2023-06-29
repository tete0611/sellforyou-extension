// 셀포유 페이지(www.sellforyou.co.kr) 삽입 스크립트
// IIFE(삽입 즉시 실행됨, 초기값 없음)
(function () {
  // 콘텐츠 스크립트에서 생성한 스크립트를 찾음
  const script = document.getElementById('sfyIMP');

  // code: "imp75486003",
  // data: {
  //   pg: "html5_inicis",
  //   pay_method: "card",
  //   merchant_uid: `order_no_${common.user.email}_${new Date().getTime()}`,
  //   name: "셀포유 결제",
  //   amount: payments.priceInfo.total,
  //   buyer_email: common.user.email,
  //   buyer_name: payments.payInfo.name,
  //   buyer_tel: common.user.userInfo.phone,
  //   buyer_addr: "없음",
  //   buyer_postcode: "000-000",
  //   m_redirect_url: "{모바일에서 결제 완료 후 리디렉션 될 URL}",
  // },

  const code = script.getAttribute('code');
  const data = JSON.parse(script.getAttribute('data'));

  // 결제 모듈 초기화
  window.IMP.init(code);

  // 결제 요청 후 세션 스토리지로 데이터 공유
  window.IMP.request_pay(data, async function (rsp) {
    if (!rsp.success) {
      sessionStorage.setItem('sfy-iamport', 'false');

      return;
    }

    sessionStorage.setItem('sfy-iamport', 'true');
  });
})();
