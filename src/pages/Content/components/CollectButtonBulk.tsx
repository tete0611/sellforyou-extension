// import React, { useState } from 'react';
// import { getLocalStorage, sendRuntimeMessage, setLocalStorage } from '../../Tools/ChromeAsync';
// import { CollectInfo, Sender, Source } from '../../../type/type';
// import { User } from '../../../type/schema';
// import { bulkCollect } from '../function';

// interface Props {
// 	type?: string;
// 	info: {
// 		user: User;
// 		isBulk: boolean;
// 		tabInfo: Sender;
// 	};
// 	result: Source & { error: string };
// 	isCollecting?: boolean;
// }

// export const CollectButtonBulk = ({ isCollecting, result, info, type = 'default' }: Props) => {
// 	const [typeState, setTypeState] = useState(type);
// 	const [finish, setFinish] = useState(false); // 수집 끝났는지 여부

// 	return (
// 		<button
// 			className='SELLFORYOU-COLLECT'
// 			onClick={async () => {
// 				if (!info.isBulk && result.error) {
// 					if (confirm(`${result.error}\n[확인]을 누르시면 수집상품목록으로 이동합니다.`)) {
// 						const newWindow = window.open(chrome.runtime.getURL('app.html'))!;
// 						console.log({ newWindow });
// 						newWindow.addEventListener('load', () => {
// 							console.log(`로드발동함`);
// 							newWindow.postMessage({ page: 'collected' }, '*');
// 						});
// 					}

// 					return;
// 				}

// 				if (isCollecting) return;

// 				let categoryResp = await fetch(chrome.runtime.getURL('resources/category.json'));
// 				let categoryJson = await categoryResp.json();
// 				let paper = document.createElement('div');

// 				paper.id = 'sfyPaper';
// 				paper.className = 'SELLFORYOU-INFORM';
// 				paper.innerHTML = `
// 										<div style="background: white; border: 1px solid black; color: black; font-size: 16px; padding: 10px; text-align: left; width: 700px;">
// 												<div style="display: flex; align-items: center; justify-content: space-between; font-size: 20px; margin-bottom: 20px;">
// 														현재페이지 대량수집

// 														<button id="sfyCancel" style="padding: 10px;">
// 																<i class="fi fi-rs-cross" style="display: flex; align-items: center; font-size: 12px;"></i>
// 														</button>
// 												</div>

// 												<table style="width: 100%;">
// 														<tr>
// 																<td colspan="3" style="border: 1px solid black; width: 50%; padding: 10px;">
// 																		<label style="cursor: pointer; display: flex; align-items: center; font-size: 18px; margin-bottom: 20px;">
// 																				<input id="sfyCategoryEnabled" type="checkbox" style="cursor: pointer; width: 20px; height: 20px;" />

// 																				&nbsp;

// 																				카테고리 수동설정
// 																		</label>

// 																		<table style="width: 100%;">
// 																				<tr>
// 																						<td style="padding: 5px; width: 25%;">
// 																								카테고리 검색
// 																						</td>

// 																						<td style="padding: 5px; width: 75%;">
// 																								<div style="position: relative;">
// 																										<input id="sfyCategoryInput" disabled data-category-id="" style="border: 1px solid black; width: 100%;" />

// 																										<div id="sfyCategoryList" style="background: white; border: 1px solid black; display: none; font-size: 13px; position: absolute; width: 100%; height: 100px; overflow-y: scroll;">
// 																										</div>
// 																								</div>
// 																						</td>
// 																				</tr>
// 																		</table>
// 																</td>
// 														</tr>

// 														<tr>
// 																<td colspan="3" style="color: red; padding: 10px 0px;">
// 																		카테고리를 수동으로 설정하시려면 카테고리 수동설정란을 체크해주세요.
// 																</td>
// 														</tr>

// 														<tr>
// 																<td colspan="3" style="border: 1px solid black; width: 50%; padding: 10px;">
// 																		<label style="cursor: pointer; display: flex; align-items: center; font-size: 18px; margin-bottom: 20px;">
// 																				<input id="sfyMyKeywardEnabled" type="checkbox" style="cursor: pointer; width: 20px; height: 20px;" />

// 																				&nbsp;

// 																				개인분류 설정
// 																		</label>

// 																		<table style="width: 100%;">
// 																				<tr>
// 																						<td style="padding: 5px; width: 25%;">
// 																								개인분류 입력
// 																						</td>

// 																						<td style="padding: 5px; width: 75%;">
// 																								<div style="position: relative;">
// 																										<input id="sfyMyKeywardInput" disabled data-myKeyward-id="" style="border: 1px solid black; width: 100%;" />
// 																								</div>
// 																						</td>
// 																				</tr>
// 																		</table>
// 																</td>
// 														</tr>

// 														<tr>
// 																<td colspan="3" style="color: red; padding: 10px 0px;">
// 																		개인분류를 설정하시려면 개인분류 설정란을 체크해주세요.(공백은 제거됩니다.)
// 																</td>
// 														</tr>

// 														<tr>
// 																<td colspan="3" style="border: 1px solid black; width: 50%; padding: 10px;">
// 																		<label style="cursor: pointer; display: flex; align-items: center; font-size: 18px;">
// 																				<input id="sfyGoldMedalEnabled" type="checkbox" style="cursor: pointer; width: 20px; height: 20px;" />

// 																				&nbsp;

// 																				금메달 상품만 수집하기 (타오바오)
// 																		</label>
// 																</td>
// 														</tr>

// 														<tr>
// 																<td colspan="3" style="border: 1px solid black; width: 50%; padding: 10px;">
// 																		<label style="cursor: pointer; display: flex; align-items: center; font-size: 18px;">
// 																				<input id="sfyStandardShippingEnabled" type="checkbox" style="cursor: pointer; width: 20px; height: 20px;" />

// 																				&nbsp;

// 																				스탠다드 쉬핑 상품만 수집하기 (알리익스프레스)
// 																		</label>
// 																</td>
// 														</tr>

// 														<tr>
// 																<td colspan="3" style="color: red; padding: 5px 0px;">
// 																</td>
// 														</tr>

// 														<tr>
// 																<td colspan="3" style="padding: 10px 0px;">
// 																		<button id="sfyStart" style="width: 100%; height: 40px;">
// 																				대량수집 시작하기
// 																		</button>
// 																</td>
// 														</tr>
// 												</table>
// 										</div>
// 								`;

// 				document.documentElement.appendChild(paper);

// 				const sfyGoldMedalEnabled: any = document.getElementById('sfyGoldMedalEnabled');
// 				const sfyStandardShippingEnabled: any = document.getElementById('sfyStandardShippingEnabled');
// 				const sfyCategoryEnabled: any = document.getElementById('sfyCategoryEnabled');
// 				const sfyMyKeywardEnabled: any = document.getElementById('sfyMyKeywardEnabled');
// 				const sfyCategoryInput = document.getElementById('sfyCategoryInput') as HTMLInputElement;
// 				const sfyMyKeywardInput: any = document.getElementById('sfyMyKeywardInput');
// 				const sfyCategoryList = document.getElementById('sfyCategoryList');
// 				const sfyStart = document.getElementById('sfyStart');
// 				const sfyCancel = document.getElementById('sfyCancel');

// 				if (
// 					!sfyGoldMedalEnabled ||
// 					!sfyStandardShippingEnabled ||
// 					!sfyCategoryEnabled ||
// 					!sfyCategoryInput ||
// 					!sfyCategoryList ||
// 					!sfyStart ||
// 					!sfyCancel ||
// 					!sfyMyKeywardEnabled
// 				)
// 					return;

// 				sfyCategoryEnabled.addEventListener('change', (e: any) => {
// 					sfyCategoryInput.disabled = !e.target.checked;
// 					sfyCategoryList.style.display = 'none';
// 				});
// 				sfyMyKeywardEnabled.addEventListener('change', (e: any) => (sfyMyKeywardInput.disabled = !e.target.checked));
// 				sfyCategoryInput.addEventListener('focus', (e: any) => (sfyCategoryList.style.display = ''));
// 				sfyMyKeywardInput.addEventListener('change', (e: any) => {
// 					sfyMyKeywardInput.value = e.target.value.trim();
// 					sfyMyKeywardInput.setAttribute('data-myKeyward-id', e.target.value.trim());
// 				});
// 				sfyCategoryInput.addEventListener('change', (e: any) => {
// 					const input = e.target.value;
// 					const filtered = categoryJson.filter(
// 						(v: any) =>
// 							v['대분류'].includes(input) ||
// 							v['중분류'].includes(input) ||
// 							v['소분류'].includes(input) ||
// 							v['세분류'].includes(input),
// 					);

// 					if (!filtered) return;

// 					sfyCategoryList.innerHTML = ``;

// 					filtered.map((v: any) => {
// 						let categoryName = ``;

// 						if (v['대분류']) categoryName += v['대분류'];
// 						if (v['중분류']) {
// 							categoryName += ' > ';
// 							categoryName += v['중분류'];
// 						}
// 						if (v['소분류']) {
// 							categoryName += ' > ';
// 							categoryName += v['소분류'];
// 						}
// 						if (v['세분류']) {
// 							categoryName += ' > ';
// 							categoryName += v['세분류'];
// 						}

// 						sfyCategoryList.innerHTML += `
// 																<div class="sfyCategory" data-category-id="${v['카테고리번호']}" style="cursor: pointer; padding: 5px; 0px;">
// 																		${categoryName}
// 																</div>
// 														`;
// 					});

// 					const categories = document.getElementsByClassName('sfyCategory');

// 					for (let i = 0; i < categories.length; i++) {
// 						categories[i].addEventListener('click', (e: any) => {
// 							sfyCategoryInput.value = e.target.textContent.trim();
// 							sfyCategoryInput.setAttribute('data-category-id', e.target.getAttribute('data-category-id'));
// 							sfyCategoryList.style.display = 'none';
// 						});
// 					}
// 				});

// 				const startBulk = async () => {
// 					const tabs = await sendRuntimeMessage<chrome.tabs.Tab[]>({ action: 'tab-info-all' });

// 					let collectInfo = (await getLocalStorage<Partial<CollectInfo>[]>('collectInfo')) ?? [];

// 					collectInfo = collectInfo.filter((v) => {
// 						if (v.sender?.tab.id === info.tabInfo.tab.id) return false;

// 						const matched = tabs?.find((w) => w.id === v.sender?.tab.id);

// 						if (!matched) return false;

// 						return true;
// 					});

// 					if (!sfyCategoryEnabled.checked) sfyCategoryInput.setAttribute('data-category-id', '');
// 					if (!sfyMyKeywardEnabled.checked) sfyMyKeywardInput.setAttribute('data-myKeyward-id', '');

// 					collectInfo.push({
// 						categoryId: sfyCategoryInput.getAttribute('data-category-id')!,
// 						myKeyward: sfyMyKeywardInput.getAttribute('data-myKeyward-id'),
// 						sender: info.tabInfo,
// 						useMedal: sfyGoldMedalEnabled.checked,
// 						useStandardShipping: sfyStandardShippingEnabled.checked,
// 					});

// 					await setLocalStorage({ collectInfo });

// 					const inputs = await bulkCollect(true, sfyGoldMedalEnabled.checked);

// 					sendRuntimeMessage({
// 						action: 'collect-bulk',
// 						source: { data: inputs, retry: false },
// 					});
// 				};

// 				sfyStart.addEventListener('click', () => startBulk());
// 				sfyCancel.addEventListener('click', () => paper.remove());
// 				//  {
// 				// 	isCollecting = true;

// 				// 	setTypeState('loading');

// 				// 	// buttonCollect.innerHTML = `<div class="SELLFORYOU-LOADING" />`;

// 				// 	const response = await sendRuntimeMessage<{ status: string; statusMessage: string }>({
// 				// 		action: 'collect',
// 				// 		source: result,
// 				// 	});

// 				// 	if (!response) return;
// 				// 	if (response.status === 'success') {
// 				// 		setTypeState('success');
// 				// 		setFinish(true);
// 				// 	} else {
// 				// 		setTypeState('failed');
// 				// 		setFinish(true);
// 				// 	}

// 				// 	result.error = response.statusMessage;

// 				// 	if (info.isBulk) sendRuntimeMessage({ action: 'collect-finish' });
// 				// }
// 			}}
// 			onMouseLeave={() => {
// 				if (isCollecting || finish) return;
// 				setTypeState('default');
// 			}}
// 			onMouseEnter={() => {
// 				if (isCollecting || finish) return;
// 				setTypeState('entered');
// 			}}
// 		>
// 			{typeState === 'default' && (
// 				<i className='fi fi-rs-inbox-in' style={{ display: 'flex', alignItems: 'center', fontSize: 32 }}></i>
// 			)}
// 			{typeState === 'entered' && <div style={{ fontSize: 12, whiteSpace: 'pre-wrap' }}>{`현재페이지\n수집하기`}</div>}
// 			{typeState === 'loading' && <div className='SELLFORYOU-LOADING' />}
// 			{typeState === 'success' && (
// 				<>
// 					<img
// 						src={chrome.runtime.getURL('resources/icon-success.png')}
// 						width={20}
// 						height={20}
// 						style={{ marginBottom: 5 }}
// 					/>
// 					수집완료
// 				</>
// 			)}
// 			{typeState === 'failed' && (
// 				<>
// 					<img
// 						src={chrome.runtime.getURL('resources/icon-failed.png')}
// 						width={20}
// 						height={20}
// 						style={{ marginBottom: 5 }}
// 					/>
// 					수집실패
// 				</>
// 			)}
// 		</button>
// 	);
// };
