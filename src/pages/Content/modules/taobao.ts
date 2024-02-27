import CryptoJS from 'crypto-js';
import html2canvas from 'html2canvas';
import { checkLogin } from './common/auth';
import { form } from './common/data';
import { injectScript } from './common/utils';
import { sleep, getImageSize, getCookie, onInsertDom } from '../../../../common/function';
import { Buffer } from 'buffer';
import { sendRuntimeMessage } from '../../Tools/ChromeAsync';
import { User } from '../../../type/schema';
import { captchaInsert } from '../function';

const iconv = require('iconv-lite');

/** 타오바오 상품정보 크롤링 */
const scrape = async (items: any, user: User, isBulkProcessing: boolean) => {
	let result = form;
	result.user = user;

	/** 페이지별 크롤링 방식 다름 */
	// 페이지 타입 : 2
	if (items.pageType === 2) {
		const params = new Proxy(new URLSearchParams(window.location.search), {
			get: (searchParams: any, prop) => searchParams.get(prop),
		});
		const appKey = '12574478';
		const tokenFull = getCookie('_m_h5_tk');
		const token = tokenFull.split('_')[0];
		const time1 = new Date().getTime();
		const data1 = `{\"id\":\"${params.id}\",\"detail_v\":\"3.3.2\",\"exParams\":\"{\\\"queryParams\\\":\\\"id=${params.id}\\\",\\\"id\\\":\\\"${params.id}\\\"}\"}`;
		const text1 = token + '&' + time1 + '&' + appKey + '&' + data1;
		const sign1 = CryptoJS.MD5(text1).toString();

		/** 타오바오 상품정보 조회 API */
		const dataUrl = `https://h5api.m.taobao.com/h5/mtop.taobao.pcdetail.data.get/1.0/?jsv=2.6.1&appKey=${appKey}&t=${time1}&sign=${sign1}&api=mtop.taobao.pcdetail.data.get&v=1.0&isSec=0&ecode=0&timeout=10000&ttid=2022%40taobao_litepc_9.17.0&AntiFlood=true&AntiCreep=true&dataType=json&valueType=string&preventFallback=true&type=json&data=${encodeURI(
			data1,
		)}`;

		const dataResp = await fetch(dataUrl, { credentials: 'include' });
		const dataJson = await dataResp.json();
		const thumnails = dataJson.data.item?.images?.filter((v) => v.includes('http://') || v.includes('https://')) as
			| string[]
			| undefined;

		const time2 = new Date().getTime();
		const data2 = `{\"id\":\"${params.id}\",\"detail_v\":\"3.3.0\",\"preferWireless\":\"true\"}`; //여기가 변경되서 안되었던거임 preferWireless 추가됨
		const text2 = token + '&' + time1 + '&' + appKey + '&' + data1;
		const sign2 = CryptoJS.MD5(text2).toString();

		/** 타오바오 상품상세설명 조회 API */
		const descUrl = `https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdesc/7.0/?jsv=2.7.0&appKey=${appKey}&t=${time2}&sign=${sign2}&api=mtop.taobao.detail.getdesc&v=7.0&isSec=0&ecode=0&AntiFlood=true&AntiCreep=true&H5Request=true&timeout=3000&ttid=2022%40tmall_litepc_9.17.0&type=json&dataType=json&data=${encodeURI(
			data2,
		)}`;

		let descText = await sendRuntimeMessage<string>({
			action: 'fetch',
			form: { url: descUrl },
		});

		let descJson = JSON.parse(descText ?? '');

		if (descJson.data.url !== undefined) {
			if (isBulkProcessing) {
				captchaInsert();
				window.open(descJson.data.url);
				throw new Error('Captcha 보안확인 감지');
			} else return { error: 'Captcha 완료후 새로고침 해주세요.' };
		}

		let desc_html: Document;
		let desc_output;
		let desc_imgs: string[] = [];

		// api return type이 소싱처별로 2개씩 있음
		if (descJson.data.components.componentData.desc_richtext_pc === undefined) {
			let componentData: object | undefined = descJson.data.components.componentData;
			let layout: { ID: string; key: string }[] | undefined = descJson.data.components.layout;

			if (!layout || !componentData) return { error: '상세이미지 파싱 에러' };

			const arr = Array(layout.length).fill('');
			const desc_output_tmp = ['<p>', ...arr, '</p>'];
			desc_imgs = [...arr];

			// desc_output = '<p>';

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

			/** for문 (구 방식) */
			// for (const v of layout) {
			// 	let url = componentData[v.ID]?.model?.picUrl;
			// 	if (url === undefined) continue;
			// 	if (url.includes('.gif')) continue;
			// 	if (!url.includes('http')) url = 'https:' + url;
			// 	const image = await getImageSize(url);
			// 	if (typeof image === 'number' && image <= 1000) continue;
			// 	desc_output += `<img align="absmiddle" src="${url}">`;
			// 	desc_imgs.push(url);
			// }

			desc_imgs = desc_imgs.filter((v) => v !== '');
			desc_output = desc_output_tmp.join('');
			desc_html = new DOMParser().parseFromString(desc_output, 'text/html');

			// 2번 타입)
		} else {
			desc_html = new DOMParser().parseFromString(
				descJson.data.components?.componentData.desc_richtext_pc.model.text,
				'text/html',
			); //돔 생성
			const desc = desc_html?.querySelectorAll('img');
			desc_imgs = [...Array(desc.length).fill('')];

			/** 병렬처리 */
			await Promise.all(
				Array.from(desc).map(async (v, i) => {
					try {
						if (v.getAttribute('data-src')) desc[i].src = v.getAttribute('data-src')!;
						if (v.src) {
							if (v.src.includes('.gif')) desc[i].parentNode?.removeChild(v);
							else {
								const image = await getImageSize(v.src); //해당 이미지 사이즈가 100x100 이하 제거
								if (typeof image === 'number' && image <= 1000) {
									desc[i].parentNode?.removeChild(v);
								} else {
									desc[i].src = v.src;
									desc_imgs[i] = v.src;
								}
							}
						}
					} catch (error) {
						console.error(error);
					}
				}),
			);

			desc_imgs = desc_imgs.filter((v) => v !== '');

			/** for문 사용 (구 방식) */
			// for (let i in desc) {
			// 	try {
			// 		if (desc[i].getAttribute('data-src')) desc[i].src = desc[i].getAttribute('data-src')!;
			// 		if (desc[i].src) {
			// 			if (desc[i].src.includes('.gif')) desc[i].parentNode?.removeChild(desc[i]);
			// 			else {
			// 				const image = await getImageSize(desc[i].src); //해당 이미지 사이즈가 100x100 이하 제거
			// 				if (typeof image === 'number' && image <= 1000) {
			// 					desc[i].parentNode?.removeChild(desc[i]);
			// 				} else {
			// 					desc[i].src = desc[i].src;
			// 					desc_imgs.push(desc[i].src);
			// 				}
			// 			}
			// 		}
			// 	} catch (e) {
			// 		continue;
			// 	}
			// }
			const desc_href = desc_html.querySelectorAll('a');

			for (const i in desc_href) {
				try {
					desc_href[i].remove();
				} catch (e) {
					continue;
				}
			}

			desc_output = desc_html.querySelector('html > body')?.innerHTML; //우선 해당 변수 사용안함 원래 desc에 들어가야함
		}
		const shipping_fee = 0.0;
		const iterator = document.createNodeIterator(desc_html.querySelector('body')!, NodeFilter.SHOW_TEXT);
		let textnode;

		while ((textnode = iterator.nextNode())) {
			const texts = textnode.textContent
				.split('\n')
				.map((v) => v.trim())
				.filter((v) => v);

			texts.map((v) => result['item']['desc_text'].push(v));
		}

		if (!thumnails || thumnails?.length < 1) return { error: `대표 이미지를 찾을 수 없습니다.` };

		const price =
			shipping_fee > 0
				? (parseFloat(dataJson.data.componentsVO.priceVO.price.priceText) + shipping_fee).toString()
				: dataJson.data.componentsVO.priceVO.price.priceText;

		/** 최종 result 조합 */
		result['item']['shopName'] = 'taobao';
		result['item']['url'] = `https://item.taobao.com/item.htm?id=${params.id}`;
		result['item']['num_iid'] = params.id;
		result['item']['title'] = dataJson.data.componentsVO.titleVO.title.title;
		result['item']['price'] = price;
		result['item']['pic_url'] = thumnails[0];
		result['item']['desc'] = desc_output;
		result['item']['desc_img'] = desc_imgs;
		// result['item']['tmall'] = true;
		result['item']['post_fee'] = shipping_fee;
		result['item']['shop_id'] = 'taobao';

		try {
			result['item']['video'] = dataJson.data.componentsVO.headImageVO.videos[0].url;
		} catch (e) {
			console.log('알림: 동영상이 없는 상품입니다. (', e, ')');
		}
		try {
			if (!thumnails.length) throw new Error('대표 이미지를 찾을 수 없습니다.');
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

		/** 옵션 조합 */
		for (const i in dataJson.data.skuBase.props) {
			for (const j in dataJson.data.skuBase.props[i].values) {
				const prop_properties = dataJson.data.skuBase.props[i].pid + ':' + dataJson.data.skuBase.props[i].values[j].vid;
				const prop_names = dataJson.data.skuBase.props[i].name + ':' + dataJson.data.skuBase.props[i].values[j].name;

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

		/** 옵션 조합 */
		try {
			for (const i in dataJson.data.skuBase.skus) {
				const properties = dataJson.data.skuBase.skus[i].propPath.split(';');
				let properties_name = '';

				for (let j = 0; j < properties.length; j++) {
					if (j < properties.length)
						properties_name += properties[j] + ':' + result['item']['props_list'][properties[j]];
					if (j < properties.length - 1) properties_name += ';';
				}

				if (result['item']['props_list'][properties[0]] !== undefined) {
					const skuId = dataJson.data.skuBase.skus[i].skuId;

					if (dataJson.data.skuCore.sku2info.hasOwnProperty(skuId)) {
						const quantity = dataJson.data.skuCore.sku2info[skuId].quantity;

						if (quantity !== '0') {
							const promotion_price = dataJson.data.skuCore.sku2info[skuId].price.priceText;

							result['item']['skus']['sku'].push({
								price: shipping_fee > 0 ? (parseFloat(promotion_price) + shipping_fee).toString() : promotion_price,
								total_price: 0,
								original_price:
									shipping_fee > 0 ? (parseFloat(promotion_price) + shipping_fee).toString() : promotion_price,
								properties: dataJson.data.skuBase.skus[i].propPath,
								properties_name: properties_name,
								quantity:
									user.userInfo?.collectStock === 0
										? quantity > 99999
											? '99999'
											: quantity.toString()
										: user.userInfo?.collectStock.toString(),
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

		for (const i in result['item']['skus']['sku']) {
			if (i === '0') {
				min_price = parseFloat(result['item']['skus']['sku'][i]['price']);

				continue;
			}

			const cur_price = parseFloat(result['item']['skus']['sku'][i]['price']);

			if (min_price > cur_price) min_price = cur_price;
		}

		if (parseFloat(result['item']['price']) !== min_price) result['item']['price'] = min_price.toString();
		if (Object.keys(result.item.props_list).length > 0 && result.item.skus.sku.length === 0) {
			console.log('에러: 해당 상품은 일시적으로 품절되었습니다.');

			return { error: '해당 상품은 일시적으로 품절되었습니다.' };
		}

		return result;
		/** 페이지타입이 2가 아님 */
	} else {
		// 상품속성
		const attributes = document.getElementsByClassName('attributes-list')[0].querySelectorAll('li');

		for (const i in attributes) {
			try {
				const text = attributes[i].textContent?.trim();

				if (!text) continue;

				result['item']['attr'].push(text);
			} catch (e) {
				continue;
			}
		}

		const details = items.price;
		const configs = items.config;
		const script_video = items.video;
		const script_option = items.sku.valItemInfo.skuMap;
		let price;

		// 판매가
		try {
			if (details.promotion.promoData.def[0].price.includes('-'))
				price = details.promotion.promoData.def[0].price.split('-')[0];
			else price = details.promotion.promoData.def[0].price;
		} catch (e) {
			console.log('알림: 프로모션 가격 정보를 가져오지 못했습니다. 기본 가격으로 수집됩니다. (', e, ')');
			if (details.price.includes('-')) price = details.price.split('-')[0];
			else price = details.price;
		}

		// 배송비
		const shipping_info = details.deliveryFee
			? details.deliveryFee.data.serviceInfo.hasOwnProperty('sku')
				? details.deliveryFee.data.serviceInfo.sku.default[0].info
				: details.deliveryFee.data.serviceInfo.list[0].info
			: '0.0';
		const shipping_fee = parseFloat(shipping_info.replace(/[^\.0-9]/g, ''));

		// 상품 기본정보
		result['item']['shopName'] = 'taobao';
		result['item']['url'] = `https://item.taobao.com/item.htm?id=${configs.idata.item.id}`;
		result['item']['num_iid'] = configs.idata.item.id;
		result['item']['title'] = configs.idata.item.title;
		result['item']['price'] = shipping_fee > 0 ? (parseFloat(price) + shipping_fee).toString() : price;
		result['item']['pic_url'] = /^https?:/.test(configs.idata.item.pic)
			? configs.idata.item.pic
			: 'http:' + configs.idata.item.pic;
		// result['item']['brand'] = "";
		result['item']['post_fee'] = shipping_fee;
		result['item']['shop_id'] = 'taobao';

		// 상세페이지
		const desc_html = new DOMParser().parseFromString(items.desc, 'text/html');
		const desc = desc_html.querySelectorAll('html > body img') as NodeListOf<HTMLImageElement>;
		const desc_imgs: string[] = [];
		const descTable = desc_html.querySelectorAll('html > body table') as NodeListOf<HTMLTableElement>;
		let descText = '';

		// 상세페이지 <table> 하위요소 캡쳐
		for (let i = 0; i < descTable.length; i++) {
			try {
				const images = descTable[i].querySelectorAll('img');

				if (images.length > 0) continue;
				if (descTable[i].outerHTML) {
					descTable[i].style.width = '750px';
					descText += descTable[i].outerHTML;
				}
			} catch (e) {
				continue;
			}
		}

		if (descText) {
			const test = document.createElement('div');
			test.id = 'capture';
			test.innerHTML = descText;
			test.style.display = 'inline-block';
			document.body.appendChild(test);
			const canvas = await html2canvas(test, {
				useCORS: true,
				width: 750,
			});
			const canvas_output = canvas.toDataURL('image/png');

			test.remove();

			desc_imgs.push(canvas_output);
		}

		//html domparse는 이렇게 배열처럼 할수있음 .
		for (const i in desc) {
			try {
				if (desc[i].getAttribute('data-ks-lazyload')) desc[i].src = desc[i].getAttribute('data-ks-lazyload')!;
				if (desc[i].getAttribute('data-src')) desc[i].src = desc[i].getAttribute('data-src')!;
				if (desc[i].src) {
					if (desc[i].src.includes('.gif')) desc[i].parentNode?.removeChild(desc[i]);
					else {
						const image = await getImageSize(desc[i].src); //해당 이미지 사이즈가 100x100 이하 제거
						if (typeof image === 'number' && image < 1000)
							// console.log('흰색 이미지', desc[i]);
							desc[i].parentNode?.removeChild(desc[i]);
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

		const desc_href = desc_html.querySelectorAll('a');

		for (const i in desc_href) {
			try {
				desc_href[i].remove();
			} catch (e) {
				continue;
			}
		}

		const desc_output = desc_html.querySelector('html > body')?.innerHTML ?? '';

		// 상세페이지 텍스트 추출
		const iterator = document.createNodeIterator(desc_html.querySelector('html > body')!, NodeFilter.SHOW_TEXT);
		let textnode;

		while ((textnode = iterator.nextNode())) {
			const texts = textnode.textContent
				.split('\n')
				.map((v) => v.trim())
				.filter((v) => v);

			texts.map((v) => result['item']['desc_text'].push(v));
		}

		result['item']['desc'] = desc_output;
		result['item']['desc_img'] = desc_imgs; //trangers에서 쓸거고

		// 동영상
		try {
			result['item']['video'] =
				'https://cloud.video.taobao.com/play/u/' +
				script_video.videoOwnerId +
				'/p/1/e/6/t/1/' +
				script_video.videoId +
				'.mp4';
		} catch (e) {
			console.log('알림: 동영상이 없는 상품입니다. (', e, ')');
		}

		// 썸네일이미지
		try {
			for (const i in configs.idata.item.auctionImages) {
				try {
					result['item']['item_imgs'].push({
						url: /^https?:/.test(configs.idata.item.auctionImages[i])
							? configs.idata.item.auctionImages[i]
							: 'http:' + configs.idata.item.auctionImages[i],
					});
				} catch (e) {
					continue;
				}
			}
		} catch (e) {
			console.log('에러: 대표 이미지를 찾을 수 없습니다. (', e, ')');

			return { error: '대표 이미지를 찾을 수 없습니다.' };
		}

		// 옵션정보
		const options = document.querySelectorAll('#J_isku > div ul');

		for (const i in options) {
			try {
				const id = options[i].querySelectorAll('li');
				const name = options[i].getAttribute('data-property');

				for (const j in id) {
					try {
						const img = id[j].querySelector('a');
						const num = id[j].getAttribute('data-value')!;
						const val = img?.textContent;
						const url = img?.style.backgroundImage.length
							? img.style.backgroundImage.match(/(\/\/.*)"/)?.[1].replace(/_\d{2}x\d{2}.[a-zA-Z]{3}/, '')
							: '';

						if (url !== '' && url)
							result['item']['prop_imgs']['prop_img'].push({
								properties: num,
								url: /^https?:/.test(url) ? url : 'http:' + url,
							});
						if (val !== null) {
							let value = val?.trim() ?? items.sku.valItemInfo.propertyMemoMap[num];

							result['item']['props_list'][num] = name + ':' + value;
						}
					} catch (e) {
						continue;
					}
				}
			} catch (e) {
				continue;
			}
		}

		/** script_option 구조
		 * {
		 * 		;1627207:22114789071;:{
		 * 			oversold: false,
		 * 			price: "19.00",
		 * 			skuId: "4930638320875",
		 * 			stock: "2",
		 * 		},
		 * 		...
		 * }
		 */
		try {
			for (const i in script_option) {
				const properties = i.split(';');
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
					if (details.dynStock.sku.hasOwnProperty(i)) {
						const quantity = details.dynStock.sku[i].stock.toString();

						if (quantity !== '0') {
							const promotion_price = details.promotion.promoData[i]
								? details.promotion.promoData[i][0].price
								: details.originalPrice[i].price;

							result['item']['skus']['sku'].push({
								price: shipping_fee > 0 ? (parseFloat(promotion_price) + shipping_fee).toString() : promotion_price,
								total_price: 0,
								original_price: details.originalPrice.hasOwnProperty(i) ? details.originalPrice[i].price : '',
								properties: properties_id,
								properties_name: properties_name,
								quantity:
									user.userInfo?.collectStock === 0
										? quantity > 99999
											? '99999'
											: quantity.toString()
										: user.userInfo?.collectStock.toString(),
								sku_id: script_option[i].skuId,
							});
						}
					}
				}
			}
		} catch (e) {
			console.log('에러: 옵션 세부정보를 가져오지 못했습니다. (', e, ')');

			return { error: '옵션 세부정보를 가져오지 못했습니다.' };
		}

		// 판매가와 옵션최저가 비교해서 작은 값 할당
		let min_price = parseFloat(result['item']['price']);

		try {
			if (Object.keys(script_option).length > 0) {
				const priceList = result['item']['skus']['sku'].map((v) => {
					return v.price;
				});

				min_price = Math.min(...priceList);

				for (const i in result['item']['props_list']) {
					let matched = false;

					for (const j in result['item']['skus']['sku']) {
						if (result['item']['skus']['sku'][j]['properties'].includes(i)) {
							matched = true;

							break;
						}
					}

					if (matched) continue;

					delete result['item']['props_list'][i];
				}
			}
		} catch (e) {
			console.log('에러: 옵션 가격정보를 가져오지 못했습니다. (', e, ')');
		}

		if (parseFloat(result['item']['price']) !== min_price) result['item']['price'] = min_price.toString();
		if (Object.keys(result.item.props_list).length > 0 && result.item.skus.sku.length === 0) {
			console.log('에러: 해당 상품은 일시적으로 품절되었습니다.');

			return { error: '해당 상품은 일시적으로 품절되었습니다.' };
		}

		return result;
	}
};

export class taobao {
	constructor() {
		checkLogin('taobao').then((auth) => {
			if (!auth) return null;
		});
	}

	// 수집하기 눌렀을 때
	async get(user: User, isBulkProcessing: boolean) {
		sessionStorage.removeItem('sfy-taobao-item');

		injectScript('taobao');

		let timeout = 0;

		while (true) {
			if (timeout === user.userInfo!.collectTimeout)
				return {
					error:
						'상품정보가 정상적으로 로드되지 않았습니다.\n타오바오 로그인이 되어있는지 확인해주세요.\n타오바오 접속상태가 원활하지 않습니다.\n잠시 후 다시시도해주세요.',
				};

			const data = sessionStorage.getItem('sfy-taobao-item');

			if (data) {
				let originalData = JSON.parse(data);

				try {
					// 상세페이지 파싱
					if (originalData.pageType !== 2) {
						const descResp = await fetch(originalData.descUrl);
						const descBuffer = await descResp.arrayBuffer();
						const descText = iconv.decode(Buffer.from(descBuffer), 'gbk').toString();

						originalData = {
							...originalData,
							desc: descText,
						};
					}
				} catch (e) {
					console.log(e);
					timeout = user.userInfo!.collectTimeout!;

					continue;
				}

				return await scrape(originalData, user, isBulkProcessing);
			}

			timeout++;

			await sleep(1000 * 1);
		}
	}

	// 페이지별 대량수집 체크버튼 활성화
	async bulkTypeOne(user: User) {
		// const params = new Proxy(new URLSearchParams(window.location.search), {
		// 	get: (searchParams: any, prop) => searchParams.get(prop),
		// });
		// const tokenFull = getCookie('_m_h5_tk');
		// const token = tokenFull.split('_')[0];
		// const appKey = '12574478';
		// const timestamp = new Date().getTime();
		// const data1 = `{\"id\":\"${params.id}\",\"detail_v\":\"3.3.2\",\"exParams\":\"{\\\"queryParams\\\":\\\"id=${params.id}\\\",\\\"id\\\":\\\"${params.id}\\\"}\"}`;
		// const text1 = token + '&' + timestamp + '&' + appKey;
		// const signature = CryptoJS.MD5(text1).toString();

		// const resp = fetch(
		// 	`https://h5api.m.taobao.com/h5/mtop.relationrecommend.wirelessrecommend.recommend/2.0/?jsv=2.6.2&appKey=${appKey}&t=${timestamp}&sign=ac52aa16622269447dd076822ad5c683&api=mtop.relationrecommend.WirelessRecommend.recommend&v=2.0&type=jsonp&dataType=jsonp&callback=mtopjsonp2&data=%7B%22appId%22%3A%2234385%22%2C%22params%22%3A%22%7B%5C%22device%5C%22%3A%5C%22HMA-AL00%5C%22%2C%5C%22isBeta%5C%22%3A%5C%22false%5C%22%2C%5C%22grayHair%5C%22%3A%5C%22false%5C%22%2C%5C%22from%5C%22%3A%5C%22nt_history%5C%22%2C%5C%22brand%5C%22%3A%5C%22HUAWEI%5C%22%2C%5C%22info%5C%22%3A%5C%22wifi%5C%22%2C%5C%22index%5C%22%3A%5C%224%5C%22%2C%5C%22rainbow%5C%22%3A%5C%22%5C%22%2C%5C%22schemaType%5C%22%3A%5C%22auction%5C%22%2C%5C%22elderHome%5C%22%3A%5C%22false%5C%22%2C%5C%22isEnterSrpSearch%5C%22%3A%5C%22true%5C%22%2C%5C%22newSearch%5C%22%3A%5C%22false%5C%22%2C%5C%22network%5C%22%3A%5C%22wifi%5C%22%2C%5C%22subtype%5C%22%3A%5C%22%5C%22%2C%5C%22hasPreposeFilter%5C%22%3A%5C%22false%5C%22%2C%5C%22prepositionVersion%5C%22%3A%5C%22v2%5C%22%2C%5C%22client_os%5C%22%3A%5C%22Android%5C%22%2C%5C%22gpsEnabled%5C%22%3A%5C%22false%5C%22%2C%5C%22searchDoorFrom%5C%22%3A%5C%22srp%5C%22%2C%5C%22debug_rerankNewOpenCard%5C%22%3A%5C%22false%5C%22%2C%5C%22homePageVersion%5C%22%3A%5C%22v7%5C%22%2C%5C%22searchElderHomeOpen%5C%22%3A%5C%22false%5C%22%2C%5C%22search_action%5C%22%3A%5C%22initiative%5C%22%2C%5C%22sugg%5C%22%3A%5C%22_4_1%5C%22%2C%5C%22sversion%5C%22%3A%5C%2213.6%5C%22%2C%5C%22style%5C%22%3A%5C%22list%5C%22%2C%5C%22ttid%5C%22%3A%5C%22600000%40taobao_pc_10.7.0%5C%22%2C%5C%22needTabs%5C%22%3A%5C%22true%5C%22%2C%5C%22areaCode%5C%22%3A%5C%22KR%5C%22%2C%5C%22vm%5C%22%3A%5C%22nw%5C%22%2C%5C%22countryNum%5C%22%3A%5C%22410%5C%22%2C%5C%22m%5C%22%3A%5C%22pc%5C%22%2C%5C%22page%5C%22%3A2%2C%5C%22n%5C%22%3A48%2C%5C%22q%5C%22%3A%5C%22%25E5%25A5%25B3%25E8%25A3%2585%5C%22%2C%5C%22tab%5C%22%3A%5C%22mall%5C%22%2C%5C%22pageSize%5C%22%3A%5C%2248%5C%22%2C%5C%22totalPage%5C%22%3A%5C%22100%5C%22%2C%5C%22totalResults%5C%22%3A%5C%22121738%5C%22%2C%5C%22sourceS%5C%22%3A%5C%220%5C%22%2C%5C%22sort%5C%22%3A%5C%22_coefp%5C%22%2C%5C%22bcoffset%5C%22%3A%5C%220%5C%22%2C%5C%22ntoffset%5C%22%3A%5C%223%5C%22%2C%5C%22filterTag%5C%22%3A%5C%22%5C%22%2C%5C%22service%5C%22%3A%5C%22%5C%22%2C%5C%22prop%5C%22%3A%5C%22%5C%22%2C%5C%22loc%5C%22%3A%5C%22%5C%22%2C%5C%22start_price%5C%22%3Anull%2C%5C%22end_price%5C%22%3Anull%2C%5C%22startPrice%5C%22%3Anull%2C%5C%22endPrice%5C%22%3Anull%7D%22%7D`,
		// 	{
		// 		headers: {
		// 			accept: '*/*',
		// 			'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
		// 			'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
		// 			'sec-ch-ua-mobile': '?0',
		// 			'sec-ch-ua-platform': '"Windows"',
		// 			'sec-fetch-dest': 'script',
		// 			'sec-fetch-mode': 'no-cors',
		// 			'sec-fetch-site': 'same-site',
		// 		},
		// 		referrer: 'https://s.taobao.com/',
		// 		referrerPolicy: 'strict-origin-when-cross-origin',
		// 		body: null,
		// 		method: 'GET',
		// 		mode: 'cors',
		// 		credentials: 'include',
		// 	},
		// );

		document.addEventListener('DOMNodeInserted', async (e: any) => {
			try {
				if (e.target.getAttribute('class') === 'm-feedback') {
					let products: any = document.querySelectorAll('#main > div:nth-child(3) > div.grid-left a');

					for (let i in products) {
						try {
							if (products[i].getAttribute('id').includes('J_Itemlist_PLink')) {
								let input: any = document.createElement('input');
								let picker: any = document.getElementById('sfyPicker');

								input.id = products[i].getAttribute('href');
								input.className = 'SELLFORYOU-CHECKBOX';
								input.checked = picker?.value === 'false' ? false : true;
								input.type = 'checkbox';

								if (user.userInfo?.collectCheckPosition === 'L') input.setAttribute('style', 'left: 0px !important');
								else input.setAttribute('style', 'right: 0px !important');

								const root = products[i].parentNode.parentNode.parentNode.parentNode;
								const medal = root.getElementsByClassName('icon-service-jinpaimaijia');

								input.setAttribute('medal', medal.length);

								products[i].parentNode.insertBefore(input, products[i].nextSibling);
							}
						} catch (error) {
							continue;
						}
					}

					return;
				}
				if (e.target.getAttribute('class') === 'container') {
					/** 상품조회 API */
					// function mtopjsonp4(json) {
					// 	const start = json.indexOf('{');
					// 	const end = json.lastIndexOf('}');
					// 	const result = json.substring(start, end + 1);
					// }
					// const params = new Proxy(new URLSearchParams(window.location.search), {
					// 	get: (searchParams: any, prop) => searchParams.get(prop),
					// });

					// const appKey = '12574478';
					// const tokenFull = getCookie('_m_h5_tk');
					// const token = tokenFull.split('_')[0];
					// const time1 = new Date().getTime();
					// // const data1 = `{\"id\":\"${params.id}\",\"detail_v\":\"3.3.2\",\"exParams\":\"{\\\"queryParams\\\":\\\"id=${params.id}\\\",\\\"id\\\":\\\"${params.id}\\\"}\"}`;
					// // const data1 = `{"appId":\"34385\","params":"{\"isBeta\":\"false\",\"grayHair\":\"false\",\"appId\":\"30515\",\"from\":\"nt_history\",\"brand\":\"HUAWEI\",\"info\":\"wifi\",\"index\":\"4\",\"ttid\":\"600000@taobao_pc_10.7.0\",\"needTabs\":\"true\",\"rainbow\":\"\",\"areaCode\":\"KR\",\"vm\":\"nw\",\"schemaType\":\"auction\",\"elderHome\":\"false\",\"device\":\"HMA-AL00\",\"isEnterSrpSearch\":\"true\",\"countryNum\":\"410\",\"newSearch\":\"false\",\"network\":\"wifi\",\"subtype\":\"\",\"hasPreposeFilter\":\"false\",\"prepositionVersion\":\"v2\",\"client_os\":\"Android\",\"gpsEnabled\":\"false\",\"searchDoorFrom\":\"srp\",\"debug_rerankNewOpenCard\":\"false\",\"homePageVersion\":\"v7\",\"searchElderHomeOpen\":\"false\",\"search_action\":\"initiative\",\"sugg\":\"_4_1\",\"m\":\"pc\",\"sversion\":\"13.6\",\"style\":\"list\",\"page\":1,\"n\":48,\"q\":\"2023%20%E7%94%B7%E5%A3%AB%E7%9F%AD%E8%A2%96%E8%A1%AC%E8%A1%AB\",\"tab\":\"all\",\"pageSize\":48,\"totalPage\":100,\"totalResults\":4800,\"sourceS\":\"0\",\"sort\":\"_coefp\",\"bcoffset\":\"\",\"ntoffset\":\"\",\"filterTag\":\"\",\"service\":\"\",\"prop\":\"\",\"loc\":\"\",\"start_price\":\"200\",\"end_price\":null}"}`;
					// const page = 2;
					// const search = encodeURI('天猫');
					// const data = `{"appId":"34385","params":"{\"device\":\"HMA-AL00\",\"isBeta\":\"false\",\"grayHair\":\"false\",\"from\":\"nt_history\",\"brand\":\"HUAWEI\",\"info\":\"wifi\",\"index\":\"4\",\"rainbow\":\"\",\"schemaType\":\"auction\",\"elderHome\":\"false\",\"isEnterSrpSearch\":\"true\",\"newSearch\":\"false\",\"network\":\"wifi\",\"subtype\":\"\",\"hasPreposeFilter\":\"false\",\"prepositionVersion\":\"v2\",\"client_os\":\"Android\",\"gpsEnabled\":\"false\",\"searchDoorFrom\":\"srp\",\"debug_rerankNewOpenCard\":\"false\",\"homePageVersion\":\"v7\",\"searchElderHomeOpen\":\"false\",\"search_action\":\"initiative\",\"sugg\":\"_4_1\",\"sversion\":\"13.6\",\"style\":\"list\",\"ttid\":\"600000@taobao_pc_10.7.0\",\"needTabs\":\"true\",\"areaCode\":\"CN\",\"vm\":\"nw\",\"countryNum\":\"156\",\"m\":\"pc\",\"page\":${page},\"n\":48,\"q\":\"${search}\",\"tab\":\"all\",\"pageSize\":\"48\",\"totalPage\":\"100\",\"totalResults\":\"4800\",\"sourceS\":\"432\",\"sort\":\"_coefp\",\"bcoffset\":\"-30\",\"ntoffset\":\"-24\",\"filterTag\":\"\",\"service\":\"\",\"prop\":\"\",\"loc\":\"\",\"start_price\":null,\"end_price\":null,\"startPrice\":null,\"endPrice\":null}"}`;
					// const text1 = token + '&' + time1 + '&' + appKey + '&' + data;
					// const sign1 = CryptoJS.MD5(text1).toString();
					// /** 타오바오 상품정보 조회 API */
					// try {
					// 	const resp = await fetch(
					// 		`https://h5api.m.taobao.com/h5/mtop.relationrecommend.wirelessrecommend.recommend/2.0/?jsv=2.6.2&appKey=${appKey}&t=${time1}&sign=${sign1}&api=mtop.relationrecommend.WirelessRecommend.recommend&v=2.0&type=jsonp&dataType=jsonp&callback=mtopjsonp2&data=${data}`,
					// 		{
					// 			headers: {
					// 				accept: '*/*',
					// 				'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
					// 				'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
					// 				'sec-ch-ua-mobile': '?0',
					// 				'sec-ch-ua-platform': '"Windows"',
					// 				'sec-fetch-dest': 'script',
					// 				'sec-fetch-mode': 'no-cors',
					// 				'sec-fetch-site': 'same-site',
					// 			},
					// 			referrer: 'https://s.taobao.com/',
					// 			referrerPolicy: 'strict-origin-when-cross-origin',
					// 			body: null,
					// 			method: 'GET',
					// 			mode: 'cors',
					// 			credentials: 'include',
					// 		},
					// 	);
					// 	const text = await resp.text();
					// 	mtopjsonp4(text);
					// } catch (error) {
					// 	console.error(error);
					// }
					/******************************************* */

					let products: any = document.querySelectorAll(
						'#root > div > div:nth-child(2) > div.PageContent--contentWrap--mep7AEm > div.LeftLay--leftWrap--xBQipVc a',
					);

					for (let i in products) {
						try {
							if (products[i].getAttribute('class').includes('Card--doubleCardWrapper--L2XFE73')) {
								//넣으려는 herf의 input 태그의 id를 가지고 있는 컴포넌트가 있는지 확인
								if (document.getElementById(products[i].getAttribute('href')) !== null)
									console.log('Element with the same ID already exists.');
								// 이미 존재하는게 있을경우에는 추가안함
								else {
									const input = document.createElement('input');
									const picker = document.getElementById('sfyPicker') as HTMLButtonElement;
									input.id = products[i].getAttribute('href');
									input.className = 'SELLFORYOU-CHECKBOX';
									input.checked = picker?.value === 'false' ? false : true;
									input.type = 'checkbox';
									// input.setAttribute("style", "left: 0px !important");
									if (user.userInfo?.collectCheckPosition === 'L') input.setAttribute('style', 'left: 0px !important');
									else input.setAttribute('style', 'right: 0px !important');

									products[i].parentNode.style.position = 'relative';
									products[i].parentNode.insertBefore(input, products[i].nextSibling);
								}
							}
						} catch (e) {
							continue;
						}
					}
					return;
				}
			} catch (error) {
				//
			}
		});

		//** 48개의 상품 div를 가지고있는 parent 돔 */
		const contentInner = document.querySelector('[class*="Content--contentInner"]');
		const picker = document.getElementById('sfyPicker') as HTMLButtonElement | null;

		if (contentInner) {
			const observer = new MutationObserver((e) => {
				/** 48번의 이벤트가 발생하니 그중 한개만 가져오면됨 */
				const container = e.find((v: any) => v.target?.className.includes('Content--contentInner'));
				container?.target.childNodes.forEach((v) => {
					const a = v?.firstChild as HTMLAnchorElement;

					try {
						onInsertDom({ element: a, picker: picker, user: user });
					} catch (error) {
						// 알아서 패스
					}
				});
			});
			observer.observe(contentInner, { childList: true, subtree: true });
		}
	}

	async bulkTypeTwo(user: User) {
		let timeout = 0;

		while (true) {
			if (timeout === 100) return 0;

			let count = 0;
			let lines = document.querySelectorAll('div');
			let test: any = [];

			for (let i = 0; i < lines.length - 1; i++) {
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

						if (user.userInfo?.collectCheckPosition === 'L') input.setAttribute('style', 'left: 0px !important');
						else input.setAttribute('style', 'right: 0px !important');

						links[j].parentNode.style.position = 'relative';
						links[j].parentNode.insertBefore(input, links[j].nextSibling);

						count++;
					}

					test.push(links);
				}
			}

			if (count > 0) return count;

			await sleep(1000 * 2);

			timeout++;
		}
	}

	async bulkTypeThree(user) {
		document.addEventListener('DOMNodeInserted', (e: any) => {
			try {
				if (e.target.getAttribute('class') === 'rax-view-v2 filterItem--filterContainer--387kpkc') {
					//이거 이제알았음 e.target 콘솔찍어서 노드리스트 100개 다불러오고 마지막에 호출되는 class명을 조건일때 마지막 루프 들고오는거였음
					let products: any = document.querySelectorAll(
						'#root > div > div.rax-view-v2.Home--listContainer--1NDEj3u > div.rax-view-v2.list--listWrap--1xUV9qB a',
					);
					for (let i in products) {
						try {
							if (products[i].getAttribute('class').includes('mobile--class-1--2Vz4bM4')) {
								let input: any = document.createElement('input');
								let picker: any = document.getElementById('sfyPicker');

								input.id = products[i].getAttribute('href');
								input.className = 'SELLFORYOU-CHECKBOX';
								input.checked = picker?.value === 'false' ? false : true;
								input.type = 'checkbox';

								if (user.userInfo.collectCheckPosition === 'L') input.setAttribute('style', 'left: 0px !important');
								else input.setAttribute('style', 'right: 0px !important');

								products[i].parentNode.parentNode.style.position = 'relative';
								products[i].parentNode.parentNode.insertBefore(input, products[i].nextSibling);
							}
						} catch (error) {
							continue;
						}
					}
					return;
				}
			} catch (e) {
				//
			}
		});
	}
}
