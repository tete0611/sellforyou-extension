// 바른직구 엑셀 대량등록 데이터 생성

import { getAirportName } from '../Common';

export async function getBaruenjgForm(data) {
	let results = await Promise.all(
		data.map(async (v: any, i: number) => {
			let receiverNameEn = v.connected.receiverName;
			let out = receiverNameEn.replaceAll(' ', '').replace(/[a-zA-Z]/g, '');

			if (out.length > 0) {
				receiverNameEn = await getAirportName(v.connected.receiverName);
			}

			return {
				순번: i,
				'상품명(영문)': v.productName,
				품목분류: v.deliveryInfo.category.code,
				색상: v.optionInfo,
				사이즈: v.optionInfo,
				수량: v.quantity,
				단가: v.unitPrice,
				원산지표기방식: '현품스티커(本品贴纸)',
				상품URL: v.url,
				이미지URL: v.imageUrl,
				'주문번호(해외)': v.id,
				'TRACKING#': v.trackingNumber,
				송장번호: '',
				상품주문번호: v.orderNo,
				'수취인명(한글)': v.connected.receiverName,
				핸드폰: v.connected.receiverTelNo1,
				우편번호: v.connected.receiverZipCode,
				배송주소: v.connected.receiverIntegratedAddress,
				개인통관고유부호: v.connected.individualCustomUniqueCode,
				포장보완: '',
				사업자통관: '',
				입고담당자메모: '',
				택배사요청메모: '',
				정밀검수: '',
				돼지코추가: '',
				사진촬영: '',
				간이통관옵션: '',
				바로출고: '',
				보험: '',
				배송시요청사항: v.connected.productOrderMemo,
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
		name: '신청',
		data: results,
		type: 'xlsx',
	};
}
