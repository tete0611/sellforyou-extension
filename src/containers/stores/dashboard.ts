// 대시보드 스토리지

import gql from '../../pages/Main/GraphQL/Requests';
import QUERIES from '../../pages/Main/GraphQL/Queries';

import { runInAction, makeAutoObservable } from 'mobx';
import { newOrderSmartStore } from '../../pages/Tools/SmartStore';
import { newOrderCoupang } from '../../pages/Tools/Coupang';
import { newOrderStreet } from '../../pages/Tools/Street';
import { newOrderESMPlus } from '../../pages/Tools/ESMPlus';
import { newOrderLotteon } from '../../pages/Tools/Lotteon';
import { newOrderWemakeprice } from '../../pages/Tools/Wemakeprice';
import { newOrderTmon } from '../../pages/Tools/Tmon';
import { newOrderInterpark } from '../../pages/Tools/Interpark';
import { common } from './common';
import { SHOPCODE } from '../../type/variable';

const {
	AUCTION_1,
	G_MARKET_1,
	COUPANG,
	INTER_PARK,
	LOTTE_ON_GLOBAL,
	LOTTE_ON_NORMAL,
	SMART_STORE,
	STREET11_GLOBAL,
	STREET11_NORMAL,
	TMON,
	WE_MAKE_PRICE,
} = SHOPCODE;

export class dashboard {
	currentNotice: any = {};
	notices: any = [];
	modalInfo: any = {
		notice: false,
	};

	countInfo: any = {
		order: {
			countAll: '-',
			countA077: '-',
			countB378: '-',
			countA112: '-',
			countA113: '-',
			countA027: '-',
			countA001: '-',
			countA006: '-',
			countB719: '-',
			countA524: '-',
			countA525: '-',
			countB956: '-',
		},

		product: {
			collected: '-',
			registered: '-',
			locked: '-',
		},
	};

	constructor() {
		makeAutoObservable(this);
	}

	// 관리상품 수
	getProductCount = async () => {
		const { SELECT_MY_PRODUCT_COUNT_BY_USER } = QUERIES;
		let collectJson;
		let registeredJson;
		let lockJson;
		await Promise.all([
			gql(SELECT_MY_PRODUCT_COUNT_BY_USER, { where: { state: { equals: 6 } } }, false).then((response) => {
				if (!response.errors) collectJson = response.data.selectMyProductsCountByUser.toString();
			}),
			gql(SELECT_MY_PRODUCT_COUNT_BY_USER, { where: { state: { equals: 7 } } }, false).then((response) => {
				if (!response.errors) registeredJson = response.data.selectMyProductsCountByUser.toString();
			}),
			gql(SELECT_MY_PRODUCT_COUNT_BY_USER, { where: { myLock: { equals: 2 } } }, false).then((response) => {
				if (!response.errors) lockJson = response.data.selectMyProductsCountByUser.toString();
			}),
		]);

		runInAction(() => {
			this.countInfo.product.collected = collectJson;
			this.countInfo.product.registered = registeredJson;
			this.countInfo.product.locked = lockJson;
		});
	};

	// 신규주문 수
	getOrderCount = async (commonStore: common) => {
		const order = await Promise.all([
			newOrderSmartStore(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SMART_STORE),
			),
			newOrderCoupang(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === COUPANG),
			),
			newOrderStreet(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === STREET11_GLOBAL),
			),
			newOrderStreet(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === STREET11_NORMAL),
			),
			newOrderESMPlus(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === AUCTION_1),
			),
			newOrderESMPlus(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === G_MARKET_1),
			),
			newOrderInterpark(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === INTER_PARK),
			),
			newOrderWemakeprice(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === WE_MAKE_PRICE),
			),
			newOrderLotteon(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === LOTTE_ON_GLOBAL),
			),
			newOrderLotteon(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === LOTTE_ON_NORMAL),
			),
			newOrderTmon(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === TMON),
			),
		]);

		let newOrders: any = [];

		order.map((v) => {
			newOrders = newOrders.concat(v);
		});

		runInAction(() => {
			this.countInfo.order.countAll = newOrders.length;
			this.countInfo.order.countA077 = newOrders.filter((v) => v.marketCode === SMART_STORE).length.toString();
			this.countInfo.order.countB378 = newOrders.filter((v) => v.marketCode === COUPANG).length.toString();
			this.countInfo.order.countA112 = newOrders.filter((v) => v.marketCode === STREET11_GLOBAL).length.toString();
			this.countInfo.order.countA113 = newOrders.filter((v) => v.marketCode === STREET11_NORMAL).length.toString();
			this.countInfo.order.countA027 = newOrders.filter((v) => v.marketCode === INTER_PARK).length.toString();
			this.countInfo.order.countA001 = newOrders.filter((v) => v.marketCode === AUCTION_1).length.toString();
			this.countInfo.order.countA006 = newOrders.filter((v) => v.marketCode === G_MARKET_1).length.toString();
			this.countInfo.order.countB719 = newOrders.filter((v) => v.marketCode === WE_MAKE_PRICE).length.toString();
			this.countInfo.order.countA524 = newOrders.filter((v) => v.marketCode === LOTTE_ON_GLOBAL).length.toString();
			this.countInfo.order.countA525 = newOrders.filter((v) => v.marketCode === LOTTE_ON_NORMAL).length.toString();
			this.countInfo.order.countB956 = newOrders.filter((v) => v.marketCode === TMON).length.toString();
		});
	};

	// 공지사항 불러오기
	loadNotices = async () => {
		const response = await gql(QUERIES.SELECT_NOTICES_BY_EVERYONE, { orderBy: { createdAt: 'desc' }, take: 13 }, false);

		if (response.errors) return alert(response.errors[0].message);

		runInAction(() => (this.notices = response.data.selectNoticesByEveryone));
	};

	// 공지사항 상세보기 설정
	setCurrentNotice = (value: any) => (this.currentNotice = value);

	// 공지사항 모달 ON/OFF
	toggleNoticeModal = (value: boolean) => (this.modalInfo.notice = value);
}
