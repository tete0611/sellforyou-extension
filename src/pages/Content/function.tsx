import { bulkCollectUsingApi, pageRefresh, sleep } from '../../../common/function';
import { User } from '../../type/schema';
import { BulkInfo, CollectInfo, Info, Sender, Shop, Source } from '../../type/type';
import { getLocalStorage, sendRuntimeMessage, setLocalStorage } from '../Tools/ChromeAsync';
import { BulkHasFailedForm, BulkSuccessForm, BackGroundPaper, CollectButtonBulk, TestButton } from './components';
import React from 'react';
import { render } from 'react-dom';
import { CollectButton } from './components';
import { CaptchaPaper } from './components/CaptchaPaper';

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

	if (!paper)
		paper = Object.assign(document.createElement('div'), {
			id: 'sfyPaper',
			className: 'SELLFORYOU-INFORM',
		});

	const failedResults = data?.results.filter((v) => v.status === 'failed')!;

	/** 실패상품 포함여부에 따른 결과창 로드 */
	failedResults.length > 0
		? render(
				<BulkHasFailedForm failedResults={failedResults} originalPage={data?.sender.tab.url!} isExcel={data.isExcel} />,
				paper,
		  )
		: render(<BulkSuccessForm data={data} />, paper);

	document.documentElement.appendChild(paper);

	const tabInfo = await sendRuntimeMessage<Sender>({ action: 'tab-info' });
	const collectInfo = (await getLocalStorage<CollectInfo[]>('collectInfo')) ?? [];
	const collect = collectInfo.find((v) => v.sender.tab.id === tabInfo?.tab.id);

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
		const paper = document.createElement('div');
		render(<BackGroundPaper />, paper);
		document.documentElement.appendChild(paper);
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

/** 테스트버튼 띄우는 함수, 클릭 될때 발생할 이벤트는 그때그때 전달 */
export const testButton = ({ onClick }: { onClick: () => void }) => {
	const wrapper = document.createElement('div');
	render(<TestButton onClick={onClick} />, wrapper);
	document.documentElement.appendChild(wrapper);
};

/** 티몰, 타오바오 captcha 감지시 알림 paper */
export const captchaInsert = () => {
	const oldPaper = document.getElementById('sfyPaper');
	if (oldPaper) oldPaper.remove();

	const paper = document.createElement('div');
	render(<CaptchaPaper />, paper);
	document.documentElement.appendChild(paper);
};
