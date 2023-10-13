import { ITextOptions, TextOptions } from 'fabric/fabric-impl';

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
	source?: { data: any; retry?: boolean };
	form?: { url: string; requestInit?: RequestInit }; // fetch요청시 사용
};

type Item = {
	id: number;
	tagInfo: any;
	state: number;
	createdAt: Date;
	stockUpdatedAt: Date;
	categoryInfoA077: any;
	categoryInfoB378: any;
	categoryInfoA112: any;
	categoryInfoA113: any;
	categoryInfoA006: any;
	categoryInfoA001: any;
	categoryInfoA027: any;
	categoryInfoB719: any;
	categoryInfoA524: any;
	categoryInfoA525: any;
	categoryInfoB956: any;
	edited: any;
	checked: boolean;
	name: string;
	delete: boolean;
	searchTags: any;
	immSearchTags: any;
	immSearchTagsTemp: any;
	imageThumbnail: string[];
	price: number;
	cnyRate: number;
	marginRate: number;
	marginUnitType: any;
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
	description: any;
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
	activeProductStore: any;
	myLock: any;
	productCode: string;
	tabs: any;
	productStore: any;
	isImageTranslated: boolean;
	error: boolean;
	optionPriceError: boolean;
	optionNameError: boolean; // 옵션이름이 같은것이 있을경우 에러 (추가사항)
	thumbnailImageError: boolean;
	optionImageError: boolean;
	descriptionImageError: boolean;
	searchTagError: any;
	imageCheckList: any;
	myKeyward: any;
	attribute: any;
	manuFacturer: any;
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

	sillDataA077: any;
	sillDataB378: any;
	sillDataA112: any;
	sillDataA113: any;
	sillDataA001: any;
	sillDataA006: any;
	sillDataA027: any;
	sillDataB719: any;
	sillDataA524: any;
	sillDataA525: any;
	sillDataB956: any;
};

type UserInfo = {
	phone: string;
	streetApiKey: string;
	streetApiKey2: string;
	streetApiKey3: string;
	streetApiKey4: string;
	streetNormalApiKey: string;
	streetNormalApiKey2: string;
	streetNormalApiKey3: string;
	streetNormalApiKey4: string;
	productCollectCount: number;
	naverStoreUrl: string;
	naverUseType: 'Y' | 'N';
	coupangLoginId: string;
	coupangVendorId: string;
	coupangAccessKey: string;
	coupangSecretKey: string;
	coupangUseType: 'Y' | 'N';
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
	sillFromCategory: 'Y' | 'N';
	calculateWonType: any;
	descriptionShowTitle: 'Y' | 'N';
	autoPrice: 'Y' | 'N';
	additionalShippingFeeJeju: number;
	asTel: string;
	asInformation: string;
	naverOriginCode: string;
	naverOrigin: any;
	exchangeShippingFee: number;
	discountAmount: number;
	discountUnitType: any;
	naverStoreOnly: 'Y' | 'N';
	cnyRateDollar: number;
	cnyRateEuro: number;
	cnyRateYen: number;
	collectStock: number;
	fixImageTop: string;
	fixImageSubTop: string;
	fixImageBottom: string;
	fixImageSubBottom: string;
	optionAlignTop: 'Y' | 'N';
	useDetailInformation: 'Y' | 'N';
	optionIndexType: number;
	optionTwoWays: 'Y' | 'N';
	defaultPrice: 'L' | 'M';
	collectTimeout: number;
	collectCheckPosition: 'L' | 'R';
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
	naverAutoSearchTag: 'Y' | 'N';
	coupangDefaultInbound: string;
	coupangOutboundShippingTimeDay: number;
	coupangUnionDeliveryType: 'Y' | 'N';
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
};
