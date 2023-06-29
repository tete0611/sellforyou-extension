// 보내요 엑셀 대량등록 데이터 생성

import { getAirportName } from '../Common';

async function getSendyoForm(data) {
  let results = await Promise.all(
    data.map(async (v: any, i: number) => {
      let receiverNameEn = v.connected.receiverName;
      let out = receiverNameEn.replaceAll(' ', '').replace(/[a-zA-Z]/g, '');

      if (out.length > 0) {
        receiverNameEn = await getAirportName(v.connected.receiverName);
      }

      return {
        순번: i,
        묶음값: v.connected.index,
        자동결제여부: '1',
        바로포장여부: '1',
        '수취인명(한글)': v.connected.receiverName,
        '수취인명(영어)': receiverNameEn,
        핸드폰: v.connected.receiverTelNo1,
        우편번호: v.connected.receiverZipCode,
        배송주소: v.connected.receiverIntegratedAddress,
        '배송주소(영문)': v.connected.receiverIntegratedAddress,
        통관구분: '1',
        개인통관고유부호: v.connected.individualCustomUniqueCode,
        센터요청사항: '',
        배송시요청사항: v.connected.productOrderMemo,
        통관품목번호: v.deliveryInfo.category.code,
        쇼핑몰주소: v.shopName,
        '주문번호(해외)': v.id,
        '상품명(중문)': v.productName,
        브랜드: '',
        색상: v.optionInfo,
        사이즈: v.optionInfo,
        수량: v.quantity,
        단가: v.unitPrice,
        이미지URL: v.imageUrl,
        상품URL: v.url,
        'TRACKING#': v.trackingNumber,
        재고번호: '',
        부가서비스: '5',
        화물선착불: '0',
        HSCODE: '',
        오픈마켓: v.connected.marketName,
        오픈마켓결제수단: '',
        상품주문번호: v.connected.orderNo,
        오픈마켓판매금액: '',
      };
    })
  );

  results = results
    .sort((a, b) => a['순번'] - b['순번'])
    .map((v: any) => {
      delete v['순번'];

      return v;
    });

  return {
    name: '신청',
    data: results,
    type: 'xlsx',
  };
}

export { getSendyoForm };
