import { runInAction, makeAutoObservable } from "mobx";
import { newOrderSmartStore, productPreparedSmartStore } from "../../pages/Tools/SmartStore";
import { getLocalStorage, setLocalStorage } from "../../pages/Tools/ChromeAsync";
import { newOrderCoupang, productPreparedCoupang } from "../../pages/Tools/Coupang";
import { newOrderStreet, productPreparedStreet } from "../../pages/Tools/Street";
import { newOrderESMPlus, productPreparedESMPlus } from "../../pages/Tools/ESMPlus";
import { newOrderLotteon, productPreparedLotteon } from "../../pages/Tools/Lotteon";
import { newOrderWemakeprice, productPreparedWemakeprice } from "../../pages/Tools/Wemakeprice";
import { newOrderTmon } from "../../pages/Tools/Tmon";
import { downloadExcel, floatingToast } from "../../pages/Tools/Common";
import { newOrderInterpark } from "../../pages/Tools/Interpark";
import gql from "../../pages/Main/GraphQL/Requests";
import QUERIES from "../../pages/Main/GraphQL/Queries";

const xml2js = require('xml2js');

export class order {
    count: number = 0;

    orderInfo: any = {
        orders: [],

        loading: false,
        checkedAll: false,
    };

    constructor() {
        makeAutoObservable(this);
    }

    deleteOrder = async (orderId: number) => {
        let orderIds: any = [];

        if (orderId === -1) {
            const filtered = this.orderInfo.orders.filter((v: any) => {
                if (v.checked) {
                    orderIds.push(v.orderId);

                    return false;
                }

                return true;
            });

            if (orderIds.length < 1) {
                alert("주문이 선택되지 않았습니다.");

                return;
            }

            const accept = confirm(`선택한 주문정보 ${orderIds.length}개를 삭제하시겠습니까?\n삭제된 주문정보는 다시 복구하실 수 없습니다.`);

            if (!accept) {
                return;
            }

            // await setLocalStorage({ order: filtered });

            runInAction(() => {
                this.orderInfo.orders = filtered;
            });
        } else {
            const filtered = this.orderInfo.orders.filter((v: any, i: number) => orderId !== i);

            const accept = confirm(`주문정보를 삭제하시겠습니까?\n삭제된 주문정보는 다시 복구하실 수 없습니다.`);

            if (!accept) {
                return;
            }

            // await setLocalStorage({ order: filtered });

            runInAction(() => {
                this.orderInfo.orders = filtered;
            });
        }

        this.getOrder(false);
    }

    getOrder = async (download: boolean) => {
        this.orderInfo.loading = true;

        // const orders: any = await getLocalStorage('order') ?? [];

        const productCodes = this.orderInfo.orders.filter((v: any) => v.sellerProductManagementCode && v.sellerProductManagementCode.includes("SFY_")).map((v: any) => {
            const code = v.sellerProductManagementCode;
            const codeIndex = parseInt(code.split("_")[1], 36);

            return codeIndex;
        });

        const response = await gql(QUERIES.SELECT_MY_PRODUCT_BY_USER, { where: { id: { in: productCodes } } }, false);
        const results = await Promise.all(this.orderInfo.orders.map(async (v: any) => {
            const icucResult = await this.checkIndividualCustomUniqueCode(v, true);
            const product = response.data.selectMyProductByUser.find((w: any) => w.productCode === v.sellerProductManagementCode);

            return {
                ...v,

                icucResult,
                checked: false,
                product: product ?? null
            }
        }));

        runInAction(() => {
            this.count = results.length;

            this.orderInfo.orders = results;
            this.orderInfo.loading = false;
        });

        if (download) {
            this.itemToExcel(results);
        }

        console.log(this.orderInfo.orders);
    }

    loadOrder = async (commonStore: any) => {
        const order = await Promise.all([
            newOrderSmartStore(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'A077')),
            newOrderCoupang(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'B378')),
            newOrderStreet(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'A112')),
            newOrderStreet(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'A113')),
            newOrderESMPlus(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'A001')),
            newOrderESMPlus(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'A006')),
            newOrderInterpark(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'A027')),
            newOrderWemakeprice(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'B719')),
            newOrderLotteon(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'A524')),
            newOrderLotteon(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'A525')),
            newOrderTmon(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'B956')),
        ]);

        let newOrders = [];

        order.map((v: any) => {
            newOrders = newOrders.concat(v);
        });

        if (newOrders.length === 0) {
            floatingToast(`신규주문내역이 없습니다.`, 'failed');

            return;
        }

        // await setLocalStorage({ order: newOrders });

        runInAction(() => {
            this.orderInfo.orders = newOrders;
        })

        await this.getOrder(true);

        floatingToast(`신규주문조회가 완료되었습니다.`, 'success');
    }

    productPrepared = async (commonStore: any, props: any) => {
        if (props === "") {//일괄
            await Promise.all([
                productPreparedCoupang(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'B378')),
                productPreparedStreet(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'A112')),
                productPreparedStreet(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'A113')),
                productPreparedLotteon(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'A524')),
                productPreparedLotteon(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'A525')),
            ]);
        }
        else {//개별
            await Promise.all([
                productPreparedSmartStore(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'A077'), props),
                productPreparedWemakeprice(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'B719'), props),
                productPreparedESMPlus(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'A001'), props),
                productPreparedESMPlus(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'A006'), props),
            ]);
        }
    }

    itemToExcel = (data: any) => {
        const excelData = data.map((v: any) => {
            return {
                "오픈마켓": v.marketName,
                "주문번호": v.orderNo,
                "상품명": v.productName,
                "옵션명": v.productOptionContents,
                "수량": v.orderQuantity,
                "가격": v.productPayAmt,
                "배송비": v.deliveryFeeAmt,
                "구매자명": v.orderMemberName,
                "구매자연락처": v.orderMemberTelNo,
                "수취인명": v.receiverName,
                "수취인연락처": v.receiverTelNo1,
                "우편번호": v.receiverZipCode,
                "배송주소": v.receiverIntegratedAddress,
                "배송메시지": v.productOrderMemo,
                "개인통관고유부호": v.individualCustomUniqueCode,
                "통관부호검증결과": v.icucResult?.message,
                "오픈마켓URL": v.product?.activeProductStore.find((w: any) => w.siteCode === v.marketCode)?.storeUrl ?? "",
                "구매처": v.product?.activeTaobaoProduct.shopName ?? "",
                "구매처URL": v.product?.activeTaobaoProduct.url ?? ""
            }
        });

        downloadExcel(excelData, '주문리스트', false);
    };

    // getOrder = async () => {
    //     this.orderInfo.loading = true;
    //     this.orderInfo.orders = [];

    //     const orderJson = await gql(QUERIES.SELECT_MY_ORDER_BY_USER, {}, false);

    //     if (orderJson.errors) {
    //         alert(orderJson.errors[0].message);

    //         return;
    //     }

    //     runInAction(() => {
    //         this.orderInfo.orders = this.orderInfo.orders.concat(orderJson.data.selectMyOrderByUser);
    //         this.count = this.orderInfo.orders.length;
    //     });

    //     await Promise.all(this.orderInfo.orders.map(async (v: any, i: number) => {
    //         v.icucResult = await this.checkIndividualCustomUniqueCode(i, true);
    //     }));

    //     runInAction(() => {
    //         this.orderInfo.loading = false;
    //     });

    //     console.log(this.orderInfo.orders);
    // }

    // loadOrder = async () => {
    //     const order = await Promise.all([
    //         newOrderSmartStore(),
    //     ]);

    //     let newOrders = [];

    //     order.map((v: any) => {
    //         newOrders = newOrders.concat(v);
    //     });

    //     await this.saveOrder(newOrders);
    // }

    // saveOrder = async (data: any) => {
    //     const orderJson = await gql(MUTATIONS.CREATE_NEW_ORDER, { data }, false);

    //     if (orderJson.errors) {
    //         alert(orderJson.errors[0].message);

    //         return;
    //     }

    //     floatingToast(`신규주문 ${orderJson.data.createNewOrder}건이 추가되었습니다.`, 'success');

    //     runInAction(() => {
    //         this.getOrder();
    //     });
    // }

    toggleItemChecked = (index: number, value: boolean) => {
        this.orderInfo.orders[index].checked = value;
    }

    toggleItemCheckedAll = (value: boolean) => {
        this.orderInfo.checkedAll = value;
        this.orderInfo.orders.map((v: any) => {
            v.checked = value;
        });
    }

    checkIndividualCustomUniqueCode = async (data: any, loop: boolean) => {
        let icuc = {
            code: data.individualCustomUniqueCode,
            name: loop ? data.receiverName : data.orderMemberName,
            phone: loop ? data.receiverTelNo1 : data.orderMemberTelNo
        }

        icuc.phone = icuc.phone.replaceAll("-", "");

        const icucResp = await fetch(`https://unipass.customs.go.kr:38010/ext/rest/persEcmQry/retrievePersEcm?crkyCn=j260j221x046z292y040z030n0&persEcm=${icuc.code}&pltxNm=${icuc.name}&cralTelno=${icuc.phone}`);
        const icucText = await icucResp.text();

        const response: any = await new Promise((resolve, reject) => {
            xml2js.parseString(icucText, function (e: any, result: any) {
                if (e) {
                    reject(e);
                } else {
                    resolve(result);
                }
            })
        });

        if (response.persEcmQryRtnVo.tCnt[0] === '1') {
            if (loop) {
                return {
                    code: 1,
                    message: "통관가능(모두일치)"
                }
            } else {
                return {
                    code: 2,
                    message: "수취인불일치(구매자일치)"
                }
            }
        } else {
            if (loop) {
                if (response.persEcmQryRtnVo.tCnt[0] === '0' && response.persEcmQryRtnVo.persEcmQryRtnErrInfoVo[0].errMsgCn[0].includes('납세의무자 휴대전화번호가 일치하지 않습니다.')) {
                    return {
                        code: 1,
                        message: "수취인일치(전화번호불일치)"
                    }
                }

                return await this.checkIndividualCustomUniqueCode(data, false);
            } else {
                if (response.persEcmQryRtnVo.tCnt[0] === '0') {
                    if (response.persEcmQryRtnVo.persEcmQryRtnErrInfoVo[0].errMsgCn[0].includes('납세의무자 휴대전화번호가 일치하지 않습니다.')) {
                        return {
                            code: 2,
                            message: "구매자일치(전화번호불일치)"
                        }
                    } else if (response.persEcmQryRtnVo.persEcmQryRtnErrInfoVo[0].errMsgCn[0].includes('개인통관고유부호의 성명과 일치하지 않습니다.')) {
                        return {
                            code: 0,
                            message: "통관불가(모두불일치)"
                        }
                    } else if (response.persEcmQryRtnVo.persEcmQryRtnErrInfoVo[0].errMsgCn[0].includes('납세의무자 개인통관고유부호가 존재하지 않습니다.')) {
                        return {
                            code: 0,
                            message: "통관불가(통관부호오류)"
                        }
                    } else {
                        return {
                            code: 0,
                            message: "통관불가(기타오류)"
                        }
                    }
                } else {
                    return {
                        code: 0,
                        message: "통관불가(기타오류)"
                    }
                }
            }
        }
    };
}