import { common } from '../../containers/stores/common';
import { product } from '../../containers/stores/product';
import MUTATIONS from '../Main/GraphQL/Mutations';
import QUERIES from '../Main/GraphQL/Queries';
import gql from '../Main/GraphQL/Requests';
import {
	convertWebpToJpg,
	extractTmonContent,
	getClock,
	getClockOffset,
	getStoreTraceCodeV2,
	notificationByEveryTime,
	readFileDataURL,
	request,
	sendCallback,
	transformContent,
	urlEncodedObject,
} from '../../../common/function';

// 티몬 상세페이지 지원형식 변환 함수
const convertB956Resources = async (content: any, type: any) => {
	const contentHtml = new DOMParser().parseFromString(content, 'text/html');
	const contentImgs: any = contentHtml.querySelectorAll('img');

	if (type === 1)
		for (let i in contentImgs) {
			try {
				contentImgs[i].className = 'lazy';
				contentImgs[i].setAttribute('data-original', contentImgs[i].src);
				// console.log("contentImgs[i].src", contentImgs[i].src);
				contentImgs[
					i
				].parentNode.innerHTML = `<div class=\"tmde-template image\" data-review-type=\"image\" data-insert=\"image\"><div class=\"tmde-component-option\"><div class=\"tmde-dimmed\"></div><button type=\"button\" class=\"component top\">맨위</button><button type=\"button\" class=\"component up\">위로</button><button type=\"button\" class=\"component down\">아래로</button><button type=\"button\" class=\"component bottom\">맨아래</button><button type=\"button\" class=\"component del\">삭제</button><button type=\"button\" class=\"component link\">링크</button></div><div class=\"tmde-image-area\"><img src=\"${contentImgs[i].src}\" width=\"100%\" height=\"\" alt=\"\" data-original=\"${contentImgs[i].src}\" class=\"lazy\" style=\"display: inline; height: auto;\"><div class=\"files\" style=\"display: none;\"><input type=\"file\" name=\"review\" multiple=\"\"><button type=\"button\" class=\"txt\">가로 770px로 고정되는<br>단수 또는 복수 이미지가 들어갑니다.<br>클릭 후 단수 또는 복수 이미지를 업로드 해주세요.</button></div></div></div>`;
			} catch (e) {
				continue;
			}
		}
	else
		for (let i in contentImgs) {
			try {
				contentImgs[i].className = 'lazy';
				contentImgs[i].setAttribute('data-original', contentImgs[i].src);
				// console.log("contentImgs[i].src", contentImgs[i].src);
				//우선이거주석해도 별문제없고, 상단 하단이미지 누락이 없어서 처리함 이상하게아래 넣으면 양식맞추는거에서 하나씩 누락되서 return 됨
				// contentImgs[
				//   i
				// ].parentNode.innerHTML = `<div class=\"tmde-template image\" data-review-type=\"image\" data-insert=\"image\"><div class=\"tmde-component-option\"><div class=\"tmde-dimmed\"></div><button type=\"button\" class=\"component top\">맨위</button><button type=\"button\" class=\"component up\">위로</button><button type=\"button\" class=\"component down\">아래로</button><button type=\"button\" class=\"component bottom\">맨아래</button><button type=\"button\" class=\"component del\">삭제</button><button type=\"button\" class=\"component link\">링크</button></div><div class=\"tmde-image-area\"><img src=\"${contentImgs[i].src}\" width=\"100%\" height=\"\" alt=\"\" data-original=\"${contentImgs[i].src}\" class=\"lazy\" style=\"display: inline; height: auto;\"><div class=\"files\" style=\"display: none;\"><input type=\"file\" name=\"review\" multiple=\"\"><button type=\"button\" class=\"txt\">가로 770px로 고정되는<br>단수 또는 복수 이미지가 들어갑니다.<br>클릭 후 단수 또는 복수 이미지를 업로드 해주세요.</button></div></div></div>`;
			} catch (e) {
				continue;
			}
		}

	return contentHtml.body.innerHTML;
};

// 티몬 상품등록
export const uploadTmon = async (productStore: product, commonStore: common, data: any) => {
	if (!data) return false;

	let shopName = data.DShopInfo.site_name;

	console.log(`(${shopName}) 등록정보:`, data);

	try {
		let time = getClock();
		let partnerNo = parseInt(commonStore.user.userInfo?.tmonId!);
		let loginResp: any = await request('https://spc-om.tmon.co.kr/api/partner/creatable-deal-count', { method: 'GET' });
		let loginJson: any = null;

		try {
			loginJson = JSON.parse(loginResp);
		} catch (e) {
			//
		}

		if (!loginJson) {
			productStore.addConsoleText(`(${shopName}) 파트너센터 로그인 실패`);
			notificationByEveryTime(`(${shopName}) 파트너센터 로그인 후 재시도 바랍니다.`);

			return false;
		}
		if (loginJson.data.partnerNo !== partnerNo) {
			productStore.addConsoleText(`(${shopName}) 스토어 연동정보 확인 실패`);
			notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

			return false;
		}

		const policy = commonStore.uploadInfo.markets.find((v) => v.code === data.DShopInfo.site_code)?.policyInfo ?? null;

		if (!policy) {
			productStore.addConsoleText(`(${shopName}) 발송정책 조회 실패`);
			notificationByEveryTime(`(${shopName}) 발송정책 조회에 실패하였습니다.`);

			return false;
		}

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
					} else {
						productStore.addRegisteredFailed(
							Object.assign(market_item, {
								error: '상품 수정 기능 준비 중입니다.',
							}),
						);
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 실패`);

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

				// 딜번호 생성
				let codeResp: any = await request('https://spc-om.tmon.co.kr/api/deal', {
					method: 'POST',
				});
				let codeJson = JSON.parse(codeResp);
				let dealNo = codeJson.data.data;
				let categoryResp: any = await request(`https://spc-om.tmon.co.kr/api/categories/${market_item.cate_code}`, {
					method: 'GET',
				});
				let categoryJson = JSON.parse(categoryResp);
				let name = market_item.name3.slice(0, 60);
				let tempBody = {
					dealNo: dealNo,
					partnerNo: partnerNo,
					isOM: 'Y',
					isExternal: 'N',
					status: 'WT',
					contentsMaker: 'partner',
					dealFrom: 'directdeal',
					isHide: 'N',
					isPause: 'N',
					tagNo: 0,
					isContract: 'Y',
					salesManager: {
						name: commonStore.user.email,
						phoneNumber: commonStore.user.userInfo?.asTel,
						email: commonStore.user.email,
					},
					title: name,
					categoryNo: categoryJson.data.data.salesCatNo,
					dealCategoryNo: market_item.cate_code,
					babyFilterNos: [],
					requiredDoc: '',
					startDate: {
						year: time.YY,
						monthValue: time.MM,
						dayOfMonth: time.DD,
						hour: 0,
						minute: 0,
						second: 0,
						chronology: {
							calendarType: 'iso8601',
							id: 'ISO',
						},
					},
					endDate: {
						year: 2099,
						monthValue: 12,
						dayOfMonth: 31,
						hour: 23,
						minute: 59,
						second: 59,
						chronology: {
							calendarType: 'iso8601',
							id: 'ISO',
						},
					},
					allTimesSale: 'N',
					listPriceSource: '오픈마켓가',
					reasonOfListPriceSource: '오픈마켓에서 책정한 판매가격입니다.',
					minPurchasableQtyPerPerson: 1,
					initPeriodOfPurchaseLimit: 7,
					maxPurchasableQtyPerPerson: 1000,
					listPrice: 0,
					discountPrice: 0,
					discountRate: 0,
					tmonRate: 14,
					forSaleOnMobile: 'Y',
					reasonOfNotForSaleOnMobile: '',
					onlyForSaleOnMobile: 'N',
					collectibleSocialNo: 'Y',
					adultConfirmation: 'N',
					isKcAuth: 'N',
					isTaxBaseCoupon: 'Y',
					isEncore: 'N',
					kcAuthInfos: [],
					isHotNotice: 'N',
					hotNotices: [],
					productStatus: '신상품',
					sellMethod: '해당없음',
					createdAt: `${time.YY}-${time.MM}-${time.DD}`,
					updatedAt: `${time.YY}-${time.MM}-${time.DD} ${time.hh}:${time.mm}:${time.ss}`,
					deliverySpot: 'DIRECT',
					showCategoryNo: 0,
					scCatYn: 'N',
					categoryManagerId: 'seoyeon01',
					categoryManagerName: '강서연',
					deliveryAgentType: 'N',
					deliveryProductType: 'DP03',
					deliveryType: '',
					theDayDeliveryStartTime: '00:00:00',
					isCollectIdentify: 'Y',
					isReturnCargo: 'Y',
					returnCargoType: 'HC',
					deliveryFeePolicy: 'FREE',
					deliveryFee: 0,
					deliveryFeeInConditional: 0,
					deliveryFeeSrl: 0,
					deliveryCorpType: '',
					isLongDistanceDelivery: '',
					isLongDistanceAddDeliveryFee: '',
					longDistanceAddDeliveryFee: '',
					isDifferentGradeDeliveryFeePerLocal: 'N',
					differentGradeDeliveryContentsPerLocal: '',
					separateInstallmentFee: 'N',
					maxItemNumPerBox: 0,
					deliveryManagerInfo: {},
					returnDeliveryManagerInfo: {},
					needForAddMessage: 'N',
					addMessage: '',
					refundType: 'S',
					reasonOfNoRefund: '',
					kcConfirmFiles: [],
					priceBaseFiles: [],
					adConfirmFiles: [],
					etcRequiredFiles: [],
					importFiles: [],
					employee: {
						corpEmail: 'seoyeon01@tmon.co.kr',
						mobileTelNo: '010-4232-3437',
						isManager: false,
						deptMail: 'TrendApparel',
						empNo: '202007039',
						adId: 'seoyeon01',
						fullNameKo: 'Sunny(강서연)',
						officeTelNo: '02-2098-4520',
						deptCode: 'D000860',
						deptNameKo: '트렌드의류팀',
						parentDeptCode: 'D000867',
						positionName: '팀원',
						rankName: '사원 1',
					},
					preparedForModificationApproval: false,
					liveDeal: false,
					validBasicCategoryInfo: true,
					notNeedRequiredDoc: true,
					needRequiredDoc: false,
					needOriginCountryCategory: false,
					validScCategoryInfo: true,
					babyFilterCategory: false,
					preparedForCreationApproval: true,
					selectedCatFullName: categoryJson.data.data.categoryFullName,
					mirroringCategoryNoList: [],
					categoryChangeYn: false,
					depth2catNo: categoryJson.data.data.vwCatNo2,
					selectedCatNo: market_item.cate_code,
					deal: {
						dealNo: dealNo,
						partnerNo: partnerNo,
						isOM: 'Y',
						isExternal: 'N',
						status: 'WT',
						contentsMaker: 'partner',
						dealFrom: 'directdeal',
						isHide: 'N',
						isPause: 'N',
						tagNo: 0,
						isContract: 'Y',
						salesManager: {
							name: commonStore.user.email,
							phoneNumber: commonStore.user.userInfo?.asTel,
							email: commonStore.user.email,
						},
						title: '임시 저장된 상품',
						categoryNo: categoryJson.data.data.salesCatNo,
						dealCategoryNo: market_item.cate_code,
						babyFilterNos: [],
						requiredDoc: '',
						startDate: {
							year: time.YY,
							monthValue: time.MM,
							dayOfMonth: time.DD,
							hour: 0,
							minute: 0,
							second: 0,
							chronology: {
								calendarType: 'iso8601',
								id: 'ISO',
							},
						},
						endDate: {
							year: 2099,
							monthValue: 12,
							dayOfMonth: 31,
							hour: 23,
							minute: 59,
							second: 59,
							chronology: {
								calendarType: 'iso8601',
								id: 'ISO',
							},
						},
						allTimesSale: 'N',
						listPriceSource: '오픈마켓가',
						reasonOfListPriceSource: '오픈마켓에서 책정한 판매가격입니다.',
						minPurchasableQtyPerPerson: 1,
						initPeriodOfPurchaseLimit: 7,
						maxPurchasableQtyPerPerson: 1000,
						listPrice: 0,
						discountPrice: 0,
						discountRate: 0,
						tmonRate: 14,
						forSaleOnMobile: 'Y',
						reasonOfNotForSaleOnMobile: '',
						onlyForSaleOnMobile: 'N',
						collectibleSocialNo: 'Y',
						adultConfirmation: 'N',
						isKcAuth: 'N',
						isTaxBaseCoupon: 'Y',
						isEncore: 'N',
						kcAuthInfos: [],
						isHotNotice: 'N',
						hotNotices: [],
						productStatus: '신상품',
						sellMethod: '해당없음',
						createdAt: `${time.YY}-${time.MM}-${time.DD}`,
						updatedAt: `${time.YY}-${time.MM}-${time.DD} ${time.hh}:${time.mm}:${time.ss}`,
						deliverySpot: 'DIRECT',
						showCategoryNo: 0,
						scCatYn: 'N',
						categoryManagerId: 'seoyeon01',
						categoryManagerName: '강서연',
						deliveryAgentType: 'N',
						deliveryProductType: 'DP03',
						deliveryType: '',
						theDayDeliveryStartTime: '00:00:00',
						isCollectIdentify: 'Y',
						isReturnCargo: 'Y',
						returnCargoType: 'HC',
						deliveryFeePolicy: 'FREE',
						deliveryFee: 0,
						deliveryFeeInConditional: 0,
						deliveryFeeSrl: 0,
						deliveryCorpType: '',
						isLongDistanceDelivery: '',
						isLongDistanceAddDeliveryFee: '',
						longDistanceAddDeliveryFee: '',
						isDifferentGradeDeliveryFeePerLocal: 'N',
						differentGradeDeliveryContentsPerLocal: '',
						separateInstallmentFee: 'N',
						maxItemNumPerBox: 0,
						deliveryManagerInfo: {},
						returnDeliveryManagerInfo: {},
						needForAddMessage: 'N',
						addMessage: '',
						refundType: 'S',
						reasonOfNoRefund: '',
						kcConfirmFiles: [],
						priceBaseFiles: [],
						adConfirmFiles: [],
						etcRequiredFiles: [],
						importFiles: [],
						employee: {
							corpEmail: 'seoyeon01@tmon.co.kr',
							mobileTelNo: '010-4232-3437',
							isManager: false,
							deptMail: 'TrendApparel',
							empNo: '202007039',
							adId: 'seoyeon01',
							fullNameKo: 'Sunny(강서연)',
							officeTelNo: '02-2098-4520',
							deptCode: 'D000860',
							deptNameKo: '트렌드의류팀',
							parentDeptCode: 'D000867',
							positionName: '팀원',
							rankName: '사원 1',
						},
						preparedForModificationApproval: false,
						liveDeal: false,
						validBasicCategoryInfo: true,
						notNeedRequiredDoc: true,
						needRequiredDoc: false,
						needOriginCountryCategory: false,
						validScCategoryInfo: true,
						babyFilterCategory: false,
						preparedForCreationApproval: true,
						selectedCatFullName: categoryJson.data.data.categoryFullName,
						mirroringCategoryNoList: [],
						categoryChangeYn: false,
						depth2catNo: categoryJson.data.data.vwCatNo2,
						selectedCatNo: market_item.cate_code,
					},
					dealManager: null,
					dealBossManager: null,
					userView: 'Y',
					isPending: false,
					contentsType: 'summary',
					approvalStatus: null,
					tempItems: null,
					subItems: {
						optionImg: false,
						naverEPInfo: true,
						prodInfo: false,
						contents: false,
						option: false,
					},
					rssBlockDealsUseYn: '',
					brand: {
						mainDealNo: dealNo,
						brandNo: null,
						brandNm: null,
						brandSubNm: null,
						visible: false,
						mainBrandYn: null,
						useYn: null,
						updater: null,
						viewName: null,
					},
					parentDealNo: null,
					parentDealTitle: null,
					dealCloneInfoDetail: null,
				};

				// 상품 임시 저장
				await request(`https://spc-om.tmon.co.kr/api/deals/${dealNo}/save`, {
					headers: {
						'content-type': 'application/json',
					},
					body: JSON.stringify(tempBody),
					method: 'POST',
				});

				const itemInfo = productStore.itemInfo.items.find((v) => v.productCode === market_code)!;
				const sillCode = itemInfo[`sillCode${data.DShopInfo.site_code}`]
					? itemInfo[`sillCode${data.DShopInfo.site_code}`]
					: '기타 재화';
				const sillData = itemInfo[`sillData${data.DShopInfo.site_code}`]
					? JSON.parse(itemInfo[`sillData${data.DShopInfo.site_code}`])
					: [
							{ code: '1166', name: '1. 품명 및 모델명', type: 'input' },
							{
								code: '1170',
								name: '2. 법에 의한 인증·허가 등을 받았음을 확인할 수 있는 경우 그에 대한 사항',
								type: 'input',
							},
							{ code: '1174', name: '3. 제조국 또는 원산지', type: 'input' },
							{ code: '1178', name: '4. 제조자, 수입품의 경우 수입자를 함께 표기', type: 'input' },
							{ code: '1182', name: '5. A/S 책임자와 전화번호 또는 소비자상담 관련 전화번호', type: 'input' },
					  ];

				const sillResult = [
					{
						productype: sillCode,
						items: sillData.map((v) => ({
							key: v.name,
							value: {
								contents: v.value ?? '상세설명참조',
								refUseYN: 'N',
							},
							ref: null,
						})),
					},
				];

				let infoBody = {
					success: 'true',
					kft: sillResult,
				};

				// 상품정보 제공고시 자동입력
				await request(`https://spc-om.tmon.co.kr/api/deals/${dealNo}/product_info_provide?api=1.0`, {
					headers: {
						'content-type': 'application/json',
					},
					body: JSON.stringify(infoBody),
					method: 'POST',
				});

				let group: any = {};
				let words = await gql(QUERIES.SELECT_WORD_TABLES_BY_SOMEONE, {}, false);
				let words_list = words.data.selectWordTablesBySomeone;
				let words_restrict: any = {};

				for (let i in words_list)
					if (words_list[i].findWord && !words_list[i].replaceWord)
						if (market_item.name3.includes(words_list[i].findWord)) words_restrict['상품명'] = words_list[i].findWord;

				for (let i in market_optn) {
					if (market_optn[i].code === market_code)
						for (let j in market_optn[i]) {
							if (j.includes('misc') && market_optn[i][j] !== '') group[market_optn[i][j]] = j.replace('misc', 'opt');
							if (j.includes('opt') && j !== 'optimg' && market_optn[i][j] !== '')
								for (let k in words_list)
									if (words_list[k].findWord && !words_list[k].replaceWord)
										if (market_optn[i][j].includes(words_list[k].findWord))
											words_restrict['옵션명'] = words_list[k].findWord;
						}
				}

				if (Object.keys(words_restrict).length > 0) {
					let message = '';

					for (let i in words_restrict) message += i + '에서 금지어(' + words_restrict[i] + ')가 발견되었습니다. ';

					productStore.addRegisteredFailed(Object.assign(market_item, { error: message }));
					productStore.addConsoleText(`(${shopName}) [${market_code}] 금지어 발견됨`);

					await sendCallback(commonStore, data, market_code, parseInt(product), 2, message);

					continue;
				}

				// 이미지 업로드
				let result: any = await fetch(market_item.img1);

				if (result.status !== 200) return;

				let formDataContent = new FormData();
				let formDataSummary = new FormData();
				let blob: any = await result.blob();
				let base64: any = await readFileDataURL(blob);
				let exts = base64.split(',')[1][0];

				switch (exts) {
					case '/': {
						formDataContent.append('Filedata', blob, 'image.jpg');
						formDataSummary.append('file', blob, 'image.jpg');

						break;
					}

					case 'R': {
						formDataContent.append('Filedata', blob, 'image.gif');
						formDataSummary.append('file', blob, 'image.gif');

						break;
					}

					case 'i': {
						formDataContent.append('Filedata', blob, 'image.png');
						formDataSummary.append('file', blob, 'image.png');

						break;
					}

					case 'U': {
						blob = await convertWebpToJpg(base64);
						formDataContent.append('Filedata', blob, 'image.jpg');
						formDataSummary.append('file', blob, 'image.jpg');

						break;
					}

					default: {
						formDataContent.append('Filedata', blob, 'image.bmp');
						formDataSummary.append('file', blob, 'image.bmp');

						break;
					}
				}

				let imageResp: any = await request(
					`https://spc-om.tmon.co.kr/api/designContent/uploadFile/${dealNo}/rule/front/maxSize/2048000`,
					{
						method: 'POST',
						body: formDataContent,
					},
				);
				let imageJson = JSON.parse(imageResp);
				let summaryResp: any = await request(`https://spc-om.tmon.co.kr/api/smartImage/uploadImg/${dealNo}/summary`, {
					method: 'POST',
					body: formDataSummary,
				});
				let summaryJson = JSON.parse(summaryResp);
				let option_length = Object.keys(group).length;
				let optionBody: any = {
					optionHeaders: [],
					options: [],
				};

				optionBody.optionHeaders.push('상품명');

				if (option_length > 0) {
					for (let i in group) optionBody.optionHeaders.push(i);

					for (let i in market_optn)
						if (market_optn[i].code === market_code) {
							let option = {
								optionType: 'NEW',
								optionNo: i,
								discountPrice: market_item.sprice + market_optn[i].price,
								quantity: market_optn[i].stock,
								maxBuyableQtyPerPerson: '100',
								partnerProductCode: market_code,
								option0: name,
								option1: market_optn[i].opt1,
								option2: market_optn[i].opt2,
								option3: market_optn[i].opt3,
								option4: market_optn[i].opt4,
								option5: market_optn[i].opt5,
							};

							optionBody.options.push(option);
						}
				} else
					optionBody.options.push({
						optionType: 'NEW',
						optionNo: '0',
						discountPrice: market_item.sprice,
						quantity: market_item.stock,
						maxBuyableQtyPerPerson: '100',
						partnerProductCode: market_code,
						option0: name,
						option1: '',
						option2: '',
						option3: '',
						option4: '',
						option5: '',
					});

				const testtest: any = await request(`https://spc-om.tmon.co.kr/api/deals/${dealNo}/options`, {
					headers: {
						'content-type': 'application/json',
					},
					body: JSON.stringify(optionBody),
					method: 'POST',
				});

				const optionTest = JSON.parse(testtest);

				if (optionTest.data.result === 'FAILURE') {
					productStore.addRegisteredFailed(Object.assign(market_item, { error: optionTest.data.errorMsg }));
					productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);

					await sendCallback(commonStore, data, market_code, parseInt(product), 2, optionTest.data.errorMsg);

					continue;
				}

				// 옵션 조회
				let optionResp: any = await request(`https://spc-om.tmon.co.kr/api/deals/${dealNo}/options`, { method: 'GET' });
				let optionJson = JSON.parse(optionResp);

				// 대표 옵션 지정
				await request(`https://spc-om.tmon.co.kr/api/deals/${dealNo}/options/main_option`, {
					headers: {
						'content-type': 'application/json;charset=UTF-8',
					},
					body: optionJson.data.options[0].optionNo,
					method: 'POST',
				});

				let thumnailBody = {
					saveType: 'DN',
					data: JSON.stringify([
						{
							[optionJson.data.options[0].optionNo]: {
								thmb: summaryJson.data.fileObject[0],
								subject: optionJson.data.options[0].option0,
								detail: '',
								bcolor: '',
								child: '',
							},
						},
					]),
					mainData: JSON.stringify({
						tmplNo: '1',
						depth: '1',
						summaryCols: 'column1',
						saveType: 'DN',
						viewPrice: 'Y',
					}),
				};

				await request(`https://spc-om.tmon.co.kr/api/smartImage/save/summary/${dealNo}`, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
					},

					body: urlEncodedObject(thumnailBody),
					method: 'POST',
				});

				let contentBody = {
					summaryYn: 'Y',
					dealNo: dealNo,
					flagType: 'S',
					dealType: 'opt_no',
					flagUnitSale: 'Y',
					orgPriceTitle: '',
					orgPriceContent: '',
					orgPriceView: 'Y',
					flagEnableSearch: 'Y',
					originCountry: 'N',
					originCountryDesc: '',
					titleName: name,
					title: '홍보 문구 없음',
					titleList: '홍보 문구 없음',
					titlePoint: '홍보 문구 없음',
					titleApp: name,
					titleTextBanner: name,
					titleImgSub: '홍보 문구 없음',
					titleImg: name,
					titleImgPoint: '',
					summaryText: name,
					useInfoTitle1: '상품정보\\;\\',
					useInfoTitle2: '배송/환불정보\\;\\',
					useInfoTitle3: '\\;\\',
					useInfoTitle4: '\\;\\',
					useInfoTitle5: '\\;\\',
					useInfoTitle6: '\\;\\',
					useInfoDesc1: '상품상세설명 참조',
					//@ts-ignore
					useInfoDesc2: commonStore.user.userInfo?.asInfo,
					useInfoDesc3: '',
					useInfoDesc4: '',
					useInfoDesc5: '',
					useInfoDesc6: '',
					imgCatList3ColV2: imageJson.data.dealImagesInfoList.find((v: any) => v.imageKey === 'catlist_3col_v2')
						.imageValue,
					imgFront: imageJson.data.dealImagesInfoList.find((v: any) => v.imageKey === 'front').imageValue,
					imgMobile: imageJson.data.dealImagesInfoList.find((v: any) => v.imageKey === 'mobile').imageValue,
					imgAround: imageJson.data.dealImagesInfoList.find((v: any) => v.imageKey === 'around').imageValue,
					imgSummary: '',
					imgReviewContent: '',
					imgMobileContent: '',
					imgMiscContent: '',
					reApprovalMessage: '',
					mode: 'DIRECT',
					isScCategory: 'N',
					mainVideoUseYn: 'N',
					mainVideoUrl: '',
				};

				await request(`https://spc-om.tmon.co.kr/api/designContent/edit`, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
					},
					body: urlEncodedObject(contentBody),
					method: 'POST',
				});

				market_item.content1 = await convertB956Resources(market_item.content1, 1);
				market_item.content2 = await convertB956Resources(market_item.content2, 2);
				market_item.content3 = await convertB956Resources(market_item.content3, 2);

				let descBody = {
					saveType: 'DN',
					data: JSON.stringify([
						{
							[optionJson.data.options[0].optionNo]: `
            ${getStoreTraceCodeV2(market_item.id, data.DShopInfo.site_code)}
            ${transformContent(market_item.content2)}
            ${
							commonStore.user.userInfo?.descriptionShowTitle === 'Y'
								? `<br /><br /><div style="text-align: center;">${market_item.name3}</div><br /><br />`
								: `<br /><br />`
						}
            ${transformContent(market_item.content1)}
            ${transformContent(market_item.content3)}`,
						},
					]),
					mainData: JSON.stringify({
						tmplNo: '1',
						depth: '1',
						viewPrice: 'N',
						summaryCols: 'column1',
						saveType: 'DN',
					}),
				};

				await request(`https://spc-om.tmon.co.kr/api/smartImage/save/review/${dealNo}`, {
					headers: {
						'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
					},
					body: urlEncodedObject(descBody),
					method: 'POST',
				});

				let productBody = {
					dealNo: dealNo,
					partnerNo: partnerNo,
					isOM: 'Y',
					isExternal: 'N',
					status: 'WT',
					contentsMaker: 'partner',
					dealFrom: 'directdeal',
					isHide: 'N',
					isPause: 'N',
					tagNo: 0,
					isContract: 'Y',
					salesManager: {
						name: commonStore.user.email,
						phoneNumber: commonStore.user.userInfo?.asTel,
						email: commonStore.user.email,
					},
					title: name,
					categoryNo: categoryJson.data.data.salesCatNo,
					dealCategoryNo: market_item.cate_code,
					babyFilterNos: [],
					requiredDoc: '',
					startDate: {
						year: time.YY,
						monthValue: time.MM,
						dayOfMonth: time.DD,
						hour: 0,
						minute: 0,
						second: 0,
						chronology: {
							calendarType: 'iso8601',
							id: 'ISO',
						},
					},
					endDate: {
						year: 2099,
						monthValue: 12,
						dayOfMonth: 31,
						hour: 23,
						minute: 59,
						second: 59,
						chronology: {
							calendarType: 'iso8601',
							id: 'ISO',
						},
					},
					allTimesSale: 'N',
					listPriceSource: '오픈마켓가',
					reasonOfListPriceSource: '오픈마켓에서 책정한 판매가격입니다.',
					minPurchasableQtyPerPerson: 1,
					initPeriodOfPurchaseLimit: 7,
					maxPurchasableQtyPerPerson: 1000,
					listPrice: market_item.price,
					discountPrice: market_item.price,
					discountRate: 0,
					tmonRate: 9,
					forSaleOnMobile: 'Y',
					reasonOfNotForSaleOnMobile: '',
					onlyForSaleOnMobile: 'N',
					collectibleSocialNo: 'Y',
					adultConfirmation: 'N',
					isKcAuth: 'N',
					isTaxBaseCoupon: 'Y',
					isEncore: 'N',
					kcAuthInfos: [],
					isHotNotice: 'N',
					hotNotices: [],
					productStatus: '신상품',
					sellMethod: '해당없음',
					createdAt: `${time.YY}-${time.MM}-${time.DD}`,
					updatedAt: `${time.YY}-${time.MM}-${time.DD} ${time.hh}:${time.mm}:${time.ss}`,
					deliverySpot: 'DIRECT',
					showCategoryNo: 0,
					scCatYn: 'N',
					categoryManagerId: 'eunhye4231',
					categoryManagerName: '임은혜',
					deliveryAgentType: 'N',
					deliveryProductType: 'DP03',
					deliveryType: '',
					theDayDeliveryStartTime: '00:00:00',
					isCollectIdentify: 'Y',
					isReturnCargo: 'Y',
					returnCargoType: 'HC',
					deliveryFeePolicy: 'FREE',
					deliveryFee: 0,
					deliveryFeeInConditional: 0,
					deliveryFeeSrl: policy,
					deliveryCorpType: '자체배송',
					isLongDistanceDelivery: '',
					isLongDistanceAddDeliveryFee: '',
					longDistanceAddDeliveryFee: '',
					isDifferentGradeDeliveryFeePerLocal: 'N',
					differentGradeDeliveryContentsPerLocal: '',
					separateInstallmentFee: 'N',
					maxItemNumPerBox: 0,
					deliveryManagerInfo: {},
					returnDeliveryManagerInfo: {},
					needForAddMessage: 'N',
					addMessage: '',
					refundType: 'S',
					reasonOfNoRefund: '',
					kcConfirmFiles: [],
					priceBaseFiles: [],
					adConfirmFiles: [],
					etcRequiredFiles: [],
					importFiles: [],
					employee: {
						corpEmail: 'eunhye4231@tmon.co.kr',
						mobileTelNo: '010-9633-9438',
						isManager: false,
						deptMail: 'OverseasDCPur',
						empNo: '202112002',
						adId: 'eunhye4231',
						fullNameKo: 'Grace(임은혜)',
						officeTelNo: '02-2098-4565',
						deptCode: 'D000891',
						deptNameKo: '해외직구팀',
						parentDeptCode: 'D000986',
						positionName: '팀원',
						rankName: '',
					},
					validBasicCategoryInfo: true,
					notNeedRequiredDoc: true,
					needRequiredDoc: false,
					needOriginCountryCategory: false,
					validScCategoryInfo: true,
					liveDeal: false,
					preparedForModificationApproval: false,
					babyFilterCategory: false,
					preparedForCreationApproval: true,
					selectedCatFullName: categoryJson.data.data.categoryFullName,
					mirroringCategoryNoList: [],
					categoryChangeYn: false,
					depth2catNo: categoryJson.data.data.vwCatNo2,
					selectedCatNo: market_item.cate_code,
					deal: {
						dealNo: dealNo,
						partnerNo: partnerNo,
						isOM: 'Y',
						isExternal: 'N',
						status: 'WT',
						contentsMaker: 'partner',
						dealFrom: 'directdeal',
						isHide: 'N',
						isPause: 'N',
						tagNo: 0,
						isContract: 'Y',
						salesManager: {
							name: commonStore.user.email,
							phoneNumber: commonStore.user.userInfo?.asTel,
							email: commonStore.user.email,
						},
						title: name,
						categoryNo: categoryJson.data.data.salesCatNo,
						dealCategoryNo: market_item.cate_code,
						babyFilterNos: [],
						requiredDoc: '',
						startDate: {
							year: time.YY,
							monthValue: time.MM,
							dayOfMonth: time.DD,
							hour: 0,
							minute: 0,
							second: 0,
							chronology: {
								calendarType: 'iso8601',
								id: 'ISO',
							},
						},
						endDate: {
							year: 2099,
							monthValue: 12,
							dayOfMonth: 31,
							hour: 23,
							minute: 59,
							second: 59,
							chronology: {
								calendarType: 'iso8601',
								id: 'ISO',
							},
						},
						allTimesSale: 'N',
						listPriceSource: '오픈마켓가',
						reasonOfListPriceSource: '오픈마켓에서 책정한 판매가격입니다.',
						minPurchasableQtyPerPerson: 1,
						initPeriodOfPurchaseLimit: 7,
						maxPurchasableQtyPerPerson: 1000,
						listPrice: market_item.price,
						discountPrice: market_item.price,
						discountRate: 0,
						tmonRate: 9,
						forSaleOnMobile: 'Y',
						reasonOfNotForSaleOnMobile: '',
						onlyForSaleOnMobile: 'N',
						collectibleSocialNo: 'Y',
						adultConfirmation: 'N',
						isKcAuth: 'N',
						isTaxBaseCoupon: 'Y',
						isEncore: 'N',
						kcAuthInfos: [],
						isHotNotice: 'N',
						hotNotices: [],
						productStatus: '신상품',
						sellMethod: '해당없음',
						createdAt: `${time.YY}-${time.MM}-${time.DD}`,
						updatedAt: `${time.YY}-${time.MM}-${time.DD} ${time.hh}:${time.mm}:${time.ss}`,
						deliverySpot: 'DIRECT',
						showCategoryNo: 0,
						scCatYn: 'N',
						categoryManagerId: 'eunhye4231',
						categoryManagerName: '임은혜',
						deliveryAgentType: 'N',
						deliveryProductType: 'DP03',
						deliveryType: '',
						theDayDeliveryStartTime: '00:00:00',
						isCollectIdentify: 'Y',
						isReturnCargo: 'Y',
						returnCargoType: 'HC',
						deliveryFeePolicy: 'FREE',
						deliveryFee: 0,
						deliveryFeeInConditional: 0,
						deliveryFeeSrl: policy,
						deliveryCorpType: '자체배송',
						isLongDistanceDelivery: '',
						isLongDistanceAddDeliveryFee: '',
						longDistanceAddDeliveryFee: '',
						isDifferentGradeDeliveryFeePerLocal: 'N',
						differentGradeDeliveryContentsPerLocal: '',
						separateInstallmentFee: 'N',
						maxItemNumPerBox: 0,
						deliveryManagerInfo: {},
						returnDeliveryManagerInfo: {},
						needForAddMessage: 'N',
						addMessage: '',
						refundType: 'S',
						reasonOfNoRefund: '',
						kcConfirmFiles: [],
						priceBaseFiles: [],
						adConfirmFiles: [],
						etcRequiredFiles: [],
						importFiles: [],
						employee: {
							corpEmail: 'eunhye4231@tmon.co.kr',
							mobileTelNo: '010-9633-9438',
							isManager: false,
							deptMail: 'OverseasDCPur',
							empNo: '202112002',
							adId: 'eunhye4231',
							fullNameKo: 'Grace(임은혜)',
							officeTelNo: '02-2098-4565',
							deptCode: 'D000891',
							deptNameKo: '해외직구팀',
							parentDeptCode: 'D000986',
							positionName: '팀원',
							rankName: '',
						},
						validBasicCategoryInfo: true,
						notNeedRequiredDoc: true,
						needRequiredDoc: false,
						needOriginCountryCategory: false,
						validScCategoryInfo: true,
						liveDeal: false,
						preparedForModificationApproval: false,
						babyFilterCategory: false,
						preparedForCreationApproval: true,
						selectedCatFullName: categoryJson.data.data.categoryFullName,
						mirroringCategoryNoList: [],
						categoryChangeYn: false,
						depth2catNo: categoryJson.data.data.vwCatNo2,
						selectedCatNo: market_item.cate_code,
					},
					dealManager: null,
					dealBossManager: null,
					userView: 'Y',
					isPending: false,
					contentsType: 'summary',
					approvalStatus: null,
					tempItems: null,
					subItems: {
						optionImg: false,
						naverEPInfo: true,
						prodInfo: false,
						contents: false,
						option: true,
					},
					rssBlockDealsUseYn: 'N',
					brand: {
						mainDealNo: dealNo,
						brandNo: 0,
						brandNm: '',
						brandSubNm: '',
						visible: true,
						mainBrandYn: 'Y',
						useYn: 'N',
						updater: 'koozapas',
						viewName: '',
					},
					parentDealNo: null,
					parentDealTitle: null,
					dealCloneInfoDetail: null,
				};

				productStore.addConsoleText(`(${shopName}) 상품 등록 중...`);
				productStore.addRegisteredQueue(market_item);

				let productResp: any = await request(`https://spc-om.tmon.co.kr/api/deals/${dealNo}/complete`, {
					headers: {
						'content-type': 'application/json',
					},
					body: JSON.stringify(productBody),
					method: 'POST',
				});

				let productJson = JSON.parse(productResp);

				if (productJson.data.result === 'OK') {
					productStore.addRegisteredSuccess(Object.assign(market_item, { error: dealNo.toString() }));
					productStore.addConsoleText(`(${shopName}) 상품 등록 성공`);

					await sendCallback(commonStore, data, market_code, parseInt(product), 1, dealNo.toString());
				} else {
					productStore.addRegisteredFailed(Object.assign(market_item, { error: productJson.data.errorMsg }));
					productStore.addConsoleText(`(${shopName}) 상품 등록 실패`);

					await sendCallback(commonStore, data, market_code, parseInt(product), 2, productJson.data.errorMsg);
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
};

// 티몬 상품등록해제
export const deleteTmon = async (productStore: product, commonStore: common, data: any) => {
	if (!data) return false;

	let shopName = data.DShopInfo.site_name;

	console.log(`(${shopName}) 등록정보:`, data);

	try {
		let partnerNo = parseInt(commonStore.user.userInfo?.tmonId!);
		let loginResp: any = await request('https://spc-om.tmon.co.kr/api/partner/creatable-deal-count', { method: 'GET' });
		let loginJson: any = null;

		try {
			loginJson = JSON.parse(loginResp);
		} catch (e) {
			//
		}

		if (!loginJson) {
			productStore.addConsoleText(`(${shopName}) 파트너센터 로그인 실패`);
			notificationByEveryTime(`(${shopName}) 파트너센터 로그인 후 재시도 바랍니다.`);

			return false;
		}
		if (loginJson.data.partnerNo !== partnerNo) {
			productStore.addConsoleText(`(${shopName}) 스토어 연동정보 확인 실패`);
			notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

			return false;
		}

		for (let product in data.DShopInfo.prod_codes) {
			try {
				let market_code = data.DShopInfo.prod_codes[product];
				let market_item = data.DShopInfo.DataDataSet.data[product];

				if (market_item.cert) continue;

				let productId = market_item.name2;

				if (!productId) continue;

				const deleteResp: any = await request('https://spc-om.tmon.co.kr/api/deals/close', {
					headers: {
						'content-type': 'application/json',
					},
					body: `[${productId}]`,
					method: 'POST',
				});

				const deleteJson = JSON.parse(deleteResp);

				if (deleteJson.httpStatus === 'OK') {
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

// 티몬 신규주문
export const newOrderTmon = async (commonStore: common, shopInfo: any) => {
	const shopName = shopInfo.name;

	if (!shopInfo.connected || shopInfo.disabled) return [];

	try {
		let partnerNo = parseInt(commonStore.user.userInfo?.tmonId!);
		let loginResp: any = await request('https://spc-om.tmon.co.kr/api/partner/creatable-deal-count', { method: 'GET' });
		let loginJson: any = null;

		try {
			loginJson = JSON.parse(loginResp);
		} catch (e) {
			//
		}

		if (!loginJson) {
			notificationByEveryTime(`(${shopName}) 파트너센터 로그인 후 재시도 바랍니다.`);

			return [];
		}

		if (loginJson.data.partnerNo !== partnerNo) {
			notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

			return [];
		}

		const dateStart = getClockOffset(0, 0, -7, 0, 0, 0);
		const dateEnd = getClock();
		const orderResp = await fetch(
			`https://spc.tmon.co.kr/delivery/getDeliveryList?orderConfirmYn=N&loginPartnerSrl=${partnerNo}&page=1&sortTarget=&sortDirection=&periodOption=BDATE&searchStartDate=${dateStart.YY}.${dateStart.MM}.${dateStart.DD}&searchEndDate=${dateEnd.YY}.${dateEnd.MM}.${dateEnd.DD}&deliveryStatus=D1&delayRequest=ALL&searchOption=&searchText=&dealListType=ALL&viewCount=50&mainDealSerial=`,
			{
				headers: {
					accept: 'application/json, text/javascript, */*; q=0.01',
					'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
					'sec-ch-ua': '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"Windows"',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'same-origin',
					'x-requested-with': 'XMLHttpRequest',
				},
				referrer: 'https://spc.tmon.co.kr/delivery?deliveryStatus=D1&delay=N',
				referrerPolicy: 'strict-origin-when-cross-origin',
				body: null,
				method: 'GET',
				mode: 'cors',
				credentials: 'include',
			},
		);

		const orderJson = await orderResp.json();

		console.log(shopName, orderJson.rows);

		return orderJson.rows.map((v: any) => {
			return {
				productId: v.dealNo,
				marketCode: shopInfo.code,
				marketName: shopInfo.name,
				taobaoOrderNo: null,
				productName: v.data[19],
				productOptionContents: v.data[20].replace(v.data[19], ''),
				sellerProductManagementCode: v.data[15],
				orderNo: extractTmonContent(v.data[5]),
				orderQuantity: v.data[22],
				orderMemberName: v.data[16],
				orderMemberTelNo: v.data[18],
				productPayAmt: parseInt(v.data[23]),
				deliveryFeeAmt: parseInt(v.data[45] === '무료배송' ? '0' : v.data[45]),
				individualCustomUniqueCode: v.data[27],
				receiverName: v.data[26],
				receiverTelNo1: v.data[28],
				receiverIntegratedAddress: v.data[29],
				receiverZipCode: v.data[30],
				productOrderMemo: v.data[31],
			};
		});
	} catch (e) {
		console.log(shopName, e);

		return [];
	}
};
