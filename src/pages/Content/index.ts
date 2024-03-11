import CryptoJS from 'crypto-js';
import { alibaba, amazon, express, pinduoduo, taobao, temu, tmall, vvic } from './modules';
import { sendRuntimeMessage } from '../Tools/ChromeAsync';
import { getCookie } from '../../../common/function';
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
import {
	addExcelInfo,
	cardPay,
	floatingButton,
	floatingButtonBulk,
	getsetPage,
	initInfo,
	resultDetails,
	skip,
	testButton,
} from './function';
import { STYLE_SHEET, UPLOAD_PAPER } from './components';

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
	document.documentElement.insertBefore(STYLE_SHEET, null);

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

			/** 위메프 */
			case 'upload-B719': {
				document.documentElement.appendChild(UPLOAD_PAPER({ shopName: '위메프' }));
				uploadWemakeprice2(request.source).then(sendResponse);
				return true;
			}

			/** 스마트스토어 이미지,동영상 업로드 */
			case 'upload-A077': {
				document.documentElement.appendChild(UPLOAD_PAPER({ shopName: '스마트스토어' }));
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
		}
	});

	/** 상품수집하는 방법 : 3가지
	 * 1. 리스트 페이지에서 대량수집
	 * 2. 단일 상품에서 단일수집
	 * 3. 판매자 페이지에서 대량수집
	 */
	const currentUrl = window.location.href;

	////////////////////////////////////////////////////
	//////////////////// 타 오 바 오 ////////////////////
	///////////////////////////////////////////////////
	/** 타오바오 단일상품 페이지 */
	if (/item.taobao.com\/item.htm/.test(currentUrl)) {
		console.log('타오바오 단일상품 페이지 진입');
		const info = await initInfo(true);
		const result = await new taobao().get(info.user, info.isBulkProcessing);
		floatingButton({ info: info, result: result as any });

		/** 타오바오 리스트 페이지 */
	} else if (/\bs.taobao.com\/search/.test(currentUrl)) {
		console.log('타오바오 리스트 페이지 진입');
		const info = await initInfo(false);
		await new taobao().bulkTypeOne(info.user);
		floatingButtonBulk({ info: info, shop: 'taobao1' });

		/**  */
	} else if (/world.taobao.com\/wow/.test(currentUrl)) {
		console.log('월드 타오바오 페이지 진입');
		const info = await initInfo(false);
		await new taobao().bulkTypeThree(info.user);
		floatingButtonBulk({ info: info, shop: 'taobao1' });

		/** 타오바오 상점 페이지 */
	} else if (
		/world.taobao.com\/search/.test(currentUrl) ||
		/taobao.com\/search/.test(currentUrl) ||
		/taobao.com\/category/.test(currentUrl)
	) {
		console.log('타오바오 상점 페이지 진입');
		const info = await initInfo(false);
		await new taobao().bulkTypeTwo(info.user);
		floatingButtonBulk({ info: info, shop: 'taobao2' });

		/**  */
	} else if (/guang.taobao.com/.test(currentUrl)) {
		skip();

		///////////////////////////////////////////////
		//////////////////// 티 몰 ////////////////////
		//////////////////////////////////////////////
		/** 티몰 상세페이지 */
	} else if (
		/detail.tmall.com/.test(currentUrl) ||
		/chaoshi.detail.tmall.com/.test(currentUrl) ||
		/detail.tmall.hk/.test(currentUrl)
	) {
		console.log('티몰 상세페이지 진입');
		const info = await initInfo(true);
		const result = await new tmall().get(info.user, info.isBulkProcessing);
		floatingButton({ info: info, result: result as any });

		/** 티몰 리스트페이지 */
	} else if (/tmall.com/.test(currentUrl)) {
		console.log('티몰 리스트 페이지 진입');
		if (/err.tmall.com/.test(currentUrl)) return; // 에러페이지면 리턴
		const info = await initInfo(false);
		if (/list.tmall.com/.test(currentUrl)) {
			await new tmall().bulkTypeOne(info.user);
			floatingButtonBulk({ info: info, shop: 'tmall1' });
		} else {
			await new tmall().bulkTypeTwo(info.user);
			floatingButtonBulk({ info: info, shop: 'tmall2' });
		}
	}
	//////////////////////////////////////////////////////
	//////////////////// 알리익스프레스 ////////////////////
	/////////////////////////////////////////////////////
	// 알리 단일 페이지
	else if (currentUrl.includes('aliexpress.com')) {
		if (/aliexpress.com\/item/.test(currentUrl)) {
			console.log(`알리 단일상품 페이지 진입`);
			const info = await initInfo(true);
			const result = await new express().get(info.user);
			floatingButton({ info: info, result: result as any });
			// 알리 검색 페이지
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
			floatingButtonBulk({ info: info, shop: 'express' });
			// 알리 상점 페이지
		} else if (/aliexpress.com\/store/.test(currentUrl)) {
			console.log('알리 상점 페이지 진입');
			const info = await initInfo(false);
			await new express().bulkTypeThree(info.user);
			floatingButtonBulk({ info: info, shop: 'express' });
		}
	}
	/////////////////////////////////////////////////
	//////////////////// 1 6 8 8 ////////////////////
	/////////////////////////////////////////////////
	/** 1688 단일상품 페이지 */
	else if (/detail.1688.com/.test(currentUrl)) {
		console.log('1688 단일상품 페이지');
		const info = await initInfo(true);
		const result = await new alibaba().get(info.user);
		floatingButton({ info, result });

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
		floatingButtonBulk({ info, shop: 'alibaba' });

		/** 1688 리스트 페이지 */
	} else if (/show.1688.com\/pinlei\/industry\/pllist.html/.test(currentUrl)) {
		console.log('1688 리스트페이지 진입');
		const info = await initInfo(false);
		await new alibaba().bulkTypeOne(info.user);
		floatingButtonBulk({ info, shop: 'alibaba' });
	}
	/////////////////////////////////////////////////
	//////////////////// V V I C ////////////////////
	/////////////////////////////////////////////////
	/** vvic 단일상품 페이지 */
	else if (/www.vvic.com\/item/.test(currentUrl)) {
		const info = await initInfo(true);
		const result = await new vvic().get(info.user);
		floatingButton({ info, result });

		/** vvic 검색 페이지 */
	} else if (/www.vvic.com\/.+\/search/.test(currentUrl) || /www.vvic.com\/.+\/topic/.test(currentUrl)) {
		console.log(`vvic 검색 페이지 진입`);
		const info = await initInfo(false);
		await new vvic().bulkTypeFour(info.user);
		floatingButtonBulk({ info, shop: 'vvic' });

		/** vvic 상점 페이지 */
	} else if (/www.vvic.com\/shop\/(list\/)*(\d+)/.test(currentUrl)) {
		console.log('vvic 상점 페이지 진입');
		const info = await initInfo(false);
		await new vvic().bulkTypeOne(info.user, 3);
		const shopId = parseInt(currentUrl.match(/\/shop\/(\d+)/)?.[1] ?? '0');
		floatingButtonBulk({
			info,
			shop: 'vvic',
			urlUnchangedPage: { shopId: shopId, method: 'api' },
		});

		/** vvic 리스트 페이지 */
	} else if (/www.vvic.com\/.+\/list/.test(currentUrl)) {
		console.log('vvic 리스트 페이지 진입');
		const info = await initInfo(false);
		await new vvic().bulkTypeFour(info.user);
		// const shopId = parseInt(currentUrl.match(/\/list\/(\d+)/)?.[1] ?? '0');
		floatingButtonBulk({ info, shop: 'vvic' });

		/////////////////////////////////////////////////
		//////////////////// 아 마 존 ////////////////////
		/////////////////////////////////////////////////
		/** 아마존 페이지 1 */
	} else if (/www.amazon.com\/.+\/dp\//.test(currentUrl) || /www.amazon.com\/dp/.test(currentUrl)) {
		console.log(`amazon page type 1 entered`);
		const info = await initInfo(true);
		const result = await new amazon().get(info.user, 'us');
		floatingButton({ info, result });

		/** 아마존 재팬 페이지 2 */
	} else if (/www.amazon.co.jp\/.+\/dp\//.test(currentUrl) || /www.amazon.co.jp\/dp/.test(currentUrl)) {
		console.log(`amazon page type 2 entered`);
		const info = await initInfo(true);
		const result = await new amazon().get(info.user, 'jp');
		floatingButton({ info, result });

		/** 아마존 페이지 3 */
	} else if (/www.amazon.de\/.+\/dp\//.test(currentUrl) || /www.amazon.de\/dp/.test(currentUrl)) {
		console.log(`amazon page type 3 entered`);
		const info = await initInfo(true);
		const result = await new amazon().get(info.user, 'de');
		floatingButton({ info, result });

		/** 아마존 페이지 4 */
	} else if (
		/www.amazon.com\/s\?/.test(currentUrl) ||
		/www.amazon.com\/s\//.test(currentUrl) ||
		/www.amazon.com\/b\//.test(currentUrl)
	) {
		console.log(`amazon page type 4 entered`);
		const info = await initInfo(false);
		await new amazon().bulkTypeOne(info.user, 'amazon.com');
		floatingButtonBulk({ info, shop: 'amazon1' });

		/** 아마존 페이지 */
	} else if (/www.amazon.com\/stores/.test(currentUrl)) {
		console.log(`amazon store page entered`);
		const info = await initInfo(false);
		await new amazon().bulkTypeTwo(info.user, 'amazon.com');
		floatingButtonBulk({ info, shop: 'amazon2', disableCustomizationBulk: true });

		/** 아마존 페이지 */
	} else if (
		/www.amazon.co.jp\/s\?/.test(currentUrl) ||
		/www.amazon.co.jp\/s\//.test(currentUrl) ||
		/www.amazon.co.jp\/b\//.test(currentUrl)
	) {
		console.log(`amazon page type 5 entered`);
		const info = await initInfo(false);
		await new amazon().bulkTypeOne(info.user, 'amazon.co.jp');
		floatingButtonBulk({ info, shop: 'amazon1' });

		/** 아마존 페이지 */
	} else if (/www.amazon.co.jp\/stores/.test(currentUrl)) {
		console.log(`amazon page type 6 entered`);
		const info = await initInfo(false);
		await new amazon().bulkTypeTwo(info.user, 'amazon.co.jp');
		floatingButtonBulk({ info, shop: 'amazon2', disableCustomizationBulk: true });

		/** 아마존 페이지 */
	} else if (
		/www.amazon.de\/s\?/.test(currentUrl) ||
		/www.amazon.de\/s\//.test(currentUrl) ||
		/www.amazon.de\/b\//.test(currentUrl)
	) {
		console.log(`amazon page type 7 entered`);
		const info = await initInfo(false);
		await new amazon().bulkTypeOne(info.user, 'amazon.de');
		floatingButtonBulk({ info, shop: 'amazon1' });

		/** 아마존 페이지 */
	} else if (/www.amazon.de\/stores/.test(currentUrl)) {
		console.log(`amazon page type 8 entered`);
		const info = await initInfo(false);
		await new amazon().bulkTypeTwo(info.user, 'amazon.de');
		floatingButtonBulk({ info, shop: 'amazon2', disableCustomizationBulk: true });
	}

	/////////////////////////////////////////////////
	//////////////////// T E M U ////////////////////
	/////////////////////////////////////////////////
	else if (currentUrl.includes('www.temu.com')) {
		// 테무 단일상품 페이지
		// .html 앞에 g-6자리 이상의 숫자가 붙어있는 url만 단일상품취급
		if (/temu.com(\/.)*\/.+g-\d{6,}\.html/.test(currentUrl)) {
			console.log(`테무 상품페이지 진입`);
			const info = await initInfo(true);
			const result = await new temu().get(info.user);
			floatingButton({ info, result: result as any });
		}

		// 테무 리스트(카테고리) 페이지
		else if (/.temu.com(\/.+)*\/.*opt_level/.test(currentUrl)) {
			console.log('테무 리스트 페이지 진입');
			const info = await initInfo(false);
			new temu().bulkTypeOne(info.user, 'category');
			floatingButtonBulk({ info, shop: 'temu', disableCustomizationBulk: true });
		}

		// 테무 검색 페이지
		else if (/.temu.com\/search_result/.test(currentUrl)) {
			console.log(`테무 검색 페이지`);
			const info = await initInfo(false);
			new temu().bulkTypeOne(info.user, 'search_result');
			floatingButtonBulk({ info, shop: 'temu', disableCustomizationBulk: true });
		}

		// 테무 상점 페이지
		else if (/temu.com(\/.+)*\/.+m-\d{6,}\.html/.test(currentUrl)) {
			console.log(`테무 상점 페이지`);
			const info = await initInfo(false);
			new temu().bulkTypeOne(info.user, 'mall');
			floatingButtonBulk({ info, shop: 'temu', disableCustomizationBulk: true });
		}

		// 테무 베스트셀러
		else if (/temu.com(\/.+)*\/channel\/best-sellers.html/.test(currentUrl)) {
			console.log('테무 베스트셀러 페이지');
			const info = await initInfo(false);
			new temu().bulkTypeOne(info.user, 'best_sellers');
			floatingButtonBulk({ info, shop: 'temu', disableCustomizationBulk: true });
		}

		// 테무 별점 5점
		else if (/temu.com(\/.+)*\/channel\/full-star.html/.test(currentUrl)) {
			console.log('테무 별점5점 페이지');
			const info = await initInfo(false);
			new temu().bulkTypeOne(info.user, '5-Star Rated');
			floatingButtonBulk({ info, shop: 'temu', disableCustomizationBulk: true });
		}

		// 테무 SALE 페이지
		else if (/temu.com(\/.+)*\/attendance\/(.+).html/.test(currentUrl)) {
			console.log('테무 🌱 SALE');
			const info = await initInfo(false);
			new temu().bulkTypeOne(info.user, 'newSale');
			floatingButtonBulk({ info, shop: 'temu', disableCustomizationBulk: true });
		}

		// 테무 SALE 페이지 더보기
		else if (/temu.com(\/.+)*\/star-subject-more(\/.+)*.html/.test(currentUrl)) {
			console.log('테무 🌱 SALE More');
			const info = await initInfo(false);
			new temu().bulkTypeOne(info.user, 'newSale-more');
			floatingButtonBulk({ info, shop: 'temu', disableCustomizationBulk: true });
		}

		// 테무 신상품 페이지
		else if (/temu.com(\/.+)*\/channel\/new-in.html/.test(currentUrl)) {
			console.log('테무 신상품 페이지');
			const info = await initInfo(false);
			new temu().bulkTypeOne(info.user, 'new_in');
			floatingButtonBulk({ info, shop: 'temu', disableCustomizationBulk: true });
		}
	}

	/////////////////////////////////////////////////
	//////////////////// 핀 둬 둬 ////////////////////
	/////////////////////////////////////////////////
	else if (/mobile.yangkeduo.com\/index/.test(currentUrl)) {
		console.log(`핀둬둬 메인 페이지 진입`);
		const info = await initInfo(false);
		await new pinduoduo().bulkTypeOne(info.user);
		floatingButtonBulk({ info, shop: 'pinduoduo' });
	}
};

main();
