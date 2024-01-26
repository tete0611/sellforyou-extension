// 신규주문 스토리지

import gql from '../../pages/Main/GraphQL/Requests';
import QUERIES from '../../pages/Main/GraphQL/Queries';

import { runInAction, makeAutoObservable } from 'mobx';
import { newOrderSmartStore, productPreparedSmartStore } from '../../pages/Tools/SmartStore';
import { newOrderCoupang, productPreparedCoupang } from '../../pages/Tools/Coupang';
import { newOrderStreet, productPreparedStreet } from '../../pages/Tools/Street';
import { newOrderESMPlus, productPreparedESMPlus } from '../../pages/Tools/ESMPlus';
import { newOrderLotteon, productPreparedLotteon } from '../../pages/Tools/Lotteon';
import { newOrderWemakeprice, productPreparedWemakeprice } from '../../pages/Tools/Wemakeprice';
import { newOrderTmon } from '../../pages/Tools/Tmon';
import { checkIndividualCustomUniqueCode, downloadExcel, floatingToast } from '../../../common/function';
import { newOrderInterpark } from '../../pages/Tools/Interpark';
import { common } from './common';
import { SHOPCODE } from '../../type/variable';

export class order {
	count: number = 0;
	orderInfo: any = {
		orders: [],
		loading: false,
		checkedAll: false,
	};
	modalInfo: any = {
		orderDetail: false,
	};
	constructor() {
		makeAutoObservable(this);
	}

	/** 주문 삭제 */
	deleteOrder = (commonStore: common, orderId: number) => {
		let orderIds: any = [];

		if (orderId === -1) {
			const filtered = this.orderInfo.orders.filter((v: any) => {
				if (v.checked) {
					orderIds.push(v.orderId);
					return false;
				}
				return true;
			});

			if (orderIds.length < 1) return alert('주문이 선택되지 않았습니다.');
			if (
				!confirm(
					`선택한 주문정보 ${orderIds.length}개를 삭제하시겠습니까?\n삭제된 주문정보는 다시 복구하실 수 없습니다.`,
				)
			)
				return;

			runInAction(() => (this.orderInfo.orders = filtered));
		} else {
			const filtered = this.orderInfo.orders.filter((v: any, i: number) => orderId !== i);

			if (!confirm(`주문정보를 삭제하시겠습니까?\n삭제된 주문정보는 다시 복구하실 수 없습니다.`)) return;

			runInAction(() => (this.orderInfo.orders = filtered));
		}

		this.getOrder(false);
	};

	/** 셀포유 상품매칭, 통관부호 검증 */
	getOrder = async (download: boolean) => {
		const productCodes = this.orderInfo.orders
			.filter((v: any) => v.sellerProductManagementCode && v.sellerProductManagementCode.includes('SFY_'))
			.map((v: any) => {
				const code = v.sellerProductManagementCode;
				const codeIndex = parseInt(code.split('_')[1], 36);

				return codeIndex;
			});
		const response = await gql(QUERIES.SELECT_MY_PRODUCT_BY_USER, { where: { id: { in: productCodes } } }, false);
		const results = await Promise.all(
			this.orderInfo.orders.map(async (v: any) => {
				const icucResult = await checkIndividualCustomUniqueCode(v, true);
				const product = response.data.selectMyProductByUser.find(
					(w: any) => w.productCode === v.sellerProductManagementCode,
				);

				if (product)
					product.imageThumbnail = product.imageThumbnail.map((w: any) => {
						return /^https?/.test(w) ? w : `${process.env.SELLFORYOU_MINIO_HTTPS}/${w}`;
					});

				return {
					...v,
					icucResult,
					product,
				};
			}),
		);

		runInAction(() => {
			this.count = results.length;
			this.orderInfo.orders = results;
		});

		if (download) this.itemToExcel(results);
	};

	/** 신규주문 조회 */
	loadOrder = async (commonStore: common) => {
		this.orderInfo.loading = true;

		const order = await Promise.all([
			newOrderSmartStore(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.SMART_STORE),
			),
			newOrderCoupang(commonStore, commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.COUPANG)!),
			newOrderStreet(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.STREET11_GLOBAL),
			),
			newOrderStreet(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.STREET11_NORMAL),
			),
			newOrderESMPlus(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.AUCTION_1),
			),
			newOrderESMPlus(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.G_MARKET_1),
			),
			newOrderInterpark(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.INTER_PARK),
			),
			newOrderWemakeprice(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.WE_MAKE_PRICE),
			),
			newOrderLotteon(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.LOTTE_ON_GLOBAL),
			),
			newOrderLotteon(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.LOTTE_ON_NORMAL),
			),
			newOrderTmon(
				commonStore,
				commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.TMON),
			),
		]);

		let newOrders = [];

		order.map((v: any) => (newOrders = newOrders.concat(v)));

		if (newOrders.length === 0) {
			floatingToast(`신규주문내역이 없습니다.`, 'failed');
			this.orderInfo.loading = false;
			return;
		}

		runInAction(
			() =>
				(this.orderInfo.orders = newOrders.map((v: any) => {
					return {
						...v,
						checked: false,
					};
				})),
		);

		await this.getOrder(true);

		runInAction(() => (this.orderInfo.loading = false));

		floatingToast(`신규주문조회가 완료되었습니다.`, 'success');
	};

	/** 발주 */
	productPrepared = async (commonStore: common, props: any) => {
		if (props === '') {
			await Promise.all([
				productPreparedCoupang(
					commonStore,
					commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.COUPANG),
				),
				productPreparedStreet(
					commonStore,
					commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.LOTTE_ON_GLOBAL),
				),
				productPreparedStreet(
					commonStore,
					commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.LOTTE_ON_NORMAL),
				),
				productPreparedLotteon(
					commonStore,
					commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.LOTTE_ON_GLOBAL),
				),
				productPreparedLotteon(
					commonStore,
					commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.LOTTE_ON_NORMAL),
				),
			]);
		} else {
			await Promise.all([
				productPreparedSmartStore(
					commonStore,
					commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.SMART_STORE),
					props,
				),
				productPreparedWemakeprice(
					commonStore,
					commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.WE_MAKE_PRICE),
					props,
				),
				productPreparedESMPlus(
					commonStore,
					commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.AUCTION_1),
					props,
				),
				productPreparedESMPlus(
					commonStore,
					commonStore.uploadInfo.markets.find((v) => v.code === SHOPCODE.G_MARKET_1),
					props,
				),
			]);
		}
	};

	// 엑셀 저장
	itemToExcel = (data: any) => {
		const excelData = data.map((v: any) => {
			return {
				오픈마켓: v.marketName,
				주문번호: v.orderNo,
				상품명: v.productName,
				옵션명: v.productOptionContents,
				수량: v.orderQuantity,
				가격: v.productPayAmt,
				배송비: v.deliveryFeeAmt,
				구매자명: v.orderMemberName,
				구매자연락처: v.orderMemberTelNo,
				수취인명: v.receiverName,
				수취인연락처: v.receiverTelNo1,
				우편번호: v.receiverZipCode,
				배송주소: v.receiverIntegratedAddress,
				배송메시지: v.productOrderMemo,
				개인통관고유부호: v.individualCustomUniqueCode,
				통관부호검증결과: v.icucResult?.message,
				오픈마켓URL: v.product?.activeProductStore.find((w: any) => w.siteCode === v.marketCode)?.storeUrl ?? '',
				구매처: v.product?.activeTaobaoProduct.shopName ?? '',
				구매처URL: v.product?.activeTaobaoProduct.url ?? '',
			};
		});

		downloadExcel(excelData, `주문리스트`, `주문리스트`, false, 'xlsx');
	};

	// 주문정보 단일선택
	toggleItemChecked = (index: number, value: boolean) => {
		this.orderInfo.orders[index].checked = value;
	};

	// 주문정보 전체선택
	toggleItemCheckedAll = (value: boolean) => {
		this.orderInfo.checkedAll = value;
		this.orderInfo.orders.map((v: any) => {
			v.checked = value;
		});
	};

	// 주문정보 상세보기 모달
	toggleOrderDetailModal = (value: boolean, index: number) => {
		this.orderInfo.current = index;
		this.modalInfo.orderDetail = value;
	};
}
