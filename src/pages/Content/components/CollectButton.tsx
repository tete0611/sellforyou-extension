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
// 	// bulk: boolean;
// 	result: Source & { error: string };
// 	isCollecting?: boolean;
// }

// export const CollectButton = ({ isCollecting, result, info, type = 'default' }: Props) => {
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

// 				isCollecting = true;

// 				setTypeState('loading');

// 				const response = await sendRuntimeMessage<{ status: string; statusMessage: string }>({
// 					action: 'collect',
// 					source: result,
// 				});

// 				if (!response) return;
// 				if (response.status === 'success') {
// 					setTypeState('success');
// 					setFinish(true);
// 				} else {
// 					setTypeState('failed');
// 					setFinish(true);
// 				}

// 				result.error = response.statusMessage;

// 				if (info.isBulk) sendRuntimeMessage({ action: 'collect-finish' });
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
// 			{typeState === 'entered' && <div style={{ fontSize: 12, whiteSpace: 'pre-wrap' }}>{`현재상품\n수집하기`}</div>}
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
