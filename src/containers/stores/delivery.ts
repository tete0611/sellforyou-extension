import { runInAction, makeAutoObservable } from "mobx";
import { deliveryOrderSmartStore } from "../../pages/Tools/SmartStore";
import { getTaobaoOrder } from "../../pages/Tools/Taobao";

export class delivery {
    count: number = 0;

    orderInfo: any = {
        orders: [],

        loading: false,
        checkedAll: false,
    };

    constructor() {
        makeAutoObservable(this);
    }

    connectOrderInfo = async (index: number, commonStore: any) => {
        this.orderInfo.loading = true;

        const order = await Promise.all([
            deliveryOrderSmartStore(commonStore, commonStore.uploadInfo.markets.find((v: any) => v.code === 'A077'))
        ]);

        let newOrders = [];

        order.map((v: any) => {
            newOrders = newOrders.concat(v);
        });

        const matched = newOrders.find((v: any) => v.orderNo === this.orderInfo.orders[index].deliveryMessage);

        if (matched) {
            this.orderInfo.orders[index].connected = matched;
        }
    }

    disconnectOrderInfo = (index: number) => {
        delete this.orderInfo.orders[index].connected;
    }

    getExternalOrders = async () => {
        this.orderInfo.loading = true;

        const order = await Promise.all([
            getTaobaoOrder()
        ]);

        let newOrders = [];

        order.map((v: any) => {
            newOrders = newOrders.concat(v);
        });

        const orders = newOrders.map((v: any) => {
            return {
                ...v,

                checked: false
            }
        });

        console.log(orders);

        runInAction(() => {
            this.orderInfo = {
                ...this.orderInfo,

                orders,
                loading: false
            };
        });
    }

    toggleItemChecked = (index: number, value: boolean) => {
        this.orderInfo.orders[index].checked = value;
    }

    toggleItemCheckedAll = (value: boolean) => {
        this.orderInfo.checkedAll = value;
    }

    deleteOrder = (index: number) => {
        //
    }
}