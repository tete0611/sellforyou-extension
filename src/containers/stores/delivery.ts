// 미사용 스토리지 (주문발송관리)

import { runInAction, makeAutoObservable } from 'mobx';
import { getLocalStorage, setLocalStorage } from '../../pages/Tools/ChromeAsync';
import { checkIndividualCustomUniqueCode, downloadExcel, floatingToast } from '../../../common/function';
import { deliveryOrderCoupang } from '../../pages/Tools/Coupang';
import { getBaruenjgForm } from '../../pages/Tools/DC/Baruenjg';
import { getBigboyForm } from '../../pages/Tools/DC/Bigboy';
import { getChilogisForm } from '../../pages/Tools/DC/Chilogis';
import { getFirstbdgForm } from '../../pages/Tools/DC/Firstbdg';
import { getJik9tongForm } from '../../pages/Tools/DC/Jik9tong';
import { getQuickstarForm } from '../../pages/Tools/DC/Quickstar';
import { getSendyoForm } from '../../pages/Tools/DC/Sendyo';
import { getShipdaForm } from '../../pages/Tools/DC/Shipda';
import { getSilkroadForm } from '../../pages/Tools/DC/Silkroad';
import { getTabaeForm } from '../../pages/Tools/DC/Tabae';
import { getTaobanjeomForm } from '../../pages/Tools/DC/Taobanjeom';
import { getTaoworldForm } from '../../pages/Tools/DC/Taoworld';
import { getThebayForm } from '../../pages/Tools/DC/Thebay';
import { deliveryOrderESMPlus } from '../../pages/Tools/ESMPlus';
import { deliveryOrderLotteon } from '../../pages/Tools/Lotteon';
import { deliveryOrderSmartStore } from '../../pages/Tools/SmartStore';
import { deliveryOrderStreet } from '../../pages/Tools/Street';
import { getTaobaoOrder } from '../../pages/Tools/Taobao';
import { deliveryOrderWemakeprice } from '../../pages/Tools/Wemakeprice';
import { common } from './common';
import { SHOPCODE } from '../../type/variable';

export class delivery {
	count: number = 0;

	orderInfo: any = {
		current: 0,

		searchType: 'ALL',

		taobaoId: '',

		orders: [],
		ordersFiltered: [],

		loading: false,
		initializing: false,
		checkedAll: false,
	};

	modalInfo: any = {
		delivery: false,
		manyDeliveryInfo: false,
	};

	manyDeliveryInfo: any = {
		category: {
			name: '',
			code: '',
		},

		input: '',
		membership: '',
		method: '',
		name: '',
	};

	deliveryData: any = [];
	deliveryList: Array<any> = [
		{
			name: '더베이',
			membership: true,
			hscode: true,
			method: false,
		},

		{
			name: '바른직구',
			membership: false,
			hscode: true,
			method: false,
		},

		{
			name: '보내요',
			membership: false,
			hscode: true,
			method: false,
		},

		{
			name: '빅보이',
			membership: false,
			hscode: false,
			method: true,
		},

		{
			name: '쉽다',
			membership: false,
			hscode: true,
			method: false,
		},

		{
			name: '실크로드코리아',
			membership: false,
			hscode: false,
			method: true,
		},

		{
			name: '직구통',
			membership: false,
			hscode: true,
			method: true,
		},

		{
			name: '차이로지스',
			membership: false,
			hscode: true,
			method: true,
		},

		{
			name: '퀵스타',
			membership: false,
			hscode: true,
			method: true,
		},

		{
			name: '타배',
			membership: false,
			hscode: true,
			method: true,
		},

		{
			name: '타오반점',
			membership: false,
			hscode: true,
			method: true,
		},

		{
			name: '타오월드',
			membership: false,
			hscode: true,
			method: true,
		},

		{
			name: '퍼스트배대지',
			membership: false,
			hscode: false,
			method: true,
		},
	];

	constructor() {
		makeAutoObservable(this);
	}

	getDeliveryInfo = async () => {
		const deliveryResp = await fetch(chrome.runtime.getURL('resources/delivery.json'));
		const deliveryJson = await deliveryResp.json();

		this.deliveryData = deliveryJson;
	};

	setSearchType = (value: string) => {
		this.orderInfo.loading = true;
		this.orderInfo.searchType = value;
		this.loadOrders();
	};

	connectOrderInfo = async (index: number, commonStore: common) => {
		this.orderInfo.loading = true;

		const order = await Promise.all([
			deliveryOrderSmartStore(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.SMART_STORE),
			),
			deliveryOrderCoupang(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.COUPANG),
			),
			deliveryOrderStreet(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.LOTTE_ON_GLOBAL),
			),
			deliveryOrderStreet(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.LOTTE_ON_NORMAL),
			),
			deliveryOrderESMPlus(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.AUCTION_1),
			),
			deliveryOrderESMPlus(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.G_MARKET_1),
			),
			deliveryOrderWemakeprice(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.WE_MAKE_PRICE),
			),
			deliveryOrderLotteon(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.LOTTE_ON_GLOBAL),
			),
			deliveryOrderLotteon(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.LOTTE_ON_NORMAL),
			),
			// deliveryOrderTmon(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'B956')),
		]);

		let newOrders = [];

		order.map((v: any) => (newOrders = newOrders.concat(v)));

		runInAction(async () => {
			this.orderInfo.orders = await Promise.all(
				this.orderInfo.orders.map(async (v: any, i: number) => {
					if (!v.trackingNumber) {
						v.error = '트래킹번호가 검색되지 않았습니다.';

						return v;
					}

					let found = false;

					v.deliveryMessage.split(' ').map((w: any) => {
						if (found) return;

						const matched: any = newOrders.find((x: any) => w === x.orderNo);

						if (!matched) return;

						v.connected = matched;

						if (!v.deliveryInfo)
							v.deliveryInfo = {
								category: {
									name: '',
									code: '',
								},

								input: '',
								membership: '',
								method: '',
								name: '',
							};

						newOrders = newOrders.filter((x: any) => matched.orderNo !== x.orderNo);

						found = true;
					});

					if (v.connected) {
						v.error = ``;
						v.icucResult = await checkIndividualCustomUniqueCode(v.connected, true);
					} else v.error = `주문정보가 존재하지 않거나 발송이 완료된 주문 건입니다.`;

					return v;
				}),
			);
		});

		const filtered = this.orderInfo.orders.filter((v: any) => v.connected);

		if (filtered.length <= 0) {
			floatingToast('연동된 주문이 존재하지 않습니다.', 'failed');

			this.orderInfo.loading = false;

			return;
		}

		runInAction(() => (this.orderInfo.searchType = 'ORDER_CONNECTED'));

		floatingToast(`주문 ${filtered.length}건이 연동되었습니다.`, 'success');

		this.loadOrders();

		await setLocalStorage({
			[`taobaoInfo-${this.orderInfo.taobaoId}`]: JSON.parse(JSON.stringify(this.orderInfo.orders)),
		});
	};

	getExternalOrders = async () => {
		this.orderInfo.initializing = true;

		const results: any = await getTaobaoOrder();

		if (!results) {
			runInAction(() => (this.orderInfo.initializing = false));

			return;
		}

		const orders = results.taobaoData.map((v: any) => ({
			...v,
			checked: false,
		}));

		runInAction(() => {
			this.orderInfo = {
				...this.orderInfo,
				orders,
				taobaoId: results.taobaoId,
			};

			this.orderInfo.initializing = false;
		});

		this.loadOrders();
	};

	loadOrders = () => {
		this.orderInfo.loading = true;
		const type = this.orderInfo.searchType;

		switch (type) {
			case 'ALL': {
				this.orderInfo.ordersFiltered = this.orderInfo.orders;
				break;
			}
			case 'ORDER_CONNECTED': {
				this.orderInfo.ordersFiltered = this.orderInfo.orders.filter((v: any) => !v.completed && v.connected);
				break;
			}
			case 'ORDER_NOT_CONNECTED': {
				this.orderInfo.ordersFiltered = this.orderInfo.orders.filter(
					(v: any) => !v.completed && !v.connected && v.error,
				);
				break;
			}
			case 'ORDER_COMPLETED': {
				this.orderInfo.ordersFiltered = this.orderInfo.orders.filter((v: any) => v.completed && v.connected);
				break;
			}
		}

		// console.log(this.orderInfo.ordersFiltered);

		this.orderInfo.ordersFiltered.map((v: any) => (v.checked = false));

		this.orderInfo.loading = false;
	};

	toggleItemChecked = (index: number, value: boolean) => (this.orderInfo.ordersFiltered[index].checked = value);

	toggleItemCheckedAll = (value: boolean) => {
		this.orderInfo.checkedAll = value;
		this.orderInfo.ordersFiltered.map((v: any) => (v.checked = value));
	};

	setManyOrderToDelivery = async () => {
		let filtered = this.orderInfo.ordersFiltered.filter((v: any) => v.checked && v.connected);

		if (filtered.length <= 0) return floatingToast('연동된 주문이 존재하지 않습니다.', 'failed');

		filtered.map((v) => (v.deliveryInfo = this.manyDeliveryInfo));

		floatingToast(`주문 ${filtered.length}건이 일괄설정되었습니다.`, 'success');

		await setLocalStorage({
			[`taobaoInfo-${this.orderInfo.taobaoId}`]: JSON.parse(JSON.stringify(this.orderInfo.orders)),
		});

		this.toggleManyDeliveryInfoModal(false);
	};

	downloadOrderToDeliveryExcel = async (commonStore: common) => {
		let filtered = this.orderInfo.ordersFiltered.filter((v: any) => v.connected);

		if (filtered.length <= 0) return floatingToast('출력할 주문이 존재하지 않습니다.', 'failed');

		filtered.forEach((v, i) =>
			filtered.map((w) => {
				if (
					!w.connected.index &&
					w.connected.receiverName === v.connected.receiverName &&
					w.connected.receiverTelNo1 === v.connected.receiverTelNo1 &&
					w.connected.receiverIntegratedAddress === v.connected.receiverIntegratedAddress
				)
					w.connected.index = i + 1;
			}),
		);

		let result: any = null;

		switch (commonStore.user.userInfo.orderToDeliveryName) {
			case '더베이': {
				result = await getThebayForm(filtered, commonStore);
				break;
			}

			case '바른직구': {
				result = await getBaruenjgForm(filtered);
				break;
			}

			case '보내요': {
				result = await getSendyoForm(filtered);
				break;
			}

			case '빅보이': {
				result = await getBigboyForm(filtered, commonStore);
				break;
			}

			case '쉽다': {
				result = await getShipdaForm(filtered);
				break;
			}

			case '실크로드코리아': {
				result = await getSilkroadForm(filtered, commonStore);
				break;
			}

			case '직구통': {
				result = await getJik9tongForm(filtered, commonStore);
				break;
			}

			case '차이로지스': {
				result = await getChilogisForm(filtered, commonStore);
				break;
			}

			case '퀵스타': {
				result = await getQuickstarForm(filtered, commonStore);
				break;
			}

			case '타배': {
				result = await getTabaeForm(filtered, commonStore);
				break;
			}

			case '타오반점': {
				result = await getTaobanjeomForm(filtered, commonStore);
				break;
			}

			case '타오월드': {
				result = await getTaoworldForm(filtered, commonStore);
				break;
			}

			case '퍼스트배대지': {
				result = await getFirstbdgForm(filtered, commonStore);
				break;
			}
		}

		if (!result) return;

		downloadExcel(
			result.data,
			result.name,
			`배송신청서_${commonStore.user.userInfo.orderToDeliveryName}`,
			false,
			result.type,
		);

		floatingToast(`주문 ${filtered.length}건이 출력되었습니다.`, 'success');

		runInAction(() => {
			filtered.map((v) => (v.completed = true));

			this.orderInfo.searchType = 'ORDER_COMPLETED';
		});

		this.loadOrders();

		await setLocalStorage({
			[`taobaoInfo-${this.orderInfo.taobaoId}`]: JSON.parse(JSON.stringify(this.orderInfo.orders)),
		});
	};

	toggleDeliveryDetailModal = (value: boolean, index: number) => {
		this.orderInfo.current = index;
		this.modalInfo.delivery = value;
	};

	toggleManyDeliveryInfoModal = (value: boolean) => (this.modalInfo.manyDeliveryInfo = value);

	setManyDeliveryInfo = (data: any) => (this.manyDeliveryInfo = data);

	updateDeliveryInfo = async (data: any, index: number) => {
		this.orderInfo.ordersFiltered[index].deliveryInfo = data;

		await setLocalStorage({
			[`taobaoInfo-${this.orderInfo.taobaoId}`]: JSON.parse(JSON.stringify(this.orderInfo.orders)),
		});
	};

	initDeliveryInfo = async () => {
		const stores = (await getLocalStorage<any>(null)) ?? {};

		await Promise.all(
			Object.keys(stores).map(async (v) => {
				if (v.includes('taobaoInfo')) {
					stores[v]
						.filter((x: any) => x.connected)
						.map((x: any) => {
							x.deliveryInfo = {
								category: {
									name: '',
									code: '',
								},
								input: '',
								membership: '',
								method: '',
								name: '',
							};
						});

					await setLocalStorage({ [v]: stores[v] });
				}
			}),
		);
	};

	deleteOrder = async (index: number) => {
		this.orderInfo.orders = [];
		this.orderInfo.ordersFiltered = [];

		await setLocalStorage({
			[`taobaoInfo-${this.orderInfo.taobaoId}`]: JSON.parse(JSON.stringify(this.orderInfo.orders)),
		});
	};
}
