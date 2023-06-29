// 퍼스트배대지 엑셀 대량등록 데이터 생성

import { floatingToast, getAirportName } from '../Common';

async function getFirstbdgForm(data, commonStore) {
  if (!commonStore.user.userInfo.orderToDeliveryMethod) {
    floatingToast('배송방법이 선택되어 있지 않습니다.\n기본설정 > 배대지 설정 > 배송방법을 확인해주세요.', 'failed');

    return;
  }

  let results = await Promise.all(
    data.map(async (v: any, i: number) => {
      let receiverNameEn = v.connected.receiverName;
      let out = receiverNameEn.replaceAll(' ', '').replace(/[a-zA-Z]/g, '');

      if (out.length > 0) {
        receiverNameEn = await getAirportName(v.connected.receiverName);
      }

      return {
        순번: i,
        설명: '',
        배송서비스: commonStore.user.userInfo.orderToDeliveryMethod,
        상품명: v.productName,
        중국택배운송장번호: v.trackingNumber,
        구매url: v.url,
        이미지url: v.imageUrl,
        색상: v.optionInfo,
        사이즈: v.optionInfo,
        받는사람이름: v.connected.receiverName,
        받는사람영문이름: receiverNameEn,
        받는사람우편번호: v.connected.receiverZipCode,
        받는사람주소: v.connected.receiverIntegratedAddress,
        상세주소: '.',
        통관종류: '내국인',
        개인통관부호: v.connected.individualCustomUniqueCode,
        사업자통관부호: '',
        사업자등록번호: '',
        외국인등록번호: '',
        여권번호: '',
        받는사람전화: v.connected.receiverTelNo1,
        '운송장 메모': v.connected.productOrderMemo,
        '제품단가(위안)': v.unitPrice,
        신고수량: v.quantity,
        검수타입: '',
        '검수확인 메모': '',
        '중국 사이트 주문 번호': v.id,
        '국내사이트 주문 번호': v.connected.orderNo,
        통관옵션: '',
        배송타입: '',
        '관부가세 납부자': '',
        포장서비스: '',
        포장서비스2: '',
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
    name: '대량엑셀_배송신청서(반드시 샘플 유형대로 작성)',
    data: [{ 설명: '공란(삭제금지)' }, { 설명: '공란(삭제금지)' }, { 설명: '공란(삭제금지)' }].concat(results),
    type: 'xls',
  };
}

export { getFirstbdgForm };
