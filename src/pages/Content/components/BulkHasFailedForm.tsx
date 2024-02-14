import React, { useRef, useState } from 'react';
import { BulkInfo, CollectInfo } from '../../../type/type';
import { sendRuntimeMessage } from '../../Tools/ChromeAsync';

interface Props {
	failedResults: BulkInfo['results'];
	originalPage: string;
	isExcel: boolean;
}

/** 대량수집실패 결과창 */
export const BulkHasFailedForm = ({ failedResults, originalPage, isExcel }: Props) => {
	const sfyResultDetailRef = useRef<HTMLTableElement>(null);
	const [selectedRows, setSelectedRows] = useState<boolean[]>(Array(failedResults.length).fill(true));

	return (
		<div
			style={{
				background: 'white',
				border: '1px solid black',
				color: 'black',
				fontSize: 16,
				padding: 10,
				width: 1000,
				textAlign: 'left',
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', fontSize: 20, marginBottom: 40 }}>
				<img
					src={chrome.runtime.getURL('resources/icon-failed.png')}
					width={28}
					height={28}
					style={{ marginBottom: 5 }}
				/>
				&nbsp; {`수집실패(${failedResults.length})`}
			</div>
			<table style={{ width: '100%', marginBottom: 20 }}>
				<tr>
					<td style={{ textAlign: 'center', width: '10%' }}>
						<input
							id='sfyResultAll'
							type='checkbox'
							onClick={() => {
								if (selectedRows.every((v) => v)) setSelectedRows((p) => p.map((_) => false));
								else setSelectedRows((p) => p.map((_) => true));
							}}
							checked={selectedRows.every((v) => v === true)}
							style={{ width: 20, height: 20 }}
						/>
					</td>
					<td style={{ textAlign: 'center', width: '45%' }}>상품URL</td>
					<td style={{ textAlign: 'center', width: '45%' }}>실패사유</td>
				</tr>
			</table>
			<div style={{ minHeight: 100, maxHeight: 200, overflowY: 'auto' }}>
				<table id='sfyResultDetail' style={{ width: '100%' }} ref={sfyResultDetailRef}>
					{/* 실패 상품 목록 */}
					{failedResults.map((v, index) => {
						return (
							<tr key={index}>
								<td style={{ textAlign: 'center', width: '10%' }}>
									<input
										id={index.toString()}
										className='SFY-RESULT-CHECK'
										type='checkbox'
										checked={selectedRows[index]}
										onChange={() =>
											setSelectedRows((p) => {
												const newSelectedRows = [...p];
												newSelectedRows[index] = !selectedRows[index];
												return newSelectedRows;
											})
										}
										style={{ width: 20, height: 20 }}
									/>
								</td>
								<td style={{ textAlign: 'center', width: '45%' }}>
									<a target='_blank' href={v.input.url} style={{ color: 'gray' }}>
										<div
											style={{
												display: 'block',
												whiteSpace: 'nowrap',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												maxWidth: 400,
												margin: 'auto',
											}}
										>
											{v.input.url}
										</div>
									</a>
								</td>
								<td style={{ textAlign: 'center', width: '45%' }}>
									<div
										style={{
											color: 'red',
											display: 'block',
											whiteSpace: 'nowrap',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											maxWidth: 400,
											margin: 'auto',
										}}
									>
										{v.statusMessage}
									</div>
								</td>
							</tr>
						);
					})}
				</table>
			</div>
			<table style={{ width: '100%', marginTop: 20 }}>
				<tr>
					<td style={{ textAlign: 'center', width: '25%' }}>
						<button
							id='sfyPage'
							style={{ width: 200, height: 40 }}
							onClick={() => (window.location.href = originalPage)}
						>
							처음페이지로
						</button>
					</td>
					<td style={{ textAlign: 'center', width: '25%' }}>
						<button
							id='sfyRetry'
							style={{ width: 200, height: 40 }}
							onClick={() => {
								const inputs = failedResults
									.filter((_, i) => selectedRows[i])
									.map((v) => v.input) as CollectInfo['inputs'];

								if (inputs.length === 0) return alert('상품이 선택되지 않았습니다.');

								if (isExcel)
									sendRuntimeMessage({
										action: 'collect-product-excel',
										source: { data: inputs, retry: true },
									});
								else
									sendRuntimeMessage({
										action: 'collect-bulk',
										source: { data: inputs, retry: true },
									});
							}}
						>
							선택상품 재수집
						</button>
					</td>
					<td style={{ textAlign: 'center', width: '25%' }}>
						<button
							id='sfyConnect'
							style={{ width: 200, height: 40 }}
							onClick={() => {
								const url = new URL(chrome.runtime.getURL('app.html'));
								url.search = 'collected';
								window.open(url);
							}}
						>
							수집상품목록 이동
						</button>
					</td>
					<td style={{ textAlign: 'center', width: '25%' }}>
						<button
							id='sfyCopy'
							style={{ width: 200, height: 40 }}
							onClick={() => {
								const text = sfyResultDetailRef.current?.innerText ?? '';

								navigator.clipboard.writeText(text).then(
									() => alert('클립보드에 복사되었습니다.'),
									() => alert('클립보드에 복사할 수 없습니다.'),
								);
							}}
						>
							클립보드 복사
						</button>
					</td>
				</tr>
			</table>
		</div>
	);
};
