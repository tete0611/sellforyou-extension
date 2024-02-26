import React from 'react';
import { renderToString } from 'react-dom/server';

export const STYLE_SHEET = Object.assign(document.createElement('link'), {
	href: chrome.runtime.getURL('ui/css/uicons-regular-straight.css'),
	type: 'text/css',
	rel: 'stylesheet',
});

export const UPLOAD_PAPER = ({ shopName }: { shopName: string }) =>
	Object.assign(document.createElement('div'), {
		id: 'sfyPaper',
		className: 'SELLFORYOU-INFORM',
		innerHTML: renderToString(
			<>
				<div style={{ marginBottom: 40 }}>{`${shopName} 업로드가 진행 중입니다.`}</div>
				<div style={{ color: '#ff4b4b', fontSize: 24, marginBottom: 10 }}>
					업로드가 진행되는 동안 다른 탭을 이용해주시기 바랍니다.
				</div>
				<div style={{ color: '#ff4b4b', fontSize: 24 }}>
					현재 탭에서 페이지를 이동할 경우 업로드가 중단될 수 있습니다.
				</div>
			</>,
		),
	});
