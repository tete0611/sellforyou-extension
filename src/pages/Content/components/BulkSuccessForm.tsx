import React from 'react';
import { BulkInfo } from '../../../type/type';

interface Props {
	data: BulkInfo;
}

/** 대량수집성공 결과창 */
export const BulkSuccessForm = ({ data }: Props) => {
	return (
		<div
			style={{
				background: 'white',
				border: '1px solid black',
				color: 'black',
				fontSize: 16,
				padding: 10,
				width: 500,
				textAlign: 'left',
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', fontSize: 20, marginBottom: 40 }}>
				<img
					src={chrome.runtime.getURL('resources/icon-success.png')}
					width={28}
					height={28}
					style={{ marginBottom: 5 }}
				/>
				&nbsp; {`수집완료(${data.results.length})`}
			</div>

			<table style={{ width: '100%' }}>
				<tr>
					<td style={{ textAlign: 'center', width: '50%' }}>
						<button
							id='sfyPage'
							style={{ width: 200, height: 40 }}
							onClick={() => (window.location.href = data.sender.tab.url!)}
						>
							처음페이지로
						</button>
					</td>

					<td style={{ textAlign: 'center', width: '50%' }}>
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
				</tr>
			</table>
		</div>
	);
};
