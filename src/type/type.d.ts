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
	object: any[];
	state: {
		check: string;
		current: any;
		redo: { canvas: any[]; object: any[] };
		undo: { canvas: any[]; object: any[] };
	};
	type: string;
};
