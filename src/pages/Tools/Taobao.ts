import { createTabCompletely, sendTabMessage } from "./ChromeAsync";
import { getClock, getClockOffset, parseDecode } from "./Common";

async function taobaoAPIOrderList(seq: number) {
    let dateStart = getClockOffset(0, -1, 0, 0, 0, 0);
    let dateEnd = getClock();

    let dateStartStamp = new Date(`${dateStart.YY}/${dateStart.MM}/${dateStart.DD} 01:00:00`).getTime();
    let dateEndStamp = new Date(`${dateEnd.YY}/${dateEnd.MM}/${dateEnd.DD} 24:59:59`).getTime();

    let orderBody = Object.assign(
        {
            dateBegin: dateStartStamp,
            dateEnd: dateEndStamp,
            options: 0,
            pageNum: seq,
            pageSize: 50,
            prePageNo: seq > 1 ? seq - 1 : seq,
            queryOrder: 'desc',
        }
    );

    let form = new URLSearchParams();

    for (let name in orderBody) {
        form.append(name, orderBody[name]);
    }

    let orderResp = await fetch('https://buyertrade.taobao.com/trade/itemlist/asyncBought.htm?action=itemlist/BoughtQueryAction&event_submit_do_query=1&_input_charset=utf8', {
        body: form,
        method: 'POST'
    });

    let orderBlob = await orderResp.blob();
    let orderText: any = await parseDecode(orderBlob);
    let orderJson = await JSON.parse(orderText);

    return orderJson;
}

async function getTaobaoData() {
    let results: any = [];
    let pages: any = [];

    const firstOrder = await taobaoAPIOrderList(1);

    for (let i = 2; i <= firstOrder.page.totalPage; i++) {
        pages.push(i);
    }

    results = await Promise.all(pages.map(async (v: number) => {
        const apiData = await taobaoAPIOrderList(v);

        return apiData;
    }));

    results.push(firstOrder);
    results = results.flatMap((v) => v.mainOrders);

    return results;
}

async function getTaobaoOrder() {
    const newTab: any = await createTabCompletely({ active: false, url: "https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm" });
    const orderData: any = await sendTabMessage(newTab.id, { action: "order-taobao" });

    chrome.tabs.remove(newTab.id);

    let results: any = [];

    await Promise.all(orderData.map(async (v: any) => {
        if (!v.id) {
            return;
        }

        let messageResp = await fetch(`https://buyertrade.taobao.com/trade/json/getMessage.htm?biz_order_id=${v.id}&user_type=1&archive=false`);
        let messageBlob = await messageResp.blob();
        let messageData: any = await parseDecode(messageBlob);
        let messageJson = await JSON.parse(messageData);

        if (messageJson.tip) {
            v.deliveryMessage = messageJson.tip.slice(3, messageJson.tip.length);
        }

        let detailResp = await fetch(`https://buyertrade.taobao.com/trade/json/transit_step.do?bizOrderId=${v.id}`);
        let detailBlob = await detailResp.blob();
        let detailData: any = await parseDecode(detailBlob);
        let detailJson = await JSON.parse(detailData);

        if (detailJson.isSuccess === 'true') {
            v.trackingNumber = detailJson.expressId ?? "";
            v.datePaid = detailJson.address[detailJson.address.length - 1].time;
        }

        v.subOrders.map((w: any) => {
            if (w.itemInfo.skuId === 0) {
                return;
            }

            let optionString = "";

            if (w.itemInfo.skuText) {
                w.itemInfo.skuText.map((x: any) => {
                    optionString += `${x.name}: ${x.value}, `;
                });

                optionString = optionString.slice(0, optionString.length - 2);
            }

            let imageUrl = "";

            if (w.itemInfo.pic) {
                const matched = /^https:?/.test(w.itemInfo.pic);

                if (matched) {
                    imageUrl = w.itemInfo.pic.replace(/_[0-9]{2}x[0-9]{2}.[A-Za-z]{3}/g, "");
                } else {
                    imageUrl = "http:" + w.itemInfo.pic.replace(/_[0-9]{2}x[0-9]{2}.[A-Za-z]{3}/g, "");
                }
            }

            results.push({
                id: v.id,
                imageUrl,
                productName: w.itemInfo.title,
                optionInfo: w.itemInfo.skuId > 0 ? optionString : "ONE-SIZE",
                url: /^https:?/.test(w.itemInfo.itemUrl) ? w.itemInfo.itemUrl : "http:" + w.itemInfo.itemUrl,
                unitPrice: w.priceInfo.realTotal,
                quantity: w.quantity,
                actualPrice: v.payInfo.actualFee,
                status: v.statusInfo.text,
                dateOrdered: v.orderInfo.createTime,
                datePaid: v.datePaid ?? "",
                trackingNumber: v.trackingNumber ?? "",
                deliveryMessage: v.deliveryMessage ?? "",
            })
        })
    }))

    return results.sort((a, b) => new Date(b.dateOrdered).getTime() - new Date(a.dateOrdered).getTime());
}

export {
    getTaobaoData,
    getTaobaoOrder
}