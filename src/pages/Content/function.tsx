import { renderToString } from 'react-dom/server';
import { bulkCollectUsingApi, pageRefresh, sleep } from '../../../common/function';
import { User } from '../../type/schema';
import { BulkInfo, CollectInfo, Info, Sender, Shop, Source } from '../../type/type';
import { createTab, getLocalStorage, sendRuntimeMessage, setLocalStorage } from '../Tools/ChromeAsync';
import {
	BulkHasFailedForm,
	BulkSuccessForm,
	BackGroundPaper,
	BulkSettingPaper,
	ButtonCollect,
	ButtonCollectAll,
} from './components';
import React from 'react';

export const bulkCollect = async (useChecked: boolean, useMedal: boolean) => {
	let inputs: CollectInfo['inputs'] = [];
	let timeout = 0;

	//타임아웃 필요
	while (true) {
		if (timeout === 15) break;

		const list = document.getElementsByClassName('SELLFORYOU-CHECKBOX');

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

export const skip = () => sendRuntimeMessage({ action: 'collect-finish' });

export const bulkPage = async (
	info: Info,
	shop: Shop | null,
	urlUnchangedPage?: { shopId: number; method: 'api' | 'element' },
) => {
	const collectInfo = (await getLocalStorage<CollectInfo[]>('collectInfo')) ?? [];
	const collect = collectInfo.find((v) => v.sender.tab.id === info.tabInfo.tab.id);

	if (!collect) return;
	if (collect.currentPage <= collect.pageEnd) {
		const inputs =
			urlUnchangedPage?.method === 'api'
				? await bulkCollectUsingApi(shop, urlUnchangedPage.shopId, collect.currentPage)
				: await bulkCollect(false, collect.useMedal);

		if (inputs.length === 0) collect.currentPage = collect.pageEnd;

		collect.inputs = collect.inputs.concat(inputs);
		collect.currentPage += 1;

		switch (collect.type) {
			case 'page': {
				if (collect.currentPage > collect.pageEnd) {
					sendRuntimeMessage({
						action: 'collect-bulk',
						source: { data: collect.inputs, retry: false },
					});
				} else {
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

/** 대량 수집 결과창 */
export const resultDetails = async (data: BulkInfo) => {
	let paper = document.getElementById('sfyPaper') as HTMLDivElement | null;

	if (!paper) {
		paper = document.createElement('div');
		paper.id = 'sfyPaper';
		paper.className = 'SELLFORYOU-INFORM';
		document.documentElement.appendChild(paper);
	}

	let failedResults = data?.results.filter((v) => v.status === 'failed')!;

	if (failedResults.length > 0) paper.innerHTML = renderToString(<BulkHasFailedForm results={failedResults} />);
	else paper.innerHTML = renderToString(<BulkSuccessForm data={data} />);

	const checks = document.getElementsByClassName('SFY-RESULT-CHECK') as unknown as HTMLInputElement[];

	for (let i = 0; i < checks.length; i++)
		checks[i].addEventListener('change', (e: any) => (failedResults[e.target.id].checked = e.target.checked));

	document.getElementById('sfyResultAll')?.addEventListener('change', (e: any) => {
		failedResults.map((v) => (v.checked = e.target.checked));

		for (let i = 0; i < checks.length; i++) checks[i].checked = e.target.checked;
	});

	document.getElementById('sfyPage')?.addEventListener('click', () => (window.location.href = data?.sender.tab.url!));

	document.getElementById('sfyRetry')?.addEventListener('click', () => {
		const inputs = failedResults.filter((v) => v.checked).map((v) => v.input) as CollectInfo['inputs'];

		if (data?.isExcel)
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

	document.getElementById('sfyConnect')?.addEventListener('click', async () => {
		const url = new URL(chrome.runtime.getURL('app.html'));
		url.search = 'collected';
		window.open(url);
		// await createTab({ active: true, url: `${chrome.runtime.getURL('app.html')}?collected` });
	});

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

export const addExcelInfo = async (request) => {
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

export const initInfo = async (display: boolean): Promise<Info> => {
	const user = (await sendRuntimeMessage<User>({ action: 'user' }))!;
	const isBulkProcessing = (await sendRuntimeMessage<boolean>({ action: 'is-bulk' }))!;
	const tabInfo = (await sendRuntimeMessage<Sender>({ action: 'tab-info' }))!;

	if (display && isBulkProcessing) {
		let paper = document.createElement('div');
		paper.innerHTML = renderToString(<BackGroundPaper state='onGoing' />);
		document.documentElement.appendChild(paper);

		window.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				paper.innerHTML = renderToString(<BackGroundPaper state='paused' />);

				sendRuntimeMessage({ action: 'collect-stop' });
			}
		});

		document.getElementById('sfyPause')?.addEventListener('click', () => {
			paper.innerHTML = renderToString(<BackGroundPaper state='paused' />);
			sendRuntimeMessage({ action: 'collect-stop' });
		});

		document
			.getElementById('sfySkip')
			?.addEventListener('click', () => sendRuntimeMessage({ action: 'collect-finish' }));
	}

	if (!user) alert('상품을 수집하려면 셀포유에 로그인되어 있어야 합니다.');

	return { user, isBulkProcessing, tabInfo };
};

export const cardPay = async (info: any) => {
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

export const getsetPage = async (body) => {
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

interface FloatingButtonProps {
	info: Info;
	result: Source & { message: string };
}

/** 수집버튼 띄우는 함수 */
export const floatingButton = ({ info, result }: FloatingButtonProps) => {
	if (!result) return;

	let isCollecting = false;
	const wrapper = Object.assign(document.createElement('div'), {
		innerHTML: renderToString(
			<table className='SELLFORYOU-FLOATING'>
				<tr>
					<td className='SELLFORYOU-CELL'>
						<button
							className='SELLFORYOU-COLLECT'
							onClick={async () => {
								console.log(`클릭함`);
								// 수집 끝났을 경우
								if (!info.isBulkProcessing && result.message)
									if (confirm(`${result.message}\n[확인]을 누르시면 수집상품목록으로 이동합니다.`)) {
										const url = new URL(chrome.runtime.getURL('app.html'));
										url.search = 'collected';
										window.open(url);
									}

								if (isCollecting) return;

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
									<img src=${chrome.runtime.getURL('resources/icon-failed.png')} width="20px" height="20px" style="margin-bottom: 5px;" />

									수집실패
							`;

								result.message = response.statusMessage;

								if (info.isBulkProcessing) sendRuntimeMessage({ action: 'collect-finish' });
							}}
						>
							<i className='fi fi-rs-inbox-in' style={{ display: 'flex', alignItems: 'center', fontSize: 32 }}></i>
						</button>
					</td>
				</tr>
			</table>,
		),
	});

	// 컨테이너 생성
	const buttonRoot = Object.assign(document.createElement('table'), {
		className: 'SELLFORYOU-FLOATING',
	});

	const buttonRow = document.createElement('tr');
	const buttonCol = Object.assign(document.createElement('td'), {
		className: 'SELLFORYOU-CELL',
	});
	// 수집버튼 생성
	const buttonCollect = Object.assign(document.createElement('button'), {
		className: 'SELLFORYOU-COLLECT',
		innerHTML: renderToString(<ButtonCollect bulk={false} state='default' />),
	});
	buttonCol.append(buttonCollect);
	buttonRow.append(buttonCol);
	buttonRoot.append(buttonRow);

	buttonCollect.addEventListener('click', async () => {
		// 수집 끝났을 경우
		if (!info.isBulkProcessing && result.message)
			if (confirm(`${result.message}\n[확인]을 누르시면 수집상품목록으로 이동합니다.`)) {
				const url = new URL(chrome.runtime.getURL('app.html'));
				url.search = 'collected';
				window.open(url);
			}

		if (isCollecting) return;

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

		result.message = response.statusMessage;

		if (info.isBulkProcessing) sendRuntimeMessage({ action: 'collect-finish' });
	});
	buttonCollect.addEventListener('mouseenter', () => {
		if (isCollecting) return;

		buttonCollect.innerHTML = renderToString(<ButtonCollect bulk={false} state='enter' />);
	});
	buttonCollect.addEventListener('mouseleave', () => {
		if (isCollecting) return;

		buttonCollect.innerHTML = renderToString(<ButtonCollect bulk={false} state='default' />);
	});

	document.documentElement.appendChild(wrapper);

	if (info.isBulkProcessing) buttonCollect.click();
};

interface FloatingButtonBulkProps {
	info: Info;
	shop: Shop | null;
	urlUnchangedPage?: { shopId: number; method: 'api' | 'element' };
}

/** 대량수집버튼 */
export const floatingButtonBulk = ({ info, shop, urlUnchangedPage }: FloatingButtonBulkProps) => {
	console.log(`대량버튼의 isBulkProcessing : ${info.isBulkProcessing}`);
	let isCollecting = false;
	// 컨테이너 생성
	const buttonRoot = Object.assign(document.createElement('table'), {
		className: 'SELLFORYOU-FLOATING',
	});
	const buttonRow = document.createElement('tr');
	const buttonCol = Object.assign(document.createElement('td'), {
		className: 'SELLFORYOU-CELL',
	});
	// 수집버튼 생성
	const buttonCollect = Object.assign(document.createElement('button'), {
		className: 'SELLFORYOU-COLLECT',
		innerHTML: renderToString(<ButtonCollect bulk={true} state='default' />),
	});
	buttonCol.append(buttonCollect);
	buttonRow.append(buttonCol);
	buttonRoot.append(buttonRow);

	buttonCollect.addEventListener('click', async () => {
		if (isCollecting) return;

		const categoryResp = await fetch(chrome.runtime.getURL('resources/category.json'));
		const categoryJson = await categoryResp.json();
		/** 현재페이지 대량수집 설정창 */
		const paper = Object.assign(document.createElement('div'), {
			id: 'sfyPaper',
			className: 'SELLFORYOU-INFORM',
			innerHTML: renderToString(<BulkSettingPaper state='currentPage' />),
		});

		document.documentElement.appendChild(paper);

		const sfyGoldMedalEnabled = document.getElementById('sfyGoldMedalEnabled') as HTMLInputElement;
		const sfyStandardShippingEnabled = document.getElementById('sfyStandardShippingEnabled') as HTMLInputElement;
		const sfyCategoryEnabled = document.getElementById('sfyCategoryEnabled') as HTMLInputElement;
		const sfyMyKeywardEnabled = document.getElementById('sfyMyKeywardEnabled') as HTMLInputElement;
		const sfyCategoryInput = document.getElementById('sfyCategoryInput') as HTMLInputElement;
		const sfyMyKeywardInput = document.getElementById('sfyMyKeywardInput') as HTMLInputElement;
		const sfyCategoryList = document.getElementById('sfyCategoryList') as HTMLDivElement;
		const sfyStart = document.getElementById('sfyStart') as HTMLButtonElement;
		const sfyCancel = document.getElementById('sfyCancel') as HTMLButtonElement;

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
				(v) =>
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
				categoryId: sfyCategoryInput.getAttribute('data-category-id')!,
				myKeyward: sfyMyKeywardInput.getAttribute('data-myKeyward-id') ?? undefined,
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
	});
	buttonCollect.addEventListener('mouseenter', () => {
		if (isCollecting) return;

		buttonCollect.innerHTML = renderToString(<ButtonCollect bulk={true} state='enter' />);
	});
	buttonCollect.addEventListener('mouseleave', () => {
		if (isCollecting) return;

		buttonCollect.innerHTML = renderToString(<ButtonCollect bulk={true} state='default' />);
	});

	const buttonCheckAll = Object.assign(document.createElement('button'), {
		id: 'sfyPicker',
		value: 'true',
		className: 'SELLFORYOU-COLLECT',
		innerHTML: renderToString(<ButtonCollectAll state='default' />),
	});
	const buttonCheckAllCol = Object.assign(document.createElement('td'), {
		className: 'SELLFORYOU-CELL',
	});
	const buttonCheckAllRow = document.createElement('tr');

	buttonCheckAllCol.append(buttonCheckAll);
	buttonCheckAllRow.append(buttonCheckAllCol);
	buttonRoot.append(buttonCheckAllRow);

	buttonCheckAll.addEventListener('click', () => {
		const checkBoxes = document.getElementsByClassName('SELLFORYOU-CHECKBOX') as HTMLCollectionOf<HTMLInputElement>;

		if (buttonCheckAll.value === 'true') {
			for (let checkBox of checkBoxes) checkBox.checked = false;
			buttonCheckAll.innerHTML = renderToString(<ButtonCollectAll state='dot' />);
			buttonCheckAll.value = 'false';
		} else {
			for (let checkBox of checkBoxes) checkBox.checked = true;
			buttonCheckAll.innerHTML = renderToString(<ButtonCollectAll state='default' />);
			buttonCheckAll.value = 'true';
		}
	});
	buttonCheckAll.addEventListener(
		'mouseenter',
		() => (buttonCheckAll.innerHTML = renderToString(<ButtonCollectAll state='enter' />)),
	);
	buttonCheckAll.addEventListener('mouseleave', () => {
		if (buttonCheckAll.value === 'true')
			buttonCheckAll.innerHTML = renderToString(<ButtonCollectAll state='default' />);
		else buttonCheckAll.innerHTML = renderToString(<ButtonCollectAll state='dot' />);
	});

	if (shop !== 'amazon2') {
		const buttonPageConfigDefault = `<i class="fi fi-rs-settings" style="display: flex; align-items: center; font-size: 32px;"></i>`;
		const buttonPageConfig = Object.assign(document.createElement('button'), {
			id: 'sfyPageConfig',
			value: 'true',
			className: 'SELLFORYOU-COLLECT',
			innerHTML: buttonPageConfigDefault,
		});
		buttonPageConfig.addEventListener('click', async () => {
			const categoryResp = await fetch(chrome.runtime.getURL('resources/category.json'));
			const categoryJson = await categoryResp.json();
			const paper = Object.assign(document.createElement('div'), {
				id: 'sfyPaper',
				className: 'SELLFORYOU-INFORM',
				innerHTML: renderToString(<BulkSettingPaper state='customization' />),
			});

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

			/** 대량수집 시작하기 클릭시 */
			sfyStart.addEventListener('click', async () => {
				const radios = document.getElementsByName('sfyBulkType') as NodeListOf<HTMLInputElement>;
				radios.forEach((v) => {
					if (v.checked) startBulk(v.value as 'page' | 'amount');
				});
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

		buttonRoot.append(buttonPageConfigRow);

		let buttonLogo = document.createElement('button');
		let buttonLogoDefault = `
                <div style="font-size: 12px;">
                    상품관리
                </div>
            `;

		buttonLogo.className = 'SELLFORYOU-COLLECT';
		buttonLogo.style.height = '40px';
		buttonLogo.innerHTML = buttonLogoDefault;
		buttonLogo.addEventListener('click', async () => {
			const url = new URL(chrome.runtime.getURL('app.html'));
			url.search = 'collected';
			window.open(url);
			// await createTab({ active: true, url: `${chrome.runtime.getURL('app.html')}?collected` });
		});

		const logoCol = document.createElement('td');
		const logoRow = document.createElement('tr');

		logoCol.className = 'SELLFORYOU-CELL';
		logoCol.append(buttonLogo);
		logoRow.append(logoCol);

		buttonRoot.append(logoRow);
	}

	bulkPage(
		info,
		shop,
		urlUnchangedPage ? { shopId: urlUnchangedPage.shopId, method: urlUnchangedPage.method } : undefined,
	);

	document.documentElement.appendChild(buttonRoot);
};
