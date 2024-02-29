import React, { useEffect, useState } from 'react';
import { getLocalStorage, sendRuntimeMessage, setLocalStorage } from '../../Tools/ChromeAsync';
import { CollectInfo } from '../../../type/type';
import { FloatingButtonBulkProps, bulkCollect } from '../function';
import { pageRefresh } from '../../../../common/function';

type CategoryList = {
	대분류: string;
	세분류: string;
	소분류: string;
	중분류: string;
	카테고리번호: string;
}[];

type CategorySelect = {
	name: string;
	id: string;
};
interface Props extends FloatingButtonBulkProps {
	state: 'currentPage' | 'customization';
}

/** 현재페이지/사용자정의 대량수집 페이퍼  */
export const BulkSettingPaper = ({ state, info, shop }: Props) => {
	const [categoryJson, setCategoryJson] = useState<CategoryList>([]);
	const [sfyCategoryEnabled, setSfyCategoryEnabled] = useState(false); // 카테고리 수동설정 사용여부
	const [sfyCategoryInput, setSfyCategoryInput] = useState<CategorySelect>({ id: '', name: '' }); // 카테고리 검색 인풋
	const [sfyCategoryList, setSfyCategoryList] = useState<CategorySelect[]>([]); // 카테고리 셀렉트 목록
	const [sfyMyKeywardEnabled, setSfyMyKeywardEnabled] = useState(false); // 개인분류 사용여부
	const [sfyMyKeywardInput, setSfyMyKeywardInput] = useState(''); // 개인분류 입력 인풋
	const [sfyGoldMedalEnabled, setSfyGoldMedalEnabled] = useState(false); // 금메달 상품만 수집하기
	const [sfyStandardShippingEnabled, setSfyStandardShippingEnabled] = useState(false); // 스탠다드 쉬핑 상품만 수집하기
	const [categoryFocus, setCategoryFocus] = useState(false);
	const [bulkType, setBulkType] = useState<'page' | 'amount'>('page'); // 사용자정의 대량수집 타입
	const [pages, setPages] = useState({ start: '1', end: '1' });
	const [amount, setAmount] = useState('100');

	useEffect(() => {
		fetch(chrome.runtime.getURL('resources/category.json'))
			.then(async (v) => {
				setCategoryJson(await v.json());
			})
			.catch(() => alert('카테고리 목록 로드실패\n채널톡으로 문의요망.'));
	}, []);

	/** 현재페이지 대량수집 시작하기 클릭 */
	const onStartBulk = async () => {
		const tabs = await sendRuntimeMessage<chrome.tabs.Tab[]>({ action: 'tab-info-all' });

		let collectInfo = (await getLocalStorage<Partial<CollectInfo>[]>('collectInfo')) ?? [];

		collectInfo = collectInfo.filter((v) => {
			if (v.sender?.tab.id === info.tabInfo.tab.id) return false;

			const matched = tabs?.find((w) => w.id === v.sender?.tab.id);

			if (!matched) return false;

			return true;
		});

		collectInfo.push({
			categoryId: sfyCategoryEnabled ? sfyCategoryInput.id : '',
			myKeyward: sfyMyKeywardEnabled ? sfyMyKeywardInput : undefined,
			sender: info.tabInfo,
			useMedal: sfyGoldMedalEnabled,
			useStandardShipping: sfyStandardShippingEnabled,
		});

		await setLocalStorage({ collectInfo });

		const inputs = await bulkCollect(true, sfyGoldMedalEnabled);

		sendRuntimeMessage({
			action: 'collect-bulk',
			source: { data: inputs, retry: false },
		});
	};

	/** 사용자정의 대량수집 시작하기 클릭 */
	const onConfigBulkStart = async () => {
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

		switch (bulkType) {
			case 'page': {
				collectInfo.push({
					categoryId: sfyCategoryEnabled ? sfyCategoryInput.id : '',
					myKeyward: sfyMyKeywardEnabled ? sfyMyKeywardInput : undefined,
					currentPage: parseInt(pages.start),
					inputs: [],
					maxLimits: 0,
					pageStart: parseInt(pages.start),
					pageEnd: parseInt(pages.end),
					sender: info.tabInfo,
					type: 'page',
					useMedal: sfyGoldMedalEnabled,
					useStandardShipping: sfyStandardShippingEnabled,
				});

				break;
			}

			case 'amount': {
				collectInfo.push({
					categoryId: sfyCategoryEnabled ? sfyCategoryInput.id : '',
					myKeyward: sfyMyKeywardEnabled ? sfyMyKeywardInput : undefined,
					currentPage: 1,
					inputs: [],
					maxLimits: parseInt(amount),
					pageStart: 1,
					pageEnd: 100,
					sender: info.tabInfo,
					type: 'amount',
					useMedal: sfyGoldMedalEnabled,
					useStandardShipping: sfyStandardShippingEnabled,
				});

				break;
			}
		}
		await setLocalStorage({ collectInfo });

		pageRefresh(shop, parseInt(pages.start));
	};

	return (
		<div
			style={{
				background: 'white',
				border: '1px solid black',
				color: 'black',
				fontSize: 16,
				padding: 10,
				textAlign: 'left',
				width: 700,
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					fontSize: 20,
					marginBottom: 20,
				}}
			>
				{state === 'currentPage' ? `현재페이지 대량수집` : `사용자정의 대량수집`}
				<button
					id='sfyCancel'
					style={{ padding: 10 }}
					onClick={() => {
						const paper = document.getElementById('sfyPaper');
						paper?.remove();
					}}
				>
					<i className='fi fi-rs-cross' style={{ display: 'flex', alignItems: 'center', fontSize: 12 }}></i>
				</button>
			</div>
			<table style={{ width: '100%' }}>
				<tr>
					<td colSpan={3} style={{ border: '1px solid black', width: '50%', padding: 10 }}>
						<label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 18, marginBottom: 20 }}>
							<input
								onChange={(e) => {
									if (e.target.checked === false) setCategoryFocus(false);
									setSfyCategoryEnabled((p) => !p);
								}}
								checked={sfyCategoryEnabled}
								id='sfyCategoryEnabled'
								type='checkbox'
								style={{ cursor: 'pointer', width: 20, height: 20, marginRight: 8 }}
							/>
							카테고리 수동설정
						</label>
						<table style={{ width: '100%' }}>
							<tr>
								<td style={{ padding: 5, width: '25%' }}>카테고리 검색</td>
								<td style={{ padding: 5, width: '75%' }}>
									<div style={{ position: 'relative' }}>
										<input
											onFocus={() => setCategoryFocus(true)}
											id='sfyCategoryInput'
											disabled={!sfyCategoryEnabled}
											data-category-id=''
											value={sfyCategoryInput.name}
											style={{ border: '1px solid black', width: '100%' }}
											onChange={(e) => {
												if (e.currentTarget.value === '') {
													setSfyCategoryInput({ name: '', id: '' });
													setCategoryFocus(false);

													return;
												} else if (!categoryFocus) setCategoryFocus(true);
												setSfyCategoryInput({ name: e.target.value, id: '' });
												const input = e.target.value;
												const filtered = categoryJson.filter(
													(v) =>
														v['대분류'].includes(input) ||
														v['중분류'].includes(input) ||
														v['소분류'].includes(input) ||
														v['세분류'].includes(input),
												);
												console.log({ filtered });
												if (!filtered) return;
												setSfyCategoryList(
													filtered.map((v) => {
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

														return { name: categoryName, id: v['카테고리번호'] };
													}),
												);
											}}
										/>
										<div
											id='sfyCategoryList'
											style={{
												background: 'white',
												border: '1px solid black',
												display: categoryFocus ? '' : 'none',
												fontSize: 13,
												position: 'absolute',
												width: '100%',
												height: 100,
												overflowY: 'scroll',
											}}
										>
											{sfyCategoryList.map((v) => {
												return (
													<div
														key={v.id}
														className='sfyCategory'
														style={{ cursor: 'pointer', padding: 5 }}
														onClick={() => {
															setSfyCategoryInput(v);
															setCategoryFocus(false);
														}}
													>
														{v.name}
													</div>
												);
											})}
										</div>
									</div>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td colSpan={3} style={{ color: 'red', paddingTop: 10, paddingBottom: 10 }}>
						카테고리를 수동으로 설정하시려면 카테고리 수동설정란을 체크해주세요.
					</td>
				</tr>
				<tr>
					<td colSpan={3} style={{ border: '1px solid black', width: '50%', padding: 10 }}>
						<label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 18, marginBottom: 20 }}>
							<input
								onChange={() => setSfyMyKeywardEnabled((p) => !p)}
								checked={sfyMyKeywardEnabled}
								id='sfyMyKeywardEnabled'
								type='checkbox'
								style={{ cursor: 'pointer', width: 20, height: 20, marginRight: 8 }}
							/>
							개인분류 설정
						</label>
						<table style={{ width: '100%' }}>
							<tr>
								<td style={{ padding: 5, width: '25%' }}>개인분류 입력</td>
								<td style={{ padding: 5, width: '75%' }}>
									<div style={{ position: 'relative' }}>
										<input
											onChange={(e) => setSfyMyKeywardInput(e.target.value)}
											onBlur={(e) => setSfyMyKeywardInput(e.currentTarget.value.replaceAll(' ', ''))}
											value={sfyMyKeywardInput}
											id='sfyMyKeywardInput'
											disabled={!sfyMyKeywardEnabled}
											style={{ border: '1px solid black', width: '100%' }}
										/>
									</div>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td colSpan={3} style={{ color: 'red', paddingTop: 10, paddingBottom: 10 }}>
						개인분류를 설정하시려면 개인분류 설정란을 체크해주세요.(공백은 제거됩니다.)
					</td>
				</tr>
				{(shop === 'taobao1' || shop === 'taobao2' || shop === 'tmall1' || shop === 'tmall2') && (
					<tr>
						<td colSpan={3} style={{ border: '1px solid black', width: '50%', padding: 10 }}>
							<label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 18 }}>
								<input
									onChange={() => setSfyGoldMedalEnabled((p) => !p)}
									checked={sfyGoldMedalEnabled}
									id='sfyGoldMedalEnabled'
									type='checkbox'
									style={{ cursor: 'pointer', width: 20, height: 20, marginRight: 8 }}
								/>
								금메달 상품만 수집하기 (타오바오)
							</label>
						</td>
					</tr>
				)}
				{shop === 'express' && (
					<tr>
						<td colSpan={3} style={{ border: '1px solid black', width: '50%', padding: 10 }}>
							<label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 18 }}>
								<input
									onChange={() => setSfyStandardShippingEnabled((p) => !p)}
									checked={sfyStandardShippingEnabled}
									id='sfyStandardShippingEnabled'
									type='checkbox'
									style={{ cursor: 'pointer', width: 20, height: 20, marginRight: 8 }}
								/>
								스탠다드 쉬핑 상품만 수집하기 (알리익스프레스)
							</label>
						</td>
					</tr>
				)}
				<tr>
					<td colSpan={3} style={{ color: 'red', paddingTop: 5, paddingBottom: 5 }}></td>
				</tr>
				{state === 'customization' && (
					<tr>
						<td style={{ border: '1px solid black', width: '45%', padding: 10 }}>
							<label
								style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 18, marginBottom: 20 }}
							>
								<input
									type='radio'
									name='sfyBulkType'
									// value='page'
									checked={bulkType === 'page'}
									onChange={() => setBulkType('page')}
									style={{ cursor: 'pointer', width: 20, height: 20 }}
								/>
								&nbsp; 페이지단위 대량수집
							</label>
							<table style={{ width: '100%', marginBottom: 20 }}>
								<tr>
									<td style={{ padding: 5, width: '50%' }}>시작페이지</td>
									<td style={{ padding: 5, width: '50%' }}>
										<input
											id='sfyPageStart'
											value={pages.start}
											onChange={(e) => {
												if (isNaN(Number(e.target.value))) return alert('숫자만 입력해주세요.');

												setPages((p) => ({ ...p, start: e.target.value }));
											}}
											style={{ border: '1px solid black', textAlign: 'center', width: '100%' }}
										/>
									</td>
								</tr>
								<tr>
									<td style={{ padding: 5, width: '50%' }}>종료페이지</td>
									<td style={{ padding: 5, width: '50%' }}>
										<input
											id='sfyPageEnd'
											value={pages.end}
											onChange={(e) => {
												if (isNaN(Number(e.target.value))) return alert('숫자만 입력해주세요.');

												setPages((p) => ({ ...p, end: e.target.value }));
											}}
											style={{ border: '1px solid black', textAlign: 'center', width: '100%' }}
										/>
									</td>
								</tr>
							</table>
						</td>
						<td style={{ textAlign: 'center' }}>또는</td>
						<td style={{ border: '1px solid black', width: '45%', padding: 10 }}>
							<label
								style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 18, marginBottom: 20 }}
							>
								<input
									type='radio'
									name='sfyBulkType'
									// value='amount'
									checked={bulkType === 'amount'}
									onChange={() => setBulkType('amount')}
									style={{ cursor: 'pointer', width: 20, height: 20 }}
								/>
								&nbsp; 수량단위 대량수집
							</label>
							<table style={{ width: '100%', marginBottom: 56 }}>
								<tr>
									<td style={{ padding: 5, width: '50%' }}>목표수량</td>
									<td style={{ padding: 5, width: '50%' }}>
										<input
											id='sfyAmount'
											value={amount}
											onChange={(e) => {
												if (isNaN(Number(e.target.value))) return alert('숫자만 입력해주세요.');

												setAmount(e.target.value);
											}}
											style={{ border: '1px solid black', textAlign: 'center', width: '100%' }}
										/>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				)}
				<tr>
					<td colSpan={3} style={{ paddingTop: 10, paddingBottom: 10 }}>
						<button
							id='sfyStart'
							style={{ width: '100%', height: 40, fontWeight: 600 }}
							onClick={() => {
								if (state === 'currentPage') onStartBulk();
								else if (state === 'customization') onConfigBulkStart();
							}}
						>
							대량수집 시작하기
						</button>
					</td>
				</tr>
			</table>
		</div>
	);
};
