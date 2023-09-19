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

export type Layer = {
	index: number;
	image: { current: string; origin: string };
	object: {
		angle?: any;
		rect?: fabric.Rect;
		text?: any;
		object: string;
		pos: { x: number; y: number }[];
		foreground?: any;
		original?: any;
		background?: { R: number; G: number; B: number };
		shapeOption?: { strokeWidth: number | null; rx: number | null; ry: number | null };
		translated?: string;
		copyX?: number;
		copyY?: number;
		textOption?: {
			size?: number;
			direction?: string;
			bold: string;
			font: string;
			italic: string;
			lineThrough: any;
			underLine: any;
		};
	}[];
	state: {
		check: string;
		current: any;
		redo: { canvas: any[]; object: any[] };
		undo: { canvas: any[]; object: any[] };
	};
	type: string;
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
	items: any[];
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
	returnShippingFee: number;
};
