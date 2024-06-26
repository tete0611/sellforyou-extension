// 타오반점 엑셀 대량등록 데이터 생성

import { floatingToast, getAirportName } from '../../../../common/function';

export async function getTaobanjeomForm(data, commonStore) {
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
				검수선택: '',
				포장서비스: '',
				'수취인명(한글)': v.connected.receiverName,
				'수취인명(영어)': receiverNameEn,
				개인통관고유부호: v.connected.individualCustomUniqueCode,
				간이통관옵션: '',
				핸드폰: v.connected.receiverTelNo1,
				용도구분: '개인',
				우편번호: v.connected.receiverZipCode,
				기본주소: v.connected.receiverIntegratedAddress,
				상세주소: '.',
				배송시요청사항: v.connected.productOrderMemo,
				쇼핑몰주소: v.shopName,
				'주문번호(해외)': v.id,
				'상품명(중문)': v.productName,
				색상: v.optionInfo,
				사이즈: v.optionInfo,
				수량: v.quantity,
				단가: v.unitPrice,
				한국판매가: '',
				이미지URL: v.imageUrl,
				상품URL: v.url,
				구매자이름: v.connected.orderMemberName,
				배송사: '',
				'TRACKING#': v.trackingNumber,
				HSCODE: v.deliveryInfo.category.code,
				브랜드: '',
				물류센터요청사항: '',
				판매자관리코드: '',
				상품번호: '',
				상품주문번호: v.connected.orderNo,
				오픈마켓: v.connected.marketName,
				자동결제여부: '',
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
