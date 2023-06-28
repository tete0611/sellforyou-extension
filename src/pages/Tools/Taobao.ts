import { createTab, createTabCompletely, getLocalStorage, sendTabMessage, setLocalStorage } from "./ChromeAsync";
import { floatingToast, getClock, getClockOffset, parseDecode, sleep } from "./Common";

// 타오바오 주문조회 1차 수집
async function taobaoAPIOrderList(seq: number, dateStart: any, dateEnd: any) {
  let dateStartStamp = new Date(`${dateStart.YY}/${dateStart.MM}/${dateStart.DD} ${dateStart.hh}:${dateStart.mm}:${dateStart.ss}`).getTime();
  let dateEndStamp = new Date(`${dateEnd.YY}/${dateEnd.MM}/${dateEnd.DD} 24:59:59`).getTime();

  let orderBody = Object.assign({
    dateBegin: dateStartStamp,
    dateEnd: dateEndStamp,
    options: 0,
    pageNum: seq,
    pageSize: 50,
    prePageNo: seq > 1 ? seq - 1 : seq,
    queryOrder: "desc",
  });

  let form = new URLSearchParams();

  for (let name in orderBody) {
    form.append(name, orderBody[name]);
  }

  let orderResp = await fetch(
    "https://buyertrade.taobao.com/trade/itemlist/asyncBought.htm?action=itemlist/BoughtQueryAction&event_submit_do_query=1&_input_charset=utf8",
    {
      body: form,
      method: "POST",
    }
  );

  let orderBlob = await orderResp.blob();
  let orderText: any = await parseDecode(orderBlob);
  let orderJson = await JSON.parse(orderText);

  return orderJson;
}

async function getTaobaoData(lastUpdated: any) {
  let results: any = [];
  let pages: any = [];

  let dateStart: any = null;
  let dateEnd: any = null;

  if (lastUpdated) {
    const date = new Date(lastUpdated);

    dateStart = {
      YY: date.getFullYear().toString(),
      MM: (date.getMonth() + 1).toString().padStart(2, "0"),
      DD: date.getDate().toString().padStart(2, "0"),
      hh: (date.getHours() + 1).toString().padStart(2, "0"),
      mm: date.getMinutes().toString().padStart(2, "0"),
      ss: (date.getSeconds() + 1).toString().padStart(2, "0"),
    };
  } else {
    dateStart = getClockOffset(0, -1, 0, 0, 0, 0);
    dateStart = {
      ...dateStart,

      hh: "01",
      mm: "00",
      ss: "00",
    };
  }

  dateEnd = getClock();

  const firstOrder = await taobaoAPIOrderList(1, dateStart, dateEnd);

  for (let i = 2; i <= firstOrder.page.totalPage; i++) {
    pages.push(i);
  }

  results = await Promise.all(
    pages.map(async (v: number) => {
      const apiData = await taobaoAPIOrderList(v, dateStart, dateEnd);

      return apiData;
    })
  );

  results.push(firstOrder);
  results = results.flatMap((v) => v.mainOrders);

  return results;
}

// 타오바오 통합 주문조회 (1차수집 + 2차수집)
async function getTaobaoOrder() {
  const newTab: any = await createTabCompletely(
    {
      active: false,
      url: "https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm",
    },
    5
  );

  if (newTab.url.includes("login.taobao.com")) {
    chrome.tabs.remove(newTab.id);

    floatingToast("타오바오 로그인 후 다시시도 바랍니다.", "warning");

    return null;
  }

  const taobaoId = await sendTabMessage(newTab.id, {
    action: "order-taobao-id",
  });
  const taobaoInfo: any = (await getLocalStorage(`taobaoInfo-${taobaoId}`)) ?? [];

  const orderData: any = await sendTabMessage(newTab.id, {
    action: "order-taobao",
    source: taobaoInfo.length > 0 ? taobaoInfo[0].dateOrdered : null,
  });

  if (!orderData) {
    chrome.tabs.remove(newTab.id);

    floatingToast("타오바오 로그인 후 다시시도 바랍니다.", "warning");

    return null;
  }

  chrome.tabs.remove(newTab.id);

  let results: any = [];

  await Promise.all(
    orderData.map(async (v: any, i: number) => {
      if (!v.id) {
        return;
      }

      await sleep(10 * i);

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

      if (detailJson.isSuccess === "true") {
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
          shopName: "taobao",
        });
      });
    })
  );

  await Promise.all(
    taobaoInfo
      .filter((v) => !v.deliveryMessage)
      .map(async (v: any, i: number) => {
        if (!v.id) {
          return;
        }

        await sleep(10 * i);

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

        if (detailJson.isSuccess === "true") {
          v.trackingNumber = detailJson.expressId ?? "";
          v.datePaid = detailJson.address[detailJson.address.length - 1].time;
        }
      })
  );

  results = results.concat(taobaoInfo).sort((a, b) => new Date(b.dateOrdered).getTime() - new Date(a.dateOrdered).getTime());

  await setLocalStorage({ [`taobaoInfo-${taobaoId}`]: results });

  return { taobaoId, taobaoData: results };
}

export { getTaobaoData, getTaobaoOrder };
