import QUERIES from '../Main/GraphQL/Queries';
import gql from '../Main/GraphQL/Requests';
import MUTATIONS from '../Main/GraphQL/Mutations';

import {
	byteSlice,
	getClock,
	getStoreTraceCodeV1,
	notificationByEveryTime,
	sendCallback,
	transformContent,
} from './Common';
import { Buffer } from 'buffer';

const iconv = require('iconv-lite');
const xml2js = require('xml2js');

// 인터파크 API Endpoint 인터페이스
export async function interparkApiGateway(path: any) {
	const streetResp = await fetch(`http://ipss1.interpark.com/openapi/${path}`);
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

// 인터파크 상품등록
export async function uploadInterpark(productStore: any, commonStore: any, data: any) {
	if (!data) {
		return false;
	}

	let shopName = data.DShopInfo.site_name;

	console.log(`(${shopName}) 등록정보:`, data);

	try {
		// 루프 돌면서 상품정보 생성
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

				let group: any = {};

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

				for (let i in market_optn) {
					if (market_optn[i].code === market_code) {
						for (let j in market_optn[i]) {
							if (j.includes('misc') && market_optn[i][j] !== '') {
								group[market_optn[i][j]] = j.replace('misc', 'opt');
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
					}
				}

				// 금지어 검사
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

				let option_name = '';
				let option_value = '';

				let option_count = Object.keys(group).length;

				if (option_count > 0) {
					for (let i in group) {
						option_name += i;
						option_name += ',';
					}

					option_name = option_name.slice(0, option_name.length - 1);

					// 옵션개수별 입력형식이 다름
					if (option_count === 1) {
						for (let i in market_optn) {
							if (market_optn[i].code === market_code) {
								option_value += `{
								${market_optn[i].opt1}
								수량 <${market_optn[i].stock}>
								추가금액 <${market_optn[i].price}>
								옵션코드 <0-${i}>
								사용여부 <Y>
							}`;
							}
						}
					} else if (option_count === 2) {
						let option_data: any = {};
						let option_seq = -1;

						for (let i in market_optn) {
							if (market_optn[i].code === market_code) {
								if (!option_data.hasOwnProperty(market_optn[i].opt1)) {
									option_data[market_optn[i].opt1] = {
										name: '',
										stock: '',
										price: '',
										code: '',
										usable: '',
									};

									option_seq += 1;
								}

								let option_regex = market_optn[i].opt2.replace(/[\{\}\/.,|^<>\\\'\"]/g, '');

								option_data[market_optn[i].opt1].name += option_regex;
								option_data[market_optn[i].opt1].name += ',';

								option_data[market_optn[i].opt1].stock += market_optn[i].stock.toString();
								option_data[market_optn[i].opt1].stock += ',';

								option_data[market_optn[i].opt1].price += market_optn[i].price.toString();
								option_data[market_optn[i].opt1].price += ',';

								option_data[market_optn[i].opt1].code += `${option_seq}-${i}`;
								option_data[market_optn[i].opt1].code += ',';

								option_data[market_optn[i].opt1].usable += 'Y';
								option_data[market_optn[i].opt1].usable += ',';
							}
						}

						for (let i in option_data) {
							option_value += `{
							${i} <${option_data[i].name.slice(0, option_data[i].name.length - 1)}>
							수량 <${option_data[i].stock.slice(0, option_data[i].stock.length - 1)}>
							추가금액 <${option_data[i].price.slice(0, option_data[i].price.length - 1)}>
							옵션코드 <${option_data[i].code.slice(0, option_data[i].code.length - 1)}>
							사용여부 <${option_data[i].usable.slice(0, option_data[i].usable.length - 1)}>
						}`;
						}
					} else {
						productStore.addRegisteredFailed(
							Object.assign(market_item, {
								error: '옵션 유형이 3개 이상인 상품은 등록하실 수 없습니다.',
							}),
						);
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);

						await sendCallback(
							commonStore,
							data,
							market_code,
							parseInt(product),
							2,
							'옵션 유형이 3개 이상인 상품은 등록하실 수 없습니다.',
						);

						continue;
					}
				}

				if (!commonStore.uploadInfo.markets.find((v: any) => v.code === data.DShopInfo.site_code).video) {
					market_item.misc1 = '';
				}

				let desc = `
        ${getStoreTraceCodeV1(market_item.id, data.DShopInfo.site_code)}

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

				let search_tags = market_item.keyword1 === '' ? [] : market_item.keyword1.split(',');
				let search_tags_string = '';

				if (search_tags.length > 5) {
					search_tags = search_tags.slice(0, 5);
				}

				for (let i in search_tags) {
					search_tags_string += search_tags[i];
					search_tags_string += ',';
				}

				search_tags_string = search_tags_string.slice(0, search_tags_string.length - 1);

				let today = getClock();

				let name = byteSlice(market_item.name3, 120);

				const itemInfo = productStore.itemInfo.items.find((v: any) => v.productCode === market_code);

				const sillData = itemInfo[`sillData${data.DShopInfo.site_code}`]
					? JSON.parse(itemInfo[`sillData${data.DShopInfo.site_code}`])
					: [
							{ code: '3801', name: '품명 및 모델명', type: 'input' },
							{ code: '3802', name: '소유권 이전 조건', type: 'input' },
							{ code: '3803', name: '상품의 고장·분실·훼손 시 소비자 책임', type: 'input' },
							{ code: '3804', name: '중도 해약 시 환불 기준', type: 'input' },
							{ code: '3805', name: '소비자상담 관련 전화번호', type: 'input' },
							{ code: '3806', name: '비고', type: 'input' },
					  ];

				const sillResult = {
					info: sillData.map((v) => {
						return {
							infoSubNo: v.code,
							infoCd: v.name === '비고' ? 'M' : 'I',
							infoTx: v.value ?? '상세설명참조',
						};
					}),
				};

				// 상품 등록 API
				let product_body: any = {
					productId: market_item.id,

					data: {
						result: {
							title: 'Interpark Product API',
							description: '상품 등록',
							item: {
								prdStat: '01', // 상품상태: 새상품
								shopNo: '0000100000', // 상점번호 (고정)
								omDispNo: market_item.cate_code, // 카테고리번호
								prdNm: name, // 상품명
								hdelvMafcEntrNm: market_item.maker, // 제조사
								prdModelNo: market_item.model, // 모델명
								brandNm: market_item.brand, // 브랜드
								prdOriginTp: '수입산', // 원산지
								taxTp: '01', // 부가면세상품: 과세상품
								ordAgeRstrYn: 'N', // 성인용품여부
								saleStatTp: '01', // 상품상태: 판매중
								saleUnitcost: market_item.sprice, // 판매가
								saleLmtQty: market_item.stock, // 재고수량
								saleStrDts: `${today.YY}${today.MM}${today.DD}`, // 판매시작일
								saleEndDts: 99991231, // 판매종료일
								proddelvCostUseYn: 'Y', // 유료배송비: 사용
								prdBasisExplanEd: desc, // 상세설명
								zoomImg: market_item.img1, // 대표이미지
								detailImg: `${market_item.img2},${market_item.img3},${market_item.img4}`, // 추가이미지
								prdPostfix: '', // 뒷문구 (최대 80byte)
								prdKeywd: '', // 쇼핑태그 - 최대 4개, 콤마로 구분
								optPrirTp: '01', // 선택형 옵션 정렬: 등록순
								selOptName: option_name, // 옵션명
								prdOption: option_value, // 옵션값
								delvCost: market_item.deliv_fee, // 유료배송비
								delvAmtPayTpCom: '02', // 배송비 결제 방식: 선불
								delvCostApplyTp: '02', // 배송비 적용 방식: 조건 없음
								freedelvStdCnt: 0, // 무료배송기준 수량: 미사용
								ippSubmitYn: 'Y', // 가격비교 등록 여부: 사용
								originPrdNo: market_code, // 판매자상품코드
								prdrtnCostUseYn: 'Y', // 반품비: 사용
								rtndelvCost: commonStore.user.userInfo.refundShippingFee, // 반품비
								abroadBsYn: 'Y', // 해외구매대행상품 여부
								prdCertStatus: 'N', // 상품인증여부: 인증대상아님
								asInfo: commonStore.user.userInfo.asInformation, // A/S 정보
								entrDcUseYn: 'N',
								// "entrDcUseYn": market_item.nprice > 0 || market_data.userInfo.discountAmount > 0 ? "Y" : "N",						// 즉시할인 여부
								// "entrDcTp": market_item.nprice > 0 || market_data.userInfo.discountUnitType === 'WON' === "WON" ? "2" : "1",		// 즉시할인 할인구분 (1: 정률, 2: 정액)
								// "entrDcNum": market_item.nprice > 0 ? market_item.nprice : market_data.userInfo.discountAmount,						// 즉시할인 금액 (판매가의 70%까지 등록 가능, 정률일경우 소수점 둘째짜리까지 가능)
								jejuetcDelvCostUseYn: 'Y', //제주,도서비 사용
								jejuDelvCost: commonStore.user.userInfo.additionalShippingFeeJeju, //제주 비용
								etcDelvCost: commonStore.user.userInfo.additionalShippingFeeJeju, //도서 비용
								prdinfoNoti: sillResult,
							},
						},
					},
				};

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

					product_body.data.result.item.prdNo = productId;

					productStore.addRegisteredQueue(market_item);
					productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 중...`);

					const xmlResp = await fetch(`${process.env.SELLFORYOU_API_SERVER}/callback/xml_upload`, {
						headers: {
							'Content-Type': 'application/json',
						},

						method: 'POST',

						body: JSON.stringify(product_body),
					});

					const xmlText = await xmlResp.text();

					let product_json: any = await interparkApiGateway(
						`product/ProductAPIService.do?_method=UpdateProductAPIData&citeKey=${commonStore.user.userInfo.interparkEditCertKey}&secretKey=${commonStore.user.userInfo.interparkEditSecretKey}&dataUrl=${process.env.SELLFORYOU_MINIO_HTTP}/${xmlText}`,
					);

					if (product_json.result.hasOwnProperty('error')) {
						productStore.addRegisteredFailed(
							Object.assign(market_item, {
								error: product_json.result.error[0].explanation[0],
							}),
						);
						productStore.addConsoleText(`(${shopName}) 상품 수정 실패`);

						await sendCallback(
							commonStore,
							data,
							market_code,
							parseInt(product),
							2,
							product_json.result.error[0].explanation[0],
						);
					} else {
						productStore.addRegisteredSuccess(
							Object.assign(market_item, {
								error: product_json.result.success[0].prdNo[0],
							}),
						);
						productStore.addConsoleText(`(${shopName}) 상품 수정 성공`);

						await sendCallback(
							commonStore,
							data,
							market_code,
							parseInt(product),
							1,
							product_json.result.success[0].prdNo[0],
						);
					}
				} else {
					productStore.addRegisteredQueue(market_item);
					productStore.addConsoleText(`(${shopName}) 상품 등록 중...`);

					const xmlResp = await fetch(`${process.env.SELLFORYOU_API_SERVER}/callback/xml_upload`, {
						headers: {
							'Content-Type': 'application/json',
						},

						method: 'POST',

						body: JSON.stringify(product_body),
					});

					const xmlText = await xmlResp.text();

					let product_json: any = await interparkApiGateway(
						`product/ProductAPIService.do?_method=InsertProductAPIData&citeKey=${commonStore.user.userInfo.interparkCertKey}&secretKey=${commonStore.user.userInfo.interparkSecretKey}&dataUrl=${process.env.SELLFORYOU_MINIO_HTTP}/${xmlText}`,
					);

					if (product_json.result.hasOwnProperty('error')) {
						productStore.addRegisteredFailed(
							Object.assign(market_item, {
								error: product_json.result.error[0].explanation[0],
							}),
						);
						productStore.addConsoleText(`(${shopName}) 상품 등록 실패`);

						await sendCallback(
							commonStore,
							data,
							market_code,
							parseInt(product),
							2,
							product_json.result.error[0].explanation[0],
						);
					} else {
						productStore.addRegisteredSuccess(
							Object.assign(market_item, {
								error: product_json.result.success[0].prdNo[0],
							}),
						);
						productStore.addConsoleText(`(${shopName}) 상품 등록 성공`);

						await sendCallback(
							commonStore,
							data,
							market_code,
							parseInt(product),
							1,
							product_json.result.success[0].prdNo[0],
						);
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

// 인터파크 상품 등록해제
export async function deleteInterpark(productStore: any, commonStore: any, data: any) {
	if (!data) {
		return false;
	}

	let shopName = data.DShopInfo.site_name;

	console.log(`(${shopName}) 등록정보:`, data);

	try {
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

				let productBody: any = {
					productId: market_item.id,

					data: {
						result: {
							title: 'Interpark Product API',
							description: '상품 삭제',
							item: {
								prdNo: productId,
								prdNm: 'TEST',
								saleStatTp: '98',
								saleUnitcost: 1000,
							},
						},
					},
				};

				const xmlResp = await fetch(`${process.env.SELLFORYOU_API_SERVER}/callback/xml_upload`, {
					headers: {
						'Content-Type': 'application/json',
					},

					method: 'POST',

					body: JSON.stringify(productBody),
				});

				const xmlText = await xmlResp.text();

				const deleteJson: any = await interparkApiGateway(
					`product/ProductAPIService.do?_method=UpdateProductAPIData&citeKey=${commonStore.user.userInfo.interparkEditCertKey}&secretKey=${commonStore.user.userInfo.interparkEditSecretKey}&dataUrl=${process.env.SELLFORYOU_MINIO_HTTP}/${xmlText}`,
				);

				if (!deleteJson.result.error) {
					const progressValue = Math.round(((parseInt(product) + 1) * 100) / data.DShopInfo.prod_codes.length);

					commonStore.setDisabledProgressValue(data.DShopInfo.site_code, progressValue);

					await gql(MUTATIONS.UNLINK_PRODUCT_STORE, {
						productId: market_item.id,
						siteCode: data.DShopInfo.site_code,
					});
				} else {
					console.log(deleteJson.result.error);

					if (deleteJson.result.error[0].code[0] === '000|016') {
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

// 인터파크 신규주문조회 (API 승인 절차가 까다롭고, 제한사항이 많아 구현불가)
export async function newOrderInterpark(commonStore: any, shopInfo: any) {
	const shopName = shopInfo.name;

	if (!shopInfo.connected || shopInfo.disabled) {
		return [];
	}

	try {
		console.log(shopName, []);

		return [];
	} catch (e) {
		console.log(shopName, e);

		return [];
	}
}
