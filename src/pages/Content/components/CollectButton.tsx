import React from 'react';
import { useState } from 'react';
import { sendRuntimeMessage } from '../../Tools/ChromeAsync';
import { FloatingButtonProps } from '../function';

export const CollectButton = ({ info, result }: FloatingButtonProps) => {
	const [inner, setInner] = useState<'default' | 'success' | 'failed' | 'loading' | 'entered'>('default'); // inner 엘리먼트 상태

	return (
		<table className='SELLFORYOU-FLOATING'>
			<tr>
				<td className='SELLFORYOU-CELL'>
					<button
						className='SELLFORYOU-COLLECT'
						onClick={async () => {
							// 수집 끝났을 경우
							if (!info.isBulkProcessing && result.message)
								if (confirm(`${result.message}\n[확인]을 누르시면 수집상품목록으로 이동합니다.`)) {
									const url = new URL(chrome.runtime.getURL('app.html'));
									url.search = 'collected';
									window.open(url);
								}
							if (inner === 'failed' || inner === 'loading' || inner === 'success') return;
							setInner('loading');

							const response = await sendRuntimeMessage<{ status: string; statusMessage: string }>({
								action: 'collect',
								source: result,
							});

							if (!response) return;
							if (response.status === 'success') setInner('success');
							else setInner('failed');

							result.message = response.statusMessage;

							if (info.isBulkProcessing) sendRuntimeMessage({ action: 'collect-finish' });
						}}
						onMouseEnter={() => inner === 'default' && setInner('entered')}
						onMouseLeave={() => inner === 'entered' && setInner('default')}
					>
						{inner === 'default' && (
							<i className='fi fi-rs-inbox-in' style={{ display: 'flex', alignItems: 'center', fontSize: 32 }}></i>
						)}
						{inner === 'entered' && <div style={{ fontSize: 12, whiteSpace: 'pre-wrap' }}>{`현재상품\n수집하기`}</div>}
						{inner === 'success' && (
							<>
								<img
									src={chrome.runtime.getURL('resources/icon-success.png')}
									width={20}
									height={20}
									style={{ marginBottom: 5 }}
								/>
								수집완료
							</>
						)}
						{inner === 'failed' && (
							<>
								<img
									src={chrome.runtime.getURL('resources/icon-failed.png')}
									width={20}
									height={20}
									style={{ marginBottom: 5 }}
								/>
								수집실패
							</>
						)}
						{inner === 'loading' && <div className='SELLFORYOU-LOADING' />}
					</button>
				</td>
			</tr>
		</table>
	);
};
