import React from 'react';

export const CaptchaPaper = () => {
	return (
		<div id='sfyPaper' className='SELLFORYOU-INFORM'>
			<>
				<div style={{ marginBottom: 40 }}>Captcha detected</div>
				<div style={{ color: 'black', fontSize: 24, marginBottom: 40 }}>
					열린 탭에서의 Captcha 보안 확인을 진행해 주세요.
				</div>
				<div style={{ color: '#ff4b4b', fontSize: 24, marginBottom: 40 }}>
					완료하지 않을 경우 수집이 정상 진행되지 않습니다.
				</div>
				<div style={{ color: 'black', fontSize: 24 }}>
					완료 후 새로고침
					<button
						style={{ fontWeight: 'bolder', padding: 10, marginLeft: 10, marginRight: 10 }}
						onClick={() => window.location.reload()}
					>
						F5
					</button>
					키를 눌러서 이어서 수집을 진행해 주세요.
				</div>
			</>
		</div>
	);
};
