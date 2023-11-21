import MUTATIONS from '../Main/GraphQL/Mutations';
import QUERIES from '../Main/GraphQL/Queries';
import gql from '../Main/GraphQL/Requests';

import { getLocalStorage } from './ChromeAsync';
import {
	byteSlice,
	getClock,
	getClockOffset,
	getStoreTraceCodeV2,
	notificationByEveryTime,
	sendCallback,
	transformContent,
} from './Common';

// 롯데온 상품등록해제
export async function deleteLotteon(productStore: any, commonStore: any, data: any) {
	if (!data) {
		return false;
	}

	let shopName = data.DShopInfo.site_name;

	console.log(`(${shopName}) 등록정보:`, data);

	try {
		let transId = commonStore.user.userInfo.lotteonVendorId;
		let apiKey = commonStore.user.userInfo.lotteonApiKey;

		// 루프돌면서 상품정보 생성
		for (let product in data.DShopInfo.prod_codes) {
			try {
				let market_item = data.DShopInfo.DataDataSet.data[product];

				if (market_item.cert) {
					continue;
				}

				let productId = market_item.name2;

				if (!productId) {
					continue;
				}

				const deleteBody: any = {
					spdLst: [
						{
							trGrpCd: 'SR',
							trNo: transId,
							lrtrNo: '',
							spdNo: productId,
							slStatCd: 'END',
						},
					],
				};

				// 상품 삭제 API
				const deleteResp: any = await fetch('https://openapi.lotteon.com/v1/openapi/product/v1/product/status/change', {
					headers: {
						Authorization: `Bearer ${apiKey}`,
						Accept: 'application/json',
						'Accept-Language': 'ko',
						'X-Timezone': 'GMT+09:00',
						'Content-Type': 'application/json',
					},

					body: JSON.stringify(deleteBody),

					method: 'POST',
				});

				const deleteJson = await deleteResp.json();

				if (deleteJson.returnCode !== '0000') {
					continue;
				} else {
					if (deleteJson.data[0].resultCode !== '0000') {
						if (deleteJson.data[0].resultCode === '8888') {
							const progressValue = Math.round(((parseInt(product) + 1) * 100) / data.DShopInfo.prod_codes.length);

							commonStore.setDisabledProgressValue(data.DShopInfo.site_code, progressValue);

							await gql(MUTATIONS.UNLINK_PRODUCT_STORE, {
								productId: market_item.id,
								siteCode: data.DShopInfo.site_code,
							});
						}

						continue;
					} else {
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

// 롯데온 상품등록
export async function uploadLotteon(productStore: any, commonStore: any, data: any) {
	if (!data) {
		return false;
	}

	let shopName = data.DShopInfo.site_name;

	console.log(`(${shopName}) 등록정보:`, data);

	try {
		const time = getClock();

		let transId = commonStore.user.userInfo.lotteonVendorId;
		let apiKey = commonStore.user.userInfo.lotteonApiKey;

		let outbound = null;
		let inbound = null;

		try {
			// 출고지 조회 API
			let boundResp = await fetch(`https://openapi.lotteon.com/v1/openapi/contract/v1/dvp/getDvpListSr`, {
				headers: {
					Authorization: `Bearer ${apiKey}`,
					Accept: 'application/json',
					'Accept-Language': 'ko',
					'X-Timezone': 'GMT+09:00',
					'Content-Type': 'application/json',
				},

				method: 'POST',

				body: JSON.stringify({
					afflTrCd: transId,
				}),
			});

			let boundJson = await boundResp.json();

			for (let i in boundJson.data) {
				if (boundJson.data[i].useYn === 'Y') {
					switch (boundJson.data[i].dvpTypCd) {
						case '01': {
							inbound = boundJson.data[i].dvpNo;

							break;
						}

						case '02': {
							outbound = boundJson.data[i].dvpNo;

							break;
						}

						default:
							break;
					}
				}
			}
		} catch (e) {
			productStore.addConsoleText(`(${shopName}) 스토어 연동정보 확인 실패`);
			notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

			return false;
		}

		if (!outbound) {
			productStore.addConsoleText(`(${shopName}) 출고지 조회 실패`);
			notificationByEveryTime(`(${shopName}) 출고지 조회에 실패하였습니다.`);

			return false;
		}

		if (!inbound) {
			productStore.addConsoleText(`(${shopName}) 반품지 조회 실패`);
			notificationByEveryTime(`(${shopName}) 반품지 조회에 실패하였습니다.`);

			return false;
		}

		const policy =
			commonStore.uploadInfo.markets.find((v: any) => v.code === data.DShopInfo.site_code)?.policyInfo ?? null;

		if (!policy) {
			productStore.addConsoleText(`(${shopName}) 발송정책 조회 실패`);
			notificationByEveryTime(`(${shopName}) 발송정책 조회에 실패하였습니다.`);

			return;
		}

		let additionalPolicy = null;

		// 배송정책 조회 API
		let policyResp = await fetch(`https://openapi.lotteon.com/v1/openapi/contract/v1/dvl/getDvCstListSr`, {
			headers: {
				Authorization: `Bearer ${apiKey}`,
				Accept: 'application/json',
				'Accept-Language': 'ko',
				'X-Timezone': 'GMT+09:00',
				'Content-Type': 'application/json',
			},

			method: 'POST',

			body: JSON.stringify({
				afflTrCd: transId,
			}),
		});

		let policyJson = await policyResp.json();

		for (let i in policyJson.data) {
			if (policyJson.data[i].useYn !== 'Y') {
				continue;
			}

			if (policyJson.data[i].dvCstTypCd === 'ADTN_DV_CST') {
				if (additionalPolicy) {
					continue;
				}

				additionalPolicy = policyJson.data[i].dvCstPolNo;
			}
		}

		// 루프돌면서 상품 정보 생성
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

				let images_lotteon: any = [];

				let categoryResp = await fetch(
					`https://onpick-api.lotteon.com/cheetah/econCheetah.ecn?job=cheetahStandardCategory&filter_1=${market_item.cate_code}`,
					{
						headers: {
							Authorization: `Bearer ${apiKey}`,
							Accept: 'application/json',
							'Accept-Language': 'ko',
							'X-Timezone': 'GMT+09:00',
							'Content-Type': 'application/json',
						},

						method: 'GET',
					},
				);

				let categoryJson = await categoryResp.json();

				for (let i in market_item) {
					if (i.match(/img[0-9]/) && !i.includes('blob')) {
						if (market_item[i] !== '') {
							let output: any = {};

							let img = /^https?:/.test(market_item[i]) ? market_item[i] : 'http:' + market_item[i];

							if (i === 'img1') {
								output = {
									epsrTypCd: 'IMG',
									epsrTypDtlCd: 'IMG_SQRE',
									origImgFileNm: img,
									rprtImgYn: 'Y',
								};
							} else {
								output = {
									epsrTypCd: 'IMG',
									epsrTypDtlCd: 'IMG_SQRE',
									origImgFileNm: img,
									rprtImgYn: 'N',
								};
							}

							images_lotteon.push(output);
						}
					}
				}

				let option_data: any = [];
				let option_data_count = 1;

				let option_list: any = [];
				let option_list_count = 1;

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

				let option_length = Object.keys(group).length;

				if (option_length > 0) {
					for (let i in market_optn) {
						if (market_optn[i].code === market_code) {
							let option_detail: any = [];

							if (market_optn[i].misc1 && market_optn[i].opt1) {
								option_detail.push({
									optNm: market_optn[i].misc1,
									optVal: market_optn[i].opt1,
								});
							}

							if (market_optn[i].misc2 && market_optn[i].opt2) {
								option_detail.push({
									optNm: market_optn[i].misc2,
									optVal: market_optn[i].opt2,
								});
							}

							if (market_optn[i].misc3 && market_optn[i].opt3) {
								option_detail.push({
									optNm: market_optn[i].misc3,
									optVal: market_optn[i].opt3,
								});
							}

							option_data.push({
								eitmNo: market_code,
								dpYn: 'Y',
								sortSeq: option_data_count,
								itmOptLst: option_detail,
								itmImgLst: images_lotteon,
								slPrc: market_item.sprice + market_optn[i].price,
								stkQty: market_optn[i].stock,
							});

							option_data_count += 1;
						}
					}

					for (let i in group) {
						let option_type: any = [];
						let option_group: any = {};

						for (let j in market_optn) {
							if (market_optn[j].code === market_code) {
								option_group[market_optn[j][group[i]]] = '';
							}
						}

						let option_sequence = 1;

						for (let j in option_group) {
							option_type.push({
								optValSeq: option_sequence,
								optVal: j,
							});

							option_sequence += 1;
						}

						option_list.push({
							optSeq: option_list_count,
							optNm: i,
							optValSrtLst: option_type,
						});

						option_list_count += 1;
					}
				} else {
					option_data.push({
						eitmNo: market_code,
						dpYn: 'Y',
						sortSeq: 1,
						itmOptLst: [
							{
								optNm: '단일상품',
								optVal: '단일상품',
							},
						],
						itmImgLst: images_lotteon,
						slPrc: market_item.sprice,
						stkQty: market_item.stock,
					});

					option_list.push({
						optSeq: 1,
						optNm: '단일상품',
						optValSrtLst: [],
					});
				}

				let video_lotteon: any = [];

				if (!commonStore.uploadInfo.markets.find((v: any) => v.code === data.DShopInfo.site_code).video) {
					market_item.misc1 = '';
				}

				if (market_item.misc1) {
					video_lotteon = [
						{
							fileTypCd: 'PD',
							fileDvsCd: 'VDO_URL',
							origFileNm: /^https?/.test(market_item.misc1) ? market_item.misc1 : `https:${market_item.misc1}`,
						},
					];
				}

				const itemInfo = productStore.itemInfo.items.find((v: any) => v.productCode === market_code);

				const sillCode = itemInfo[`sillCode${data.DShopInfo.site_code}`]
					? itemInfo[`sillCode${data.DShopInfo.site_code}`]
					: '38';
				const sillData = itemInfo[`sillData${data.DShopInfo.site_code}`]
					? JSON.parse(itemInfo[`sillData${data.DShopInfo.site_code}`])
					: [
							{ code: '0210', name: '1. 품명 및 모델명', type: 'input' },
							{
								code: '1400',
								name: '2. 법에 의한 인증ㆍ허가 등을 받았음을 확인할 수 있는 경우 그에 대한 사항',
								type: 'input',
							},
							{ code: '1420', name: '3. 제조국 또는 원산지', type: 'input' },
							{ code: '0070', name: '4. 제조자, 수입품의 경우 수입자를rn함께 표기', type: 'input' },
							{ code: '1440', name: '5. A/S 책임자와 전화번호 또는 소비자 상담 관련 전화번호', type: 'input' },
					  ];

				const sillResult = {
					pdItmsCd: sillCode,
					pdItmsArtlLst: sillData.map((v) => {
						return {
							pdArtlCd: v.code,
							pdArtlCnts: v.value ?? '상세설명참조',
						};
					}),
				};

				const productBody: any = {
					spdLst: [
						{
							trGrpCd: 'SR',
							trNo: transId,
							lrtrNo: '',
							scatNo: market_item.cate_code,

							dcatLst: [
								{
									mallCd: 'LTON',
									lfDcatNo: categoryJson.itemList[0].data.disp_list[0].disp_cat_id,
								},
							],

							epdNo: '',
							slTypCd: 'GNRL',
							pdTypCd: 'GNRL_GNRL',
							spdNm: name,
							mfcrNm: market_item.maker, // 제조사
							oplcCd: '상품상세 참조',
							mdlNo: market_item.model, // 모델명
							barCd: '',
							tdfDvsCd: '01',
							slStrtDttm: `${time.YY}${time.MM}${time.DD}${time.hh}${time.mm}${time.ss}`,
							slEndDttm: '99991231235959',

							pdItmsInfo: sillResult,

							purPsbQtyInfo: {
								itmByMinPurYn: 'N',
								itmByMaxPurPsbQtyYn: 'N',
							},

							ageLmtCd: '0',
							prstPsbYn: 'N',
							prstPckPsbYn: 'N',
							prstMsgPsbYn: 'N',
							prcCmprEpsrYn: 'Y',
							bookCultCstDdctYn: 'N',
							isbnCd: '',
							impDvsCd: 'NONE',
							cshbltyPdYn: 'N',
							gftvShpCd: '',
							dnDvPdYn: 'N',
							toysPdYn: 'N',
							intgSlPdNo: '',
							nmlPdYn: 'N',
							prmmPdYn: 'N',
							otltPdYn: 'N',
							prmmInstPdYn: 'N',
							brkHmapPkcpPsbYn: 'N',
							mvCmcoCd: '',
							ctrtTypCd: 'A',
							pdStatCd: 'NEW',
							dpYn: 'Y',
							ltonDpYn: 'Y',
							// "scKwdLst": [
							// 	"검색키워드1",
							// 	"검색키워드2",
							// 	"검색키워드3"
							// ],
							pdFileLst: video_lotteon,

							epnLst: [
								{
									pdEpnTypCd: 'DSCRP',
									cnts: `${getStoreTraceCodeV2(market_item.id, data.DShopInfo.site_code)}${market_item.content2}${
										commonStore.user.userInfo.descriptionShowTitle === 'Y'
											? `<br /><br /><div style="text-align: center;">${market_item.name3}</div><br /><br />`
											: `<br /><br />`
									}${transformContent(market_item.content1)}${market_item.content3}`,
								},
							],

							cnclPsbYn: 'Y',
							dmstOvsDvDvsCd: data.DShopInfo.site_code === 'A524' ? 'OVS' : 'DMST',
							pstkYn: 'N',
							dvProcTypCd: 'LO_ENTP',
							dvPdTypCd: 'GNRL',
							sndBgtNday: data.DShopInfo.site_code === 'A524' ? '15' : '3',

							sndBgtDdInfo: {
								nldySndCloseTm: '1300',
								satSndPsbYn: 'Y',
								satSndCloseTm: '1200',
							},

							dvRgsprGrpCd: 'GN000',
							dvMnsCd: 'DPCL',
							owhpNo: outbound,
							hdcCd: '9999',
							dvCstPolNo: policy,
							adtnDvCstPolNo: additionalPolicy ?? '',
							cmbnDvPsbYn: 'N',
							dvCstStdQty: 0,
							qckDvUseYn: 'N',
							crdayDvPsbYn: 'N',
							hpDdDvPsbYn: 'N',
							saveTypCd: 'NONE',
							shopCnvMsgPsbYn: 'N',
							rgnLmtPdYn: 'N',
							fprdDvPsbYn: 'N',
							spcfSqncPdYn: 'N',
							rtngPsbYn: 'Y',
							xchgPsbYn: 'Y',
							echgPsbYn: 'N',
							cmbnRtngPsbYn: 'N',
							rtngHdcCd: '9999',
							rtngRtrvPsbYn: 'Y',
							rtrvTypCd: 'ENTP_RTRV',
							rtrpNo: inbound,
							stkMgtYn: 'Y',
							sitmYn: option_length > 0 ? 'Y' : 'N',
							optSrtLst: option_list,
							itmLst: option_data,
							adtnPdYn: 'N',
						},
					],
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

					const selectBody = {
						trGrpCd: 'SR',
						trNo: transId,
						lrtrNo: '',
						spdNo: productId,
					};

					// 상품 조회 API
					const selectResp = await fetch(`https://openapi.lotteon.com/v1/openapi/product/v1/product/detail`, {
						headers: {
							Authorization: `Bearer ${apiKey}`,
							Accept: 'application/json',
							'Accept-Language': 'ko',
							'X-Timezone': 'GMT+09:00',
							'Content-Type': 'application/json',
						},

						body: JSON.stringify(selectBody),

						method: 'POST',
					});

					const selectJson = await selectResp.json();

					productBody.spdLst[0].spdNo = productId;

					let itmPrcLst = [];
					let itmStkLst = [];

					itmPrcLst = selectJson.data.itmLst.map((v, i) => {
						return {
							trGrpCd: 'SR',
							trNo: transId,
							lrtrNo: '',
							spdNo: productId,
							sitmNo: v.sitmNo,
							slPrc: productBody.spdLst[0].itmLst[i].slPrc,
							hstStrtDttm: `${time.YY}${time.MM}${time.DD}${time.hh}${time.mm}${time.ss}`,
							hstEndDttm: '99991231235959',
						};
					});

					// 판매가 수정 API
					const priceResp = await fetch('https://openapi.lotteon.com/v1/openapi/product/v1/item/price/change', {
						headers: {
							Authorization: `Bearer ${apiKey}`,
							Accept: 'application/json',
							'Accept-Language': 'ko',
							'X-Timezone': 'GMT+09:00',
							'Content-Type': 'application/json',
						},

						body: JSON.stringify({ itmPrcLst }),

						method: 'POST',
					});

					const priceJson = await priceResp.json();

					itmStkLst = selectJson.data.itmLst.map((v, i) => {
						return {
							trGrpCd: 'SR',
							trNo: transId,
							lrtrNo: '',
							spdNo: productId,
							sitmNo: v.sitmNo,
							stkQty: productBody.spdLst[0].itmLst[i].stkQty,
						};
					});

					// 재고수량 수정 API
					const stockResp = await fetch('https://openapi.lotteon.com/v1/openapi/product/v1/item/stock/change', {
						headers: {
							Authorization: `Bearer ${apiKey}`,
							Accept: 'application/json',
							'Accept-Language': 'ko',
							'X-Timezone': 'GMT+09:00',
							'Content-Type': 'application/json',
						},

						body: JSON.stringify({ itmStkLst }),

						method: 'POST',
					});

					const stockJson = await stockResp.json();

					productBody.spdLst[0].itmLst = [];

					productStore.addConsoleText(`(${shopName}) 상품 수정 중...`);
					productStore.addRegisteredQueue(market_item);

					// 상품 수정 API
					let productResp = await fetch(
						'https://openapi.lotteon.com/v1/openapi/product/v1/product/modification/request',
						{
							headers: {
								Authorization: `Bearer ${apiKey}`,
								Accept: 'application/json',
								'Accept-Language': 'ko',
								'X-Timezone': 'GMT+09:00',
								'Content-Type': 'application/json',
							},

							body: JSON.stringify(productBody),

							method: 'POST',
						},
					);

					let productJson = await productResp.json();

					if (productJson.returnCode !== '0000') {
						productStore.addRegisteredFailed(Object.assign(market_item, { error: productJson.message }));
						productStore.addConsoleText(`(${shopName}) 상품 수정 실패`);

						await sendCallback(commonStore, data, market_code, parseInt(product), 2, productJson.message);
					} else {
						if (productJson.data[0].resultCode !== '0000') {
							productStore.addRegisteredFailed(
								Object.assign(market_item, {
									error: productJson.data[0].resultMessage,
								}),
							);
							productStore.addConsoleText(`(${shopName}) 상품 수정 실패`);

							await sendCallback(
								commonStore,
								data,
								market_code,
								parseInt(product),
								2,
								productJson.data[0].resultMessage,
							);
						} else {
							productStore.addRegisteredSuccess(Object.assign(market_item, { error: productJson.data[0].spdNo }));
							productStore.addConsoleText(`(${shopName}) 상품 수정 성공`);

							await sendCallback(commonStore, data, market_code, parseInt(product), 1, productJson.data[0].spdNo);
						}
					}
				} else {
					productStore.addConsoleText(`(${shopName}) 상품 등록 중...`);
					productStore.addRegisteredQueue(market_item);

					// 상품 등록 API
					let productResp = await fetch(
						'https://openapi.lotteon.com/v1/openapi/product/v1/product/registration/request',
						{
							headers: {
								Authorization: `Bearer ${apiKey}`,
								Accept: 'application/json',
								'Accept-Language': 'ko',
								'X-Timezone': 'GMT+09:00',
								'Content-Type': 'application/json',
							},

							body: JSON.stringify(productBody),

							method: 'POST',
						},
					);

					let productJson = await productResp.json();

					if (productJson.returnCode !== '0000') {
						productStore.addRegisteredFailed(Object.assign(market_item, { error: productJson.message }));
						productStore.addConsoleText(`(${shopName}) 상품 등록 실패`);

						await sendCallback(commonStore, data, market_code, parseInt(product), 2, productJson.message);
					} else {
						if (productJson.data[0].resultCode !== '0000') {
							productStore.addRegisteredFailed(
								Object.assign(market_item, {
									error: productJson.data[0].resultMessage,
								}),
							);
							productStore.addConsoleText(`(${shopName}) 상품 등록 실패`);

							await sendCallback(
								commonStore,
								data,
								market_code,
								parseInt(product),
								2,
								productJson.data[0].resultMessage,
							);
						} else {
							productStore.addRegisteredSuccess(Object.assign(market_item, { error: productJson.data[0].spdNo }));
							productStore.addConsoleText(`(${shopName}) 상품 등록 성공`);

							await sendCallback(commonStore, data, market_code, parseInt(product), 1, productJson.data[0].spdNo);
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

// 롯데온 신규주문조회
export async function newOrderLotteon(commonStore: any, shopInfo: any) {
	const shopName = shopInfo.name;

	if (!shopInfo.connected || shopInfo.disabled) {
		return [];
	}

	try {
		let apiKey = commonStore.user.userInfo.lotteonApiKey;

		let results: any = [];

		for (let i = -1; i >= -7; i--) {
			let dateStart = getClockOffset(0, 0, i, 0, 0, 0);
			let dateEnd = getClockOffset(0, 0, i + 1, 0, 0, 0);

			//조회기간 1일 초과불가능
			const orderBody: any = {
				srchStrtDt: `${dateStart.YY}${dateStart.MM}${dateStart.DD}${dateStart.hh}${dateStart.mm}${dateStart.ss}`,
				srchEndDt: `${dateEnd.YY}${dateEnd.MM}${dateEnd.DD}${dateEnd.hh}${dateEnd.mm}${dateEnd.ss}`,
				// "odNo": "",
				odPrgsStepCd: '11',
				// "odTypCd": "",
				// "ifCplYN": "N"
			};
			const orderResp: any = await fetch(
				'https://openapi.lotteon.com/v1/openapi/delivery/v1/SellerDeliveryOrdersSearch',
				{
					headers: {
						Authorization: `Bearer ${apiKey}`,
						Accept: 'application/json',
						'Accept-Language': 'ko',
						'X-Timezone': 'GMT+09:00',
						'Content-Type': 'application/json',
					},

					body: JSON.stringify(orderBody),

					method: 'POST',
				},
			);

			const orderJson = await orderResp.json();

			results.push(orderJson.data.deliveryOrderList);
		}

		results = results.flatMap((v) => v);

		console.log(shopName, results);

		return results.map((v: any) => {
			return {
				productId: v.spdNo,
				marketCode: shopInfo.code,
				marketName: shopInfo.name,
				taobaoOrderNo: null,
				productName: v.spdNm,
				productOptionContents: v.sitmNm,
				sellerProductManagementCode: v.eitmNo,
				orderNo: v.odNo,
				orderQuantity: v.odQty,
				orderMemberName: v.odrNm,
				orderMemberTelNo: v.dvpMphnNo,
				productPayAmt: v.slAmt,
				deliveryFeeAmt: parseInt(v.dvCst),
				individualCustomUniqueCode: v.indvCstmPclrNo,
				receiverName: v.dvpCustNm,
				receiverTelNo1: v.dvpMphnNo,
				receiverIntegratedAddress: `${v.dvpStnmDtlAddr} ${v.dvpStnmZipAddr}`,
				receiverZipCode: v.dvpZipNo,
				productOrderMemo: v.dvMsg,
				dvRtrvDvsCd: v.dvRtrvDvsCd,
				odSeq: v.odSeq,
				procSeq: v.procSeq,
			};
		});
	} catch (e) {
		console.log(shopName, e);

		return [];
	}
}

// 롯데온 발주확인처리
export async function productPreparedLotteon(commonStore: any, shopInfo: any) {
	const shopName = shopInfo.name;

	if (!shopInfo.connected || shopInfo.disabled) {
		return [];
	}

	const orderList = await getLocalStorage<any>('order');
	const LotteonOrderList = orderList.filter((v: any) => v.marketCode === 'A524' || v.marketCode === 'A525');
	console.log('LotteonOrderList', LotteonOrderList);
	try {
		let apiKey = commonStore.user.userInfo.lotteonApiKey;
		//조회기간 1일 초과불가능
		const body: any = {
			ifCompleteList: [],
		};

		await Promise.all(
			LotteonOrderList.map((v: any) => {
				body.ifCompleteList.push({
					dvRtrvDvsCd: v.dvRtrvDvsCd,
					odNo: v.orderNo,
					odSeq: v.odSeq,
					procSeq: v.procSeq,
					ifCplYN: 'Y',
				});
			}),
		);
		const orderJson: any = await fetch('https://openapi.lotteon.com/v1/openapi/delivery/v1/SellerIfCompleteInform', {
			headers: {
				Authorization: `Bearer ${apiKey}`,
				Accept: 'application/json',
				'Accept-Language': 'ko',
				'X-Timezone': 'GMT+09:00',
				'Content-Type': 'application/json',
			},

			body: JSON.stringify(body),

			method: 'POST',
		});
		console.log(shopName, orderJson);

		return [];
	} catch (e) {
		console.log(shopName, e);

		return [];
	}
}

// 롯데온 발송처리주문조회
export async function deliveryOrderLotteon(commonStore: any, shopInfo: any) {
	const shopName = shopInfo.name;

	if (!shopInfo.connected || shopInfo.disabled) {
		return [];
	}

	try {
		let apiKey = commonStore.user.userInfo.lotteonApiKey;

		let results: any = [];

		for (let i = -1; i >= -7; i--) {
			let dateStart = getClockOffset(0, 0, i, 0, 0, 0);
			let dateEnd = getClockOffset(0, 0, i + 1, 0, 0, 0);

			//조회기간 1일 초과불가능
			const orderBody: any = {
				srchStrtDt: `${dateStart.YY}${dateStart.MM}${dateStart.DD}${dateStart.hh}${dateStart.mm}${dateStart.ss}`,
				srchEndDt: `${dateEnd.YY}${dateEnd.MM}${dateEnd.DD}${dateEnd.hh}${dateEnd.mm}${dateEnd.ss}`,
				// "odNo": "",
				// "odPrgsStepCd": "",
				// "odTypCd": "",
				// "ifCplYN": "N"
			};
			const orderResp: any = await fetch(
				'https://openapi.lotteon.com/v1/openapi/delivery/v1/SellerDeliveryOrdersSearch',
				{
					headers: {
						Authorization: `Bearer ${apiKey}`,
						Accept: 'application/json',
						'Accept-Language': 'ko',
						'X-Timezone': 'GMT+09:00',
						'Content-Type': 'application/json',
					},

					body: JSON.stringify(orderBody),

					method: 'POST',
				},
			);

			const orderJson = await orderResp.json();

			results.push(orderJson.data.deliveryOrderList);
		}

		results = results.flatMap((v) => v);

		console.log(shopName, results);

		return results.map((v: any) => {
			return {
				productId: v.spdNo,
				marketCode: shopInfo.code,
				marketName: shopInfo.name,
				taobaoOrderNo: null,
				productName: v.spdNm,
				productOptionContents: v.sitmNm,
				sellerProductManagementCode: v.eitmNo,
				orderNo: v.odNo,
				orderQuantity: v.odQty,
				orderMemberName: v.odrNm,
				orderMemberTelNo: v.dvpMphnNo,
				productPayAmt: v.slAmt,
				deliveryFeeAmt: parseInt(v.dvCst),
				individualCustomUniqueCode: v.indvCstmPclrNo,
				receiverName: v.dvpCustNm,
				receiverTelNo1: v.dvpMphnNo,
				receiverIntegratedAddress: `${v.dvpStnmDtlAddr} ${v.dvpStnmZipAddr}`,
				receiverZipCode: v.dvpZipNo,
				productOrderMemo: v.dvMsg,
				dvRtrvDvsCd: v.dvRtrvDvsCd,
				odSeq: v.odSeq,
				procSeq: v.procSeq,
			};
		});
	} catch (e) {
		console.log(shopName, e);

		return [];
	}
}
