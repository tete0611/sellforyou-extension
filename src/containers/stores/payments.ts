// 결제 스토리지

import { makeAutoObservable } from "mobx";

interface CardInfo {
  birthYMD: string;
  numPart1: string;
  numPart2: string;
  numPart3: string;
  numPart4: string;
  validYear: string;
  validMonth: string;
}

interface PayInfo {
  accounts: any;
  company: string;
  etc: string;
  name: string;
  period: string;
  planLevel: string;
  point: number;
  serviceAgreed: boolean;
  type: string;
}

interface PriceInfo {
  add: number;
  base: number;
  discount: number;
  original: number;
  total: number;
}

interface PlanInfo {
  func1: any;
  func2: any;
  func3: any;
}

export class payments {
  cardInfo: CardInfo = {
    birthYMD: "",
    numPart1: "",
    numPart2: "",
    numPart3: "",
    numPart4: "",
    validYear: "",
    validMonth: "",
  };

  modalInfo: any = {
    payCard: false,
  };

  payInfo: PayInfo = {
    accounts: [],
    company: "null",
    etc: "false",
    name: "",
    period: "1",
    planLevel: "3",
    point: 0,
    serviceAgreed: false,
    type: "CASH",
  };

  priceInfo: PriceInfo = {
    add: 0,
    base: 0,
    discount: 0,
    original: 0,
    total: 0,
  };

  planInfo: PlanInfo = {
    func1: null,
    func2: null,
    func3: null,
  };

  constructor() {
    makeAutoObservable(this);
  }

  // 카드 결제 모달
  togglePayCardModal = (value: boolean) => {
    this.modalInfo.payCard = value;
  };

  // 결제 정보
  setPayInfo = (value: PayInfo) => {
    this.payInfo = value;
  };

  // 가격 정보
  setPriceInfo = (value: PriceInfo) => {
    this.priceInfo = value;
  };

  // 카드 정보
  setCardInfo = (value: CardInfo) => {
    this.cardInfo = value;
  };

  // 플랜 정보
  setPlanInfo = (value: PlanInfo) => {
    this.planInfo = value;
  };

  // 아임포트 결제 API
  // KG이니시스는 사용할 수 없음
  // getIMPToken = async () => {
  //   const tokenData = {
  //     imp_key: "0488353639811136",
  //     imp_secret: "a3b362093621e7b186d14051115dcf09b76ccf60536ee38081fe3b63bd2943a1375d6b9bf48eacf8",
  //   };

  //   const tokenResp = await fetch("https://api.iamport.kr/users/getToken", {
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify(tokenData),
  //     method: "POST",
  //   });

  //   const tokenJson = await tokenResp.json();

  //   if (tokenJson.code === -1) {
  //     return null;
  //   }

  //   return tokenJson.response.access_token;
  // };

  // payNow = async (commonStore: any) => {
  //   const token = await this.getIMPToken();

  //   if (!token) {
  //     alert("결제 토큰이 발급되지 않아 결제가 취소되었습니다.");

  //     return;
  //   }

  //   const payData = {
  //     merchant_uid: `order_no_${commonStore.user.email}_${new Date().getTime()}`,
  //     amount: this.priceInfo.total,
  //     card_number: `${this.cardInfo.numPart1}-${this.cardInfo.numPart2}-${this.cardInfo.numPart3}-${this.cardInfo.numPart4}`,
  //     expiry: `${this.cardInfo.validYear}-${this.cardInfo.validMonth}`,
  //     birth: this.cardInfo.birthYMD,
  //     interest_free_by_merchant: "false",
  //   };

  //   const payResp = await fetch("https://api.iamport.kr/subscribe/payments/onetime", {
  //     headers: {
  //       Authorization: token,
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify(payData),
  //     method: "POST",
  //     mode: "cors",
  //     credentials: "include",
  //   });

  //   const payJson = await payResp.json();
  // };
}
