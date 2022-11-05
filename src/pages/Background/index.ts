import QUERIES from "../Main/GraphQL/Queries";
import MUTATIONS from "../Main/GraphQL/Mutations";
import gql from "../Main/GraphQL/Requests";
import papagoTranslation from "../Tools/Translation";

import { coupangApiGateway } from "../Tools/Coupang";
import { createTabCompletely, getLocalStorage, queryTabs, sendTabMessage, setLocalStorage } from "../Tools/ChromeAsync";

async function tmallCORS(url) {
    const tab = await createTabCompletely({ active: false, url });
    const res = await sendTabMessage(tab.id, { action: "fetch", source: url });

    chrome.tabs.remove(tab.id);

    return res;
}

async function addBulkInfo(source: any, sender: any, isExcel: boolean) {
    const tabs: any = await queryTabs({});

    let bulkInfo: any = await getLocalStorage('bulkInfo') ?? [];

    bulkInfo = bulkInfo.filter((v: any) => {
        if ((v.sender.tab.id === sender.tab.id)) {
            if (source.retry) {
                sender = v.sender;
            }

            return false;
        }

        const matched = tabs.find((w: any) => w.id === v.sender.tab.id);

        if (!matched) {
            return false;
        }

        return true;
    });

    bulkInfo.push({
        current: 0,
        currentPage: 1,

        inputs: source.data,

        isBulk: true,
        isCancel: false,
        isComplete: false,
        isExcel,

        results: [],

        sender
    });

    await setLocalStorage({ bulkInfo: bulkInfo });

    return await bulkNext(sender);
}

async function addToInventory(sender: any, origin: any) {
    if (origin.error) {
        return await finishCollect(sender, 'failed', origin.error);
    }

    let result: any = {
        "data": [
            {
                "attr": {},
                "taobaoNumIid": "",
                "title": "",
                "optionName": [],
                "optionValue": [],
                "video": "",
                "description": "",
                "isTranslated": false
            }
        ]
    };

    let textdict: any = {};

    origin.item.attr = origin.item.attr.map((v: any) => {
        const filtered = v.replace(/&.+;/, '');

        textdict[filtered] = filtered;

        return filtered;
    })

    origin.item.title = origin.item.title.replace(/&.*;/, '');					// HTML 특수문자 처리
    origin.item.title = origin.item.title.replace(/[*]/gi, 'x');				// * => X 처리
    origin.item.title = origin.item.title.replace(/[\\\?\"<>,&]/gi, ' ');		// \ * ? " < > => 공백 처리

    if (origin.item.title.replace(/[^\u4e00-\u9fff]/g, "").length > 0) {
        textdict[origin.item.title] = origin.item.title;
    }

    result.data[0].title = origin.item.title;

    let option_name: any = {};
    let option_value: any = {};

    for (let i in origin.item.props_list) {
        let id = i.split(":");
        let options = origin.item.props_list[i].split(":");

        for (let j in options) {
            options[j] = options[j].replace(/[*]/gi, 'x');				// * => X 처리
            options[j] = options[j].replace(/[\\\?\"<>,]/gi, ' ');		// \ / : * ? " < > => 공백 처리

            if (options[j].replace(/[^\u4e00-\u9fff]/g, "").length > 0) {
                textdict[options[j]] = options[j];
            }
        }

        option_name[id[0]] = options[0];
        option_value[i] = options[1];
    }

    for (let i in option_name) {
        result.data[0].optionName.push({
            "taobaoPid": i,
            "name": option_name[i]
        })
    }

    for (let i in option_value) {
        let id = i.split(":");

        result.data[0].optionValue.push({
            "taobaoPid": id[0],
            "taobaoVid": id[1],
            "name": option_value[i]
        })
    }

    origin.item.desc_text.map((v: any) => {
        textdict[v] = v;
    })

    result.data[0].attr = origin.item.attr;
    result.data[0].description = origin.item.desc;
    result.data[0].taobaoNumIid = origin.item.num_iid;
    result.data[0].video = origin.item.video;

    if (origin.item.shop_id !== "express") {
        textdict = await papagoTranslation(textdict, "zh-CN", "ko", null);

        if (!textdict) {
            return await finishCollect(sender, 'failed', "현재 번역이 불안정하여 상품을 수집할 수 없습니다. 잠시 후 다시시도 바랍니다.");
        }
    }

    for (let i in textdict) {
        try {
            if (origin.item.title === i) {
                result.data[0].title = origin.item.title.replaceAll(i, textdict[i]);
            }

            for (let j in result.data[0].optionName) {
                try {
                    if (result.data[0].optionName[j].name === i) {
                        result.data[0].optionName[j].name = result.data[0].optionName[j].name.replaceAll(i, textdict[i]);
                    }
                } catch (e) {
                    continue;
                }
            }

            for (let j in result.data[0].optionValue) {
                try {
                    if (result.data[0].optionValue[j].name === i) {
                        result.data[0].optionValue[j].name = result.data[0].optionValue[j].name.replaceAll(i, textdict[i]);
                    }
                } catch (e) {
                    continue;
                }
            }

            for (let j in result.data[0].attr) {
                try {
                    if (result.data[0].attr[j] === i) {
                        result.data[0].attr[j] = result.data[0].attr[j].replaceAll(i, textdict[i]);
                    }
                } catch (e) {
                    continue;
                }
            }

            result.data[0].description = result.data[0].description.replaceAll(i, textdict[i]);
        } catch (e) {
            continue;
        }
    }

    let bulkInfo: any = await getLocalStorage('bulkInfo') ?? [];
    let bulk = bulkInfo.find((v: any) => v.sender.tab.id === sender.tab.id);

    if (bulk && bulk.isExcel) {
        const fixed = bulk.inputs.find((v: any) => v.url.includes(origin.item.num_iid));

        if (fixed) {
            origin.item.nick = fixed.productName;
            origin.item.desc_short = fixed.productTags;
        }
    }

    let productName = result.data[0].title;

    if (origin.item.nick) {
        productName = origin.item.nick;
    }

    const userJson = await gql(QUERIES.SELECT_MY_INFO_BY_USER, {}, false)

    if (userJson.errors) {
        return await finishCollect(sender, 'failed', userJson.errors[0].message);
    }

    let collectInfo: any = await getLocalStorage('collectInfo') ?? [];
    let collect = collectInfo.find((v: any) => v.sender.tab.id === sender.tab.id);

    if (!collect || !collect.categoryId) {
        let accesskey = userJson.data.selectMyInfoByUser.userInfo.coupangAccessKey;
        let secretkey = userJson.data.selectMyInfoByUser.userInfo.coupangSecretKey;

        if (accesskey === "" && secretkey === "") {
            accesskey = "d3087930-fdd7-490e-aa06-da32f79cc9c2";
            secretkey = "5d4e2bce5dd8337285b634100c6a198d1b31327a";
        }

        let categoryJson = await coupangApiGateway({
            "accesskey": accesskey,
            "secretkey": secretkey,

            "path": `/v2/providers/openapi/apis/api/v1/categorization/predict`,
            "query": "",
            "method": "POST",

            "data": {
                "productName": productName
            }
        });

        if (categoryJson.code.ERROR || categoryJson.data.autoCategorizationPredictionResultType !== "SUCCESS") {
            return await finishCollect(sender, 'failed', '카테고리 설정 도중 오류가 발생하였습니다.');
        }

        origin.item.cid = categoryJson.data.predictedCategoryId;
    } else {
        origin.item.nid = collect.categoryId;
    }

    origin.item.brand = result.data[0].attr.find((v: any) => v.includes("브랜드"))?.split(":")[1] ?? "";
    origin.item.manufacturer = result.data[0].attr.find((v: any) => v.includes("근원") || v.includes("생산지"))?.split(":")[1] ?? "";
    origin.item.modelName = result.data[0].attr.find((v: any) => v.includes("모델"))?.split(":")[1] ?? "";

    result.data[0].attr = JSON.stringify(result.data[0].attr)

    const response = await gql(MUTATIONS.GET_TAOBAO_ITEM_USING_EXTENSION_BY_USER, {
        data: JSON.stringify({
            onebound: origin,
            sellforyou: result
        })
    }, false);

    if (response.errors) {
        return await finishCollect(sender, 'failed', response.errors[0].message);
    }

    const message = response.data.getTaobaoItemUsingExtensionByUser;

    return await finishCollect(sender, message.includes('상품 수집이 완료되었습니다.') ? 'success' : 'failed', message);
}

async function bulkNext(sender) {
    let bulkInfo: any = await getLocalStorage('bulkInfo') ?? [];
    let bulk = bulkInfo.find((v: any) => v.sender.tab.id === sender.tab.id);

    if (!bulk) {
        return false;
    }

    if (bulk.isCancel || bulk.current === bulk.inputs.length) {
        bulk.isBulk = false;

        const tabs: any = await queryTabs({ url: chrome.runtime.getURL("product/collected.html") });

        tabs.map((v: any) => { sendTabMessage(v.id, { action: 'refresh' }) });

        sendTabMessage(bulk.sender.tab.id, { action: 'collect-finish', source: bulk });
    } else {
        const url = /^https?:/.test(bulk.inputs[bulk.current].url) ? bulk.inputs[bulk.current].url : 'https:' + bulk.inputs[bulk.current].url;

        chrome.tabs.update(bulk.sender.tab.id, { url });

        bulk.current += 1;
    }

    await setLocalStorage({ bulkInfo: bulkInfo });

    return true;
}

async function bulkStop(sender) {
    let bulkInfo: any = await getLocalStorage('bulkInfo') ?? [];
    let bulk = bulkInfo.find((v: any) => v.sender.tab.id === sender.tab.id);

    if (!bulk) {
        return false;
    }

    bulk.isCancel = true;

    await setLocalStorage({ bulkInfo: bulkInfo });

    return true;
}

async function finishCollect(sender: any, status: string, statusMessage: string) {
    let bulkInfo: any = await getLocalStorage('bulkInfo') ?? [];
    let bulk = bulkInfo.find((v: any) => v.sender.tab.id === sender.tab.id);

    if (bulk) {
        bulk.isComplete = true;
        bulk.results.push({
            checked: true,

            status,
            statusMessage,

            input: bulk.inputs[bulk.results.length]
        });

        await setLocalStorage({ bulkInfo: bulkInfo });
    }

    return { status, statusMessage };
}

async function getUserInfo() {
    const response = await gql(QUERIES.SELECT_MY_INFO_BY_USER, {}, false);

    if (!response.data && !response.errors) {
        return null;
    }

    if (response.errors) {
        await createTabCompletely({ active: true, url: "/signin.html" });

        return null;
    }

    return response.data.selectMyInfoByUser;
}

async function isBulk(sender) {
    let bulkInfo: any = await getLocalStorage('bulkInfo') ?? [];
    let bulk = bulkInfo.find((v: any) => v.sender.tab.id === sender.tab.id);

    if (!bulk) {
        return false;
    }

    return bulk.isBulk;
}

chrome.runtime.onMessage.addListener((request, sender: any, sendResponse) => {
    switch (request.action) {
        case "collect": {
            addToInventory(sender, request.source).then(sendResponse);

            return true;
        }

        case "collect-bulk": {
            addBulkInfo(request.source, sender, false).then(sendResponse);

            return true;
        }

        case "collect-product-excel": {
            addBulkInfo(request.source, sender, true).then(sendResponse);

            return true;
        }

        case "collect-finish": {
            bulkNext(sender).then(sendResponse);

            return true;
        }

        case "collect-stop": {
            bulkStop(sender).then(sendResponse);

            return true;
        }

        case "description": {
            fetch(request.source).then(res => res.text()).then(sendResponse)

            return true;
        }

        case "is-bulk": {
            isBulk(sender).then(sendResponse)

            return true;
        }

        case "tab-info": {
            sendResponse(sender);

            break;
        }

        case "tab-info-all": {
            queryTabs({}).then(sendResponse);

            return true;
        }

        case "user": {
            getUserInfo().then(sendResponse);

            return true;
        }

        case "fetch": {
            tmallCORS(request.source).then(sendResponse);

            return true;
        }

        default: break;
    }
});