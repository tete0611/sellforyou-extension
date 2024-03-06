import { getImageSize, normalizeUrl, onInsertDom, sleep } from '../../../../common/function';
import { User } from '../../../type/schema';
import { form } from './common/data';
import { injectScript } from './common/utils';

/** 테무 상품정보 크롤링 */
const scrape = async (items: any, user: User) => {
	const result = form;
	result.user = user;

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
		return { error: '상품정보에 문제가 있습니다.' };
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
		return { error: '옵션정보에 문제가 있습니다.' };
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
		console.log({ desc_html });

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
		return { error: '상세설명에 문제가 있습니다.' };
	}

	console.log({ result });

	return result;
};

export class temu {
	constructor() {
		// 추후 필요시 구현
		// checkLogin('pinduoduo').then((auth)=> {
		//   if(!auth) return null;
		// })
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
				console.log({ originalData });

				return await scrape(originalData, user);
			}

			timeout++;

			await sleep(1000 * 1);
		}
	}

	async bulkTypeOne(user: User) {
		window.addEventListener('DOMContentLoaded', () => {
			'모두로드댐';
		});

		while (true) {
			const container = document.querySelector('.js-search-goodsList');
			const products =
				(container?.querySelectorAll('._3GizL2ou') as NodeListOf<HTMLDivElement> | undefined) ??
				(container?.firstChild?.childNodes as NodeListOf<HTMLDivElement> | undefined);

			if (products) {
				const picker = document.getElementById('sfyPicker') as HTMLButtonElement | null;
				products.forEach((v) => {
					const anchor = v.querySelector('a');

					onInsertDom({ element: anchor, picker: picker, user: user });
				});

				break;
			}

			await sleep(500);
		}
	}
}
