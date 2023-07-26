// 쉽다 엑셀 대량등록 데이터 생성

import { getAirportName } from '../Common';

async function getShipdaForm(data) {
	let results = await Promise.all(
		data.map(async (v: any, i: number) => {
			let receiverNameEn = v.connected.receiverName;
			let out = receiverNameEn.replaceAll(' ', '').replace(/[a-zA-Z]/g, '');

			if (out.length > 0) {
				receiverNameEn = await getAirportName(v.connected.receiverName);
			}

			return {
				순번: i,
				그룹번호: '',
				'신청번호*': `${v.connected.index}`,
				제품번호: '',
				배대지국가: '',
				받는국가: '',
				신청인: '',
				해외총구매비: '',
				운송업체코드: '',
				운송업체: '',
				운송장번호: '',
				통관조회번호: '',
				'부가서비스[입고]': '',
				'부가서비스[출고]': '',
				재고번호: '',
				'상품명*': v.productName,
				'품목(HS)': '',
				'품목번호*': Number(v.deliveryInfo.category.code),
				'단가*': v.unitPrice,
				'수량*': v.quantity,
				상세url: v.url,
				현지트레킹번호: v.trackingNumber,
				현지주문번호: v.id,
				이미지url: v.imageUrl,
				옵션1: v.optionInfo,
				옵션2: '',
				옵션3: '',
				옵션4: '',
				현지운송료: '',
				현지세금: '',
				제품상태: '',
				입고메모: '',
				'수취인*': v.connected.receiverName,
				'수취인영문*': receiverNameEn,
				'우편번호*': v.connected.receiverZipCode,
				'주소*': v.connected.receiverIntegratedAddress,
				'상세주소*': '.',
				'영문주소*': '',
				'영문상세주소*': '',
				'연락처*': v.connected.receiverTelNo1,
				개인통관번호: v.connected.individualCustomUniqueCode,
				배송메시지: v.connected.productOrderMemo,
				신청일: '',
				출고일: '',
				출고보류: '',
				운송방법: '',
				가로: '',
				세로: '',
				높이: '',
				부피무게: '',
				실무게: '',
				적용무게: '',
				기본배송비: '',
				포장박스수량: '',
				무게할증료: '',
				부피할증료: '',
				'부가서비스비용[입고]': '',
				'부가서비스비용[출고]': '',
				수수료: '',
				추가금액: '',
				추가금액메모: '',
				추가할인: '',
				추가할인메모: '',
				배송비합계: '',
			};
		}),
	);

	results = results
		.sort((a, b) => a['순번'] - b['순번'])
		.map((v: any) => {
			delete v['순번'];

			return v;
		});

	return {
		name: 'Sheet1',
		data: [{}].concat(results),
		type: 'xls',
	};
}

export { getShipdaForm };
