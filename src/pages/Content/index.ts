import { taobao } from './modules/taobao';
import { tmall } from './modules/tmall';
import { express } from './modules/express';
import { alibaba } from './modules/alibaba';
import { vvic } from './modules/vvic';
import { Buffer } from 'buffer';
import { getLocalStorage, sendRuntimeMessage, setLocalStorage } from '../Tools/ChromeAsync';
import { uploadA077Resources } from '../Tools/SmartStore';
import { sleep, updateQueryStringParameter } from '../Tools/Common';
import { getTaobaoData } from '../Tools/Taobao';

const iconv = require('iconv-lite');

let isBulk: any = false;
let tabInfo: any = null;

async function pageRefresh(shop, page) {
    let url = null;

    switch (shop) {
        case "taobao1": {
            url = updateQueryStringParameter(window.location.href, 's', `${44 * (page - 1)}`);

            break;
        }

        case "taobao2": {
            url = updateQueryStringParameter(window.location.href, 'pageNo', `${page}`);

            break;
        }

        case "tmall1": {
            url = updateQueryStringParameter(window.location.href, 's', `${60 * (page - 1)}`);

            break;
        }

        case "tmall2": {
            url = updateQueryStringParameter(window.location.href, 'pageNo', `${page}`);

            break;
        }

        case "express": {
            url = updateQueryStringParameter(window.location.href, 'page', `${page}`);

            break;
        }

        case "alibaba": {
            url = updateQueryStringParameter(window.location.href, 'beginPage', `${page}`);

            break;
        }

        case "vvic": {
            url = updateQueryStringParameter(window.location.href, 'currentPage', `${page}`);

            break;
        }

        default: break;
    }

    if (!url) {
        return;
    }

    window.location.href = url;
}

async function bulkCollect(useChecked: boolean, useMedal: boolean) {
    let inputs: any = [];

    let timeout = 0;

    //타임아웃 필요
    while (true) {
        if (timeout === 5) {
            break;
        }

        let list: any = document.getElementsByClassName('SELLFORYOU-CHECKBOX');

        if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                let toggle = false;

                if (useChecked && !list[i].checked) {
                    continue;
                }

                if (useMedal) {
                    if (list[i].getAttribute('medal') === '1') {
                        toggle = true;
                    }
                } else {
                    toggle = true;
                }

                if (!toggle) {
                    continue;
                }

                inputs.push({
                    url: list[i].id,
                    productName: "",
                    productTags: "",
                });
            }

            break;
        }

        timeout += 1;

        await sleep(1000 * 1);
    }

    return inputs;
}

async function bulkPage(shop) {
    let collectInfo: any = await getLocalStorage('collectInfo') ?? [];
    let collect = collectInfo.find((v: any) => v.sender.tab.id === tabInfo.tab.id);

    if (!collect) {
        return;
    }

    if (collect.currentPage <= collect.pageEnd) {
        const inputs = await bulkCollect(false, collect.useMedal);

        if (inputs.length === 0) {
            collect.currentPage = collect.pageEnd;
        }

        collect.inputs = collect.inputs.concat(inputs);
        collect.currentPage += 1;

        switch (collect.type) {
            case "page": {
                if (collect.currentPage > collect.pageEnd) {
                    sendRuntimeMessage({ action: 'collect-bulk', source: { data: collect.inputs, retry: false } });
                } else {
                    pageRefresh(shop, collect.currentPage);
                }

                break;
            }

            case "amount": {
                if (collect.currentPage > collect.pageEnd) {
                    sendRuntimeMessage({ action: 'collect-bulk', source: { data: collect.inputs, retry: false } });
                } else {
                    pageRefresh(shop, collect.currentPage);
                }

                break;
            }

            case "excel-page": {
                if (collect.currentPage > collect.pageEnd) {
                    sendRuntimeMessage({ action: 'collect-bulk', source: { data: collect.inputs, retry: false } });
                } else {
                    window.location.href = collect.pageList[collect.currentPage - 1].url;
                }

                break;
            }
        }

        await setLocalStorage({ collectInfo });
    }
}

async function floatingButton(shop: any, result: any, bulk: boolean) {
    if (!result) {
        return;
    }

    let isCollecting = false;

    let container = document.createElement('div');

    container.className = 'SELLFORYOU-FLOATING';

    let buttonCollect = document.createElement("button")
    let buttonCollectDefault = `<i class="fi fi-rs-inbox-in" style="display: flex; align-items: center; font-size: 32px;"></i>`;

    buttonCollect.className = "SELLFORYOU-COLLECT";
    buttonCollect.innerHTML = buttonCollectDefault;
    buttonCollect.addEventListener('click', async () => {
        if (!isBulk && result.error) {
            const accept = confirm(`${result.error}\n[확인]을 누르시면 수집상품목록으로 이동합니다.`);

            if (accept) {
                window.open(chrome.runtime.getURL("product/collected.html"));
            }

            return;
        }

        if (isCollecting) {
            return;
        }

        if (bulk) {
            let categoryResp = await fetch(chrome.runtime.getURL("resources/category.json"));
            let categoryJson = await categoryResp.json();

            let paper = document.createElement('div');

            paper.id = 'sfyPaper';
            paper.className = "SELLFORYOU-INFORM";
            paper.innerHTML = `
                <div style="background: white; border: 1px solid black; color: black; font-size: 16px; padding: 10px; text-align: left; width: 700px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 20px; margin-bottom: 20px;">
                        현재페이지 대량수집

                        <button id="sfyCancel" style="padding: 10px;">    
                            <i class="fi fi-rs-cross" style="display: flex; align-items: center; font-size: 12px;"></i>
                        </button>
                    </div>

                    <table style="width: 100%;">
                        <tr>
                            <td colspan="3" style="border: 1px solid black; width: 50%; padding: 10px;">
                                <label style="cursor: pointer; display: flex; align-items: center; font-size: 18px; margin-bottom: 20px;">
                                    <input id="sfyCategoryEnabled" type="checkbox" style="cursor: pointer; width: 20px; height: 20px;" />

                                    &nbsp;

                                    카테고리 수동설정
                                </label>

                                <table style="width: 100%;">
                                    <tr>
                                        <td style="padding: 5px; width: 25%;">
                                            카테고리 검색
                                        </td>

                                        <td style="padding: 5px; width: 75%;">
                                            <div style="position: relative;">
                                                <input id="sfyCategoryInput" disabled data-category-id="" style="border: 1px solid black; width: 100%;" />

                                                <div id="sfyCategoryList" style="background: white; border: 1px solid black; display: none; font-size: 13px; position: absolute; width: 100%; height: 100px; overflow-y: scroll;">
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="3" style="color: red; padding: 10px 0px;">
                                카테고리를 수동으로 설정하시려면 카테고리 수동설정란을 체크해주세요.
                            </td>
                        </tr>

                        <tr>
                            <td colspan="3" style="border: 1px solid black; width: 50%; padding: 10px;">
                                <label style="cursor: pointer; display: flex; align-items: center; font-size: 18px;">
                                    <input id="sfyGoldMedalEnabled" type="checkbox" style="cursor: pointer; width: 20px; height: 20px;" />

                                    &nbsp;

                                    금메달 상품만 수집하기 (타오바오)
                                </label>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="3" style="color: red; padding: 5px 0px;">
                            </td>
                        </tr>

                        <tr>
                            <td colspan="3" style="padding: 10px 0px;">
                                <button id="sfyStart" style="width: 100%; height: 40px;">
                                    대량수집 시작하기
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
            `;

            document.documentElement.appendChild(paper);

            const sfyGoldMedalEnabled: any = document.getElementById('sfyGoldMedalEnabled');

            const sfyCategoryEnabled: any = document.getElementById('sfyCategoryEnabled');

            const sfyCategoryInput: any = document.getElementById('sfyCategoryInput');
            const sfyCategoryList = document.getElementById('sfyCategoryList');

            const sfyStart = document.getElementById('sfyStart');
            const sfyCancel = document.getElementById('sfyCancel');


            if (!sfyGoldMedalEnabled || !sfyCategoryEnabled || !sfyCategoryInput || !sfyCategoryList || !sfyStart || !sfyCancel) {
                return;
            }

            sfyCategoryEnabled.addEventListener('change', (e: any) => {
                sfyCategoryInput.disabled = !e.target.checked;
                sfyCategoryList.style.display = "none";
            });

            sfyCategoryInput.addEventListener('focus', async (e: any) => {
                sfyCategoryList.style.display = "";
            });

            sfyCategoryInput.addEventListener('change', async (e: any) => {
                const input = e.target.value;

                const filtered = categoryJson.filter((v: any) =>
                    v['대분류'].includes(input) ||
                    v['중분류'].includes(input) ||
                    v['소분류'].includes(input) ||
                    v['세분류'].includes(input)
                );

                if (!filtered) {
                    return;
                }

                sfyCategoryList.innerHTML = ``;

                filtered.map((v: any) => {
                    let categoryName = ``;

                    if (v['대분류']) {
                        categoryName += v['대분류'];
                    }

                    if (v['중분류']) {
                        categoryName += " > ";
                        categoryName += v['중분류'];
                    }

                    if (v['소분류']) {
                        categoryName += " > ";
                        categoryName += v['소분류'];
                    }

                    if (v['세분류']) {
                        categoryName += " > ";
                        categoryName += v['세분류'];
                    }

                    sfyCategoryList.innerHTML += `
                            <div class="sfyCategory" data-category-id="${v['카테고리번호']}" style="cursor: pointer; padding: 5px; 0px;">
                                ${categoryName}
                            </div>
                        `;
                });

                const categories = document.getElementsByClassName('sfyCategory');

                for (let i = 0; i < categories.length; i++) {
                    categories[i].addEventListener('click', (e: any) => {
                        sfyCategoryInput.value = e.target.textContent.trim();
                        sfyCategoryInput.setAttribute('data-category-id', e.target.getAttribute('data-category-id'));

                        sfyCategoryList.style.display = "none";
                    });
                }
            });

            const startBulk = async () => {
                const tabs: any = await sendRuntimeMessage({ action: "tab-info-all" });

                let collectInfo: any = await getLocalStorage('collectInfo') ?? [];

                collectInfo = collectInfo.filter((v: any) => {
                    if (v.sender.tab.id === tabInfo.tab.id) {
                        return false;
                    }

                    const matched = tabs.find((w: any) => w.id === v.sender.tab.id);

                    if (!matched) {
                        return false;
                    }

                    return true;
                });

                if (!sfyCategoryEnabled.checked) {
                    sfyCategoryInput.setAttribute('data-category-id', '');
                }

                collectInfo.push({
                    categoryId: sfyCategoryInput.getAttribute('data-category-id'),

                    sender: tabInfo,
                });

                await setLocalStorage({ collectInfo });

                const inputs = await bulkCollect(true, sfyGoldMedalEnabled.checked);

                sendRuntimeMessage({ action: 'collect-bulk', source: { data: inputs, retry: false } });
            };

            sfyStart.addEventListener('click', async () => {
                startBulk();
            });

            sfyCancel.addEventListener('click', () => {
                paper.remove();
            });
        } else {
            isCollecting = true;

            buttonCollect.innerHTML = `<div class="SELLFORYOU-LOADING" />`;

            const response: any = await sendRuntimeMessage({ action: "collect", source: result });

            if (!response) {
                return;
            }

            if (response.status === 'success') {
                buttonCollect.innerHTML = `
                    <img src=${chrome.runtime.getURL("resources/icon-success.png")} width="20px" height="20px" style="margin-bottom: 5px;" />

                    수집완료
                `;
            } else {
                buttonCollect.innerHTML = `
                    <img src=${chrome.runtime.getURL("resources/icon-failed.png")} width="20px" height="20px" style="margin-bottom: 5px;" />

                    수집실패
                `;
            }

            sendRuntimeMessage({ action: "collect-finish" });

            result.error = response.statusMessage;
        }
    })

    buttonCollect.addEventListener('mouseenter', () => {
        if (isCollecting) {
            return;
        }

        buttonCollect.innerHTML = `
            <img src=${chrome.runtime.getURL("/icon48.png")} width="20px" height="20px" style="margin-bottom: 5px;" />
            
            <div style="font-size: 12px;">
                ${bulk ? `
                    현재페이지

                    <br/>

                    수집하기
                `
                : `
                    현재상품

                    <br/>

                    수집하기
                `}
            </div>
        `;
    });

    buttonCollect.addEventListener('mouseleave', () => {
        if (isCollecting) {
            return;
        }

        buttonCollect.innerHTML = buttonCollectDefault;
    });

    container.append(buttonCollect);

    if (bulk) {
        let buttonCheckAll: any = document.createElement("button")
        let buttonCheckAllDefault = `<i class="fi fi-rs-list-check" style="display: flex; align-items: center; font-size: 32px;"></i>`;

        buttonCheckAll.id = "sfyPicker";
        buttonCheckAll.value = true;
        buttonCheckAll.className = "SELLFORYOU-COLLECT";
        buttonCheckAll.innerHTML = buttonCheckAllDefault;
        buttonCheckAll.addEventListener('click', () => {
            let list: any = document.getElementsByClassName('SELLFORYOU-CHECKBOX');

            if (buttonCheckAll.value === 'true') {
                buttonCheckAll.value = false;
                buttonCheckAllDefault = `<i class="fi fi-rs-list" style="display: flex; align-items: center; font-size: 32px;"></i>`;

                for (let i = 0; i < list.length; i++) {
                    list[i].checked = false;
                }
            } else {
                buttonCheckAll.value = true;
                buttonCheckAllDefault = `<i class="fi fi-rs-list-check" style="display: flex; align-items: center; font-size: 32px;"></i>`;

                for (let i = 0; i < list.length; i++) {
                    list[i].checked = true;
                }
            }
        })

        buttonCheckAll.addEventListener('mouseenter', () => {
            buttonCheckAll.innerHTML = `
                    <img src=${chrome.runtime.getURL("/icon48.png")} width="20px" height="20px" style="margin-bottom: 5px;" />
                    
                    <div style="font-size: 12px;">
                        상품목록

                        <br/>

                        일괄선택
                    </div>
            `;
        });

        buttonCheckAll.addEventListener('mouseleave', () => {
            buttonCheckAll.innerHTML = buttonCheckAllDefault;
        });

        container.append(buttonCheckAll);

        //

        let buttonPageConfig: any = document.createElement("button");
        let buttonPageConfigDefault = `<i class="fi fi-rs-settings" style="display: flex; align-items: center; font-size: 32px;"></i>`;

        buttonPageConfig.id = "sfyPageConfig";
        buttonPageConfig.value = true;
        buttonPageConfig.className = "SELLFORYOU-COLLECT";
        buttonPageConfig.innerHTML = buttonPageConfigDefault;
        buttonPageConfig.addEventListener('click', async () => {
            let categoryResp = await fetch(chrome.runtime.getURL("resources/category.json"));
            let categoryJson = await categoryResp.json();

            let paper = document.createElement('div');

            paper.id = 'sfyPaper';
            paper.className = "SELLFORYOU-INFORM";
            paper.innerHTML = `
                <div style="background: white; border: 1px solid black; color: black; font-size: 16px; padding: 10px; text-align: left; width: 700px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; font-size: 20px; margin-bottom: 20px;">
                        사용자정의 대량수집

                        <button id="sfyCancel" style="padding: 10px;">    
                            <i class="fi fi-rs-cross" style="display: flex; align-items: center; font-size: 12px;"></i>
                        </button>
                    </div>

                    <table style="width: 100%;">
                        <tr>
                            <td colspan="3" style="border: 1px solid black; width: 50%; padding: 10px;">
                                <label style="cursor: pointer; display: flex; align-items: center; font-size: 18px; margin-bottom: 20px;">
                                    <input id="sfyCategoryEnabled" type="checkbox" style="cursor: pointer; width: 20px; height: 20px;" />

                                    &nbsp;

                                    카테고리 수동설정
                                </label>

                                <table style="width: 100%;">
                                    <tr>
                                        <td style="padding: 5px; width: 25%;">
                                            카테고리 검색
                                        </td>

                                        <td style="padding: 5px; width: 75%;">
                                            <div style="position: relative;">
                                                <input id="sfyCategoryInput" disabled data-category-id="" style="border: 1px solid black; width: 100%;" />

                                                <div id="sfyCategoryList" style="background: white; border: 1px solid black; display: none; font-size: 13px; position: absolute; width: 100%; height: 100px; overflow-y: scroll;">
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="3" style="color: red; padding: 10px 0px;">
                                카테고리를 수동으로 설정하시려면 카테고리 수동설정란을 체크해주세요.
                            </td>
                        </tr>

                        <tr>
                            <td colspan="3" style="border: 1px solid black; width: 50%; padding: 10px;">
                                <label style="cursor: pointer; display: flex; align-items: center; font-size: 18px;">
                                    <input id="sfyGoldMedalEnabled" type="checkbox" style="cursor: pointer; width: 20px; height: 20px;" />

                                    &nbsp;

                                    금메달 상품만 수집하기 (타오바오)
                                </label>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="3" style="color: red; padding: 5px 0px;">
                            </td>
                        </tr>

                        <tr>
                            <td style="border: 1px solid black; width: 45%; padding: 10px;">
                                <label style="cursor: pointer; display: flex; align-items: center; font-size: 18px; margin-bottom: 20px;">
                                    <input type="radio" name="sfyBulkType" value="page" checked style="cursor: pointer; width: 20px; height: 20px;" />

                                    &nbsp;

                                    페이지단위 대량수집
                                </label>

                                <table style="width: 100%; margin-bottom: 20px;">
                                    <tr>
                                        <td style="padding: 5px; width: 50%;">
                                            시작페이지
                                        </td>

                                        <td style="padding: 5px; width: 50%;">
                                            <input id="sfyPageStart" value="1" style="border: 1px solid black; text-align: center; width: 100%" />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding: 5px; width: 50%;">
                                            종료페이지
                                        </td>

                                        <td style="padding: 5px; width: 50%;">
                                            <input id="sfyPageEnd" value="1" style="border: 1px solid black; text-align: center; width: 100%" />
                                        </td>
                                    </tr>
                                </table>
                            </td>

                            <td style="text-align: center;">
                                또는
                            </td>

                            <td style="border: 1px solid black; width: 45%; padding: 10px;">
                                <label style="cursor: pointer; display: flex; align-items: center; font-size: 18px; margin-bottom: 20px;">
                                    <input type="radio" name="sfyBulkType" value="amount" style="cursor: pointer; width: 20px; height: 20px;" />

                                    &nbsp;

                                    수량단위 대량수집
                                </label>

                                <table style="width: 100%; margin-bottom: 56px;">
                                    <tr>
                                        <td style="padding: 5px; width: 50%;">
                                            목표수량
                                        </td>

                                        <td style="padding: 5px; width: 50%;">
                                            <input id="sfyAmount" value="100" style="border: 1px solid black; text-align: center; width: 100%" />
                                        </td>
                                    </tr>

                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="3" style="padding: 10px 0px;">
                                <button id="sfyStart" style="width: 100%; height: 40px;">
                                    대량수집 시작하기
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
            `;

            document.documentElement.appendChild(paper);

            const sfyGoldMedalEnabled: any = document.getElementById('sfyGoldMedalEnabled');

            const sfyCategoryEnabled: any = document.getElementById('sfyCategoryEnabled');

            const sfyCategoryInput: any = document.getElementById('sfyCategoryInput');
            const sfyCategoryList = document.getElementById('sfyCategoryList');

            const sfyStart = document.getElementById('sfyStart');
            const sfyCancel = document.getElementById('sfyCancel');

            const sfyPageStart: any = document.getElementById('sfyPageStart');
            const sfyPageEnd: any = document.getElementById('sfyPageEnd');

            const sfyAmount: any = document.getElementById('sfyAmount');

            if (!sfyGoldMedalEnabled || !sfyCategoryEnabled || !sfyCategoryInput || !sfyCategoryList || !sfyStart || !sfyCancel || !sfyPageStart || !sfyPageEnd) {
                return;
            }

            sfyCategoryEnabled.addEventListener('change', (e: any) => {
                sfyCategoryInput.disabled = !e.target.checked;
                sfyCategoryList.style.display = "none";
            });

            sfyCategoryInput.addEventListener('focus', async (e: any) => {
                sfyCategoryList.style.display = "";
            });

            sfyCategoryInput.addEventListener('change', async (e: any) => {
                const input = e.target.value;

                const filtered = categoryJson.filter((v: any) =>
                    v['대분류'].includes(input) ||
                    v['중분류'].includes(input) ||
                    v['소분류'].includes(input) ||
                    v['세분류'].includes(input)
                );

                if (!filtered) {
                    return;
                }

                sfyCategoryList.innerHTML = ``;

                filtered.map((v: any) => {
                    let categoryName = ``;

                    if (v['대분류']) {
                        categoryName += v['대분류'];
                    }

                    if (v['중분류']) {
                        categoryName += " > ";
                        categoryName += v['중분류'];
                    }

                    if (v['소분류']) {
                        categoryName += " > ";
                        categoryName += v['소분류'];
                    }

                    if (v['세분류']) {
                        categoryName += " > ";
                        categoryName += v['세분류'];
                    }

                    sfyCategoryList.innerHTML += `
                            <div class="sfyCategory" data-category-id="${v['카테고리번호']}" style="cursor: pointer; padding: 5px; 0px;">
                                ${categoryName}
                            </div>
                        `;
                });

                const categories = document.getElementsByClassName('sfyCategory');

                for (let i = 0; i < categories.length; i++) {
                    categories[i].addEventListener('click', (e: any) => {
                        sfyCategoryInput.value = e.target.textContent.trim();
                        sfyCategoryInput.setAttribute('data-category-id', e.target.getAttribute('data-category-id'));

                        sfyCategoryList.style.display = "none";
                    });
                }
            });

            const startBulk = async (type) => {
                const tabs: any = await sendRuntimeMessage({ action: "tab-info-all" });

                let collectInfo: any = await getLocalStorage('collectInfo') ?? [];

                collectInfo = collectInfo.filter((v: any) => {
                    if (v.sender.tab.id === tabInfo.tab.id) {
                        return false;
                    }

                    const matched = tabs.find((w: any) => w.id === v.sender.tab.id);

                    if (!matched) {
                        return false;
                    }

                    return true;
                });

                if (!sfyCategoryEnabled.checked) {
                    sfyCategoryInput.setAttribute('data-category-id', '');
                }

                switch (type) {
                    case "page": {
                        collectInfo.push({
                            categoryId: sfyCategoryInput.getAttribute('data-category-id'),

                            currentPage: parseInt(sfyPageStart.value),

                            inputs: [],

                            maxLimits: 0,

                            pageStart: parseInt(sfyPageStart.value),
                            pageEnd: parseInt(sfyPageEnd.value),

                            sender: tabInfo,

                            type: "page",

                            useMedal: sfyGoldMedalEnabled.checked
                        });

                        break;
                    }

                    case "amount": {
                        collectInfo.push({
                            categoryId: sfyCategoryInput.getAttribute('data-category-id'),

                            currentPage: 1,

                            inputs: [],

                            maxLimits: parseInt(sfyAmount.value),

                            pageStart: 1,
                            pageEnd: 100,

                            sender: tabInfo,

                            type: "amount",

                            useMedal: sfyGoldMedalEnabled.checked
                        });

                        break;
                    }
                }

                await setLocalStorage({ collectInfo });

                pageRefresh(shop, parseInt(sfyPageStart.value));
            };

            sfyStart.addEventListener('click', async () => {
                const radios: any = document.getElementsByName('sfyBulkType');

                for (let i = 0; i < radios.length; i++) {
                    if (!radios[i].checked) {
                        continue;
                    }

                    startBulk(radios[i].value);
                }
            });

            sfyCancel.addEventListener('click', () => {
                paper.remove();
            });
        });

        buttonPageConfig.addEventListener('mouseenter', () => {
            buttonPageConfig.innerHTML = `
                    <img src=${chrome.runtime.getURL("/icon48.png")} width="20px" height="20px" style="margin-bottom: 5px;" />
                    
                    <div style="font-size: 12px;">
                        사용자정의
                        
                        <br/>
                        
                        대량수집
                    </div>
            `;
        });

        buttonPageConfig.addEventListener('mouseleave', () => {
            buttonPageConfig.innerHTML = buttonPageConfigDefault;
        });

        container.append(buttonPageConfig);

        bulkPage(shop);
    }

    document.documentElement.appendChild(container);

    if (isBulk) {
        buttonCollect.click();
    }
}

async function resultDetails(data: any) {
    let paper: any = document.getElementById('sfyPaper');
    let results = data.results.filter((v: any) => v.status === 'failed');

    if (results.length > 0) {
        let form = `
            <div style="background: white; border: 1px solid black; color: black; font-size: 16px; padding: 10px; width: 1000px; text-align: left;">
                <div style="display: flex; align-items: center; font-size: 20px; margin-bottom: 40px;">
                    <img src=${chrome.runtime.getURL("resources/icon-failed.png")} width="28px" height="28px" style="margin-bottom: 5px;" />
                    
                    &nbsp;

                    수집실패(${results.length})
                </div>

                <table style="width: 100%; margin-bottom: 20px;">
                    <tr>
                        <td style="text-align: center; width: 10%;">
                            <input id="sfyResultAll" type="checkbox" checked style="width: 20px; height: 20px;" />
                        </td>

                        <td style="text-align: center; width: 45%;">
                            상품URL
                        </td>

                        <td style="text-align: center; width: 45%;">
                            실패사유
                        </td>
                    </tr>
                </table>

                <div style="height: 100px; overflow-y: auto;">
                    <table id="sfyResultDetail" style="width: 100%;">
        `;

        results.map((v: any, index: number) => {
            form += `
                <tr>
                    <td style="text-align: center; width: 10%;">
                        <input id=${index} class="SFY-RESULT-CHECK" type="checkbox" checked style="width: 20px; height: 20px;" />
                    </td>

                    <td style="text-align: center; width: 45%;">
                        <a target="_blank" href=${v.input.url} style="color: gray;">
                            <div style="display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 400px; margin: auto;">
                                ${v.input.url}
                            </div>
                        </a>
                    </td>

                    <td style="text-align: center; width: 45%;">
                        <div style="color: red; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 400px; margin: auto;">
                            ${v.statusMessage}
                        </div>
                    </td>
                </tr>
            `;
        });

        form += `
                    </table>
                </div>

                <table style="width: 100%; margin-top: 20px;">
                    <tr>
                        <td style="text-align: center; width: 25%;">
                            <button id="sfyPage" style="width: 200px; height: 40px;">
                                처음페이지로
                            </button>
                        </td>

                        <td style="text-align: center; width: 25%;">
                            <button id="sfyRetry" style="width: 200px; height: 40px;">
                                선택상품 재수집
                            </button>
                        </td>

                        <td style="text-align: center; width: 25%;">
                            <button id="sfyConnect" style="width: 200px; height: 40px;">
                                수집상품목록 이동
                            </button>
                        </td>

                        <td style="text-align: center; width: 25%;">
                            <button id="sfyCopy" style="width: 200px; height: 40px;">
                                클립보드 복사
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
        `;

        paper.innerHTML = form;
    } else {
        let form = `
            <div style="background: white; border: 1px solid black; color: black; font-size: 16px; padding: 10px; width: 500px; text-align: left;">
                <div style="display: flex; align-items: center; font-size: 20px; margin-bottom: 40px;">
                    <img src=${chrome.runtime.getURL("resources/icon-success.png")} width="28px" height="28px" style="margin-bottom: 5px;" />
                    
                    &nbsp;
                    
                    수집완료(${data.results.length})
                </div>

                <table style="width: 100%;">
                    <tr>
                        <td style="text-align: center; width: 50%;">
                            <button id="sfyPage" style="width: 200px; height: 40px;">
                                처음페이지로
                            </button>
                        </td>

                        <td style="text-align: center; width: 50%;">
                            <button id="sfyConnect" style="width: 200px; height: 40px;">
                                수집상품목록 이동
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
        `;

        paper.innerHTML = form;
    }

    const checks: any = document.getElementsByClassName('SFY-RESULT-CHECK');

    for (let i = 0; i < checks.length; i++) {
        checks[i].addEventListener('change', (e: any) => {
            results[e.target.id].checked = e.target.checked;
        });
    }

    document.getElementById('sfyResultAll')?.addEventListener('change', (e: any) => {
        results.map((v: any) => v.checked = e.target.checked);

        for (let i = 0; i < checks.length; i++) {
            checks[i].checked = e.target.checked;
        }
    });

    document.getElementById('sfyPage')?.addEventListener('click', () => {
        window.location.href = data.sender.tab.url;
    });

    document.getElementById('sfyRetry')?.addEventListener('click', () => {
        const inputs = results.filter((v: any) => v.checked).map((v: any) => {
            return v.input;
        });

        if (data.isExcel) {
            sendRuntimeMessage({ action: 'collect-product-excel', source: { data: inputs, retry: true } });
        } else {
            sendRuntimeMessage({ action: 'collect-bulk', source: { data: inputs, retry: true } });
        }
    });

    document.getElementById('sfyConnect')?.addEventListener('click', () => {
        window.open(chrome.runtime.getURL("product/collected.html"));
    });

    document.getElementById('sfyCopy')?.addEventListener('click', () => {
        const text = document.getElementById('sfyResultDetail')?.innerText ?? "";

        navigator.clipboard.writeText(text).then(function () {
            alert("클립보드에 복사되었습니다.");
        }, function () {
            alert("클립보드에 복사할 수 없습니다.");
        });
    });

    let collectInfo: any = await getLocalStorage('collectInfo') ?? [];
    let collect = collectInfo.find((v: any) => v.sender.tab.id === tabInfo.tab.id);

    if (!collect) {
        return;
    }

    collect.currentPage = collect.pageEnd + 1;

    await setLocalStorage({ collectInfo });

    return true;
}

async function checkLogin() {
    let user = await sendRuntimeMessage({ action: "user" });

    if (!user) {
        alert("인증정보를 찾을 수 없습니다. 로그인 후 재시도 해주세요.");

        return null;
    }

    return user;
}

async function addExcelInfo(request) {
    const tabs: any = await sendRuntimeMessage({ action: "tab-info-all" });

    let collectInfo: any = await getLocalStorage('collectInfo') ?? [];

    collectInfo = collectInfo.filter((v: any) => {
        if (v.sender.tab.id === tabInfo.tab.id) {
            return false;
        }

        const matched = tabs.find((w: any) => w.id === v.sender.tab.id);

        if (!matched) {
            return false;
        }

        return true;
    });

    collectInfo.push({
        categoryId: "",

        currentPage: 1,

        inputs: [],

        pageStart: 1,
        pageEnd: request.source.data.length,
        pageList: request.source.data,

        sender: tabInfo,

        type: "excel-page",
    });

    await setLocalStorage({ collectInfo });

    window.location.href = request.source.data[0].url;

    return true;
}

async function main() {
    let link = document.createElement('link');

    link.href = chrome.runtime.getURL("ui/css/uicons-regular-straight.css")
    link.type = 'text/css';
    link.rel = 'stylesheet';

    document.documentElement.insertBefore(link, null);

    const currentUrl = window.location.href;

    let result = null;
    let paper = document.createElement('div');

    isBulk = await sendRuntimeMessage({ action: "is-bulk" });
    tabInfo = await sendRuntimeMessage({ action: "tab-info" });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.action) {
            case "fetch": {
                fetch(request.source)
                    .then(res => res.arrayBuffer())
                    .then(data => iconv.decode(Buffer.from(data), 'gbk').toString())
                    .then(sendResponse);

                return true;
            }

            case "upload-A077": {
                let paper = document.createElement('div');

                paper.id = 'sfyPaper';
                paper.className = "SELLFORYOU-INFORM";
                paper.innerHTML = `
                    <div style="margin-bottom: 40px;">
                        스마트스토어 업로드가 진행 중입니다.
                    </div>
            
                    <div style="color: #ff4b4b; font-size: 24px; margin-bottom: 10px;">
                        업로드가 진행되는 동안 다른 탭을 이용해주시기 바랍니다.
                    </div>
            
                    <div style="color: #ff4b4b; font-size: 24px;">
                        현재 탭에서 페이지를 이동할 경우 업로드가 중단될 수 있습니다.
                    </div>
                `;

                document.documentElement.appendChild(paper);

                uploadA077Resources(request.source).then(sendResponse);

                return true;
            }

            case "collect-product-excel": {
                sendRuntimeMessage(request);
                sendResponse(true);

                break;
            }

            case "collect-page-excel": {
                addExcelInfo(request).then(sendResponse);

                return true;
            }

            case "collect-finish": {
                resultDetails(request.source).then(sendResponse);

                return true;
            }

            case "order-taobao": {
                getTaobaoData().then(sendResponse);

                return true;
            }

            case "order-tmall": {
                break;
            }

            case "order-express": {
                break;
            }

            case "order-alibaba": {
                break;
            }

            case "order-vvic": {
                break;
            }
        }
    });

    if (isBulk) {
        paper.id = 'sfyPaper';
        paper.className = "SELLFORYOU-INFORM";
        paper.innerHTML = `
            <div style="margin-bottom: 40px;">
                대량 수집이 진행 중입니다.
            </div>
    
            <div style="color: black; font-size: 24px; margin-bottom: 40px;">
                수집을 중단하려면
    
                <button id="sfyPause" style="font-weight: bolder; padding: 10px;">
                    여기를 클릭
                </button>
    
                하거나 
                
                <button style="font-weight: bolder; padding: 10px;">
                    ESC
                </button>
    
                키를 눌러주세요.
            </div>
    
            <div style="color: #ff4b4b; font-size: 24px; margin-bottom: 10px;">
                수집이 진행되는 동안 다른 탭을 이용해주시기 바랍니다.
            </div>
    
            <div style="color: #ff4b4b; font-size: 24px;">
                현재 탭에서 페이지를 이동할 경우 수집이 중단될 수 있습니다.
            </div>
        `;

        document.documentElement.appendChild(paper);

        window.addEventListener('keydown', (e: any) => {
            if (e.key === 'Escape') {
                paper.innerHTML = `
                    <div style="margin-bottom: 40px;">
                        대량 수집을 중단하는 중입니다.
                    </div>
            
                    <div style="color: #ff4b4b; font-size: 24px; margin-bottom: 10px;">
                        수집이 중단되는 동안 다른 탭을 이용해주시기 바랍니다.
                    </div>
            
                    <div style="color: #ff4b4b; font-size: 24px;">
                        현재 탭에서 페이지를 이동할 경우 수집이 중단되지 않을 수 있습니다.
                    </div>
                `;

                sendRuntimeMessage({ action: 'collect-stop' });
            }
        });

        document.getElementById('sfyPause')?.addEventListener('click', () => {
            paper.innerHTML = `
                <div style="margin-bottom: 40px;">
                    대량 수집을 중단하는 중입니다.
                </div>
        
                <div style="color: #ff4b4b; font-size: 24px; margin-bottom: 10px;">
                    수집이 중단되는 동안 다른 탭을 이용해주시기 바랍니다.
                </div>
        
                <div style="color: #ff4b4b; font-size: 24px;">
                    현재 탭에서 페이지를 이동할 경우 수집이 중단되지 않을 수 있습니다.
                </div>
            `;

            sendRuntimeMessage({ action: 'collect-stop' });
        });
    }

    if (/item.taobao.com\/item.htm/.test(currentUrl)) {
        const user = await checkLogin();

        if (!user) {
            return;
        }

        result = await new taobao().get(user);

        floatingButton(null, result, false);
    } else if (/s.taobao.com\/search/.test(currentUrl)) {
        await new taobao().bulkTypeOne();

        floatingButton('taobao1', true, true);
    } else if (/world.taobao.com\/search/.test(currentUrl) || /taobao.com\/search/.test(currentUrl) || /taobao.com\/category/.test(currentUrl)) {//todo suseong
        await new taobao().bulkTypeTwo();

        floatingButton('taobao2', true, true);
    } else if (/detail.tmall.com/.test(currentUrl) ||
        /chaoshi.detail.tmall.com/.test(currentUrl) ||
        // /world.tmall.com/.test(currentUrl) ||
        /detail.tmall.hk/.test(currentUrl)) {
        const user = await checkLogin();

        if (!user) {
            return;
        }

        result = await new tmall().get(user);

        floatingButton(null, result, false);
    } else if (/tmall.com/.test(currentUrl)) {
        if (/list.tmall.com/.test(currentUrl)) {
            await new tmall().bulkTypeOne();

            floatingButton('tmall1', true, true);
        } else {
            await new tmall().bulkTypeTwo();

            floatingButton('tmall2', true, true);
        }
    } else if (/aliexpress.com\/item/.test(currentUrl)) {
        const user = await checkLogin();

        if (!user) {
            return;
        }

        result = await new express().get(user);

        floatingButton('express', result, false);
    } else if (
        /aliexpress.com\/af/.test(currentUrl) ||
        /aliexpress.com\/af\/category/.test(currentUrl) ||
        /aliexpress.com\/af\/wholesale/.test(currentUrl) ||
        /aliexpress.com\/w\/wholesale/.test(currentUrl) ||
        /aliexpress.com\/category/.test(currentUrl) ||
        /aliexpress.com\/premium/.test(currentUrl) ||
        /aliexpress.com\/wholesale/.test(currentUrl)
    ) {
        await new express().bulkTypeOne();
        await new express().bulkTypeTwo();

        floatingButton('express', true, true);
    } else if (/aliexpress.com\/store/.test(currentUrl)) {
        await new express().bulkTypeThree();

        floatingButton('express', true, true);
    } else if (/detail.1688.com/.test(currentUrl)) {
        const user = await checkLogin();
        if (!user) {
            return;
        }

        result = await new alibaba().get(user);

        floatingButton('alibaba', result, false);
    } else if (
        /s.1688.com\/selloffer\/offer_search.htm/.test(currentUrl) ||
        /1688.com\/page\/offerlist/.test(currentUrl)
    ) {
        await new alibaba().bulkTypeOne();
        await new alibaba().bulkTypeTwo();

        floatingButton('alibaba', true, true);
    } else if (/show.1688.com\/pinlei\/industry\/pllist.html/.test(currentUrl)) {
        await new alibaba().bulkTypeOne();

        floatingButton('alibaba', true, true);
    } else if (/www.vvic.com\/item/.test(currentUrl)) {
        const user = await checkLogin();

        if (!user) {
            return;
        }

        result = await new vvic().get(user);

        floatingButton('vvic', result, false);
    } else if (/www.vvic.com\/.+\/search/.test(currentUrl) ||
        /www.vvic.com\/.+\/topic/.test(currentUrl)) {
        await new vvic().bulkTypeOne(2);

        floatingButton('vvic', true, true);
    } else if (/www.vvic.com\/shop/.test(currentUrl)) {
        await new vvic().bulkTypeOne(3);

        floatingButton('vvic', true, true);
    } else if (/www.vvic.com\/.+\/list/.test(currentUrl)) {
        await new vvic().bulkTypeOne(4);

        floatingButton('vvic', true, true);
    }
}

main();







