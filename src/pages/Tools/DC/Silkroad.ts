// 실크로드 엑셀 대량등록 데이터 생성

import { floatingToast, getAirportName } from '../../../../common/function';

export async function getSilkroadForm(data, commonStore) {
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
				'수취인명(한글)': v.connected.receiverName,
				구매자이름: v.connected.orderMemberName,
				핸드폰: v.connected.receiverTelNo1,
				성: '',
				시: '',
				구: '',
				거리: '',
				우편번호: v.connected.receiverZipCode,
				바코드: '0',
				수량: v.quantity,
				단가: v.unitPrice,
				결제일: v.datePaid,
				제품총액: v.quantity * v.unitPrice,
				택배사코드: '',
				구매자메모: '',
				공란: '',
				배송주소: v.connected.receiverIntegratedAddress,
				'TRACKING#': v.trackingNumber,
				HSCODE: '',
				'상품명(중문)': v.productName,
				이미지URL: v.imageUrl,
				쇼핑몰주소: v.shopName,
				상품주문번호: v.connected.orderNo,
				개인통관고유부호: v.connected.individualCustomUniqueCode,
				색상: v.optionInfo,
				사이즈: v.optionInfo,
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
		data: results,
		type: 'xlsx',
	};
}
