import QUERIES from '../Main/GraphQL/Queries';
import gql from '../Main/GraphQL/Requests';
import MUTATIONS from '../Main/GraphQL/Mutations';

import {
	byteSlice,
	getClock,
	getClockOffset,
	getStoreTraceCodeV1,
	notificationByEveryTime,
	sendCallback,
	transformContent,
} from './Common';
import { Buffer } from 'buffer';
import { getLocalStorage } from './ChromeAsync';

const iconv = require('iconv-lite');
const xml2js = require('xml2js');

// 11번가 API Endpoint 인터페이스
export async function streetApiGateway(body: any) {
	let xmlBuilder = new xml2js.Builder({ cdata: true });
	let xmlData: any = body.method !== 'GET' ? xmlBuilder.buildObject(body.data) : undefined;
	let xmlHeader: any = {
		headers: {
			'Content-Type': 'text/xml; charset=utf-8;',
			openapikey: body.apikey,
		},

		method: body.method,
		body: xmlData,
	};

	const streetResp = await fetch(`${body.ssl ? `https` : `http`}://api.11st.co.kr/rest/${body.path}`, xmlHeader);
	const streetBuffer = await streetResp.arrayBuffer();

	let result = iconv.decode(Buffer.from(streetBuffer), 'euc-kr').toString();

	const response = await new Promise((resolve, reject) => {
		xml2js.parseString(result, function (e: any, result: any) {
			if (e) {
				reject(e);
			} else {
				resolve(result);
			}
		});
	});
	return response;
}

// 11번가 상품등록
export async function uploadStreet(productStore: any, commonStore: any, data: any) {
	if (!data) {
		return false;
	}

	let shopName = data.DShopInfo.site_name;

	console.log(`(${shopName}) 등록정보:`, data);

	try {
		let apiKey = null;
		let streetOutbound: any = null;
		let streetInbound: any = null;

		switch (data.DShopInfo.site_code) {
			case 'A112': {
				switch (commonStore.user.userInfo.streetUseKeyType) {
					case '1': {
						apiKey = commonStore.user.userInfo.streetApiKey;

						break;
					}

					case '2': {
						apiKey = commonStore.user.userInfo.streetApiKey2;

						break;
					}

					case '3': {
						apiKey = commonStore.user.userInfo.streetApiKey3;

						break;
					}

					case '4': {
						apiKey = commonStore.user.userInfo.streetApiKey4;

						break;
					}
				}

				streetOutbound = commonStore.deliveryPolicy.streetGlobalOutboundList.find(
					(v: any) => `${v.addrSeq[0]}` === `${commonStore.user.userInfo.streetDefaultOutbound}`,
				);
				streetInbound = commonStore.deliveryPolicy.streetGlobalInboundList.find(
					(v: any) => `${v.addrSeq[0]}` === `${commonStore.user.userInfo.streetDefaultInbound}`,
				);

				break;
			}

			case 'A113': {
				switch (commonStore.user.userInfo.streetNormalUseKeyType) {
					case '1': {
						apiKey = commonStore.user.userInfo.streetNormalApiKey;

						break;
					}

					case '2': {
						apiKey = commonStore.user.userInfo.streetNormalApiKey2;

						break;
					}

					case '3': {
						apiKey = commonStore.user.userInfo.streetNormalApiKey3;

						break;
					}

					case '4': {
						apiKey = commonStore.user.userInfo.streetNormalApiKey4;

						break;
					}
				}

				streetOutbound = commonStore.deliveryPolicy.streetNormalOutboundList.find(
					(v: any) => `${v.addrSeq[0]}` === `${commonStore.user.userInfo.streetNormalOutbound}`,
				);
				streetInbound = commonStore.deliveryPolicy.streetNormalInboundList.find(
					(v: any) => `${v.addrSeq[0]}` === `${commonStore.user.userInfo.streetNormalInbound}`,
				);

				break;
			}

			default:
				break;
		}

		if (!streetOutbound) {
			productStore.addConsoleText(`(${shopName}) 출고지 조회 실패`);
			notificationByEveryTime(`(${shopName}) 기본출고지가 선택되지 않았습니다.`);

			return false;
		}

		if (!streetInbound) {
			productStore.addConsoleText(`(${shopName}) 반품지 조회 실패`);
			notificationByEveryTime(`(${shopName}) 기본반품지가 선택되지 않았습니다.`);

			return false;
		}

		const template_body = {
			apikey: apiKey,

			path: `prodservices/sendCloseList`,
			method: 'GET',

			data: {},
		};

		const template_json: any = await streetApiGateway(template_body);

		for (let product in data.DShopInfo.prod_codes) {
			try {
				let market_code = data.DShopInfo.prod_codes[product];
				let market_item = data.DShopInfo.DataDataSet.data[product];
				let market_optn = data.DShopInfo.DataDataSet.data_opt;

				if (commonStore.uploadInfo.stopped) {
					productStore.addConsoleText(`(${shopName}) [${market_code}] 업로드 중단`);

					return false;
				}

				if (!market_item.cert) {
					if (!commonStore.uploadInfo.editable) {
						productStore.addRegisteredFailed(
							Object.assign(market_item, {
								error: '스토어에 이미 등록된 상품입니다.',
							}),
						);
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);

						continue;
					}
				} else {
					if (commonStore.uploadInfo.editable) {
						productStore.addRegisteredFailed(
							Object.assign(market_item, {
								error: '상품 신규등록을 먼저 진행해주세요.',
							}),
						);
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);

						continue;
					}
				}

				let name = byteSlice(market_item.name3, 100);

				let words = await gql(QUERIES.SELECT_WORD_TABLES_BY_SOMEONE, {}, false);
				let words_list = words.data.selectWordTablesBySomeone;

				let words_restrict: any = {};

				for (let i in words_list) {
					if (words_list[i].findWord && !words_list[i].replaceWord) {
						if (market_item.name3.includes(words_list[i].findWord)) {
							words_restrict['상품명'] = words_list[i].findWord;
						}
					}
				}

				let optn_attrs: any = [];

				for (let i in market_optn) {
					if (market_optn[i].code === market_code) {
						if (commonStore.user.userInfo.autoPrice === 'Y') {
							let iprice = market_item.sprice;
							let oprice = market_item.sprice + market_optn[i].price;

							let percent = Math.ceil((oprice / iprice - 1) * 100);

							if (data.DShopInfo.site_code === 'A112') {
								if (percent < -50 || percent > 300) {
									continue;
								}
							}

							if (data.DShopInfo.site_code === 'A113') {
								if (percent < -50 || percent > 100) {
									continue;
								}
							}
						}

						let optn_name = '';

						for (let j in market_optn[i]) {
							if (j.includes('misc') && market_optn[i][j] !== '') {
								let k = j.replace('misc', 'opt');

								optn_name += market_optn[i][j] + ':' + market_optn[i][k];
								optn_name += '†';
							}

							if (j.includes('opt') && j !== 'optimg' && market_optn[i][j] !== '') {
								for (let k in words_list) {
									if (words_list[k].findWord && !words_list[k].replaceWord) {
										if (market_optn[i][j].includes(words_list[k].findWord)) {
											words_restrict['옵션명'] = words_list[k].findWord;
										}
									}
								}
							}
						}

						optn_name = optn_name.slice(0, optn_name.length - 1);

						optn_attrs.push({
							useYn: 'Y', // 옵션상태: 사용
							colOptPrice: market_optn[i].price.toString(), // 옵션가(기본 판매가의 +100%/-50% 까지 설정 가능, 옵션 가격이 0원인 상품이 반드시 1개 이상 있어야 함)
							colCount: market_optn[i].stock, // 옵션재고수량(멀티옵션일 경우 일괄설정 되므로 옵션상태가 N일 때만 0으로 입력)
							optionMappingKey: optn_name,
						});
					}
				}

				if (Object.keys(words_restrict).length > 0) {
					let message = '';

					for (let i in words_restrict) {
						message += i + '에서 금지어(' + words_restrict[i] + ')가 발견되었습니다. ';
					}

					productStore.addRegisteredFailed(Object.assign(market_item, { error: message }));
					productStore.addConsoleText(`(${shopName}) [${market_code}] 금지어 발견됨`);

					await sendCallback(commonStore, data, market_code, parseInt(product), 2, message);

					continue;
				}

				if (!commonStore.uploadInfo.markets.find((v: any) => v.code === data.DShopInfo.site_code).video) {
					market_item.misc1 = '';
				}

				let desc = `
        ${getStoreTraceCodeV1(market_item.id, data.DShopInfo.site_code)}

        <br />
        <br />

        ${market_item.content2}

				<div style="text-align: center;">
					${
						market_item.misc1 !== ''
							? `
							<video controls>
								<source src="${market_item.misc1}" type="video/mp4">
							</video>
							
							<br />
							<br />
						`
							: ``
					}

					${commonStore.user.userInfo.descriptionShowTitle === 'Y' ? market_item.name3 : ``}
				</div>
								
				<br />
				<br />
				
				${transformContent(market_item.content1)}

        ${market_item.content3}
			`;

				const itemInfo = productStore.itemInfo.items.find((v: any) => v.productCode === market_code);

				const sillCode = itemInfo[`sillCode${data.DShopInfo.site_code}`]
					? itemInfo[`sillCode${data.DShopInfo.site_code}`]
					: '891045';
				const sillData = itemInfo[`sillData${data.DShopInfo.site_code}`]
					? JSON.parse(itemInfo[`sillData${data.DShopInfo.site_code}`])
					: [
							{ code: '23759100', name: '제조국 또는 원산지', type: 'input' },
							{
								code: '23756033',
								name: '법에 의한 인증·허가 등을 받았음을 확인할 수 있는 경우 그에 대한 사항',
								type: 'input',
							},
							{ code: '11905', name: '제조자/수입자', type: 'input' },
							{ code: '23760413', name: 'A/S 책임자와 전화번호 또는 소비자상담 관련 전화번호', type: 'input' },
							{ code: '11800', name: '품명 및 모델명', type: 'input' },
					  ];

				const sillResult = {
					type: sillCode,

					item: sillData.map((v) => {
						return {
							code: v.code,
							name: v.value ?? '상세설명참조',
						};
					}),
				};

				let product_body: any = {
					apikey: apiKey,

					path: 'prodservices/product',
					method: 'POST',

					data: {
						Product: {
							abrdBuyPlace: 'D', // 구매처: 현지 온라인 쇼핑몰
							selMthdCd: '01', // 판매방식: 고정가판매
							dispCtgrNo: market_item.cate_code, // 카테고리번호
							prdTypCd: '01', // 서비스상품코드: 일반배송상품
							hsCode: '', // HS CODE

							prdNm: name, // 상품명
							modelNm: market_item.model, // 모델명
							brand: market_item.brand, // 브랜드
							rmaterialTypCd: '05', // 원재료 유형 코드: 상품별 원산지는 상세설명 참조
							orgnTypCd: '03', // 원산지코드
							orgnNmVal: '수입산', // 원산지명

							sellerPrdCd: market_code, // 판매자 상품코드
							suplDtyfrPrdClfCd: '01', // 부가세/면세상품코드: 과세상품
							forAbrdBuyClf: '01', // 해외구매대행상품 여부: 해외판매대행상품
							importFeeCd: '01', // 관부가세 포함 여부: 포함
							prdStatCd: '01', // 상품상태: 새상품
							minorSelCnYn: 'Y', // 미성년자 구매가능: 가능

							prdImage01: market_item.img1, // 대표 이미지 URL
							prdImage02: market_item.img2, // 추가 이미지 1 (선택)
							prdImage03: market_item.img3, // 추가 이미지 2 (선택)
							prdImage04: market_item.img4, // 추가 이미지 3 (선택)
							prdImage05: market_item.img1, // 목록 이미지(검색 결과 페이지나 카테고리 리스트 페이지에서 노출되는 이미지) (선택)
							prdImage09: '', // 카드뷰 이미지 2 (선택)
							htmlDetail: desc, // 상세설명

							ProductCertGroup: [
								{
									crtfGrpTypCd: '01', // 인증정보그룹번호: 전기용품/생활용품 KC인증
									crtfGrpObjClfCd: '03', // KC인증대상여부: KC인증대상 아님
								},

								{
									crtfGrpTypCd: '02', // 인증정보그룹번호: 어린이제품 KC인증
									crtfGrpObjClfCd: '03', // KC인증대상여부: KC인증대상 아님
								},

								{
									crtfGrpTypCd: '03', // 인증정보그룹번호: 방송통신기자재 KC인증
									crtfGrpObjClfCd: '03', // KC인증대상여부: KC인증대상 아님
								},

								{
									crtfGrpTypCd: '04', // 인증정보그룹번호: 생활화학 및 살생물제품
									crtfGrpObjClfCd: '05', // KC인증대상여부: KC인증대상 아님
								},
							],

							selTermUseYn: 'N', // 판매기간: 영구

							selPrc: market_item.sprice, // 판매가

							cuponcheck: 'N',
							// "cuponcheck": market_item.nprice > 0 || market_data.userInfo.discountAmount > 0 ? "Y" : "N",
							// "dscAmtPercnt": market_item.nprice > 0 ? market_item.nprice : market_data.userInfo.discountAmount,
							// "cupnDscMthdCd": market_item.nprice > 0 || market_data.userInfo.discountUnitType === 'WON' ? "01" : "02",
							// "cupnUseLmtDyYn": "N",

							prdSelQty: market_item.stock, // 재고수량
							gblDlvYn: 'N', // 전세계배송 이용여부: 이용안함
							dlvCnAreaCd: '01', // 배송가능지역 코드: 전국
							dlvWyCd: '01', // 배송방법: 택배
							dlvSendCloseTmpltNo:
								template_json.productInformationTemplateList.templateBOList?.find((v) => v.repCloseTimeYn[0] === 'Y')
									?.prdInfoTmpltNo[0] ?? '재고확인 후 순차발송', // 발송마감 템플릿번호: 재고확인 후 순차발송
							dlvCstInstBasiCd: market_item.deliv_fee > 0 ? '02' : '01' /* 
    																			배송비 정책: 

    																			01(무료), 
    																			02(고정 배송비), 
    																			03(상품 조건부 무료), 
    																			04(수량별 차등), 
    																			05(1개당 배송비), 
    																			07(판매자 조건부 배송비),
    																			08(출고지 조건부 배송비), 
    																			09(11번가 통합 출고지 배송비),
    																			10(11번가 해외배송조건부배송비), 
    																		*/,

							dlvCst1: market_item.deliv_fee, // 배송비: 02, 03
							bndlDlvCnYn: 'N', // 묶음배송 여부: 불가
							dlvCstPayTypCd: '03', // 결제방법: 선결제
							jejuDlvCst: commonStore.user.userInfo.additionalShippingFeeJeju, // 제주 추가 배송비
							islandDlvCst: commonStore.user.userInfo.additionalShippingFeeJeju, // 도서산간 추가 배송비
							addrSeqOut: streetOutbound.addrSeq[0], // 출고지 주소 코드
							outsideYnOut: data.DShopInfo.site_code === 'A112' ? 'Y' : 'N', // 출고지 주소 해외 여부
							addrSeqOutMemNo: streetOutbound.memNo[0], // 통합 ID 회원번호(출고지용)
							addrSeqIn: streetInbound.addrSeq[0], // 반품/교환지 주소 코드
							outsideYnIn: 'N', // 반품/교환지 주소 해외 여부
							addrSeqInMemNo: streetInbound.memNo[0], // 통합 ID 회원번호(반품지용)
							rtngdDlvCst: commonStore.user.userInfo.refundShippingFee, // 반품 배송비
							exchDlvCst: commonStore.user.userInfo.exchangeShippingFee, // 교환 배송비
							asDetail: commonStore.user.userInfo.asInformation, // A/S 안내
							rtngExchDetail: commonStore.user.userInfo.asInformation, // 반품/교환 안내
							ProductNotification: sillResult,
							prcCmpExpYn: 'Y', // 가격비교 사이트 등록 여부: 등록함
						},
					},
				};

				if (optn_attrs.length > 0) {
					product_body.data.Product = {
						...product_body.data.Product,

						optSelectYn: 'Y',
						txtColCnt: 1,
						optMixYn: 'N',

						ProductOptionExt: {
							ProductOption: optn_attrs,
						},
					};
				}

				if (commonStore.uploadInfo.stopped) {
					productStore.addConsoleText(`(${shopName}) [${market_code}] 업로드 중단`);

					return false;
				}

				if (!market_item.cert && commonStore.uploadInfo.editable) {
					let productId = market_item.name2;

					if (!productId) {
						productStore.addRegisteredFailed(Object.assign(market_item, { error: '상품 ID를 찾을 수 없습니다.' }));
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 실패`);

						await sendCallback(commonStore, data, market_code, parseInt(product), 2, '상품 ID를 찾을 수 없습니다.');

						continue;
					}

					product_body = {
						...product_body,

						path: `prodservices/product/${productId}`,
						method: 'PUT',
					};

					productStore.addRegisteredQueue(market_item);
					productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 중...`);

					const product_json: any = await streetApiGateway(product_body);

					if (product_json.ClientMessage.resultCode[0] === '200') {
						productStore.addRegisteredSuccess(
							Object.assign(market_item, {
								error: product_json.ClientMessage.productNo[0],
							}),
						);
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 성공`);

						await sendCallback(
							commonStore,
							data,
							market_code,
							parseInt(product),
							1,
							product_json.ClientMessage.productNo[0],
						);
					} else {
						productStore.addRegisteredFailed(
							Object.assign(market_item, {
								error: product_json.ClientMessage.message[0],
							}),
						);
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 실패`);

						await sendCallback(
							commonStore,
							data,
							market_code,
							parseInt(product),
							2,
							product_json.ClientMessage.message[0],
						);
					}
				} else {
					productStore.addRegisteredQueue(market_item);
					productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 중...`);

					try {
						const product_json: any = await streetApiGateway(product_body);

						if (product_json.ClientMessage.resultCode[0] === '200') {
							productStore.addRegisteredSuccess(
								Object.assign(market_item, {
									error: product_json.ClientMessage.productNo[0],
								}),
							);
							productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 성공`);

							await sendCallback(
								commonStore,
								data,
								market_code,
								parseInt(product),
								1,
								product_json.ClientMessage.productNo[0],
							);
						} else {
							productStore.addRegisteredFailed(
								Object.assign(market_item, {
									error: product_json.ClientMessage.message[0],
								}),
							);
							productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);

							await sendCallback(
								commonStore,
								data,
								market_code,
								parseInt(product),
								2,
								product_json.ClientMessage.message[0],
							);
						}
					} catch (e) {
						let search_body = {
							apikey: apiKey,

							path: `prodmarketservice/sellerprodcode/${market_code}`,
							method: 'GET',
						};

						const search_json: any = await streetApiGateway(search_body);

						if (search_json['ns2:products']['ns2:product']) {
							productStore.addRegisteredSuccess(
								Object.assign(market_item, {
									error: search_json['ns2:products']['ns2:product'][0].prdNo[0],
								}),
							);
							productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 성공`);

							await sendCallback(
								commonStore,
								data,
								market_code,
								parseInt(product),
								1,
								search_json['ns2:products']['ns2:product'][0].prdNo[0],
							);
						} else {
							productStore.addRegisteredFailed(
								Object.assign(market_item, {
									error: search_json.ClientMessage.message[0],
								}),
							);
							productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);

							await sendCallback(
								commonStore,
								data,
								market_code,
								parseInt(product),
								2,
								search_json.ClientMessage.message[0],
							);
						}
					}
				}
			} catch (e: any) {
				notificationByEveryTime(`(${shopName}) 업로드 도중 오류가 발생하였습니다. (${e.toString()})`);

				continue;
			}
		}
	} catch (e: any) {
		productStore.addConsoleText(`(${shopName}) 업로드 중단`);
		notificationByEveryTime(`(${shopName}) 업로드 도중 오류가 발생하였습니다. (${e.toString()}`);

		return false;
	}

	productStore.addConsoleText(`(${shopName}) 업로드 완료`);

	return true;
}

// 11번가 상품등록 해제
export async function deleteStreet(productStore: any, commonStore: any, data: any) {
	if (!data) {
		return false;
	}

	let shopName = data.DShopInfo.site_name;

	console.log(`(${shopName}) 등록정보:`, data);

	try {
		let apiKey = null;

		switch (data.DShopInfo.site_code) {
			case 'A112': {
				switch (commonStore.user.userInfo.streetUseKeyType) {
					case '1': {
						apiKey = commonStore.user.userInfo.streetApiKey;

						break;
					}

					case '2': {
						apiKey = commonStore.user.userInfo.streetApiKey2;

						break;
					}

					case '3': {
						apiKey = commonStore.user.userInfo.streetApiKey3;

						break;
					}

					case '4': {
						apiKey = commonStore.user.userInfo.streetApiKey4;

						break;
					}
				}

				break;
			}

			case 'A113': {
				switch (commonStore.user.userInfo.streetNormalUseKeyType) {
					case '1': {
						apiKey = commonStore.user.userInfo.streetNormalApiKey;

						break;
					}

					case '2': {
						apiKey = commonStore.user.userInfo.streetNormalApiKey2;

						break;
					}

					case '3': {
						apiKey = commonStore.user.userInfo.streetNormalApiKey3;

						break;
					}

					case '4': {
						apiKey = commonStore.user.userInfo.streetNormalApiKey4;

						break;
					}
				}

				break;
			}

			default:
				break;
		}

		for (let product in data.DShopInfo.prod_codes) {
			try {
				let market_code = data.DShopInfo.prod_codes[product];
				let market_item = data.DShopInfo.DataDataSet.data[product];

				if (market_item.cert) {
					continue;
				}

				let productId = market_item.name2;

				if (!productId) {
					continue;
				}

				const deleteBody = {
					apikey: apiKey,

					path: `prodstatservice/stat/stopdisplay/${productId}`,
					method: 'PUT',

					data: {},
				};

				const deleteJson: any = await streetApiGateway(deleteBody);

				if (deleteJson.ClientMessage.resultCode[0] === '200') {
					const progressValue = Math.round(((parseInt(product) + 1) * 100) / data.DShopInfo.prod_codes.length);

					commonStore.setDisabledProgressValue(data.DShopInfo.site_code, progressValue);

					await gql(MUTATIONS.UNLINK_PRODUCT_STORE, {
						productId: market_item.id,
						siteCode: data.DShopInfo.site_code,
					});
				} else {
					if (deleteJson.ClientMessage.message[0].includes('판매중/전시전인 상품만 판매중지가 가능합니다.')) {
						const progressValue = Math.round(((parseInt(product) + 1) * 100) / data.DShopInfo.prod_codes.length);

						commonStore.setDisabledProgressValue(data.DShopInfo.site_code, progressValue);

						await gql(MUTATIONS.UNLINK_PRODUCT_STORE, {
							productId: market_item.id,
							siteCode: data.DShopInfo.site_code,
						});
					}
				}
			} catch (e: any) {
				notificationByEveryTime(`(${shopName}) 상품 등록해제 도중 오류가 발생하였습니다. (${e.toString()})`);

				continue;
			}
		}
	} catch (e: any) {
		productStore.addConsoleText(`(${shopName}) 상품 등록해제 중단`);
		notificationByEveryTime(`(${shopName}) 상품 등록해제 도중 오류가 발생하였습니다. (${e.toString()})`);

		return false;
	}

	productStore.addConsoleText(`(${shopName}) 상품 등록해제 완료`);

	return true;
}

// 11번가 신규주문조회
export async function newOrderStreet(commonStore: any, shopInfo: any) {
	const shopName = shopInfo.name;

	if (!shopInfo.connected || shopInfo.disabled) {
		return [];
	}

	try {
		let apiList: any = [];

		switch (shopInfo.code) {
			case 'A112': {
				apiList.push(commonStore.user.userInfo.streetApiKey);
				apiList.push(commonStore.user.userInfo.streetApiKey2);
				apiList.push(commonStore.user.userInfo.streetApiKey3);
				apiList.push(commonStore.user.userInfo.streetApiKey4);

				break;
			}

			case 'A113': {
				apiList.push(commonStore.user.userInfo.streetNormalApiKey);
				apiList.push(commonStore.user.userInfo.streetNormalApiKey2);
				apiList.push(commonStore.user.userInfo.streetNormalApiKey3);
				apiList.push(commonStore.user.userInfo.streetNormalApiKey4);

				break;
			}

			default:
				break;
		}

		apiList = apiList.filter((v: any) => v);

		//일주일이 최대조회기간
		let dateStart = getClockOffset(0, 0, -7, 0, 0, 0);
		let dateEnd = getClock();

		const orderResults = await Promise.all(
			apiList.map(async (v: any) => {
				const body = {
					apikey: v,

					path: `ordservices/complete/${dateStart.YY}${dateStart.MM}${dateStart.DD}0000/${dateEnd.YY}${dateEnd.MM}${dateEnd.DD}2359`,
					method: 'GET',

					data: {},

					ssl: true,
				};

				const orderJson: any = await streetApiGateway(body);

				console.log(shopName, orderJson['ns2:orders']['ns2:order']);

				if (!orderJson['ns2:orders']['ns2:order']) {
					return [];
				}

				return orderJson['ns2:orders']['ns2:order'].map((w: any) => {
					return {
						productId: w.prdNo,
						marketCode: shopInfo.code,
						marketName: shopInfo.name,
						taobaoOrderNo: null,
						productName: w.prdNm[0],
						productOptionContents: w.slctPrdOptNm[0],
						sellerProductManagementCode: w.sellerPrdCd[0],
						orderNo: w.ordNo[0],
						orderQuantity: parseInt(w.ordQty[0]),
						orderMemberName: w.ordNm[0],
						orderMemberTelNo: w.ordPrtblTel[0],
						productPayAmt: parseInt(w.ordPayAmt[0]),
						deliveryFeeAmt: parseInt(w.dlvCst[0]),
						individualCustomUniqueCode: w.psnCscUniqNo[0],
						receiverName: w.rcvrNm[0],
						receiverTelNo1: w.rcvrPrtblNo[0],
						receiverIntegratedAddress: `${w.rcvrBaseAddr[0]} ${w.rcvrDtlsAddr[0]}`,
						receiverZipCode: w.rcvrMailNo[0],
						productOrderMemo: w.ordDlvReqCont[0],
						apiKey: v,
					};
				});
			}),
		);

		let orderList = [];

		orderResults.map((v: any) => {
			orderList = orderList.concat(v);
		});

		return orderList;
	} catch (e) {
		console.log(shopName, e);

		return [];
	}
}

// 11번가 발주확인처리
export async function productPreparedStreet(commonStore: any, shopInfo: any) {
	const shopName = shopInfo.name;

	if (!shopInfo.connected || shopInfo.disabled) {
		return [];
	}
	const orderList = await getLocalStorage<any>('order');
	let orderInfo: any = [];

	switch (shopInfo.code) {
		case 'A112': {
			const A112OrderList = orderList.filter((v: any) => v.marketCode === 'A112');
			A112OrderList.map((v: any, i: number) => {
				orderInfo.push({
					orderNo: v.orderNo,
					ordPrdSeq: v.ordPrdSeq,
					dlvNo: v.dlvNo,
					apiKey: v.apiKey,
				});
			});
			console.log('A112orderInfo', orderInfo);
			break;
		}
		case 'A113': {
			const A113OrderList = orderList.filter((v: any) => v.marketCode === 'A113');
			A113OrderList.map((v: any, i: number) => {
				orderInfo.push({
					orderNo: v.orderNo,
					ordPrdSeq: v.ordPrdSeq,
					dlvNo: v.dlvNo,
					apiKey: v.apiKey,
				});
			});
			console.log('A113orderInfo', orderInfo);
			break;
		}
		default:
			break;
	}

	try {
		let apiList: any = [];

		switch (shopInfo.code) {
			case 'A112': {
				apiList.push(commonStore.user.userInfo.streetApiKey);
				apiList.push(commonStore.user.userInfo.streetApiKey2);
				apiList.push(commonStore.user.userInfo.streetApiKey3);
				apiList.push(commonStore.user.userInfo.streetApiKey4);

				break;
			}

			case 'A113': {
				apiList.push(commonStore.user.userInfo.streetNormalApiKey);
				apiList.push(commonStore.user.userInfo.streetNormalApiKey2);
				apiList.push(commonStore.user.userInfo.streetNormalApiKey3);
				apiList.push(commonStore.user.userInfo.streetNormalApiKey4);

				break;
			}

			default:
				break;
		}

		apiList = apiList.filter((v: any) => v);

		console.log('apiList', apiList);

		await Promise.all(
			apiList.map(async (w: any) => {
				const dataInfo = orderInfo.filter((data: any) => data.apiKey === w);
				await Promise.all(
					dataInfo.map(async (v: any) => {
						const body = {
							apikey: w,

							path: `ordservices/reqpackaging/${v.orderNo}/${v.ordPrdSeq}/N/null/${v.dlvNo}`,
							method: 'GET',

							data: {},

							ssl: true,
						};
						const orderJson: any = await streetApiGateway(body);
						console.log(shopName, orderJson);
					}),
				);
			}),
		);

		let orderList = [];

		// orderResults.map((v: any) => {
		//     orderList = orderList.concat(v);
		// })

		return orderList;
	} catch (e) {
		console.log(shopName, e);

		return [];
	}
}

// 11번가 발송처리주문조회
export async function deliveryOrderStreet(commonStore: any, shopInfo: any) {
	const shopName = shopInfo.name;

	if (!shopInfo.connected || shopInfo.disabled) {
		return [];
	}

	try {
		let apiList: any = [];

		switch (shopInfo.code) {
			case 'A112': {
				apiList.push(commonStore.user.userInfo.streetApiKey);
				apiList.push(commonStore.user.userInfo.streetApiKey2);
				apiList.push(commonStore.user.userInfo.streetApiKey3);
				apiList.push(commonStore.user.userInfo.streetApiKey4);

				break;
			}

			case 'A113': {
				apiList.push(commonStore.user.userInfo.streetNormalApiKey);
				apiList.push(commonStore.user.userInfo.streetNormalApiKey2);
				apiList.push(commonStore.user.userInfo.streetNormalApiKey3);
				apiList.push(commonStore.user.userInfo.streetNormalApiKey4);

				break;
			}

			default:
				break;
		}

		apiList = apiList.filter((v: any) => v);

		//일주일이 최대조회기간
		let dateStart = getClockOffset(0, 0, -7, 0, 0, 0);
		let dateEnd = getClock();

		const orderResults = await Promise.all(
			apiList.map(async (v: any) => {
				const body = {
					apikey: v,

					path: `ordservices/packaging/${dateStart.YY}${dateStart.MM}${dateStart.DD}0000/${dateEnd.YY}${dateEnd.MM}${dateEnd.DD}2359`,
					method: 'GET',

					data: {},

					ssl: true,
				};

				const orderJson: any = await streetApiGateway(body);

				console.log(shopName, orderJson['ns2:orders']['ns2:order']);

				if (!orderJson['ns2:orders']['ns2:order']) {
					return [];
				}

				return orderJson['ns2:orders']['ns2:order'].map((w: any) => {
					return {
						productId: w.prdNo,
						marketCode: shopInfo.code,
						marketName: shopInfo.name,
						taobaoOrderNo: null,
						productName: w.prdNm[0],
						productOptionContents: w.slctPrdOptNm[0],
						sellerProductManagementCode: w.sellerPrdCd[0],
						orderNo: w.ordNo[0],
						orderQuantity: parseInt(w.ordQty[0]),
						orderMemberName: w.ordNm[0],
						orderMemberTelNo: w.ordPrtblTel[0],
						productPayAmt: parseInt(w.ordPayAmt[0]),
						deliveryFeeAmt: parseInt(w.dlvCst[0]),
						individualCustomUniqueCode: w.psnCscUniqNo[0],
						receiverName: w.rcvrNm[0],
						receiverTelNo1: w.rcvrPrtblNo[0],
						receiverIntegratedAddress: `${w.rcvrBaseAddr[0]} ${w.rcvrDtlsAddr[0]}`,
						receiverZipCode: w.rcvrMailNo[0],
						productOrderMemo: w.ordDlvReqCont[0],
						apiKey: v,
					};
				});
			}),
		);

		let orderList = [];

		orderResults.map((v: any) => {
			orderList = orderList.concat(v);
		});

		return orderList;
	} catch (e) {
		console.log(shopName, e);

		return [];
	}
}
