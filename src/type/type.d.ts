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
	marginUnitType: string;
	localShippingFee: number;
	localShippingCode?: string;
	shippingFee: number;
	refundShippingFee: number;
};

export type User = {
	userInfo: any;
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
	thumbnailImageError: boolean;
	optionImageError: boolean;
	descriptionImageError: boolean;
	imageCheckList: any;
	myKeyward: any;
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
