import { renderToString } from 'react-dom/server';
import { bulkCollectUsingApi, pageRefresh, sleep } from '../../../common/function';
import { User } from '../../type/schema';
import { BulkInfo, CollectInfo, Info, Sender, Shop, Source } from '../../type/type';
import { getLocalStorage, sendRuntimeMessage, setLocalStorage } from '../Tools/ChromeAsync';
import { BulkHasFailedForm, BulkSuccessForm, BackGroundPaper, CollectButtonBulk } from './components';
import React from 'react';
import { render } from 'react-dom';
import { CollectButton } from './components';

export interface FloatingButtonProps {
	info: Info;
	result: Source & { message: string };
}
export interface FloatingButtonBulkProps {
	info: Info;
	shop: Shop | null;
	urlUnchangedPage?: { shopId: number; method: 'api' | 'element' };
}

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

/** 수집버튼 띄우는 함수 */
export const floatingButton = ({ info, result }: FloatingButtonProps) => {
	if (!result) return;

	/** 단일수집버튼 컴포넌트 */
	const wrapper = document.createElement('div');
	render(<CollectButton info={info} result={result} />, wrapper);
	document.documentElement.appendChild(wrapper);

	const buttonCollect = document.getElementsByClassName('SELLFORYOU-COLLECT').item(0) as HTMLButtonElement; // 자동으로 클릭시키기 위해 돔을 찾아옴
	if (info.isBulkProcessing) buttonCollect.click(); // 대량수집 진행중일시
};

/** 대량수집버튼 띄우는 함수 */
export const floatingButtonBulk = (props: FloatingButtonBulkProps) => {
	const { info, shop, urlUnchangedPage } = props;

	/** 대량수집버튼 컴포넌트 */
	const wrapper = document.createElement('div');
	render(<CollectButtonBulk {...props} />, wrapper);
	document.documentElement.appendChild(wrapper);

	bulkPage(
		info,
		shop,
		urlUnchangedPage ? { shopId: urlUnchangedPage.shopId, method: urlUnchangedPage.method } : undefined,
	);
};
