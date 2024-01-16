import { taobao } from './modules/taobao';
import { tmall } from './modules/tmall';
import { express } from './modules/express';
import { alibaba } from './modules/alibaba';
import { vvic } from './modules/vvic';
import { amazon } from './modules/amazon';
import { getLocalStorage, sendRuntimeMessage, setLocalStorage } from '../Tools/ChromeAsync';
import { getCookie, normalizeUrl, sleep, updateQueryStringParameter } from '../Tools/Common';
import { getTaobaoData } from '../Tools/Taobao';
import {
	deleteA077Products,
	editedA077Products,
	searchA077Products,
	uploadA077Products,
	uploadA077Resources,
} from '../Tools/SmartStore';
import { uploadWemakeprice2, editWemakeprice, deleteWemakeprice2 } from '../Tools/Wemakeprice';
import { CollectInfo, Nullable, RuntimeMessage, Sender, Shop, User } from '../../type/type';

/** SELLFORYOU-CHECKBOX 삽입 함수 */
export const onInsertDom = ({
	element, // 삽입하고자 하는 element
	picker, // 상품일괄 선택/해제 박스
	user, // User 객체
}: {
	element: Nullable<HTMLAnchorElement>;
	picker: HTMLButtonElement | null;
	user: User;
}) => {
	if (!element) return;
	if (element.querySelector('.SELLFORYOU-CHECKBOX')) return;
	if (!element.href || element.href === '') return;

	const input = Object.assign(document.createElement('input'), {
		className: 'SELLFORYOU-CHECKBOX',
		checked: picker?.value !== 'false',
		type: 'checkbox',
		id: normalizeUrl(element.href),
		style: user.userInfo.collectCheckPosition === 'L' ? 'left: 0px !important' : 'right: 0px !important',
	});

	element.style.position = 'relative';
	element.appendChild(input);
};

/** vvic 상점페이지 api로 대량수집하기 함수 */
const bulkCollectUsingApi = async (shopId: number, currentPage: number) => {
	const resp = await fetch(
		`https://www.vvic.com/apif/shop/itemlist?id=${shopId}&currentPage=${currentPage}&sort=up_time-desc&merge=0`,
		{
			headers: {
				accept: 'application/json, text/plain, */*',
				'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
				'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"Windows"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin',
				token: 'RajToken',
			},
			referrer: `https://www.vvic.com/shop/list/${shopId}/content_all`,
			referrerPolicy: 'strict-origin-when-cross-origin',
			body: null,
			method: 'GET',
			mode: 'cors',
			credentials: 'include',
		},
	);
	if (resp.status !== 200) {
		alert('상품수집 api Error\n채널톡에 문의 바랍니다.');
		return [];
	}
	const json = await resp.json();
	const urls = json?.data?.recordList?.map((v) => ({
		url: `https://www.vvic.com/item/${v.vid}`,
		productName: '',
		productTags: '',
	}));
	return urls as CollectInfo['inputs'];
};

const pageRefresh = async (shop: Shop | null, page: number) => {
	let url: string | null = null;
	//페이지 검색 필터(검색필터) 문제
	switch (shop) {
		case 'taobao1': {
			url = updateQueryStringParameter(window.location.href, 's', `${44 * (page - 1)}`);

			break;
		}

		case 'taobao2': {
			url = updateQueryStringParameter(window.location.href, 'pageNo', `${page}`);

			break;
		}

		case 'tmall1': {
			url = updateQueryStringParameter(window.location.href, 's', `${60 * (page - 1)}`);

			break;
		}

		case 'tmall2': {
			url = updateQueryStringParameter(window.location.href, 'pageNo', `${page}`);

			break;
		}

		case 'express': {
			url = updateQueryStringParameter(window.location.href, 'page', `${page}`);

			break;
		}

		case 'alibaba': {
			url = updateQueryStringParameter(window.location.href, 'beginPage', `${page}`);

			break;
		}

		case 'vvic': {
			url = updateQueryStringParameter(window.location.href, 'currentPage', `${page}`);

			break;
		}

		case 'amazon1': {
			url = updateQueryStringParameter(window.location.href, 'page', `${page}`);

			break;
		}

		default:
			break;
	}

	if (!url) return;

	window.location.href = url.replaceAll('#', '');
};

const bulkCollect = async (useChecked: boolean, useMedal: boolean) => {
	let inputs: CollectInfo['inputs'] = [];
	let timeout = 0;

	//타임아웃 필요
	while (true) {
		if (timeout === 15) break;

		let list = document.getElementsByClassName('SELLFORYOU-CHECKBOX');

		if (list.length > 0) {
			for (let i = 0; i < list.length; i++) {
				let toggle = false;
				//@ts-ignore
				if (useChecked && !list[i].checked) continue;
				if (useMedal) {
					if (list[i].getAttribute('medal') === '1') toggle = true;
				} else toggle = true;

				if (!toggle) continue;

				inputs.push({
					url: list[i].id,
					productName: '',
					productTags: '',
				});
			}

			break;
		}

		timeout += 1;

		await sleep(1000 * 1);
	}

	return inputs;
};

const bulkPage = async (
	info: {
		user: User;
		isBulk: boolean;
		tabInfo: Sender;
	},
	shop: Shop | null,
	urlUnchangedPage?: { shopId: number; method: 'api' | 'element' },
) => {
	// console.log('구간4');
	// await sleep(10000);
	let collectInfo = (await getLocalStorage<CollectInfo[]>('collectInfo')) ?? [];
	// console.log(`콜렉트인포`);
	// console.log({ collectInfo });
	let collect = collectInfo.find((v) => v.sender.tab.id === info.tabInfo.tab.id);
	// console.log(`1번 콜렉트`);
	// console.log({ collect });
	if (!collect) return;
	if (collect.currentPage <= collect.pageEnd) {
		const inputs =
			urlUnchangedPage?.method === 'api'
				? await bulkCollectUsingApi(urlUnchangedPage.shopId, collect.currentPage)
				: await bulkCollect(false, collect.useMedal);

		if (inputs.length === 0) collect.currentPage = collect.pageEnd;

		collect.inputs = collect.inputs.concat(inputs);
		collect.currentPage += 1;
		// console.log(`2번 콜렉트`);
		// console.log({ collect });
		// await sleep(20000);
		switch (collect.type) {
			case 'page': {
				// console.log('구간8');
				if (collect.currentPage > collect.pageEnd) {
					// console.log('구간8-1');
					// await sleep(10000);
					sendRuntimeMessage({
						action: 'collect-bulk',
						source: { data: collect.inputs, retry: false },
					});
				} else {
					// console.log('구간8-2');
					// await sleep(10000);
					pageRefresh(shop, collect.currentPage);
				}

				break;
			}

			case 'amount': {
				if (collect.inputs.length > collect.maxLimits) {
					collect.inputs = collect.inputs.slice(0, collect.maxLimits);

					sendRuntimeMessage({
						action: 'collect-bulk',
						source: { data: collect.inputs, retry: false },
					});
				} else pageRefresh(shop, collect.currentPage);

				break;
			}

			case 'excel-page': {
				if (collect.currentPage > collect.pageEnd)
					sendRuntimeMessage({
						action: 'collect-bulk',
						source: { data: collect.inputs, retry: false },
					});
				else window.location.href = collect.pageList[collect.currentPage - 1].url;

				break;
			}
		}

		await setLocalStorage({ collectInfo });
	}
};

const skip = () => sendRuntimeMessage({ action: 'collect-finish' });
/**
 *
 * @param info
 * @param shop 마켓이름
 * @param result any
 * @param bulk 대량수집버튼인지 여부
 * @param urlUnchangedPage 사용자정의 대량수집시 url변동이 없어 api를 이용해야 하는 경우
 * @returns void
 */
const floatingButton = async (
	info: {
		user: User;
		isBulk: boolean;
		tabInfo: Sender;
	},
	shop: Shop | null,
	result: any,
	bulk: boolean,
	urlUnchangedPage?: { shopId: number; method: 'api' | 'element' },
) => {
	if (!result) return;
	let isCollecting = false;
	let container = document.createElement('table');
	container.className = 'SELLFORYOU-FLOATING';
	let buttonCollect = document.createElement('button');
	let buttonCollectDefault = `<i class="fi fi-rs-inbox-in" style="display: flex; align-items: center; font-size: 32px;"></i>`;
	buttonCollect.className = 'SELLFORYOU-COLLECT';
	buttonCollect.innerHTML = buttonCollectDefault;

	buttonCollect.addEventListener('click', async () => {
		if (!info.isBulk && result.error) {
			if (confirm(`${result.error}\n[확인]을 누르시면 수집상품목록으로 이동합니다.`))
				window.open(chrome.runtime.getURL('product/collected.html'));

			return;
		}

		if (isCollecting) return;

		if (bulk) {
			let categoryResp = await fetch(chrome.runtime.getURL('resources/category.json'));
			let categoryJson = await categoryResp.json();
			let paper = document.createElement('div');

			paper.id = 'sfyPaper';
			paper.className = 'SELLFORYOU-INFORM';
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
                                <label style="cursor: pointer; display: flex; align-items: center; font-size: 18px; margin-bottom: 20px;">
                                    <input id="sfyMyKeywardEnabled" type="checkbox" style="cursor: pointer; width: 20px; height: 20px;" />

                                    &nbsp;

                                    개인분류 설정
                                </label>

                                <table style="width: 100%;">
                                    <tr>
                                        <td style="padding: 5px; width: 25%;">
                                            개인분류 입력
                                        </td>

                                        <td style="padding: 5px; width: 75%;">
                                            <div style="position: relative;">
                                                <input id="sfyMyKeywardInput" disabled data-myKeyward-id="" style="border: 1px solid black; width: 100%;" />
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="3" style="color: red; padding: 10px 0px;">
                                개인분류를 설정하시려면 개인분류 설정란을 체크해주세요.(공백은 제거됩니다.)
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
                            <td colspan="3" style="border: 1px solid black; width: 50%; padding: 10px;">
                                <label style="cursor: pointer; display: flex; align-items: center; font-size: 18px;">
                                    <input id="sfyStandardShippingEnabled" type="checkbox" style="cursor: pointer; width: 20px; height: 20px;" />

                                    &nbsp;

                                    스탠다드 쉬핑 상품만 수집하기 (알리익스프레스)
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
			const sfyStandardShippingEnabled: any = document.getElementById('sfyStandardShippingEnabled');
			const sfyCategoryEnabled: any = document.getElementById('sfyCategoryEnabled');
			const sfyMyKeywardEnabled: any = document.getElementById('sfyMyKeywardEnabled');
			const sfyCategoryInput: any = document.getElementById('sfyCategoryInput');
			const sfyMyKeywardInput: any = document.getElementById('sfyMyKeywardInput');
			const sfyCategoryList = document.getElementById('sfyCategoryList');
			const sfyStart = document.getElementById('sfyStart');
			const sfyCancel = document.getElementById('sfyCancel');

			if (
				!sfyGoldMedalEnabled ||
				!sfyStandardShippingEnabled ||
				!sfyCategoryEnabled ||
				!sfyCategoryInput ||
				!sfyCategoryList ||
				!sfyStart ||
				!sfyCancel ||
				!sfyMyKeywardEnabled
			)
				return;

			sfyCategoryEnabled.addEventListener('change', (e: any) => {
				sfyCategoryInput.disabled = !e.target.checked;
				sfyCategoryList.style.display = 'none';
			});
			sfyMyKeywardEnabled.addEventListener('change', (e: any) => (sfyMyKeywardInput.disabled = !e.target.checked));
			sfyCategoryInput.addEventListener('focus', (e: any) => (sfyCategoryList.style.display = ''));
			sfyMyKeywardInput.addEventListener('change', (e: any) => {
				sfyMyKeywardInput.value = e.target.value.trim();
				sfyMyKeywardInput.setAttribute('data-myKeyward-id', e.target.value.trim());
			});
			sfyCategoryInput.addEventListener('change', (e: any) => {
				const input = e.target.value;
				const filtered = categoryJson.filter(
					(v: any) =>
						v['대분류'].includes(input) ||
						v['중분류'].includes(input) ||
						v['소분류'].includes(input) ||
						v['세분류'].includes(input),
				);

				if (!filtered) return;

				sfyCategoryList.innerHTML = ``;

				filtered.map((v: any) => {
					let categoryName = ``;

					if (v['대분류']) categoryName += v['대분류'];
					if (v['중분류']) {
						categoryName += ' > ';
						categoryName += v['중분류'];
					}
					if (v['소분류']) {
						categoryName += ' > ';
						categoryName += v['소분류'];
					}
					if (v['세분류']) {
						categoryName += ' > ';
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
						sfyCategoryList.style.display = 'none';
					});
				}
			});

			const startBulk = async () => {
				const tabs = await sendRuntimeMessage<chrome.tabs.Tab[]>({ action: 'tab-info-all' });

				let collectInfo = (await getLocalStorage<Partial<CollectInfo>[]>('collectInfo')) ?? [];

				collectInfo = collectInfo.filter((v) => {
					if (v.sender?.tab.id === info.tabInfo.tab.id) return false;

					const matched = tabs?.find((w) => w.id === v.sender?.tab.id);

					if (!matched) return false;

					return true;
				});

				if (!sfyCategoryEnabled.checked) sfyCategoryInput.setAttribute('data-category-id', '');
				if (!sfyMyKeywardEnabled.checked) sfyMyKeywardInput.setAttribute('data-myKeyward-id', '');

				collectInfo.push({
					categoryId: sfyCategoryInput.getAttribute('data-category-id'),
					myKeyward: sfyMyKeywardInput.getAttribute('data-myKeyward-id'),
					sender: info.tabInfo,
					useMedal: sfyGoldMedalEnabled.checked,
					useStandardShipping: sfyStandardShippingEnabled.checked,
				});

				await setLocalStorage({ collectInfo });

				const inputs = await bulkCollect(true, sfyGoldMedalEnabled.checked);

				sendRuntimeMessage({
					action: 'collect-bulk',
					source: { data: inputs, retry: false },
				});
			};

			sfyStart.addEventListener('click', () => startBulk());
			sfyCancel.addEventListener('click', () => paper.remove());
		} else {
			isCollecting = true;

			buttonCollect.innerHTML = `<div class="SELLFORYOU-LOADING" />`;

			const response = await sendRuntimeMessage<{ status: string; statusMessage: string }>({
				action: 'collect',
				source: result,
			});

			if (!response) return;
			if (response.status === 'success')
				buttonCollect.innerHTML = `
                    <img src=${chrome.runtime.getURL(
											'resources/icon-success.png',
										)} width="20px" height="20px" style="margin-bottom: 5px;" />

                    수집완료
                `;
			else
				buttonCollect.innerHTML = `
                    <img src=${chrome.runtime.getURL(
											'resources/icon-failed.png',
										)} width="20px" height="20px" style="margin-bottom: 5px;" />

                    수집실패
                `;

			result.error = response.statusMessage;

			if (info.isBulk) sendRuntimeMessage({ action: 'collect-finish' });
		}
	});

	buttonCollect.addEventListener('mouseenter', () => {
		if (isCollecting) return;

		buttonCollect.innerHTML = `
            <div style="font-size: 12px;">
                ${
									bulk
										? `
                    현재페이지

                    <br/>

                    수집하기
                `
										: `
                    현재상품

                    <br/>

                    수집하기
                `
								}
            </div>
        `;
	});

	buttonCollect.addEventListener('mouseleave', () => {
		if (isCollecting) return;

		buttonCollect.innerHTML = buttonCollectDefault;
	});

	const buttonCollectCol = document.createElement('td');
	const buttonCollectRow = document.createElement('tr');
	buttonCollectCol.className = 'SELLFORYOU-CELL';
	buttonCollectCol.append(buttonCollect);
	buttonCollectRow.append(buttonCollectCol);
	container.append(buttonCollectRow);

	if (bulk) {
		let buttonCheckAll: any = document.createElement('button');
		let buttonCheckAllDefault = `<i class="fi fi-rs-list-check" style="display: flex; align-items: center; font-size: 32px;"></i>`;

		buttonCheckAll.id = 'sfyPicker';
		buttonCheckAll.value = true;
		buttonCheckAll.className = 'SELLFORYOU-COLLECT';
		buttonCheckAll.innerHTML = buttonCheckAllDefault;
		buttonCheckAll.addEventListener('click', () => {
			let list: any = document.getElementsByClassName('SELLFORYOU-CHECKBOX');

			if (buttonCheckAll.value === 'true') {
				buttonCheckAll.value = false;
				buttonCheckAllDefault = `<i class="fi fi-rs-list" style="display: flex; align-items: center; font-size: 32px;"></i>`;

				for (let i = 0; i < list.length; i++) list[i].checked = false;
			} else {
				buttonCheckAll.value = true;
				buttonCheckAllDefault = `<i class="fi fi-rs-list-check" style="display: flex; align-items: center; font-size: 32px;"></i>`;

				for (let i = 0; i < list.length; i++) list[i].checked = true;
			}
		});

		buttonCheckAll.addEventListener(
			'mouseenter',
			() =>
				(buttonCheckAll.innerHTML = `
                <div style="font-size: 12px;">
                    상품일괄

                    <br/>

                    선택/해제
                </div>
            `),
		);

		buttonCheckAll.addEventListener('mouseleave', () => (buttonCheckAll.innerHTML = buttonCheckAllDefault));

		const buttonCheckAllCol = document.createElement('td');
		const buttonCheckAllRow = document.createElement('tr');

		buttonCheckAllCol.className = 'SELLFORYOU-CELL';
		buttonCheckAllCol.append(buttonCheckAll);
		buttonCheckAllRow.append(buttonCheckAllCol);

		container.append(buttonCheckAllRow);

		if (shop != 'amazon2') {
			let buttonPageConfig: any = document.createElement('button');
			let buttonPageConfigDefault = `<i class="fi fi-rs-settings" style="display: flex; align-items: center; font-size: 32px;"></i>`;

			buttonPageConfig.id = 'sfyPageConfig';
			buttonPageConfig.value = true;
			buttonPageConfig.className = 'SELLFORYOU-COLLECT';
			buttonPageConfig.innerHTML = buttonPageConfigDefault;
			buttonPageConfig.addEventListener('click', async () => {
				let categoryResp = await fetch(chrome.runtime.getURL('resources/category.json'));
				let categoryJson = await categoryResp.json();
				let paper = document.createElement('div');

				paper.id = 'sfyPaper';
				paper.className = 'SELLFORYOU-INFORM';
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
                                <label style="cursor: pointer; display: flex; align-items: center; font-size: 18px; margin-bottom: 20px;">
                                    <input id="sfyMyKeywardEnabled" type="checkbox" style="cursor: pointer; width: 20px; height: 20px;" />

                                    &nbsp;

                                    개인분류 설정
                                </label>

                                <table style="width: 100%;">
                                    <tr>
                                        <td style="padding: 5px; width: 25%;">
                                            개인분류 입력
                                        </td>

                                        <td style="padding: 5px; width: 75%;">
                                            <div style="position: relative;">
                                                <input id="sfyMyKeywardInput" disabled data-myKeyward-id="" style="border: 1px solid black; width: 100%;" />
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="3" style="color: red; padding: 10px 0px;">
                                개인분류를 설정하시려면 개인분류 설정란을 체크해주세요.(공백은 제거됩니다.)
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
                                <td colspan="3" style="border: 1px solid black; width: 50%; padding: 10px;">
                                    <label style="cursor: pointer; display: flex; align-items: center; font-size: 18px;">
                                        <input id="sfyStandardShippingEnabled" type="checkbox" style="cursor: pointer; width: 20px; height: 20px;" />

                                        &nbsp;

                                        스탠다드 쉬핑 상품만 수집하기 (알리익스프레스)
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
				const sfyStandardShippingEnabled: any = document.getElementById('sfyStandardShippingEnabled');
				const sfyCategoryEnabled: any = document.getElementById('sfyCategoryEnabled');
				const sfyMyKeywardEnabled: any = document.getElementById('sfyMyKeywardEnabled');
				const sfyCategoryInput: any = document.getElementById('sfyCategoryInput');
				const sfyMyKeywardInput: any = document.getElementById('sfyMyKeywardInput');
				const sfyCategoryList = document.getElementById('sfyCategoryList');
				const sfyStart = document.getElementById('sfyStart');
				const sfyCancel = document.getElementById('sfyCancel');
				const sfyPageStart: any = document.getElementById('sfyPageStart');
				const sfyPageEnd: any = document.getElementById('sfyPageEnd');
				const sfyAmount: any = document.getElementById('sfyAmount');

				if (
					!sfyGoldMedalEnabled ||
					!sfyStandardShippingEnabled ||
					!sfyCategoryEnabled ||
					!sfyCategoryInput ||
					!sfyCategoryList ||
					!sfyStart ||
					!sfyCancel ||
					!sfyPageStart ||
					!sfyPageEnd ||
					!sfyMyKeywardEnabled
				)
					return;

				sfyCategoryEnabled.addEventListener('change', (e: any) => {
					sfyCategoryInput.disabled = !e.target.checked;
					sfyCategoryList.style.display = 'none';
				});

				sfyMyKeywardEnabled.addEventListener('change', (e: any) => (sfyMyKeywardInput.disabled = !e.target.checked));
				sfyCategoryInput.addEventListener('focus', (e: any) => (sfyCategoryList.style.display = ''));
				sfyMyKeywardInput.addEventListener('change', (e: any) => {
					sfyMyKeywardInput.value = e.target.value.trim();
					sfyMyKeywardInput.setAttribute('data-myKeyward-id', e.target.value.trim());
				});

				sfyCategoryInput.addEventListener('change', (e: any) => {
					const input = e.target.value;
					const filtered = categoryJson.filter(
						(v: any) =>
							v['대분류'].includes(input) ||
							v['중분류'].includes(input) ||
							v['소분류'].includes(input) ||
							v['세분류'].includes(input),
					);

					if (!filtered) return;

					sfyCategoryList.innerHTML = ``;

					filtered.map((v: any) => {
						let categoryName = ``;

						if (v['대분류']) categoryName += v['대분류'];
						if (v['중분류']) {
							categoryName += ' > ';
							categoryName += v['중분류'];
						}
						if (v['소분류']) {
							categoryName += ' > ';
							categoryName += v['소분류'];
						}
						if (v['세분류']) {
							categoryName += ' > ';
							categoryName += v['세분류'];
						}

						sfyCategoryList.innerHTML += `
                            <div class="sfyCategory" data-category-id="${v['카테고리번호']}" style="cursor: pointer; padding: 5px; 0px;">
                                ${categoryName}
                            </div>
                        `;
					});

					const categories = document.getElementsByClassName('sfyCategory');

					for (let i = 0; i < categories.length; i++)
						categories[i].addEventListener('click', (e: any) => {
							sfyCategoryInput.value = e.target.textContent.trim();
							sfyCategoryInput.setAttribute('data-category-id', e.target.getAttribute('data-category-id'));
							sfyCategoryList.style.display = 'none';
						});
				});

				const startBulk = async (type: 'page' | 'amount') => {
					// console.log('구간2');
					// await sleep(10000);
					const tabs = await sendRuntimeMessage<chrome.tabs.Tab[]>({
						action: 'tab-info-all',
					});

					let collectInfo = ((await getLocalStorage('collectInfo')) as Partial<CollectInfo>[]) ?? [];

					collectInfo = collectInfo.filter((v) => {
						if (v.sender?.tab.id === info.tabInfo.tab.id) return false;

						const matched = tabs?.find((w) => w.id === v.sender?.tab.id);

						if (!matched) return false;

						return true;
					});

					if (!sfyCategoryEnabled.checked) sfyCategoryInput.setAttribute('data-category-id', '');
					if (!sfyMyKeywardEnabled.checked) sfyMyKeywardInput.setAttribute('data-myKeyward-id', '');
					switch (type) {
						case 'page': {
							collectInfo.push({
								categoryId: sfyCategoryInput.getAttribute('data-category-id'),
								myKeyward: sfyMyKeywardInput.getAttribute('data-myKeyward-id'),
								currentPage: parseInt(sfyPageStart.value),
								inputs: [],
								maxLimits: 0,
								pageStart: parseInt(sfyPageStart.value),
								pageEnd: parseInt(sfyPageEnd.value),
								sender: info.tabInfo,
								type: 'page',
								useMedal: sfyGoldMedalEnabled.checked,
								useStandardShipping: sfyStandardShippingEnabled.checked,
							});

							break;
						}

						case 'amount': {
							collectInfo.push({
								categoryId: sfyCategoryInput.getAttribute('data-category-id'),
								myKeyward: sfyMyKeywardInput.getAttribute('data-myKeyward-id'),
								currentPage: 1,
								inputs: [],
								maxLimits: parseInt(sfyAmount.value),
								pageStart: 1,
								pageEnd: 100,
								sender: info.tabInfo,
								type: 'amount',
								useMedal: sfyGoldMedalEnabled.checked,
								useStandardShipping: sfyStandardShippingEnabled.checked,
							});

							break;
						}
					}
					await setLocalStorage({ collectInfo });

					pageRefresh(shop, parseInt(sfyPageStart.value));
				};

				sfyStart.addEventListener('click', async () => {
					// console.log('구간1');
					// await sleep(10000);
					const radios: any = document.getElementsByName('sfyBulkType');

					for (let i = 0; i < radios.length; i++) {
						if (!radios[i].checked) continue;

						startBulk(radios[i].value);
					}
				});

				sfyCancel.addEventListener('click', () => paper.remove());
			});

			buttonPageConfig.addEventListener(
				'mouseenter',
				() =>
					(buttonPageConfig.innerHTML = `
                    <div style="font-size: 12px;">
                        사용자정의
                        
                        <br/>
                        
                        대량수집
                    </div>
                `),
			);

			buttonPageConfig.addEventListener('mouseleave', () => (buttonPageConfig.innerHTML = buttonPageConfigDefault));

			const buttonPageConfigCol = document.createElement('td');
			const buttonPageConfigRow = document.createElement('tr');

			buttonPageConfigCol.className = 'SELLFORYOU-CELL';
			buttonPageConfigCol.append(buttonPageConfig);
			buttonPageConfigRow.append(buttonPageConfigCol);

			container.append(buttonPageConfigRow);

			let buttonLogo = document.createElement('button');
			let buttonLogoDefault = `
                <div style="font-size: 12px;">
                    상품관리
                </div>
            `;

			buttonLogo.className = 'SELLFORYOU-COLLECT';
			buttonLogo.style.height = '40px';
			buttonLogo.innerHTML = buttonLogoDefault;
			buttonLogo.addEventListener('click', () => window.open(chrome.runtime.getURL('product/collected.html')));

			const logoCol = document.createElement('td');
			const logoRow = document.createElement('tr');

			logoCol.className = 'SELLFORYOU-CELL';
			logoCol.append(buttonLogo);
			logoRow.append(logoCol);

			container.append(logoRow);
		}
		// console.log('구간3');
		// await sleep(10000);
		bulkPage(
			info,
			shop,
			urlUnchangedPage ? { shopId: urlUnchangedPage.shopId, method: urlUnchangedPage.method } : undefined,
		);
	}

	document.documentElement.appendChild(container);

	if (info.isBulk && !bulk) buttonCollect.click();
};

const resultDetails = async (data: any) => {
	let paper: any = document.getElementById('sfyPaper');

	if (!paper) {
		paper = document.createElement('div');
		paper.id = 'sfyPaper';
		paper.className = 'SELLFORYOU-INFORM';
		document.documentElement.appendChild(paper);
	}

	let results = data.results.filter((v: any) => v.status === 'failed');

	if (results.length > 0) {
		let form = `
            <div style="background: white; border: 1px solid black; color: black; font-size: 16px; padding: 10px; width: 1000px; text-align: left;">
                <div style="display: flex; align-items: center; font-size: 20px; margin-bottom: 40px;">
                    <img src=${chrome.runtime.getURL(
											'resources/icon-failed.png',
										)} width="28px" height="28px" style="margin-bottom: 5px;" />
                    
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

		results.map(
			(v: any, index: number) =>
				(form += `
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
            `),
		);

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
                    <img src=${chrome.runtime.getURL(
											'resources/icon-success.png',
										)} width="28px" height="28px" style="margin-bottom: 5px;" />
                    
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

	for (let i = 0; i < checks.length; i++)
		checks[i].addEventListener('change', (e: any) => (results[e.target.id].checked = e.target.checked));

	document.getElementById('sfyResultAll')?.addEventListener('change', (e: any) => {
		results.map((v: any) => (v.checked = e.target.checked));

		for (let i = 0; i < checks.length; i++) checks[i].checked = e.target.checked;
	});

	document.getElementById('sfyPage')?.addEventListener('click', () => (window.location.href = data.sender.tab.url));

	document.getElementById('sfyRetry')?.addEventListener('click', () => {
		const inputs = results.filter((v) => v.checked).map((v) => v.input) as CollectInfo['inputs'];

		if (data.isExcel)
			sendRuntimeMessage({
				action: 'collect-product-excel',
				source: { data: inputs, retry: true },
			});
		else
			sendRuntimeMessage({
				action: 'collect-bulk',
				source: { data: inputs, retry: true },
			});
	});

	document
		.getElementById('sfyConnect')
		?.addEventListener('click', () => window.open(chrome.runtime.getURL('product/collected.html')));

	document.getElementById('sfyCopy')?.addEventListener('click', () => {
		const text = document.getElementById('sfyResultDetail')?.innerText ?? '';

		navigator.clipboard.writeText(text).then(
			() => alert('클립보드에 복사되었습니다.'),

			() => alert('클립보드에 복사할 수 없습니다.'),
		);
	});

	const tabInfo = await sendRuntimeMessage<Sender>({ action: 'tab-info' });

	let collectInfo = (await getLocalStorage<CollectInfo[]>('collectInfo')) ?? [];
	let collect = collectInfo.find((v) => v.sender.tab.id === tabInfo?.tab.id);

	if (!collect) return;

	collect.currentPage = collect.pageEnd + 1;

	await setLocalStorage({ collectInfo });

	return true;
};

const addExcelInfo = async (request) => {
	const tabInfo = (await sendRuntimeMessage<Sender>({ action: 'tab-info' }))!;
	const tabs = await sendRuntimeMessage<chrome.tabs.Tab[]>({ action: 'tab-info-all' });

	let collectInfo = (await getLocalStorage<Partial<CollectInfo>[]>('collectInfo')) ?? [];

	collectInfo = collectInfo.filter((v) => {
		if (v.sender?.tab.id === tabInfo?.tab.id) return false;

		const matched = tabs?.find((w) => w.id === v.sender?.tab.id);

		if (!matched) return false;

		return true;
	});

	collectInfo.push({
		categoryId: '',
		myKeyward: '',
		currentPage: 1,
		inputs: [],
		pageStart: 1,
		pageEnd: request.source.data.length,
		pageList: request.source.data,
		sender: tabInfo,
		type: 'excel-page',
	});

	await setLocalStorage({ collectInfo });

	window.location.href = request.source.data[0].url;

	return true;
};

const initInfo = async (display: boolean) => {
	const user = (await sendRuntimeMessage<User>({ action: 'user' }))!;
	const isBulk = (await sendRuntimeMessage<boolean>({ action: 'is-bulk' }))!;
	const tabInfo = (await sendRuntimeMessage<Sender>({ action: 'tab-info' }))!;

	if (display && isBulk) {
		let paper = document.createElement('div');

		paper.id = 'sfyPaper';
		paper.className = 'SELLFORYOU-INFORM';
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

            <div style="color: #ff4b4b; font-size: 24px; margin-bottom: 40px;">
                현재 탭에서 페이지를 이동할 경우 수집이 중단될 수 있습니다.
            </div>

            <div style="color: black; font-size: 24px;">
                이 페이지에서의 수집을 건너뛰려면 

                <button id="sfySkip" style="font-weight: bolder; padding: 10px;">
                    여기를 클릭
                </button>

                해주세요.
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

		document
			.getElementById('sfySkip')
			?.addEventListener('click', () => sendRuntimeMessage({ action: 'collect-finish' }));
	}

	if (!user) alert('상품을 수집하려면 셀포유에 로그인되어 있어야 합니다.');

	return { user, isBulk, tabInfo };
};

const cardPay = async (info: any) => {
	sessionStorage.removeItem(`sfy-iamport`);

	let script = document.createElement('script');

	script.id = 'sfyIMP';
	script.setAttribute('code', info.code);
	script.setAttribute('data', JSON.stringify(info.data));
	script.src = chrome.runtime.getURL('/resources/iamport.js');

	document.head.appendChild(script);

	while (true) {
		const response = sessionStorage.getItem('sfy-iamport');

		if (!response) {
			await sleep(1000 * 1);
			continue;
		}

		if (response === 'true') return true;
		else return false;
	}
};

const getsetPage = async (body) => {
	const url = 'https://aws-set.playauto.co.kr/shop_group_set_make_amp_api_tab.html';

	const formData = new FormData();
	formData.append('dataMethod', 'post');
	formData.append('dataInfo', JSON.stringify(body));

	try {
		const response = await fetch(url, {
			method: 'POST',
			body: formData,
			mode: 'cors',
		});
	} catch (error) {
		console.error(error);
	}
};

const main = async () => {
	let link = document.createElement('link');

	link.href = chrome.runtime.getURL('ui/css/uicons-regular-straight.css');
	link.type = 'text/css';
	link.rel = 'stylesheet';

	document.documentElement.insertBefore(link, null);

	chrome.runtime.onMessage.addListener((request: RuntimeMessage, _, sendResponse) => {
		switch (request.action) {
			case 'set_info': {
				getsetPage(request.source).then(sendResponse);

				return true;
			}
			case 'pay-card': {
				cardPay(request.source).then(sendResponse);

				return true;
			}

			case 'fetch': {
				const url = request?.form?.url!;
				const requestInit = request.form?.requestInit;

				fetch(url, requestInit)
					.then((res) => res.text())
					.then((data) => sendResponse(data));
				return true;
			}

			//위메프
			case 'upload-B719': {
				let paper = document.createElement('div');

				paper.id = 'sfyPaper';
				paper.className = 'SELLFORYOU-INFORM';
				paper.innerHTML = `
                    <div style="margin-bottom: 40px;">
                        위메프에 업로드가 진행 중입니다.
                    </div>
            
                    <div style="color: #ff4b4b; font-size: 24px; margin-bottom: 10px;">
                        업로드가 진행되는 동안 다른 탭을 이용해주시기 바랍니다.
                    </div>
            
                    <div style="color: #ff4b4b; font-size: 24px;">
                        현재 탭에서 페이지를 이동할 경우 업로드가 중단될 수 있습니다.
                    </div>
                `;

				document.documentElement.appendChild(paper);

				uploadWemakeprice2(request.source).then(sendResponse);

				return true;
			}
			/** 스마트스토어 */
			case 'upload-A077': {
				let paper = document.createElement('div');

				paper.id = 'sfyPaper';
				paper.className = 'SELLFORYOU-INFORM';
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

			case 'upload-A077-products': {
				uploadA077Products(request.source).then(sendResponse);

				return true;
			}
			case 'search-A077-products': {
				searchA077Products(request.source).then(sendResponse);

				return true;
			}

			case 'edited-B719': {
				editWemakeprice(request.source).then(sendResponse);

				return true;
			}

			case 'delete-B719': {
				deleteWemakeprice2(request.source).then(sendResponse);

				return true;
			}

			case 'edited-A077-products': {
				editedA077Products(request.source).then(sendResponse);

				return true;
			}

			case 'delete-A077-products': {
				deleteA077Products(request.source).then(sendResponse);

				return true;
			}

			case 'collect-product-excel': {
				sendRuntimeMessage(request);
				sendResponse(true);

				break;
			}

			case 'collect-page-excel': {
				addExcelInfo(request).then(sendResponse);

				return true;
			}

			case 'collect-finish': {
				resultDetails(request.source).then(sendResponse);

				return true;
			}

			case 'order-taobao': {
				getTaobaoData(request.source).then(sendResponse);

				return true;
			}

			case 'order-taobao-id': {
				sendResponse(getCookie('lgc'));

				break;
			}

			case 'order-tmall': {
				break;
			}

			case 'order-express': {
				break;
			}

			case 'order-alibaba': {
				break;
			}

			case 'order-vvic': {
				break;
			}
			case 'console': {
				console.log(request.source);
			}
		}
	});
	/** 상품수집하는 방법 : 3가지
	 * 1. 리스트 페이지에서 대량수집
	 * 2. 단일 상품에서 단일수집
	 * 3. 판매자 페이지에서 대량수집
	 */
	const currentUrl = window.location.href;
	/** 타오바오 단일상품 페이지 */
	if (/item.taobao.com\/item.htm/.test(currentUrl)) {
		console.log('타오바오 단일상품 페이지 진입');
		const info = await initInfo(true);
		const result = await new taobao().get(info.user);
		floatingButton(info, null, result, false);

		/** 타오바오 리스트 페이지 */
	} else if (/\bs.taobao.com\/search/.test(currentUrl)) {
		console.log('타오바오 리스트 페이지 진입');
		const info = await initInfo(false);
		await new taobao().bulkTypeOne(info.user);
		// document.addEventListener('scroll', handleScroll);
		floatingButton(info, 'taobao1', true, true);

		/**  */
	} else if (/world.taobao.com\/wow/.test(currentUrl)) {
		console.log('월드 타오바오 페이지 진입');
		const info = await initInfo(false);
		await new taobao().bulkTypeThree(info.user);
		floatingButton(info, 'taobao1', true, true);

		/** 타오바오 상점 페이지 */
	} else if (
		/world.taobao.com\/search/.test(currentUrl) ||
		/taobao.com\/search/.test(currentUrl) ||
		/taobao.com\/category/.test(currentUrl)
	) {
		console.log('타오바오 상점 페이지 진입');
		const info = await initInfo(false);
		await new taobao().bulkTypeTwo(info.user);
		floatingButton(info, 'taobao2', true, true);

		/**  */
	} else if (/guang.taobao.com/.test(currentUrl)) {
		skip();

		/** 티몰 상세페이지 */
	} else if (
		/detail.tmall.com/.test(currentUrl) ||
		/chaoshi.detail.tmall.com/.test(currentUrl) ||
		/detail.tmall.hk/.test(currentUrl)
	) {
		console.log('티몰 상세페이지 진입');
		const info = await initInfo(true);
		const result = await new tmall().get(info.user);
		floatingButton(info, null, result, false);

		/** 티몰 리스트페이지 */
	} else if (/tmall.com/.test(currentUrl)) {
		const info = await initInfo(false);
		if (/list.tmall.com/.test(currentUrl)) {
			await new tmall().bulkTypeOne(info.user);
			floatingButton(info, 'tmall1', true, true);
		} else {
			await new tmall().bulkTypeTwo(info.user);
			floatingButton(info, 'tmall2', true, true);
		}

		/** */
	} else if (/aliexpress.com\/item/.test(currentUrl)) {
		const info = await initInfo(true);
		const result = await new express().get(info.user);
		floatingButton(info, 'express', result, false);

		/** 알리 검색 페이지 */
	} else if (
		/aliexpress.com\/af/.test(currentUrl) ||
		/aliexpress.com\/af\/category/.test(currentUrl) ||
		/aliexpress.com\/af\/wholesale/.test(currentUrl) ||
		/aliexpress.com\/w\/wholesale/.test(currentUrl) ||
		/aliexpress.com\/category/.test(currentUrl) ||
		/aliexpress.com\/premium/.test(currentUrl) ||
		/aliexpress.com\/wholesale/.test(currentUrl)
	) {
		console.log('알리 검색 페이지 진입');
		const info = await initInfo(false);
		await new express().bulkTypeOne(info.user);
		await new express().bulkTypeTwo(info.user);
		floatingButton(info, 'express', true, true);

		/** 알리 상점 페이지 */
	} else if (/aliexpress.com\/store/.test(currentUrl)) {
		console.log('알리 상점 페이지 진입');
		const info = await initInfo(false);
		await new express().bulkTypeThree(info.user);
		floatingButton(info, 'express', true, true);

		/** 1688 단일상품 페이지 */
	} else if (/detail.1688.com/.test(currentUrl)) {
		const info = await initInfo(true);
		const result = await new alibaba().get(info.user);
		floatingButton(info, 'alibaba', result, false);

		/** 1688 상점 페이지 and 검색 페이지 */
	} else if (
		/s.1688.com\/selloffer\/offer_search.htm/.test(currentUrl) ||
		/1688.com\/page\/offerlist/.test(currentUrl) ||
		/s.1688.com\/youyuan\/index.htm/.test(currentUrl)
	) {
		console.log(`1688 상점/검색 페이지`);
		const info = await initInfo(false);
		await new alibaba().bulkTypeOne(info.user);
		await new alibaba().bulkTypeTwo(info.user);
		floatingButton(info, 'alibaba', true, true);

		/** 1688 리스트 페이지 */
	} else if (/show.1688.com\/pinlei\/industry\/pllist.html/.test(currentUrl)) {
		console.log('1688 리스트페이지 진입');
		const info = await initInfo(false);
		await new alibaba().bulkTypeOne(info.user);
		floatingButton(info, 'alibaba', true, true);

		/** vvic 단일상품 페이지 */
	} else if (/www.vvic.com\/item/.test(currentUrl)) {
		const info = await initInfo(true);
		const result = await new vvic().get(info.user);
		floatingButton(info, 'vvic', result, false);

		/** vvic 검색 페이지 */
	} else if (/www.vvic.com\/.+\/search/.test(currentUrl) || /www.vvic.com\/.+\/topic/.test(currentUrl)) {
		console.log(`vvic검색페이지진입`);
		const info = await initInfo(false);
		await new vvic().bulkTypeOne(info.user, 2);
		floatingButton(info, 'vvic', true, true);

		/** vvic 상점 페이지 */
	} else if (/www.vvic.com\/shop\/(\d+)/.test(currentUrl)) {
		console.log('vvic shop page entered');
		const info = await initInfo(false);
		await new vvic().bulkTypeOne(info.user, 3);
		const shopId = parseInt(currentUrl.match(/\/shop\/(\d+)/)?.[1] ?? '0');
		floatingButton(info, 'vvic', true, true, { shopId: shopId, method: 'api' });

		/** */
	} else if (/www.vvic.com\/.+\/list/.test(currentUrl)) {
		console.log('vvic list page entered');
		const info = await initInfo(false);
		await new vvic().bulkTypeOne(info.user, 4);
		const shopId = parseInt(currentUrl.match(/\/list\/(\d+)/)?.[1] ?? '0');
		floatingButton(info, 'vvic', true, true, { shopId: shopId, method: 'api' });

		/** */
	} else if (/www.amazon.com\/.+\/dp\//.test(currentUrl) || /www.amazon.com\/dp/.test(currentUrl)) {
		const info = await initInfo(true);
		const result = await new amazon().get(info.user, 'us');
		floatingButton(info, 'amazon', result, false);

		/** */
	} else if (/www.amazon.co.jp\/.+\/dp\//.test(currentUrl) || /www.amazon.co.jp\/dp/.test(currentUrl)) {
		const info = await initInfo(true);
		const result = await new amazon().get(info.user, 'jp');
		floatingButton(info, 'amazon', result, false);

		/** */
	} else if (/www.amazon.de\/.+\/dp\//.test(currentUrl) || /www.amazon.de\/dp/.test(currentUrl)) {
		const info = await initInfo(true);
		const result = await new amazon().get(info.user, 'de');
		floatingButton(info, 'amazon', result, false);

		/** */
	} else if (
		/www.amazon.com\/s\?/.test(currentUrl) ||
		/www.amazon.com\/s\//.test(currentUrl) ||
		/www.amazon.com\/b\//.test(currentUrl)
	) {
		const info = await initInfo(false);
		await new amazon().bulkTypeOne(info.user, 'amazon.com');
		floatingButton(info, 'amazon1', true, true);

		/** */
	} else if (/www.amazon.com\/stores/.test(currentUrl)) {
		const info = await initInfo(false);
		await new amazon().bulkTypeTwo(info.user, 'amazon.com');
		floatingButton(info, 'amazon2', true, true);

		/** */
	} else if (
		/www.amazon.co.jp\/s\?/.test(currentUrl) ||
		/www.amazon.co.jp\/s\//.test(currentUrl) ||
		/www.amazon.co.jp\/b\//.test(currentUrl)
	) {
		const info = await initInfo(false);
		await new amazon().bulkTypeOne(info.user, 'amazon.co.jp');
		floatingButton(info, 'amazon1', true, true);

		/** */
	} else if (/www.amazon.co.jp\/stores/.test(currentUrl)) {
		const info = await initInfo(false);
		await new amazon().bulkTypeTwo(info.user, 'amazon.co.jp');
		floatingButton(info, 'amazon2', true, true);

		/** */
	} else if (
		/www.amazon.de\/s\?/.test(currentUrl) ||
		/www.amazon.de\/s\//.test(currentUrl) ||
		/www.amazon.de\/b\//.test(currentUrl)
	) {
		const info = await initInfo(false);
		await new amazon().bulkTypeOne(info.user, 'amazon.de');
		floatingButton(info, 'amazon1', true, true);

		/** */
	} else if (/www.amazon.de\/stores/.test(currentUrl)) {
		const info = await initInfo(false);
		await new amazon().bulkTypeTwo(info.user, 'amazon.de');
		floatingButton(info, 'amazon2', true, true);

		/** 테무 리스트 페이지 */
	} else if (/.temu.com\/kr-en\/.*opt_level/.test(currentUrl)) {
		// alert('테무 리스트 페이지 진입');
	}
};

main();
