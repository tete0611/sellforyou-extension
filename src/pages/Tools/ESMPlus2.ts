// 지마켓/옥션 자체개발 API
import { common } from '../../containers/stores/common';
import { product } from '../../containers/stores/product';
import MUTATIONS from '../Main/GraphQL/Mutations';
import QUERIES from '../Main/GraphQL/Queries';
import gql from '../Main/GraphQL/Requests';
import {
	byteSlice,
	getStoreTraceCodeV1,
	notificationByEveryTime,
	sendCallback,
	transformContent,
} from '../../../common/function';

// 지마켓/옥션 2.0 상품등록
export const uploadESMPlus2 = async (productStore: product, commonStore: common, data: any) => {
	if (!data) return false;

	let shopName = data.DShopInfo.site_name;
	const shopCode = data.DShopInfo.site_code;

	console.log(`(${shopName}) 등록정보:`, data);

	try {
		let esmplusAuctionId;
		let esmplusGmarketId;
		let upload_type: any = [];
		let delivery_policy_code_gmk = '0';
		let delivery_policy_code_iac = '0';
		let gg_text = null;

		// 로그인이 안되어 있는 경우 .json()에서 오류나는 것을 이용하여 로그인 구분
		try {
			let gg_resp = await fetch('https://www.esmplus.com/Member/AntiMoneyLaundering/GetAMLSellerList');

			gg_text = await gg_resp.json();
		} catch (e) {
			//
		}

		if (!gg_text) {
			productStore.addConsoleText(`(${shopName}) ESMPLUS 로그인 실패`);
			notificationByEveryTime(`(${shopName}) ESMPLUS 로그인 후 재시도 바랍니다.`);

			return false;
		}

		let gg_json = JSON.parse(gg_text);

		// 지마켓2.0/옥션2.0 구분
		switch (shopCode) {
			/** 지마켓 */
			case 'A523': {
				let user_g_resp = await fetch('https://www.esmplus.com/Home/HomeSellerActivityBalanceGmktData?sellerid=', {
					body: null,
					method: 'GET',
				});

				let user_g_json = await user_g_resp.json();

				esmplusGmarketId = commonStore.user.userInfo?.esmplusGmarketId;

				if (esmplusGmarketId === user_g_json.sellerid) {
					upload_type.push({ key: '1', value: '' });
					upload_type.push({ key: '2', value: esmplusGmarketId });
				} else {
					let matched = false;

					for (let i in gg_json) {
						if (gg_json[i].SiteId === 2 && esmplusGmarketId === gg_json[i].SellerId) {
							upload_type.push({ key: '1', value: '' });
							upload_type.push({ key: '2', value: esmplusGmarketId });
							matched = true;

							break;
						}
					}

					if (!matched) {
						productStore.addConsoleText(`(${shopName}) 스토어 연동정보 확인 실패`);
						notificationByEveryTime(
							`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`,
						);

						return false;
					}
				}

				let delivery_policy_resp = await fetch(
					`https://www.esmplus.com/SELL/SYI/GetTransPolicyList?siteId=2&sellerId=${esmplusGmarketId}`,
				);
				let delivery_policy_json = await delivery_policy_resp.json();

				/** 발송정책변경 (23년10월경) */
				delivery_policy_json.forEach((v) => {
					if (v.DefaultIs) delivery_policy_code_gmk = v.TransPolicyNo.toString();
				});

				break;
			}

			/** 옥션 */
			case 'A522': {
				let user_a_resp = await fetch('https://www.esmplus.com/Home/HomeSellerActivityBalanceIacData?sellerid=', {
					body: null,
					method: 'GET',
				});

				let user_a_json = await user_a_resp.json();

				esmplusAuctionId = commonStore.user.userInfo?.esmplusAuctionId;

				if (esmplusAuctionId === user_a_json.sellerid) {
					upload_type.push({ key: '1', value: esmplusAuctionId });
					upload_type.push({ key: '2', value: '' });
				} else {
					let matched = false;

					for (let i in gg_json) {
						if (gg_json[i].SiteId === 1 && esmplusAuctionId === gg_json[i].SellerId) {
							upload_type.push({ key: '1', value: esmplusAuctionId });
							upload_type.push({ key: '2', value: '' });
							matched = true;

							break;
						}
					}

					if (!matched) {
						productStore.addConsoleText(`(${shopName}) 스토어 연동정보 확인 실패`);
						notificationByEveryTime(
							`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`,
						);

						return false;
					}
				}

				let delivery_policy_resp = await fetch(
					`https://www.esmplus.com/SELL/SYI/GetTransPolicyList?siteId=1&sellerId=${esmplusAuctionId}`,
				);
				let delivery_policy_json = await delivery_policy_resp.json();

				/** 발송정책변경 (23년10월경) */
				delivery_policy_json.forEach((v) => {
					if (v.DefaultIs) delivery_policy_code_iac = v.TransPolicyNo.toString();
				});

				break;
			}

			default:
				break;
		}

		const userResp = await fetch('https://www.esmplus.com/Escrow/Order/NewOrder');
		if (userResp.status === 500)
			notificationByEveryTime(`(${shopName}) 업로드 도중 오류가 발생하였습니다. (${userResp.statusText})`);
		const userText = await userResp.text();
		const userMatched = userText.match(/var masterID = "([0-9]+)"/);

		// 출고지 조회
		let delivery_shipping_code = '0';
		let delivery_shipping_resp = await fetch('https://www.esmplus.com/SELL/SYI/GetShipmentPlaces');
		let delivery_shipping_json = await delivery_shipping_resp.json();

		for (let i in delivery_shipping_json) {
			if (delivery_shipping_json[i].DefaultIs) {
				delivery_shipping_code = delivery_shipping_json[i].ShipmentPlaceNo;

				break;
			}
		}

		// 반품지 조회
		let delivery_return_code = '0';
		let delivery_return_resp = await fetch('https://www.esmplus.com/SELL/SYI/GetDefaultReturnMemberAddress');
		let delivery_return_json = await delivery_return_resp.json();

		delivery_return_code = delivery_return_json.MembAddrNo.toString();

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

				const test = await gql(MUTATIONS.CHECK_ESM_PLUS, {
					productId: market_item.id,
					siteCode: shopCode,
				});

				if (JSON.parse(test.data.checkESMPlus).length >= 1) {
					productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);
					productStore.addRegisteredFailed(
						Object.assign(market_item, {
							error: `(${shopName.split(' ')[0]}1.0)에 업로드된 상품으로 등록불가능합니다.`,
						}),
					);

					continue;
				}
				// 이미 등록된 경우
				if (!market_item.cert) {
					// 상품 수정모드가 아니면
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
					// 상품 수정모드면
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

				let categoryResp2 = await fetch(chrome.runtime.getURL('resources/esmCategory.json'));
				let categoryJson2 = await categoryResp2.json();
				let esmcategoryNumber2;
				let esmtogmarketoractioncategory2; //추가금불가능하고 , 옵션제한카테고리인지 확인해야함 undefined가 아니면 해당함
				if (shopCode === 'A522') {
					let auctionOptionscategoryResp = await fetch(chrome.runtime.getURL('resources/auctionOptions.json'));
					let auctionOptionscategoryJson = await auctionOptionscategoryResp.json();

					esmcategoryNumber2 = categoryJson2.find((item) => item.A옥션 === market_item.cate_code);
					if (esmcategoryNumber2 === undefined) {
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);
						productStore.addRegisteredFailed(
							Object.assign(market_item, { error: 'esm2.0에서 해당 카테고리를 지원하지 않습니다.' }),
						);
						await sendCallback(
							commonStore,
							data,
							market_code,
							parseInt(product),
							2,
							'esm2.0에서 해당 카테고리를 지원하지 않습니다.',
						);

						continue;
					}

					esmtogmarketoractioncategory2 = auctionOptionscategoryJson.find(
						(item) => item.카테고리코드 == esmcategoryNumber2['A옥션'],
					);
				} else if (shopCode === 'A523') {
					let gmarketOptionscategoryResp = await fetch(chrome.runtime.getURL('resources/gmarketOptions.json'));
					let gmarketOptionscategoryJson = await gmarketOptionscategoryResp.json();

					esmcategoryNumber2 = categoryJson2.find((item) => item.G마켓 === market_item.cate_code);
					if (esmcategoryNumber2 === undefined) {
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);
						productStore.addRegisteredFailed(
							Object.assign(market_item, { error: 'esm2.0에서 해당 카테고리를 지원하지 않습니다.' }),
						);
						await sendCallback(
							commonStore,
							data,
							market_code,
							parseInt(product),
							2,
							'esm2.0에서 해당 카테고리를 지원하지 않습니다.',
						);

						continue;
					}
					esmtogmarketoractioncategory2 = gmarketOptionscategoryJson.find(
						(item) => item.카테고리코드 == esmcategoryNumber2['G마켓'],
					);
				}

				console.log('esmtogmarketoractioncategory', esmtogmarketoractioncategory2); //추가금불가능하고 , 옵션제한카테고리인지 확인해야함 undefined가 아니면 해당함

				let errorEditionalPrice: boolean = false;

				if (esmtogmarketoractioncategory2 !== undefined) {
					for (let i in market_optn) if (market_optn[i].price !== 0) errorEditionalPrice = true;
				}

				if (errorEditionalPrice === true) {
					productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);
					productStore.addRegisteredFailed(
						Object.assign(market_item, {
							error: '해당 카테고리는 추가금이 불가합니다. 옵션판매가를 모두 동일하게 설정해주세요.',
						}),
					);

					await sendCallback(
						commonStore,
						data,
						market_code,
						parseInt(product),
						2,
						'해당 카테고리는 추가금이 불가합니다. 옵션판매가를 모두 동일하게 설정해주세요.',
					);

					continue;
				}
				let image_list: any = [];
				let name = byteSlice(market_item.name3, 100);

				// 썸네일 이미지
				for (let i in market_item) {
					if (i.match(/img[0-9]/) && !i.includes('blob') && i !== 'img1') {
						if (market_item[i] !== '') {
							try {
								let img = /^https?:/.test(market_item[i]) ? market_item[i] : 'http:' + market_item[i];

								image_list.push({
									Operation: 1,
									Url: img,
									BigImage: 'false',
									ImageSourceCode: '0',
									ImageSourceOriginId: '',
								});
							} catch {
								continue;
							}
						}
					}
				}

				if (!commonStore.uploadInfo.markets.find((v: any) => v.code === shopCode)?.video) market_item.misc1 = '';

				// 상품상세페이지 (추적코드, 상단이미지, 내용, 하단이미지 순)
				let desc = `
        ${getStoreTraceCodeV1(market_item.id, shopCode)}

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

    				${commonStore.user.userInfo?.descriptionShowTitle === 'Y' ? market_item.name3 : ``}
    			</div>

    			<br />
    			<br />

    			${transformContent(market_item.content1)}
                ${market_item.content3}
    		`;

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
							if (j.includes('opt') && j !== 'optimg' && market_optn[i][j] !== '') {
								for (let k in words_list) {
									if (words_list[k].findWord && !words_list[k].replaceWord)
										if (market_optn[i][j].includes(words_list[k].findWord))
											words_restrict['옵션명'] = words_list[k].findWord;
								}
							}
						}
					}
				}

				// 금지어 탐색
				if (Object.keys(words_restrict).length > 0) {
					let message = '';

					for (let i in words_restrict) message += i + '에서 금지어(' + words_restrict[i] + ')가 발견되었습니다. ';

					productStore.addRegisteredFailed(Object.assign(market_item, { error: message }));
					productStore.addConsoleText(`(${shopName}) [${market_code}] 금지어 발견됨`);

					await sendCallback(commonStore, data, market_code, parseInt(product), 2, message);

					continue;
				}

				let option_count = Object.keys(group).length;
				//상품등록
				let option_data: any = {
					OptionInfoList: [], //esm2.0처리
				};

				// 옵션정보 생성
				for (let i in market_optn) {
					if (market_optn[i].code === market_code) {
						if (commonStore.user.userInfo?.autoPrice === 'Y') {
							let iprice = market_item.sprice;
							let oprice = market_item.sprice + market_optn[i].price;
							let percent = Math.ceil((oprice / iprice - 1) * 100);

							if (percent < -50 || percent > 50) continue;
						}

						if (option_count === 1)
							option_data['OptionInfoList'].push({
								OptType: option_count,
								OptValue1: market_optn[i].opt1,
								RcmdOptValueNo1: '0',
								OptName1: market_optn[i].misc1,
								RcmdOptNo1: '0',
								OptValue2: market_optn[i].opt2,
								RcmdOptValueNo2: '0',
								OptName2: market_optn[i].misc2,
								RcmdOptNo2: '0',
								OptValue3: market_optn[i].opt3,
								RcmdOptValueNo3: '0',
								OptName3: market_optn[i].misc3,
								RcmdOptNo3: '0',
								SellerStockCode: null,
								SkuMatchingVerNo: null,
								AddAmnt: market_optn[i].price,
								OptRepImageLevel: '0',
								OptRepImageUrl: '',
								OptionInfoCalculation: null,
								SkuList: null,
								OptionNameLangList: [],
								OptionValueLangList: [
									{
										LangCode: 'ENG',
										Opt1: market_optn[i].opt1,
										Opt2: market_optn[i].opt2,
										Opt3: market_optn[i].opt3,
									},
									{
										LangCode: 'JPN',
										Opt1: market_optn[i].opt1,
										Opt2: market_optn[i].opt2,
										Opt3: market_optn[i].opt3,
									},
									{
										LangCode: 'CHN',
										Opt1: market_optn[i].opt1,
										Opt2: market_optn[i].opt2,
										Opt3: market_optn[i].opt3,
									},
								],
								SiteOptionInfo: [
									{
										SiteId: '1',
										ExposeYn: 'Y', //해당 노출여부는 아님 바꿔보니까 에러문구가 달랐음
										SoldOutYn: 'N',
										StockQty: null,
									},
									{
										SiteId: '2',
										ExposeYn: 'Y', //해당 노출여부는 아님 바꿔보니까 에러문구가 달랐음
										SoldOutYn: 'N',
										StockQty: null,
									},
								],
							});
						else
							option_data['OptionInfoList'].push({
								OptType: option_count,
								OptValue1: market_optn[i].opt1,
								RcmdOptValueNo1: '0',
								OptName1: market_optn[i].misc1,
								RcmdOptNo1: '0',
								OptValue2: market_optn[i].opt2,
								RcmdOptValueNo2: '0',
								OptName2: market_optn[i].misc2,
								RcmdOptNo2: '0',
								OptValue3: market_optn[i].opt3,
								RcmdOptValueNo3: '0',
								OptName3: market_optn[i].misc3,
								RcmdOptNo3: '0',
								SellerStockCode: null,
								SkuMatchingVerNo: null,
								AddAmnt: market_optn[i].price,
								OptRepImageLevel: '0',
								OptRepImageUrl: '',
								OptionInfoCalculation: null,
								SkuList: null,
								OptionNameLangList: [],
								OptionValueLangList: [
									{
										LangCode: 'ENG',
										Opt1: market_optn[i].opt1,
										Opt2: market_optn[i].opt2,
										Opt3: market_optn[i].opt3,
									},
									{
										LangCode: 'JPN',
										Opt1: market_optn[i].opt1,
										Opt2: market_optn[i].opt2,
										Opt3: market_optn[i].opt3,
									},
									{
										LangCode: 'CHN',
										Opt1: market_optn[i].opt1,
										Opt2: market_optn[i].opt2,
										Opt3: market_optn[i].opt3,
									},
								],
								SiteOptionInfo: [
									{
										SiteId: '1',
										ExposeYn: 'Y',
										SoldOutYn: 'N',
										StockQty: null,
									},
									{
										SiteId: '2',
										ExposeYn: 'Y',
										SoldOutYn: 'N',
										StockQty: null,
									},
								],
							});
					}
				}

				let date = new Date();
				let YY1 = date.getFullYear().toString();
				let MM1 = (date.getMonth() + 1).toString().padStart(2, '0');
				let DD1 = date.getDate().toString().padStart(2, '0');

				date.setDate(date.getDate() + 90);

				let YY2 = date.getFullYear().toString();
				let MM2 = (date.getMonth() + 1).toString().padStart(2, '0');
				let DD2 = date.getDate().toString().padStart(2, '0');

				const itemInfo = productStore.itemInfo.items.find((v: any) => v.productCode === market_code)!;

				// 고시정보 생성
				const sillCode = itemInfo[`sillCode${shopCode}`] ? itemInfo[`sillCode${shopCode}`] : '35';
				const sillData = itemInfo[`sillData${shopCode}`]
					? JSON.parse(itemInfo[`sillData${shopCode}`])
					: [
							{ code: '35-1', name: '품명 및 모델명', type: 'input' },
							{ code: '35-2', name: '허가 관련', type: 'input' },
							{ code: '35-3', name: '제조국 또는 원산지', type: 'input' },
							{ code: '35-4', name: '제조자/수입자', type: 'input' },
							{ code: '35-5', name: '관련 연락처', type: 'input' },
							{ code: '35-6', name: '주문후 예상 배송기간', type: 'input' },
					  ];

				const sillResult = {
					NoticeItemGroupNo: sillCode,
					NoticeItemCodes: sillData.map((v) => {
						return {
							NoticeItemCode: v.code,
							NoticeItemValue: v.value ?? '상세설명참조',
						};
					}),
				};

				let test_today = new Date().toISOString();
				let test_tommorow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString();
				let categoryResp = await fetch(chrome.runtime.getURL('resources/esmCategory.json'));
				let categoryJson = await categoryResp.json();
				let esmcategoryNumber;

				if (shopCode === 'A522') {
					esmcategoryNumber = categoryJson.find((item) => item.A옥션 === market_item.cate_code);
					if (esmcategoryNumber === undefined) {
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);
						productStore.addRegisteredFailed(
							Object.assign(market_item, { error: 'esm2.0에서 해당 카테고리를 지원하지 않습니다.' }),
						);

						await sendCallback(
							commonStore,
							data,
							market_code,
							parseInt(product),
							2,
							'esm2.0에서 해당 카테고리를 지원하지 않습니다.',
						);

						continue;
					}
				} else if (shopCode === 'A523') {
					esmcategoryNumber = categoryJson.find((item) => item.G마켓 === market_item.cate_code);
					if (esmcategoryNumber === undefined) {
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);
						productStore.addRegisteredFailed(
							Object.assign(market_item, { error: 'esm2.0에서 해당 카테고리를 지원하지 않습니다.' }),
						);

						await sendCallback(
							commonStore,
							data,
							market_code,
							parseInt(product),
							2,
							'esm2.0에서 해당 카테고리를 지원하지 않습니다.',
						);

						continue;
					}
				}

				let test_body = {
					MasterId: userMatched?.[1], //esm2.0추가
					LoginId:
						shopCode === 'A522'
							? commonStore.user.userInfo?.esmplusAuctionId
							: commonStore.user.userInfo?.esmplusGmarketId, //esm2.0추가
					//esm2.0추가 아래부터
					GoodsNo: null,
					SiteGoodsNo: null,
					IsIacSellingStatus: '0',
					IsIacSellingStatusSpecified: false,
					CommandType: '1', //CommandType 1 등록, 2 수정, 4 해제
					IsLeaseAllowedInIac: false,
					CallFrom: '0',
					IsSingleGoods: false,
					SiteGoodsNoIac: null,
					SiteGoodsNoGmkt: null,
					GoodsKind: '1',
					BarCode: null,
					IsSiteDisplayIac: false,
					IsSiteDisplayGmkt: false,
					SellingStatusIac: null,
					SellingStatusGmkt: shopCode === 'A522' ? 'N' : null,
					IsDeleteGroup: false,
					EditorUseYn: 'Y',
					SdInfo: {
						SdCategoryCode: esmcategoryNumber['ESM카테고리'], //esm카테고리번호네
						SdBrandName: null,
						SdMakerId: '0',
						SdMakerName: null,
						SdBrandId: '0',
						SdProductBrandId: '0',
						SdProductBrandName: null,
						EpinCodeList: [null],
						SdAttrMatchingList: [],
						SdBasicAttrMatching: {},
						EpinCreateReqBarcode: '',
						EpinCreateReqModelName: '',
						EpinCreateReqModelNo: '',
					},
					BuyableQuantityMappingType: '1',
					IsIacConvertToSingleGoods: false,
					IsGmktConvertToSingleGoods: false,
					AdminId: null,
					//esm2.0추가 위에 까지
					SYIStep1: {
						PurchaseBenefits: [], //esm2.0추가
						RegMarketType: shopCode === 'A522' ? '1' : '2',
						SiteSellerId: upload_type,
						HasCatalog: false, //esm2.0추가
						CatalogId: '0', //esm2.0추가
						CatalogName: '', //esm2.0추가
						CatalogLowestPrice: '0', //esm2.0추가
						SellType: '1',
						GoodsType: '1',

						GoodsName: {
							InputType: '1',
							GoodsName: name, //GoodsNameSearch + GoodsNamePrmt로 구성됨
							GoodsNameSearch: name, //검색용 프로모션 키워드 //esm2.0추가 이게 필수값이네;
							GoodsNamePrmt: '', // 일반 프로모션 상품명  //esm2.0추가
							SiteGoodsName: [], //esm2.0추가
							SiteGoodsNameEng: [
								//esm2.0추가
								{
									key: '1',
									value: '',
								},
								{
									key: '2',
									value: '',
								},
							],
							SiteGoodsNameChn: [
								//esm2.0추가
								{
									key: '1',
									value: '',
								},
								{
									key: '2',
									value: '',
								},
							],
							SiteGoodsNameJpn: [
								//esm2.0추가
								{
									key: '1',
									value: '',
								},
								{
									key: '2',
									value: '',
								},
							],
							UseSellerNicknameIac: false, //esm2.0추가
							AdMessageIac: '', //esm2.0추가
						},

						SiteCategoryCode: [
							{
								key: '1',
								value: market_item.cate_code,
							},
							{
								key: '2',
								value: market_item.cate_code,
							},
						],
						//esm2.0추가
						SiteGoodsClassList: [
							//esm2.0추가
							{
								key: '1',
								value: '',
							},
							{
								key: '2',
								value: '',
							},
						],
						Book: {
							//esm2.0추가
							Author: '',
							BrandName: '',
							BrandNo: '',
							ISBNCode: '',
							ImgSmall: '',
							IsSTCodeImage: false,
							IsbnCodeAllowYn: 'N',
							MakerName: '',
							MakerNo: '',
							Name: '',
							Price: '',
							PublishDate: null,
							Publisher: '',
							STCode: '',
							Title: '',
							Translater: '',
						},
						MakerId: '0', //esm2.0추가
						MakerName: '', //esm2.0추가
						UserDefineMakerName: '', //esm2.0추가
						BrandId: '0', //esm2.0추가
						BrandName: '', //esm2.0추가
						UserDefineBrandName: '', //esm2.0추가
						GmktShopKind1: '-1', //esm2.0추가
						GmktShopKind2: '-1', //esm2.0추가
						GmktShopKind3: '-1', //esm2.0추가
						StatusCode: '', //esm2.0추가
						StoreShopCategoryGoods: {
							//esm2.0추가
							CategoryLevel: '0',
							ShopLCategoryCode: '00000000',
							ShopMCategoryCode: '00000000',
							ShopSCategoryCode: '00000000',
						},
						MiniShopCategoryGoods: {
							//esm2.0추가
							CategoryLevel: '0',
							ShopLCategoryCode: '00000000',
							ShopMCategoryCode: '00000000',
							ShopSCategoryCode: '00000000',
						},
						IsTPLGoods: false, //esm2.0추가
						AdminRestrict: '', //esm2.0추가
						SiteSellerAdjustCommissionPrice: {
							//esm2.0추가
							IacOpenAdjustCommissionPrice: '0',
							IacSpecialAdjustCommissionPrice: '0',
							GmktOpenAdjustCommissionPrice: '0',
							GmktSpecialAdjustCommissionPrice: '0',
						},
						CatalogInfo: {
							//esm2.0추가
							CatalogId: '0',
							CatalogIdSpecified: false,
							CatalogName: null,
							LowestPrice: '0',
							LowestPriceSpecified: false,
							ImageUrl: null,
							MakerId: '0',
							MakerIdSpecified: false,
							MakerName: null,
							BrandId: '0',
							BrandIdSpecified: false,
							BrandName: null,
							ModelName: null,
							MainDescription: null,
							MatchingItemCount: '0',
							MatchingItemCountSpecified: false,
							ProductionDate: null,
							ProductionDateSpecified: false,
							ProductionDateType: '0',
							ProductionDateTypeSpecified: false,
							PriceRenovationDate: null,
							PriceRenovationDateSpecified: false,
							IsAdult: false,
							IsAdultSpecified: false,
							IsBook: false,
							IsBookSpecified: false,
						},
						IsItemNameChangeAllowed: false, //esm2.0추가
					},

					SYIStep2: {
						SellingStatus: '0',
						GoodsStatus: '1',
						UsedMonths: null, //esm2.0추가
						IsGMKTEnvironmentFriendlyCertType: false, //esm2.0추가
						IsIACEnvironmentFriendlyCertType: false, //esm2.0추가
						//원산지항목추가
						Price: {
							InputType: '1',
							GoodsPrice: market_item.sprice.toString(),
							GoodsPriceIAC: market_item.sprice.toString(),
							GoodsPriceGMKT: market_item.sprice.toString(),
							IsSeparate: false, //esm2.0추가
							IsUserCustomSettlementGMKT: false, //esm2.0추가
							GoodsPriceSettlementGMKT: '0', //esm2.0추가
							BookPrice: '0', //esm2.0추가
							OrgGoodsPrice: '0', //esm2.0추가
						},
						PricePerUnit: {
							//esm2.0추가
							Unit: null,
							UnitPrice: '0',
						},
						WirelessCallingPlan: {
							//esm2.0추가
							PhoneFeeType: '0',
							PhoneFeeUrl: '',
							Plans: [],
							MobilePhoneFeeUrl: '',
						},
						MobileDevicePrice: {
							//esm2.0추가
							PhoneDevicePrice: '',
							PhoneSupportDiscount: '',
							MakerSupportDiscount: '',
							TeleComSupportDiscount: '',
							PhoneAddDiscount: '',
							PhoneInstallmentPrice: '',
						},
						Stock: {
							InputType: '1',
							GoodsCount: market_item.stock.toString(),
							GoodsCountIAC: market_item.stock.toString(),
							GoodsCountGMKT: market_item.stock.toString(),
							SiteGoodsCountNo: '0', //esm2.0추가
							BuyableQuantityType: '0', //esm2.0추가
							BuyableQuantity: '', //esm2.0추가
							BuyableQuantityDay: '', //esm2.0추가
							OldGoodsCount: '0', //esm2.0추가
							OldGoodsCountIAC: '0', //esm2.0추가
							OldGoodsCountGMKT: '0', //esm2.0추가
						},

						Options: {
							InputType: '1',
							OptVerType: '0',
							OptVerTypeIAC: '0',
							OptVerTypeGMKT: '0',
							JsonData: '',
							JsonDataIAC: '', //esm2.0추가
							JsonDataGMKT: '', //esm2.0추가
							JsonDataLegacy: '', //esm2.0추가
						}, //todo 옵션작업해야함 ->완
						OrderOption: {
							OptType: option_count,
							StockMngIs: false,
							UnifyStockIs: false,
							...option_data, //OptioninfoList
						}, //esm2.0추가
						Additions: {
							//esm2.0추가
							InputType: '1',
							JsonData: null,
							JsonDataIAC: null,
							JsonDataGMKT: null,
							JsonDataLegacy: null,
							CommonGoodsNo: null,
							IsUseCommonGoods: false,
						},
						AddonService: {
							//esm2.0추가
							AddonServiceUseType: '0',
							AddonServiceList: [],
						},
						SellingPeriod: {
							//   InputType: "1",//esm2.0제거
							History: [], //esm2.0추가
							IAC: {
								StartDate: `${YY1}-${MM1}-${DD1} 00:00:00`,
								EndDate: `${YY2}-${MM2}-${DD2} 23:59:59`,
							},

							GMKT: {
								StartDate: `${YY1}-${MM1}-${DD1} 00:00:00`,
								EndDate: `${YY2}-${MM2}-${DD2} 23:59:59`,
							},
						},
						PreSale: {
							//esm2.0추가
							UseSettingIAC: false,
							SaleStartDateIAC: '2023-06-04',
						},
						GoodsImage: {
							PrimaryImage: {
								Operation: '1',
								Url: market_item.img1,
								BigImage: 'false',
							},
							FixedImage: {
								Operation: '1',
								Url: market_item.img1,
								BigImage: 'false',
							},
							AdditionalImagesSite: '0',
							AdditionalImagesStr: JSON.stringify(image_list),
						},
						DescriptionTypeSpecified: true,
						NewDescription: {
							InputType: '1',
							Text: desc,
						},
						ItemCode: market_code,
						CustCategoryNo: '0', //esm2.0추가
						CustCategory: null, //esm2.0추가
						ExpiryDate: '0-0-0', //esm2.0추가
						ExpiryDateSpecified: true, //esm2.0추가
						LaunchingDate: null, //esm2.0추가
						LaunchingDateSpecified: false, //esm2.0추가
						ManufacturedDate: '0-0-0', //esm2.0추가
						ManufacturedDateSpecified: true, //esm2.0추가
						Origin: {
							ProductType: '',
							Type: '0',
							Name: '',
							Code: '',
							IsMultipleOrigin: false,
						},
						LegacyRawMaterials: null, //esm2.0추가
						RawMaterials: null, //esm2.0추가
						Capacity: {
							//esm2.0추가
							Volume: null,
							Unit: '0',
							IsMultipleVolume: false,
						},
						Manual: null, //esm2.0추가
						ECoupon: {
							//esm2.0추가
							Period: '0',
							Price: '0',
							Ratio: '0',
							CouponName: '',
							ExpireType: '0',
							Expire1StartDate: '',
							Expire1EndDate: '',
							Expire2Duration: '0',
							Expire2Start: '0',
							UseTermType: '0',
							UseTerm1StartDate: '',
							UseTerm1EndDate: '',
							UseTerm2Start: '0',
							UseTerm2Duration: '0',
							CouponTemplate: '0',
							CouponImageUrl: '',
							DownloadTemplate: '0',
							DownloadImageUrl: '',
							ApplyPlace: '',
							IsInformByAddress: false,
							Address: '',
							AddressNo: '',
							IsInformByURL: false,
							URL: '',
							ApplyPlacePriority: '0',
							MoneyType: '0',
							MobileUseInfo: '',
							MobileHelpDeskphoneNo: '',
							TelephoneNo: '',
							AdditionalBenefit: '',
							HasRestrictCondition: false,
							RestrictCondition: '',
							Guide: '',
							PublicationCorp: '',
							PublicationCorpURL: '',
							IsCustomerNameView: false,
						},
						DeliveryInfo: {
							// BundleDeliveryTempNo: null,
							// BundleDeliveryYNType: null,
							CommonDeliveryUseYn: true, // 1
							InvalidDeliveryInfo: false, // 1
							CommonDeliveryWayOPTSEL: '0', // 1
							GmktDeliveryWayOPTSEL: '1', // 1
							IsCommonGmktUnifyDelivery: false, // 1
							GmktDeliveryCOMP: shopCode === 'A523' ? '10034' : null, // 1
							IacDeliveryCOMP: shopCode === 'A522' ? '10034' : null, // 1
							IsCommonVisitTake: false, // 1
							IsCommonQuickService: false, // 1
							IsCommonIACPost: false, // 1
							CommonIACPostType: '0', // 1
							CommonIACPostPaidPrice: '0', // 1
							IsGmktVisitTake: false, // 1
							IsGmktQuickService: false, // 1
							IsGmktTodayDEPAR: false, // 1
							IsGmktTodayDEPARAgree: false, // 1
							IsGmktVisitReceiptTier: false, // 1
							MountBranchGroupSeq: '0', // 1
							CommonVisitTakeType: '0', // 1
							CommonVisitTakePriceDcAmnt: '0', // 1
							CommonVisitTakeFreeGiftName: null, // 1
							CommonVisitTakeADDRNo: null, // 1
							CommonQuickServiceCOMPName: null, // 1
							CommonQuickServicePhone: null, // 1
							CommonQuickServiceDeliveryEnableRegionNo: null, // 1
							ShipmentPlaceNo: delivery_shipping_code.toString(), // 1
							DeliveryFeeType: '2', // 0 -> 1임
							EachDeliveryFeeType: market_item.deliv_fee > 0 ? '2' : '1', // 1 :null로 같음
							EachDeliveryFeeQTYEachGradeType: null, // 1
							// 맞겟지 뭐
							DeliveryFeeTemplateJSON:
								market_item.deliv_fee > 0
									? JSON.stringify({
											DeliveryFeeType: 2,
											DeliveryFeeSubType: 0,
											FeeAmnt: market_item.deliv_fee,
											PrepayIs: true,
											CodIs: false,
											JejuAddDeliveryFee: commonStore.user.userInfo?.additionalShippingFeeJeju,
											BackwoodsAddDeliveryFee: commonStore.user.userInfo?.additionalShippingFeeJeju,
											ShipmentPlaceNo: delivery_shipping_code,
											DetailList: [],
									  })
									: JSON.stringify({
											DeliveryFeeType: 1,
											DeliveryFeeSubType: 0,
											FeeAmnt: 0,
											PrepayIs: false,
											CodIs: false,
											JejuAddDeliveryFee: 0,
											BackwoodsAddDeliveryFee: 0,
											ShipmentPlaceNo: delivery_shipping_code,
											DetailList: [],
									  }),
							EachDeliveryFeePayYn: '2', // null로 같음
							IsCommonGmktEachADDR: false, // 1
							ReturnExchangeADDRNo: delivery_return_code, // 1
							OldReturnExchangeADDR: null, // 1
							OldReturnExchangeADDRTel: null, // 1
							OldReturnExchangeSetupDeliveryCOMPName: null, // 1
							OldReturnExchangeDeliveryFeeStr: null, // 1
							ExchangeADDRNo: '', // 1
							ReturnExchangeSetupDeliveryCOMP: null, // 1
							ReturnExchangeSetupDeliveryCOMPName: null, // 1
							ReturnExchangeDeliveryFee: '0', // 1
							ReturnExchangeDeliveryFeeStr: commonStore.user.userInfo?.refundShippingFee.toString(), // 1
							IacTransPolicyNo: delivery_policy_code_iac, //  1
							GmktTransPolicyNo: delivery_policy_code_gmk, // 1
							BackwoodsDeliveryYn: 'Y', // 1 : Y로같음
							IsTplConvertible: false, // 1
							IsGmktIACPost: false, // 1
						},
						IsAdultProduct: 'False',
						IsVATFree: 'False',
						ASInfo: null, //esm2.0추가
						CertIAC: {
							HasIACCertType: false, //esm2.0추가
							MedicalInstrumentCert: {
								//esm2.0추가
								ItemLicenseNo: null,
								AdDeliberationNo: null,
								IsUse: false,
								CertificationOfficeName: null,
								CertificationNo: null,
								Operation: '1',
							},
							BroadcastEquipmentCert: {
								//esm2.0추가
								BroadcastEquipmentIs: false,
								AddtionalConditionIs: false,
								IsUse: false,
								CertificationOfficeName: null,
								CertificationNo: '',
								Operation: '1',
							},
							FoodCert: {
								//esm2.0추가
								IsUse: false,
								CertificationOfficeName: null,
								CertificationNo: null,
								Operation: '1',
							},
							HealthFoodCert: {
								//esm2.0추가
								AdDeliberationNo: null,
								IsUse: false,
								CertificationOfficeName: null,
								CertificationNo: null,
								Operation: '1',
							},
							EnvironmentFriendlyCert: {
								//esm2.0추가
								CertificationType: 'ENV_DTL',
								isIACEnvironmentFriendlyCertType: false,
								isGMKTEnvironmentFriendlyCertType: false,
								CertBizType: 'ENV_DTL',
								ProducerName: null,
								PresidentInfoNA: null,
								RepItemName: null,
								InfoHT: null,
								CertGroupType: null,
								InfoEM: null,
								CertStartDate: null,
								CertEndDate: null,
								InfoAD: null,
								CertificationOfficeName: null,
								CertificationExpiration: null,
								IsUse: false,
								CertificationNo: null,
								Operation: '1',
							},
							SafeCert: {
								//esm2.0추가
								SafeCertType: '0',
								AuthItemType: '0',
								CertificationNo: null,
								IsUse: false,
								CertificationOfficeName: null,
								Operation: '1',
							},
							ChildProductSafeCert: {
								SafeCertType: '0', //esm2.0추가
								ChangeType: '0',
								SafeCertDetailInfoList: [],
							},
							IntegrateSafeCert: {
								ItemNo: null,
								IntegrateSafeCertGroupList: [
									{
										SafeCertGroupNo: '1',
										CertificationType: '1',
									},
									{
										SafeCertGroupNo: '2',
										CertificationType: '1',
									},
									{
										SafeCertGroupNo: '3',
										CertificationType: '1',
									},
								],
							},
						},
						CertificationNoGMKT: '', //esm2.0추가
						LicenseSeqGMKT: null, //esm2.0추가
						OfficialNotice: sillResult,
						ItemWeight: '0', //esm2.0추가
						SkuList: [], //esm2.0추가 옵션데이터..
						SkuMatchingVerNo: '0', //esm2.0추가
						RentalAddInfo: null, //esm2.0추가
						CertificationTextGMKT: '', //esm2.0추가
						LicenseTextGMKT: null, //esm2.0추가
						InventoryNo: null, //esm2.0추가
						SingleSellerShop: null, //esm2.0추가
						IsUseSellerFunding: null, //esm2.0추가
						IsGift: true, //esm2.0추가
						ConsultingDetailList: [], //esm2.0추가
					},
					SYIStep3: {
						G9RegisterCommand: '0',
						IsG9Goods: false,
						IsOnlyG9Goods: false,
						SellerDiscount: {
							DiscountAmtIac1: '0',
							DiscountAmtIac2: null,
							DiscountAmtGmkt1: '0',
							DiscountAmtGmkt2: null,
							IsSellerDCExceptionIacItem: false,
							IsSellerDCExceptionGmktItem: false,
							IsUsed: '2',
							IsUsedSpecified: false,
							DiscountType: '1',
							DiscountTypeSpecified: false,
							DiscountAmt: '0',
							DiscountAmtSpecified: false,
							DiscountAmt1: '0',
							DiscountAmt1Specified: false,
							DiscountAmt2: null,
							DiscountAmt2Specified: false,
							StartDate: `${YY1}-${MM1}-${DD1}`,
							StartDateSpecified: false,
							EndDate: '9999-12-31',
							EndDateSpecified: false,
							DiscountTypeIac: '1',
							DiscountTypeSpecifiedIac: false,
							StartDateIac: `${YY1}-${MM1}-${DD1}`,
							StartDateSpecifiedIac: false,
							EndDateIac: '9999-12-31',
							IacEndDateSpecified: false,
							DiscountAmtIac: '0',
							DiscountAmtSpecifiedIac: false,
							DiscountTypeGmkt: '1',
							DiscountTypeSpecifiedGmkt: false,
							StartDateGmkt: `${YY1}-${MM1}-${DD1}`,
							StartDateSpecifiedGmkt: false,
							EndDateGmkt: '9999-12-31',
							EndDateSpecifiedGmkt: false,
							DiscountAmtGmkt: '0',
							DiscountAmtSpecifiedGmkt: false,
						},
						FreeGift: {
							IsUsed: '2',
							IsUsedSpecified: false,
							IsOnly: '1',
							IsOnlySpecified: false,
							IacFreeGiftName: '',
							GmkFreeGiftName: '',
						},
						IsPcs: true,
						IsPcsSpecified: true,
						IacPcsCoupon: true,
						IacPcsCouponSpecified: false,
						GmkPcsCoupon: true,
						GmkPcsCouponSpecified: false,
						GmkBargain: false,
						GmkBargainSpecified: false,
						IacFreeWishKeyword: [],
						IacDiscountAgreement: true,
						IacDiscountAgreementSpecified: false,
						GmkDiscountAgreement: false,
						GmkDiscountAgreementSpecified: false,
						GmkOverseaAgreementSeller: true,
						GmkOverseaAgreementSellerSpecified: false,
						IacBuyerBenefit: {
							IsUsed: '2',
							IsUsedSpecified: false,
							StartDate: test_today,
							StartDateSpecified: false,
							EndDate: test_tommorow,
							EndDateSpecified: false,
							IsMemberDiscount: false,
							IsMemberDiscountSpecified: false,
							MemberDiscountPrice: '0',
							MemberDiscountPriceSpecified: false,
							IsBulkDiscount: false,
							IsBulkDiscountSpecified: false,
							BulkDiscountQty: '0',
							BulkDiscountQtySpecified: false,
							BulkDiscountPrice: '0',
							BulkDiscountPriceSpecified: false,
						},
						GmkBuyerBenefit: {
							IsUsed: '2',
							IsUsedSpecified: false,
							Type: '',
							StartDate: test_today,
							StartDateSpecified: false,
							EndDate: test_tommorow,
							EndDateSpecified: false,
							ConditionType: '',
							ConditionValue: '0',
							ConditionValueSpecified: false,
							Unit: '',
							UnitValue: '0',
							UnitValueSpecified: false,
							WhoFee: '',
						},
						IacDonation: {
							IsUsed: '2',
							IsUsedSpecified: false,
							StartDate: test_today,
							StartDateSpecified: false,
							EndDate: test_tommorow,
							EndDateSpecified: false,
							DonationPrice: '0',
							DonationPriceSpecified: false,
							DonationMaxPrice: '0',
							DonationMaxPriceSpecified: false,
							DonationType: '',
						},
						GmkDonation: {
							IsUsed: '2',
							IsUsedSpecified: false,
							StartDate: test_today,
							StartDateSpecified: false,
							EndDate: test_tommorow,
							EndDateSpecified: false,
							DonationPrice: '0',
							DonationPriceSpecified: false,
							DonationMaxPrice: '0',
							DonationMaxPriceSpecified: false,
							DonationType: '',
						},
						IacSellerPoint: {
							IsUsed: '2',
							IsUsedSpecified: false,
							PointType: '1',
							PointTypeSpecified: false,
							Point: '0',
							PointSpecified: true,
						},
						GmkSellerMileage: {
							IsUsed: '2',
							IsUsedSpecified: false,
							PointType: '1',
							PointTypeSpecified: false,
							Point: '0',
							PointSpecified: true,
						},
						IacChance: {
							IsUsed: '2',
							IsUsedSpecified: false,
							StartDate: test_today,
							StartDateSpecified: false,
							EndDate: test_tommorow,
							EndDateSpecified: false,
							ChanceQty: '0',
						},
						IacBrandShop: {
							IsUsed: '2',
							IsUsedSpecified: false,
							LCategoryCode: '',
							MCategoryCode: '',
							SCategoryCode: '',
							BrandCode: '',
							BrandName: '',
							BrandImage: [],
						},
						GmkBizOn: {
							IsUsed: '2',
							IsUsedSpecified: false,
							LCategoryCode: '',
							MCategoryCode: '',
							SCategoryCode: '',
						},
						IacAdditional: [],
						GmkAdditional: [],
						IacPayWishKeyword: [],
						IacAdPromotion: {
							CategorySmart: {
								LCategoryPrice: '0',
								LCategoryPriceSpecified: false,
								MCategoryPrice: '0',
								MCategoryPriceSpecified: false,
								SCategoryPrice: '0',
								SCategoryPriceSpecified: false,
								BestMainPrice: '0',
								BestMainPriceSpecified: false,
							},
							CategoryPower: {
								LCategoryPrice: '0',
								LCategoryPriceSpecified: false,
								MCategoryPrice: '0',
								MCategoryPriceSpecified: false,
								SCategoryPrice: '0',
								SCategoryPriceSpecified: false,
								BestMainPrice: '0',
								BestMainPriceSpecified: false,
							},
							Best100Smart: {
								LCategoryPrice: '0',
								LCategoryPriceSpecified: false,
								MCategoryPrice: '0',
								MCategoryPriceSpecified: false,
								SCategoryPrice: '0',
								SCategoryPriceSpecified: false,
								BestMainPrice: '0',
								BestMainPriceSpecified: false,
							},
							Chance: {
								LCategoryPrice: '0',
								LCategoryPriceSpecified: false,
								MCategoryPrice: '0',
								MCategoryPriceSpecified: false,
								SCategoryPrice: '0',
								SCategoryPriceSpecified: false,
								BestMainPrice: '0',
								BestMainPriceSpecified: false,
							},
							AccessMode: '1',
							AccessModeSpecified: false,
						},
						GmkAdPromotion: {
							LargePlus: '0',
							LargePlusSpecified: false,
							LargePowerMini: '0',
							LargePowerMiniSpecified: false,
							LargeBestPower: '0',
							LargeBestPowerSpecified: false,
							MiddlePlus: '0',
							MiddlePlusSpecified: false,
							MiddlePower: '0',
							MiddlePowerSpecified: false,
							MiddleDetailPower: '0',
							MiddleDetailPowerSpecified: false,
							MiddleBestPower: '0',
							MiddleBestPowerSpecified: false,
							SmallPlus: '0',
							SmallPlusSpecified: false,
							SmallPower: '0',
							SmallPowerSpecified: false,
						},
						OverseaAgree: {
							RegType: null,
							Gubun: '0',
							GubunSpecified: false,
							OverseaDisAgreeIs: false,
						},
						IsLeaseAvailableInIac: false,
						GmktShopGroupCd: '0',
						IsIacFreeWishKeyword: false,
						IacFreeWishKeywordEndDate: false,
						IacCommissionRate: '0',
						IacCommissionRateOpenMarket: '0',
						IacCommissionRateGroupBy: '0',
						IsIacFeeDiscountItem: false,
						IsDispExclude: true,
						IsDispExcludeSpecified: false,
					},
				};

				// 업로드 중단 시
				if (commonStore.uploadInfo.stopped) {
					productStore.addConsoleText(`(${shopName}) [${market_code}] 업로드 중단`);

					return false;
				}

				// 상품 수정모드인 경우
				if (!market_item.cert && commonStore.uploadInfo.editable) {
					let productId = market_item.name2; //상품번호
					if (!productId) {
						productStore.addRegisteredFailed(Object.assign(market_item, { error: '상품 ID를 찾을 수 없습니다.' }));
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 실패`);
						await sendCallback(commonStore, data, market_code, parseInt(product), 2, '상품 ID를 찾을 수 없습니다.');

						continue;
					}

					let productData = {
						paramsData: `{"Keyword": "${productId}","SiteId":"0","CategorySiteId":-1,"CategoryCode":"","CategoryLevel":"","TransPolicyNo":0,"StatusCode":"","SearchDateType":0,"SearchStartDate":"","SearchEndDate":"","SellerId":"","SellerSiteId":"","StockQty":-1,"SellPeriod":0,"DiscountUseIs":-1,"DeliveryFeeApplyType":0,"OptAddDeliveryType":0,"OptSelUseIs":-1,"PremiumEnd":0,"PremiumPlusEnd":0,"FocusEnd":0,"FocusPlusEnd":0,"GoodsIdType":"S","GoodsIds":"","ShopCateReg":-1,"IsTPLUse":"","SellMinPrice":0,"SellMaxPrice":0,"OrderByType":11,"GroupOrderByType":1,"IsGroupUse":"","IsApplyEpin":"","IsConvertSingleGoods":"","DisplayLimityn":"","IsGift":""}`,
						page: 1,
						start: 0,
						limit: 30,
					};

					let productContent: any = [];

					for (let property in productData) {
						let encodedKey = encodeURIComponent(property);
						let encodedValue = encodeURIComponent(productData[property]);
						productContent.push(encodedKey + '=' + encodedValue);
					}

					productContent = productContent.join('&');

					// 상품 조회 API
					const productResp = await fetch('https://www.esmplus.com/Sell/SingleGoodsMng/GetSingleGoodsList', {
						headers: {
							accept: '*/*',
							'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
							'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
							'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
							'sec-ch-ua-mobile': '?0',
							'sec-ch-ua-platform': '"Windows"',
							'sec-fetch-dest': 'empty',
							'sec-fetch-mode': 'cors',
							'sec-fetch-site': 'same-origin',
							'x-requested-with': 'XMLHttpRequest',
						},
						referrer: 'https://www.esmplus.com/Sell/Items/ItemsMng?menuCode=TDM100',
						referrerPolicy: 'strict-origin-when-cross-origin',
						body: productContent,
						method: 'POST',
						mode: 'cors',
						credentials: 'include',
					});

					const productJson = await productResp.json();
					if (!productJson.data) {
						productStore.addRegisteredFailed(Object.assign(market_item, { error: '상품 ID를 찾을 수 없습니다.' }));
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 실패`);
						await sendCallback(commonStore, data, market_code, parseInt(product), 2, '상품 ID를 찾을 수 없습니다.');

						continue;
					}

					// [API : 3000 WEB: 2161] 에러는 siteGoodsNo가 존재하지 않을때 뜨는 오류임
					let product_body = {
						model: {
							...test_body,
							SYIStep2: {
								...test_body.SYIStep2,
								SellingPeriod: {
									...test_body.SYIStep2.SellingPeriod,
									History: [
										// esm2.0 통합 추가 : 상품의 판매시작일자와 종료일자가 히스토리로 남아있는 듯 한데 일단 false로 해줌
										{
											// EndDate: '2023-01-25T14:59:59.000Z',
											EndDateSpecified: false,
											// StartDate: '2022-10-26T15:00:00.000Z',
											StartDateSpecified: false,
										},
									],
								},
							},
							GoodsNo: productJson.data[0].SingleGoodsNo,
							SiteGoodsNo: shopCode === 'A522' ? null : productId,
							SiteGoodsNoGmkt: shopCode === 'A523' ? productId : null,
							SiteGoodsNoIac: shopCode === 'A522' ? productId : null,
							CommandType: '2',
						},
						// orgModel: {
						//   ...test_body,
						// },필없
					};
					product_body.model.SYIStep2.Stock['SiteGoodsCountNo'] = productJson.data[0].SingleGoodsNo;
					productStore.addRegisteredQueue(market_item);
					productStore.addConsoleText(`(${shopName}) 상품 수정 중...`);

					console.log({ product_body });

					// 상품 수정 API
					let test_resp = await fetch('https://www.esmplus.com/Sell/SingleGoods/Save', {
						headers: {
							'content-type': 'application/json',
						},

						body: JSON.stringify(product_body),
						method: 'POST',
					});

					let test_text = await test_resp.text();

					try {
						let test_json = JSON.parse(test_text);
						let errorMessage: any = null;

						if (test_json.Unknown) errorMessage = test_json.Unknown.ErrorList[0].ErrorMessage;
						else {
							if (test_json.ExceptionMessage) errorMessage = test_json.ExceptionMessage;
							else {
								if (test_json['1']) errorMessage = test_json['1'].ErrorList[0].ApiErrorMessage;
								if (test_json['2']) errorMessage = test_json['2'].ErrorList[0].ApiErrorMessage;
							}
						}

						if (!errorMessage) errorMessage = '일시적인 오류로 서비스를 이용할 수 없습니다.';

						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 실패`);
						productStore.addRegisteredFailed(Object.assign(market_item, { error: errorMessage }));
						await sendCallback(commonStore, data, market_code, parseInt(product), 2, errorMessage);
					} catch (e) {
						let product_html = new DOMParser().parseFromString(test_text, 'text/html');
						let product_data: any = product_html.querySelector(
							'body > div.basic_contents > div.product_complete_group > div.group_item_result > table > tbody > tr:nth-child(1) > td > div.text_field > span',
						);
						let product_code = product_data ? product_data.textContent.trim() : '';

						if (!product_code) {
							productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 실패`);
							productStore.addRegisteredFailed(
								Object.assign(market_item, {
									error: '일시적인 오류로 서비스를 이용할 수 없습니다.',
								}),
							);

							await sendCallback(
								commonStore,
								data,
								market_code,
								parseInt(product),
								2,
								'일시적인 오류로 서비스를 이용할 수 없습니다.',
							);

							return false;
						}

						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 성공`);
						productStore.addRegisteredSuccess(Object.assign(market_item, { error: product_code }));
						await sendCallback(commonStore, data, market_code, parseInt(product), 1, product_code);
					}
				} else {
					productStore.addRegisteredQueue(market_item);
					productStore.addConsoleText(`(${shopName}) 상품 등록 중...`);

					let product_body = {
						model: {
							...test_body,
						},
					};

					// 상품 등록 API
					let test_resp = await fetch('https://www.esmplus.com/Sell/SingleGoods/Save', {
						headers: {
							'content-type': 'application/json',
						},
						body: JSON.stringify(product_body),
						method: 'POST',
					});

					let test_text = await test_resp.text();

					try {
						let test_json = JSON.parse(test_text);
						let errorMessage: any = null;

						if (test_json.Unknown) errorMessage = test_json.Unknown.ErrorList[0].ErrorMessage;
						else {
							if (test_json.ExceptionMessage) errorMessage = test_json.ExceptionMessage;
							else {
								if (test_json['1']) errorMessage = test_json['1'].ErrorList[0].ApiErrorMessage;
								if (test_json['2']) errorMessage = test_json['2'].ErrorList[0].ApiErrorMessage;
							}
						}

						if (!errorMessage) errorMessage = '일시적인 오류로 서비스를 이용할 수 없습니다.';

						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);
						productStore.addRegisteredFailed(Object.assign(market_item, { error: errorMessage }));
						await sendCallback(commonStore, data, market_code, parseInt(product), 2, errorMessage);
					} catch (e) {
						let product_html = new DOMParser().parseFromString(test_text, 'text/html');
						let product_data: any = product_html.querySelector(
							'body > div.basic_contents > div.product_complete_group > div.group_item_result > table > tbody > tr:nth-child(1) > td > div.text_field > span',
						);
						let product_code = product_data ? product_data.textContent.trim() : '';

						if (!product_code) {
							productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);
							productStore.addRegisteredFailed(
								Object.assign(market_item, {
									error: '일시적인 오류로 서비스를 이용할 수 없습니다.',
								}),
							);

							await sendCallback(
								commonStore,
								data,
								market_code,
								parseInt(product),
								2,
								'일시적인 오류로 서비스를 이용할 수 없습니다.',
							);

							return false;
						}

						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 성공`);
						productStore.addRegisteredSuccess(Object.assign(market_item, { error: product_code }));
						await sendCallback(commonStore, data, market_code, parseInt(product), 1, product_code);
					}
				}
			} catch (e: any) {
				notificationByEveryTime(`(${shopName}) 업로드 도중 오류가 발생하였습니다. (${e.toString()})`);

				continue;
			}
		}
	} catch (e: any) {
		productStore.addConsoleText(`(${shopName}) ESMPLUS 업로드 중단`);
		notificationByEveryTime(`(${shopName}) 업로드 도중 오류가 발생하였습니다. (${e.toString()})`);

		return false;
	}

	productStore.addConsoleText(`(${shopName}) ESMPLUS 업로드 완료`);

	return true;
};

/** 지마켓/옥션 상품 등록해제 *********************************************************************/
// 상품수정 - 판매중지 - 삭제 순으로 진행해야 함
// 따라서 상품등록 로직과 유사하게 보일 수 있음
export const deleteESMPlus2 = async (productStore: product, commonStore: common, data: any) => {
	if (!data) return false;

	let shopName = data.DShopInfo.site_name;
	const shopCode = data.DShopInfo.site_code;

	console.log(`(${shopName}) 등록정보:`, data);

	try {
		let esmplusAuctionId;
		let esmplusGmarketId;
		let upload_type: any = [];
		let delivery_policy_code_gmk = '0';
		let delivery_policy_code_iac = '0';
		let gg_text = null;

		try {
			let gg_resp = await fetch('https://www.esmplus.com/Member/AntiMoneyLaundering/GetAMLSellerList');

			gg_text = await gg_resp.json();
		} catch (e) {
			//
		}

		if (!gg_text) {
			productStore.addConsoleText(`(${shopName}) ESMPLUS 로그인 실패`);
			notificationByEveryTime(`(${shopName}) ESMPLUS 로그인 후 재시도 바랍니다.`);

			return false;
		}

		let gg_json = JSON.parse(gg_text);

		switch (shopCode) {
			/** 지마켓 */
			case 'A523': {
				let user_g_resp = await fetch('https://www.esmplus.com/Home/HomeSellerActivityBalanceGmktData?sellerid=', {
					body: null,
					method: 'GET',
				});

				let user_g_json = await user_g_resp.json();

				esmplusGmarketId = commonStore.user.userInfo?.esmplusGmarketId;

				if (esmplusGmarketId === user_g_json.sellerid) {
					upload_type.push({ key: '1', value: '' });
					upload_type.push({ key: '2', value: esmplusGmarketId });
				} else {
					let matched = false;

					for (let i in gg_json) {
						if (gg_json[i].SiteId === 2 && esmplusGmarketId === gg_json[i].SellerId) {
							upload_type.push({ key: '1', value: '' });
							upload_type.push({ key: '2', value: esmplusGmarketId });
							matched = true;

							break;
						}
					}

					if (!matched) {
						productStore.addConsoleText(`(${shopName}) 스토어 연동정보 확인 실패`);
						notificationByEveryTime(
							`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`,
						);

						return false;
					}
				}

				let delivery_policy_resp = await fetch(
					`https://www.esmplus.com/SELL/SYI/GetTransPolicyList?siteId=2&sellerId=${esmplusGmarketId}`,
				);
				let delivery_policy_json = await delivery_policy_resp.json();

				delivery_policy_json.forEach((v) => {
					if (v.DefaultIs) delivery_policy_code_gmk = v.TransPolicyNo.toString();
				});

				break;
			}

			/** 옥션 */
			case 'A522': {
				let user_a_resp = await fetch('https://www.esmplus.com/Home/HomeSellerActivityBalanceIacData?sellerid=', {
					body: null,
					method: 'GET',
				});

				let user_a_json = await user_a_resp.json();

				esmplusAuctionId = commonStore.user.userInfo?.esmplusAuctionId;

				if (esmplusAuctionId === user_a_json.sellerid) {
					upload_type.push({ key: '1', value: esmplusAuctionId });
					upload_type.push({ key: '2', value: '' });
				} else {
					let matched = false;

					for (let i in gg_json) {
						if (gg_json[i].SiteId === 1 && esmplusAuctionId === gg_json[i].SellerId) {
							upload_type.push({ key: '1', value: esmplusAuctionId });
							upload_type.push({ key: '2', value: '' });
							matched = true;

							break;
						}
					}

					if (!matched) {
						productStore.addConsoleText(`(${shopName}) 스토어 연동정보 확인 실패`);
						notificationByEveryTime(
							`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`,
						);

						return false;
					}
				}

				let delivery_policy_resp = await fetch(
					`https://www.esmplus.com/SELL/SYI/GetTransPolicyList?siteId=1&sellerId=${esmplusAuctionId}`,
				);
				let delivery_policy_json = await delivery_policy_resp.json();

				delivery_policy_json.forEach((v) => {
					if (v.DefaultIs) delivery_policy_code_iac = v.TransPolicyNo.toString();
				});

				break;
			}

			default:
				break;
		}

		const userResp = await fetch('https://www.esmplus.com/Escrow/Order/NewOrder');
		const userText = await userResp.text();
		const userMatched: any = userText.match(/var masterID = "([0-9]+)"/);
		let delivery_shipping_code = '0';
		let delivery_shipping_resp = await fetch('https://www.esmplus.com/SELL/SYI/GetShipmentPlaces');
		let delivery_shipping_json = await delivery_shipping_resp.json();

		for (let i in delivery_shipping_json) {
			if (delivery_shipping_json[i].DefaultIs) {
				delivery_shipping_code = delivery_shipping_json[i].ShipmentPlaceNo;

				break;
			}
		}

		let delivery_return_code = '0';
		let delivery_return_resp = await fetch('https://www.esmplus.com/SELL/SYI/GetDefaultReturnMemberAddress');
		let delivery_return_json = await delivery_return_resp.json();

		delivery_return_code = delivery_return_json.MembAddrNo.toString();

		for (let product in data.DShopInfo.prod_codes) {
			try {
				let market_code = data.DShopInfo.prod_codes[product];
				let market_item = data.DShopInfo.DataDataSet.data[product];
				let market_optn = data.DShopInfo.DataDataSet.data_opt;

				if (market_item.cert) continue;

				let image_list: any = [];
				let name = byteSlice(market_item.name3, 50);

				for (let i in market_item) {
					if (i.match(/img[0-9]/) && !i.includes('blob') && i !== 'img1') {
						if (market_item[i] !== '') {
							try {
								let img = /^https?:/.test(market_item[i]) ? market_item[i] : 'http:' + market_item[i];

								image_list.push({
									Operation: 1,
									Url: img,
									BigImage: 'false',
									ImageSourceCode: '0',
									ImageSourceOriginId: '',
								});
							} catch {
								continue;
							}
						}
					}
				}

				if (!commonStore.uploadInfo.markets.find((v) => v.code === shopCode)?.video) market_item.misc1 = '';

				let desc = `
        ${getStoreTraceCodeV1(market_item.id, shopCode)}

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

					${commonStore.user.userInfo?.descriptionShowTitle === 'Y' ? market_item.name3 : ``}
				</div>

				<br />
				<br />

				${transformContent(market_item.content1)}
                ${market_item.content3}
			`;

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
							if (j.includes('opt') && j !== 'optimg' && market_optn[i][j] !== '') {
								for (let k in words_list) {
									if (words_list[k].findWord && !words_list[k].replaceWord)
										if (market_optn[i][j].includes(words_list[k].findWord))
											words_restrict['옵션명'] = words_list[k].findWord;
								}
							}
						}
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
				//등록해제

				let categoryResp2 = await fetch(chrome.runtime.getURL('resources/esmCategory.json'));
				let categoryJson2 = await categoryResp2.json();
				let esmcategoryNumber2;
				let esmtogmarketoractioncategory2; //추가금불가능하고 , 옵션제한카테고리인지 확인해야함 undefined가 아니면 해당함

				if (shopCode === 'A522') {
					let auctionOptionscategoryResp = await fetch(chrome.runtime.getURL('resources/auctionOptions.json'));
					let auctionOptionscategoryJson = await auctionOptionscategoryResp.json();

					esmcategoryNumber2 = categoryJson2.find((item) => item.A옥션 === market_item.cate_code);
					if (esmcategoryNumber2 === undefined) {
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);
						productStore.addRegisteredFailed(
							Object.assign(market_item, { error: 'esm2.0에서 해당 카테고리를 지원하지 않습니다.' }),
						);

						await sendCallback(
							commonStore,
							data,
							market_code,
							parseInt(product),
							2,
							'esm2.0에서 해당 카테고리를 지원하지 않습니다.',
						);

						continue;
					}

					esmtogmarketoractioncategory2 = auctionOptionscategoryJson.find(
						(item) => item.카테고리코드 == esmcategoryNumber2['A옥션'],
					);
				} else if (shopCode === 'A523') {
					let gmarketOptionscategoryResp = await fetch(chrome.runtime.getURL('resources/gmarketOptions.json'));
					let gmarketOptionscategoryJson = await gmarketOptionscategoryResp.json();

					esmcategoryNumber2 = categoryJson2.find((item) => item.G마켓 === market_item.cate_code);

					if (esmcategoryNumber2 === undefined) {
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);
						productStore.addRegisteredFailed(
							Object.assign(market_item, { error: 'esm2.0에서 해당 카테고리를 지원하지 않습니다.' }),
						);

						await sendCallback(
							commonStore,
							data,
							market_code,
							parseInt(product),
							2,
							'esm2.0에서 해당 카테고리를 지원하지 않습니다.',
						);

						continue;
					}
					esmtogmarketoractioncategory2 = gmarketOptionscategoryJson.find(
						(item) => item.카테고리코드 == esmcategoryNumber2['G마켓'],
					);
				}

				console.log('esmtogmarketoractioncategory', esmtogmarketoractioncategory2); //추가금불가능하고 , 옵션제한카테고리인지 확인해야함 undefined가 아니면 해당함

				let option_count = Object.keys(group).length;
				let option_data: any = {
					OptionInfoList: [], //esm2.0처리
				};

				for (let i in market_optn) {
					if (market_optn[i].code === market_code) {
						if (commonStore.user.userInfo?.autoPrice === 'Y') {
							let iprice = market_item.sprice;
							let oprice = market_item.sprice + market_optn[i].price;
							let percent = Math.ceil((oprice / iprice - 1) * 100);

							if (percent < -50 || percent > 50) continue;
						}

						// option_data["OptSel"]["ObjOptInfo"]["ObjOptClaseNm1"] = market_optn[i].misc1;
						// option_data["OptSel"]["ObjOptInfo"]["ObjOptClaseNm2"] = market_optn[i].misc2;
						// option_data["OptSel"]["ObjOptInfo"]["ObjOptClaseNm3"] = market_optn[i].misc3;

						if (option_count === 1)
							option_data['OptionInfoList'].push({
								OptType: option_count,
								OptValue1: market_optn[i].opt1,
								RcmdOptValueNo1: '0',
								OptName1: market_optn[i].misc1,
								RcmdOptNo1: '0',
								OptValue2: market_optn[i].opt2,
								RcmdOptValueNo2: '0',
								OptName2: market_optn[i].misc2,
								RcmdOptNo2: '0',
								OptValue3: market_optn[i].opt3,
								RcmdOptValueNo3: '0',
								OptName3: market_optn[i].misc3,
								RcmdOptNo3: '0',
								SellerStockCode: null,
								SkuMatchingVerNo: null,
								AddAmnt: market_optn[i].price,
								OptRepImageLevel: '0',
								OptRepImageUrl: '',
								OptionInfoCalculation: null,
								SkuList: null,
								OptionNameLangList: [],
								OptionValueLangList: [
									{
										LangCode: 'ENG',
										Opt1: market_optn[i].opt1 === '' ? null : market_optn[i].opt1,
										Opt2: market_optn[i].opt2 === '' ? null : market_optn[i].opt2,
										Opt3: market_optn[i].opt3 === '' ? null : market_optn[i].opt3,
									},
									{
										LangCode: 'JPN',
										Opt1: market_optn[i].opt1 === '' ? null : market_optn[i].opt1,
										Opt2: market_optn[i].opt2 === '' ? null : market_optn[i].opt2,
										Opt3: market_optn[i].opt3 === '' ? null : market_optn[i].opt3,
									},
									{
										LangCode: 'CHN',
										Opt1: market_optn[i].opt1 === '' ? null : market_optn[i].opt1,
										Opt2: market_optn[i].opt2 === '' ? null : market_optn[i].opt2,
										Opt3: market_optn[i].opt3 === '' ? null : market_optn[i].opt3,
									},
								],
								SiteOptionInfo: [
									{
										SiteId: '1',
										ExposeYn: 'Y', //해당 노출여부는 아님 바꿔보니까 에러문구가 달랐음
										SoldOutYn: 'N',
										StockQty: '',
									},
									{
										SiteId: '2',
										ExposeYn: 'Y', //해당 노출여부는 아님 바꿔보니까 에러문구가 달랐음
										SoldOutYn: 'N',
										StockQty: '',
									},
								],
							});
						else
							option_data['OptionInfoList'].push({
								OptType: option_count,
								OptValue1: market_optn[i].opt1,
								RcmdOptValueNo1: '0',
								OptName1: market_optn[i].misc1,
								RcmdOptNo1: '0',
								OptValue2: market_optn[i].opt2,
								RcmdOptValueNo2: '0',
								OptName2: market_optn[i].misc2,
								RcmdOptNo2: '0',
								OptValue3: market_optn[i].opt3,
								RcmdOptValueNo3: '0',
								OptName3: market_optn[i].misc3,
								RcmdOptNo3: '0',
								SellerStockCode: null,
								SkuMatchingVerNo: null,
								AddAmnt: market_optn[i].price,
								OptRepImageLevel: '0',
								OptRepImageUrl: '',
								OptionInfoCalculation: null,
								SkuList: null,
								OptionNameLangList: [],
								OptionValueLangList: [
									{
										LangCode: 'ENG',
										Opt1: market_optn[i].opt1,
										Opt2: market_optn[i].opt2,
										Opt3: market_optn[i].opt3,
									},
									{
										LangCode: 'JPN',
										Opt1: market_optn[i].opt1,
										Opt2: market_optn[i].opt2,
										Opt3: market_optn[i].opt3,
									},
									{
										LangCode: 'CHN',
										Opt1: market_optn[i].opt1,
										Opt2: market_optn[i].opt2,
										Opt3: market_optn[i].opt3,
									},
								],
								SiteOptionInfo: [
									{
										SiteId: '1',
										ExposeYn: 'Y',
										SoldOutYn: 'N',
										StockQty: null,
									},
									{
										SiteId: '2',
										ExposeYn: 'Y',
										SoldOutYn: 'N',
										StockQty: null,
									},
								],
							});
					}
				}

				let date = new Date();
				let YY1 = date.getFullYear().toString();
				let MM1 = (date.getMonth() + 1).toString().padStart(2, '0');
				let DD1 = date.getDate().toString().padStart(2, '0');

				date.setDate(date.getDate() + 90);

				let YY2 = date.getFullYear().toString();
				let MM2 = (date.getMonth() + 1).toString().padStart(2, '0');
				let DD2 = date.getDate().toString().padStart(2, '0');

				const itemInfo = productStore.itemInfo.items.find((v) => v.productCode === market_code)!;
				const sillCode = itemInfo[`sillCode${shopCode}`] ? itemInfo[`sillCode${shopCode}`] : '35';
				const sillData = itemInfo[`sillData${shopCode}`]
					? JSON.parse(itemInfo[`sillData${shopCode}`])
					: [
							{ code: '35-1', name: '품명 및 모델명', type: 'input' },
							{ code: '35-2', name: '허가 관련', type: 'input' },
							{ code: '35-3', name: '제조국 또는 원산지', type: 'input' },
							{ code: '35-4', name: '제조자/수입자', type: 'input' },
							{ code: '35-5', name: '관련 연락처', type: 'input' },
							{ code: '35-6', name: '주문후 예상 배송기간', type: 'input' },
					  ];

				const sillResult = {
					NoticeItemGroupNo: sillCode,
					NoticeItemCodes: sillData.map((v) => {
						return {
							NoticeItemCode: v.code,
							NoticeItemValue: v.value ?? '상세설명참조',
						};
					}),
				};
				let test_today = new Date().toISOString();
				let test_tommorow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString();
				let categoryResp = await fetch(chrome.runtime.getURL('resources/esmCategory.json'));
				let categoryJson = await categoryResp.json();
				let esmcategoryNumber;
				if (shopCode === 'A522') {
					esmcategoryNumber = categoryJson.find((item) => item.A옥션 === market_item.cate_code);
				} else if (shopCode === 'A523') {
					esmcategoryNumber = categoryJson.find((item) => item.G마켓 === market_item.cate_code);
				}
				//등록해제 test_body
				let delete_test_body: any = {};
				if (shopCode === 'A522') {
					//옥션
					delete_test_body = {
						MasterId: userMatched[1], //esm2.0추가
						LoginId:
							shopCode === 'A522'
								? commonStore.user.userInfo?.esmplusAuctionId
								: commonStore.user.userInfo?.esmplusGmarketId, //esm2.0추가
						//esm2.0추가 아래부터
						GoodsNo: null,
						SiteGoodsNo: null,
						IsIacSellingStatus: '0',
						IsIacSellingStatusSpecified: false,
						CommandType: '2', //CommandType 1 등록, 2 수정, 4 해제
						IsLeaseAllowedInIac: false,
						CallFrom: '0',
						IsSingleGoods: true,
						SiteGoodsNoIac: null,
						SiteGoodsNoGmkt: null,
						GoodsKind: '1',
						BarCode: null,
						IsSiteDisplayIac: false,
						IsSiteDisplayGmkt: false,
						SellingStatusIac: null,
						SellingStatusGmkt: null,
						IsDeleteGroup: false,
						EditorUseYn: 'Y',
						SdInfo: {
							SdCategoryCode: esmcategoryNumber['ESM카테고리'], //esm카테고리번호네
							SdBrandName: null,
							SdMakerId: '0',
							SdMakerName: null,
							SdBrandId: '0',
							SdProductBrandId: '0',
							SdProductBrandName: null,
							EpinCodeList: [null],
							SdAttrMatchingList: [],
							SdBasicAttrMatching: {},
							EpinCreateReqBarcode: '',
							EpinCreateReqModelName: '',
							EpinCreateReqModelNo: '',
						},
						BuyableQuantityMappingType: '1',
						IsIacConvertToSingleGoods: false,
						IsGmktConvertToSingleGoods: false,
						AdminId: null,
						//esm2.0추가 위에 까지
						SYIStep1: {
							PurchaseBenefits: [], //esm2.0추가
							RegMarketType: shopCode === 'A522' ? '1' : '2',
							SiteSellerId: upload_type,
							HasCatalog: false, //esm2.0추가
							CatalogId: '0', //esm2.0추가
							CatalogName: '', //esm2.0추가
							CatalogLowestPrice: '0', //esm2.0추가
							SellType: '1',
							GoodsType: '1',

							GoodsName: {
								InputType: '1',
								GoodsName: name, //GoodsNameSearch + GoodsNamePrmt로 구성됨
								GoodsNameSearch: name, //검색용 프로모션 키워드 //esm2.0추가 이게 필수값이네;
								GoodsNamePrmt: '', // 일반 프로모션 상품명  //esm2.0추가
								SiteGoodsName: [], //esm2.0추가
								SiteGoodsNameEng: [
									//esm2.0추가
									{
										key: '1',
										value: '',
									},
									{
										key: '2',
										value: '',
									},
								],
								SiteGoodsNameChn: [
									//esm2.0추가
									{
										key: '1',
										value: '',
									},
									{
										key: '2',
										value: '',
									},
								],
								SiteGoodsNameJpn: [
									//esm2.0추가
									{
										key: '1',
										value: '',
									},
									{
										key: '2',
										value: '',
									},
								],
								UseSellerNicknameIac: false, //esm2.0추가
								AdMessageIac: '', //esm2.0추가
							},

							SiteCategoryCode: [
								{
									key: '1',
									value: market_item.cate_code,
								},
								{
									key: '2',
									value: shopCode === 'A522' ? '' : market_item.cate_code,
								},
							],
							//esm2.0추가
							SiteGoodsClassList: [
								//esm2.0추가
								{
									key: '1',
									value: '',
								},
								{
									key: '2',
									value: '',
								},
							],
							Book: {
								//esm2.0추가
								STCode: '',
								IsSTCodeImage: false,
								ISBNCode: '',
								IsbnCodeAllowYn: 'N',
								Name: '',
								Author: '',
								Publisher: '',
								Price: '0',
								PublishDate: null,
								MakerName: '',
								MakerNo: '',
								BrandName: '',
								BrandNo: '0',
								ImgSmall: '',
								Title: '',
								Translater: '',
							},
							MakerId: '0',
							MakerName: '',
							UserDefineMakerName: '',
							BrandId: '0',
							BrandName: '',
							UserDefineBrandName: '',
							GmktShopKind1: '-1',
							GmktShopKind2: '-1',
							GmktShopKind3: '-1',
							StatusCode: '1',
							StoreShopCategoryGoods: {
								CategoryLevel: '0',
								ShopLCategoryCode: '00000000',
								ShopMCategoryCode: '00000000',
								ShopSCategoryCode: '00000000',
							},
							MiniShopCategoryGoods: {
								CategoryLevel: '0',
								ShopLCategoryCode: '00000000',
								ShopMCategoryCode: '00000000',
								ShopSCategoryCode: '00000000',
							},
							IsTPLGoods: false,
							AdminRestrict: 'Y',
							SiteSellerAdjustCommissionPrice: {
								IacOpenAdjustCommissionPrice: '0',
								IacSpecialAdjustCommissionPrice: '0',
								GmktOpenAdjustCommissionPrice: '0',
								GmktSpecialAdjustCommissionPrice: '0',
							},
							CatalogInfo: {
								CatalogId: '0',
								CatalogIdSpecified: false,
								CatalogName: null,
								LowestPrice: '0',
								LowestPriceSpecified: false,
								ImageUrl: null,
								MakerId: '0',
								MakerIdSpecified: false,
								MakerName: null,
								BrandId: '0',
								BrandIdSpecified: false,
								BrandName: null,
								ModelName: null,
								MainDescription: null,
								MatchingItemCount: '0',
								MatchingItemCountSpecified: false,
								ProductionDate: null,
								ProductionDateSpecified: false,
								ProductionDateType: '0',
								ProductionDateTypeSpecified: false,
								PriceRenovationDate: null,
								PriceRenovationDateSpecified: false,
								IsAdult: false,
								IsAdultSpecified: false,
								IsBook: false,
								IsBookSpecified: false,
							},
							IsItemNameChangeAllowed: true,
						},

						SYIStep2: {
							SellingStatus: '0',
							GoodsStatus: '1',
							UsedMonths: '0', //esm2.0추가
							IsGMKTEnvironmentFriendlyCertType: false, //esm2.0추가
							IsIACEnvironmentFriendlyCertType: false, //esm2.0추가
							//원산지항목추가
							Price: {
								InputType: '1',
								GoodsPrice: market_item.sprice.toString(),
								GoodsPriceIAC: shopCode === 'A522' ? market_item.sprice.toString() : '0',
								GoodsPriceGMKT: shopCode === 'A523' ? market_item.sprice.toString() : '0',
								IsSeparate: false, //esm2.0추가
								IsUserCustomSettlementGMKT: false, //esm2.0추가
								GoodsPriceSettlementGMKT: '0', //esm2.0추가
								BookPrice: '0', //esm2.0추가
								OrgGoodsPrice: market_item.sprice.toString(), //esm2.0추가
							},
							PricePerUnit: {
								//esm2.0추가
								Unit: '',
								UnitPrice: '0',
							},
							WirelessCallingPlan: {
								//esm2.0추가
								PhoneFeeType: '0',
								PhoneFeeUrl: '',
								Plans: [],
								MobilePhoneFeeUrl: '',
							},
							MobileDevicePrice: {
								PhoneDevicePrice: '',
								PhoneSupportDiscount: '',
								MakerSupportDiscount: '',
								TeleComSupportDiscount: '',
								PhoneAddDiscount: '',
								PhoneInstallmentPrice: '',
							},
							Stock: {
								InputType: '1',
								GoodsCount: market_item.stock.toString(),
								GoodsCountIAC: market_item.stock.toString(),
								GoodsCountGMKT: market_item.stock.toString(),
								SiteGoodsCountNo: '0', //esm2.0추가
								BuyableQuantityType: '0', //esm2.0추가
								BuyableQuantity: '', //esm2.0추가
								BuyableQuantityDay: '', //esm2.0추가
								OldGoodsCount: market_item.stock.toString(), //esm2.0추가
								OldGoodsCountIAC: market_item.stock.toString(), //esm2.0추가
								OldGoodsCountGMKT: '0', //esm2.0추가
							},

							Options: {
								InputType: '1',
								OptVerType: '0',
								OptVerTypeIAC: '0',
								OptVerTypeGMKT: '0',
								JsonData: null,
								JsonDataIAC: null, //esm2.0추가
								JsonDataGMKT: null, //esm2.0추가
								JsonDataLegacy: null, //esm2.0추가
							}, //todo 옵션작업해야함 -> 완
							OrderOption: {
								OptType: option_count,
								StockMngIs: false,
								UnifyStockIs: false,
								...option_data, //OptioninfoList
							}, //esm2.0추가
							Additions: {
								//esm2.0추가
								InputType: '1',
								JsonData: null,
								JsonDataIAC: null,
								JsonDataGMKT: null,
								JsonDataLegacy: null,
								CommonGoodsNo: null,
								IsUseCommonGoods: false,
							},
							AddonService: {
								//esm2.0추가
								AddonServiceUseType: '0',
								AddonServiceList: [],
							},
							SellingPeriod: {
								//   InputType: "1",//esm2.0제거
								History: [], //esm2.0추가
								IAC: {
									StartDate: '',
									EndDate: '',
								},

								GMKT: {
									StartDate: '',
									EndDate: '',
								},
							},
							PreSale: {
								//esm2.0추가
								UseSettingIAC: false,
								SaleStartDateIAC: `${YY1}-${MM1}-${DD1}`,
							},
							GoodsImage: {
								PrimaryImage: {
									Operation: '1',
									Url: market_item.img1,
									BigImage: 'false',
								},

								//   ListImage: {//esm2.0제거
								//     Operation: "1",
								//     Url: market_item.img1,
								//     BigImage: "false",
								//   },

								FixedImage: {
									Operation: '1',
									Url: market_item.img1,
									BigImage: 'false',
								},

								//   ExpandedImage: {//esm2.0제거
								//     Operation: "1",
								//     Url: market_item.img1,
								//     BigImage: "false",
								//   },

								AdditionalImagesSite: '0',
								AdditionalImagesStr: JSON.stringify(image_list),
							},
							DescriptionTypeSpecified: true,

							NewDescription: {
								InputType: '1',
								Text: desc,
								TextIAC: null,
								TextGMKT: null,
							},

							ItemCode: market_code,
							CustCategoryNo: '0', //esm2.0추가
							CustCategory: null, //esm2.0추가
							ExpiryDate: '0-0-0', //esm2.0추가
							ExpiryDateSpecified: true, //esm2.0추가
							LaunchingDate: null, //esm2.0추가
							LaunchingDateSpecified: false, //esm2.0추가
							ManufacturedDate: '0-0-0', //esm2.0추가
							ManufacturedDateSpecified: true, //esm2.0추가
							Origin: {
								ProductType: '',
								Type: '0',
								Name: '',
								Code: '',
								IsMultipleOrigin: 'false',
							},
							LegacyRawMaterials: null, //esm2.0추가
							RawMaterials: null, //esm2.0추가
							Capacity: {
								//esm2.0추가
								Volume: null,
								Unit: '0',
								IsMultipleVolume: false,
							},
							Manual: null, //esm2.0추가
							ECoupon: {
								//esm2.0추가
								Period: '0',
								Price: '0',
								Ratio: '0',
								CouponName: '',
								ExpireType: '0',
								Expire1StartDate: '',
								Expire1EndDate: '',
								Expire2Duration: '0',
								Expire2Start: '0',
								UseTermType: '0',
								UseTerm1StartDate: '',
								UseTerm1EndDate: '',
								UseTerm2Start: '0',
								UseTerm2Duration: '0',
								CouponTemplate: '0',
								CouponImageUrl: '',
								DownloadTemplate: '0',
								DownloadImageUrl: '',
								ApplyPlace: '',
								IsInformByAddress: false,
								Address: '',
								AddressNo: '',
								IsInformByURL: false,
								URL: '',
								ApplyPlacePriority: '0',
								MoneyType: '0',
								MobileUseInfo: '',
								MobileHelpDeskphoneNo: '',
								TelephoneNo: '',
								AdditionalBenefit: '',
								HasRestrictCondition: false,
								RestrictCondition: '',
								Guide: '',
								PublicationCorp: '',
								PublicationCorpURL: '',
								IsCustomerNameView: false,
							},
							DeliveryInfo: {
								CommonDeliveryUseYn: true,
								InvalidDeliveryInfo: false,
								CommonDeliveryWayOPTSEL: '1',
								GmktDeliveryWayOPTSEL: '1',
								IsCommonGmktUnifyDelivery: false,
								GmktDeliveryCOMP: shopCode === 'A522' ? null : '100000012',
								IacDeliveryCOMP: '10034',
								IsCommonVisitTake: false,
								IsCommonQuickService: false,
								IsCommonIACPost: false,
								CommonIACPostType: '0',
								CommonIACPostPaidPrice: '0',
								IsGmktVisitTake: false,
								IsGmktQuickService: false,
								IsGmktTodayDEPAR: false,
								IsGmktTodayDEPARAgree: false,
								IsGmktVisitReceiptTier: false,
								MountBranchGroupSeq: '0',
								CommonVisitTakeType: '0',
								CommonVisitTakePriceDcAmnt: '0',
								CommonVisitTakeFreeGiftName: null,
								CommonVisitTakeADDRNo: null,
								CommonQuickServiceCOMPName: null,
								CommonQuickServicePhone: null,
								CommonQuickServiceDeliveryEnableRegionNo: null,
								ShipmentPlaceNo: delivery_shipping_code.toString(),
								DeliveryFeeType: '2',
								BundleDeliveryYNType: null,
								BundleDeliveryTempNo: null,
								EachDeliveryFeeType: market_item.deliv_fee > 0 ? '2' : '1',
								EachDeliveryFeeQTYEachGradeType: null,
								DeliveryFeeTemplateJSON:
									market_item.deliv_fee > 0
										? JSON.stringify({
												DeliveryFeeType: 2,
												DeliveryFeeSubType: 0,
												FeeAmnt: market_item.deliv_fee,
												PrepayIs: true,
												CodIs: false,
												JejuAddDeliveryFee: commonStore.user.userInfo?.additionalShippingFeeJeju,
												BackwoodsAddDeliveryFee: commonStore.user.userInfo?.additionalShippingFeeJeju,
												ShipmentPlaceNo: delivery_shipping_code,
												DetailList: [],
										  })
										: JSON.stringify({
												DeliveryFeeType: 1,
												DeliveryFeeSubType: 0,
												FeeAmnt: 0,
												PrepayIs: false,
												CodIs: false,
												JejuAddDeliveryFee: 0,
												BackwoodsAddDeliveryFee: 0,
												ShipmentPlaceNo: delivery_shipping_code,
												DetailList: [],
										  }),
								EachDeliveryFeePayYn: '2',
								IsCommonGmktEachADDR: false,
								ReturnExchangeADDRNo: delivery_return_code,
								OldReturnExchangeADDR: null,
								OldReturnExchangeADDRTel: null,
								OldReturnExchangeSetupDeliveryCOMPName: null,
								OldReturnExchangeDeliveryFeeStr: null,
								ExchangeADDRNo: '',
								ReturnExchangeSetupDeliveryCOMP: null,
								ReturnExchangeSetupDeliveryCOMPName: null,
								ReturnExchangeDeliveryFee: '0',
								ReturnExchangeDeliveryFeeStr: commonStore.user.userInfo?.refundShippingFee.toString(),
								IacTransPolicyNo: delivery_policy_code_iac,
								GmktTransPolicyNo: delivery_policy_code_gmk,
								BackwoodsDeliveryYn: 'Y',
								IsTplConvertible: false,
								IsGmktIACPost: false,
							},
							IsAdultProduct: 'False',
							IsVATFree: 'False',
							ASInfo: null, //esm2.0추가
							CertIAC: {
								HasIACCertType: false, //esm2.0추가
								MedicalInstrumentCert: {
									//esm2.0추가
									ItemLicenseNo: null,
									AdDeliberationNo: null,
									IsUse: false,
									CertificationOfficeName: null,
									CertificationNo: null,
									Operation: '2',
								},
								BroadcastEquipmentCert: {
									//esm2.0추가
									BroadcastEquipmentIs: false,
									AddtionalConditionIs: false,
									IsUse: false,
									CertificationOfficeName: null,
									CertificationNo: '',
									Operation: '2',
								},
								FoodCert: {
									//esm2.0추가
									IsUse: false,
									CertificationOfficeName: null,
									CertificationNo: null,
									Operation: '2',
								},
								HealthFoodCert: {
									//esm2.0추가
									AdDeliberationNo: null,
									IsUse: false,
									CertificationOfficeName: null,
									CertificationNo: null,
									Operation: '2',
								},
								EnvironmentFriendlyCert: {
									//esm2.0추가
									CertificationType: 'ENV_DTL',
									isIACEnvironmentFriendlyCertType: false,
									isGMKTEnvironmentFriendlyCertType: false,
									CertBizType: 'ENV_DTL',
									ProducerName: null,
									PresidentInfoNA: null,
									RepItemName: null,
									InfoHT: null,
									CertGroupType: null,
									InfoEM: null,
									CertStartDate: null,
									CertEndDate: null,
									InfoAD: null,
									CertificationOfficeName: null,
									CertificationExpiration: null,
									IsUse: false,
									CertificationNo: null,
									Operation: '2',
								},
								SafeCert: {
									//esm2.0추가
									SafeCertType: '0',
									AuthItemType: '0',
									CertificationNo: null,
									IsUse: false,
									CertificationOfficeName: null,
									Operation: '2',
								},
								ChildProductSafeCert: {
									SafeCertType: '1', //esm2.0추가
									ChangeType: '0',
									SafeCertDetailInfoList: [],
								},
								IntegrateSafeCert: {
									ItemNo: null,

									IntegrateSafeCertGroupList: [
										{
											SafeCertGroupNo: '1',
											CertificationType: '1',
										},
										{
											SafeCertGroupNo: '2',
											CertificationType: '1',
										},
										{
											SafeCertGroupNo: '3',
											CertificationType: '1',
										},
									],
								},
							},

							CertificationNoGMKT: '', //esm2.0추가
							LicenseSeqGMKT: null, //esm2.0추가
							OfficialNotice: sillResult,
							ItemWeight: '0', //esm2.0추가
							SkuList: [], //esm2.0추가 옵션데이터..
							SkuMatchingVerNo: '0', //esm2.0추가
							RentalAddInfo: null, //esm2.0추가
							CertificationTextGMKT: '', //esm2.0추가
							LicenseTextGMKT: null, //esm2.0추가
							InventoryNo: null, //esm2.0추가
							SingleSellerShop: null, //esm2.0추가
							IsUseSellerFunding: null, //esm2.0추가
							IsGift: true, //esm2.0추가
							ConsultingDetailList: [], //esm2.0추가
						},

						//
						SYIStep3: {
							G9RegisterCommand: '0',
							IsG9Goods: false,
							IsOnlyG9Goods: false,
							SellerDiscount: {
								DiscountAmtIac1: '0',
								DiscountAmtIac2: null,
								DiscountAmtGmkt1: '0',
								DiscountAmtGmkt2: null,
								IsSellerDCExceptionIacItem: false,
								IsSellerDCExceptionGmktItem: false,
								IsUsed: '2',
								IsUsedSpecified: false,
								DiscountType: '1',
								DiscountTypeSpecified: false,
								DiscountAmt: '0',
								DiscountAmtSpecified: false,
								DiscountAmt1: '0',
								DiscountAmt1Specified: false,
								DiscountAmt2: null,
								DiscountAmt2Specified: false,
								StartDate: `${YY1}-${MM1}-${DD1}`,
								StartDateSpecified: false,
								EndDate: '9999-12-31',
								EndDateSpecified: false,
								DiscountTypeIac: '1',
								DiscountTypeSpecifiedIac: false,
								StartDateIac: `${YY1}-${MM1}-${DD1}`,
								StartDateSpecifiedIac: false,
								EndDateIac: '9999-12-31',
								IacEndDateSpecified: false,
								DiscountAmtIac: '0',
								DiscountAmtSpecifiedIac: false,
								DiscountTypeGmkt: '1',
								DiscountTypeSpecifiedGmkt: false,
								StartDateGmkt: `${YY1}-${MM1}-${DD1}`,
								StartDateSpecifiedGmkt: false,
								EndDateGmkt: '9999-12-31',
								EndDateSpecifiedGmkt: false,
								DiscountAmtGmkt: '0',
								DiscountAmtSpecifiedGmkt: false,
							},
							FreeGift: {
								IsUsed: '2',
								IsUsedSpecified: false,
								IsOnly: '1',
								IsOnlySpecified: false,
								IacFreeGiftName: '',
								GmkFreeGiftName: '',
							},
							IsPcs: true,
							IsPcsSpecified: true,
							IacPcsCoupon: true,
							IacPcsCouponSpecified: false,
							GmkPcsCoupon: true,
							GmkPcsCouponSpecified: false,
							GmkBargain: false,
							GmkBargainSpecified: false,
							IacFreeWishKeyword: [],
							IacDiscountAgreement: true,
							IacDiscountAgreementSpecified: false,
							GmkDiscountAgreement: false,
							GmkDiscountAgreementSpecified: false,
							GmkOverseaAgreementSeller: true,
							GmkOverseaAgreementSellerSpecified: false,
							IacBuyerBenefit: {
								IsUsed: '2',
								IsUsedSpecified: false,
								StartDate: test_today,
								StartDateSpecified: false,
								EndDate: test_tommorow,
								EndDateSpecified: false,
								IsMemberDiscount: false,
								IsMemberDiscountSpecified: false,
								MemberDiscountPrice: '0',
								MemberDiscountPriceSpecified: false,
								IsBulkDiscount: false,
								IsBulkDiscountSpecified: false,
								BulkDiscountQty: '0',
								BulkDiscountQtySpecified: false,
								BulkDiscountPrice: '0',
								BulkDiscountPriceSpecified: false,
							},
							GmkBuyerBenefit: {
								IsUsed: '2',
								IsUsedSpecified: false,
								Type: '',
								StartDate: test_today,
								StartDateSpecified: false,
								EndDate: test_tommorow,
								EndDateSpecified: false,
								ConditionType: '',
								ConditionValue: '0',
								ConditionValueSpecified: false,
								Unit: '',
								UnitValue: '0',
								UnitValueSpecified: false,
								WhoFee: '',
							},
							IacDonation: {
								IsUsed: '2',
								IsUsedSpecified: false,
								StartDate: test_today,
								StartDateSpecified: false,
								EndDate: test_tommorow,
								EndDateSpecified: false,
								DonationPrice: '0',
								DonationPriceSpecified: false,
								DonationMaxPrice: '0',
								DonationMaxPriceSpecified: false,
								DonationType: '',
							},
							GmkDonation: {
								IsUsed: '2',
								IsUsedSpecified: false,
								StartDate: test_today,
								StartDateSpecified: false,
								EndDate: test_tommorow,
								EndDateSpecified: false,
								DonationPrice: '0',
								DonationPriceSpecified: false,
								DonationMaxPrice: '0',
								DonationMaxPriceSpecified: false,
								DonationType: '',
							},
							IacSellerPoint: {
								IsUsed: '2',
								IsUsedSpecified: false,
								PointType: '1',
								PointTypeSpecified: false,
								Point: '0',
								PointSpecified: true,
							},
							GmkSellerMileage: {
								IsUsed: '2',
								IsUsedSpecified: false,
								PointType: '1',
								PointTypeSpecified: false,
								Point: '0',
								PointSpecified: true,
							},
							IacChance: {
								IsUsed: '2',
								IsUsedSpecified: false,
								StartDate: test_today,
								StartDateSpecified: false,
								EndDate: test_tommorow,
								EndDateSpecified: false,
								ChanceQty: '0',
							},
							IacBrandShop: {
								IsUsed: '2',
								IsUsedSpecified: false,
								LCategoryCode: '',
								MCategoryCode: '',
								SCategoryCode: '',
								BrandCode: '',
								BrandName: '',
								BrandImage: [],
							},
							GmkBizOn: {
								IsUsed: '2',
								IsUsedSpecified: false,
								LCategoryCode: '',
								MCategoryCode: '',
								SCategoryCode: '',
							},
							IacAdditional: [],
							GmkAdditional: [],
							IacPayWishKeyword: [],
							IacAdPromotion: {
								CategorySmart: {
									LCategoryPrice: '0',
									LCategoryPriceSpecified: false,
									MCategoryPrice: '0',
									MCategoryPriceSpecified: false,
									SCategoryPrice: '0',
									SCategoryPriceSpecified: false,
									BestMainPrice: '0',
									BestMainPriceSpecified: false,
								},
								CategoryPower: {
									LCategoryPrice: '0',
									LCategoryPriceSpecified: false,
									MCategoryPrice: '0',
									MCategoryPriceSpecified: false,
									SCategoryPrice: '0',
									SCategoryPriceSpecified: false,
									BestMainPrice: '0',
									BestMainPriceSpecified: false,
								},
								Best100Smart: {
									LCategoryPrice: '0',
									LCategoryPriceSpecified: false,
									MCategoryPrice: '0',
									MCategoryPriceSpecified: false,
									SCategoryPrice: '0',
									SCategoryPriceSpecified: false,
									BestMainPrice: '0',
									BestMainPriceSpecified: false,
								},
								Chance: {
									LCategoryPrice: '0',
									LCategoryPriceSpecified: false,
									MCategoryPrice: '0',
									MCategoryPriceSpecified: false,
									SCategoryPrice: '0',
									SCategoryPriceSpecified: false,
									BestMainPrice: '0',
									BestMainPriceSpecified: false,
								},
								AccessMode: '1',
								AccessModeSpecified: false,
							},
							GmkAdPromotion: {
								LargePlus: '0',
								LargePlusSpecified: false,
								LargePowerMini: '0',
								LargePowerMiniSpecified: false,
								LargeBestPower: '0',
								LargeBestPowerSpecified: false,
								MiddlePlus: '0',
								MiddlePlusSpecified: false,
								MiddlePower: '0',
								MiddlePowerSpecified: false,
								MiddleDetailPower: '0',
								MiddleDetailPowerSpecified: false,
								MiddleBestPower: '0',
								MiddleBestPowerSpecified: false,
								SmallPlus: '0',
								SmallPlusSpecified: false,
								SmallPower: '0',
								SmallPowerSpecified: false,
							},
							OverseaAgree: {
								RegType: null,
								Gubun: '0',
								GubunSpecified: false,
								OverseaDisAgreeIs: false,
							},
							IsLeaseAvailableInIac: false,
							GmktShopGroupCd: '0',
							IsIacFreeWishKeyword: false,
							IacFreeWishKeywordEndDate: false,
							IacCommissionRate: '0',
							IacCommissionRateOpenMarket: '0',
							IacCommissionRateGroupBy: '0',
							IsIacFeeDiscountItem: false,
							IsDispExclude: true,
							IsDispExcludeSpecified: false,
						},
					};
				} else if (shopCode === 'A523') {
					//지마켓
					delete_test_body = {
						MasterId: userMatched[1], //esm2.0추가
						LoginId:
							shopCode === 'A522'
								? commonStore.user.userInfo?.esmplusAuctionId
								: commonStore.user.userInfo?.esmplusGmarketId, //esm2.0추가
						//esm2.0추가 아래부터
						GoodsNo: null,
						SiteGoodsNo: null,
						IsIacSellingStatus: '0',
						IsIacSellingStatusSpecified: false,
						CommandType: '2', //CommandType 1 등록, 2 수정, 4 해제
						IsLeaseAllowedInIac: false,
						CallFrom: '0',
						IsSingleGoods: true,
						SiteGoodsNoIac: null,
						SiteGoodsNoGmkt: null,
						GoodsKind: '1',
						BarCode: null,
						IsSiteDisplayIac: false,
						IsSiteDisplayGmkt: false,
						SellingStatusIac: null,
						SellingStatusGmkt: null,
						IsDeleteGroup: false,
						EditorUseYn: 'Y',
						SdInfo: {
							SdCategoryCode: esmcategoryNumber['ESM카테고리'], //esm카테고리번호네
							SdBrandName: null,
							SdMakerId: '0',
							SdMakerName: null,
							SdBrandId: '0',
							SdProductBrandId: '0',
							SdProductBrandName: null,
							EpinCodeList: [null],
							SdAttrMatchingList: [],
							SdBasicAttrMatching: {},
							EpinCreateReqBarcode: '',
							EpinCreateReqModelName: '',
							EpinCreateReqModelNo: '',
						},
						BuyableQuantityMappingType: '1',
						IsIacConvertToSingleGoods: false,
						IsGmktConvertToSingleGoods: false,
						AdminId: null,
						//esm2.0추가 위에 까지
						SYIStep1: {
							PurchaseBenefits: [], //esm2.0추가
							RegMarketType: shopCode === 'A522' ? '1' : '2',
							SiteSellerId: upload_type,
							HasCatalog: false, //esm2.0추가
							CatalogId: '0', //esm2.0추가
							CatalogName: '', //esm2.0추가
							CatalogLowestPrice: '0', //esm2.0추가
							SellType: '1',
							GoodsType: '1',

							GoodsName: {
								InputType: '1',
								GoodsName: name, //GoodsNameSearch + GoodsNamePrmt로 구성됨
								GoodsNameSearch: name, //검색용 프로모션 키워드 //esm2.0추가 이게 필수값이네;
								GoodsNamePrmt: '', // 일반 프로모션 상품명  //esm2.0추가
								SiteGoodsName: [], //esm2.0추가
								SiteGoodsNameEng: [
									//esm2.0추가
									{
										key: '1',
										value: '',
									},
									{
										key: '2',
										value: '',
									},
								],
								SiteGoodsNameChn: [
									//esm2.0추가
									{
										key: '1',
										value: '',
									},
									{
										key: '2',
										value: '',
									},
								],
								SiteGoodsNameJpn: [
									//esm2.0추가
									{
										key: '1',
										value: '',
									},
									{
										key: '2',
										value: '',
									},
								],
								UseSellerNicknameIac: false, //esm2.0추가
								AdMessageIac: '', //esm2.0추가
							},

							SiteCategoryCode: [
								{
									key: '1',
									value: market_item.cate_code,
								},
								{
									key: '2',
									value: market_item.cate_code,
								},
							],
							//esm2.0추가
							SiteGoodsClassList: [
								//esm2.0추가
								{
									key: '1',
									value: '',
								},
								{
									key: '2',
									value: '',
								},
							],
							Book: {
								//esm2.0추가
								Author: '',
								BrandName: '',
								BrandNo: '',
								ISBNCode: '',
								ImgSmall: '',
								IsSTCodeImage: false,
								IsbnCodeAllowYn: 'N',
								MakerName: '',
								MakerNo: '',
								Name: '',
								Price: '',
								PublishDate: null,
								Publisher: '',
								STCode: '',
								Title: '',
								Translater: '',
							},
							MakerId: '0', //esm2.0추가
							MakerName: '', //esm2.0추가
							UserDefineMakerName: '', //esm2.0추가
							BrandId: '0', //esm2.0추가
							BrandName: '', //esm2.0추가
							UserDefineBrandName: '', //esm2.0추가
							GmktShopKind1: '-1', //esm2.0추가
							GmktShopKind2: '-1', //esm2.0추가
							GmktShopKind3: '-1', //esm2.0추가
							StatusCode: '', //esm2.0추가
							StoreShopCategoryGoods: {
								//esm2.0추가
								CategoryLevel: '0',
								ShopLCategoryCode: '00000000',
								ShopMCategoryCode: '00000000',
								ShopSCategoryCode: '00000000',
							},
							MiniShopCategoryGoods: {
								//esm2.0추가
								CategoryLevel: '0',
								ShopLCategoryCode: '00000000',
								ShopMCategoryCode: '00000000',
								ShopSCategoryCode: '00000000',
							},
							IsTPLGoods: false, //esm2.0추가
							AdminRestrict: '', //esm2.0추가
							SiteSellerAdjustCommissionPrice: {
								//esm2.0추가
								IacOpenAdjustCommissionPrice: '0',
								IacSpecialAdjustCommissionPrice: '0',
								GmktOpenAdjustCommissionPrice: '0',
								GmktSpecialAdjustCommissionPrice: '0',
							},
							CatalogInfo: {
								//esm2.0추가
								CatalogId: '0',
								CatalogIdSpecified: false,
								CatalogName: null,
								LowestPrice: '0',
								LowestPriceSpecified: false,
								ImageUrl: null,
								MakerId: '0',
								MakerIdSpecified: false,
								MakerName: null,
								BrandId: '0',
								BrandIdSpecified: false,
								BrandName: null,
								ModelName: null,
								MainDescription: null,
								MatchingItemCount: '0',
								MatchingItemCountSpecified: false,
								ProductionDate: null,
								ProductionDateSpecified: false,
								ProductionDateType: '0',
								ProductionDateTypeSpecified: false,
								PriceRenovationDate: null,
								PriceRenovationDateSpecified: false,
								IsAdult: false,
								IsAdultSpecified: false,
								IsBook: false,
								IsBookSpecified: false,
							},
							IsItemNameChangeAllowed: false, //esm2.0추가
						},

						SYIStep2: {
							SellingStatus: '0',
							GoodsStatus: '1',
							UsedMonths: null, //esm2.0추가
							IsGMKTEnvironmentFriendlyCertType: false, //esm2.0추가
							IsIACEnvironmentFriendlyCertType: false, //esm2.0추가
							//원산지항목추가

							Price: {
								InputType: '1',
								GoodsPrice: market_item.sprice.toString(),
								GoodsPriceIAC: market_item.sprice.toString(),
								GoodsPriceGMKT: market_item.sprice.toString(),
								IsSeparate: false, //esm2.0추가
								IsUserCustomSettlementGMKT: false, //esm2.0추가
								GoodsPriceSettlementGMKT: '0', //esm2.0추가
								BookPrice: '0', //esm2.0추가
								OrgGoodsPrice: '0', //esm2.0추가
							},
							PricePerUnit: {
								//esm2.0추가
								Unit: null,
								UnitPrice: '0',
							},
							WirelessCallingPlan: {
								//esm2.0추가
								PhoneFeeType: '0',
								PhoneFeeUrl: '',
								Plans: [],
								MobilePhoneFeeUrl: '',
							},
							MobileDevicePrice: {
								//esm2.0추가
								PhoneDevicePrice: '',
								PhoneSupportDiscount: '',
								MakerSupportDiscount: '',
								TeleComSupportDiscount: '',
								PhoneAddDiscount: '',
								PhoneInstallmentPrice: '',
							},
							Stock: {
								InputType: '1',
								GoodsCount: market_item.stock.toString(),
								GoodsCountIAC: market_item.stock.toString(),
								GoodsCountGMKT: market_item.stock.toString(),
								SiteGoodsCountNo: '0', //esm2.0추가
								BuyableQuantityType: '0', //esm2.0추가
								BuyableQuantity: '', //esm2.0추가
								BuyableQuantityDay: '', //esm2.0추가
								OldGoodsCount: '0', //esm2.0추가
								OldGoodsCountIAC: '0', //esm2.0추가
								OldGoodsCountGMKT: '0', //esm2.0추가
							},

							Options: {
								InputType: '1',
								OptVerType: '0',
								OptVerTypeIAC: '0',
								OptVerTypeGMKT: '0',
								JsonData: '',
								JsonDataIAC: '', //esm2.0추가
								JsonDataGMKT: '', //esm2.0추가
								JsonDataLegacy: '', //esm2.0추가
							}, //todo 옵션작업해야함 -> 완
							OrderOption: {
								OptType: option_count,
								StockMngIs: false,
								UnifyStockIs: false,
								...option_data, //OptioninfoList
							}, //esm2.0추가
							Additions: {
								//esm2.0추가
								InputType: '1',
								JsonData: null,
								JsonDataIAC: null,
								JsonDataGMKT: null,
								JsonDataLegacy: null,
								CommonGoodsNo: null,
								IsUseCommonGoods: false,
							},
							AddonService: {
								//esm2.0추가
								AddonServiceUseType: '0',
								AddonServiceList: [],
							},
							SellingPeriod: {
								//   InputType: "1",//esm2.0제거
								History: [], //esm2.0추가
								IAC: {
									StartDate: `${YY1}-${MM1}-${DD1} 00:00:00`,
									EndDate: `${YY2}-${MM2}-${DD2} 23:59:59`,
								},

								GMKT: {
									StartDate: `${YY1}-${MM1}-${DD1} 00:00:00`,
									EndDate: `${YY2}-${MM2}-${DD2} 23:59:59`,
								},
							},
							PreSale: {
								//esm2.0추가
								UseSettingIAC: false,
								SaleStartDateIAC: '2023-06-04',
							},
							GoodsImage: {
								PrimaryImage: {
									Operation: '1',
									Url: market_item.img1,
									BigImage: 'false',
								},

								//   ListImage: {//esm2.0제거
								//     Operation: "1",
								//     Url: market_item.img1,
								//     BigImage: "false",
								//   },

								FixedImage: {
									Operation: '1',
									Url: market_item.img1,
									BigImage: 'false',
								},

								//   ExpandedImage: {//esm2.0제거
								//     Operation: "1",
								//     Url: market_item.img1,
								//     BigImage: "false",
								//   },

								AdditionalImagesSite: '0',
								AdditionalImagesStr: JSON.stringify(image_list),
							},

							DescriptionTypeSpecified: true,

							NewDescription: {
								InputType: '1',
								Text: desc,
							},

							ItemCode: market_code,
							CustCategoryNo: '0', //esm2.0추가
							CustCategory: null, //esm2.0추가
							ExpiryDate: '0-0-0', //esm2.0추가
							ExpiryDateSpecified: true, //esm2.0추가
							LaunchingDate: null, //esm2.0추가
							LaunchingDateSpecified: false, //esm2.0추가
							ManufacturedDate: '0-0-0', //esm2.0추가
							ManufacturedDateSpecified: true, //esm2.0추가
							Origin: {
								ProductType: '',
								Type: '0',
								Name: '',
								Code: '',
								IsMultipleOrigin: false,
							},
							LegacyRawMaterials: null, //esm2.0추가
							RawMaterials: null, //esm2.0추가
							Capacity: {
								//esm2.0추가
								Volume: null,
								Unit: '0',
								IsMultipleVolume: false,
							},
							Manual: null, //esm2.0추가
							ECoupon: {
								//esm2.0추가
								Period: '0',
								Price: '0',
								Ratio: '0',
								CouponName: '',
								ExpireType: '0',
								Expire1StartDate: '',
								Expire1EndDate: '',
								Expire2Duration: '0',
								Expire2Start: '0',
								UseTermType: '0',
								UseTerm1StartDate: '',
								UseTerm1EndDate: '',
								UseTerm2Start: '0',
								UseTerm2Duration: '0',
								CouponTemplate: '0',
								CouponImageUrl: '',
								DownloadTemplate: '0',
								DownloadImageUrl: '',
								ApplyPlace: '',
								IsInformByAddress: false,
								Address: '',
								AddressNo: '',
								IsInformByURL: false,
								URL: '',
								ApplyPlacePriority: '0',
								MoneyType: '0',
								MobileUseInfo: '',
								MobileHelpDeskphoneNo: '',
								TelephoneNo: '',
								AdditionalBenefit: '',
								HasRestrictCondition: false,
								RestrictCondition: '',
								Guide: '',
								PublicationCorp: '',
								PublicationCorpURL: '',
								IsCustomerNameView: false,
							},
							DeliveryInfo: {
								CommonDeliveryUseYn: true,
								InvalidDeliveryInfo: false,
								CommonDeliveryWayOPTSEL: '0', // 2023-10-10변경
								GmktDeliveryWayOPTSEL: '1', // 2023-10-10변경
								IsCommonGmktUnifyDelivery: false,
								GmktDeliveryCOMP: '100000012', // 2023-10-10변경
								IacDeliveryCOMP: null, // 2023-10-10변경
								IsCommonVisitTake: false,
								IsCommonQuickService: false,
								IsCommonIACPost: false,
								CommonIACPostType: '0',
								CommonIACPostPaidPrice: '0',
								IsGmktVisitTake: false,
								IsGmktQuickService: false,
								IsGmktTodayDEPAR: false,
								IsGmktTodayDEPARAgree: false,
								IsGmktVisitReceiptTier: false,
								MountBranchGroupSeq: '0',
								CommonVisitTakeType: '0',
								CommonVisitTakePriceDcAmnt: '0',
								CommonVisitTakeFreeGiftName: null,
								CommonVisitTakeADDRNo: null,
								CommonQuickServiceCOMPName: null,
								CommonQuickServicePhone: null,
								CommonQuickServiceDeliveryEnableRegionNo: null,
								ShipmentPlaceNo: delivery_shipping_code.toString(),
								DeliveryFeeType: '2',
								EachDeliveryFeeType: market_item.deliv_fee > 0 ? '2' : '1',
								EachDeliveryFeeQTYEachGradeType: null,
								DeliveryFeeTemplateJSON:
									market_item.deliv_fee > 0
										? JSON.stringify({
												DeliveryFeeType: 2,
												DeliveryFeeSubType: 0,
												FeeAmnt: market_item.deliv_fee,
												PrepayIs: true,
												CodIs: false,
												JejuAddDeliveryFee: commonStore.user.userInfo?.additionalShippingFeeJeju,
												BackwoodsAddDeliveryFee: commonStore.user.userInfo?.additionalShippingFeeJeju,
												ShipmentPlaceNo: delivery_shipping_code,
												DetailList: [],
										  })
										: JSON.stringify({
												DeliveryFeeType: 1,
												DeliveryFeeSubType: 0,
												FeeAmnt: 0,
												PrepayIs: false,
												CodIs: false,
												JejuAddDeliveryFee: 0,
												BackwoodsAddDeliveryFee: 0,
												ShipmentPlaceNo: delivery_shipping_code,
												DetailList: [],
										  }),
								EachDeliveryFeePayYn: '2',
								IsCommonGmktEachADDR: false,
								ReturnExchangeADDRNo: delivery_return_code,
								OldReturnExchangeADDR: null,
								OldReturnExchangeADDRTel: null,
								OldReturnExchangeSetupDeliveryCOMPName: null,
								OldReturnExchangeDeliveryFeeStr: null,
								ExchangeADDRNo: '',
								ReturnExchangeSetupDeliveryCOMP: null,
								ReturnExchangeSetupDeliveryCOMPName: null,
								ReturnExchangeDeliveryFee: '0',
								ReturnExchangeDeliveryFeeStr: commonStore.user.userInfo?.refundShippingFee.toString(),
								IacTransPolicyNo: delivery_policy_code_iac, // 2023-10-10변경
								GmktTransPolicyNo: delivery_policy_code_gmk,
								BackwoodsDeliveryYn: null,
								IsTplConvertible: false,
								IsGmktIACPost: false,
							},

							IsAdultProduct: 'False',
							IsVATFree: 'False',
							ASInfo: null, //esm2.0추가
							CertIAC: {
								HasIACCertType: false, //esm2.0추가
								MedicalInstrumentCert: {
									//esm2.0추가
									ItemLicenseNo: null,
									AdDeliberationNo: null,
									IsUse: false,
									CertificationOfficeName: null,
									CertificationNo: null,
									Operation: '1',
								},
								BroadcastEquipmentCert: {
									//esm2.0추가
									BroadcastEquipmentIs: false,
									AddtionalConditionIs: false,
									IsUse: false,
									CertificationOfficeName: null,
									CertificationNo: '',
									Operation: '1',
								},
								FoodCert: {
									//esm2.0추가
									IsUse: false,
									CertificationOfficeName: null,
									CertificationNo: null,
									Operation: '1',
								},
								HealthFoodCert: {
									//esm2.0추가
									AdDeliberationNo: null,
									IsUse: false,
									CertificationOfficeName: null,
									CertificationNo: null,
									Operation: '1',
								},
								EnvironmentFriendlyCert: {
									//esm2.0추가
									CertificationType: 'ENV_DTL',
									isIACEnvironmentFriendlyCertType: false,
									isGMKTEnvironmentFriendlyCertType: false,
									CertBizType: 'ENV_DTL',
									ProducerName: null,
									PresidentInfoNA: null,
									RepItemName: null,
									InfoHT: null,
									CertGroupType: null,
									InfoEM: null,
									CertStartDate: null,
									CertEndDate: null,
									InfoAD: null,
									CertificationOfficeName: null,
									CertificationExpiration: null,
									IsUse: false,
									CertificationNo: null,
									Operation: '1',
								},
								SafeCert: {
									//esm2.0추가
									SafeCertType: '0',
									AuthItemType: '0',
									CertificationNo: null,
									IsUse: false,
									CertificationOfficeName: null,
									Operation: '1',
								},
								ChildProductSafeCert: {
									SafeCertType: '0', //esm2.0추가
									ChangeType: '0',
									SafeCertDetailInfoList: [],
								},

								IntegrateSafeCert: {
									ItemNo: null,

									IntegrateSafeCertGroupList: [
										{
											SafeCertGroupNo: '1',
											CertificationType: '1',
										},
										{
											SafeCertGroupNo: '2',
											CertificationType: '1',
										},
										{
											SafeCertGroupNo: '3',
											CertificationType: '1',
										},
									],
								},
							},

							CertificationNoGMKT: '', //esm2.0추가
							LicenseSeqGMKT: null, //esm2.0추가
							OfficialNotice: sillResult,
							ItemWeight: '0', //esm2.0추가
							SkuList: [], //esm2.0추가 옵션데이터..
							SkuMatchingVerNo: '0', //esm2.0추가
							RentalAddInfo: null, //esm2.0추가
							CertificationTextGMKT: '', //esm2.0추가
							LicenseTextGMKT: null, //esm2.0추가
							InventoryNo: null, //esm2.0추가
							SingleSellerShop: null, //esm2.0추가
							IsUseSellerFunding: null, //esm2.0추가
							IsGift: true, //esm2.0추가
							ConsultingDetailList: [], //esm2.0추가
						},

						//
						SYIStep3: {
							G9RegisterCommand: '0',
							IsG9Goods: false,
							IsOnlyG9Goods: false,
							SellerDiscount: {
								DiscountAmtIac1: '0',
								DiscountAmtIac2: null,
								DiscountAmtGmkt1: '0',
								DiscountAmtGmkt2: null,
								IsSellerDCExceptionIacItem: false,
								IsSellerDCExceptionGmktItem: false,
								IsUsed: '2',
								IsUsedSpecified: false,
								DiscountType: '1',
								DiscountTypeSpecified: false,
								DiscountAmt: '0',
								DiscountAmtSpecified: false,
								DiscountAmt1: '0',
								DiscountAmt1Specified: false,
								DiscountAmt2: null,
								DiscountAmt2Specified: false,
								StartDate: `${YY1}-${MM1}-${DD1}`,
								StartDateSpecified: false,
								EndDate: '9999-12-31',
								EndDateSpecified: false,
								DiscountTypeIac: '1',
								DiscountTypeSpecifiedIac: false,
								StartDateIac: `${YY1}-${MM1}-${DD1}`,
								StartDateSpecifiedIac: false,
								EndDateIac: '9999-12-31',
								IacEndDateSpecified: false,
								DiscountAmtIac: '0',
								DiscountAmtSpecifiedIac: false,
								DiscountTypeGmkt: '1',
								DiscountTypeSpecifiedGmkt: false,
								StartDateGmkt: `${YY1}-${MM1}-${DD1}`,
								StartDateSpecifiedGmkt: false,
								EndDateGmkt: '9999-12-31',
								EndDateSpecifiedGmkt: false,
								DiscountAmtGmkt: '0',
								DiscountAmtSpecifiedGmkt: false,
							},
							FreeGift: {
								IsUsed: '2',
								IsUsedSpecified: false,
								IsOnly: '1',
								IsOnlySpecified: false,
								IacFreeGiftName: '',
								GmkFreeGiftName: '',
							},
							IsPcs: true,
							IsPcsSpecified: true,
							IacPcsCoupon: true,
							IacPcsCouponSpecified: false,
							GmkPcsCoupon: true,
							GmkPcsCouponSpecified: false,
							GmkBargain: false,
							GmkBargainSpecified: false,
							IacFreeWishKeyword: [],
							IacDiscountAgreement: true,
							IacDiscountAgreementSpecified: false,
							GmkDiscountAgreement: false,
							GmkDiscountAgreementSpecified: false,
							GmkOverseaAgreementSeller: true,
							GmkOverseaAgreementSellerSpecified: false,
							IacBuyerBenefit: {
								IsUsed: '2',
								IsUsedSpecified: false,
								StartDate: test_today,
								StartDateSpecified: false,
								EndDate: test_tommorow,
								EndDateSpecified: false,
								IsMemberDiscount: false,
								IsMemberDiscountSpecified: false,
								MemberDiscountPrice: '0',
								MemberDiscountPriceSpecified: false,
								IsBulkDiscount: false,
								IsBulkDiscountSpecified: false,
								BulkDiscountQty: '0',
								BulkDiscountQtySpecified: false,
								BulkDiscountPrice: '0',
								BulkDiscountPriceSpecified: false,
							},
							GmkBuyerBenefit: {
								IsUsed: '2',
								IsUsedSpecified: false,
								Type: '',
								StartDate: test_today,
								StartDateSpecified: false,
								EndDate: test_tommorow,
								EndDateSpecified: false,
								ConditionType: '',
								ConditionValue: '0',
								ConditionValueSpecified: false,
								Unit: '',
								UnitValue: '0',
								UnitValueSpecified: false,
								WhoFee: '',
							},
							IacDonation: {
								IsUsed: '2',
								IsUsedSpecified: false,
								StartDate: test_today,
								StartDateSpecified: false,
								EndDate: test_tommorow,
								EndDateSpecified: false,
								DonationPrice: '0',
								DonationPriceSpecified: false,
								DonationMaxPrice: '0',
								DonationMaxPriceSpecified: false,
								DonationType: '',
							},
							GmkDonation: {
								IsUsed: '2',
								IsUsedSpecified: false,
								StartDate: test_today,
								StartDateSpecified: false,
								EndDate: test_tommorow,
								EndDateSpecified: false,
								DonationPrice: '0',
								DonationPriceSpecified: false,
								DonationMaxPrice: '0',
								DonationMaxPriceSpecified: false,
								DonationType: '',
							},
							IacSellerPoint: {
								IsUsed: '2',
								IsUsedSpecified: false,
								PointType: '1',
								PointTypeSpecified: false,
								Point: '0',
								PointSpecified: true,
							},
							GmkSellerMileage: {
								IsUsed: '2',
								IsUsedSpecified: false,
								PointType: '1',
								PointTypeSpecified: false,
								Point: '0',
								PointSpecified: true,
							},
							IacChance: {
								IsUsed: '2',
								IsUsedSpecified: false,
								StartDate: test_today,
								StartDateSpecified: false,
								EndDate: test_tommorow,
								EndDateSpecified: false,
								ChanceQty: '0',
							},
							IacBrandShop: {
								IsUsed: '2',
								IsUsedSpecified: false,
								LCategoryCode: '',
								MCategoryCode: '',
								SCategoryCode: '',
								BrandCode: '',
								BrandName: '',
								BrandImage: [],
							},
							GmkBizOn: {
								IsUsed: '2',
								IsUsedSpecified: false,
								LCategoryCode: '',
								MCategoryCode: '',
								SCategoryCode: '',
							},
							IacAdditional: [],
							GmkAdditional: [],
							IacPayWishKeyword: [],
							IacAdPromotion: {
								CategorySmart: {
									LCategoryPrice: '0',
									LCategoryPriceSpecified: false,
									MCategoryPrice: '0',
									MCategoryPriceSpecified: false,
									SCategoryPrice: '0',
									SCategoryPriceSpecified: false,
									BestMainPrice: '0',
									BestMainPriceSpecified: false,
								},
								CategoryPower: {
									LCategoryPrice: '0',
									LCategoryPriceSpecified: false,
									MCategoryPrice: '0',
									MCategoryPriceSpecified: false,
									SCategoryPrice: '0',
									SCategoryPriceSpecified: false,
									BestMainPrice: '0',
									BestMainPriceSpecified: false,
								},
								Best100Smart: {
									LCategoryPrice: '0',
									LCategoryPriceSpecified: false,
									MCategoryPrice: '0',
									MCategoryPriceSpecified: false,
									SCategoryPrice: '0',
									SCategoryPriceSpecified: false,
									BestMainPrice: '0',
									BestMainPriceSpecified: false,
								},
								Chance: {
									LCategoryPrice: '0',
									LCategoryPriceSpecified: false,
									MCategoryPrice: '0',
									MCategoryPriceSpecified: false,
									SCategoryPrice: '0',
									SCategoryPriceSpecified: false,
									BestMainPrice: '0',
									BestMainPriceSpecified: false,
								},
								AccessMode: '1',
								AccessModeSpecified: false,
							},
							GmkAdPromotion: {
								LargePlus: '0',
								LargePlusSpecified: false,
								LargePowerMini: '0',
								LargePowerMiniSpecified: false,
								LargeBestPower: '0',
								LargeBestPowerSpecified: false,
								MiddlePlus: '0',
								MiddlePlusSpecified: false,
								MiddlePower: '0',
								MiddlePowerSpecified: false,
								MiddleDetailPower: '0',
								MiddleDetailPowerSpecified: false,
								MiddleBestPower: '0',
								MiddleBestPowerSpecified: false,
								SmallPlus: '0',
								SmallPlusSpecified: false,
								SmallPower: '0',
								SmallPowerSpecified: false,
							},
							OverseaAgree: {
								RegType: null,
								Gubun: '0',
								GubunSpecified: false,
								OverseaDisAgreeIs: false,
							},
							IsLeaseAvailableInIac: false,
							GmktShopGroupCd: '0',
							IsIacFreeWishKeyword: false,
							IacFreeWishKeywordEndDate: false,
							IacCommissionRate: '0',
							IacCommissionRateOpenMarket: '0',
							IacCommissionRateGroupBy: '0',
							IsIacFeeDiscountItem: false,
							IsDispExclude: true,
							IsDispExcludeSpecified: false,
						},
					};
				}

				let productId = market_item.name2;

				if (!productId) continue;

				let productData = {
					paramsData: `{"Keyword": "${productId}","SiteId":"0","SellType":0,"CategoryCode":"","CustCategoryCode":0,"TransPolicyNo":0,"StatusCode":"","SearchDateType":0,"StartDate":"","EndDate":"","SellerId":"","StockQty":-1,"SellPeriod":0,"DeliveryFeeApplyType":0,"OptAddDeliveryType":0,"SellMinPrice":0,"SellMaxPrice":0,"OptSelUseIs":-1,"PremiumEnd":0,"PremiumPlusEnd":0,"FocusEnd":0,"FocusPlusEnd":0,"GoodsIds":"","SellMngCode":"","OrderByType":11,"NotiItemReg":-1,"EpinMatch":-1,"UserEvaluate":"","ShopCateReg":-1,"IsTPLUse":"","GoodsName":"","SdBrandId":0,"SdBrandName":"","IsGiftUse":""}`,
					page: 1,
					start: 0,
					limit: 30,
				};

				let productContent: any = [];

				for (let property in productData) {
					let encodedKey = encodeURIComponent(property);
					let encodedValue = encodeURIComponent(productData[property]);

					productContent.push(encodedKey + '=' + encodedValue);
				}

				productContent = productContent.join('&');

				const productResp = await fetch('https://www.esmplus.com/Sell/SingleGoodsMng/GetSingleGoodsList', {
					headers: {
						accept: '*/*',
						'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
						'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
						'sec-ch-ua': '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
						'sec-ch-ua-mobile': '?0',
						'sec-ch-ua-platform': '"Windows"',
						'sec-fetch-dest': 'empty',
						'sec-fetch-mode': 'cors',
						'sec-fetch-site': 'same-origin',
						'x-requested-with': 'XMLHttpRequest',
					},
					referrer: 'https://www.esmplus.com/Sell/Items/ItemsMng?menuCode=TDM100',
					referrerPolicy: 'strict-origin-when-cross-origin',
					body: productContent,
					method: 'POST',
					mode: 'cors',
					credentials: 'include',
				});

				const productJson = await productResp.json();

				if (productJson.data.length < 1) {
					const progressValue = Math.round(((parseInt(product) + 1) * 100) / data.DShopInfo.prod_codes.length);

					commonStore.setDisabledProgressValue(shopCode, progressValue);

					await gql(MUTATIONS.UNLINK_PRODUCT_STORE, {
						productId: market_item.id,
						siteCode: shopCode,
					});

					continue;
				}
				//todo 다음주와서 판매중지 api 다시봐야하는데 창너무빨리꺼져서 노답임 ;; api볼수가없음 ->상품수정에서 api 비교해보는중 ..
				let deleteBody: any = {
					model: {
						...delete_test_body,
						GoodsNo: productJson.data[0].SingleGoodsNo,
						SiteGoodsNo: null,
						CommandType: '2', //판매중지
						IsIacSellingStatus: '0', //일단 이거 0이었고 G마켓은
					},
				};

				let lastDeleteBody: any = {
					param: [
						{
							SingleGoodsNo: 0,
							popupParamModel: [
								{
									SiteId: '',
									GoodsNo: 0,
									SiteGoodsNo: '',
									SellerId: '',
								},
							],
						},
					],
				};

				deleteBody.model.SYIStep2.Stock['SiteGoodsCountNo'] = '0';
				if (shopCode === 'A523') {
					//Gmarket
					lastDeleteBody.param[0].SingleGoodsNo = productJson.data[0].SingleGoodsNo;
					lastDeleteBody.param[0].popupParamModel[0].GoodsNo = productJson.data[0].SingleGoodsNo;
					lastDeleteBody.param[0].popupParamModel[0].SellerId = esmplusGmarketId;
					lastDeleteBody.param[0].popupParamModel[0].SiteGoodsNo = productJson.data[0].SiteGoodsNoGMKT;
					lastDeleteBody.param[0].popupParamModel[0].SiteId = '2';
					deleteBody.model.SYIStep1.StatusCode = '1';
					deleteBody.model.SYIStep2.SellingStatus = 'N';
					deleteBody.model.SiteGoodsNoGmkt = productJson.data[0].SiteGoodsNoGMKT;
					deleteBody.model.SellingStatusGmkt = '21';
					deleteBody.model.SellingStatusIac = 'N';
					deleteBody.model.IsSiteDisplayGmkt = true;
				} else if (shopCode === 'A522') {
					//aution 지마켓은 판매중지까지 성공했는데 옥션은 안했네 ..
					lastDeleteBody.param[0].SingleGoodsNo = productJson.data[0].SingleGoodsNo;
					lastDeleteBody.param[0].popupParamModel[0].GoodsNo = productJson.data[0].SingleGoodsNo;
					lastDeleteBody.param[0].popupParamModel[0].SellerId = esmplusAuctionId;
					lastDeleteBody.param[0].popupParamModel[0].SiteGoodsNo = productJson.data[0].SiteGoodsNoIAC;
					lastDeleteBody.param[0].popupParamModel[0].SiteId = '1';
					deleteBody.model.SYIStep1.StatusCode = '1';
					deleteBody.model.SYIStep1.AdminRestrict = 'Y';
					deleteBody.model.SYIStep2.SellingStatus = '21';
					deleteBody.model.SiteGoodsNoIac = productJson.data[0].SiteGoodsNoIAC;
					deleteBody.model.SellingStatusGmkt = 'N';
					deleteBody.model.SellingStatusIac = '21';
					deleteBody.model.IsSiteDisplayIac = true;
					deleteBody.model.IsIacSellingStatus = '2';
					//시퀀스요소 에러 원인 모르겠음 body 옥션위주로 좀 바꿔주면서 다시 해봐야할듯 ; orgModel이랑 관련없는거까지 확인함
				}

				const stopResp = await fetch('https://www.esmplus.com/Sell/SingleGoods/Save', {
					headers: {
						'content-type': 'application/json',
					},

					body: JSON.stringify(deleteBody),
					method: 'POST',
				});

				try {
					let stopJson = await stopResp.json();
					if (stopJson.Unknown?.ErrorList[0]?.ErrorMessage) {
						//에러처리안되있길래 에러처리함
						productStore.addConsoleText(
							`(${shopName}) 상품 등록해제 중단(${stopJson.Unknown?.ErrorList[0]?.ErrorMessage})`,
						);
						notificationByEveryTime(
							`(${shopName}) 상품 등록해제 도중 오류가 발생하였습니다. (${stopJson.Unknown?.ErrorList[0]?.ErrorMessage})`,
						);

						continue;
					}
				} catch (e) {
					async function deleteApiTest(lastDeleteBody: any) {
						const deleteResp = await fetch('https://www.esmplus.com/Sell/SingleGoodsMng/SetSellStateDelete', {
							headers: {
								'content-type': 'application/json',
							},

							body: JSON.stringify(lastDeleteBody),
							method: 'POST',
						});
						return deleteResp;
					}
					//판매중지까지 완료 but 상품삭제에서 문제 api완전
					const deleteResp = await deleteApiTest(lastDeleteBody);
					try {
						let deleteJson: any = await deleteResp.json();
						if (deleteJson.Unknown?.ErrorList[0]?.ErrorMessage) {
							//에러처리안되있길래 에러처리함
							productStore.addConsoleText(
								`(${shopName}) 상품 등록해제 중단(${deleteJson.Unknown?.ErrorList[0]?.ErrorMessage})`,
							);
							notificationByEveryTime(
								`(${shopName}) 상품 등록해제 도중 오류가 발생하였습니다. (${deleteJson.Unknown?.ErrorList[0]?.ErrorMessage})`,
							);

							continue;
						}
						const progressValue = Math.round(((parseInt(product) + 1) * 100) / data.DShopInfo.prod_codes.length);

						commonStore.setDisabledProgressValue(shopCode, progressValue);

						await gql(MUTATIONS.UNLINK_PRODUCT_STORE, {
							productId: market_item.id,
							siteCode: shopCode,
						});
					} catch (e) {
						// const progressValue = Math.round(((parseInt(product) + 1) * 100) / data.DShopInfo.prod_codes.length);
						// commonStore.setDisabledProgressValue(data.DShopInfo.site_code, progressValue);
						// await gql(MUTATIONS.UNLINK_PRODUCT_STORE, {
						//   productId: market_item.id,
						//   siteCode: data.DShopInfo.site_code,
						// });
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
};

// 지마켓/옥션 신규주문조회
// export async function newOrderESMPlus2(commonStore: any, shopInfo: any) {
//   const shopName = shopInfo.name;

//   if (!shopInfo.connected || shopInfo.disabled) {
//     return [];
//   }

//   try {
//     let esmplusAuctionId;
//     let esmplusGmarketId;

//     let gg_text = null;

//     try {
//       let gg_resp = await fetch("https://www.esmplus.com/Member/AntiMoneyLaundering/GetAMLSellerList");

//       gg_text = await gg_resp.json();
//     } catch (e) {
//       //
//     }

//     if (!gg_text) {
//       notificationByEveryTime(`(${shopName}) ESMPLUS 로그인 후 재시도 바랍니다.`);

//       return [];
//     }

//     let gg_json = JSON.parse(gg_text);

//     switch (shopInfo.code) {
//       case "A006": {
//         let user_g_resp = await fetch("https://www.esmplus.com/Home/HomeSellerActivityBalanceGmktData?sellerid=", {
//           body: null,
//           method: "GET",
//         });

//         let user_g_json = await user_g_resp.json();

//         esmplusGmarketId = commonStore.user.userInfo.esmplusGmarketId;

//         if (esmplusGmarketId !== user_g_json.sellerid) {
//           let matched = false;

//           for (let i in gg_json) {
//             if (gg_json[i].SiteId === 2 && esmplusGmarketId === gg_json[i].SellerId) {
//               matched = true;

//               break;
//             }
//           }

//           if (!matched) {
//             notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

//             return [];
//           }
//         }

//         break;
//       }

//       case "A001": {
//         let user_a_resp = await fetch("https://www.esmplus.com/Home/HomeSellerActivityBalanceIacData?sellerid=", {
//           body: null,
//           method: "GET",
//         });

//         let user_a_json = await user_a_resp.json();

//         esmplusAuctionId = commonStore.user.userInfo.esmplusAuctionId;

//         if (esmplusAuctionId !== user_a_json.sellerid) {
//           let matched = false;

//           for (let i in gg_json) {
//             if (gg_json[i].SiteId === 1 && esmplusAuctionId === gg_json[i].SellerId) {
//               matched = true;

//               break;
//             }
//           }

//           if (!matched) {
//             notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

//             return [];
//           }
//         }

//         break;
//       }

//       default:
//         break;
//     }

//     const userResp = await fetch("https://www.esmplus.com/Escrow/Order/NewOrder");
//     const userText = await userResp.text();
//     const userMatched: any = userText.match(/var masterID = "([0-9]+)"/);

//     let dateStart = getClockOffset(0, 0, -7, 0, 0, 0);
//     let dateEnd = getClock();

//     let orderData = {
//       page: "1",
//       limit: "50",
//       siteGbn: "0",
//       searchAccount: userMatched[1],
//       searchDateType: "ODD",
//       searchSDT: `${dateStart.YY}-${dateStart.MM}-${dateStart.DD}`,
//       searchEDT: `${dateEnd.YY}-${dateEnd.MM}-${dateEnd.DD}`,
//       searchKey: "ON",
//       searchKeyword: "",
//       searchDistrType: "AL",
//       searchAllYn: "N",
//       SortFeild: "PayDate",
//       SortType: "Desc",
//       start: "0",
//       searchTransPolicyType: "",
//     };

//     const orderResp = await fetch("https://www.esmplus.com/Escrow/Order/NewOrderSearch", {
//       headers: {
//         accept: "application/json, text/javascript, */*; q=0.01",
//         "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
//         "content-type": "application/x-www-form-urlencoded",
//         "sec-ch-ua": '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
//         "sec-ch-ua-mobile": "?0",
//         "sec-ch-ua-platform": '"Windows"',
//         "sec-fetch-dest": "empty",
//         "sec-fetch-mode": "cors",
//         "sec-fetch-site": "same-origin",
//         "x-requested-with": "XMLHttpRequest",
//       },
//       referrer: "https://www.esmplus.com/Escrow/Order/NewOrder?menuCode=TDM105",
//       referrerPolicy: "strict-origin-when-cross-origin",
//       body: urlEncodedObject(orderData),
//       method: "POST",
//       mode: "cors",
//       credentials: "include",
//     });

//     let orderJson = await orderResp.json();

//     switch (shopInfo.code) {
//       case "A001": {
//         orderJson.data = orderJson.data.filter((v: any) => v.SiteIDValue === "1");

//         break;
//       }

//       case "A006": {
//         orderJson.data = orderJson.data.filter((v: any) => v.SiteIDValue === "2");

//         break;
//       }

//       default: {
//         return [];
//       }
//     }

//     console.log(shopName, orderJson.data);

//     return orderJson.data.map((v: any) => {
//       return {
//         productId: v.GoodsNo,
//         marketCode: shopInfo.code,
//         marketName: shopInfo.name,
//         taobaoOrderNo: null,
//         productName: extractContent(v.GoodsName),
//         productOptionContents: extractContent(v.SelOption).split(":").join(", "),
//         sellerProductManagementCode: extractContent(v.SellerMngCode),
//         orderNo: v.SiteOrderNo,
//         orderQuantity: v.OrderQty,
//         orderMemberName: v.BuyerName,
//         orderMemberTelNo: v.BuyerCp,
//         productPayAmt: parseInt(v.OrderAmnt.replaceAll(",", "")),
//         deliveryFeeAmt: parseInt(v.DeliveryFee.replaceAll(",", "")),
//         individualCustomUniqueCode: v.ReceiverEntryNo,
//         receiverName: v.RcverName,
//         receiverTelNo1: v.RcverInfoCp,
//         receiverIntegratedAddress: extractContent(v.RcverInfoAd),
//         receiverZipCode: v.ZipCode,
//         productOrderMemo: extractContent(v.DeliveryMemo),
//         OrderNo: v.OrderNo,
//         SellerCustNo: v.SellerCustNo,
//       };
//     });
//   } catch (e) {
//     console.log(shopName, e);

//     return [];
//   }
// }

// 지마켓/옥션 발주확인 처리
// export async function productPreparedESMPlus2(commonStore: any, shopInfo: any, props: any) {
//   let productorderInfo: any = [];

//   if (props !== "" && props.item.marketCode === "A001") {
//     productorderInfo.push(`${props.item.OrderNo},1,${props.item.SellerCustNo}`);
//   } else if (props !== "" && props.item.marketCode === "A006") {
//     productorderInfo.push(`${props.item.OrderNo},2,${props.item.SellerCustNo}`);
//   } else {
//     return;
//   }

//   console.log("productshipNo", productorderInfo);

//   const shopName = shopInfo.name;

//   if (!shopInfo.connected || shopInfo.disabled) {
//     return [];
//   }

//   try {
//     let esmplusAuctionId;
//     let esmplusGmarketId;

//     let gg_text = null;

//     try {
//       let gg_resp = await fetch("https://www.esmplus.com/Member/AntiMoneyLaundering/GetAMLSellerList");

//       gg_text = await gg_resp.json();
//     } catch (e) {
//       //
//     }

//     if (!gg_text) {
//       notificationByEveryTime(`(${shopName}) ESMPLUS 로그인 후 재시도 바랍니다.`);

//       return [];
//     }

//     let gg_json = JSON.parse(gg_text);

//     switch (shopInfo.code) {
//       case "A006": {
//         let user_g_resp = await fetch("https://www.esmplus.com/Home/HomeSellerActivityBalanceGmktData?sellerid=", {
//           body: null,
//           method: "GET",
//         });

//         let user_g_json = await user_g_resp.json();

//         esmplusGmarketId = commonStore.user.userInfo.esmplusGmarketId;

//         if (esmplusGmarketId !== user_g_json.sellerid) {
//           let matched = false;

//           for (let i in gg_json) {
//             if (gg_json[i].SiteId === 2 && esmplusGmarketId === gg_json[i].SellerId) {
//               matched = true;

//               break;
//             }
//           }

//           if (!matched) {
//             notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

//             return [];
//           }
//         }

//         break;
//       }

//       case "A001": {
//         let user_a_resp = await fetch("https://www.esmplus.com/Home/HomeSellerActivityBalanceIacData?sellerid=", {
//           body: null,
//           method: "GET",
//         });

//         let user_a_json = await user_a_resp.json();

//         esmplusAuctionId = commonStore.user.userInfo.esmplusAuctionId;

//         if (esmplusAuctionId !== user_a_json.sellerid) {
//           let matched = false;

//           for (let i in gg_json) {
//             if (gg_json[i].SiteId === 1 && esmplusAuctionId === gg_json[i].SellerId) {
//               matched = true;

//               break;
//             }
//           }

//           if (!matched) {
//             notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

//             return [];
//           }
//         }

//         break;
//       }

//       default:
//         break;
//     }

//     const userResp = await fetch("https://www.esmplus.com/Escrow/Order/NewOrder");
//     const userText = await userResp.text();
//     const userMatched: any = userText.match(/var masterID = "([0-9]+)"/);

//     productorderInfo.map(async (v: any) => {
//       let orderData: any = {
//         mID: userMatched[1], //예시 542010
//         orderInfo: v, //예시 4005936514,2,153802169
//       };
//       const orderResp = await fetch("https://www.esmplus.com/Escrow/Order/OrderCheck", {
//         headers: {
//           accept: "application/json, text/javascript, */*; q=0.01",
//           "accept-language": "ko,en-US;q=0.9,en;q=0.8,ko-KR;q=0.7",
//           "content-type": "application/x-www-form-urlencoded",
//           "sec-ch-ua": '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
//           "sec-ch-ua-mobile": "?0",
//           "sec-ch-ua-platform": '"Windows"',
//           "sec-fetch-dest": "empty",
//           "sec-fetch-mode": "cors",
//           "sec-fetch-site": "same-origin",
//           "x-requested-with": "XMLHttpRequest",
//         },
//         referrer: "https://www.esmplus.com/Escrow/Order/NewOrder?menuCode=TDM105",
//         referrerPolicy: "strict-origin-when-cross-origin",
//         body: urlEncodedObject(orderData),
//         method: "POST",
//         mode: "cors",
//         credentials: "include",
//       });
//       let orderJson = await orderResp.json();
//       console.log(shopName, orderJson.data);
//     });
//   } catch (e) {
//     console.log(shopName, e);
//     return [];
//   }
// }

// 지마켓/옥션 발송처리 주문조회
// export async function deliveryOrderESMPlus2(commonStore: any, shopInfo: any) {
//   const shopName = shopInfo.name;

//   if (!shopInfo.connected || shopInfo.disabled) {
//     return [];
//   }

//   try {
//     let esmplusAuctionId;
//     let esmplusGmarketId;

//     let gg_text = null;

//     try {
//       let gg_resp = await fetch("https://www.esmplus.com/Member/AntiMoneyLaundering/GetAMLSellerList");

//       gg_text = await gg_resp.json();
//     } catch (e) {
//       //
//     }

//     if (!gg_text) {
//       notificationByEveryTime(`(${shopName}) ESMPLUS 로그인 후 재시도 바랍니다.`);

//       return [];
//     }

//     let gg_json = JSON.parse(gg_text);

//     switch (shopInfo.code) {
//       case "A006": {
//         let user_g_resp = await fetch("https://www.esmplus.com/Home/HomeSellerActivityBalanceGmktData?sellerid=", {
//           body: null,
//           method: "GET",
//         });

//         let user_g_json = await user_g_resp.json();

//         esmplusGmarketId = commonStore.user.userInfo.esmplusGmarketId;

//         if (esmplusGmarketId !== user_g_json.sellerid) {
//           let matched = false;

//           for (let i in gg_json) {
//             if (gg_json[i].SiteId === 2 && esmplusGmarketId === gg_json[i].SellerId) {
//               matched = true;

//               break;
//             }
//           }

//           if (!matched) {
//             notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

//             return [];
//           }
//         }

//         break;
//       }

//       case "A001": {
//         let user_a_resp = await fetch("https://www.esmplus.com/Home/HomeSellerActivityBalanceIacData?sellerid=", {
//           body: null,
//           method: "GET",
//         });

//         let user_a_json = await user_a_resp.json();

//         esmplusAuctionId = commonStore.user.userInfo.esmplusAuctionId;

//         if (esmplusAuctionId !== user_a_json.sellerid) {
//           let matched = false;

//           for (let i in gg_json) {
//             if (gg_json[i].SiteId === 1 && esmplusAuctionId === gg_json[i].SellerId) {
//               matched = true;

//               break;
//             }
//           }

//           if (!matched) {
//             notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

//             return [];
//           }
//         }

//         break;
//       }

//       default:
//         break;
//     }

//     const userResp = await fetch("https://www.esmplus.com/Escrow/Order/NewOrder");
//     const userText = await userResp.text();
//     const userMatched: any = userText.match(/var masterID = "([0-9]+)"/);

//     let dateStart = getClockOffset(0, 0, -7, 0, 0, 0);
//     let dateEnd = getClock();

//     let orderData = {
//       page: "1",
//       limit: "50",
//       siteGbn: "0",
//       searchAccount: userMatched[1],
//       searchDateType: "ODD",
//       searchSDT: `${dateStart.YY}-${dateStart.MM}-${dateStart.DD}`,
//       searchEDT: `${dateEnd.YY}-${dateEnd.MM}-${dateEnd.DD}`,
//       searchKey: "ON",
//       searchKeyword: "",
//       excelInfo: "",
//       searchStatus: "0",
//       searchAllYn: "Y",
//       SortFeild: "PayDate",
//       SortType: "Desc",
//       start: "0",
//       searchOrderType: "",
//       searchDeliveryType: "",
//       searchPaking: "false",
//       searchDistrType: "AL",
//       searchTransPolicyType: "",
//     };

//     const orderResp = await fetch("https://www.esmplus.com/Escrow/Delivery/GeneralDeliverySearch", {
//       headers: {
//         accept: "application/json, text/javascript, */*; q=0.01",
//         "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
//         "content-type": "application/x-www-form-urlencoded",
//         "sec-ch-ua": '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
//         "sec-ch-ua-mobile": "?0",
//         "sec-ch-ua-platform": '"Windows"',
//         "sec-fetch-dest": "empty",
//         "sec-fetch-mode": "cors",
//         "sec-fetch-site": "same-origin",
//         "x-requested-with": "XMLHttpRequest",
//       },
//       referrer:
//         "https://www.esmplus.com/Escrow/Delivery/GeneralDelivery?gbn=0&status=0&type=&searchAccount=574472&searchDateType=ODD&searchSDT=2022-08-10&searchEDT=2022-11-10&searchKey=ON&searchKeyword=&searchDeliveryType=&searchOrderType=&searchPacking=false&totalAccumulate=-&listAllView=false&searchDistrType=AL&searchTransPolicyType=",
//       referrerPolicy: "strict-origin-when-cross-origin",
//       body: urlEncodedObject(orderData),
//       method: "POST",
//       mode: "cors",
//       credentials: "include",
//     });

//     let orderJson = await orderResp.json();

//     switch (shopInfo.code) {
//       case "A001": {
//         orderJson.data = orderJson.data.filter((v: any) => v.SiteIDValue === "1");

//         break;
//       }

//       case "A006": {
//         orderJson.data = orderJson.data.filter((v: any) => v.SiteIDValue === "2");

//         break;
//       }

//       default: {
//         return [];
//       }
//     }

//     console.log(shopName, orderJson.data);

//     return orderJson.data.map((v: any) => {
//       return {
//         productId: v.GoodsNo,
//         marketCode: shopInfo.code,
//         marketName: shopInfo.name,
//         taobaoOrderNo: null,
//         productName: extractContent(v.GoodsName),
//         productOptionContents: extractContent(v.SelOption).split(":").join(", "),
//         sellerProductManagementCode: extractContent(v.SellerMngCode),
//         orderNo: v.SiteOrderNo,
//         orderQuantity: v.OrderQty,
//         orderMemberName: v.BuyerName,
//         orderMemberTelNo: v.BuyerCp,
//         productPayAmt: parseInt(v.OrderAmnt.replaceAll(",", "")),
//         deliveryFeeAmt: parseInt(v.DeliveryFee.replaceAll(",", "")),
//         individualCustomUniqueCode: v.ReceiverEntryNo,
//         receiverName: v.RcverName,
//         receiverTelNo1: v.RcverInfoCp,
//         receiverIntegratedAddress: extractContent(v.RcverInfoAd),
//         receiverZipCode: v.ZipCode,
//         productOrderMemo: extractContent(v.DeliveryMemo),
//         OrderNo: v.OrderNo,
//         SellerCustNo: v.SellerCustNo,
//       };
//     });
//   } catch (e) {
//     console.log(shopName, e);

//     return [];
//   }
// }
