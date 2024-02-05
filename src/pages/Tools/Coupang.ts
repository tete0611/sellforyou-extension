// 쿠팡 API
// https://developers.coupangcorp.com/hc/ko
import CryptoJS from 'crypto-js';
import gql from '../Main/GraphQL/Requests';
import QUERIES from '../Main/GraphQL/Queries';
import MUTATIONS from '../Main/GraphQL/Mutations';
import {
	floatingToast,
	getClock,
	getClockOffset,
	getStoreTraceCodeV3,
	matchesCharacter,
	notificationByEveryTime,
	sendCallback,
	sleep,
	toISO,
	transformContent,
} from '../../../common/function';
import { getLocalStorage } from './ChromeAsync';
import { product } from '../../containers/stores/product';
import { common } from '../../containers/stores/common';
import { UploadInfo } from '../../type/type';

interface CoupangProps {
	method: string;
	path: string;
	query?: string;
	accesskey: string;
	secretkey: string;
	data: any;
}

/** 쿠팡 API Endpoint 인터페이스 */
export const coupangApiGateway = async (body: CoupangProps) => {
	const datetime = new Date().toISOString().substr(2, 17).replace(/:/gi, '').replace(/-/gi, '') + 'Z';
	const method = body.method;
	const path = body.path;
	const queried = body.query;
	const message = datetime + method + path + queried;

	let urlpath = path + '?' + queried;
	urlpath = urlpath.replaceAll('/(\xE2\x80\x8B|&#8203;)/', ''); // U+200b 불필요 문자 제거
	const accesskey = body.accesskey;
	const secretkey = body.secretkey;
	const signature = CryptoJS.HmacSHA256(message, secretkey).toString(CryptoJS.enc.Hex);
	const authorization =
		'CEA algorithm=HmacSHA256, access-key=' + accesskey + ', signed-date=' + datetime + ', signature=' + signature;

	let coupang_resp = await fetch(`https://api-gateway.coupang.com${urlpath}`, {
		method: method,
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			Authorization: authorization,
			'X-EXTENDED-TIMEOUT': '90000',
		},

		body: method === 'GET' || method === 'HEAD' ? null : JSON.stringify(body.data),
	});

	// if (coupang_resp.status === 403) throw new Error('쿠팡 API 403에러발생.\n관리자에게 문의해주세요.');
	const json = await coupang_resp.json();
	return json;
};

/** 쿠팡 상품등록 API */
export const uploadCoupang = async (productStore: product, commonStore: common, data: any) => {
	if (!data) return false;

	let shopName = data.DShopInfo.site_name;

	console.log(`(${shopName}) 등록정보:`, data);

	try {
		let accesskey = commonStore.user.userInfo?.coupangAccessKey;
		let secretkey = commonStore.user.userInfo?.coupangSecretKey;

		const coupangOutbound = commonStore.deliveryPolicy.coupangOutboundList.find(
			(v: any) => `${v.outboundShippingPlaceCode}` === `${commonStore.user.userInfo?.coupangDefaultOutbound}`,
		);
		const coupangInbound = commonStore.deliveryPolicy.coupangInboundList.find(
			(v: any) => `${v.returnCenterCode}` === `${commonStore.user.userInfo?.coupangDefaultInbound}`,
		);

		if (!coupangOutbound) {
			productStore.addConsoleText(`(${shopName}) 출고지 조회 실패`);
			notificationByEveryTime(`(${shopName}) 기본출고지가 선택되지 않았습니다.`);

			return false;
		}

		if (!coupangInbound) {
			productStore.addConsoleText(`(${shopName}) 반품지 조회 실패`);
			notificationByEveryTime(`(${shopName}) 기본반품지가 선택되지 않았습니다.`);

			return false;
		}

		if (coupangOutbound.remoteInfos.length === 0) {
			productStore.addConsoleText(`(${shopName}) 출고지 택배사 조회 실패`);
			notificationByEveryTime(`(${shopName}) 선택하신 출고지에 택배사가 선택되지 않았습니다.`);

			return false;
		}

		// 상품정보를 하나하나 루프돌면서 API 전송형식에 맞춤
		for (let product in data.DShopInfo.prod_codes) {
			try {
				let market_code = data.DShopInfo.prod_codes[product];
				let market_item = data.DShopInfo.DataDataSet.data[product];
				let market_optn = data.DShopInfo.DataDataSet.data_opt;

				// 업로드 중단 시
				if (commonStore.uploadInfo.stopped) {
					productStore.addConsoleText(`(${shopName}) [${market_code}] 업로드 중단`);

					return false;
				}

				// 스토어에 등록되어 있다면
				if (!market_item.cert) {
					// 상품 수정이 아니라면
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
					// 상품 수정이라면
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

				let count = 0;
				let images_coupang: any = [];

				// 카테고리 조회 API
				const category_body = {
					accesskey: accesskey,
					secretkey: secretkey,
					path:
						'/v2/providers/seller_api/apis/api/v1/marketplace/meta/category-related-metas/display-category-codes/' +
						market_item.cate_code,
					query: '',
					method: 'GET',
					data: {},
				};

				const itemInfo = productStore.itemInfo.items.find((v) => v.productCode === market_code)!;

				// 고시정보 설정
				const sillCode = itemInfo[`sillCode${data.DShopInfo.site_code}`]
					? itemInfo[`sillCode${data.DShopInfo.site_code}`]
					: '기타 재화';
				const sillData = itemInfo[`sillData${data.DShopInfo.site_code}`]
					? JSON.parse(itemInfo[`sillData${data.DShopInfo.site_code}`])
					: [
							{ code: '품명 및 모델명', name: '품명 및 모델명', type: 'input' },
							{ code: '인증/허가 사항', name: '인증/허가 사항', type: 'input' },
							{ code: '제조국(원산지)', name: '제조국(원산지)', type: 'input' },
							{ code: '제조자(수입자)', name: '제조자(수입자)', type: 'input' },
							{ code: '소비자상담 관련 전화번호', name: '소비자상담 관련 전화번호', type: 'input' },
					  ];

				let category_json = await coupangApiGateway(category_body as CoupangProps);
				let category_option_array: any = [];
				let category_sill_array: any = sillData.map((v) => {
					return {
						noticeCategoryName: sillCode,
						noticeCategoryDetailName: v.name,
						content: v.value ?? '상세설명참조',
					};
				});

				// 카테고리 필수 옵션 정보를 가져옴 -> 나중에 옵션정보 비교해서 교체
				for (let i in category_json['data']['attributes']) {
					if (category_json['data']['attributes'][i]['required'] === 'MANDATORY')
						category_option_array.push(category_json['data']['attributes'][i]['attributeTypeName']);
				}

				// 썸네일 이미지
				for (let i in market_item) {
					if (i.match(/img[0-9]/) && !i.includes('blob')) {
						if (market_item[i] !== '') {
							let output = {};
							let img = /^https?:/.test(market_item[i]) ? market_item[i] : 'http:' + market_item[i];

							if (i === 'img1')
								output = {
									imageOrder: 0,
									imageType: 'REPRESENTATION',
									vendorPath: img,
								};
							else {
								output = {
									imageOrder: count,
									imageType: 'DETAIL',
									vendorPath: img,
								};

								count++;
							}

							images_coupang.push(output);
						}
					}
				}

				let optn_array: any = [];
				let group: any = {};
				let words = await gql(QUERIES.SELECT_WORD_TABLES_BY_SOMEONE, {}, false);
				let words_list = words.data.selectWordTablesBySomeone;
				let words_restrict: any = {};

				for (let i in words_list) {
					if (words_list[i].findWord && !words_list[i].replaceWord)
						if (market_item.name3.includes(words_list[i].findWord)) words_restrict['상품명'] = words_list[i].findWord;
				}
				for (let i in market_optn) {
					if (market_optn[i].code === market_code) {
						for (let j in market_optn[i]) {
							if (j.includes('misc') && market_optn[i][j] !== '') group[market_optn[i][j]] = j.replace('misc', 'opt');
							if (j.includes('opt') && j !== 'optimg' && market_optn[i][j] !== '')
								for (let k in words_list) {
									if (words_list[k].findWord && !words_list[k].replaceWord)
										if (market_optn[i][j].includes(words_list[k].findWord))
											words_restrict['옵션명'] = words_list[k].findWord;
								}
						}
					}
				}

				// 금지어 검사 로직
				if (Object.keys(words_restrict).length > 0) {
					let message = '';

					for (let i in words_restrict) message += i + '에서 금지어(' + words_restrict[i] + ')가 발견되었습니다. ';

					productStore.addRegisteredFailed(Object.assign(market_item, { error: message }));
					productStore.addConsoleText(`(${shopName}) [${market_code}] 금지어 발견됨`);

					await sendCallback(commonStore, data, market_code, parseInt(product), 2, message);

					continue;
				}

				let option_count = Object.keys(group).length;
				let search_tags = market_item.keyword1 === '' ? [] : market_item.keyword1.split(',');

				// 태그 개수가 20개를 넘어가면 20개로 자름
				if (search_tags.length > 20) search_tags = search_tags.slice(0, 20);

				// 각 태그가 20자를 초과하면 20자로 자름
				for (let i in search_tags) {
					if (search_tags[i].length > 20) search_tags[i] = search_tags[i].slice(0, 20);
				}

				// 옵션이 있는경우
				if (option_count > 0) {
					let option_length = 0;

					for (let i in market_optn) {
						if (market_optn[i].code === market_code) {
							let optn_name = '';
							let optn_attrs: any = [];
							let optn_price = market_item.sprice + market_optn[i].price;
							let optn_price_original = market_item.wprice1 + market_optn[i].wprice;

							for (let j in group) {
								let optn_type = j;

								// 기본설정 - 쿠팡 대표이미지를 옵션이미지로 사용 시 동작
								// 옵션별 노출 최적화 로직 (옵션명 최적화)
								if (commonStore.user.userInfo!.coupangImageOpt !== 'N') {
									let j_formatted = j.toLowerCase();

									if (j_formatted.includes('색깔') || j_formatted.includes('color') || j_formatted.includes('색상'))
										j_formatted = '색상';
									if (
										j_formatted.includes('치수') ||
										j_formatted.includes('크기') ||
										j_formatted.includes('size') ||
										j_formatted.includes('사이즈')
									)
										j_formatted = '사이즈';

									for (let k in category_option_array) {
										let optn_matched = await matchesCharacter(j_formatted, category_option_array[k]);

										if (optn_matched.length > 1) optn_type = category_option_array[k];
									}
								}

								optn_attrs.push({
									editable: false,
									attributeTypeName: optn_type,
									attributeValueName: market_optn[i][group[j]],
									exposed: 'EXPOSED',
								});

								optn_name += market_optn[i][group[j]] + ' ';
							}

							let images_temp: any = [];

							// 옵션별 노출 최적화 로직 (옵션별 대표이미지 별도 설정)
							if (commonStore.user.userInfo!.coupangImageOpt !== 'N' && market_optn[i].optimg) {
								images_temp.push({
									imageOrder: 0,
									imageType: 'REPRESENTATION',
									vendorPath: market_optn[i].optimg,
								});

								let count = 0;

								for (let j in images_coupang) {
									images_temp.push({
										imageOrder: count,
										imageType: 'DETAIL',
										vendorPath: images_coupang[j].vendorPath,
									});

									count++;
								}
							}

							// 옵션정보 생성
							optn_array.push({
								salePrice: optn_price,
								originalPrice: optn_price_original,
								maximumBuyCount: market_optn[i].stock,
								isModelNoEmpty: false,
								images: images_temp.length > 0 ? images_temp : images_coupang,
								offerDescription: '',
								contents: [
									{
										contentsType: 'HTML',
										contentDetails: [
											{
												content: `${getStoreTraceCodeV3(market_item.id, data.DShopInfo.site_code)}${
													market_item.content2
												}${
													commonStore.user.userInfo!.descriptionShowTitle === 'Y'
														? `<br /><br /><div style="text-align: center;">${market_item.name3}</div><br /><br />`
														: `<br /><br />`
												}${transformContent(market_item.content1)}${market_item.content3}`,
												detailType: 'TEXT',
											},
										],
									},
								],
								skuInfo: {},
								skuChecked: false,
								globalInfo: {
									material: {},
								},
								itemName: optn_name,
								attributes: optn_attrs,
								saleAgentCommission: 10.5,
								notices: category_sill_array,
								maximumBuyForPerson: commonStore.user.userInfo?.coupangMaximumBuyForPerson
									? commonStore.user.userInfo!.coupangMaximumBuyForPerson
									: 0,
								maximumBuyForPersonPeriod: 1,
								certifications: [
									{
										certificationType: 'PURCHASED_WITHOUT_KC_MARK',
										certificationCode: '',
									},
								],
								taxType: 'TAX',
								adultOnly: 'EVERYONE',
								parallelImported: 'NOT_PARALLEL_IMPORTED',
								pccNeeded: true,
								outboundShippingTimeDay: commonStore.user.userInfo?.coupangOutboundShippingTimeDay
									? commonStore.user.userInfo!.coupangOutboundShippingTimeDay
									: 12,
								searchTags: search_tags,
								overseasPurchased: 'OVERSEAS_PURCHASED',
								unitCount: 1,
								externalVendorSku: market_code,
							});

							option_length += 1;
						}
					}

					// 총 옵션개수는 200개를 초과할 수 없음
					if (option_length > 200) {
						productStore.addRegisteredFailed(
							Object.assign(market_item, {
								error: '옵션 개수가 200개를 초과하는 상품은 등록하실 수 없습니다.',
							}),
						);
						productStore.addConsoleText(`(${shopName}) 상품 등록 실패`);

						await sendCallback(
							commonStore,
							data,
							market_code,
							parseInt(product),
							2,
							'옵션 개수가 200개를 초과하는 상품은 등록하실 수 없습니다.',
						);

						continue;
					}
				} else {
					// 단품인 경우
					optn_array.push({
						salePrice: market_item.sprice,
						originalPrice: market_item.wprice1,
						maximumBuyCount: market_item.stock,
						isModelNoEmpty: false,
						images: images_coupang,
						offerDescription: '',
						contents: [
							{
								contentsType: 'HTML',
								contentDetails: [
									{
										content: `${getStoreTraceCodeV3(market_item.id, data.DShopInfo.site_code)}${market_item.content2}${
											commonStore.user.userInfo?.descriptionShowTitle === 'Y'
												? `<br /><br /><div style="text-align: center;">${market_item.name3}</div><br /><br />`
												: `<br /><br />`
										}${transformContent(market_item.content1)}${market_item.content3}`,
										detailType: 'TEXT',
									},
								],
							},
						],
						skuInfo: {},
						skuChecked: false,
						globalInfo: {
							material: {},
						},
						itemName: '단일상품',
						attributes: [],
						saleAgentCommission: 10.5,
						notices: category_sill_array,
						maximumBuyForPerson: 0,
						maximumBuyForPersonPeriod: 1,
						certifications: [
							{
								certificationType: 'NOT_REQUIRED',
								certificationCode: '',
							},
						],
						taxType: 'TAX',
						adultOnly: 'EVERYONE',
						parallelImported: 'NOT_PARALLEL_IMPORTED',
						pccNeeded: true,
						outboundShippingTimeDay: 15,
						searchTags: search_tags,
						overseasPurchased: 'OVERSEAS_PURCHASED',
						unitCount: 1,
					});
				}

				let deliveryCharge = market_item.deliv_fee;
				let deliveryChargeOnReturn = commonStore.user.userInfo!.refundShippingFee;
				let returnCharge = commonStore.user.userInfo!.refundShippingFee;

				//유료배송비가 있는 경우
				if (deliveryCharge > 0) {
					if (market_item.sprice <= 20000)
						if (returnCharge > 15000) returnCharge = 15000;
						else if (market_item.sprice > 40000)
							if (returnCharge > 100000) returnCharge = 100000;
							else if (returnCharge > 20000) returnCharge = 20000;

					if (returnCharge > market_item.sprice) returnCharge = market_item.sprice;
				} else {
					let sumCharge1 = deliveryChargeOnReturn + returnCharge;

					//초도반품비 + 반품비
					if (market_item.sprice <= 20000)
						if (sumCharge1 > 15000) {
							deliveryChargeOnReturn = 7500;
							returnCharge = 7500;
						} else if (market_item.sprice > 40000)
							if (sumCharge1 > 100000) {
								deliveryChargeOnReturn = 50000;
								returnCharge = 50000;
							} else if (sumCharge1 > 20000) {
								deliveryChargeOnReturn = 20000;
								returnCharge = 20000;
							}

					let sumCharge2 = deliveryChargeOnReturn + returnCharge;

					if (sumCharge2 > market_item.sprice) {
						deliveryChargeOnReturn = Math.floor(market_item.sprice / 200) * 100;
						returnCharge = Math.floor(market_item.sprice / 200) * 100;
					}
				}

				// 상품 등록 API
				let product_body: any = {
					accesskey: accesskey,
					secretkey: secretkey,
					path: '/v2/providers/seller_api/apis/api/v1/marketplace/seller-products',
					query: '',
					method: 'POST',
					data: {
						displayCategoryCode: market_item.cate_code,
						sellerProductName: market_item.name3,
						vendorId: commonStore.user.userInfo!.coupangVendorId,
						saleStartedAt: toISO(new Date()),
						saleEndedAt: '2099-01-01T23:59:59',
						displayProductName: market_item.name3,
						brand: market_item.brand,
						generalProductName: market_item.name3,
						productGroup: '',
						deliveryMethod: 'AGENT_BUY',
						deliveryCompanyCode: coupangOutbound.remoteInfos[0].deliveryCode,
						deliveryChargeType: market_item.deliv_fee > 0 ? 'NOT_FREE' : 'FREE', // 배송비 유형
						deliveryCharge: deliveryCharge, // 배송비
						freeShipOverAmount: 0, // 무료배송 조건 금액
						deliveryChargeOnReturn: deliveryChargeOnReturn, // 초도반품비
						remoteAreaDeliverable: 'Y', // 도서산간 배송여부
						unionDeliveryType:
							commonStore.user.userInfo!.coupangUnionDeliveryType === 'Y' ? 'UNION_DELIVERY' : 'NOT_UNION_DELIVERY', // 묶음배송여부
						returnCenterCode: coupangInbound.returnCenterCode,
						returnChargeName: coupangInbound.shippingPlaceName,
						companyContactNumber: coupangOutbound.placeAddresses[0].companyContactNumber,
						returnZipCode: coupangInbound.placeAddresses[0].returnZipCode,
						returnAddress: coupangInbound.placeAddresses[0].returnAddress,
						returnAddressDetail: coupangInbound.placeAddresses[0].returnAddressDetail,
						returnCharge: returnCharge, // 반품비
						returnChargeVendor: 'N', // 착불 여부
						afterServiceInformation: commonStore.user.userInfo!.asInformation,
						afterServiceContactNumber: commonStore.user.userInfo!.asTel,
						outboundShippingPlaceCode: coupangOutbound.outboundShippingPlaceCode,
						vendorUserId: commonStore.user.userInfo!.coupangLoginId,
						requested: true, // 자동승인요청여부
						items: optn_array,
						requiredDocuments: [
							{
								templateName: '기타인증서류',
								vendorDocumentPath: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/BLANK.jpg',
							},
						],
						extraInfoMessage: '',
						manufacture: market_item.maker,
					},
				};

				// 업로드 중단 시
				if (commonStore.uploadInfo.stopped) {
					productStore.addConsoleText(`(${shopName}) [${market_code}] 업로드 중단`);

					return false;
				}

				// 상품 수정모드일 경우
				if (!market_item.cert && commonStore.uploadInfo.editable) {
					let callCount = 0; // 쿠팡 api 호출량 제한 정책으로 인한 카운트 값
					let productId = market_item.name2;

					if (!productId) {
						productStore.addRegisteredFailed(Object.assign(market_item, { error: '상품 ID를 찾을 수 없습니다.' }));
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 실패`);
						await sendCallback(commonStore, data, market_code, parseInt(product), 2, '상품 ID를 찾을 수 없습니다.');
						continue;
					}

					// 상품 조회 API
					let search_body: CoupangProps = {
						accesskey: accesskey!,
						secretkey: secretkey!,
						path: `/v2/providers/seller_api/apis/api/v1/marketplace/seller-products/${productId}`,
						query: '',
						method: 'GET',
						data: {},
					};

					let search_json = await coupangApiGateway(search_body);

					if (search_json.code !== 'SUCCESS') {
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 조회 실패`);
						continue;
					}

					productStore.addRegisteredQueue(market_item);
					productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 중...`);

					for (let i in search_json.data.items) {
						optn_array[i]['sellerProductItemId'] = search_json.data.items[i]['sellerProductItemId'];
						optn_array[i]['vendorItemId'] = search_json.data.items[i]['vendorItemId'];
					}

					// 옵션가 수정 - map사용
					// await Promise.all(
					// 	optn_array.map(async (v: any) => {
					// 		let detail_body = {
					// 			accesskey: accesskey,
					// 			secretkey: secretkey,
					// 			path: `/v2/providers/seller_api/apis/api/v1/marketplace/vendor-items/${v['vendorItemId']}/prices/${v['salePrice']}`,
					// 			query: '',
					// 			method: 'PUT',
					// 			data: {},
					// 		};

					// 		return await coupangApiGateway(detail_body);
					// 	}),
					// );

					// 판매가 수정 - map 사용
					// await Promise.all(
					// 	optn_array.map(async (v: any) => {
					// 		let detail_body = {
					// 			accesskey: accesskey,
					// 			secretkey: secretkey,
					// 			path: `/v2/providers/seller_api/apis/api/v1/marketplace/vendor-items/${v['vendorItemId']}/original-prices/${v['originalPrice']}`,
					// 			query: '',
					// 			method: 'PUT',
					// 			data: {},
					// 		};

					// 		return await coupangApiGateway(detail_body);
					// 	}),
					// );

					// 재고수량 수정 - map 사용
					// await Promise.all(
					// 	optn_array.map(async (v: any) => {
					// 		let detail_body = {
					// 			accesskey: accesskey,
					// 			secretkey: secretkey,
					// 			path: `/v2/providers/seller_api/apis/api/v1/marketplace/vendor-items/${v['vendorItemId']}/quantities/${v['maximumBuyCount']}`,
					// 			query: '',
					// 			method: 'PUT',
					// 			data: {},
					// 		};

					// 		return await coupangApiGateway(detail_body);
					// 	}),
					// );

					// 옵션가 수정 - for문 사용
					for (let v of optn_array) {
						let detail_body: CoupangProps = {
							accesskey: accesskey!,
							secretkey: secretkey!,
							path: `/v2/providers/seller_api/apis/api/v1/marketplace/vendor-items/${v['vendorItemId']}/prices/${v['salePrice']}`,
							query: '',
							method: 'PUT',
							data: {},
						};
						if (callCount >= 10) {
							await sleep(1000);
							callCount = 0;
						}
						coupangApiGateway(detail_body);
						callCount += 1;
					}

					// 판매가 수정 - for 사용
					for (let v of optn_array) {
						let detail_body: CoupangProps = {
							accesskey: accesskey!,
							secretkey: secretkey!,
							path: `/v2/providers/seller_api/apis/api/v1/marketplace/vendor-items/${v['vendorItemId']}/original-prices/${v['originalPrice']}`,
							query: '',
							method: 'PUT',
							data: {},
						};
						if (callCount >= 10) {
							await sleep(1000);
							callCount = 0;
						}
						coupangApiGateway(detail_body);
						callCount += 1;
					}

					// 재고수량 수정 - for 사용
					for (let v of optn_array) {
						let detail_body: CoupangProps = {
							accesskey: accesskey!,
							secretkey: secretkey!,
							path: `/v2/providers/seller_api/apis/api/v1/marketplace/vendor-items/${v['vendorItemId']}/quantities/${v['maximumBuyCount']}`,
							query: '',
							method: 'PUT',
							data: {},
						};
						if (callCount >= 10) {
							await sleep(1000);
							callCount = 0;
						}
						coupangApiGateway(detail_body);
						callCount += 1;
					}

					// 상품 수정 API
					product_body = {
						...product_body,
						data: {
							...product_body['data'],
							sellerProductId: productId,
							items: optn_array,
						},
						method: 'PUT',
					};

					let product_json = await coupangApiGateway(product_body);

					if (product_json.code === 'ERROR') {
						productStore.addRegisteredFailed(Object.assign(market_item, { error: product_json.message }));
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 실패`);

						await sendCallback(commonStore, data, market_code, parseInt(product), 2, product_json.message);
					} else {
						productStore.addRegisteredSuccess(Object.assign(market_item, { error: product_json.data.toString() }));
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 성공`);

						await sendCallback(commonStore, data, market_code, parseInt(product), 1, product_json.data.toString());
					}
				} else {
					productStore.addRegisteredQueue(market_item);
					productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 중...`);

					// console.log({ product_body });
					// productStore.addConsoleText(`(${shopName}) [${market_code}] 테스트`);
					// return false;
					let product_json = await coupangApiGateway(product_body);

					if (product_json.code === 'ERROR') {
						productStore.addRegisteredFailed(Object.assign(market_item, { error: product_json.message }));
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);

						await sendCallback(commonStore, data, market_code, parseInt(product), 2, product_json.message);
					} else {
						productStore.addRegisteredSuccess(Object.assign(market_item, { error: product_json.data.toString() }));
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 성공`);

						await sendCallback(commonStore, data, market_code, parseInt(product), 1, product_json.data.toString());
					}
				}
			} catch (e: any) {
				notificationByEveryTime(`(${shopName}) 업로드 도중 오류가 발생하였습니다. (${e.toString()})`);

				continue;
			}
		}
	} catch (e: any) {
		productStore.addConsoleText(`(${shopName}) 업로드 중단`);
		notificationByEveryTime(`(${shopName}) 업로드 도중 오류가 발생하였습니다. (${e.toString()})`);

		return false;
	}

	productStore.addConsoleText(`(${shopName}) 업로드 완료`);

	return true;
};

/** 쿠팡 상품등록해제 */
export const deleteCoupang = async (productStore: product, commonStore: common, data: any) => {
	console.time('등록해제 경과시간');
	if (!data) return false;

	let shopName = data.DShopInfo.site_name;
	let callCount = 0; // 호출량 제한용

	console.log(`(${shopName}) 등록정보:`, data);

	try {
		let accesskey = commonStore.user.userInfo!.coupangAccessKey;
		let secretkey = commonStore.user.userInfo!.coupangSecretKey;

		for (let product in data.DShopInfo.prod_codes) {
			try {
				let market_code = data.DShopInfo.prod_codes[product];
				let market_item = data.DShopInfo.DataDataSet.data[product];

				if (market_item.cert) continue;

				let productId = market_item.name2;
				let searchBody = {
					accesskey: accesskey,
					secretkey: secretkey,
					path: `/v2/providers/seller_api/apis/api/v1/marketplace/seller-products/${productId}`,
					query: '',
					method: 'GET',
					data: {},
				};
				if (callCount >= 10) {
					await sleep(1000);
					callCount = 0;
				}
				callCount += 1;
				let searchJson = await coupangApiGateway(searchBody);

				if (searchJson.code !== 'SUCCESS') continue;
				if (searchJson.data.status === 'DELETED') {
					const progressValue = Math.round(((parseInt(product) + 1) * 100) / data.DShopInfo.prod_codes.length);

					commonStore.setDisabledProgressValue(data.DShopInfo.site_code, progressValue);

					await gql(MUTATIONS.UNLINK_PRODUCT_STORE, {
						productId: market_item.id,
						siteCode: data.DShopInfo.site_code,
					});

					continue;
				}

				/** for사용 */
				for (let v of searchJson.data.items) {
					let stopBody = {
						accesskey: accesskey,
						secretkey: secretkey,
						path: `/v2/providers/seller_api/apis/api/v1/marketplace/vendor-items/${v.vendorItemId}/sales/stop`,
						query: '',
						method: 'PUT',
						data: {},
					};
					if (callCount >= 10) {
						await sleep(1000);
						callCount = 0;
					}
					await coupangApiGateway(stopBody);
					callCount += 1;
				}
				/** map사용 */
				// await Promise.all(
				// 	searchJson.data.items.map(async (v: any) => {
				// 		let stopBody = {
				// 			accesskey: accesskey,
				// 			secretkey: secretkey,
				// 			path: `/v2/providers/seller_api/apis/api/v1/marketplace/vendor-items/${v.vendorItemId}/sales/stop`,
				// 			query: '',
				// 			method: 'PUT',
				// 			data: {},
				// 		};
				// 		return await coupangApiGateway(stopBody); // 1
				// 	}),
				// );
				console.timeEnd('등록해제 경과시간'); // 제한전 : 504ms , // 제한후 : 4323ms

				let deleteBody = {
					accesskey: accesskey,
					secretkey: secretkey,
					path: `/v2/providers/seller_api/apis/api/v1/marketplace/seller-products/${productId}`,
					query: '',
					method: 'DELETE',
					data: {},
				};

				const deleteJson = await coupangApiGateway(deleteBody); // 2

				if (deleteJson.code === 'SUCCESS') {
					const progressValue = Math.round(((parseInt(product) + 1) * 100) / data.DShopInfo.prod_codes.length);

					commonStore.setDisabledProgressValue(data.DShopInfo.site_code, progressValue);

					await gql(MUTATIONS.UNLINK_PRODUCT_STORE, {
						productId: market_item.id,
						siteCode: data.DShopInfo.site_code,
					});
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
};

/** 쿠팡 신규주문 조회 */
export const newOrderCoupang = async (commonStore: common, shopInfo: UploadInfo['markets'][0]) => {
	const shopName = shopInfo.name;

	if (!shopInfo.connected || shopInfo.disabled) return [];

	try {
		let accesskey = commonStore.user.userInfo!.coupangAccessKey;
		let secretkey = commonStore.user.userInfo!.coupangSecretKey;
		let vendorId = commonStore.user.userInfo!.coupangVendorId;
		let dateStart = getClockOffset(0, 0, -7, 0, 0, 0);
		let dateEnd = getClock();

		// ACCEPT : 결제완료
		// INSTRUCT : 상품준비중
		// DEPARTURE : 배송지시
		// DELIVERING : 배송중
		// FINAL_DELIVERY : 배송완료
		// NONE_TRACKING : 업체 직접 배송(배송 연동 미적용), 추적불가

		const orderData = {
			accesskey: accesskey,
			secretkey: secretkey,
			path: `/v2/providers/openapi/apis/api/v4/vendors/${vendorId}/ordersheets`,
			query: `createdAtFrom=${dateStart.YY}-${dateStart.MM}-${dateStart.DD}&createdAtTo=${dateEnd.YY}-${dateEnd.MM}-${dateEnd.DD}&maxPerPage=50&status=ACCEPT`,
			method: 'GET',
			data: {},
		};

		let orderJson = await coupangApiGateway(orderData);

		if (orderJson.status === 403) {
			if (orderJson.message.includes('Not allowed IP'))
				floatingToast(
					`쿠팡 허용되지않은 IP 에러\n쿠팡 Seller에 등록된 IP와 사용중인 PC의 IP가 같은지 확인바랍니다.`,
					'failed',
				);
			if (orderJson.message.includes('Specified signature is expired'))
				floatingToast('쿠팡 API 에러\n사용중인 PC가 표준시간대로 설정되어있는지 확인바랍니다.', 'failed');
		}

		console.log({ orderJson });

		console.log(shopName, orderJson.data);

		let orderList: any = [];

		orderJson.data.map((v: any) => {
			v.orderItems.map((w: any) =>
				orderList.push({
					productId: w.productId,
					marketCode: shopInfo.code,
					marketName: shopInfo.name,
					taobaoOrderNo: null,
					productName: w.sellerProductName,
					productOptionContents: w.sellerProductItemName,
					sellerProductManagementCode: w.externalVendorSkuCode,
					orderNo: `${v.orderId}`,
					orderQuantity: w.shippingCount,
					orderMemberName: v.orderer.name,
					orderMemberTelNo: v.orderer.ordererNumber ?? v.overseaShippingInfoDto.ordererPhoneNumber,
					productPayAmt: w.orderPrice,
					deliveryFeeAmt: v.shippingPrice,
					individualCustomUniqueCode: v.overseaShippingInfoDto.personalCustomsClearanceCode,
					receiverName: v.receiver.name,
					receiverTelNo1: v.receiver.receiverNumber ?? v.receiver.safeNumber,
					receiverIntegratedAddress: v.receiver.addr1,
					receiverZipCode: v.receiver.postCode,
					productOrderMemo: v.parcelPrintMessage,
				}),
			);
		});

		return orderList;
	} catch (e) {
		console.log(shopName, e);

		return [];
	}
};

/** 쿠팡 발주확인 처리 */
export const productPreparedCoupang = async (commonStore: common, shopInfo: any) => {
	const shopName = shopInfo.name;
	const orderList = await getLocalStorage<any>('order');
	const coupangOrderList = orderList.filter((v: any) => v.marketCode === 'B378');

	let orderNo: any = [];

	coupangOrderList.map((v: any, i: number) => {
		console.log(`i = ${i},v = ${v}`);
		if (i < 50) orderNo.push(parseInt(v.orderNo));
	});

	//한번에 50개까지 가능
	if (!shopInfo.connected || shopInfo.disabled) return [];

	try {
		let accesskey = commonStore.user.userInfo!.coupangAccessKey;
		let secretkey = commonStore.user.userInfo!.coupangSecretKey;
		let vendorId = commonStore.user.userInfo!.coupangVendorId;

		const orderData = {
			accesskey: accesskey,
			secretkey: secretkey,
			path: `/v2/providers/openapi/apis/api/v4/vendors/${vendorId}/ordersheets/acknowledgement`,
			method: 'PUT',
			data: {
				vendorId: vendorId,
				shipmentBoxIds: orderNo,
			},
		};

		let orderJson = await coupangApiGateway(orderData);
		let orderList: any = [];

		console.log(shopName, orderJson.data);

		return orderList;
	} catch (e) {
		console.log(shopName, e);

		return [];
	}
};

/** 쿠팡 발송처리 주문조회 */
export const deliveryOrderCoupang = async (commonStore: common, shopInfo: any) => {
	const shopName = shopInfo.name;

	if (!shopInfo.connected || shopInfo.disabled) return [];

	try {
		let accesskey = commonStore.user.userInfo!.coupangAccessKey;
		let secretkey = commonStore.user.userInfo!.coupangSecretKey;
		let vendorId = commonStore.user.userInfo!.coupangVendorId;
		let dateStart = getClockOffset(0, 0, -7, 0, 0, 0);
		let dateEnd = getClock();

		// ACCEPT : 결제완료
		// INSTRUCT : 상품준비중
		// DEPARTURE : 배송지시
		// DELIVERING : 배송중
		// FINAL_DELIVERY : 배송완료
		// NONE_TRACKING : 업체 직접 배송(배송 연동 미적용), 추적불가

		const orderData = {
			accesskey: accesskey,
			secretkey: secretkey,
			path: `/v2/providers/openapi/apis/api/v4/vendors/${vendorId}/ordersheets`,
			query: `createdAtFrom=${dateStart.YY}-${dateStart.MM}-${dateStart.DD}&createdAtTo=${dateEnd.YY}-${dateEnd.MM}-${dateEnd.DD}&maxPerPage=50&status=DEPARTURE`,
			method: 'GET',
			data: {},
		};

		let orderJson = await coupangApiGateway(orderData);

		console.log(shopName, orderJson.data);

		let orderList: any = [];

		orderJson.data.map((v: any) => {
			v.orderItems.map((w: any) =>
				orderList.push({
					productId: w.productId,
					marketCode: shopInfo.code,
					marketName: shopInfo.name,
					taobaoOrderNo: null,
					productName: w.sellerProductName,
					productOptionContents: w.sellerProductItemName,
					sellerProductManagementCode: w.externalVendorSkuCode,
					orderNo: `${v.orderId}`,
					orderQuantity: w.shippingCount,
					orderMemberName: v.orderer.name,
					orderMemberTelNo: v.orderer.ordererNumber ?? v.overseaShippingInfoDto.ordererPhoneNumber,
					productPayAmt: w.orderPrice,
					deliveryFeeAmt: v.shippingPrice,
					individualCustomUniqueCode: v.overseaShippingInfoDto.personalCustomsClearanceCode,
					receiverName: v.receiver.name,
					receiverTelNo1: v.receiver.receiverNumber ?? v.receiver.safeNumber,
					receiverIntegratedAddress: v.receiver.addr1,
					receiverZipCode: v.receiver.postCode,
					productOrderMemo: v.parcelPrintMessage,
				}),
			);
		});

		return orderList;
	} catch (e) {
		console.log(shopName, e);

		return [];
	}
};
