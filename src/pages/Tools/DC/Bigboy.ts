// 빅보이 엑셀 대량등록 데이터 생성

import { floatingToast, getAirportName } from '../../../../common/function';

export async function getBigboyForm(data, commonStore) {
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
				묶음값: v.connected.index,
				배송지: commonStore.user.userInfo.orderToDeliveryMethod,
				'주문번호(해외)': v.id,
				'TRACKING#': v.trackingNumber,
				'수취인명(한글)': v.connected.receiverName,
				핸드폰: v.connected.receiverTelNo1,
				우편번호: v.connected.receiverZipCode,
				배송주소: v.connected.receiverIntegratedAddress,
				개인통관고유부호: v.connected.individualCustomUniqueCode,
				HSCODE: v.deliveryInfo.category.code,
				'상품명(중문)': v.productName,
				색상: v.optionInfo,
				단가: v.unitPrice,
				수량: v.quantity,
				상품URL: v.url,
				이미지URL: v.imageUrl,
				배송시요청사항: v.connected.productOrderMemo,
				중국창고요청사항: '',
				포장옵션: '',
				기타옵션: '',
				전기어댑터: '',
				기본안전포장: '',
				특수에어캡안전포장: '',
				나무특수안전포장: '',
				정밀검수: '',
				가구정밀검수: '',
				상품주문번호: v.connected.orderNo,
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
		data: [{}, {}].concat(results),
		type: 'xlsx',
	};
}
