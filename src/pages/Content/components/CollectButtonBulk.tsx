import React from 'react';
import { useState } from 'react';
import { BulkSettingPaper } from './BulkSettingPaper';
import { FloatingButtonBulkProps } from '../function';
import { render } from 'react-dom';

export const CollectButtonBulk = ({ info, shop, disableCustomizationBulk }: FloatingButtonBulkProps) => {
	const [collectMouseEnter, setCollectMouseEnter] = useState(false);
	const [checkMouseEnter, setCheckMouseEnter] = useState(false);
	const [configMouseEnter, setConfigMouseEnter] = useState(false);
	const [checkAll, setCheckAll] = useState<'true' | 'false'>('true');

	/**현재페이지 수집하기 클릭 */
	const onCollectClick = async ({ info }: FloatingButtonBulkProps) => {
		const paper = Object.assign(document.createElement('div'), {
			id: 'sfyPaper',
			className: 'SELLFORYOU-INFORM',
		});
		render(<BulkSettingPaper state='currentPage' info={info} shop={shop} />, paper);
		document.documentElement.appendChild(paper);
	};

	/** 상품일괄 선택/해제 클릭 */
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

	/** 사용자정의 대량수집 클릭 */
	const onConfigClick = async () => {
		const paper = Object.assign(document.createElement('div'), {
			id: 'sfyPaper',
			className: 'SELLFORYOU-INFORM',
		});
		render(<BulkSettingPaper state='customization' info={info} shop={shop} />, paper);
		document.documentElement.appendChild(paper);
	};

	return (
		<table className='SELLFORYOU-FLOATING'>
			<tr>
				<td className='SELLFORYOU-CELL'>
					<button
						className='SELLFORYOU-COLLECT'
						onMouseEnter={() => setCollectMouseEnter(true)}
						onMouseLeave={() => setCollectMouseEnter(false)}
						onClick={() => onCollectClick({ info: info, shop: shop })}
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
						{!checkMouseEnter &&
							(checkAll === 'true' ? (
								<i className='fi fi-rs-list-check' style={{ display: 'flex', alignItems: 'center', fontSize: 32 }}></i>
							) : (
								<i className='fi fi-rs-list' style={{ display: 'flex', alignItems: 'center', fontSize: 32 }}></i>
							))}
					</button>
				</td>
			</tr>
			{!disableCustomizationBulk && (
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
