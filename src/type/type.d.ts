import { ITextOptions, TextOptions } from 'fabric/fabric-impl';

/** 오픈마켓종류 정의 */
export type Shop =
	| 'alibaba'
	| 'amazon'
	| 'amazon1'
	| 'amazon2'
	| 'express'
	| 'taobao1'
	| 'taobao2'
	| 'tmall1'
	| 'tmall2'
	| 'vvic';

/** 상품 */
export type Product = {
	id: number;
	productCode: string;
	description: string;
	imageThumbnail: string[];
	productOptionName: {
		productOptionValue: {
			id: number;
			image: string | null | undefined;
		}[];
	}[];
	activeTaobaoProduct: {
		shopName: string | null | undefined;
	};
};

// export type Layer = {
// 	index: number;
// 	image: { current: string; origin: string };
// 	object: {
// 		angle?: any;
// 		rect?: fabric.Rect;
// 		text?: any;
// 		object: string;
// 		pos: { x: number; y: number }[];
// 		foreground?: any;
// 		original?: any;
// 		background?: { R: number; G: number; B: number };
// 		shapeOption?: { strokeWidth: number | null; rx: number | null; ry: number | null };
// 		translated?: string;
// 		copyX?: number;
// 		copyY?: number;
// 		textOption?: {
// 			size?: number;
// 			direction?: string;
// 			bold: string;
// 			font: string;
// 			italic: string;
// 			lineThrough: any;
// 			underLine: any;
// 		};
// 	}[];
// 	state: {
// 		check: string;
// 		current: any;
// 		redo: { canvas: any[]; object: any[] };
// 		undo: { canvas: any[]; object: any[] };
// 	};
// 	type: string;
// };

export type AppInfo = {
	id: string;
	password: string;
	accessToken: string;
	refreshToken: string;
	loading: boolean;
	autoFill: boolean;
	autoLogin: boolean;
	pageSize: number;
	gridView: boolean;
	darkTheme: boolean;
};

export type BulkInfo = {
	current: number;
	currentPage: number;
	inputs: (CollectInfo['inputs'][number] & { keywardMemo?: string })[];
	isBulk: boolean;
	isCancel: boolean;
	isComplete: boolean;
	isExcel: boolean;
	results: any[];
	sender: Sender;
};

export type UploadInfo = {
	stopped: boolean;
	editable: boolean;
	uploadable: boolean;
	markets: {
		code: string;
		name: string;
		connected: boolean;
		disabled: boolean;
		upload: boolean;
		video: boolean;
		progress: number;
		policyInfo?: any;
	}[];
};

export type UploadDisabledInfo = {
	markets: {
		code: string;
		disabled: boolean;
		progress: number;
		upload: boolean;
	}[];
};

export type ItemInfo = {
	checkedAll: boolean;
	current: number;
	items: Item[];
	loading: boolean;
};

export type ModalInfo = {
	addOptionName: boolean;
	attribute: boolean;
	category: boolean;
	collectExcel: boolean;
	description: boolean;
	fee: boolean;
	name: boolean;
	price: boolean;
	replaceOptionName: boolean;
	tag: boolean;
	upload: boolean;
	uploadTabIndex: number;
	uploadDisabled: boolean;
	uploadFailed: boolean;
	locked: boolean;
	myKeywarded: boolean;
	userFilter?: boolean;
};

export type Nullable<T> = T | null | undefined;

export type ManyPriceInfo = {
	price?: number;
	cnyRate: number;
	marginRate: number;
	marginUnitType: number | string;
	localShippingFee: number;
	localShippingCode?: string;
	shippingFee: number;
	refundShippingFee: number;
};

/** common -> User타입 */
export type User = {
	userInfo: UserInfo;
	createdToken?: any;
	purchaseInfo2?: any;
	productCount: number;
	email: string;
	credit?: any;
	id: number;
	refCode: string | null;
	connectedUsers?: any;
	refAvailable: boolean;
	keywardMemo?: any;
};

/** ChromeAsync 런타임메시지 파라미터 타입 */
export type RuntimeMessage = {
	action: string;
	source?: Source;
	form?: { url: string; requestInit?: RequestInit }; // fetch요청시 사용
};

type Item = {
	id: number;
	tagInfo: any;
	state: number;
	createdAt: Date;
	stockUpdatedAt: Date;
	categoryInfoA077: { code: string | null; name: string; activeSillDataA077?: any; sillInfoA077?: any };
	categoryInfoB378: { code: string | null; name: string; activeSillDataB378?: any; sillInfoB378?: any };
	categoryInfoA112: { code: string | null; name: string; activeSillDataA112?: any; sillInfoA112?: any };
	categoryInfoA113: { code: string | null; name: string; activeSillDataA113?: any; sillInfoA113?: any };
	categoryInfoA006: { code: string | null; name: string; activeSillDataA006?: any; sillInfoA006?: any };
	categoryInfoA001: { code: string | null; name: string; activeSillDataA001?: any; sillInfoA001?: any };
	categoryInfoA027: { code: string | null; name: string; activeSillDataA027?: any; sillInfoA027?: any };
	categoryInfoB719: { code: string | null; name: string; activeSillDataB719?: any; sillInfoB719?: any };
	categoryInfoA524: { code: string | null; name: string; activeSillDataA524?: any; sillInfoA524?: any };
	categoryInfoA525: { code: string | null; name: string; activeSillDataA525?: any; sillInfoA525?: any };
	categoryInfoB956: { code: string | null; name: string; activeSillDataB956?: any; sillInfoB956?: any };
	edited: any;
	checked: boolean;
	name: string;
	delete: boolean;
	searchTags: string;
	immSearchTags: string;
	immSearchTagsTemp: any;
	imageThumbnail: string[];
	price: number;
	cnyRate: number;
	marginRate: number;
	marginUnitType: string;
	productOption: any;
	activeTaobaoProduct: any;
	productOptionName: {
		productOptionValue: {
			id: number;
			image: string | null | undefined;
			name?: string;
		}[];
	}[];
	localShippingFee: number;
	shippingFee: number;
	refundShippingFee: number;
	localShippingCode: string;
	descriptionImages: any;
	description: string;
	naverFee: number;
	coupangFee: number;
	streetFee: number;
	streetNormalFee: number;
	auctionFee: number;
	gmarketFee: number;
	interparkFee: number;
	wemakepriceFee: number;
	lotteonFee: number;
	lotteonNormalFee: number;
	tmonFee: number;
	collapse: any;
	optionCollapse: any;
	activeProductStore: { siteCode: string; state: number; storeUrl: string; inflow: any }[];
	myLock: number;
	productCode: string;
	tabs: any;
	productStore: { siteCode: string; state: number; storeUrl: string }[];
	isImageTranslated: boolean;
	error: boolean;
	optionPriceError: boolean;
	optionNameError: boolean; // 옵션이름이 같은것이 있을경우 에러 (추가사항)
	thumbnailImageError: boolean;
	optionImageError: boolean;
	descriptionImageError: boolean;
	searchTagError: any;
	imageCheckList: any;
	myKeyward: string;
	attribute: any;
	manuFacturer: string;
	brandName: string;
	modelName: string;
	translate: boolean;
	thumbData: any;
	sillCodeA077: string;
	sillCodeB378: string;
	sillCodeA112: string;
	sillCodeA113: string;
	sillCodeA001: string;
	sillCodeA006: string;
	sillCodeA027: string;
	sillCodeB719: string;
	sillCodeA524: string;
	sillCodeA525: string;
	sillCodeB956: string;
	sillDataA077: string;
	sillDataB378: string;
	sillDataA112: string;
	sillDataA113: string;
	sillDataA001: string;
	sillDataA006: string;
	sillDataA027: string;
	sillDataB719: string;
	sillDataA524: string;
	sillDataA525: string;
	sillDataB956: string;
};

/** common -> User -> UserInfo 타입 */
type UserInfo = {
	phone: string;
	streetApiKey: string | undefined;
	streetApiKey2: string | undefined;
	streetApiKey3: string | undefined;
	streetApiKey4: string | undefined;
	streetNormalApiKey: string | undefined;
	streetNormalApiKey2: string | undefined;
	streetNormalApiKey3: string | undefined;
	streetNormalApiKey4: string | undefined;
	productCollectCount: number;
	naverStoreUrl: string;
	naverUseType: 'Y' | 'N';
	coupangLoginId: string;
	coupangVendorId: string;
	coupangAccessKey: string;
	coupangSecretKey: string;
	coupangUseType: 'Y' | 'N';
	coupangImageOpt: 'Y' | 'N';
	streetUseKeyType: string;
	streetUseType: 'Y' | 'N';
	streetNormalUseKeyType: string;
	streetNormalUseType: 'Y' | 'N';
	esmplusGmarketId: string;
	gmarketUseType: 'Y' | 'N';
	esmplusAuctionId: string;
	auctionUseType: 'Y' | 'N';
	interparkCertKey: string;
	interparkSecretKey: string;
	interparkEditCertKey: string;
	interparkEditSecretKey: string;
	interparkUseType: 'Y' | 'N';
	wemakepriceId: string;
	wemakepriceUseType: 'Y' | 'N';
	lotteonVendorId: string;
	lotteonApiKey: string;
	lotteonSellerType: string;
	lotteonUseType: 'Y' | 'N';
	tmonId: string;
	tmonUseType: 'Y' | 'N';
	cnyRate: number;
	marginRate: number;
	marginUnitType: any;
	defaultShippingFee: number;
	extraShippingFee: number;
	refundShippingFee: number;
	sillFromCategory: string;
	calculateWonType: any;
	descriptionShowTitle: string;
	autoPrice: string;
	additionalShippingFeeJeju: number;
	asTel: string;
	asInformation: string;
	naverOriginCode: string;
	naverOrigin: any;
	exchangeShippingFee: number;
	discountAmount: number;
	discountUnitType: any;
	naverStoreOnly: string;
	cnyRateDollar: number;
	cnyRateEuro: number;
	cnyRateYen: number;
	collectStock: number;
	fixImageTop: string | null;
	fixImageSubTop: string | null;
	fixImageBottom: string | null;
	fixImageSubBottom: string | null;
	optionAlignTop: string;
	useDetailInformation: string;
	optionIndexType: number;
	optionTwoWays: string;
	defaultPrice: string;
	collectTimeout: number;
	collectCheckPosition: string;
	thumbnailRepresentNo: string;
	orderToDeliveryName: string;
	orderToDeliveryMembership: string;
	orderToDeliveryMethod: string;
	naverFee: number;
	coupangFee: number;
	streetFee: number;
	streetNormalFee: number;
	gmarketFee: number;
	auctionFee: number;
	interparkFee: number;
	wemakepriceFee: number;
	lotteonFee: number;
	lotteonNormalFee: number;
	tmonFee: number;
	coupangDefaultOutbound: string;
	naverAutoSearchTag: string;
	coupangDefaultInbound: string;
	coupangOutboundShippingTimeDay: number;
	coupangUnionDeliveryType: string;
	coupangMaximumBuyForPerson: number;
	streetDefaultInbound: string;
	streetNormalOutbound: string;
	streetDefaultOutbound: string;
	streetNormalInbound: string;
	streetApiMemo: string;
	streetApiMemo2: string;
	streetApiMemo3: string;
	streetApiMemo4: string;
	streetNormalApiMemo: string;
	streetNormalApiMemo2: string;
	streetNormalApiMemo3: string;
	streetNormalApiMemo4: string;
	asInfo: any;
};

/** 대량수집시 크롬스토리지에 저장하는 수집정보타입 */
export type CollectInfo = {
	categoryId: string;
	currentPage: number;
	inputs: {
		productName: string;
		productTags: string;
		url: string;
	}[];
	maxLimits: number;
	myKeyward: string;
	pageEnd: number;
	pageStart: number;
	sender: Sender;
	type: string;
	useMedal: boolean;
	useStandardShipping: boolean;
	pageList: any;
};

export type Sender = {
	documentId: string;
	documentLifecycle: string;
	frameId: number;
	id: string;
	origin: string;
	tab: chrome.tabs.Tab;
	url: string;
};

export type Source = {
	data: CollectInfo['inputs'];
	retry: boolean;
};

export type CategoryInfo = {
	code: string;
	depth1: string;
	depth2?: string;
	depth3?: string;
	depth4?: string;
	depth5?: string;
	depth6?: string;
	name: string;
	sillCode: string;
};

export type RestrictWordInfo = {
	banChecked: boolean[];
	banList: { id: number; findWord: string; replaceWord: null }[];
	banExcelInput: any;
	banWordInput: string;

	findWordInput: string;

	replaceChecked: boolean[];
	replaceList: { id: number; findWord: string; replaceWord: string }[];
	replaceExcelInput: any;
	replaceWordInput: string;

	loading: boolean;
};
