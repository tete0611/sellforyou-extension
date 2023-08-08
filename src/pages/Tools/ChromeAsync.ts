import { sleep } from './Common';

// 크롬 스토리지는 일반 브라우저 스토리지랑 공유되지 않음 (서로 접근불가)
// sessionStorage / localStorage 는 일반 브라우저에서 사용
// chrome.storage.local 은 크롬 확장프로그램에서 사용
// 기타 chrome API는 https://developer.chrome.com/docs/extensions/reference/ 참조

// 크롬 스토리지 데이터 가져오기
export const getLocalStorage = (key: any) => {
	return new Promise((resolve, reject) => {
		try {
			chrome.storage.local.get(key, (value) => {
				if (!key) {
					resolve(value);
				} else {
					resolve(value[key]);
				}
			});
		} catch (e) {
			reject(e);
		}
	});
};

// 크롬 스토리지 데이터 저장하기
export const setLocalStorage = (obj: any) => {
	return new Promise((resolve, reject) => {
		try {
			chrome.storage.local.set(obj, () => {
				resolve(true);
			});
		} catch (e) {
			reject(e);
		}
	});
};

// 크롬 스토리지 데이터 삭제하기
export const deleteLocalStorage = (keys: any) => {
	return new Promise((resolve, reject) => {
		try {
			chrome.storage.local.remove(keys, () => {
				resolve(true);
			});
		} catch (e) {
			reject(e);
		}
	});
};

// 메시지 전송 (콘텐츠스크립트 -> 확장프로그램)
export const sendRuntimeMessage = (obj: any) => {
	console.log('runtime', obj);

	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage(obj, (response) => {
			let lastError = chrome.runtime.lastError;

			if (lastError) {
				console.log('runtime rejected', obj, lastError.message);

				resolve(null);

				return;
			}

			console.log('runtime resolved', obj, response);

			resolve(response);
		});
	});
};

// 메시지 전송 (확장프로그램 -> 콘텐츠스크립트)
export const sendTabMessage = (tabid: number, obj: any) => {
	console.log('sendTabMessage 메서드 작동');
	console.log(tabid, obj);

	return new Promise((resolve, reject) => {
		chrome.tabs.sendMessage(tabid, obj, (response) => {
			let lastError = chrome.runtime.lastError;

			if (lastError) {
				console.log(`${tabid} rejected`, lastError.message);

				resolve(null);

				return;
			}

			console.log(`${tabid} resolved`, obj, response);

			resolve(response);
		});
	});
};

// 열려있는 창 조회
export const queryWindow = (options: any) => {
	return new Promise((resolve, reject) => {
		try {
			chrome.windows.getAll(options, (windows) => {
				resolve(windows);
			});
		} catch (e) {
			reject(e);
		}
	});
};

// 열려있는 탭 조회
export const queryTabs = (options: any) => {
	return new Promise((resolve, reject) => {
		try {
			chrome.tabs.query(options, (tabs) => {
				resolve(tabs);
			});
		} catch (e) {
			reject(e);
		}
	});
};

// 새로운 탭 생성 (생성 즉시 탭 정보 반환)
export const createTab = (options: any) => {
	return new Promise((resolve, reject) => {
		try {
			chrome.tabs.create(options, (tab) => {
				resolve(tab);
			});
		} catch (e) {
			reject(e);
		}
	});
};

// 새로운 탭 생성 (생성 및 URL 요청 후 페이지가 완전히 로드되면 탭 정보 반환)
export const createTabCompletely = async (options: any, limit: number) => {
	let timeout = 0;
	let tab: any = await createTab(options);

	while (true) {
		if (timeout === limit) {
			return tab;
		}

		const tabs: any = await queryTabs({});
		const result: any = tabs.find((v: any) => v.id === tab.id && v.status === 'complete');

		if (result) {
			return result;
		}

		timeout += 1;

		await sleep(1000 * 1);
	}
};
