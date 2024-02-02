import React from 'react';

interface Props {
	state: 'paused' | 'onGoing';
}

export const BackGroundPaper = ({ state }: Props) => {
	return (
		<div id='sfyPaper' className='SELLFORYOU-INFORM'>
			{state === 'onGoing' && (
				<>
					<div style={{ marginBottom: 40 }}>대량 수집이 진행 중입니다.</div>
					<div style={{ color: 'black', fontSize: 24, marginBottom: 40 }}>
						수집을 중단하려면
						<button id='sfyPause' style={{ fontWeight: 'bolder', padding: 10, marginLeft: 10, marginRight: 10 }}>
							여기를 클릭
						</button>
						하거나
						<button style={{ fontWeight: 'bolder', padding: 10, marginLeft: 10, marginRight: 10 }}>ESC</button>
						키를 눌러주세요.
					</div>
					<div style={{ color: '#ff4b4b', fontSize: 24, marginBottom: 10 }}>
						수집이 진행되는 동안 다른 탭을 이용해주시기 바랍니다.
					</div>
					<div style={{ color: '#ff4b4b', fontSize: 24, marginBottom: 40 }}>
						현재 탭에서 페이지를 이동할 경우 수집이 중단될 수 있습니다.
					</div>
					<div style={{ color: 'black', fontSize: 24 }}>
						이 페이지에서의 수집을 건너뛰려면
						<button id='sfySkip' style={{ fontWeight: 'bolder', padding: 10, marginLeft: 10, marginRight: 10 }}>
							여기를 클릭
						</button>
						해주세요.
					</div>
				</>
			)}
			{state === 'paused' && (
				<>
					<div style={{ marginBottom: 40 }}>대량 수집을 중단하는 중입니다.</div>

					<div style={{ color: '#ff4b4b', fontSize: 24, marginBottom: 10 }}>
						수집이 중단되는 동안 다른 탭을 이용해주시기 바랍니다.
					</div>

					<div style={{ color: '#ff4b4b', fontSize: 24 }}>
						현재 탭에서 페이지를 이동할 경우 수집이 중단되지 않을 수 있습니다.
					</div>
				</>
			)}
		</div>
	);
};
