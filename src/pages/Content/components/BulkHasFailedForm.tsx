import React from 'react';
import { BulkInfo } from '../../../type/type';

interface Props {
	results: BulkInfo['results'];
}

export const BulkHasFailedForm = ({ results }: Props) => {
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
				&nbsp; {`수집실패(${results.length})`}
			</div>

			<table style={{ width: '100%', marginBottom: 20 }}>
				<tr>
					<td style={{ textAlign: 'center', width: '10%' }}>
						<input id='sfyResultAll' type='checkbox' checked style={{ width: 20, height: 20 }} />
					</td>

					<td style={{ textAlign: 'center', width: '45%' }}>상품URL</td>

					<td style={{ textAlign: 'center', width: '45%' }}>실패사유</td>
				</tr>
			</table>

			<div style={{ height: 100, overflowY: 'auto' }}>
				<table id='sfyResultDetail' style={{ width: '100%' }}>
					{/* 실패 상품 루프삽입 */}
					{results.map((v, index) => {
						return (
							<tr>
								<td style={{ textAlign: 'center', width: '10%' }}>
									<input
										id={index.toString()}
										className='SFY-RESULT-CHECK'
										type='checkbox'
										checked
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
						<button id='sfyPage' style={{ width: 200, height: 40 }}>
							처음페이지로
						</button>
					</td>

					<td style={{ textAlign: 'center', width: '25%' }}>
						<button id='sfyRetry' style={{ width: 200, height: 40 }}>
							선택상품 재수집
						</button>
					</td>

					<td style={{ textAlign: 'center', width: '25%' }}>
						<button id='sfyConnect' style={{ width: 200, height: 40 }}>
							수집상품목록 이동
						</button>
					</td>

					<td style={{ textAlign: 'center', width: '25%' }}>
						<button id='sfyCopy' style={{ width: 200, height: 40 }}>
							클립보드 복사
						</button>
					</td>
				</tr>
			</table>
		</div>
	);
};
