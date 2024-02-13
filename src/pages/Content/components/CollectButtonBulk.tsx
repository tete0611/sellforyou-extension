import React from 'react';
import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { BulkSettingPaper } from './BulkSettingPaper';
import { getLocalStorage, sendRuntimeMessage, setLocalStorage } from '../../Tools/ChromeAsync';
import { CollectInfo } from '../../../type/type';
import { FloatingButtonBulkProps, bulkCollect } from '../function';
import { pageRefresh } from '../../../../common/function';

export const CollectButtonBulk = ({ info, shop, urlUnchangedPage }: FloatingButtonBulkProps) => {
	const [collectMouseEnter, setCollectMouseEnter] = useState(false);
	const [checkMouseEnter, setCheckMouseEnter] = useState(false);
	const [configMouseEnter, setConfigMouseEnter] = useState(false);

	const [checkAll, setCheckAll] = useState<'true' | 'false'>('true');

	const onCollectClick = async ({ info }: Pick<FloatingButtonBulkProps, 'info'>) => {
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
	};

	const onCheckClick = () => {
		const checkBoxes = document.getElementsByClassName('SELLFORYOU-CHECKBOX') as HTMLCollectionOf<HTMLInputElement>;

		if (checkAll === 'true') {
			for (let checkBox of checkBoxes) checkBox.checked = false;
			setCheckAll('false');
		} else {
			for (let checkBox of checkBoxes) checkBox.checked = true;
			setCheckAll('true');
		}
	};

	const onConfigClick = async () => {
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
	};
	return (
		<table className='SELLFORYOU-FLOATING'>
			<tr>
				<td className='SELLFORYOU-CELL'>
					<button
						className='SELLFORYOU-COLLECT'
						onMouseEnter={() => setCollectMouseEnter(true)}
						onMouseLeave={() => setCollectMouseEnter(false)}
						onClick={() => onCollectClick({ info: info })}
					>
						{collectMouseEnter ? (
							<div style={{ fontSize: 12, whiteSpace: 'pre-wrap' }}>
								현재페이지
								<br />
								수집하기
							</div>
						) : (
							<i className='fi fi-rs-inbox-in' style={{ display: 'flex', alignItems: 'center', fontSize: 32 }}></i>
						)}
					</button>
				</td>
			</tr>
			<tr>
				<td className='SELLFORYOU-CELL'>
					<button
						className='SELLFORYOU-COLLECT'
						id='sfyPicker'
						value={checkAll}
						onMouseEnter={() => setCheckMouseEnter(true)}
						onMouseLeave={() => setCheckMouseEnter(false)}
						onClick={onCheckClick}
					>
						{checkMouseEnter && (
							<div style={{ fontSize: 12 }}>
								상품일괄
								<br />
								선택/해제
							</div>
						)}
						{!checkMouseEnter && (
							<i className='fi fi-rs-list-check' style={{ display: 'flex', alignItems: 'center', fontSize: 32 }}></i>
						)}
					</button>
				</td>
			</tr>
			{shop !== 'amazon2' && (
				<tr>
					<td className='SELLFORYOU-CELL'>
						<button
							id='sfyPageConfig'
							value={'true'}
							className='SELLFORYOU-COLLECT'
							onMouseEnter={() => setConfigMouseEnter(true)}
							onMouseLeave={() => setConfigMouseEnter(false)}
							onClick={onConfigClick}
						>
							{!configMouseEnter ? (
								<i className='fi fi-rs-settings' style={{ display: 'flex', alignItems: 'center', fontSize: 32 }}></i>
							) : (
								<div style={{ fontSize: 12 }}>
									사용자정의
									<br />
									대량수집
								</div>
							)}
						</button>
					</td>
				</tr>
			)}
			<tr>
				<td className='SELLFORYOU-CELL'>
					<button
						className='SELLFORYOU-COLLECT'
						style={{ height: 40 }}
						onClick={() => {
							const url = new URL(chrome.runtime.getURL('app.html'));
							url.search = 'collected';
							window.open(url);
						}}
					>
						<div style={{ fontSize: 12 }}>상품관리</div>
					</button>
				</td>
			</tr>
		</table>
	);
};
