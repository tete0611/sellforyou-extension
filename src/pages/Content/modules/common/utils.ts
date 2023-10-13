// 페이지 삽입 스크립트를 실제로 넣어주기 위한 구문
// 스크립트 삽입 시 외부 링크 사용불가 (인라인 스크립트만 사용 가능)
export const injectScript = async (type: string) => {
	sessionStorage.removeItem(`${type}-item`);

	let oldScript = document.getElementById('sellforyou');

	if (oldScript) oldScript.remove();

	let script = document.createElement('script');

	script.id = 'sellforyou';

	switch (type) {
		case 'taobao': {
			script.src = chrome.runtime.getURL('/resources/taobao.js');

			break;
		}

		case 'tmall': {
			script.src = chrome.runtime.getURL('/resources/tmall.js');

			break;
		}

		case 'express': {
			script.src = chrome.runtime.getURL('/resources/express.js');

			break;
		}

		case 'alibaba': {
			script.src = chrome.runtime.getURL('/resources/alibaba.js');

			break;
		}

		case 'vvic': {
			script.src = chrome.runtime.getURL('/resources/vvic.js');

			break;
		}

		case 'amazon': {
			script.src = chrome.runtime.getURL('/resources/amazon.js');

			break;
		}

		default:
			break;
	}

	document.documentElement.appendChild(script);
};
