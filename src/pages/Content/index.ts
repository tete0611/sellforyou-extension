import { alibaba, amazon, express, taobao, tmall, vvic } from './modules';
import { createTab, sendRuntimeMessage } from '../Tools/ChromeAsync';
import { getCookie, sleep } from '../../../common/function';
import { getTaobaoData } from '../Tools/Taobao';
import {
	deleteA077Products,
	editedA077Products,
	searchA077Products,
	uploadA077Products,
	uploadA077Resources,
} from '../Tools/SmartStore';
import { uploadWemakeprice2, editWemakeprice, deleteWemakeprice2 } from '../Tools/Wemakeprice';
import { RuntimeMessage } from '../../type/type';
import { addExcelInfo, cardPay, floatingButton, getsetPage, initInfo, resultDetails, skip } from './function';

/**
 *
 * @param info
 * @param shop 마켓이름
 * @param result any
 * @param bulk 대량수집버튼인지 여부
 * @param urlUnchangedPage 사용자정의 대량수집시 url변동이 없어 api를 이용해야 하는 경우
 * @returns void
 */

const main = async () => {
	/** 스타일시트 링크 삽입 */
	let link = document.createElement('link');
	link.href = chrome.runtime.getURL('ui/css/uicons-regular-straight.css');
	link.type = 'text/css';
	link.rel = 'stylesheet';
	document.documentElement.insertBefore(link, null);

	/** 이벤트리스너 등록 */
	chrome.runtime.onMessage.addListener((request: RuntimeMessage, _, sendResponse) => {
		switch (request.action) {
			case 'set_info': {
				getsetPage(request.source).then(sendResponse);
				return true;
			}

			case 'pay-card': {
				cardPay(request.source).then(sendResponse);
				return true;
			}

			case 'fetch': {
				const url = request?.form?.url!;
				const requestInit = request.form?.requestInit;

				fetch(url, requestInit)
					.then((res) => res.text())
					.then((data) => sendResponse(data));
				return true;
			}

			//위메프
			case 'upload-B719': {
				let paper = document.createElement('div');
				paper.id = 'sfyPaper';
				paper.className = 'SELLFORYOU-INFORM';
				paper.innerHTML = `
                    <div style="margin-bottom: 40px;">
                        위메프에 업로드가 진행 중입니다.
                    </div>
            
                    <div style="color: #ff4b4b; font-size: 24px; margin-bottom: 10px;">
                        업로드가 진행되는 동안 다른 탭을 이용해주시기 바랍니다.
                    </div>
            
                    <div style="color: #ff4b4b; font-size: 24px;">
                        현재 탭에서 페이지를 이동할 경우 업로드가 중단될 수 있습니다.
                    </div>
                `;

				document.documentElement.appendChild(paper);

				uploadWemakeprice2(request.source).then(sendResponse);

				return true;
			}
			/** 스마트스토어 */
			case 'upload-A077': {
				let paper = document.createElement('div');
				paper.id = 'sfyPaper';
				paper.className = 'SELLFORYOU-INFORM';
				paper.innerHTML = `
                    <div style="margin-bottom: 40px;">
                        스마트스토어 업로드가 진행 중입니다.
                    </div>
            
                    <div style="color: #ff4b4b; font-size: 24px; margin-bottom: 10px;">
                        업로드가 진행되는 동안 다른 탭을 이용해주시기 바랍니다.
                    </div>
            
                    <div style="color: #ff4b4b; font-size: 24px;">
                        현재 탭에서 페이지를 이동할 경우 업로드가 중단될 수 있습니다.
                    </div>
                `;

				document.documentElement.appendChild(paper);

				uploadA077Resources(request.source).then(sendResponse);
				return true;
			}

			case 'upload-A077-products': {
				uploadA077Products(request.source).then(sendResponse);
				return true;
			}
			case 'search-A077-products': {
				searchA077Products(request.source).then(sendResponse);
				return true;
			}

			case 'edited-B719': {
				editWemakeprice(request.source).then(sendResponse);
				return true;
			}

			case 'delete-B719': {
				deleteWemakeprice2(request.source).then(sendResponse);
				return true;
			}

			case 'edited-A077-products': {
				editedA077Products(request.source).then(sendResponse);
				return true;
			}

			case 'delete-A077-products': {
				deleteA077Products(request.source).then(sendResponse);
				return true;
			}

			case 'collect-product-excel': {
				sendRuntimeMessage(request);
				sendResponse(true);
				break;
			}

			case 'collect-page-excel': {
				addExcelInfo(request).then(sendResponse);
				return true;
			}

			case 'collect-finish': {
				resultDetails(request.source as any).then(sendResponse);
				return true;
			}

			case 'order-taobao': {
				getTaobaoData(request.source).then(sendResponse);
				return true;
			}

			case 'order-taobao-id': {
				sendResponse(getCookie('lgc'));
				break;
			}

			case 'order-tmall': {
				break;
			}

			case 'order-express': {
				break;
			}

			case 'order-alibaba': {
				break;
			}

			case 'order-vvic': {
				break;
			}
			/** 셀포유로 console.log 보내서 테스트 (소싱처에서 console.clear()메서드 등 발생으로 인한) */
			case 'console': {
				console.log(request.source);
			}
		}
	});

	/** 상품수집하는 방법 : 3가지
	 * 1. 리스트 페이지에서 대량수집
	 * 2. 단일 상품에서 단일수집
	 * 3. 판매자 페이지에서 대량수집
	 */
	const currentUrl = window.location.href;
	/** 타오바오 단일상품 페이지 */
	if (/item.taobao.com\/item.htm/.test(currentUrl)) {
		console.log('타오바오 단일상품 페이지 진입');
		const info = await initInfo(true);
		const result = await new taobao().get(info.user);
		floatingButton({ info: info, shop: null, result: result as any, bulk: false });

		/** 타오바오 리스트 페이지 */
	} else if (/\bs.taobao.com\/search/.test(currentUrl)) {
		console.log('타오바오 리스트 페이지 진입');
		const info = await initInfo(false);
		await new taobao().bulkTypeOne(info.user);
		floatingButton({ info: info, shop: 'taobao1', result: true as any, bulk: true });

		/**  */
	} else if (/world.taobao.com\/wow/.test(currentUrl)) {
		console.log('월드 타오바오 페이지 진입');
		const info = await initInfo(false);
		await new taobao().bulkTypeThree(info.user);
		floatingButton({ info: info, shop: 'taobao1', result: true as any, bulk: true });

		/** 타오바오 상점 페이지 */
	} else if (
		/world.taobao.com\/search/.test(currentUrl) ||
		/taobao.com\/search/.test(currentUrl) ||
		/taobao.com\/category/.test(currentUrl)
	) {
		console.log('타오바오 상점 페이지 진입');
		const info = await initInfo(false);
		await new taobao().bulkTypeTwo(info.user);
		floatingButton({ info: info, shop: 'taobao2', result: true as any, bulk: true });

		/**  */
	} else if (/guang.taobao.com/.test(currentUrl)) {
		skip();

		/** 티몰 상세페이지 */
	} else if (
		/detail.tmall.com/.test(currentUrl) ||
		/chaoshi.detail.tmall.com/.test(currentUrl) ||
		/detail.tmall.hk/.test(currentUrl)
	) {
		console.log('티몰 상세페이지 진입');
		const info = await initInfo(true);
		const result = await new tmall().get(info.user);
		floatingButton({ info: info, shop: null, result: result, bulk: false });

		/** 티몰 리스트페이지 */
	} else if (/tmall.com/.test(currentUrl)) {
		const info = await initInfo(false);
		if (/list.tmall.com/.test(currentUrl)) {
			await new tmall().bulkTypeOne(info.user);
			floatingButton({ info: info, shop: 'tmall1', result: true as any, bulk: true });
		} else {
			await new tmall().bulkTypeTwo(info.user);
			floatingButton({ info: info, shop: 'tmall2', result: true as any, bulk: true });
		}

		/** 알리 단일 페이지 */
	} else if (/aliexpress.com\/item/.test(currentUrl)) {
		const info = await initInfo(true);
		const result = await new express().get(info.user);
		floatingButton({ info: info, shop: 'express', result: result, bulk: false });

		/** 알리 검색 페이지 */
	} else if (
		/aliexpress.com\/af/.test(currentUrl) ||
		/aliexpress.com\/af\/category/.test(currentUrl) ||
		/aliexpress.com\/af\/wholesale/.test(currentUrl) ||
		/aliexpress.com\/w\/wholesale/.test(currentUrl) ||
		/aliexpress.com\/category/.test(currentUrl) ||
		/aliexpress.com\/premium/.test(currentUrl) ||
		/aliexpress.com\/wholesale/.test(currentUrl)
	) {
		console.log('알리 검색 페이지 진입');
		const info = await initInfo(false);
		await new express().bulkTypeOne(info.user);
		await new express().bulkTypeTwo(info.user);
		floatingButton({ info: info, shop: 'express', result: true as any, bulk: true });

		/** 알리 상점 페이지 */
	} else if (/aliexpress.com\/store/.test(currentUrl)) {
		console.log('알리 상점 페이지 진입');
		const info = await initInfo(false);
		await new express().bulkTypeThree(info.user);
		floatingButton({ info: info, shop: 'express', result: true as any, bulk: true });

		/** 1688 단일상품 페이지 */
	} else if (/detail.1688.com/.test(currentUrl)) {
		console.log('1688 단일상품 페이지');
		const info = await initInfo(true);
		const result = await new alibaba().get(info.user);
		floatingButton({ info, shop: 'alibaba', result, bulk: false });

		/** 1688 상점 페이지 and 검색 페이지 */
	} else if (
		/s.1688.com\/selloffer\/offer_search.htm/.test(currentUrl) ||
		/1688.com\/page\/offerlist/.test(currentUrl) ||
		/s.1688.com\/youyuan\/index.htm/.test(currentUrl)
	) {
		console.log(`1688 상점/검색 페이지`);
		const info = await initInfo(false);
		await new alibaba().bulkTypeOne(info.user);
		await new alibaba().bulkTypeTwo(info.user);
		floatingButton({ info, shop: 'alibaba', result: true as any, bulk: true });

		/** 1688 리스트 페이지 */
	} else if (/show.1688.com\/pinlei\/industry\/pllist.html/.test(currentUrl)) {
		console.log('1688 리스트페이지 진입');
		const info = await initInfo(false);
		await new alibaba().bulkTypeOne(info.user);
		floatingButton({ info, shop: 'alibaba', result: true as any, bulk: true });

		/** vvic 단일상품 페이지 */
	} else if (/www.vvic.com\/item/.test(currentUrl)) {
		const info = await initInfo(true);
		const result = await new vvic().get(info.user);
		floatingButton({ info, shop: 'vvic', result, bulk: false });

		/** vvic 검색 페이지 */
	} else if (/www.vvic.com\/.+\/search/.test(currentUrl) || /www.vvic.com\/.+\/topic/.test(currentUrl)) {
		console.log(`vvic 검색 페이지 진입`);
		const info = await initInfo(false);
		await new vvic().bulkTypeFour(info.user);
		floatingButton({ info, shop: 'vvic', result: true as any, bulk: true });

		/** vvic 상점 페이지 */
	} else if (/www.vvic.com\/shop\/(\d+)/.test(currentUrl)) {
		console.log('vvic 상점 페이지 진입');
		const info = await initInfo(false);
		await new vvic().bulkTypeOne(info.user, 3);
		const shopId = parseInt(currentUrl.match(/\/shop\/(\d+)/)?.[1] ?? '0');
		floatingButton({
			info,
			shop: 'vvic',
			result: true as any,
			bulk: true,
			urlUnchangedPage: { shopId: shopId, method: 'api' },
		});

		/** vvic 리스트 페이지 */
	} else if (/www.vvic.com\/.+\/list/.test(currentUrl)) {
		console.log('vvic 리스트 페이지 진입');
		const info = await initInfo(false);
		await new vvic().bulkTypeFour(info.user);
		// const shopId = parseInt(currentUrl.match(/\/list\/(\d+)/)?.[1] ?? '0');
		floatingButton({ info, shop: 'vvic', result: true as any, bulk: true });

		/** 아마존 페이지 */
	} else if (/www.amazon.com\/.+\/dp\//.test(currentUrl) || /www.amazon.com\/dp/.test(currentUrl)) {
		const info = await initInfo(true);
		const result = await new amazon().get(info.user, 'us');
		floatingButton({ info, shop: 'amazon', result, bulk: false });

		/** 아마존 페이지 */
	} else if (/www.amazon.co.jp\/.+\/dp\//.test(currentUrl) || /www.amazon.co.jp\/dp/.test(currentUrl)) {
		const info = await initInfo(true);
		const result = await new amazon().get(info.user, 'jp');
		floatingButton({ info, shop: 'amazon', result, bulk: false });

		/** 아마존 페이지 */
	} else if (/www.amazon.de\/.+\/dp\//.test(currentUrl) || /www.amazon.de\/dp/.test(currentUrl)) {
		const info = await initInfo(true);
		const result = await new amazon().get(info.user, 'de');
		floatingButton({ info, shop: 'amazon', result, bulk: false });

		/** 아마존 페이지 */
	} else if (
		/www.amazon.com\/s\?/.test(currentUrl) ||
		/www.amazon.com\/s\//.test(currentUrl) ||
		/www.amazon.com\/b\//.test(currentUrl)
	) {
		const info = await initInfo(false);
		await new amazon().bulkTypeOne(info.user, 'amazon.com');
		floatingButton({ info, shop: 'amazon1', result: true as any, bulk: true });

		/** 아마존 페이지 */
	} else if (/www.amazon.com\/stores/.test(currentUrl)) {
		const info = await initInfo(false);
		await new amazon().bulkTypeTwo(info.user, 'amazon.com');
		floatingButton({ info, shop: 'amazon2', result: true as any, bulk: true });

		/** 아마존 페이지 */
	} else if (
		/www.amazon.co.jp\/s\?/.test(currentUrl) ||
		/www.amazon.co.jp\/s\//.test(currentUrl) ||
		/www.amazon.co.jp\/b\//.test(currentUrl)
	) {
		const info = await initInfo(false);
		await new amazon().bulkTypeOne(info.user, 'amazon.co.jp');
		floatingButton({ info, shop: 'amazon1', result: true as any, bulk: true });

		/** 아마존 페이지 */
	} else if (/www.amazon.co.jp\/stores/.test(currentUrl)) {
		const info = await initInfo(false);
		await new amazon().bulkTypeTwo(info.user, 'amazon.co.jp');
		floatingButton({ info, shop: 'amazon2', result: true as any, bulk: true });

		/** 아마존 페이지 */
	} else if (
		/www.amazon.de\/s\?/.test(currentUrl) ||
		/www.amazon.de\/s\//.test(currentUrl) ||
		/www.amazon.de\/b\//.test(currentUrl)
	) {
		const info = await initInfo(false);
		await new amazon().bulkTypeOne(info.user, 'amazon.de');
		floatingButton({ info, shop: 'amazon1', result: true as any, bulk: true });

		/** 아마존 페이지 */
	} else if (/www.amazon.de\/stores/.test(currentUrl)) {
		const info = await initInfo(false);
		await new amazon().bulkTypeTwo(info.user, 'amazon.de');
		floatingButton({ info, shop: 'amazon2', result: true as any, bulk: true });

		/** 테무 리스트 페이지 */
	} else if (/.temu.com\/kr-en\/.*opt_level/.test(currentUrl)) {
		// alert('테무 리스트 페이지 진입');
	}
};

main();
