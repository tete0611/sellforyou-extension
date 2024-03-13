import gql from '../../pages/Main/GraphQL/Requests';
import QUERIES from '../../pages/Main/GraphQL/Queries';
import MUTATIONS from '../../pages/Main/GraphQL/Mutations';

import { runInAction, makeAutoObservable, autorun } from 'mobx';
import {
	cartesian,
	downloadExcel,
	floatingToast,
	getClock,
	getImageMeta,
	readFileDataURL,
} from '../../../common/function';
import { deleteSmartStore, uploadSmartStore } from '../../pages/Tools/SmartStore';
import { coupangApiGateway, deleteCoupang, uploadCoupang } from '../../pages/Tools/Coupang';
import { deleteStreet, uploadStreet } from '../../pages/Tools/Street';
import { deleteESMPlus, uploadESMPlus } from '../../pages/Tools/ESMPlus';
import { deleteESMPlus2, uploadESMPlus2 } from '../../pages/Tools/ESMPlus2';
import { deleteInterpark, uploadInterpark } from '../../pages/Tools/Interpark';
import { deleteWemakeprice, uploadWemakeprice } from '../../pages/Tools/Wemakeprice';
import { deleteLotteon, uploadLotteon } from '../../pages/Tools/Lotteon';
import { deleteTmon, uploadTmon } from '../../pages/Tools/Tmon';
import { createTabCompletely, getLocalStorage, setLocalStorage, sendTabMessage } from '../../pages/Tools/ChromeAsync';
import { common } from './common';
import { AppInfo, Item, ItemInfo, ManyPriceInfo, ModalInfo, SearchType } from '../../type/type';
import { SHOPCODE } from '../../type/variable';
import { MutationUpdateKeywardListArgs, ProductWhereInput, User } from '../../type/schema';

const {
	AUCTION_1,
	AUCTION_2,
	COUPANG,
	G_MARKET_1,
	G_MARKET_2,
	INTER_PARK,
	LOTTE_ON_GLOBAL,
	LOTTE_ON_NORMAL,
	SMART_STORE,
	STREET11_GLOBAL,
	STREET11_NORMAL,
	TMON,
	WE_MAKE_PRICE,
} = SHOPCODE;

export class product {
	gridView: boolean = false;
	count: number = 0;
	etcPageSize: boolean = false;
	pageTemp: number = 1;
	page: number = 1;
	pages: number = 0;
	pageSize: number = 10;
	state: number = 6;
	myLock: number = 1;
	tagDict: any = [];
	uploadConsole: any = [];
	uploadDisabledIndex: number = -1;
	uploadFailedIndex: number = -1;
	uploadIndex: number = -1;

	itemInfo: ItemInfo = {
		checkedAll: false,
		current: 0,
		items: [],
		loading: false,
	};

	collectInfo: any = {
		wait: [],
		success: [],
		failed: [],
	};

	registeredInfo: any = {
		wait: [],
		success: [],
		failed: [],
	};

	popOverInfo: any = {
		image: {
			open: false,
			element: null,
			data: {
				src: '',
			},
		},

		addOptionName: {
			index: -1,
			open: false,
			element: null,
			data: {
				index: -1,
				head: '',
				tail: '',
			},
		},

		replaceOptionName: {
			index: -1,
			open: false,
			element: null,
			data: {
				index: -1,
				find: '',
				replace: '',
			},
		},

		addOptionPrice: {
			index: -1,
			open: false,
			element: null,
			data: {
				nameIndex: -1,
				valueIndex: -1,
				price: '',
			},
		},

		subtractOptionPrice: {
			index: -1,
			open: false,
			element: null,
			data: {
				nameIndex: -1,
				valueIndex: -1,
				price: '',
			},
		},

		setOptionPrice: {
			index: -1,
			open: false,
			element: null,
			data: {
				nameIndex: -1,
				valueIndex: -1,
				price: '',
			},
		},

		setOptionStock: {
			index: -1,
			open: false,
			element: null,
			data: {
				nameIndex: -1,
				valueIndex: -1,
				stock: '',
			},
		},

		setProductSillData: {
			index: -1,
			open: false,
			element: null,
			data: {
				marketCode: null,
				sillCode: '',
				sillData: '',
			},
		},

		updateManyProduct: {
			open: false,
			element: null,
		},
	};

	modalInfo: ModalInfo = {
		addOptionName: false,
		attribute: false,
		category: false,
		collectExcel: false,
		description: false,
		fee: false,
		name: false,
		price: false,
		replaceOptionName: false,
		tag: false,
		upload: false,
		uploadTabIndex: 0,
		uploadDisabled: false,
		uploadFailed: false,
		locked: false,
		myKeywarded: false,
	};

	searchKeyword = '';

	changedWhere: ProductWhereInput = {}; // 변화되어있는 상품조회 where절
	stagedWhere: ProductWhereInput = {}; // 실질적으로 적용할 상품조회 where절

	categoryInfo = {
		markets: [
			{
				code: 'A077',
				data: [],
				loading: false,
				input: '',
			},
			{
				code: 'B378',
				data: [],
				loading: false,
				input: '',
			},
			{
				code: 'A112',
				data: [],
				loading: false,
				input: '',
			},
			{
				code: 'A113',
				data: [],
				loading: false,
				input: '',
			},
			{
				code: 'A006',
				data: [],
				loading: false,
				input: '',
			},
			{
				code: 'A001',
				data: [],
				loading: false,
				input: '',
			},
			{
				code: 'A027',
				data: [],
				loading: false,
				input: '',
			},
			{
				code: 'B719',
				data: [],
				loading: false,
				input: '',
			},
			{
				code: 'A524',
				data: [],
				loading: false,
				input: '',
			},
			{
				code: 'A525',
				data: [],
				loading: false,
				input: '',
			},
			{
				code: 'B956',
				data: [],
				loading: false,
				input: '',
			},
		],
	};

	manyAttributeInfo: any = {
		manufacturer: '',
		brandName: '',
		modelName: '',
	};
	ManymyKeyward: any = {
		myKeyward: '',
	};
	manyPriceInfo: ManyPriceInfo = {
		cnyRate: 185,
		marginRate: 25,
		marginUnitType: 'PERCENT',
		localShippingFee: 6000,
		shippingFee: 0,
		refundShippingFee: 0,
	};

	manyFeeInfo: any = {
		naverFee: 0,
		coupangFee: 0,
		streetFee: 0,
		streetNormalFee: 0,
		gmarketFee: 0,
		auctionFee: 0,
		interparkFee: 0,
		wemakepriceFee: 0,
		lotteonFee: 0,
		lotteonNormalFee: 0,
		tmonFee: 0,
	};

	manyNameInfo: any = {
		type: '1',

		body: '',

		head: '',
		tail: '',

		find: '',
		replace: '',

		findMany: '',
		replaceMany: '',

		keward: '',
	};

	manyTagInfo: any = {
		searchTags: '',
		searchTagsDisabled: false,

		immSearchTags: '',
		immSearchTagsDisabled: false,
	};

	manyCategoryInfo: any = {
		categoryInfoA077: {
			code: null,
			name: '',
		},

		categoryInfoB378: {
			code: null,
			name: '',
		},

		categoryInfoA112: {
			code: null,
			name: '',
		},

		categoryInfoA113: {
			code: null,
			name: '',
		},

		categoryInfoA006: {
			code: null,
			name: '',
		},

		categoryInfoA001: {
			code: null,
			name: '',
		},

		categoryInfoA027: {
			code: null,
			name: '',
		},

		categoryInfoB719: {
			code: null,
			name: '',
		},

		categoryInfoA524: {
			code: null,
			name: '',
		},

		categoryInfoA525: {
			code: null,
			name: '',
		},

		categoryInfoB956: {
			code: null,
			name: '',
		},
	};

	manyDescriptionInfo: any = {
		html: null,
		previewHtml: 'Empty Value',
	};

	constructor() {
		makeAutoObservable(this);

		this.loadAppInfo();

		autorun(() => {
			this.state = this.stagedWhere.state?.equals ?? 6;
		});
	}

	/** PC 기본값 설정 */
	loadAppInfo = async () => {
		let auth = await getLocalStorage<AppInfo>('appInfo');

		runInAction(() => {
			this.pageSize = auth.pageSize ?? 10;
			this.gridView = auth.gridView ?? false;

			if (
				this.pageSize !== 10 &&
				this.pageSize !== 20 &&
				this.pageSize !== 50 &&
				this.pageSize !== 100 &&
				this.pageSize !== 200
			)
				this.etcPageSize = true;
		});
	};

	/** 이미지 팝업 */
	setImagePopOver = (data: any) => (this.popOverInfo.image = data);

	/** 옵션명 키워드추가 팝업 */
	setAddOptionNamePopOver = (data: any) => (this.popOverInfo.addOptionName = data);

	/** 옵션명 키워드변경 팝업 */
	setReplaceOptionNamePopOver = (data: any) => (this.popOverInfo.replaceOptionName = data);

	/** 옵션가 일괄인상 팝업 */
	setAddOptionPricePopOver = (data: any) => (this.popOverInfo.addOptionPrice = data);

	/** 옵션가 일괄인하 팝업 */
	setSubtractOptionPricePopOver = (data: any) => (this.popOverInfo.subtractOptionPrice = data);

	/** 옵션가 일괄설정 팝업 */
	setOptionPricePopOver = (data: any) => (this.popOverInfo.setOptionPrice = data);

	/** 재고수량 일괄설정 팝업 */
	setOptionStockPopOver = (data: any) => (this.popOverInfo.setOptionStock = data);

	/** 고시정보 설정 */
	setProductSillDataPopOver = (data: any) => (this.popOverInfo.setProductSillData = data);

	/** 상품 일괄설정 모달 */
	setUpdateManyProductPopOver = (data: any) => (this.popOverInfo.updateManyProduct = data);

	/** 카테고리 정보 가져오기 */
	getCategoryList = async (marketCode: SHOPCODE) => {
		const {
			AUCTION_1,
			COUPANG,
			G_MARKET_1,
			INTER_PARK,
			LOTTE_ON_GLOBAL,
			LOTTE_ON_NORMAL,
			SMART_STORE,
			STREET11_GLOBAL,
			STREET11_NORMAL,
			TMON,
			WE_MAKE_PRICE,
		} = SHOPCODE;
		let result = this.categoryInfo.markets.find((v) => v.code === marketCode)!;

		if (result.data.length > 0) return;

		result.loading = true;

		let categories: any = null;

		switch (marketCode) {
			case SMART_STORE:
				categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_A077_BY_SOMEONE, {}, false);
				break;
			case COUPANG:
				categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_B378_BY_SOMEONE, {}, false);
				break;
			case STREET11_GLOBAL:
				categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_A112_BY_SOMEONE, {}, false);
				break;
			case STREET11_NORMAL:
				categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_A113_BY_SOMEONE, {}, false);
				break;
			case G_MARKET_1:
				categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_A006_BY_SOMEONE, {}, false);
				break;
			case AUCTION_1:
				categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_A001_BY_SOMEONE, {}, false);
				break;
			case INTER_PARK:
				categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_A027_BY_SOMEONE, {}, false);
				break;
			case WE_MAKE_PRICE:
				categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_B719_BY_SOMEONE, {}, false);
				break;
			case LOTTE_ON_GLOBAL:
				categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_A524_BY_SOMEONE, {}, false);
				break;
			case LOTTE_ON_NORMAL:
				categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_A525_BY_SOMEONE, {}, false);
				break;
			case TMON:
				categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_B956_BY_SOMEONE, {}, false);
				break;
		}

		if (categories.errors) return;

		runInAction(() => {
			switch (marketCode) {
				case SMART_STORE:
					result.data = categories.data.searchCategoryInfoA077BySomeone;
					break;
				case COUPANG:
					result.data = categories.data.searchCategoryInfoB378BySomeone;
					break;
				case STREET11_GLOBAL:
					result.data = categories.data.searchCategoryInfoA112BySomeone;
					break;
				case STREET11_NORMAL:
					result.data = categories.data.searchCategoryInfoA113BySomeone;
					break;
				case G_MARKET_1:
					result.data = categories.data.searchCategoryInfoA006BySomeone;
					break;
				case AUCTION_1:
					result.data = categories.data.searchCategoryInfoA001BySomeone;
					break;
				case INTER_PARK:
					result.data = categories.data.searchCategoryInfoA027BySomeone;
					break;
				case WE_MAKE_PRICE:
					result.data = categories.data.searchCategoryInfoB719BySomeone;
					break;
				case LOTTE_ON_GLOBAL:
					result.data = categories.data.searchCategoryInfoA524BySomeone;
					break;
				case LOTTE_ON_NORMAL:
					result.data = categories.data.searchCategoryInfoA525BySomeone;
					break;
				case TMON:
					result.data = categories.data.searchCategoryInfoB956BySomeone;
					break;
			}

			result.loading = false;
		});
	};

	/** 카테고리 입력정보 */
	setCategoryInput = (marketCode: SHOPCODE, value: string) =>
		(this.categoryInfo.markets.find((v) => v.code === marketCode)!.input = value);

	/** 카테고리 일괄설정 */
	setManyCategory = (marketCode: SHOPCODE, value: any) => {
		const {
			AUCTION_1,
			COUPANG,
			G_MARKET_1,
			INTER_PARK,
			LOTTE_ON_GLOBAL,
			LOTTE_ON_NORMAL,
			SMART_STORE,
			STREET11_GLOBAL,
			STREET11_NORMAL,
			TMON,
			WE_MAKE_PRICE,
		} = SHOPCODE;
		switch (marketCode) {
			case SMART_STORE:
				this.manyCategoryInfo.categoryInfoA077 = value;
				break;
			case COUPANG:
				this.manyCategoryInfo.categoryInfoB378 = value;
				break;
			case STREET11_GLOBAL:
				this.manyCategoryInfo.categoryInfoA112 = value;
				break;
			case STREET11_NORMAL:
				this.manyCategoryInfo.categoryInfoA113 = value;
				break;
			case G_MARKET_1:
				this.manyCategoryInfo.categoryInfoA006 = value;
				break;
			case AUCTION_1:
				this.manyCategoryInfo.categoryInfoA001 = value;
				break;
			case INTER_PARK:
				this.manyCategoryInfo.categoryInfoA027 = value;
				break;
			case WE_MAKE_PRICE:
				this.manyCategoryInfo.categoryInfoB719 = value;
				break;
			case LOTTE_ON_GLOBAL:
				this.manyCategoryInfo.categoryInfoA524 = value;
				break;
			case LOTTE_ON_NORMAL:
				this.manyCategoryInfo.categoryInfoA525 = value;
				break;
			case TMON:
				this.manyCategoryInfo.categoryInfoB956 = value;
				break;
		}
	};

	/** 카테고리 설정 */
	setCategory = (index: number) =>
		(this.itemInfo.items[index] = {
			...this.itemInfo.items[index],

			categoryInfoA077: this.manyCategoryInfo.categoryInfoA077,
			categoryInfoB378: this.manyCategoryInfo.categoryInfoB378,
			categoryInfoA112: this.manyCategoryInfo.categoryInfoA112,
			categoryInfoA113: this.manyCategoryInfo.categoryInfoA113,
			categoryInfoA006: this.manyCategoryInfo.categoryInfoA006,
			categoryInfoA001: this.manyCategoryInfo.categoryInfoA001,
			categoryInfoA027: this.manyCategoryInfo.categoryInfoA027,
			categoryInfoB719: this.manyCategoryInfo.categoryInfoB719,
			categoryInfoA524: this.manyCategoryInfo.categoryInfoA524,
			categoryInfoA525: this.manyCategoryInfo.categoryInfoA525,
			categoryInfoB956: this.manyCategoryInfo.categoryInfoB956,
		});

	/** 카테고리 업데이트 */
	updateCategory = async (marketCode: SHOPCODE, value: any, index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.baseInfo = 0);

		this.itemInfo.items[index].edited.baseInfo = 2;

		let data = {
			productId: this.itemInfo.items[index].id,
			[`category${marketCode}`]: value.code,
		};
		let categories = await gql(MUTATIONS.UPDATE_PRODUCT_CATEGORY, data, false);

		if (categories.errors) {
			alert(categories.errors[0].message);
			exit();
			return;
		}

		const parsedSillInfo = JSON.parse(categories.data.updateProductCategory2);

		let sillInfo: any = null;

		if (marketCode === SHOPCODE.SMART_STORE) sillInfo = parsedSillInfo[0][`sillInfo${marketCode}`];
		else sillInfo = parsedSillInfo;

		runInAction(() => {
			if (marketCode === SHOPCODE.SMART_STORE)
				this.itemInfo.items[index].tagInfo = this.tagDict.find((w: any) => w.code === value.code).tagJson;

			this.itemInfo.items[index][`categoryInfo${marketCode}`] = {
				[`sillInfo${marketCode}`]: sillInfo[0],
				[`activeSillData${marketCode}`]: sillInfo,

				code: value.code,
				name: value.name,
			};

			this.itemInfo.items[index][`sillCode${marketCode}`] = sillInfo[0].code;
			this.itemInfo.items[index][`sillData${marketCode}`] = sillInfo[0].data;
		});

		await this.updateProdutSillCodes(
			marketCode,
			{
				productIds: data.productId,
				value: sillInfo[0].code,
			},
			index,
		);

		floatingToast('카테고리가 저장되었습니다.', 'success');

		runInAction(() => exit());
	};

	/** 카테고리 자동매칭 업데이트 */
	updateCategoryAuto = async (value: any, index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.summary = 0);

		this.itemInfo.items[index].edited.summary = 2;

		const response = await gql(QUERIES.SEARCH_CATEGORY_INFO_A077_BY_CODE, { code: value.code }, false);

		if (response.errors) {
			alert(response.errors[0].message);
			exit();

			return;
		}

		const categories = response.data.searchCategoryInfoA077BySomeone[0];

		const updateResponse = await gql(
			MUTATIONS.UPDATE_PRODUCT_CATEGORY,
			{
				productId: this.itemInfo.items[index].id,
				categoryA077: categories.code,
				categoryB378: categories.categoryInfoB378.code,
				categoryA112: categories.categoryInfoA112.code,
				categoryA113: categories.categoryInfoA113.code,
				categoryA006: categories.categoryInfoA006.code,
				categoryA001: categories.categoryInfoA001.code,
				categoryA027: categories.categoryInfoA027.code,
				categoryB719: categories.categoryInfoB719.code,
				categoryA524: categories.categoryInfoA524.code,
				categoryA525: categories.categoryInfoA525.code,
				categoryB956: categories.categoryInfoB956.code,
			},
			false,
		);

		if (updateResponse.errors) {
			alert(updateResponse.errors[0].message);
			exit();

			return;
		}

		const tagInfo = this.tagDict.find((w: any) => w.code === value.code).tagJson;
		const parsedSillInfo = JSON.parse(updateResponse.data.updateProductCategory2);

		runInAction(
			() =>
				(this.itemInfo.items[index] = {
					...this.itemInfo.items[index],

					tagInfo,

					categoryInfoA077: {
						code: categories.code,
						name: categories.name,

						sillInfoA077: parsedSillInfo[0][`sillInfoA077`][0],
						activeSillDataA077: parsedSillInfo[0][`sillInfoA077`],
					},

					categoryInfoB378: {
						code: categories.categoryInfoB378.code,
						name: categories.categoryInfoB378.name,

						sillInfoB378: parsedSillInfo[0][`sillInfoB378`][0],
						activeSillDataB378: parsedSillInfo[0][`sillInfoB378`],
					},

					categoryInfoA112: {
						code: categories.categoryInfoA112.code,
						name: categories.categoryInfoA112.name,

						sillInfoA112: parsedSillInfo[0][`sillInfoA112`][0],
						activeSillDataA112: parsedSillInfo[0][`sillInfoA112`],
					},

					categoryInfoA113: {
						code: categories.categoryInfoA113.code,
						name: categories.categoryInfoA113.name,

						sillInfoA113: parsedSillInfo[0][`sillInfoA113`][0],
						activeSillDataA113: parsedSillInfo[0][`sillInfoA113`],
					},

					categoryInfoA006: {
						code: categories.categoryInfoA006.code,
						name: categories.categoryInfoA006.name,

						sillInfoA006: parsedSillInfo[0][`sillInfoA006`][0],
						activeSillDataA006: parsedSillInfo[0][`sillInfoA006`],
					},

					categoryInfoA001: {
						code: categories.categoryInfoA001.code,
						name: categories.categoryInfoA001.name,

						sillInfoA001: parsedSillInfo[0][`sillInfoA001`][0],
						activeSillDataA001: parsedSillInfo[0][`sillInfoA001`],
					},

					categoryInfoA027: {
						code: categories.categoryInfoA027.code,
						name: categories.categoryInfoA027.name,

						sillInfoA027: parsedSillInfo[0][`sillInfoA027`][0],
						activeSillDataA027: parsedSillInfo[0][`sillInfoA027`],
					},

					categoryInfoB719: {
						code: categories.categoryInfoB719.code,
						name: categories.categoryInfoB719.name,

						sillInfoB719: parsedSillInfo[0][`sillInfoB719`][0],
						activeSillDataB719: parsedSillInfo[0][`sillInfoB719`],
					},

					categoryInfoA524: {
						code: categories.categoryInfoA524.code,
						name: categories.categoryInfoA524.name,

						sillInfoA524: parsedSillInfo[0][`sillInfoA524`][0],
						activeSillDataA524: parsedSillInfo[0][`sillInfoA524`],
					},

					categoryInfoA525: {
						code: categories.categoryInfoA525.code,
						name: categories.categoryInfoA525.name,

						sillInfoA525: parsedSillInfo[0][`sillInfoA525`][0],
						activeSillDataA525: parsedSillInfo[0][`sillInfoA525`],
					},

					categoryInfoB956: {
						code: categories.categoryInfoB956.code,
						name: categories.categoryInfoB956.name,

						sillInfoB956: parsedSillInfo[0][`sillInfoB956`][0],
						activeSillDataB956: parsedSillInfo[0][`sillInfoB956`],
					},
				}),
		);

		floatingToast('카테고리가 저장되었습니다.', 'success');
		// await this.updateProdutSillsAuto('AUTO', index);

		runInAction(() => exit());
	};

	/** 카테고리 자동매칭 일괄설정 */
	updateManyCategoryAuto = async (value: any) => {
		const response = await gql(QUERIES.SEARCH_CATEGORY_INFO_A077_BY_CODE, { code: value.code }, false);

		if (response.errors) return;

		const categories = response.data.searchCategoryInfoA077BySomeone[0];

		runInAction(
			() =>
				(this.manyCategoryInfo = {
					categoryInfoA077: {
						code: categories.code,
						name: categories.name,
					},

					categoryInfoB378: categories.categoryInfoB378,
					categoryInfoA112: categories.categoryInfoA112,
					categoryInfoA113: categories.categoryInfoA113,
					categoryInfoA006: categories.categoryInfoA006,
					categoryInfoA001: categories.categoryInfoA001,
					categoryInfoA027: categories.categoryInfoA027,
					categoryInfoB719: categories.categoryInfoB719,
					categoryInfoA524: categories.categoryInfoA524,
					categoryInfoA525: categories.categoryInfoA525,
					categoryInfoB956: categories.categoryInfoB956,
				}),
		);
	};

	/** 임시 상태 */
	setPageTemp = (value: number) => (this.pageTemp = value);

	/** 한 페이지에 표시하는 상품 수 */
	setPageSize = async (value: number) => {
		let auth = await getLocalStorage<AppInfo>('appInfo');

		auth.pageSize = value;

		await setLocalStorage({ appInfo: auth });

		runInAction(() => (this.pageSize = value));
	};

	/** 태그사전 정보 */
	getTagDict = async () => {
		const tagResp = await fetch('/resources/dictionary.json');
		const tagJson = await tagResp.json();

		runInAction(() => (this.tagDict = tagJson));
	};

	/**  */

	/** 상품 정보 */
	getProduct = async (commonStore: common, p: number) => {
		console.time('상품 정보 로드시간');
		this.itemInfo.loading = true;
		const oldItems = this.itemInfo.items;

		const response1 = await gql(QUERIES.SELECT_MY_PRODUCT_COUNT_BY_USER, { where: this.stagedWhere }, false);

		if (response1.errors) return alert(response1.errors[0].message);

		runInAction(() => {
			this.itemInfo.items = [];
			this.page = p;
			this.count = response1.data.selectMyProductsCountByUser;
			const pagesOffset = Math.ceil(this.count / this.pageSize);
			this.pages = pagesOffset;
		});

		let s = this.pageSize;

		if (s > this.count) s = this.count;

		const skipOffset = (p - 1) * s;

		let result: any = [];

		if (this.gridView) {
			const response2 = await gql(
				QUERIES.SELECT_MY_SIMPLE_PRODUCT_BY_USER,
				{
					where: this.stagedWhere,
					orderBy: { createdAt: 'desc' },
					skip: skipOffset,
					take: s,
				},
				false,
			);

			if (response2.errors) return alert(response2.errors[0].message);

			result = await Promise.all(
				response2.data.selectMyProductByUser.map(async (v: any) => {
					v.imageThumbnail = v.imageThumbnail.map((w: any) =>
						/^https?/.test(w) ? w : `${process.env.SELLFORYOU_MINIO_HTTPS}/${w}`,
					);

					const thumbResp = await fetch(v.imageThumbnail[0]);
					const thumbBlob = await thumbResp.blob();
					const thumbData = await readFileDataURL(thumbBlob);
					const checked = oldItems.find((w: any) => w.id === v.id)?.checked ?? false;

					return {
						...v,
						thumbData,
						checked,
						edited: {
							summary: 0,
							baseInfo: 0,
							attribute: 0,
							option: 0,
							price: 0,
							thumbnailImages: 0,
							optionImages: 0,
							descriptions: 0,
						},
					};
				}),
			);
		} else {
			const response2 = await gql(
				QUERIES.SELECT_MY_PRODUCT_BY_USER,
				{
					where: this.stagedWhere,
					orderBy: { createdAt: 'desc' },
					skip: skipOffset,
					take: s,
				},
				false,
			);

			if (response2.errors) return alert(response2.errors[0].message);

			result = await Promise.all(
				response2.data.selectMyProductByUser.map(async (v: Item) => {
					v.attribute = v.attribute ? JSON.parse(v.attribute) : [];

					v.imageThumbnail = v.imageThumbnail.map((w) =>
						/^https?/.test(w) ? w : `${process.env.SELLFORYOU_MINIO_HTTPS}/${w}`,
					);

					if (v.activeTaobaoProduct.videoUrl)
						v.activeTaobaoProduct.videoUrl = /^https?/.test(v.activeTaobaoProduct.videoUrl)
							? v.activeTaobaoProduct.videoUrl
							: 'https:' + v.activeTaobaoProduct.videoUrl;

					v.productOptionName.map((w) =>
						w.productOptionValue.map((x) => {
							if (x.image)
								x.image = /^https?/.test(x.image) ? x.image : `${process.env.SELLFORYOU_MINIO_HTTPS}/${x.image}`;
						}),
					);

					const thumbResp = await fetch(v.imageThumbnail[0]);
					const thumbBlob = await thumbResp.blob();
					const thumbData = await readFileDataURL(thumbBlob);

					let descHtml: Document | null = null;

					if (v.description.includes('description.html')) {
						let descResp = await fetch(
							`${process.env.SELLFORYOU_MINIO_HTTPS}/${v.description}?${new Date().getTime()}`,
						);
						let descText = await descResp.text();

						descHtml = new DOMParser().parseFromString(descText, 'text/html');

						v.description = descText ?? v.description;
					} else descHtml = new DOMParser().parseFromString(v.description, 'text/html');

					if (descHtml) {
						v.descriptionImages = [];

						const imageList = descHtml.querySelectorAll('img');

						for (let i in imageList) {
							try {
								if (imageList[i].src) {
									if (imageList[i].src.includes('.gif')) imageList[i].parentNode?.removeChild(imageList[i]);
									else {
										imageList[i].src = imageList[i].src;
										v.descriptionImages.push(imageList[i].src);
									}
								}
							} catch (error) {
								continue;
							}
						}
					}

					if (!commonStore.user.userInfo?.sillFromCategory)
						return confirm('일시적인 상품조회 오류, 새로고침해주세요.') ? window.location.reload() : null;

					if (!v.categoryInfoA077)
						v.categoryInfoA077 = {
							code: null,
							name: '카테고리를 선택해주세요.',
						};
					else {
						if (!v.sillCodeA077)
							v.sillCodeA077 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoA077.sillInfoA077.code
									: v.categoryInfoA077.activeSillDataA077.find((w) => w.code === 'ETC').code;

						if (!v.sillDataA077)
							v.sillDataA077 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoA077.sillInfoA077.data
									: v.categoryInfoA077.activeSillDataA077.find((w) => w.code === 'ETC').data;
					}

					if (!v.categoryInfoB378)
						v.categoryInfoB378 = {
							code: null,
							name: '카테고리를 선택해주세요.',
						};
					else {
						if (!v.sillCodeB378)
							v.sillCodeB378 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoB378.sillInfoB378.code
									: v.categoryInfoB378.activeSillDataB378.find((w) => w.code === '기타 재화').code;
						if (!v.sillDataB378)
							v.sillDataB378 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoB378.sillInfoB378.data
									: v.categoryInfoB378.activeSillDataB378.find((w) => w.code === '기타 재화').data;
					}

					if (!v.categoryInfoA112)
						v.categoryInfoA112 = {
							code: null,
							name: '카테고리를 선택해주세요.',
						};
					else {
						if (!v.sillCodeA112)
							v.sillCodeA112 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoA112.sillInfoA112.code
									: v.categoryInfoA112.activeSillDataA112.find((w) => w.code === '891045').code;
						if (!v.sillDataA112)
							v.sillDataA112 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoA112.sillInfoA112.data
									: v.categoryInfoA112.activeSillDataA112.find((w) => w.code === '891045').data;
					}

					if (!v.categoryInfoA113)
						v.categoryInfoA113 = {
							code: null,
							name: '카테고리를 선택해주세요.',
						};
					else {
						if (!v.sillCodeA113)
							v.sillCodeA113 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoA113.sillInfoA113.code
									: v.categoryInfoA113.activeSillDataA113.find((w) => w.code === '891045').code;
						if (!v.sillDataA113)
							v.sillDataA113 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoA113.sillInfoA113.data
									: v.categoryInfoA113.activeSillDataA113.find((w) => w.code === '891045').data;
					}

					if (!v.categoryInfoA006)
						v.categoryInfoA006 = {
							code: null,
							name: '카테고리를 선택해주세요.',
						};
					else {
						if (!v.sillCodeA006)
							v.sillCodeA006 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoA006.sillInfoA006.code
									: v.categoryInfoA006.activeSillDataA006.find((w) => w.code === '35').code;
						if (!v.sillDataA006)
							v.sillDataA006 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoA006.sillInfoA006.data
									: v.categoryInfoA006.activeSillDataA006.find((w) => w.code === '35').data;
					}

					if (!v.categoryInfoA001)
						v.categoryInfoA001 = {
							code: null,
							name: '카테고리를 선택해주세요.',
						};
					else {
						if (!v.sillCodeA001)
							v.sillCodeA001 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoA001.sillInfoA001.code
									: v.categoryInfoA001.activeSillDataA001.find((w) => w.code === '35').code;
						if (!v.sillDataA001)
							v.sillDataA001 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoA001.sillInfoA001.data
									: v.categoryInfoA001.activeSillDataA001.find((w) => w.code === '35').data;
					}

					if (!v.categoryInfoA027)
						v.categoryInfoA027 = {
							code: null,
							name: '카테고리를 선택해주세요.',
						};
					else {
						if (!v.sillCodeA027)
							v.sillCodeA027 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoA027.sillInfoA027.code
									: v.categoryInfoA027.activeSillDataA027.find((w) => w.code === '38').code;
						if (!v.sillDataA027)
							v.sillDataA027 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoA027.sillInfoA027.data
									: v.categoryInfoA027.activeSillDataA027.find((w) => w.code === '38').data;
					}

					if (!v.categoryInfoB719)
						v.categoryInfoB719 = {
							code: null,
							name: '카테고리를 선택해주세요.',
						};
					else {
						if (!v.sillCodeB719)
							v.sillCodeB719 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoB719.sillInfoB719.code
									: v.categoryInfoB719.activeSillDataB719.find((w) => w.code === '38').code;
						if (!v.sillDataB719)
							v.sillDataB719 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoB719.sillInfoB719.data
									: v.categoryInfoB719.activeSillDataB719.find((w) => w.code === '38').data;
					}

					if (!v.categoryInfoA524)
						v.categoryInfoA524 = {
							code: null,
							name: '카테고리를 선택해주세요.',
						};
					else {
						if (!v.sillCodeA524)
							v.sillCodeA524 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoA524.sillInfoA524.code
									: v.categoryInfoA524.activeSillDataA524.find((w) => w.code === '38').code;
						if (!v.sillDataA524)
							v.sillDataA524 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoA524.sillInfoA524.data
									: v.categoryInfoA524.activeSillDataA524.find((w) => w.code === '38').data;
					}

					if (!v.categoryInfoA525)
						v.categoryInfoA525 = {
							code: null,
							name: '카테고리를 선택해주세요.',
						};
					else {
						if (!v.sillCodeA525)
							v.sillCodeA525 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoA525.sillInfoA525.code
									: v.categoryInfoA525.activeSillDataA525.find((w) => w.code === '38').code;
						if (!v.sillDataA525)
							v.sillDataA525 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoA525.sillInfoA525.data
									: v.categoryInfoA525.activeSillDataA525.find((w) => w.code === '38').data;
					}

					if (!v.categoryInfoB956)
						v.categoryInfoB956 = {
							code: null,
							name: '카테고리를 선택해주세요.',
						};
					else {
						if (!v.sillCodeB956)
							v.sillCodeB956 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoB956.sillInfoB956.code
									: v.categoryInfoB956.activeSillDataB956.find((w) => w.code === '기타 재화').code;
						if (!v.sillDataB956)
							v.sillDataB956 =
								commonStore.user.userInfo.sillFromCategory === 'Y'
									? v.categoryInfoB956.sillInfoB956.data
									: v.categoryInfoB956.activeSillDataB956.find((w) => w.code === '기타 재화').data;
					}

					const tagInfo = this.tagDict.find((w: any) => w.code === v.categoryInfoA077?.code)?.tagJson;
					const checked = oldItems.find((w) => w.id === v.id)?.checked ?? false;

					return {
						...v,
						tagInfo,
						thumbData,
						checked,
						collapse: false,
						delete: false,
						error: false,
						translate: false,
						optionCollapse: false,
						tabs: 0,
						thumbnailImageError: false,
						optionPriceError: false,
						optionImageError: false,
						descriptionImageError: false,
						edited: {
							summary: 0,
							baseInfo: 0,
							attribute: 0,
							option: 0,
							price: 0,
							thumbnailImages: 0,
							optionImages: 0,
							descriptions: 0,
						},
						immSearchTagsTemp: v.immSearchTags,
					};
				}),
			);
		}
		console.timeEnd('상품 정보 로드시간');

		runInAction(() => {
			this.itemInfo.items = result;
			this.itemInfo.loading = false;
			this.itemInfo.checkedAll = false;
		});
	};

	/** 상품 삭제 */
	deleteProduct = async (commonStore: common, productId: number) => {
		let productIds: number[] = [];

		if (productId === -1) {
			this.itemInfo.items.filter((v) => v.checked).map((v) => productIds.push(v.id));

			if (productIds.length < 1) return alert('상품이 선택되지 않았습니다.');
			if (!confirm(`선택한 상품 ${productIds.length}개를 삭제하시겠습니까?\n삭제된 상품은 다시 복구하실 수 없습니다.`))
				return;

			this.itemInfo.items.filter((v) => v.checked).map((v) => (v.delete = true));
		} else {
			productIds.push(productId);

			if (!confirm(`상품을 삭제하시겠습니까?\n삭제된 상품은 다시 복구하실 수 없습니다.`)) return;

			this.itemInfo.items.find((v) => v.id === productId)!.delete = true;
		}

		await gql(MUTATIONS.DELETE_PRODUCT_BY_USER, { productId: productIds }, false);

		this.getProduct(commonStore, this.page);
	};

	/** 상품 강제 삭제 ( confirm메시지만 다를뿐 코드는 같음 )*/
	forceDeleteProduct = async (commonStore: common, productId: number) => {
		let productIds: number[] = [];

		if (productId === -1) {
			this.itemInfo.items.filter((v) => v.checked).map((v) => productIds.push(v.id));

			if (productIds.length < 1) return alert('상품이 선택되지 않았습니다.');
			if (
				!confirm(
					`선택한 상품 ${productIds.length}개를 삭제하시겠습니까?\n\n• 등록된 상품이 포함되어있는 경우 오픈마켓에 그대로 존재하게됩니다.\n• 삭제된 상품은 다시 복구하실 수 없습니다.`,
				)
			)
				return;

			this.itemInfo.items.filter((v) => v.checked).map((v) => (v.delete = true));
		} else {
			productIds.push(productId);

			if (
				!confirm(
					`상품을 삭제하시겠습니까?\n\n• 등록된 상품의 경우 오픈마켓에 그대로 존재하게됩니다.\n• 삭제된 상품은 다시 복구하실 수 없습니다.`,
				)
			)
				return;

			this.itemInfo.items.find((v) => v.id === productId)!.delete = true;
		}

		await gql(MUTATIONS.DELETE_PRODUCT_BY_USER, { productId: productIds }, false);

		this.getProduct(commonStore, this.page);
	};
	/** 상품명 설정 */
	setProductName = (data: any, index: number) => {
		this.itemInfo.items[index].name = data;
		this.itemInfo.items[index].edited.summary = 1;
	};

	/** 상품명 업데이트 */
	updateProductName = async (index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.summary = 0);

		if (!this.itemInfo.items[index].edited.summary) return;

		this.itemInfo.items[index].edited.summary = 2;

		const response = await gql(
			MUTATIONS.UPDATE_PRODUCT_NAME_BY_USER,
			{
				productId: this.itemInfo.items[index].id,
				name: this.itemInfo.items[index].name,
			},
			false,
		);

		if (response.errors) {
			alert(response.errors[0].message);

			exit();

			return;
		}

		floatingToast('상품명이 저장되었습니다.', 'success');

		runInAction(() => exit());
	};

	/** 검색어 태그 설정(쿠팡) */
	setProductSearchTag = (data: any, index: number) => {
		this.itemInfo.items[index].searchTags = data;
		this.itemInfo.items[index].edited.baseInfo = 1;
	};

	/** 검색어 태그 업데이트(쿠팡) */
	updateProductSearchTag = async (data: any, index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.baseInfo = 0);

		if (!this.itemInfo.items[index].edited.baseInfo) return;

		this.itemInfo.items[index].edited.baseInfo = 2;

		const response = await gql(MUTATIONS.UPDATE_PRODUCT_TAG_BY_USER, {
			productId: this.itemInfo.items[index].id,
			searchTags: data,
		});

		if (response.errors) {
			alert(response.errors[0].message);

			exit();

			return;
		}

		floatingToast('검색어태그(쿠팡)가 저장되었습니다.', 'success');

		runInAction(() => exit());
	};

	/** 검색어 태그 추가(스마트스토어) */
	addProductImmSearchTag = async (data: any, index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.baseInfo = 0);

		this.itemInfo.items[index].edited.baseInfo = 2;

		let tagList = this.itemInfo.items[index].immSearchTags?.split(',') ?? [];

		tagList = tagList.filter((v: any) => v);

		if (tagList.find((v: any) => v === data)) return exit();

		if (tagList.length > 9) {
			floatingToast('검색어는 최대 10개까지만 입력하실 수 있습니다.', 'information');

			exit();

			return;
		}

		tagList.push(data);

		let output = '';

		tagList.map((v: any) => (output += `${v},`));

		output = output.slice(0, output.length - 1);

		this.itemInfo.items[index].immSearchTags = output;

		const response = await gql(MUTATIONS.UPDATE_PRODUCT_TAG_BY_USER, {
			productId: this.itemInfo.items[index].id,
			immSearchTags: output,
		});

		if (response.errors) {
			alert(response.errors[0].message);

			exit();

			return;
		}

		floatingToast('검색어태그(스마트스토어)가 저장되었습니다.', 'success');

		runInAction(() => exit());
	};

	/** 검색어 태그 설정(스마트스토어) */
	setProductImmSearchTag = (data: any, index: number) => {
		this.itemInfo.items[index].immSearchTags = data;
		this.itemInfo.items[index].edited.baseInfo = 1;
	};

	/** 검색어 태그 사용불가 단어 조회(스마트스토어) */
	verifyProductImmSearchTag = async (data: any, index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.baseInfo = 0);

		if (!this.itemInfo.items[index].edited.baseInfo) return;

		this.itemInfo.items[index].edited.baseInfo = 2;

		let tagList = this.itemInfo.items[index].immSearchTags?.split(',') ?? [];

		tagList = tagList.filter((v: any, i: number) => v && i < 10);

		let output = '';

		let addList = data.replaceAll(' ', '').split(',') ?? [];

		let userResp = await fetch('https://sell.smartstore.naver.com/api/products?_action=create');
		let userJson = await userResp.json();

		if (userJson.error) {
			this.itemInfo.items[index].immSearchTags = this.itemInfo.items[index].immSearchTagsTemp;

			floatingToast('스마트스토어 로그인 후 이용해주세요.', 'warning');

			exit();

			return;
		}

		let tagDataSet = await Promise.all(
			addList
				.filter((v: any) => v)
				.map(async (v: any) => {
					const tagResp = await fetch(
						`https://sell.smartstore.naver.com/api/product/shared/is-restrict-tag?_action=isRestrictTag&tag=${encodeURI(
							v,
						)}`,
					);
					const tagJson = await tagResp.json();

					return {
						tag: v,
						restricted: tagJson.restricted,
					};
				}),
		);

		await Promise.all(
			tagDataSet.map((v: any) => {
				// console.log('test', v.restricted);

				if (tagList.length > 9) return floatingToast('검색어는 최대 10개까지만 입력하실 수 있습니다.', 'information');
				if (tagList.find((w: any) => w === v.tag))
					//자꾸 여기서 걸리네 이유를 모르겠음.. 추가적으로 조건들에 걸리는데도 밑에 저기 너 왜 여기까지옴? 콘솔안찍히는데 이상하게 tagList.push(v.tag)는 동작하는거처럼 들어가있음
					return;
				if (v.restricted) return floatingToast(`사용할 수 없는 검색어입니다. [${v.tag}]`, 'failed');

				tagList.push(v.tag);
			}),
		);

		output = tagList.join(',');

		const response = await gql(MUTATIONS.UPDATE_PRODUCT_TAG_BY_USER, {
			productId: this.itemInfo.items[index].id,
			immSearchTags: output,
		});

		if (response.errors) {
			this.itemInfo.items[index].immSearchTags = this.itemInfo.items[index].immSearchTagsTemp;

			alert(response.errors[0].message);

			exit();

			return;
		}

		this.itemInfo.items[index].immSearchTags = output;
		this.itemInfo.items[index].immSearchTagsTemp = this.itemInfo.items[index].immSearchTags;

		floatingToast('검색어태그(스마트스토어)가 저장되었습니다.', 'success');

		runInAction(() => exit());
	};

	/** 검색어 태그 삭제(스마트스토어) */
	removeProductImmSearchTag = async (data: any, index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.baseInfo = 0);

		this.itemInfo.items[index].edited.baseInfo = 2;

		let tagList = this.itemInfo.items[index].immSearchTags?.split(',') ?? [];

		let output = '';

		tagList = tagList.filter((v: any) => v && v !== data);
		tagList.map((v: any) => (output += `${v},`));

		output = output.slice(0, output.length - 1);

		this.itemInfo.items[index].immSearchTags = output;

		const response = await gql(MUTATIONS.UPDATE_PRODUCT_TAG_BY_USER, {
			productId: this.itemInfo.items[index].id,
			immSearchTags: output,
		});

		if (response.errors) {
			alert(response.errors[0].message);

			exit();

			return;
		}

		floatingToast('검색어태그(스마트스토어)가 저장되었습니다.', 'success');

		runInAction(() => exit());
	};

	/** 썸네일이미지 추가 */
	addProductThumbnailImage = async (blob: any, base64: any, index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.thumbnailImages = 0);

		this.itemInfo.items[index].edited.thumbnailImages = 2;

		const temp: any = {
			productId: this.itemInfo.items[index].id,
			thumbnails: [],
		};

		const thumbnails = this.itemInfo.items[index].imageThumbnail.map((v: any) => {
			temp.thumbnails.push({
				defaultImage: v,
				uploadImage: null,
			});

			return v;
		});

		temp.thumbnails.push({
			defaultImage: '',
			uploadImage: null,
		});

		let formData: any = new FormData();

		let operations = {
			variables: temp,
			query: MUTATIONS.UPDATE_IMAGE_THUMBNAIL_DATA,
		};

		let map = {
			'1': [`variables.thumbnails.${temp.thumbnails.length - 1}.uploadImage`],
		};

		formData.append('operations', JSON.stringify(operations));
		formData.append('map', JSON.stringify(map));
		formData.append('1', blob, blob.name);

		const response = await gql(null, formData, true);

		if (response.errors) {
			alert(response.errors[0].message);

			exit();

			return;
		}

		runInAction(() => {
			thumbnails.push(response.data.updateImageThumbnailData);

			this.itemInfo.items[index].imageThumbnail = thumbnails;

			floatingToast('썸네일이미지 정보가 추가되었습니다.', 'success');

			exit();
		});
	};

	/** 썸네일이미지 스왑/업데이트 */
	updateProductThumbnailImage = async (src: number, dst: number, index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.thumbnailImages = 0);

		if (src === dst) return;

		this.itemInfo.items[index].edited.thumbnailImages = 2;

		const temp = [...this.itemInfo.items[index].imageThumbnail];

		temp.splice(src, 1);

		if (dst >= 0) temp.splice(dst, 0, this.itemInfo.items[index].imageThumbnail[src]);

		const response = await gql(MUTATIONS.UPDATE_IMAGE_THUMBNAIL_DATA, {
			productId: this.itemInfo.items[index].id,
			thumbnails: temp.map((v: any) => ({
				defaultImage: v,
				uploadImage: null,
			})),
		});

		if (response.errors) {
			alert(response.errors[0].message);

			exit();

			return;
		}

		runInAction(() => {
			this.itemInfo.items[index].imageThumbnail = temp;

			floatingToast('썸네일이미지 정보가 저장되었습니다.', 'success');

			exit();
		});
	};

	/** 상품 판매가 설정 */
	setProductPrice = (price: number, index: number) => {
		this.itemInfo.items[index].price = price;
		this.itemInfo.items[index].edited.price = 1;
	};

	/** 상품 판매가 업데이트 */
	updateProductPrice = async (index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.price = 0);

		if (!this.itemInfo.items[index].edited.price) return;

		this.itemInfo.items[index].edited.price = 2;

		const response = await gql(
			MUTATIONS.UPDATE_PRODUCT_SINGLE_PRICE_BY_USER,
			{
				productId: this.itemInfo.items[index].id,
				price: this.itemInfo.items[index].price,
			},
			false,
		);

		if (response.errors) {
			alert(response.errors[0].message);

			exit();

			return;
		}

		floatingToast('가격정보가 저장되었습니다.', 'success');

		runInAction(() => exit());
	};

	/** 옵션가격 설정 */
	setProductOption = (commonStore: common, data: any, index: number, optionIndex: number, handlePrice: boolean) => {
		let price: any = null;

		if (!handlePrice) {
			let priceInfo: any = {
				cnyRate: this.itemInfo.items[index].cnyRate,
				marginRate: this.itemInfo.items[index].marginRate,
				marginUnitType: this.itemInfo.items[index].marginUnitType,
			};

			if (priceInfo.marginUnitType === 'PERCENT')
				price = (data.priceCny * priceInfo.cnyRate + data.defaultShippingFee) * (1 + priceInfo.marginRate / 100);
			else price = data.priceCny * priceInfo.cnyRate + data.defaultShippingFee + priceInfo.marginRate;

			const wonType = commonStore.user.userInfo!.calculateWonType as any;

			price = Math.round(price / wonType) * wonType;
		} else price = data.price;

		this.itemInfo.items[index].productOption[optionIndex] = { ...data, price };
		this.itemInfo.items[index].edited.option = 1;
	};

	/** 옵션가격 일괄설정 */
	updateManyProductOption = async (index: number, optionIds: any) => {
		const exit = () => (this.itemInfo.items[index].edited.option = 0);

		if (!this.itemInfo.items[index].edited.option) return;

		this.itemInfo.items[index].edited.option = 2;

		let options: any = [];

		let priceList = this.itemInfo.items[index].productOption
			.filter((v: any) => {
				let found = optionIds.find((w: any) => w === v.id);

				if (found)
					options.push({
						productOptionId: v.id,
						defaultShippingFee: v.defaultShippingFee,
						price: v.price,
						stock: v.stock,
						isActive: v.isActive,
					});

				return v.isActive;
			})
			.map((v: any) => v.price);

		const response = await gql(MUTATIONS.UPDATE_MANY_PRODUCT_OPTION, { data: options }, false);

		if (response.errors) {
			alert(response.errors[0].message);

			exit();

			return;
		}

		if (priceList.length > 0) {
			let priceLowest = Math.min(...priceList);

			if (this.itemInfo.items[index].price !== priceLowest) {
				const response = await gql(
					MUTATIONS.UPDATE_PRODUCT_SINGLE_PRICE_BY_USER,
					{
						productId: this.itemInfo.items[index].id,
						price: priceLowest,
					},
					false,
				);

				if (response.errors) {
					alert(response.errors[0].message);

					exit();

					return;
				}

				this.itemInfo.items[index].price = priceLowest;
			}
		}

		floatingToast('옵션세부정보가 저장되었습니다.', 'success');

		runInAction(() => exit());
	};

	/** 옵션명 변경 */
	replaceProductOption = async (commonStore: common, index: number) => {
		const taobaoData = JSON.parse(this.itemInfo.items[index].activeTaobaoProduct.originalData);

		let options: any = [];
		let optionNames: any = [];

		this.itemInfo.items[index].productOptionName.map((w: any) => {
			if (!w.isActive) return [];

			let optionValues: any = [];

			w.productOptionValue.map((x: any) => {
				if (!x.isActive) return;

				optionValues.push({
					name: w,
					value: x,
				});
			});

			if (optionValues.length > 0) optionNames.push(optionValues);
		});

		if (optionNames.length > 0) {
			const wonType = commonStore.user.userInfo!.calculateWonType;

			let combination = cartesian(...optionNames);

			combination.map((w: any, nameIndex: number) => {
				let option: any = {
					productId: this.itemInfo.items[index].id,
					optionValue1Id: '',
					optionValue2Id: null,
					optionValue3Id: null,
					optionValue4Id: null,
					optionValue5Id: null,
					isActive: true,
					taobaoSkuId: nameIndex.toString(),
					priceCny: 0,
					price: 0,
					stock: 0,
					optionString: '',
					name: '',
					defaultShippingFee: this.itemInfo.items[index].localShippingFee,
				};

				let optionInfo = taobaoData.skus.sku;

				w.map((x: any, valueIndex: number) => {
					optionInfo = optionInfo.filter((y: any) => {
						let skus = y.properties.split(';');
						// 타오바오 옵션 키값이 3개인 경우 데이터를 조작 (가운데 값 삭제)
						if (skus?.[0].split(':').length === 3) {
							const first = skus[0].split(':').splice(0, 1).at(0);
							const second = skus[0].split(':').splice(2, 1).at(0);
							skus[0] = `${first}:${second}`;
						}
						// 키가 3개 있는 타오바오 옵션의 경우
						// const isThirdKeyProduct = skus[0]?.split(':').length === 3;
						const matched = skus.find((z: any) => z === `${x.name.taobaoPid}:${x.value.taobaoVid}`);

						if (!matched) return false;

						return true;
					});

					option['name'] += `${x.name.name}:${x.value.name}, `;
					option[`optionValue${valueIndex + 1}Id`] = x.value.id;
					option['optionString'] += `${x.value.number.toString().padStart(2, '0')}_`;
				});

				if (optionInfo.length > 0) {
					let price: any = null;
					let priceInfo: any = {
						priceCny: parseFloat(optionInfo[0].price),
						cnyRate: this.itemInfo.items[index].cnyRate,
						marginRate: this.itemInfo.items[index].marginRate,
						marginUnitType: this.itemInfo.items[index].marginUnitType,
						localShippingFee: this.itemInfo.items[index].localShippingFee,
					};

					if (priceInfo.marginUnitType === 'PERCENT')
						price =
							(priceInfo.priceCny * priceInfo.cnyRate + priceInfo.localShippingFee) * (1 + priceInfo.marginRate / 100);
					else price = priceInfo.priceCny * priceInfo.cnyRate + priceInfo.localShippingFee + priceInfo.marginRate;

					price = Math.round(price / Number(wonType)) * Number(wonType);

					option['priceCny'] = priceInfo.priceCny;
					option['price'] = price;
					option['stock'] = parseInt(optionInfo[0].quantity);
					option['optionString'] = option['optionString'].slice(0, option['optionString'].length - 1);
					option['name'] = option['name'].slice(0, option['name'].length - 2);

					options.push(option);
				}
			});
		}

		const response = await gql(
			MUTATIONS.UPDATE_PRODUCT_OPTION,
			{
				id: this.itemInfo.items[index].id,
				productOption: options,
			},
			false,
		);

		if (response.errors) return alert(response.errors[0].message);

		runInAction(() => {
			this.itemInfo.items[index].productOption = options.map((v: any, index: number) => ({
				...v,
				id: response.data.updateProductOption[index],
			}));

			const priceList = this.itemInfo.items[index].productOption.map((v: any) => v.price);

			if (priceList.length > 0) {
				const priceLowest = Math.min(...priceList);

				this.itemInfo.items[index].price = priceLowest;
				this.itemInfo.items[index].edited.price = 1;

				this.updateProductPrice(index);
			}
		});
	};

	/** 옵션가격 활성화 ON/OFF */
	toggleProductOption = (value: boolean, index: number) => {
		const optionIds = this.itemInfo.items[index].productOption.map((v: any) => {
			v.isActive = value;

			return v.id;
		});

		this.itemInfo.items[index].edited.option = 1;

		this.updateManyProductOption(index, optionIds);
	};

	/** 옵션가격 계산 */
	calcProductOptionPrice = async (offset: number, type: string, index: number, valueIndex: any, activeOnly: any) => {
		let options: any = null;

		runInAction(() => {
			options = this.itemInfo.items[index].productOption.map((v: any) => {
				let matched = true;

				if (valueIndex)
					if (
						valueIndex !== v.optionValue1Id &&
						valueIndex !== v.optionValue2Id &&
						valueIndex !== v.optionValue3Id &&
						valueIndex !== v.optionValue4Id &&
						valueIndex !== v.optionValue5Id
					)
						matched = false;

				if (matched) {
					switch (type) {
						case 'addPrice': {
							if (activeOnly && !v.isActive) break;

							v.price += offset;

							break;
						}

						case 'subPrice': {
							if (activeOnly && !v.isActive) break;

							v.price -= offset;

							break;
						}

						case 'setPrice': {
							if (activeOnly && !v.isActive) break;

							v.price = offset;

							break;
						}

						case 'setStock': {
							if (activeOnly && !v.isActive) break;

							v.stock = offset;

							break;
						}

						case 'setActive': {
							let active = Math.floor((v.price / this.itemInfo.items[index].price - 1) * 100);

							if (active > offset) v.isActive = false;
							else v.isActive = true;

							break;
						}

						default:
							break;
					}
				}

				return {
					productId: this.itemInfo.items[index].id,
					optionValue1Id: v.optionValue1Id,
					optionValue2Id: v.optionValue2Id,
					optionValue3Id: v.optionValue3Id,
					optionValue4Id: v.optionValue4Id,
					optionValue5Id: v.optionValue5Id,
					isActive: v.isActive,
					taobaoSkuId: v.taobaoSkuId,
					priceCny: v.priceCny,
					price: v.price,
					stock: v.stock,
					optionString: v.optionString,
					name: v.name,
					defaultShippingFee: v.defaultShippingFee,
				};
			});

			if (!options) return;

			const priceList = this.itemInfo.items[index].productOption
				.filter((v: any) => v.isActive)
				.map((v: any) => v.price);
			const priceLowest = Math.min(...priceList);

			this.itemInfo.items[index].price = priceLowest;
			this.itemInfo.items[index].edited.price = 1;
		});

		await this.updateProductPrice(index);

		const response = await gql(
			MUTATIONS.UPDATE_PRODUCT_OPTION,
			{
				id: this.itemInfo.items[index].id,
				productOption: options,
			},
			false,
		);

		if (response.errors) return alert(response.errors[0].message);

		runInAction(
			() =>
				(this.itemInfo.items[index].productOption = options.map((v: any, index: number) => ({
					...v,

					id: response.data.updateProductOption[index],
				}))),
		);

		floatingToast('옵션세부정보가 저장되었습니다.', 'success');
	};

	/** 옵션가 설정 */
	setProductOptionPrice = (data: Partial<ManyPriceInfo>, index: number) => {
		Object.assign(this.itemInfo.items[index], data);

		this.itemInfo.items[index].edited.price = 1;
	};

	/** 옵션가 업데이트 */
	updateProductOptionPrice = async (commonStore: common, data: Partial<ManyPriceInfo>, index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.price = 0);

		if (!this.itemInfo.items[index].edited.price) return;

		this.itemInfo.items[index].edited.price = 2;

		let priceInfo: ManyPriceInfo = {
			cnyRate: this.itemInfo.items[index].cnyRate,
			marginRate: this.itemInfo.items[index].marginRate,
			marginUnitType: this.itemInfo.items[index].marginUnitType,
			shippingFee: this.itemInfo.items[index].shippingFee,
			refundShippingFee: this.itemInfo.items[index].refundShippingFee,
			localShippingFee: this.itemInfo.items[index].localShippingFee,
			localShippingCode: this.itemInfo.items[index].localShippingCode,
		};

		Object.assign(priceInfo, data);

		const response1 = await gql(
			MUTATIONS.UPDATE_MANY_PRODUCT_PRICE_BY_USER,
			{
				...priceInfo,
				productIds: [this.itemInfo.items[index].id],
			},
			false,
		);

		if (response1.errors) {
			alert(response1.errors[0].message);

			exit();

			return;
		}

		const originalPrice = this.itemInfo.items[index].activeTaobaoProduct.price;

		if (priceInfo.marginUnitType === 'PERCENT')
			priceInfo.price =
				(originalPrice * priceInfo.cnyRate + priceInfo.localShippingFee) * (1 + priceInfo.marginRate / 100);
		else priceInfo.price = originalPrice * priceInfo.cnyRate + priceInfo.localShippingFee + priceInfo.marginRate;

		const wonType = commonStore.user.userInfo!.calculateWonType;

		priceInfo.price = Math.round(priceInfo.price / Number(wonType)) * Number(wonType);

		let options: any = null;

		runInAction(() => {
			options = this.itemInfo.items[index].productOption.map((v: any) => {
				let optionPrice: any = null;

				if (priceInfo.marginUnitType === 'PERCENT')
					optionPrice =
						(v.priceCny * priceInfo.cnyRate + priceInfo.localShippingFee) * (1 + priceInfo.marginRate / 100);
				else optionPrice = v.priceCny * priceInfo.cnyRate + priceInfo.localShippingFee + priceInfo.marginRate;

				optionPrice = Math.round(optionPrice / Number(wonType)) * Number(wonType);

				v.price = optionPrice ?? v.price;
				v.defaultShippingFee = priceInfo.localShippingFee;

				return {
					productId: this.itemInfo.items[index].id,
					optionValue1Id: v.optionValue1Id,
					optionValue2Id: v.optionValue2Id,
					optionValue3Id: v.optionValue3Id,
					optionValue4Id: v.optionValue4Id,
					optionValue5Id: v.optionValue5Id,
					isActive: v.isActive,
					taobaoSkuId: v.taobaoSkuId,
					priceCny: v.priceCny,
					price: v.price,
					stock: v.stock,
					optionString: v.optionString,
					name: v.name,
					defaultShippingFee: v.defaultShippingFee,
				};
			});

			const activeOptions = options.filter((v: any) => v.isActive);

			if (activeOptions.length > 0) priceInfo.price = Math.min(...activeOptions.map((v: any) => v.price));
		});

		if (!options) return exit();

		const response2 = await gql(
			MUTATIONS.UPDATE_PRODUCT_OPTION,
			{
				id: this.itemInfo.items[index].id,
				productOption: options,
			},
			false,
		);

		if (response2.errors) {
			alert(response2.errors[0].message);

			exit();

			return;
		}

		runInAction(() => {
			Object.assign(this.itemInfo.items[index], priceInfo);

			this.itemInfo.items[index].productOption = options.map((v: any, index: number) => ({
				...v,
				id: response2.data.updateProductOption[index],
			}));
		});

		floatingToast('가격정보가 저장되었습니다.', 'success');

		runInAction(() => exit());
	};

	/** 옵션이미지 업데이트 */
	updateProductOptionImage = async (data: any, index: number, nameIndex: number, valueIndex: number, base64: any) => {
		const exit = () => (this.itemInfo.items[index].edited.optionImages = 0);

		this.itemInfo.items[index].edited.optionImages = 2;

		if (data.newImage) {
			let formData: any = new FormData();

			let operations = {
				variables: {
					productOptionValueId: data.id,
					isActive: data.isActive,
					image: data.image,
					newImage: null,
				},

				query: MUTATIONS.SET_PRODUCT_OPTION_VALUE_BY_SOMEONE,
			};

			let map = { '1': ['variables.newImage'] };

			formData.append('operations', JSON.stringify(operations));
			formData.append('map', JSON.stringify(map));
			formData.append('1', data.newImage, `${data.newImage.name.split('.')[0]}.${data.newImage.name.split('.')[1]}`);

			const response = await gql(null, formData, true);

			if (response.errors) {
				alert(response.errors[0].message);

				exit();

				return;
			}

			this.itemInfo.items[index].productOptionName[nameIndex].productOptionValue[valueIndex].image =
				response.data.setProductOptionValueBySomeOne;
		} else {
			if (!this.itemInfo.items[index].productOptionName[nameIndex].productOptionValue[valueIndex].image) return exit();

			const response = await gql(
				MUTATIONS.SET_PRODUCT_OPTION_VALUE_BY_SOMEONE,
				{
					productOptionValueId: data.id,
					isActive: data.isActive,
					image: data.image,
				},
				false,
			);

			if (response.errors) {
				alert(response.errors[0].message);

				exit();

				return;
			}

			this.itemInfo.items[index].productOptionName[nameIndex].productOptionValue[valueIndex].image = '';
		}

		floatingToast('옵션이미지 정보가 저장되었습니다.', 'success');

		runInAction(() => exit());
	};

	/** 옵션값 설정 */
	setProductOptionValue = (data: any, index: number, nameIndex: number, valueIndex: any) => {
		if (valueIndex === null) this.itemInfo.items[index].productOptionName[nameIndex].productOptionValue = data;
		else this.itemInfo.items[index].productOptionName[nameIndex].productOptionValue[valueIndex] = data;

		this.itemInfo.items[index].edited.option = 1;
	};

	/** 옵션값 업데이트 */
	updateProductOptionValue = async (commonStore: common, index: number, nameIndex: number, valueIds: any) => {
		const exit = () => (this.itemInfo.items[index].edited.option = 0);

		if (!this.itemInfo.items[index].edited.option) return;

		this.itemInfo.items[index].edited.option = 2;

		let values: any = [];

		this.itemInfo.items[index].productOptionName[nameIndex].productOptionValue.map((v) => {
			valueIds.map((w: any) => v.id === w && values.push(v));
		});

		if (values.length > 1) {
			const response = await gql(
				MUTATIONS.UPDATE_MANY_PRODUCT_OPTION_VALUE,
				{
					data: values.map((v: any) => ({
						productOptionValueId: v.id,
						name: v.name,
					})),
				},
				false,
			);

			if (response.errors) {
				alert(response.errors[0].message);

				exit();

				return;
			}
		} else {
			const response = await gql(
				MUTATIONS.SET_PRODUCT_OPTION_VALUE_BY_SOMEONE,
				{
					productOptionValueId: values[0].id,
					isActive: values[0].isActive,
					name: values[0].name,
				},
				false,
			);

			if (response.errors) {
				alert(response.errors[0].message);

				exit();

				return;
			}
		}

		await this.replaceProductOption(commonStore, index);

		floatingToast('옵션정보가 저장되었습니다.', 'success');

		runInAction(() => exit());
	};

	/** 옵션값 일괄설정 */
	setProductOptionValueAll = (data: any, index: number, nameIndex: number) => {
		this.itemInfo.items[index].productOptionName[nameIndex].productOptionValue.map(
			(v: any) => (v.isActive = data.isActive),
		);

		this.itemInfo.items[index].edited.option = 1;
	};

	/** 옵션값 일괄 업데이트 */
	updateProductOptionValueAll = async (commonStore: common, data: any, index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.option = 0);

		if (!this.itemInfo.items[index].edited.option) return;

		this.itemInfo.items[index].edited.option = 2;

		const response = await gql(
			MUTATIONS.SET_PRODUCT_OPTION_VALUE_BY_SOMEONE,
			{
				productOptionNameId: data.id,
				isActive: data.isActive,
			},
			false,
		);

		if (response.errors) {
			alert(response.errors[0].message);

			exit();

			return;
		}

		await this.replaceProductOption(commonStore, index);

		floatingToast('옵션정보가 저장되었습니다.', 'success');

		runInAction(() => exit());
	};

	/** 옵션명 설정 */
	setProductOptionName = (data: any, index: number, nameIndex: number) => {
		this.itemInfo.items[index].productOptionName[nameIndex] = data;
		this.itemInfo.items[index].edited.option = 1;
	};

	/** 옵션명 업데이트 */
	updateProductOptionName = async (commonStore: common, data: any, index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.option = 0);

		if (!this.itemInfo.items[index].edited.option) return;

		this.itemInfo.items[index].edited.option = 2;

		const response = await gql(
			MUTATIONS.SET_PRODUCT_OPTION_NAME_BY_SOMEONE,
			{
				productOptionNameId: data.id,
				isActive: data.isActive,
				name: data.name,
			},
			false,
		);

		if (response.errors) {
			alert(response.errors[0].message);

			exit();

			return;
		}

		await this.replaceProductOption(commonStore, index);

		floatingToast('옵션정보가 저장되었습니다.', 'success');

		runInAction(() => exit());
	};

	/** 상세페이지 이미지 필터링 */
	filterDescription = (itemIndex: number, imageIndex: number) => {
		const imageList = this.itemInfo.items[itemIndex].descriptionImages.filter((v: any, i: number) => {
			if (i !== imageIndex) return true;

			const descHtml = new DOMParser().parseFromString(this.itemInfo.items[itemIndex].description, 'text/html');
			const descImages = descHtml.querySelectorAll('img');

			for (let j in descImages) {
				if (!descImages[j].src) continue;
				if (descImages[j].src === v) descImages[j].remove();
			}

			this.itemInfo.items[itemIndex].description = descHtml.body.outerHTML;

			return false;
		});

		this.itemInfo.items[itemIndex].descriptionImages = imageList;
		this.itemInfo.items[itemIndex].edited.descriptions = 1;
		this.updateDescription(itemIndex);
	};

	/** 상세페이지 설정 */
	setDescription = (html: any, index: number) => {
		this.itemInfo.items[index].description = html;
		this.itemInfo.items[index].edited.descriptions = 1;
	};

	/** 상세페이지 이미지 스왑/업데이트 */
	switchDescription = (src: number, dst: number, index: number) => {
		if (src === dst) return;

		const temp = [...this.itemInfo.items[index].descriptionImages];

		temp.splice(src, 1);

		if (dst >= 0) temp.splice(dst, 0, this.itemInfo.items[index].descriptionImages[src]);

		const descHtml = new DOMParser().parseFromString(this.itemInfo.items[index].description, 'text/html');
		const descImages = descHtml.querySelectorAll('img');

		temp.map((v: any, i: number) => (descImages[i].src = v));

		this.itemInfo.items[index].description = descHtml.body.outerHTML;
		this.itemInfo.items[index].descriptionImages = temp;
		this.itemInfo.items[index].edited.descriptions = 1;
		this.updateDescription(index);
	};

	/** 상세페이지 업데이트 */
	updateDescription = async (index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.descriptions = 0);

		if (!this.itemInfo.items[index].edited.descriptions) return;

		this.itemInfo.items[index].edited.descriptions = 2;

		const response = await gql(
			MUTATIONS.UPDATE_DESCRIPTION,
			{
				productId: this.itemInfo.items[index].id,
				description: this.itemInfo.items[index].description,
			},
			false,
		);

		if (response.errors) {
			alert(response.errors[0].message);

			exit();

			return;
		}

		floatingToast('상세페이지가 저장되었습니다.', 'success');

		exit();
	};

	/** 상세페이지 이미지 업데이트 */
	updateDescriptionImages = async (index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.descriptions = 0);

		if (!this.itemInfo.items[index].edited.descriptions) return;

		this.itemInfo.items[index].edited.descriptions = 2;

		const response = await gql(
			MUTATIONS.UPDATE_DESCRIPTION,
			{
				productId: this.itemInfo.items[index].id,
				description: this.itemInfo.items[index].description,
			},
			false,
		);

		if (response.errors) {
			alert(response.errors[0].message);

			exit();

			return;
		}

		if (response.data.updateDescription.includes('description.html')) {
			let descResp = await fetch(
				`${process.env.SELLFORYOU_MINIO_HTTPS}/${response.data.updateDescription}?${new Date().getTime()}`,
			);
			let descText = await descResp.text();

			runInAction(
				() => (this.itemInfo.items[index].description = descText ? descText : this.itemInfo.items[index].description),
			);
		}

		const imageList: any = [];
		const descHtml = new DOMParser().parseFromString(this.itemInfo.items[index].description, 'text/html');
		const descImages = descHtml.querySelectorAll('img');

		for (let j in descImages) {
			if (!descImages[j].outerHTML) continue;
			else imageList.push(descImages[j].src);
		}

		floatingToast('상세이미지 목록이 수정되었습니다.', 'success');

		runInAction(() => {
			this.itemInfo.items[index].descriptionImages = imageList;

			exit();
		});
	};

	/** 오픈마켓수수료 설정 */
	setProductFee = (marketCode: SHOPCODE, data: any, index: number) => {
		const {
			AUCTION_1,
			COUPANG,
			G_MARKET_1,
			INTER_PARK,
			LOTTE_ON_GLOBAL,
			LOTTE_ON_NORMAL,
			SMART_STORE,
			STREET11_GLOBAL,
			STREET11_NORMAL,
			TMON,
			WE_MAKE_PRICE,
		} = SHOPCODE;
		switch (marketCode) {
			case SMART_STORE: {
				this.itemInfo.items[index].naverFee = data;
				break;
			}
			case COUPANG: {
				this.itemInfo.items[index].coupangFee = data;
				break;
			}
			case LOTTE_ON_GLOBAL: {
				this.itemInfo.items[index].streetFee = data;
				break;
			}
			case LOTTE_ON_NORMAL: {
				this.itemInfo.items[index].streetNormalFee = data;
				break;
			}
			case AUCTION_1: {
				this.itemInfo.items[index].auctionFee = data;
				break;
			}
			case G_MARKET_1: {
				this.itemInfo.items[index].gmarketFee = data;
				break;
			}
			case INTER_PARK: {
				this.itemInfo.items[index].interparkFee = data;
				break;
			}
			case WE_MAKE_PRICE: {
				this.itemInfo.items[index].wemakepriceFee = data;
				break;
			}
			case STREET11_GLOBAL: {
				this.itemInfo.items[index].lotteonFee = data;
				break;
			}
			case STREET11_NORMAL: {
				this.itemInfo.items[index].lotteonNormalFee = data;
				break;
			}
			case TMON: {
				this.itemInfo.items[index].tmonFee = data;
				break;
			}
		}

		this.itemInfo.items[index].edited.baseInfo = 1;
	};

	/** 오픈마켓수수료 업데이트 */
	updateProductFee = async (data: any, index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.baseInfo = 0);

		if (!this.itemInfo.items[index].edited.baseInfo) return;

		this.itemInfo.items[index].edited.baseInfo = 2;

		const response = await gql(MUTATIONS.UPDATE_PRODUCT_FEE, data);

		if (response.errors) {
			alert(response.errors[0].message);

			exit();

			return;
		}

		floatingToast('오픈마켓수수료적용가가 저장되었습니다.', 'success');

		runInAction(() => exit());
	};

	/** 판매가 일괄설정 */
	setManyPriceInfo = (data: ManyPriceInfo) => (this.manyPriceInfo = data);

	/** 오픈마켓수수료 일괄설정 */
	setManyFeeInfo = (data: any) => (this.manyFeeInfo = data);

	/** 카테고리 일괄설정 */
	setManyCategoryInfo = (data: any) => (this.manyCategoryInfo = data);

	/** 상품명 일괄설정 */
	setManyNameInfo = (data: any) => (this.manyNameInfo = data);

	/** 검색어태그 일괄설정 */
	setManyTagInfo = (data: any) => (this.manyTagInfo = data);

	/** 상세페이지 일괄설정 */
	setManyDescriptionInfo = (data: any) => (this.manyDescriptionInfo = data);

	/** 판매가 일괄 업데이트 */
	updateManyPrice = async (commonStore: common) => {
		let productIds: any = [];

		this.itemInfo.items.map((v) => v.checked && productIds.push(v.id));

		if (productIds.length < 1) return alert('상품이 선택되지 않았습니다.');
		if (this.manyPriceInfo.cnyRate <= 0) return alert('환율은 0 보다 큰 값으로 입력해주세요.');
		if (this.manyPriceInfo.marginRate < 0) return alert('마진율은 0% 이상으로 입력해주세요.');
		if (!this.manyPriceInfo.marginUnitType) return alert('마진단위를 선택해주세요.');
		if (this.manyPriceInfo.localShippingFee < 0) return alert('해외배송비는 0원 이상으로 입력해주세요.');
		if (this.manyPriceInfo.shippingFee < 0) return alert('유료배송비는 0원 이상으로 입력해주세요.');

		const response = await gql(
			MUTATIONS.UPDATE_MANY_PRODUCT_PRICE_BY_USER,
			{ ...this.manyPriceInfo, productIds },
			false,
		);

		if (response.errors) return alert(response.errors[0].message);

		floatingToast(`상품 ${productIds.length}개의 가격을 일괄설정하였습니다.`, 'success');

		this.toggleManyPriceModal(false);
		this.refreshProduct(commonStore);
	};

	/** 오픈마켓수수료 일괄 업데이트 */
	updateManyFee = async (commonStore: common, ids: any) => {
		let productIds: any = [];

		if (ids) productIds = ids;
		else {
			this.itemInfo.items.map((v) => v.checked && productIds.push(v.id));

			if (productIds.length < 1) return alert('상품이 선택되지 않았습니다.');
		}

		const response = await gql(
			MUTATIONS.UPDATE_MANY_PRODUCT_FEE,
			{
				productId: productIds,
				naverFee: this.manyFeeInfo.naverFee,
				coupangFee: this.manyFeeInfo.coupangFee,
				streetFee: this.manyFeeInfo.streetFee,
				streetNormalFee: this.manyFeeInfo.streetNormalFee,
				gmarketFee: this.manyFeeInfo.gmarketFee,
				auctionFee: this.manyFeeInfo.auctionFee,
				interparkFee: this.manyFeeInfo.interparkFee,
				wemakepriceFee: this.manyFeeInfo.wemakepriceFee,
				lotteonFee: this.manyFeeInfo.lotteonFee,
				lotteonNormalFee: this.manyFeeInfo.lotteonNormalFee,
				tmonFee: this.manyFeeInfo.tmonFee,
			},
			false,
		);

		if (response.errors) return alert(response.errors[0].message);

		floatingToast(`상품 ${productIds.length}개의 수수료를 일괄설정하였습니다.`, 'success');

		this.toggleManyFeeModal(false);
		this.refreshProduct(commonStore);
	};

	/** 카테고리 일괄 업데이트 */
	updateManyCategory = async (commonStore: common, ids: any) => {
		let productIds: any = [];

		if (ids) productIds = ids;
		else {
			this.itemInfo.items.map((v: any) => v.checked && productIds.push(v.id));

			if (productIds.length < 1) return alert('상품이 선택되지 않았습니다.');
		}

		const response = await gql(
			MUTATIONS.UPDATE_MANY_PRODUCT_CATEGORY_BY_USER,
			{
				productIds,
				categoryA077: this.manyCategoryInfo.categoryInfoA077.code,
				categoryB378: this.manyCategoryInfo.categoryInfoB378.code,
				categoryA112: this.manyCategoryInfo.categoryInfoA112.code,
				categoryA113: this.manyCategoryInfo.categoryInfoA113.code,
				categoryA006: this.manyCategoryInfo.categoryInfoA006.code,
				categoryA001: this.manyCategoryInfo.categoryInfoA001.code,
				categoryA027: this.manyCategoryInfo.categoryInfoA027.code,
				categoryB719: this.manyCategoryInfo.categoryInfoB719.code,
				categoryA524: this.manyCategoryInfo.categoryInfoA524.code,
				categoryA525: this.manyCategoryInfo.categoryInfoA525.code,
				categoryB956: this.manyCategoryInfo.categoryInfoB956.code,
			},
			false,
		);

		if (response.errors) return alert(response.errors[0].message);

		const response1 = await gql(
			MUTATIONS.UPDATE_PRODUCT_SILL_CODES_BY_USER,
			{
				productIds,
				code_a077: this.manyCategoryInfo.categoryInfoA077.code ? '' : undefined,
				code_b378: this.manyCategoryInfo.categoryInfoB378.code ? '' : undefined,
				code_a112: this.manyCategoryInfo.categoryInfoA112.code ? '' : undefined,
				code_a113: this.manyCategoryInfo.categoryInfoA113.code ? '' : undefined,
				code_a001: this.manyCategoryInfo.categoryInfoA006.code ? '' : undefined,
				code_a006: this.manyCategoryInfo.categoryInfoA001.code ? '' : undefined,
				code_a027: this.manyCategoryInfo.categoryInfoA027.code ? '' : undefined,
				code_b719: this.manyCategoryInfo.categoryInfoB719.code ? '' : undefined,
				code_a524: this.manyCategoryInfo.categoryInfoA524.code ? '' : undefined,
				code_a525: this.manyCategoryInfo.categoryInfoA525.code ? '' : undefined,
				code_b956: this.manyCategoryInfo.categoryInfoB956.code ? '' : undefined,
			},
			false,
		);

		if (response1.errors) return alert(response1.errors[0].message);

		const response2 = await gql(
			MUTATIONS.UPDATE_PRODUCT_SILL_DATAS_BY_USER,
			{
				productIds,
				data_a077: this.manyCategoryInfo.categoryInfoA077.code ? '' : undefined,
				data_b378: this.manyCategoryInfo.categoryInfoB378.code ? '' : undefined,
				data_a112: this.manyCategoryInfo.categoryInfoA112.code ? '' : undefined,
				data_a113: this.manyCategoryInfo.categoryInfoA113.code ? '' : undefined,
				data_a001: this.manyCategoryInfo.categoryInfoA006.code ? '' : undefined,
				data_a006: this.manyCategoryInfo.categoryInfoA001.code ? '' : undefined,
				data_a027: this.manyCategoryInfo.categoryInfoA027.code ? '' : undefined,
				data_b719: this.manyCategoryInfo.categoryInfoB719.code ? '' : undefined,
				data_a524: this.manyCategoryInfo.categoryInfoA524.code ? '' : undefined,
				data_a525: this.manyCategoryInfo.categoryInfoA525.code ? '' : undefined,
				data_b956: this.manyCategoryInfo.categoryInfoB956.code ? '' : undefined,
			},
			false,
		);

		if (response2.errors) return alert(response1.errors[0].message);

		floatingToast(`상품 ${productIds.length}개의 카테고리를 일괄설정하였습니다.`, 'success');

		this.toggleManyCategoryModal(false);
		this.refreshProduct(commonStore);
	};

	/** 상품명 일괄 업데이트 */
	updateManyName = async (commonStore: common, data: any) => {
		let productIds: any = [];

		this.itemInfo.items.map((v) => v.checked && productIds.push(v.id));

		if (productIds.length < 1) return alert('상품이 선택되지 않았습니다.');

		const response = await gql(MUTATIONS.UPDATE_MANY_PRODUCT_NAME_BY_USER, { ...data, productIds }, false);

		if (response.errors) return alert(response.errors[0].message);

		floatingToast(`상품 ${productIds.length}개의 상품명을 일괄설정하였습니다.`, 'success');

		this.toggleManyNameModal(false);
		this.refreshProduct(commonStore);
	};

	/** 검색어태그 일괄 업데이트 */
	updateManyTag = async (commonStore: common) => {
		let productIds: any = [];

		this.itemInfo.items.map((v) => v.checked && productIds.push(v.id));

		if (productIds.length < 1) return alert('상품이 선택되지 않았습니다.');
		if (!this.manyTagInfo.immSearchTagsDisabled) {
			let output = '';
			let tagList: any = [];
			let addList = this.manyTagInfo.immSearchTags.replaceAll(' ', '').split(',') ?? [];
			let userResp = await fetch('https://sell.smartstore.naver.com/api/products?_action=create');
			let userJson = await userResp.json();

			if (userJson.error) return floatingToast('스마트스토어 로그인 후 이용해주세요.', 'warning');

			let tagDataSet = await Promise.all(
				addList
					.filter((v: any) => v)
					.map(async (v: any) => {
						const tagResp = await fetch(
							`https://sell.smartstore.naver.com/api/product/shared/is-restrict-tag?_action=isRestrictTag&tag=${encodeURI(
								v,
							)}`,
						);
						const tagJson = await tagResp.json();

						return {
							tag: v,
							restricted: tagJson.restricted,
						};
					}),
			);

			tagDataSet.map((v: any) => {
				if (tagList.length > 9) return floatingToast('검색어는 최대 10개까지만 입력하실 수 있습니다.', 'information');
				if (tagList.find((w: any) => w === v.tag)) return;
				if (v.restricted) return floatingToast(`사용할 수 없는 검색어입니다. [${v.tag}]`, 'failed');

				tagList.push(v.tag);
			});

			tagList.map((v: any) => (output += `${v},`));

			output = output.slice(0, output.length - 1);

			this.manyTagInfo.immSearchTags = output;
		}

		const response = await gql(
			MUTATIONS.UPDATE_MANY_PRODUCT_TAG_BY_USER,
			{
				searchTags: this.manyTagInfo.searchTagsDisabled ? null : this.manyTagInfo.searchTags,
				immSearchTags: this.manyTagInfo.immSearchTagsDisabled ? null : this.manyTagInfo.immSearchTags,
				productIds,
			},
			false,
		);

		if (response.errors) return alert(response.errors[0].message);

		floatingToast(`상품 ${productIds.length}개의 검색어태그를 일괄설정하였습니다.`, 'success');

		this.toggleManyTagModal(false);
		this.refreshProduct(commonStore);
	};

	/** 상세페이지 일괄 업데이트 */
	updateManyDescription = async (commonStore: common) => {
		const inputs = this.itemInfo.items
			.filter((v) => v.checked)
			.map((v: any) => ({
				productId: v.id,
				description: (this.manyDescriptionInfo.html ?? '') + v.description,
			}));

		if (inputs.length < 1) return alert('상품이 선택되지 않았습니다.');

		const response = await gql(
			MUTATIONS.UPDATE_MANY_DESCRIPTION,
			{
				data: inputs,
			},
			false,
		);

		if (response.errors) return alert(response.errors[0].message);

		floatingToast(`상품 ${inputs.length}개의 상세설명 내용이 일괄추가되었습니다.`, 'success');

		this.refreshProduct(commonStore);
		this.toggleDescriptionModal(false, 0);
	};

	/** 상품명 일괄 업데이트 */
	updateMultipleProductName = async (commonStore: common, data: any) => {
		data = data.filter((v: any, i: number) => {
			if (!v) return false;

			this.itemInfo.items[i].name = v.name;

			return true;
		});

		const response = await gql(MUTATIONS.UPDATE_MULTIPLE_PRODUCT_NAME_BY_USER, { data }, false);

		if (response.errors) return alert(response.errors[0].message);

		floatingToast(`상품 ${data.length}개의 상품명이 일괄변경되었습니다.`, 'success');

		this.toggleManyNameModal(false);
		this.refreshProduct(commonStore);
	};

	/** 상품 단일선택 */
	toggleItemChecked = (index: number, value: boolean) => (this.itemInfo.items[index].checked = value);

	/** 상품 일괄선택 */
	toggleItemCheckedAll = (value: boolean) => {
		this.itemInfo.checkedAll = value;
		this.itemInfo.items.map((v) => (v.checked = value));
	};

	/** 상품 펼쳐보기 (상세보기) */
	toggleItemCollapse = (index: number) => (this.itemInfo.items[index].collapse = !this.itemInfo.items[index].collapse);

	/** 상품 옵션명 원문보기 */
	toggleItemOptionCollapse = (index: number) =>
		(this.itemInfo.items[index].optionCollapse = !this.itemInfo.items[index].optionCollapse);

	/** 상품등록 모달 */
	toggleUploadModal = (index: number, value: boolean) => {
		this.uploadIndex = index;
		this.modalInfo.upload = value;
	};

	/** 상품 등록해제 모달 */
	toggleUploadDisabledModal = (index: number, value: boolean, commonStore: common) => {
		if (value) {
			if (index > -1)
				commonStore.uploadDisabledInfo.markets.map((v) => {
					const matched = this.itemInfo.items[index].activeProductStore.find((w) => w.siteCode === v.code);

					v.disabled = !matched;
					//@ts-ignore
					v.upload = matched;
				});
			else
				commonStore.uploadDisabledInfo.markets.map((v) => {
					v.disabled = false;
					v.upload = true;
				});
		}

		this.uploadDisabledIndex = index;
		this.modalInfo.uploadDisabled = value;
	};

	/** 상품 등록실패 모달 */
	toggleUploadFailedModal = (index: number, value: boolean) => {
		if (index > -1) this.uploadFailedIndex = index;

		this.modalInfo.uploadFailed = value;
	};

	/** 상품 상세설명 모달 */
	toggleDescriptionModal = (value: boolean, index: number) => {
		this.itemInfo.current = index;
		this.modalInfo.description = value;
	};

	/** 판매가 일괄설정 모달 */
	toggleManyPriceModal = (value: boolean) => (this.modalInfo.price = value);

	/** 오픈마켓 수수료 일괄설정 모달 */
	toggleManyFeeModal = (value: boolean) => (this.modalInfo.fee = value);

	/** 카테고리 일괄설정 모달 */
	toggleManyCategoryModal = (value: boolean) => (this.modalInfo.category = value);

	/** 상품명 일괄설정 모달 */
	toggleManyNameModal = (value: boolean) => (this.modalInfo.name = value);

	/** 잠금 일괄설정 모달 */
	toggleManyLockModal = (value: boolean) => (this.modalInfo.locked = value);

	/** 검색어 태그 일괄설정 모달 */
	toggleManyTagModal = (value: boolean) => (this.modalInfo.tag = value);

	/** 검색어 필터 모달 */
	toggleSearchFilterModal = (value: boolean) => (this.modalInfo.userFilter = value);

	/** 엑셀파일 상품수집 모달 */
	toggleCollectExcelModal = (value: boolean) => (this.modalInfo.collectExcel = value);

	/** 검색어 필터 모달 */
	// toggleSearchFilter = () => (this.searchInfo.useFilter = !this.searchInfo.useFilter);

	/** 검색정보 설정 */
	setChangeWhere = (data: ProductWhereInput) => (this.changedWhere = data);
	/** 검색정보 반영 */
	onStageWhere = () => {
		const where: ProductWhereInput = {
			...this.changedWhere,
			categoryInfoA077: this.changedWhere.categoryInfoA077?.code
				? {
						code: { equals: this.changedWhere.categoryInfoA077.code },
				  }
				: (undefined as any),
		};

		this.stagedWhere = where;
	};

	/** 검색 키워드 설정 */
	setSearchKeyword = ({ type, keyword }: { type: SearchType; keyword: string }): boolean => {
		let flag = true;

		if (keyword === '') {
			this.changedWhere.OR = undefined;
			return true;
		}

		switch (type) {
			case 'PCODE': {
				if (!keyword.includes('SFY_')) {
					alert('상품코드는 SFY_000 형식으로 입력해주세요.');
					return false;
				}

				let list: string[] = [];
				let parseList: number[] = [];

				list = keyword.split(',');
				Promise.all(
					list.map((v) => {
						if (!v.includes('SFY_')) {
							alert('모든 상품코드는 SFY_000 형식으로 입력해주세요.');
							flag = false;
						}
						parseList.push(parseInt(v.split('_')[1], 36));
					}),
				);

				if (flag) this.changedWhere.OR = [{ id: { in: parseList } }];
				break;
			}

			case 'ONAME': {
				this.changedWhere.OR = [{ taobaoProduct: { name: { contains: keyword } } }];
				break;
			}

			case 'NAME': {
				this.changedWhere.OR = [{ name: { contains: keyword } }];
				break;
			}

			case 'CNAME': {
				this.changedWhere.OR = [
					{ categoryInfoA077: { name: { contains: keyword } } },
					{ categoryInfoB378: { name: { contains: keyword } } },
					{ categoryInfoA112: { name: { contains: keyword } } },
					{ categoryInfoA113: { name: { contains: keyword } } },
					{ categoryInfoA006: { name: { contains: keyword } } },
					{ categoryInfoA001: { name: { contains: keyword } } },
					{ categoryInfoA027: { name: { contains: keyword } } },
					{ categoryInfoB719: { name: { contains: keyword } } },
					{ categoryInfoA524: { name: { contains: keyword } } },
					{ categoryInfoA525: { name: { contains: keyword } } },
					{ categoryInfoB956: { name: { contains: keyword } } },
				];
				break;
			}

			case 'OID': {
				this.changedWhere.OR = [{ taobaoProduct: { taobaoNumIid: { contains: keyword } } }];
				break;
			}

			case 'MID': {
				this.changedWhere.OR = [
					{ productStore: { some: { storeProductId: { contains: keyword } } } },
					{ productStore: { some: { etcVendorItemId: { contains: keyword } } } },
				];
				break;
			}

			case 'MYKEYWORD': {
				this.changedWhere.OR = [{ myKeyward: { contains: keyword } }];
				break;
			}
		}

		return flag;
	};

	/** 상품 필터 초기화 (전달받은 값을 제외하고) */
	initProductWhereInput = (data: Partial<ProductWhereInput>) => {
		if (data) {
			this.changedWhere = {
				...data,
			};
			this.stagedWhere = {
				...data,
			};
		} else {
			this.changedWhere = {};
			this.stagedWhere = {};
		}
		this.page = 1;
		this.pageTemp = 1;
	};

	/** 검색결과 조회 */
	// getSearchResult = (commonStore: common) => {
	// 	this.setSearchWhereAndInput([
	// 		{ state: { in: this.state } },
	// 		{ myLock: compareArray(this.state, [7]) && this.myLock === 1 ? {} : { equals: this.myLock } },
	// 		{
	// 			categoryInfoA077: this.searchInfo.categoryInfo.code
	// 				? { code: { equals: this.searchInfo.categoryInfo.code } }
	// 				: {},
	// 		},
	// 		{
	// 			createdAt: this.searchInfo.collectedStart ? { gte: this.searchInfo.collectedStart } : {},
	// 		},
	// 		{
	// 			createdAt: this.searchInfo.collectedEnd ? { lte: this.searchInfo.collectedEnd } : {},
	// 		},
	// 		{
	// 			stockUpdatedAt: this.searchInfo.registeredStart ? { gte: this.searchInfo.registeredStart } : {},
	// 		},gte
	// 		{
	// 			stockUpdatedAt: this.searchInfo.registeredEnd ? { lte: this.searchInfo.registeredEnd } : {},
	// 		},
	// 		{
	// 			taobaoProduct: this.searchInfo.cnyPriceStart ? { price: { gte: this.searchInfo.cnyPriceStart } } : {},
	// 		},
	// 		{
	// 			taobaoProduct: this.searchInfo.cnyPriceEnd ? { price: { lte: this.searchInfo.cnyPriceEnd } } : {},
	// 		},
	// 		{
	// 			cnyRate: this.searchInfo.cnyRateStart ? { gte: this.searchInfo.cnyRateStart } : {},
	// 		},
	// 		{
	// 			cnyRate: this.searchInfo.cnyRateEnd ? { lte: this.searchInfo.cnyRateEnd } : {},
	// 		},
	// 		{
	// 			localShippingFee: this.searchInfo.localFeeStart ? { gte: this.searchInfo.localFeeStart } : {},
	// 		},
	// 		{
	// 			localShippingFee: this.searchInfo.localFeeEnd ? { lte: this.searchInfo.localFeeEnd } : {},
	// 		},
	// 		{
	// 			marginRate: this.searchInfo.marginRateStart ? { gte: this.searchInfo.marginRateStart } : {},
	// 		},
	// 		{
	// 			marginRate: this.searchInfo.marginRateEnd ? { lte: this.searchInfo.marginRateEnd } : {},
	// 		},
	// 		{
	// 			price: this.searchInfo.priceStart ? { gte: this.searchInfo.priceStart } : {},
	// 		},
	// 		{
	// 			price: this.searchInfo.priceEnd ? { lte: this.searchInfo.priceEnd } : {},
	// 		},
	// 		{
	// 			shippingFee: this.searchInfo.feeStart ? { gte: this.searchInfo.feeStart } : {},
	// 		},
	// 		{
	// 			shippingFee: this.searchInfo.feeEnd ? { lte: this.searchInfo.feeEnd } : {},
	// 		},
	// 		{
	// 			taobaoProduct: this.searchInfo.shopName === 'ALL' ? {} : { shopName: { equals: this.searchInfo.shopName } },
	// 		},
	// 		{
	// 			taobaoProduct:
	// 				this.searchInfo.hasVideo === 'ALL'
	// 					? {}
	// 					: this.searchInfo.hasVideo === 'Y'
	// 					? { videoUrl: { not: { equals: null } } }
	// 					: { videoUrl: { equals: null } },
	// 		},
	// 		{
	// 			productStore: compareArray(this.state, [6])
	// 				? {}
	// 				: {
	// 						some: {
	// 							AND: [
	// 								{
	// 									siteCode: this.searchInfo.marketName === 'ALL' ? {} : { equals: this.searchInfo.marketName },
	// 								},
	// 								{
	// 									state:
	// 										this.searchInfo.hasRegistered === 'ALL'
	// 											? {}
	// 											: this.searchInfo.hasRegistered === 'Y'
	// 											? { equals: 2 }
	// 											: { not: { equals: 2 } },
	// 								},
	// 							],
	// 						},
	// 				  },
	// 		},
	// 	]);

	// 	switch (this.searchInfo.searchType) {
	// 		case 'ALL': {
	// 			this.setSearchWhereOrInput([
	// 				{ productCode: { contains: this.searchInfo.searchKeyword } },
	// 				{
	// 					taobaoProduct: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{ name: { contains: this.searchInfo.searchKeyword } },
	// 				{
	// 					categoryInfoA077: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoB378: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoA112: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoA113: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoA006: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoA001: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoA027: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoB719: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoA524: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoA525: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoB956: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					taobaoProduct: {
	// 						taobaoNumIid: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					productStore: {
	// 						some: {
	// 							storeProductId: { contains: this.searchInfo.searchKeyword },
	// 						},
	// 					},
	// 				},
	// 			]);

	// 			break;
	// 		}

	// 		case 'PCODE': {
	// 			if (!this.searchInfo.searchKeyword.includes('SFY_')) return alert('상품코드는 SFY_000 형식으로 입력해주세요.');

	// 			let list: string[] = [];
	// 			let parseList: number[] = [];

	// 			list = this.searchInfo.searchKeyword.split(',');
	// 			list.map((v) => {
	// 				if (!v.includes('SFY_')) return alert('모든 상품코드는 SFY_000 형식으로 입력해주세요.');

	// 				parseList.push(parseInt(v.split('_')[1], 36));
	// 			});

	// 			this.setSearchWhereOrInput([{ id: { in: parseList } }]);

	// 			break;
	// 		}

	// 		case 'ONAME': {
	// 			this.setSearchWhereOrInput([
	// 				{
	// 					taobaoProduct: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 			]);
	// 			break;
	// 		}
	// 		case 'NAME': {
	// 			this.setSearchWhereOrInput([{ name: { contains: this.searchInfo.searchKeyword } }]);
	// 			break;
	// 		}

	// 		case 'CNAME': {
	// 			this.setSearchWhereOrInput([
	// 				{
	// 					categoryInfoA077: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoB378: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoA112: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoA113: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoA006: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoA001: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoA027: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoB719: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoA524: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoA525: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 				{
	// 					categoryInfoB956: {
	// 						name: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 			]);
	// 			break;
	// 		}

	// 		case 'OID': {
	// 			this.setSearchWhereOrInput([
	// 				{
	// 					taobaoProduct: {
	// 						taobaoNumIid: { contains: this.searchInfo.searchKeyword },
	// 					},
	// 				},
	// 			]);
	// 			break;
	// 		}

	// 		case 'MID': {
	// 			this.setSearchWhereOrInput([
	// 				{
	// 					productStore: {
	// 						some: {
	// 							storeProductId: { contains: this.searchInfo.searchKeyword },
	// 						},
	// 					},
	// 				},
	// 				{
	// 					productStore: {
	// 						some: {
	// 							etcVendorItemId: { contains: this.searchInfo.searchKeyword },
	// 						},
	// 					},
	// 				},
	// 			]);
	// 			break;
	// 		}

	// 		case 'KEYWARD': {
	// 			this.setSearchWhereOrInput([{ myKeyward: { equals: this.searchInfo.searchKeyword } }]);
	// 			break;
	// 		}
	// 	}

	// 	this.page = 1;

	// 	this.getProduct(commonStore, this.page);
	// };

	/** 상품 세부정보에서 탭 이동 */
	switchTabs = (index: number, value: number) => (this.itemInfo.items[index].tabs = value);

	/** 상품 등록 시 탭 이동 */
	switchUploadTabs = (value: number) => (this.modalInfo.uploadTabIndex = value);

	/** 상품 등록 - 등록중 */
	addRegisteredQueue = (data: any) => this.registeredInfo.wait.push(data);

	/** 상품 등록 - 등록완료 */
	addRegisteredSuccess = (data: any) => {
		this.registeredInfo.wait = this.registeredInfo.wait.filter((v: any) => {
			if (v.site_name === data.site_name && v.code === data.code) return false;
			return true;
		});

		this.registeredInfo.success.push(data);
	};

	/** 상품 등록 - 등록실패 */
	addRegisteredFailed = (data: any) => {
		this.registeredInfo.wait = this.registeredInfo.wait.filter((v: any) => {
			if (v.site_name === data.site_name && v.code === data.code) return false;
			return true;
		});

		this.registeredInfo.failed.push(data);
	};

	/** 상품 등록해제 */
	disableItems = async (commonStore: common) => {
		let productIds: number[] = [];
		let lockProducts: string[] = [];

		if (this.uploadDisabledIndex > -1) {
			this.itemInfo.items[this.uploadDisabledIndex].delete = true;
			productIds.push(this.itemInfo.items[this.uploadDisabledIndex].id);
		} else {
			this.itemInfo.items.map((v) => {
				if (v.myLock === 2 && v.checked) lockProducts.push(v.productCode);
				if (v.myLock === 1 && v.checked) {
					v.delete = true;
					productIds.push(v.id);
				}
			});
		}

		/** 선택상품 체크 */
		if (productIds.length < 1) {
			if (lockProducts.length !== 0) alert('잠금 상품을 제외한 상품이 선택되지 않았습니다.');
			else alert('상품이 선택되지 않았습니다.');

			await commonStore.setUploadable(true);
			return;
		}

		/** 잠금상품이 포함되있을 경우 체크 */
		if (lockProducts.length !== 0)
			if (!confirm(`[잠금상품목록] \n${lockProducts.join(', ')} \n\n잠금 상품을 제외하고 등록해제 합니다`))
				return commonStore.setUploadable(true);

		const markets = commonStore.uploadDisabledInfo.markets.filter((v) => v.upload).map((v) => v.code);

		if (markets.length < 1) return alert('오픈마켓이 선택되지 않았습니다.');

		const response = await gql(QUERIES.GET_REGISTER_PRODUCTS_DATA_BY_USER, {
			productIds,
			siteCode: markets,
		});

		if (response.errors) return alert(response.errors[0].message);

		const data = JSON.parse(response.data.getRegisterProductsDataByUser);

		await Promise.all([
			deleteSmartStore(
				this,
				commonStore,
				data.job_json_array.find((v: any) => v.DShopInfo.site_code === SHOPCODE.SMART_STORE),
			),
			deleteCoupang(
				this,
				commonStore,
				data.job_json_array.find((v: any) => v.DShopInfo.site_code === SHOPCODE.COUPANG),
			),
			deleteStreet(
				this,
				commonStore,
				data.job_json_array.find((v: any) => v.DShopInfo.site_code === SHOPCODE.STREET11_GLOBAL),
			),
			deleteStreet(
				this,
				commonStore,
				data.job_json_array.find((v: any) => v.DShopInfo.site_code === SHOPCODE.STREET11_NORMAL),
			),
			deleteESMPlus(
				this,
				commonStore,
				data.job_json_array.find((v: any) => v.DShopInfo.site_code === SHOPCODE.G_MARKET_1),
			),
			deleteESMPlus(
				this,
				commonStore,
				data.job_json_array.find((v: any) => v.DShopInfo.site_code === SHOPCODE.AUCTION_1),
			),
			deleteESMPlus2(
				this,
				commonStore,
				data.job_json_array.find((v: any) => v.DShopInfo.site_code === SHOPCODE.AUCTION_2),
			),
			deleteESMPlus2(
				this,
				commonStore,
				data.job_json_array.find((v: any) => v.DShopInfo.site_code === SHOPCODE.G_MARKET_2),
			),
			deleteInterpark(
				this,
				commonStore,
				data.job_json_array.find((v: any) => v.DShopInfo.site_code === SHOPCODE.INTER_PARK),
			),
			deleteWemakeprice(
				this,
				commonStore,
				data.job_json_array.find((v: any) => v.DShopInfo.site_code === SHOPCODE.WE_MAKE_PRICE),
			),
			deleteLotteon(
				this,
				commonStore,
				data.job_json_array.find((v: any) => v.DShopInfo.site_code === SHOPCODE.LOTTE_ON_GLOBAL),
			),
			deleteLotteon(
				this,
				commonStore,
				data.job_json_array.find((v: any) => v.DShopInfo.site_code === SHOPCODE.LOTTE_ON_NORMAL),
			),
			deleteTmon(
				this,
				commonStore,
				data.job_json_array.find((v: any) => v.DShopInfo.site_code === SHOPCODE.TMON),
			),
		]);

		// if (commonStore.uploadInfo.stopped) {
		//     alert("업로드가 중단되었습니다.");
		// }

		// this.clearDisabledConsoleText();
		this.refreshProduct(commonStore);
		commonStore.initUploadDisabledMarketProgress();
		commonStore.setUploadable(true);
		commonStore.setStopped(true);
	};

	/** 상품 등록 */
	uploadItems = async (commonStore: common, edit: boolean) => {
		let productIds: number[] = [];

		if (this.uploadIndex > -1) productIds.push(this.itemInfo.items[this.uploadIndex].id);
		else this.itemInfo.items.map((v) => v.checked && productIds.push(v.id));

		if (productIds.length < 1) return alert('상품이 선택되지 않았습니다.');

		const markets = commonStore.uploadInfo.markets.filter((v) => v.upload).map((v) => v.code);

		if (markets.length < 1) return alert('오픈마켓이 선택되지 않았습니다.');

		commonStore.setUploadable(false);

		const response = await gql(QUERIES.GET_REGISTER_PRODUCTS_DATA_BY_USER, {
			productIds,
			siteCode: markets,
		});

		if (response.errors) {
			commonStore.setUploadable(true);
			alert(response.errors[0].message);
			return;
		}

		const data = JSON.parse(response.data.getRegisterProductsDataByUser);

		if (edit) {
			commonStore.setEditedUpload(true);
			this.addConsoleText('상품 수정을 시작합니다.');
		} else {
			commonStore.setEditedUpload(false);
			this.addConsoleText('상품 등록을 시작합니다.');
		}

		this.clearUploadResults();

		commonStore.setStopped(false);

		await Promise.all([
			uploadSmartStore(
				this,
				commonStore,
				data.job_json_array.find((v) => v.DShopInfo.site_code === SMART_STORE),
			),
			uploadCoupang(
				this,
				commonStore,
				data.job_json_array.find((v) => v.DShopInfo.site_code === COUPANG),
			),
			uploadStreet(
				this,
				commonStore,
				data.job_json_array.find((v) => v.DShopInfo.site_code === STREET11_GLOBAL),
			),
			uploadStreet(
				this,
				commonStore,
				data.job_json_array.find((v) => v.DShopInfo.site_code === STREET11_NORMAL),
			),
			/** ESM2.0 */
			uploadESMPlus2(
				this,
				commonStore,
				data.job_json_array.find((v) => v.DShopInfo.site_code === AUCTION_2), //옥션2.0
			),
			uploadESMPlus2(
				this,
				commonStore,
				data.job_json_array.find((v) => v.DShopInfo.site_code === G_MARKET_2), //지마켓2.0
			),
			/** ESM1.0 */
			uploadESMPlus(
				this,
				commonStore,
				data.job_json_array.find((v) => v.DShopInfo.site_code === G_MARKET_1),
			),
			uploadESMPlus(
				this,
				commonStore,
				data.job_json_array.find((v) => v.DShopInfo.site_code === AUCTION_1),
			),
			uploadInterpark(
				this,
				commonStore,
				data.job_json_array.find((v) => v.DShopInfo.site_code === INTER_PARK),
			),
			uploadWemakeprice(
				this,
				commonStore,
				data.job_json_array.find((v) => v.DShopInfo.site_code === WE_MAKE_PRICE),
			),
			uploadLotteon(
				this,
				commonStore,
				data.job_json_array.find((v) => v.DShopInfo.site_code === LOTTE_ON_GLOBAL),
			),
			uploadLotteon(
				this,
				commonStore,
				data.job_json_array.find((v) => v.DShopInfo.site_code === LOTTE_ON_NORMAL),
			),
			uploadTmon(
				this,
				commonStore,
				data.job_json_array.find((v) => v.DShopInfo.site_code === TMON),
			),
		]);

		if (commonStore.uploadInfo.stopped) alert('업로드가 중단되었습니다.');

		this.refreshProduct(commonStore);
		commonStore.initUploadMarketProgress();
		commonStore.setUploadable(true);
		commonStore.setStopped(true);
	};

	/** 등록 진행상태 표시 */
	addConsoleText = (text: string) => {
		const today = getClock();
		const result = `[${today.hh}:${today.mm}:${today.ss}] ${text}`;

		this.uploadConsole.push(result);
	};

	/** 등록 결과 초기화 */
	clearUploadResults = () => {
		this.registeredInfo = {
			wait: [],
			success: [],
			failed: [],
		};
		this.uploadConsole = [];
	};

	/** 쿠팡에서는 상품 승인완료 전에 상품 URL을 알 수 없기 때문에 승인완료 시점에서 상품 URL을 넣어주는 작업 필요 */
	updateCoupangUrl = (index: number, user: User) => {
		this.itemInfo.items[index].productStore.map(async (v: any) => {
			if (v.siteCode === COUPANG && v.state === 2) {
				if (v.storeProductId !== '0') return window.open(v.storeUrl);

				const body = {
					accesskey: user.userInfo!.coupangAccessKey,
					secretkey: user.userInfo!.coupangSecretKey,
					path: `/v2/providers/seller_api/apis/api/v1/marketplace/seller-products/${v.etcVendorItemId}`,
					query: '',
					method: 'GET',
					data: {},
				};

				const response = await coupangApiGateway(body);

				if (!response.data) return alert(response.message);
				if (response.data.statusName !== '승인완료') {
					if (response.data.statusName === '승인반려') {
						let test = confirm(
							`상품이 현재 쿠팡윙에서 [승인반려] 상태입니다.\n쿠팡 업로드 연동해제를 하시겠습니까?\n업로드 연동해제 하신 후 이미지 사이즈를 확인 후 재등록해주세요.\n"확인"을 누르시면 업로드 연동이 해제됩니다.`,
						);
						if (test) {
							//각 각 로그에 있는거 제거 후 상품제거하는 mutation 삽입예정
							const response = await gql(
								MUTATIONS.COUPANG_PRODUCTSTORE_DELETE,
								{ productId: this.itemInfo.items[index].id },
								false,
							);

							if (response.errors) return alert(response.errors[0].message);

							v.state = 3;
						}
					} else return alert(`상품이 현재 [${response.data.statusName}] 상태입니다.`);
				}

				await gql(MUTATIONS.UPDATE_PRODUCT_STORE_URL_INFO_BY_SOMEONE, {
					productStoreId: v.id,
					storeProductId: response.data.productId.toString(),
				});

				v.storeProductId = response.data.productId;
				v.storeUrl = `https://www.coupang.com/vp/products/${response.data.productId}`;

				window.open(v.storeUrl);
			}

			return;
		});
	};

	/** 상품정보 엑셀파일 다운로드 */
	itemToExcel = () => {
		const excelData = this.itemInfo.items.map((v) => {
			const image = v.imageThumbnail[0];

			return {
				상품명: v.name,
				대표이미지: image,
				구매처URL: v.activeTaobaoProduct.url,
				상태: v.state === 6 ? '수집됨' : '등록됨',
				도매가: v.activeTaobaoProduct.price,
				판매가: v.price,
				해외배송비: v.localShippingFee,
				유료배송비: v.shippingFee,
				상품코드: v.productCode,
				수집일: new Date(v.createdAt),
				등록일: new Date(v.stockUpdatedAt),
				네이버검색태그: v.immSearchTags,
				쿠팡검색태그: v.searchTags,
				스마트스토어카테고리: v.categoryInfoA077.name,
				쿠팡카테고리: v.categoryInfoB378.name,
				'11번가(글로벌)카테고리': v.categoryInfoA112.name,
				'11번가(일반)카테고리': v.categoryInfoA113.name,
				지마켓카테고리: v.categoryInfoA006.name,
				옥션카테고리: v.categoryInfoA001.name,
				인터파크카테고리: v.categoryInfoA027.name,
				위메프카테고리: v.categoryInfoB719.name,
				'롯데온(글로벌)카테고리': v.categoryInfoA524.name,
				'롯데온(일반)카테고리': v.categoryInfoA524.name,
				티몬카테고리: v.categoryInfoB956.name,
				스마트스토어등록여부: v.activeProductStore.find((v) => v.siteCode === SMART_STORE) ? 'Y' : 'N',
				쿠팡등록여부: v.activeProductStore.find((v) => v.siteCode === COUPANG) ? 'Y' : 'N',
				'11번가(글로벌)등록여부': v.activeProductStore.find((v) => v.siteCode === STREET11_GLOBAL) ? 'Y' : 'N',
				'11번가(일반)등록여부': v.activeProductStore.find((v) => v.siteCode === STREET11_NORMAL) ? 'Y' : 'N',
				지마켓등록여부: v.activeProductStore.find((v) => v.siteCode === G_MARKET_1) ? 'Y' : 'N',
				옥션등록여부: v.activeProductStore.find((v) => v.siteCode === AUCTION_1) ? 'Y' : 'N',
				인터파크등록여부: v.activeProductStore.find((v) => v.siteCode === INTER_PARK) ? 'Y' : 'N',
				위메프등록여부: v.activeProductStore.find((v) => v.siteCode === WE_MAKE_PRICE) ? 'Y' : 'N',
				'옷데온(글로벌)등록여부': v.activeProductStore.find((v) => v.siteCode === LOTTE_ON_GLOBAL) ? 'Y' : 'N',
				'옷데온(일반)등록여부': v.activeProductStore.find((v) => v.siteCode === LOTTE_ON_NORMAL) ? 'Y' : 'N',
				티몬등록여부: v.activeProductStore.find((v) => v.siteCode === TMON) ? 'Y' : 'N',
			};
		});

		downloadExcel(excelData, `상품리스트`, `상품리스트`, false, 'xlsx');
	};

	/** 상품목록 새로고침 */
	refreshProduct = (commonStore: common) => {
		this.getProduct(commonStore, this.page);
	};

	/** 썸네일이미지 복구 - imageIndex가 있을경우 단일 복구로 동작 */
	initProductThumbnailImage = async (id: number, index: number, imageIndex?: number) => {
		const exit = () => (this.itemInfo.items[index].edited.thumbnailImages = 0);

		if (!confirm('원본 이미지로 복구하시겠습니까?\n이미지 번역 등 수정한 정보는 사라집니다.')) return;

		this.itemInfo.items[index].edited.thumbnailImages = 2;

		const response = await gql(MUTATIONS.INIT_PRODUCT_THUMBNAIL_IMAGE_BY_USER, { productId: id }, false);

		if (response.errors) {
			alert(response.errors[0].message);
			exit();
			return;
		}

		const thumbnailList = JSON.parse(response.data.initProductThumbnailImageByUser);

		if (imageIndex === undefined) this.itemInfo.items[index].imageThumbnail = thumbnailList;
		else this.itemInfo.items[index].imageThumbnail[imageIndex] = thumbnailList[imageIndex];

		floatingToast('원본 이미지로 복구되었습니다.', 'success');

		runInAction(() => exit());
	};

	/** 옵션이미지 복구 */
	initProductOptionImage = async (id: number, index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.optionImages = 0);

		if (!confirm('원본 이미지로 복구하시겠습니까?\n이미지 번역 등 수정한 정보는 사라집니다.')) return;

		this.itemInfo.items[index].edited.optionImages = 2;

		const response = await gql(MUTATIONS.INIT_PRODUCT_OPTION_IMAGE_BY_USER, { productId: id }, false);

		if (response.errors) {
			alert(response.errors[0].message);
			exit();
			return;
		}

		const optionList = JSON.parse(response.data.initProductOptionImageByUser);

		this.itemInfo.items[index].productOptionName.map((v: any) => {
			const resultOptionName = optionList.find((w: any) => w.id === v.id);

			if (!resultOptionName) return;

			v.productOptionValue.map((x: any) => {
				const resultOptionValue = resultOptionName.optionValues.find((y: any) => y.id === x.id);

				if (!resultOptionValue) return;

				x.image = resultOptionValue.img;
			});
		});

		floatingToast('원본 이미지로 복구되었습니다.', 'success');

		runInAction(() => exit());
	};

	/** 상세페이지 이미지 복구 */
	initProductDescription = async (id: number, index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.descriptions = 0);

		if (!confirm('원본 상세페이지로 복구하시겠습니까?\n이미지 번역 등 수정한 정보는 사라집니다.')) return;

		this.itemInfo.items[index].edited.descriptions = 2;

		const response = await gql(MUTATIONS.INIT_PRODUCT_DESCRIPTION_BY_USER, { productId: id }, false);

		if (response.errors) {
			alert(response.errors[0].message);
			exit();
			return;
		}

		this.itemInfo.items[index].description = response.data.initProductDescriptionByUser;

		let descHtml: any = null;

		if (this.itemInfo.items[index].description.includes('description.html')) {
			let descResp = await fetch(
				`${process.env.SELLFORYOU_MINIO_HTTPS}/${this.itemInfo.items[index].description}?${new Date().getTime()}`,
			);
			let descText = await descResp.text();

			descHtml = new DOMParser().parseFromString(descText, 'text/html');

			runInAction(() => (this.itemInfo.items[index].description = descText ?? this.itemInfo.items[index].description));
		} else {
			descHtml = new DOMParser().parseFromString(this.itemInfo.items[index].description, 'text/html');
		}

		runInAction(() => {
			if (descHtml) {
				this.itemInfo.items[index].descriptionImages = [];

				const imageList: any = descHtml.querySelectorAll('img');

				for (let i in imageList) {
					if (!imageList[i].src) continue;

					this.itemInfo.items[index].descriptionImages.push(imageList[i].src);
				}
			}

			floatingToast('원본 상세페이지로 복구되었습니다.', 'success');

			exit();
		});
	};

	/** 이미지번역결과 적용 */
	updateImageTranslatedData = async (data: any) => {
		const product = this.itemInfo.items.find((v) => v.id === data.productId)!;

		if (data.thumbnails.length > 0) {
			product.imageThumbnail = product.imageThumbnail.map((v: any, i: number) => {
				const matched = data.thumbnails.find((w: any) => i === w.index);

				if (!matched) return v;
				return matched.newImage;
			});

			floatingToast('썸네일이미지 번역이 적용되었습니다.', 'success');
		}

		if (data.optionValues.length > 0) {
			product.productOptionName
				.flatMap((v: any) => v.productOptionValue)
				.map((v: any) => {
					const matched = data.optionValues.find((w: any) => w.id === v.id);

					if (!matched || !matched.newImage) return;
					v.image = matched.newImage;
				});

			floatingToast('옵션이미지 번역이 적용되었습니다.', 'success');
		}

		if (data.description && data.description.includes('description.html')) {
			let descResp = await fetch(`${data.description}?${new Date().getTime()}`);
			let descText = await descResp.text();
			let descHtml = new DOMParser().parseFromString(descText, 'text/html');

			runInAction(() => {
				product.description = descText;

				if (descHtml) {
					product.descriptionImages = [];

					const imageList: any = descHtml.querySelectorAll('img');

					for (let i in imageList) {
						if (!imageList[i].src) continue;

						product.descriptionImages.push(imageList[i].src);
					}
				}
			});

			floatingToast('상세이미지 번역이 적용되었습니다.', 'success');
		}

		runInAction(() => (product.isImageTranslated = true));
	};

	/** 옵션명 키워드추가 모달 */
	toggleAddOptionNameModal = (value: boolean) => (this.modalInfo.addOptionName = value);

	/** 옵션명 키워드변경 모달 */
	toggleReplaceOptionNameModal = (value: boolean) => (this.modalInfo.replaceOptionName = value);

	/** 사용자 정의 페이지 당 상품 수 설정 */
	toggleETCPageSize = (value: boolean) => (this.etcPageSize = value);

	/** 에러체크 */
	checkErrorExist = async (index: number) => {
		let errorFound = false;
		this.itemInfo.items[index].error = true;
		this.itemInfo.items[index].optionPriceError = false;
		this.itemInfo.items[index].optionNameError = false;
		this.itemInfo.items[index].thumbnailImageError = false;
		this.itemInfo.items[index].optionImageError = false;
		this.itemInfo.items[index].descriptionImageError = false;
		this.itemInfo.items[index].imageCheckList = {};

		const activeProductOption = this.itemInfo.items[index].productOption.filter((v: any) => v.isActive);
		const activeProductOptionName = this.itemInfo.items[index].productOptionName.map((v) =>
			v.productOptionValue.map((v2) => v2.name),
		);
		/** 옵션명 중복체크 추가 */
		activeProductOptionName.forEach((v) => {
			if (new Set(v).size !== v.length) {
				this.itemInfo.items[index].optionNameError = true;
				errorFound = true;
			}
		});

		if (activeProductOption.length > 0) {
			const priceList = activeProductOption.map((v: any) => v.price);
			const price = Math.min(...priceList);

			if (price !== this.itemInfo.items[index].price) {
				this.itemInfo.items[index].optionPriceError = true;
				errorFound = true;
			}
		}

		await Promise.all(
			this.itemInfo.items[index].imageThumbnail.map(async (v: any) => {
				runInAction(() => (this.itemInfo.items[index].imageCheckList[v] = false));

				const imageResp = await fetch(v);
				const imageBlob = await imageResp.blob();
				const image: any = await getImageMeta(v);

				runInAction(() => {
					if (image.width < 600) {
						this.itemInfo.items[index].imageCheckList[v] = true;
						this.itemInfo.items[index].thumbnailImageError = true;
						errorFound = true;
					}

					if (image.height < 600) {
						this.itemInfo.items[index].imageCheckList[v] = true;
						this.itemInfo.items[index].thumbnailImageError = true;
						errorFound = true;
					}

					switch (imageBlob.type) {
						case 'image/webp': {
							break;
						}
						case 'image/jpeg': {
							if (!v.includes('jpg')) {
								this.itemInfo.items[index].imageCheckList[v] = true;
								this.itemInfo.items[index].thumbnailImageError = true;
								errorFound = true;
							}
							break;
						}
						case 'image/png': {
							if (!v.includes('png')) {
								this.itemInfo.items[index].imageCheckList[v] = true;
								this.itemInfo.items[index].thumbnailImageError = true;
								errorFound = true;
							}
							break;
						}

						default: {
							this.itemInfo.items[index].imageCheckList[v] = true;
							this.itemInfo.items[index].thumbnailImageError = true;
							errorFound = true;
							break;
						}
					}
				});
			}),
		);

		await Promise.all(
			this.itemInfo.items[index].productOptionName
				.flatMap((v: any) => v.productOptionValue)
				.map(async (v: any) => {
					if (!v.image) return;

					runInAction(() => (this.itemInfo.items[index].imageCheckList[v.image] = false));

					const imageResp = await fetch(v.image);
					const imageBlob = await imageResp.blob();

					runInAction(() => {
						switch (imageBlob.type) {
							case 'image/webp': {
								break;
							}
							case 'image/jpeg': {
								if (!v.image.includes('jpg')) {
									this.itemInfo.items[index].imageCheckList[v.image] = true;
									this.itemInfo.items[index].optionImageError = true;
									errorFound = true;
								}
								break;
							}
							case 'image/png': {
								if (!v.image.includes('png')) {
									this.itemInfo.items[index].imageCheckList[v.image] = true;
									this.itemInfo.items[index].optionImageError = true;
									errorFound = true;
								}
								break;
							}

							default: {
								this.itemInfo.items[index].imageCheckList[v.image] = true;
								this.itemInfo.items[index].optionImageError = true;
								errorFound = true;
								break;
							}
						}
					});
				}),
		);

		await Promise.all(
			this.itemInfo.items[index].descriptionImages.map(async (v: any) => {
				runInAction(() => (this.itemInfo.items[index].imageCheckList[v] = false));

				const imageResp = await fetch(v);
				const imageBlob = await imageResp.blob();

				runInAction(() => {
					switch (imageBlob.type) {
						case 'image/webp': {
							break;
						}
						case 'image/jpeg': {
							if (!v.includes('jpg')) {
								this.itemInfo.items[index].imageCheckList[v] = true;
								this.itemInfo.items[index].descriptionImageError = true;
								errorFound = true;
							}
							break;
						}
						case 'image/png': {
							if (!v.includes('png')) {
								this.itemInfo.items[index].imageCheckList[v] = true;
								this.itemInfo.items[index].descriptionImageError = true;
								errorFound = true;
							}
							break;
						}

						default: {
							this.itemInfo.items[index].imageCheckList[v] = true;
							this.itemInfo.items[index].descriptionImageError = true;
							errorFound = true;
							break;
						}
					}
				});
			}),
		);

		runInAction(() => {
			this.itemInfo.items[index].error = false;

			if (errorFound) {
				floatingToast('에러가 발견되었습니다.', 'failed');

				this.itemInfo.items[index].collapse = true;
			} else floatingToast('에러가 발견되지 않았습니다.', 'success');
		});
	};

	/** 상품키워드 설정 */
	setProductKeyward = (data: any, index: number) => {
		this.itemInfo.items[index].myKeyward = data.myKeyward;
		this.itemInfo.items[index].edited.attribute = 1;
	};

	/** 상품속성 설정 */
	setProductAttribute = (data: any, index: number) => {
		if (data.manufacturer) this.itemInfo.items[index].manuFacturer = data.manufacturer;
		if (data.brandName) this.itemInfo.items[index].brandName = data.brandName;
		if (data.modelName) this.itemInfo.items[index].modelName = data.modelName;

		this.itemInfo.items[index].edited.attribute = 1;
	};

	/** 상품 잠금 기능 업데이트 */
	updateLockProduct = async (index: number, data: any) => {
		this.itemInfo.items[index].myLock = data.mylock; //프론트

		const response = await gql(MUTATIONS.SET_LOCK_PRODUCT, data, false);

		if (response.errors) return alert(response.errors[0].message);

		if (data.mylock === 1) floatingToast('상품 잠금 해제되었습니다.', 'success');
		else floatingToast('상품 잠금 되었습니다.', 'success');
	};

	/** 키워드 업데이트 */
	updateProductMyKeyward = async (data: MutationUpdateKeywardListArgs, index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.attribute = 0);
		if (!this.itemInfo.items[index].edited.attribute) return;

		this.itemInfo.items[index].edited.attribute = 2;

		const response = await gql(MUTATIONS.UPDATE_KEYWARD_LIST, data, false);

		if (response.errors) {
			alert(response.errors[0].message);
			exit();
			return;
		}

		floatingToast('상품속성정보가 변경되었습니다.', 'success');

		runInAction(() => exit());
	};

	/** 상품속성 업데이트 */
	updateProductAttribute = async (data: any, index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.attribute = 0);

		if (!this.itemInfo.items[index].edited.attribute) return;

		this.itemInfo.items[index].edited.attribute = 2;

		const response = await gql(MUTATIONS.UPDATE_PRODUCT_ATTRIBUTE_BY_USER, data, false);

		if (response.errors) {
			alert(response.errors[0].message);
			exit();
			return;
		}

		floatingToast('상품속성정보가 변경되었습니다.', 'success');

		runInAction(() => exit());
	};

	/** 상품속성 일괄설정 모달 */
	toggleManyAttributeModal = (value: boolean) => (this.modalInfo.attribute = value);

	toggleManyMyKeywardModal = (value: boolean) => (this.modalInfo.myKeywarded = value);

	/** 상품속성 일괄설정 */
	setManyAttributeInfo = (data: any) => (this.manyAttributeInfo = data);

	setManyKeyward = (data: any) => (this.ManymyKeyward = data);

	/** 개인분류 일괄 업데이트 */
	updateManyMyKeyward = async (commonStore: common) => {
		let productIds: any = [];

		this.itemInfo.items.map((v) => v.checked && productIds.push(v.id));

		if (productIds.length < 1) return alert('상품이 선택되지 않았습니다.');

		const response = await gql(
			MUTATIONS.UPDATE_MANY_KEYWARD_LIST,
			{ ...this.ManymyKeyward, productIds: productIds },
			false,
		);

		if (response.errors) return alert(response.errors[0].message);

		floatingToast(`상품 ${productIds.length}개의 속성을 일괄설정하였습니다.`, 'success');

		this.toggleManyAttributeModal(false);
		this.refreshProduct(commonStore);
	};
	/** 상품속성 일괄 업데이트 */
	updateManyAttribute = async (commonStore: common) => {
		let productIds: any = [];

		this.itemInfo.items.map((v) => v.checked && productIds.push(v.id));

		if (productIds.length < 1) return alert('상품이 선택되지 않았습니다.');

		const response = await gql(
			MUTATIONS.UPDATE_MANY_PRODUCT_ATTRIBUTE_BY_USER,
			{ ...this.manyAttributeInfo, productId: productIds },
			false,
		);

		if (response.errors) return alert(response.errors[0].message);

		floatingToast(`상품 ${productIds.length}개의 개인분류를 일괄설정하였습니다.`, 'success');

		this.toggleManyMyKeywardModal(false);
		this.refreshProduct(commonStore);
	};

	/** 고시정보 업데이트 */
	updateProdutSillCodes = async (marketCode: string, data: any, index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.attribute = 0);

		this.itemInfo.items[index].edited.attribute = 2;

		const lowerCode = marketCode.toLowerCase();

		const response1 = await gql(
			MUTATIONS.UPDATE_PRODUCT_SILL_CODES_BY_USER,
			{
				productIds: data.productIds,
				[`code_${lowerCode}`]: data.value,
			},
			false,
		);

		if (response1.errors) {
			alert(response1.errors[0].message);
			exit();
			return;
		}

		const sillData = this.itemInfo.items[index][`categoryInfo${marketCode}`][`activeSillData${marketCode}`].find(
			(v) => v.code === data.value,
		).data;

		const response2 = await gql(
			MUTATIONS.UPDATE_PRODUCT_SILL_DATAS_BY_USER,
			{
				productIds: data.productIds,
				[`data_${lowerCode}`]: sillData,
			},
			false,
		);

		if (response2.errors) {
			alert(response1.errors[0].message);
			exit();
			return;
		}

		runInAction(() => {
			this.itemInfo.items[index][`sillCode${marketCode}`] = data.value;
			this.itemInfo.items[index][`sillData${marketCode}`] = sillData;
		});

		floatingToast('상품정보제공고시가 변경되었습니다.', 'success');

		runInAction(() => exit());
	};

	/** 고시정보 세부내용 업데이트 */
	updateProdutSillDatas = async (marketCode: string, data: any, index: number) => {
		const exit = () => (this.itemInfo.items[index].edited.attribute = 0);

		this.itemInfo.items[index].edited.attribute = 2;

		const lowerCode = marketCode.toLowerCase();

		const response1 = await gql(
			MUTATIONS.UPDATE_PRODUCT_SILL_DATAS_BY_USER,
			{
				productIds: data.productIds,
				[`data_${lowerCode}`]: data.value,
			},
			false,
		);

		if (response1.errors) {
			alert(response1.errors[0].message);
			exit();
			return;
		}

		runInAction(() => {
			this.itemInfo.items[index][`sillData${marketCode}`] = data.value;
			floatingToast('상품정보제공고시 상세정보가 변경되었습니다.', 'success');
			exit();
		});
	};

	/** 고시정보 자동매칭 */
	updateProdutSillsAuto = async (value: any, index: number) => {
		let sillCode: any = {};
		let sillData: any = {};

		switch (value) {
			case 'AUTO': {
				sillCode = {
					productIds: [this.itemInfo.items[index].id],
					code_a077: this.itemInfo.items[index].categoryInfoA077.sillInfoA077.code,
					code_b378: this.itemInfo.items[index].categoryInfoB378.sillInfoB378.code,
					code_a112: this.itemInfo.items[index].categoryInfoA112.sillInfoA112.code,
					code_a113: this.itemInfo.items[index].categoryInfoA113.sillInfoA113.code,
					code_a001: this.itemInfo.items[index].categoryInfoA001.sillInfoA001.code,
					code_a006: this.itemInfo.items[index].categoryInfoA006.sillInfoA006.code,
					code_a027: this.itemInfo.items[index].categoryInfoA027.sillInfoA027.code,
					code_b719: this.itemInfo.items[index].categoryInfoB719.sillInfoB719.code,
					code_a524: this.itemInfo.items[index].categoryInfoA524.sillInfoA524.code,
					code_a525: this.itemInfo.items[index].categoryInfoA525.sillInfoA525.code,
					code_b956: this.itemInfo.items[index].categoryInfoB956.sillInfoB956.code,
				};
				break;
			}

			case 'ETC': {
				sillCode = {
					productIds: [this.itemInfo.items[index].id],
					code_a077:
						this.itemInfo.items[index].categoryInfoA077.activeSillDataA077.find(
							(v) => v.code !== this.itemInfo.items[index].categoryInfoA077.sillInfoA077.code,
						)?.code ?? this.itemInfo.items[index].categoryInfoA077.sillInfoA077.code,
					code_b378:
						this.itemInfo.items[index].categoryInfoB378.activeSillDataB378.find(
							(v) => v.code !== this.itemInfo.items[index].categoryInfoB378.sillInfoB378.code,
						)?.code ?? this.itemInfo.items[index].categoryInfoB378.sillInfoB378.code,
					code_a112:
						this.itemInfo.items[index].categoryInfoA112.activeSillDataA112.find(
							(v) => v.code !== this.itemInfo.items[index].categoryInfoA112.sillInfoA112.code,
						)?.code ?? this.itemInfo.items[index].categoryInfoA112.sillInfoA112.code,
					code_a113:
						this.itemInfo.items[index].categoryInfoA113.activeSillDataA113.find(
							(v) => v.code !== this.itemInfo.items[index].categoryInfoA113.sillInfoA113.code,
						)?.code ?? this.itemInfo.items[index].categoryInfoA113.sillInfoA113.code,
					code_a001:
						this.itemInfo.items[index].categoryInfoA001.activeSillDataA001.find(
							(v) => v.code !== this.itemInfo.items[index].categoryInfoA001.sillInfoA001.code,
						)?.code ?? this.itemInfo.items[index].categoryInfoA001.sillInfoA001.code,
					code_a006:
						this.itemInfo.items[index].categoryInfoA006.activeSillDataA006.find(
							(v) => v.code !== this.itemInfo.items[index].categoryInfoA006.sillInfoA006.code,
						)?.code ?? this.itemInfo.items[index].categoryInfoA006.sillInfoA006.code,
					code_a027:
						this.itemInfo.items[index].categoryInfoA027.activeSillDataA027.find(
							(v) => v.code !== this.itemInfo.items[index].categoryInfoA027.sillInfoA027.code,
						)?.code ?? this.itemInfo.items[index].categoryInfoA027.sillInfoA027.code,
					code_b719:
						this.itemInfo.items[index].categoryInfoB719.activeSillDataB719.find(
							(v) => v.code !== this.itemInfo.items[index].categoryInfoB719.sillInfoB719.code,
						)?.code ?? this.itemInfo.items[index].categoryInfoB719.sillInfoB719.code,
					code_a524:
						this.itemInfo.items[index].categoryInfoA524.activeSillDataA524.find(
							(v) => v.code !== this.itemInfo.items[index].categoryInfoA524.sillInfoA524.code,
						)?.code ?? this.itemInfo.items[index].categoryInfoA524.sillInfoA524.code,
					code_a525:
						this.itemInfo.items[index].categoryInfoA525.activeSillDataA525.find(
							(v) => v.code !== this.itemInfo.items[index].categoryInfoA525.sillInfoA525.code,
						)?.code ?? this.itemInfo.items[index].categoryInfoA525.sillInfoA525.code,
					code_b956:
						this.itemInfo.items[index].categoryInfoB956.activeSillDataB956.find(
							(v) => v.code !== this.itemInfo.items[index].categoryInfoB956.sillInfoB956.code,
						)?.code ?? this.itemInfo.items[index].categoryInfoB956.sillInfoB956.code,
				};
				break;
			}
		}

		const response1 = await gql(MUTATIONS.UPDATE_PRODUCT_SILL_CODES_BY_USER, sillCode, false);

		if (response1.errors) return alert(response1.errors[0].message);

		sillData = {
			productIds: [this.itemInfo.items[index].id],
			data_a077: this.itemInfo.items[index].categoryInfoA077.activeSillDataA077.find(
				(v) => v.code === sillCode.code_a077,
			).data,
			data_b378: this.itemInfo.items[index].categoryInfoB378.activeSillDataB378.find(
				(v) => v.code === sillCode.code_b378,
			).data,
			data_a112: this.itemInfo.items[index].categoryInfoA112.activeSillDataA112.find(
				(v) => v.code === sillCode.code_a112,
			).data,
			data_a113: this.itemInfo.items[index].categoryInfoA113.activeSillDataA113.find(
				(v) => v.code === sillCode.code_a113,
			).data,
			data_a001: this.itemInfo.items[index].categoryInfoA001.activeSillDataA001.find(
				(v) => v.code === sillCode.code_a001,
			).data,
			data_a006: this.itemInfo.items[index].categoryInfoA006.activeSillDataA006.find(
				(v) => v.code === sillCode.code_a006,
			).data,
			data_a027: this.itemInfo.items[index].categoryInfoA027.activeSillDataA027.find(
				(v) => v.code === sillCode.code_a027,
			).data,
			data_b719: this.itemInfo.items[index].categoryInfoB719.activeSillDataB719.find(
				(v) => v.code === sillCode.code_b719,
			).data,
			data_a524: this.itemInfo.items[index].categoryInfoA524.activeSillDataA524.find(
				(v) => v.code === sillCode.code_a524,
			).data,
			data_a525: this.itemInfo.items[index].categoryInfoA525.activeSillDataA525.find(
				(v) => v.code === sillCode.code_a525,
			).data,
			data_b956: this.itemInfo.items[index].categoryInfoB956.activeSillDataB956.find(
				(v) => v.code === sillCode.code_b956,
			).data,
		};

		const response2 = await gql(MUTATIONS.UPDATE_PRODUCT_SILL_DATAS_BY_USER, sillData, false);

		if (response2.errors) return alert(response2.errors[0].message);

		runInAction(() => {
			this.itemInfo.items[index].sillCodeA077 = sillCode.code_a077;
			this.itemInfo.items[index].sillCodeB378 = sillCode.code_b378;
			this.itemInfo.items[index].sillCodeA112 = sillCode.code_a112;
			this.itemInfo.items[index].sillCodeA113 = sillCode.code_a113;
			this.itemInfo.items[index].sillCodeA001 = sillCode.code_a001;
			this.itemInfo.items[index].sillCodeA006 = sillCode.code_a006;
			this.itemInfo.items[index].sillCodeA027 = sillCode.code_a027;
			this.itemInfo.items[index].sillCodeB719 = sillCode.code_b719;
			this.itemInfo.items[index].sillCodeA524 = sillCode.code_a524;
			this.itemInfo.items[index].sillCodeA525 = sillCode.code_a525;
			this.itemInfo.items[index].sillCodeB956 = sillCode.code_b956;

			this.itemInfo.items[index].sillDataA077 = sillData.data_a077;
			this.itemInfo.items[index].sillDataB378 = sillData.data_b378;
			this.itemInfo.items[index].sillDataA112 = sillData.data_a112;
			this.itemInfo.items[index].sillDataA113 = sillData.data_a113;
			this.itemInfo.items[index].sillDataA001 = sillData.data_a001;
			this.itemInfo.items[index].sillDataA006 = sillData.data_a006;
			this.itemInfo.items[index].sillDataA027 = sillData.data_a027;
			this.itemInfo.items[index].sillDataB719 = sillData.data_b719;
			this.itemInfo.items[index].sillDataA524 = sillData.data_a524;
			this.itemInfo.items[index].sillDataA525 = sillData.data_a525;
			this.itemInfo.items[index].sillDataB956 = sillData.data_b956;
		});
		floatingToast('상품고시정보를 일괄설정하었습니다.', 'success');
	};

	/** 이미지 자동번역 */
	autoImageTranslate = async (index: number, seq: number) => {
		let productIds: any = [];

		if (index === -1) productIds = this.itemInfo.items.filter((v: any) => v.checked).map((v: any) => v.id);
		else productIds = [this.itemInfo.items[index].id];

		if (productIds.length < 1) return alert('상품이 선택되지 않았습니다.');
		if (productIds.length > 10) return alert('일괄번역은 한번에 10개씩 가능합니다.');

		for (let i = 0; i <= productIds.length; i++) {
			const item = this.itemInfo.items.find((v) => v.id === productIds[i]);

			if (!item) continue;

			item.translate = true;

			if (seq === 0 || seq === 1) {
				const tabThumbnails = await createTabCompletely(
					{
						active: false,
						url: chrome.runtime.getURL(`/trangers_multiple.html?id=${item.id}&type=1`),
					},
					10,
				);
				const resThumbnails = await sendTabMessage(tabThumbnails.id, {
					action: 'auto-translate',
				});

				if (!resThumbnails) {
					floatingToast('썸네일이미지 번역이 중단되었습니다.', 'failed');
					runInAction(() => (item.translate = false));

					return;
				}
			}

			if (seq === 0 || seq === 2) {
				const tabOptions = await createTabCompletely(
					{
						active: false,
						url: chrome.runtime.getURL(`/trangers_multiple.html?id=${item.id}&type=2`),
					},
					10,
				);
				const resOptions = await sendTabMessage(tabOptions.id, {
					action: 'auto-translate',
				});

				if (!resOptions) {
					floatingToast('옵션이미지 번역이 중단되었습니다.', 'failed');

					runInAction(() => (item.translate = false));
					return;
				}
			}

			if (seq === 0 || seq === 3) {
				const tabDescriptions = await createTabCompletely(
					{
						active: false,
						url: chrome.runtime.getURL(`/trangers_multiple.html?id=${item.id}&type=3`),
					},
					10,
				);
				const resDescriptions = await sendTabMessage(tabDescriptions.id, {
					action: 'auto-translate',
				});

				if (!resDescriptions) {
					floatingToast('상세이미지 번역이 중단되었습니다.', 'failed');

					runInAction(() => (item.translate = false));
					return;
				}
			}

			runInAction(() => (item.translate = false));
		}
	};

	/** 그리드뷰 */
	setGridView = async (commonStore: common, value: boolean) => {
		if (this.gridView === value) return;

		let auth = await getLocalStorage<AppInfo>('appInfo');

		auth.gridView = value;

		await setLocalStorage({ appInfo: auth });

		runInAction(() => {
			this.itemInfo.loading = true;
			this.gridView = value;
		});

		await this.setPageSize(10);
		await this.getProduct(commonStore, this.page);

		runInAction(() => {
			if (value) {
				this.itemInfo.items.sort((a, b) => {
					if (b.thumbData > a.thumbData) return 1;
					else if (a.thumbData > b.thumbData) return -1;

					return 0;
				});
			}
		});
	};

	/** 상세페이지 미리보기 */
	getPreview = async (productId: number, market: string) => {
		const response = await gql(QUERIES.GET_REGISTER_PRODUCTS_DATA_BY_USER, {
			productIds: [productId],
			siteCode: [market],
		});

		runInAction(
			() =>
				(this.manyDescriptionInfo.previewHtml = JSON.parse(
					response.data.getRegisterProductsDataByUser,
				)[0]?.DShopInfo?.DataDataSet?.data[0]?.content),
		);
	};
}
