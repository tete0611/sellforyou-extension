import CryptoJS from 'crypto-js';
import { checkLogin } from './common/auth';
import { form } from './common/data';
import { injectScript } from './common/utils';
import { getCookie, sleep, getImageSize } from '../../../../common/function';
import { sendRuntimeMessage } from '../../Tools/ChromeAsync';
import { User } from '../../../type/schema';
import { captchaInsert } from '../function';

/** 티몰 상품정보 크롤링 */
const scrape = async (items: any, user: User, isBulkProcessing: boolean) => {
	const result = form;
	result.user = user;

	// 페이지별 크롤링 방식 다름
	if (items.pageType === 1) {
		// 상품속성
		const attributes: any = document.querySelectorAll('#J_AttrUL li');

		for (let i in attributes) {
			try {
				const text = attributes[i].textContent.trim();

				if (!text) continue;

				result['item']['attr'].push(text);
			} catch (e) {
				continue;
			}
		}

		if (Object.keys(items.priceInfo).length === 0) {
			console.log('에러: 해당 상품의 가격 정보를 일시적으로 가져오지 못했습니다.');

			return {
				error: '해당 상품의 가격 정보를 일시적으로 가져오지 못했습니다.',
			};
		}

		// 썸네일이미지
		let thumnails: string[] = [];

		if (items.propertyPics) thumnails = items.propertyPics.default;
		else {
			const imgs = document.querySelectorAll('#J_UlThumb img') as NodeListOf<HTMLImageElement>;

			for (let i in imgs) {
				try {
					const img = imgs[i].getAttribute('src')?.replace(/_[0-9]+x[0-9]+q[0-9]+.[a-zA-Z]+/, '');
					if (!img) continue;
					const img_fixed = /^https?:/.test(img) ? img : 'http:' + img;

					thumnails.push(img_fixed);
				} catch (e) {
					continue;
				}
			}
		}

		// 상세페이지
		let desc_html = new DOMParser().parseFromString(items.desc, 'text/html');
		let desc = desc_html.querySelectorAll('html > body img') as NodeListOf<HTMLImageElement>;
		let desc_imgs: string[] = [];

		for (let i in desc) {
			try {
				if (desc[i].src) {
					if (desc[i].src.includes('.gif')) desc[i].parentNode?.removeChild(desc[i]);
					else {
						const image: number | string = await getImageSize(desc[i].src); //해당 이미지 사이즈가 100x100 이하 제거
						if (typeof image === 'number' && image <= 1000)
							desc[i].parentNode?.removeChild(desc[i]); // 흰색 이미지 제거
						else {
							desc[i].src = desc[i].src;
							desc_imgs.push(desc[i].src);
						}
					}
				}
			} catch (e) {
				continue;
			}
		}

		let desc_href = desc_html.querySelectorAll('a');

		for (let i in desc_href) {
			try {
				desc_href[i].remove();
			} catch (e) {
				continue;
			}
		}
		let desc_output = desc_html.querySelector('html > body')?.innerHTML;

		// 배송비
		let shipping_info = items.delivery?.deliverySkuMap?.default[0]?.postage ?? '0.0';
		let shipping_fee = 0.0;
		let temp = shipping_info.split(' ');

		for (let i = 0; i < temp.length; i++) {
			if (temp[i - 1] === 'EMS:' || isNaN(parseFloat(temp[i]))) continue;

			shipping_fee = parseFloat(temp[i]);
		}

		// 상세페이지 텍스트
		let iterator = document.createNodeIterator(desc_html.querySelector('html > body')!, NodeFilter.SHOW_TEXT);
		let textnode;

		while ((textnode = iterator.nextNode())) {
			const texts = textnode.textContent
				.split('\n')
				.map((v) => v.trim())
				.filter((v) => v);

			texts.map((v) => result['item']['desc_text'].push(v));
		}

		const price = shipping_fee > 0 ? (parseFloat(items.buyPrice.min) + shipping_fee).toString() : items.buyPrice.min;

		if (thumnails.length === 0) return { error: '대표 이미지를 찾을 수 없습니다.' };

		// 상품 기본정보
		result['item']['shopName'] = 'tmall';
		result['item']['url'] = `https://detail.tmall.com/item.htm?id=${items.itemDO.itemId}`;
		result['item']['num_iid'] = items.itemDO.itemId;
		result['item']['title'] = items.itemDO.title;
		result['item']['price'] = price;
		result['item']['pic_url'] = thumnails[0];
		result['item']['desc'] = desc_output ?? '';
		result['item']['desc_img'] = desc_imgs;
		result['item']['tmall'] = true;
		result['item']['post_fee'] = shipping_fee;
		result['item']['shop_id'] = 'tmall';

		// 동영상
		try {
			let video = items.itemDO.imgVedioUrl.replace(
				/(\/\/cloud\.video\.taobao\.com\/play\/u\/\d+\/p\/\d+\/e\/)\d+(\/t\/)\d+(.+)swf/,
				'$16$21$3mp4',
			);

			result['item']['video'] = video;
		} catch (e) {
			console.log('알림: 동영상이 없는 상품입니다. (', e, ')');
		}

		// 썸네일이미지
		try {
			for (let i in thumnails) {
				try {
					result['item']['item_imgs'].push({
						url: thumnails[i],
					});
				} catch (e) {
					continue;
				}
			}
		} catch (e) {
			console.log('에러: 대표 이미지를 찾을 수 없습니다. (', e, ')');

			return { error: '대표 이미지를 찾을 수 없습니다.' };
		}

		// 썸네일이미지
		for (let i in items.propertyPics) {
			if (i !== 'default')
				result['item']['prop_imgs']['prop_img'].push({
					properties: i.replaceAll(';', ''),
					url: /^https?:/.test(items.propertyPics[i][0])
						? items.propertyPics[i][0]
						: 'http:' + items.propertyPics[i][0],
				});
		}

		// 옵션정보
		let skus = document.querySelectorAll(
			'#J_DetailMeta > div.tm-clear > div.tb-property > div > div.tb-key > div > div li',
		);

		for (let i in skus) {
			try {
				let code: any = skus[i].getAttribute('data-value');
				let code_split = code.split(':');

				result['item']['props_list'][code] = items.skuProp[code_split[0]][code_split[1]].info;
			} catch (e) {
				continue;
			}
		}

		try {
			for (let i in items.skuMap) {
				let properties = i.split(';');
				let properties_id = '';
				let properties_name = '';

				for (let j = 1; j < properties.length; j++) {
					if (j < properties.length - 1) {
						properties_id += properties[j];
						properties_name += properties[j] + ':' + result['item']['props_list'][properties[j]];
					}
					if (j < properties.length - 2) {
						properties_id += ';';
						properties_name += ';';
					}
				}

				if (result['item']['props_list'][properties[1]] !== undefined) {
					if (items.inventory.skuQuantity.hasOwnProperty(items.skuMap[i].skuId)) {
						let quantity = items.inventory.skuQuantity[items.skuMap[i].skuId].quantity.toString();

						if (quantity !== '0') {
							let promotion_price = items.priceInfo[items.skuMap[i].skuId].promotionList
								? items.priceInfo[items.skuMap[i].skuId].promotionList[0].price
								: items.priceInfo[items.skuMap[i].skuId].price;

							result['item']['skus']['sku'].push({
								price: shipping_fee > 0 ? (parseFloat(promotion_price) + shipping_fee).toString() : promotion_price,
								total_price: 0,
								original_price: items.priceInfo[items.skuMap[i].skuId].price,
								properties: properties_id,
								properties_name: properties_name,
								quantity:
									user.userInfo!.collectStock === 0
										? quantity > 99999
											? '99999'
											: quantity.toString()
										: user.userInfo!.collectStock.toString(),
								sku_id: items.skuMap[i].skuId,
							});
						}
					}
				}
			}
		} catch (e) {
			console.log('에러: 옵션 세부정보를 가져오지 못했습니다. (', e, ')');

			return { error: '옵션 세부정보를 가져오지 못했습니다.' };
		}

		// 판매가격 최저가 산정
		let min_price = parseFloat(result['item']['price']);

		for (let i in result['item']['skus']['sku']) {
			if (i === '0') {
				min_price = parseFloat(result['item']['skus']['sku'][i]['price']);

				continue;
			}

			let cur_price = parseFloat(result['item']['skus']['sku'][i]['price']);

			if (min_price > cur_price) min_price = cur_price;
		}

		if (parseFloat(result['item']['price']) !== min_price) result['item']['price'] = min_price.toString();
		if (Object.keys(result.item.props_list).length > 0 && result.item.skus.sku.length === 0) {
			console.log('에러: 해당 상품은 일시적으로 품절되었습니다.');

			return { error: '해당 상품은 일시적으로 품절되었습니다.' };
		}

		/** 페이지타입 2 */
	} else {
		const params = new Proxy(new URLSearchParams(window.location.search), {
			get: (searchParams: any, prop) => searchParams.get(prop),
		});

		// 티몰 상품정보 조회 API
		const isHkUrl = window.location.href.includes('detail.tmall.hk');
		const appKey = '12574478';
		const time1 = new Date().getTime();
		const token = getCookie('_m_h5_tk').split('_')[0];
		const data1 = `{\"id\":\"${params.id}\",\"detail_v\":\"3.3.2\",\"exParams\":\"{\\\"queryParams\\\":\\\"id=${params.id}\\\",\\\"id\\\":\\\"${params.id}\\\"}\"}`;
		const text1 = token + '&' + time1 + '&' + appKey + '&' + data1;
		const sign1 = CryptoJS.MD5(text1).toString();
		const dataUrl = `https://h5api.m.tmall.${
			isHkUrl ? 'hk' : 'com'
		}/h5/mtop.taobao.pcdetail.data.get/1.0/?jsv=2.6.1&appKey=${appKey}&t=${time1}&sign=${sign1}&api=mtop.taobao.pcdetail.data.get&v=1.0&ttid=2022%40taobao_litepc_9.20.0&isSec=0&ecode=0&AntiFlood=true&AntiCreep=true&H5Request=true&type=json&dataType=json&data=${encodeURI(
			data1,
		)}`;
		const dataResp = await fetch(dataUrl, { credentials: 'include' });
		const dataJson = await dataResp.json();

		// 티몰 상품상세설명 조회 API
		const time2 = new Date().getTime();
		const data2 = `{\"id\":\"${params.id}\",\"detail_v\":\"3.3.0\",\"preferWireless\":\"true\"}`; //여기가 변경되서 안되었던거임 preferWireless 추가됨
		const text2 = token + '&' + time2 + '&' + appKey + '&' + data2;
		const sign2 = CryptoJS.MD5(text2).toString();
		const descUrl = `https://h5api.m.tmall.com/h5/mtop.taobao.detail.getdesc/7.0/?jsv=2.7.0&appKey=${appKey}&t=${time2}&sign=${sign2}&api=mtop.taobao.detail.getdesc&v=7.0&isSec=0&ecode=0&AntiFlood=true&AntiCreep=true&H5Request=true&timeout=3000&ttid=2022%40tmall_litepc_9.17.0&type=json&dataType=json&data=${encodeURI(
			data2,
		)}`;

		// let descText: any = await fetch(descUrl, { credentials: "include" });
		const descText = await sendRuntimeMessage<string>({
			action: 'fetch',
			form: { url: descUrl },
		});
		// let descJson = JSON.parse(descText.split("mtopjsonp1(")[1].slice(0, -1)); 이거 너무오래걸려서 위에 api로 쏴보니 data2변경해서 잘됨
		const descJson = JSON.parse(descText ?? '');

		// api로 상세이미지 불러올때 트래픽 tmall에서 감지되면 드래그 해줘야하기 때문에 , 사용자가 드래그할수있도록 해당 url도 띄여주어야함 그래야 수집됨
		if (descJson.data.url !== undefined || !dataJson?.data?.item) {
			if (isBulkProcessing) {
				captchaInsert();
				window.open(descJson.data.url);
			} else return { error: 'Captcha 완료후 새로고침 해주세요.' };
		}

		const thumnails: string[] | undefined = dataJson.data.item?.images?.filter(
			(v) => v.includes('http://') || v.includes('https://'),
		);

		if (!thumnails || thumnails?.length === 0) return { error: '대표 이미지를 찾을 수 없습니다.' };

		let desc_html: Document;
		let desc_output: string;
		let desc_imgs: string[] = [];

		// api return type이 소싱처별로 2개씩 있음
		// 1번 타입)
		if (descJson?.data?.components?.componentData?.desc_richtext_pc === undefined) {
			let componentData: object | undefined = descJson?.data?.components?.componentData;
			let layout: { ID: string; key: string }[] | undefined = descJson?.data?.components?.layout;

			if (!layout || !componentData) return { error: '상세이미지 파싱 에러' };

			const arr = Array(layout.length).fill('');
			const desc_output_tmp = ['<p>', ...arr, '</p>'];
			desc_imgs = [...arr];

			await Promise.all(
				layout.map(async (v, i) => {
					let url = componentData?.[v.ID]?.model?.picUrl;
					if (url === undefined) return null;
					if (url.includes('.gif')) return null;
					if (!url.includes('http')) url = 'https:' + url;
					const image = await getImageSize(url);
					if (typeof image === 'number' && image <= 1000) return null;
					desc_output_tmp[i + 1] = `<img align="absmiddle" src="${url}">`;
					desc_imgs[i] = url;
				}),
			);

			desc_imgs = desc_imgs.filter((v) => v !== '');
			desc_output = desc_output_tmp.join('');
			desc_html = new DOMParser().parseFromString(desc_output, 'text/html');

			// 2번 타입)
		} else {
			desc_html = new DOMParser().parseFromString(
				descJson.data.components?.componentData?.desc_richtext_pc?.model?.text,
				'text/html',
			); //돔 생성
			let desc = desc_html?.querySelectorAll('img');

			// TODO 추후 병렬처리 필요
			// desc_imgs = [...Array(desc.length).fill('')];
			// await Promise.all([
			// 	desc.forEach(async (v, i) => {
			// 		try {
			// 			if (v.getAttribute('data-src')) desc[i].src = v.getAttribute('data-src')!;
			// 			if (v.src) {
			// 				if (v.src.includes('.gif')) desc[i].parentNode?.removeChild(v);
			// 				else {
			// 					const image = await getImageSize(v.src); //해당 이미지 사이즈가 100x100 이하 제거
			// 					if (typeof image === 'number' && image <= 1000) desc[i].parentNode?.removeChild(v);
			// 					else {
			// 						desc[i].src = v.src;
			// 						desc_imgs[i] = v.src;
			// 					}
			// 				}
			// 			}
			// 		} catch (error) {}
			// 	}),
			// ]);

			for (let i in desc) {
				try {
					if (desc[i].getAttribute('data-src')) desc[i].src = desc[i].getAttribute('data-src')!;
					if (desc[i].src) {
						if (desc[i].src.includes('.gif')) desc[i].parentNode?.removeChild(desc[i]);
						else {
							const image = await getImageSize(desc[i].src); //해당 이미지 사이즈가 100x100 이하 제거
							if (typeof image === 'number' && image <= 1000) desc[i].parentNode?.removeChild(desc[i]);
							else {
								desc[i].src = desc[i].src;
								desc_imgs.push(desc[i].src);
							}
						}
					}
				} catch (e) {
					continue;
				}
			}
			let desc_href = desc_html.querySelectorAll('a');

			for (let i in desc_href) {
				try {
					desc_href[i].remove();
				} catch (e) {
					continue;
				}
			}

			desc_output = desc_html.querySelector('html > body')?.innerHTML ?? ''; //우선 해당 변수 사용안함 원래 desc에 들어가야함
		}

		let shipping_fee = 0.0;
		let iterator = document.createNodeIterator(desc_html.querySelector('body')!, NodeFilter.SHOW_TEXT);
		let textnode;

		while ((textnode = iterator.nextNode())) {
			const texts = textnode.textContent
				.split('\n')
				.map((v) => v.trim())
				.filter((v) => v);

			texts.map((v) => result['item']['desc_text'].push(v));
		}

		const price =
			shipping_fee > 0
				? (parseFloat(dataJson.data.componentsVO.priceVO.price.priceText) + shipping_fee).toString()
				: dataJson.data.componentsVO.priceVO.price.priceText;

		result['item']['shopName'] = 'tmall';
		result['item']['url'] = `https://detail.tmall.com/item.htm?id=${params.id}`;
		result['item']['num_iid'] = params.id;
		result['item']['title'] = dataJson.data.componentsVO.titleVO.title.title;
		result['item']['price'] = price;
		result['item']['pic_url'] = thumnails[0];
		result['item']['desc'] = desc_output;
		result['item']['desc_img'] = desc_imgs;
		result['item']['tmall'] = true;
		result['item']['post_fee'] = shipping_fee;
		result['item']['shop_id'] = 'tmall';

		try {
			result['item']['video'] = dataJson.data.componentsVO.headImageVO.videos[0].url;
		} catch (e) {
			console.log('알림: 동영상이 없는 상품입니다. (', e, ')');
		}

		try {
			for (let i in thumnails) {
				try {
					result['item']['item_imgs'].push({
						url: thumnails[i],
					});
				} catch (e) {
					continue;
				}
			}
		} catch (e) {
			console.log('에러: 대표 이미지를 찾을 수 없습니다. (', e, ')');

			return { error: '대표 이미지를 찾을 수 없습니다.' };
		}

		for (let i in dataJson.data.skuBase.props) {
			for (let j in dataJson.data.skuBase.props[i].values) {
				let prop_properties = dataJson.data.skuBase.props[i].pid + ':' + dataJson.data.skuBase.props[i].values[j].vid;
				let prop_names = dataJson.data.skuBase.props[i].name + ':' + dataJson.data.skuBase.props[i].values[j].name;

				if (dataJson.data.skuBase.props[i].values[j].image)
					result['item']['prop_imgs']['prop_img'].push({
						properties: prop_properties,
						url: /^https?:/.test(dataJson.data.skuBase.props[i].values[j].image)
							? dataJson.data.skuBase.props[i].values[j].image
							: 'http:' + dataJson.data.skuBase.props[i].values[j].image,
					});

				result['item']['props_list'][prop_properties] = prop_names;
			}
		}

		try {
			for (let i in dataJson.data.skuBase.skus) {
				let properties = dataJson.data.skuBase.skus[i].propPath.split(';');
				let properties_name = '';

				for (let j = 0; j < properties.length; j++) {
					if (j < properties.length)
						properties_name += properties[j] + ':' + result['item']['props_list'][properties[j]];
					if (j < properties.length - 1) properties_name += ';';
				}

				if (result['item']['props_list'][properties[0]] !== undefined) {
					let skuId = dataJson.data.skuBase.skus[i].skuId;

					if (dataJson.data.skuCore.sku2info.hasOwnProperty(skuId)) {
						let quantity = dataJson.data.skuCore.sku2info[skuId].quantity;

						if (quantity !== '0') {
							let promotion_price = dataJson.data.skuCore.sku2info[skuId].price.priceText;

							result['item']['skus']['sku'].push({
								price: shipping_fee > 0 ? (parseFloat(promotion_price) + shipping_fee).toString() : promotion_price,
								total_price: 0,
								original_price:
									shipping_fee > 0 ? (parseFloat(promotion_price) + shipping_fee).toString() : promotion_price,
								properties: dataJson.data.skuBase.skus[i].propPath,
								properties_name: properties_name,
								quantity:
									user.userInfo!.collectStock === 0
										? quantity > 99999
											? '99999'
											: quantity.toString()
										: user.userInfo!.collectStock.toString(),
								sku_id: skuId,
							});
						}
					}
				}
			}
		} catch (e) {
			console.log('에러: 옵션 세부정보를 가져오지 못했습니다. (', e, ')');

			return { error: '옵션 세부정보를 가져오지 못했습니다.' };
		}

		let min_price = parseFloat(result['item']['price']);

		for (let i in result['item']['skus']['sku']) {
			if (i === '0') {
				min_price = parseFloat(result['item']['skus']['sku'][i]['price']);

				continue;
			}

			let cur_price = parseFloat(result['item']['skus']['sku'][i]['price']);

			if (min_price > cur_price) min_price = cur_price;
		}

		if (parseFloat(result['item']['price']) !== min_price) result['item']['price'] = min_price.toString();
		if (Object.keys(result.item.props_list).length > 0 && result.item.skus.sku.length === 0) {
			console.log('에러: 해당 상품은 일시적으로 품절되었습니다.');

			return { error: '해당 상품은 일시적으로 품절되었습니다.' };
		}
	}

	return result;
};

export class tmall {
	constructor() {
		checkLogin('tmall').then((auth) => {
			if (!auth) return null;
		});
	}

	async get(user: User, isBulkProcessing: boolean) {
		sessionStorage.removeItem('sfy-tmall-item');

		injectScript('tmall');

		let timeout = 0;

		while (true) {
			if (timeout === user.userInfo!.collectTimeout)
				return {
					error: '티몰 접속상태가 원활하지 않습니다.\n잠시 후 다시시도해주세요.',
				};

			let data = sessionStorage.getItem('sfy-tmall-item');

			if (data) {
				let originalData = JSON.parse(data);

				if (originalData.pageType === 1 && originalData.descUrl) {
					let desc = await sendRuntimeMessage<string>({
						action: 'fetch',
						form: { url: originalData.descUrl },
					});

					if (!desc) {
						timeout = user.userInfo!.collectTimeout;

						continue;
					}

					originalData.desc = desc.slice(10, desc.length - 2);
				}

				console.log(originalData);

				return await scrape(originalData, user, isBulkProcessing);
			}

			timeout++;

			await sleep(1000 * 1);
		}
	}

	async bulkTypeOne(user) {
		document.addEventListener('DOMNodeInserted', (e: any) => {
			try {
				if (e.target.getAttribute('class') === 'relKeyTop') {
					let links: any = document.querySelectorAll('#J_ItemList a');

					for (let i in links) {
						try {
							if (links[i].getAttribute('class') === 'productImg') {
								let input: any = document.createElement('input');
								let picker: any = document.getElementById('sfyPicker');

								input.id = links[i].getAttribute('href');
								input.className = 'SELLFORYOU-CHECKBOX';
								input.checked = picker?.value === 'false' ? false : true;
								input.type = 'checkbox';

								if (user.userInfo.collectCheckPosition === 'L') input.setAttribute('style', 'left: 0px !important');
								else input.setAttribute('style', 'right: 0px !important');

								links[i].parentNode.insertBefore(input, links[i].nextSibling);
							}
						} catch (e) {
							console.log(e);
						}
					}

					return;
				}
			} catch (e) {
				//
			}
		});
	}

	async bulkTypeTwo(user) {
		let timeout = 0;

		while (true) {
			if (timeout === 10) return 0;

			let count = 0;
			let lines = document.querySelectorAll('div');

			for (let i = 0; i < lines.length - 1; i++) {
				if (lines[i].getAttribute('class') === 'pagination') break;
				if (/item[2-9]line[0-9]/.test(lines[i]?.getAttribute('class') ?? '')) {
					let links: any = lines[i].querySelectorAll('a');

					for (let j = 0; j < links.length - 1; j++) {
						let image = links[j].querySelector('img');

						if (!image) continue;

						let input: any = document.createElement('input');
						let picker: any = document.getElementById('sfyPicker');
						input.id = links[j].getAttribute('href');
						input.className = 'SELLFORYOU-CHECKBOX';
						input.checked = picker?.value === 'false' ? false : true;
						input.type = 'checkbox';

						if (user.userInfo.collectCheckPosition === 'L') input.setAttribute('style', 'left: 0px !important');
						else input.setAttribute('style', 'right: 0px !important');

						links[j].parentNode.style.position = 'relative';
						links[j].parentNode.insertBefore(input, links[j].nextSibling);

						count++;
					}
				}
			}

			if (count > 0) return count;

			await sleep(1000 * 1);

			timeout++;
		}
	}
}
