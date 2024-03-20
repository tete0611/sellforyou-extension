import { getImageSize, normalizeUrl, sleep } from '../../../../common/function';
import { User } from '../../../type/schema';
import { Nullable } from '../../../type/type';
import { checkLogin } from './common/auth';
import { form } from './common/data';
import { injectScript } from './common/utils';

/** 테무 상품정보 크롤링 */
const scrape = async (items: any, user: User) => {
	const result = form;
	result.user = user;

	// const urlParams = new URLSearchParams(window.location.href);
	// urlParams.forEach((value, key) => {
	// 	console.log(`${key} : ${value}`);
	// });
	/** 기본정보 생성 */
	try {
		const itemImgs: { url: string }[] = items.goodsData.gallery
			.map((v) => v)
			.filter((v) => v.id > 0)
			?.map((v) => ({ url: normalizeUrl(v.url) }));

		const productUrl =
			items.seoData.ogInfo['og:url'].length <= 150
				? normalizeUrl(items.seoData.ogInfo['og:url'])
				: `https://www.temu.com/kr/g-${items.goodsData.goodsId}.html`;

		result['item']['shopName'] = 'temu';
		result['item']['title'] = items.goodsData.goodsName;
		result['item']['url'] = productUrl;
		result['item']['original_price'] = items.seoData.ogInfo['product:price:amount'];
		result['item']['price'] = items.seoData.ogInfo['product:price:amount'];
		result['item']['pic_url'] = normalizeUrl(items.goodsData.hdThumbUrl);
		result['item']['num_iid'] = items.goodsData.goodsId.toString();
		result['item']['desc_img'] = items.descData.map((v) => normalizeUrl(v.url));
		result['item']['shop_id'] = 'temu';
		result['item']['item_imgs'] = itemImgs;
	} catch (e) {
		console.error(e);
		return { error: '업데이트 준비 중인 상품입니다.\n다른 상품을 수집해 주세요.' };
	}
	/** 추가속성정보 */
	try {
		for (const v of items.goodsData.goodsProperty) {
			const name = v.key;
			const value = v.values.join(', ');

			result['item']['attr'].push(`${name}:${value}`);
		}
	} catch (e) {
		console.log(`추가속성정보가 없거나 에러가 있습니다.`);
	}

	/** 옵션정보 생성 */
	try {
		// 이미지가 있는 옵션키
		const skuPictureId: string | undefined = items?.controlData?.skuThumbSpecKeyId?.toString();

		if (skuPictureId) {
			for (const sku of items.skuData)
				for (const spec of sku.specs) {
					if (
						spec.specKeyId.toString() === skuPictureId && // 이미지가 있는 옵션이며
						// 이미 추가가 안되어있으면
						!result['item']['prop_imgs']['prop_img'].find(
							(v) => v.properties === `${spec.specKeyId}:${spec.specValueId}`,
						)
					) {
						result['item']['prop_imgs']['prop_img'].push({
							properties: `${spec.specKeyId}:${spec.specValueId}`,
							url: normalizeUrl(sku.thumbUrl),
						});
					}
				}
		} else console.log(`옵션 이미지가 없는 상품입니다.`);

		for (const sku of items.skuData) {
			sku.specs.forEach((v) => {
				if (!result['item']['props_list'].hasOwnProperty(`${v.specKeyId}:${v.specValueId}`))
					result['item']['props_list'][`${v.specKeyId}:${v.specValueId}`] = `${v.specKey}:${v.specValue}`;
			});

			if (sku.stockQuantity <= 0) continue; // 수량없으면 패스

			const properties = sku.specs.map((v) => `${v.specKeyId}:${v.specValueId}`).join(';');
			const properties_name = sku.specs
				.map((v) => `${v.specKeyId}:${v.specValueId}:${v.specKey}:${v.specValue}`)
				.join(';');

			result['item']['skus']['sku'].push({
				sku_id: sku.skuId.toString(),
				price: sku.normalPrice.toString(),
				original_price: sku.normalLinePrice.toString(),
				quantity:
					user.userInfo?.collectStock === 0 ? sku.stockQuantity.toString() : user.userInfo?.collectStock.toString(),
				total_price: 0,
				properties: properties,
				properties_name: properties_name,
			});
		}
	} catch (e) {
		console.log(`옵션정보에 문제가 있습니다.`, e);
		return { error: '업데이트 준비 중인 상품입니다.\n다른 상품을 수집해 주세요.' };
	}

	/** 동영상 생성 */
	try {
		result['item']['video'] = items.goodsData.video.videoUrl;
	} catch (e) {
		console.log('알림: 동영상이 없는 상품입니다. (', e, ')');
	}

	/** 상세설명 생성 */
	try {
		const arr = Array(items.descData.length).fill('');
		const desc_output_tmp = ['<p>', ...arr, '<p>'];
		let desc_html: Document;
		let desc_output;
		let desc_imgs: string[] = [...arr];

		await Promise.all(
			items.descData.map(async (v, i) => {
				if (!v.url && v.url === '') return;
				if (v.url.includes('.gif')) return;
				const url = normalizeUrl(v.url);
				const image = await getImageSize(url);
				if (typeof image === 'number' && image <= 1000) return;

				desc_output_tmp[i + 1] = `<img align="absmiddle" src="${url}">`;
				desc_imgs[i] = url;
			}),
		);

		desc_imgs = desc_imgs.filter((v) => v !== '');
		desc_output = desc_output_tmp.join('');
		desc_html = new DOMParser().parseFromString(desc_output, 'text/html');

		const desc_href = desc_html.querySelectorAll('a');

		for (const i in desc_href) {
			try {
				desc_href[i].remove();
			} catch (e) {
				continue;
			}
		}

		/** 상세설명 텍스트 */
		try {
			for (const v of items.descTextData.floorList) {
				const text: string | undefined = v?.items?.[0]?.text;
				if (text) result['item']['desc_text'].push(text);
			}
		} catch (e) {
			console.log('상세설명 텍스트가 없거나, 오류가있는 상품 입니다.', e);
		}
		// try {
		// 	const iterator = document.createNodeIterator(desc_html.querySelector('body')!, NodeFilter.SHOW_TEXT);
		// 	console.log({ iterator });
		// 	let textnode: Node | null;
		// 	console.log(iterator.nextNode());
		// 	while ((textnode = iterator.nextNode())) {
		// 		const texts = textnode.textContent
		// 			?.split('\n')
		// 			.map((v) => v.trim())
		// 			.filter((v) => v);

		// 		texts?.map((v) => result['item']['desc_text'].push(v));
		// 	}
		// } catch (error) {
		// 	//
		// }

		result['item']['desc_img'] = desc_imgs;
		result['item']['desc'] = desc_output;
	} catch (e) {
		console.log(`상세설명에 문제가 있습니다.`, e);
		return { error: '업데이트 준비 중인 상품입니다.\n다른 상품을 수집해 주세요.' };
	}

	return result;
};

export class temu {
	constructor() {
		checkLogin('temu').then((auth) => {
			if (!auth) return null;
		});
	}

	/** 수집하기 버튼 클릭 시 */
	async get(user: User) {
		sessionStorage.removeItem('sfy-temu-item');

		injectScript('temu');

		let timeout = 0;

		while (true) {
			if (timeout === user.userInfo!.collectTimeout)
				return {
					error: '테무 접속상태가 원활하지 않습니다.\n잠시 후 다시시도해주세요.',
				};

			const data = sessionStorage.getItem('sfy-temu-item');
			if (data) {
				const originalData = JSON.parse(data);

				return await scrape(originalData, user);
			}

			timeout++;

			await sleep(1000 * 1);
		}
	}

	/** SELLFORYOU-CHECKBOX 삽입 함수
	 * 테무에서는 추가로 체크박스에 파라미터를 넣어주어야 보안확인이 안뜨기때문 따로 제작
	 **/
	onInsertDomAtTemu({
		element,
		picker,
		user,
		paramString,
	}: {
		element: Nullable<HTMLAnchorElement>;
		picker: HTMLButtonElement | null;
		user: User;
		paramString: string;
	}) {
		if (!element) return;
		if (!element.href || element.href === '') return;

		const input = Object.assign(document.createElement('input'), {
			className: 'SELLFORYOU-CHECKBOX',
			checked: picker?.value !== 'false',
			type: 'checkbox',
			id: normalizeUrl(element.href) + `?` + paramString,
			style: user.userInfo?.collectCheckPosition === 'L' ? 'left: 0px !important' : 'right: 0px !important',
		});
		input.addEventListener('click', (e) => e.stopPropagation()); // 이벤트버블링 ,캡쳐링 방지
		const sfyBox = element.querySelector('.SELLFORYOU-CHECKBOX');

		// 이미 있으면 id 값만 업데이트
		if (sfyBox) sfyBox.id = input.id;
		else {
			element.style.position = 'relative';
			element.appendChild(input);
		}
	}

	async bulkTypeOne(user: User, shopType: string) {
		const urlParams = new URLSearchParams(window.location.href);
		const _x_sessn_id = urlParams.get('_x_sessn_id')
			? `&_x_sessn_id=${urlParams.get('_x_sessn_id')}`
			: sessionStorage.getItem('x-session-id')
			? `&_x_sessn_id=${sessionStorage.getItem('x-session-id')}`
			: '';
		const search_tmp = document.querySelector('#searchInput') as HTMLInputElement | undefined;
		const search_key = search_tmp?.value ? `&search_key=${search_tmp?.value}` : '';
		const _x_chnl_src = urlParams.get('_x_chnl_src') ? `&_x_chnl_src=${urlParams.get('_x_chnl_src')}` : '';
		const refer_page_el_sn = urlParams.get('refer_page_el_sn')
			? `&refer_page_el_sn=${urlParams.get('refer_page_el_sn')}`
			: '';
		const refer_page_id = urlParams.get('refer_page_id') ? `&refer_page_id=${urlParams.get('refer_page_id')}` : '';
		const refer_page_sn = urlParams.get('refer_page_sn') ? `&refer_page_sn=${urlParams.get('refer_page_sn')}` : '';
		let count = 0;

		switch (shopType) {
			case 'search_result':
			case 'mall':
			case '5-Star Rated':
			case 'best_sellers':
			case 'new_in':
			case 'category': {
				const refer_page_name = `&refer_page_name=${shopType}`;
				const PRODUCT_DIV_CLASSNAME = '[data-tooltip*="goodContainer"]'; // 확인결과 현재 테무 대부분 페이지 상품 div 클래스명은 다음과 같아서 변수로 선언

				while (true) {
					if (count >= 10) break;

					const products = document.querySelectorAll(PRODUCT_DIV_CLASSNAME) as NodeListOf<HTMLDivElement> | undefined;
					// 테무는 체크박스가 삽입되었다가 사라지는 이슈가 있어서 toolBar라는 컴포넌트가 로드된 후 삽입시 체크박스가 안없어짐
					const toolBar = document.querySelector('#mainToolbar') as HTMLDivElement | undefined;

					if (products && products.length > 0 && toolBar) {
						const picker = document.getElementById('sfyPicker') as HTMLButtonElement | null;

						products.forEach((v) => {
							const gallery_url = v.querySelector('img')?.src.replace(/\.jpg.*/, '.jpg');
							const top_gallery_url = gallery_url ? `top_gallery_url=${encodeURIComponent(gallery_url)}` : '';

							this.onInsertDomAtTemu({
								element: v.querySelector('a'),
								picker: picker,
								user: user,
								paramString:
									top_gallery_url +
									_x_sessn_id +
									search_key +
									refer_page_name +
									_x_chnl_src +
									refer_page_el_sn +
									refer_page_id +
									refer_page_sn,
							});
						});

						/** 옵저버 등록 */
						const productsParentBox = document.querySelector(
							shopType === 'search_result' ? '.js-search-goodsList' : '.js-goods-list',
						)?.firstChild;
						const observer = new MutationObserver((e) => {
							const productsParentBox = e.find((v: any) => v.target.className.includes('autoFitList'));
							if (productsParentBox) {
								const picker = document.getElementById('sfyPicker') as HTMLButtonElement | null;
								const target = productsParentBox.target as HTMLElement;
								const anchors = target.querySelectorAll('a');
								anchors?.forEach((anchor) => {
									const gallery_url = anchor.querySelector('img')?.src.replace(/\.jpg.*/, '.jpg');
									const top_gallery_url = gallery_url ? `top_gallery_url=${encodeURIComponent(gallery_url)}` : '';

									this.onInsertDomAtTemu({
										element: anchor,
										picker: picker,
										user: user,
										paramString:
											top_gallery_url +
											_x_sessn_id +
											search_key +
											refer_page_name +
											_x_chnl_src +
											refer_page_el_sn +
											refer_page_id +
											refer_page_sn,
									});
								});
							}
						});
						if (productsParentBox) observer.observe(productsParentBox, { childList: true, subtree: true });

						/** 필터 추가시 동작하는 옵저버 등록 */
						if (shopType === 'category' || shopType === 'search_result') {
							const container = document.querySelector('.contentContainer');
							const observer_2 = new MutationObserver((e) => {
								const picked_e = e.find((v: any) => {
									try {
										return v.target?.querySelectorAll(PRODUCT_DIV_CLASSNAME)?.length > 0;
									} catch (error) {
										//
									}
								});
								const pickedContainer = picked_e?.target as HTMLDivElement | undefined;
								const products = pickedContainer?.querySelectorAll(PRODUCT_DIV_CLASSNAME) as
									| NodeListOf<HTMLDivElement>
									| undefined;
								products?.forEach((v) => {
									const gallery_url = v.querySelector('img')?.src.replace(/\.jpg.*/, '.jpg');
									const top_gallery_url = gallery_url ? `top_gallery_url=${encodeURIComponent(gallery_url)}` : '';

									this.onInsertDomAtTemu({
										element: v.querySelector('a'),
										picker: picker,
										user: user,
										paramString:
											top_gallery_url +
											_x_sessn_id +
											search_key +
											refer_page_name +
											_x_chnl_src +
											refer_page_el_sn +
											refer_page_id +
											refer_page_sn,
									});
								});
							});
							if (container) observer_2.observe(container, { childList: true, subtree: true });
						}

						break;
					}

					await sleep(500);

					count += 0.5;
				}

				break;
			}

			case 'newSale': {
				while (true) {
					const products = document.querySelectorAll('.cardWrap-E76kQ') as NodeListOf<HTMLDivElement> | undefined;
					const toolBar = document.querySelector('#mainToolbar') as HTMLDivElement | undefined;

					if (products && toolBar && products.length > 0) {
						const picker = document.getElementById('sfyPicker') as HTMLButtonElement | null;
						products.forEach((v) => {
							const gallery_url = v.querySelector('img')?.src.replace(/\.jpg.*/, '.jpg');
							const top_gallery_url = gallery_url ? `?top_gallery_url=${encodeURIComponent(gallery_url)}` : '';
							const anchor = v.querySelector('a');

							this.onInsertDomAtTemu({
								element: anchor,
								picker: picker,
								user: user,
								paramString:
									top_gallery_url + refer_page_sn + refer_page_id + _x_sessn_id + refer_page_el_sn + _x_chnl_src,
							});
						});

						break;
					}

					await sleep(500);
					if (count >= 20) break;

					count++;
				}

				break;
			}

			case 'newSale-more': {
				const PRODUCT_DIV_CLASSNAME = '[data-tooltip*="goodContainer"]'; // 확인결과 현재 테무 대부분 페이지 상품 div 클래스명은 다음과 같아서 변수로 선언
				const refer_page_name = `&refer_page_name=star-subject-more`;
				let insertSuccess = 0;

				while (true) {
					if (count >= 10) break;

					const toolBar = document.querySelector('#mainToolbar') as HTMLDivElement | undefined;
					const gridBoxs = document.querySelectorAll('[class*="-goods-list"]') as NodeListOf<HTMLDivElement>;

					// gridBoxes : "추천 ITEM" , "관심 품목 둘러보기"를 의미
					if (gridBoxs.length > 0 && toolBar) {
						//각 그리드를 순회
						for (const gridBox of gridBoxs) {
							const products = gridBox.querySelectorAll(PRODUCT_DIV_CLASSNAME) as NodeListOf<HTMLDivElement>;

							if (products.length > 0) {
								const picker = document.getElementById('sfyPicker') as HTMLButtonElement | null;

								products.forEach((product) => {
									const anchor = product.querySelector('a') as HTMLAnchorElement | undefined;
									const gallery_url = product.querySelector('img')?.src.replace(/\.jpg.*/, '.jpg');
									const top_gallery_url = gallery_url ? `?top_gallery_url=${encodeURIComponent(gallery_url)}` : '';

									this.onInsertDomAtTemu({
										element: anchor,
										picker: picker,
										user: user,
										paramString:
											top_gallery_url +
											refer_page_sn +
											refer_page_id +
											_x_sessn_id +
											refer_page_el_sn +
											_x_chnl_src +
											refer_page_name,
									});
								});

								insertSuccess += 1; // 삽입성공 카운트 증가
							}

							// 옵저버 등록
							const observer = new MutationObserver((e) => {
								const productsParentBox = e.find((v: any) => v.target.className.includes('autoFitList'));
								if (productsParentBox) {
									const picker = document.getElementById('sfyPicker') as HTMLButtonElement | null;
									const target = productsParentBox.target as HTMLElement;
									const products = target.querySelectorAll(PRODUCT_DIV_CLASSNAME) as NodeListOf<HTMLDivElement>;

									products.forEach((v) => {
										const gallery_url = v.querySelector('img')?.src.replace(/\.jpg.*/, '.jpg');
										const top_gallery_url = gallery_url ? `top_gallery_url=${encodeURIComponent(gallery_url)}` : '';

										this.onInsertDomAtTemu({
											element: v.querySelector('a'),
											picker: picker,
											user: user,
											paramString:
												top_gallery_url +
												_x_sessn_id +
												search_key +
												refer_page_name +
												_x_chnl_src +
												refer_page_el_sn +
												refer_page_id +
												refer_page_sn,
										});
									});
								}
							});
							observer.observe(gridBox.firstChild!, { childList: true, subtree: true });
						}
					}

					if (gridBoxs.length > 0 && gridBoxs.length <= insertSuccess) break;
					await sleep(500);

					count += 0.5;
				}

				break;
			}

			default: {
				break;
			}
		}
	}
}
