import { checkLogin } from './common/auth';
import { form } from './common/data';
import { injectScript } from './common/utils';
import { sleep, getImageSize } from '../../Tools/Common';
import { User } from '../../../type/type';

// const waitFor3Seconds = () => {
// 	return new Promise((resolve) => {
// 		setTimeout(resolve, 5000); // 3000 밀리초(3초) 후에 resolve 호출
// 	});
// };

/** 하단까지 스크롤을 부드럽게 해주는 함수 , 기본값:0.5초 */
const scrollToBottomSmooth = async (duration: number = 500) => {
	const scrollElement = document.documentElement || document.body;
	const start = scrollElement.scrollTop;
	const target = scrollElement.scrollHeight - window.innerHeight;
	const startTime = performance.now();

	const animateScroll = async (time: number) => {
		const elapsed = time - startTime;
		const progress = Math.min(elapsed / duration, 1);

		scrollElement.scrollTop = start + (target - start) * progress;

		if (progress < 1) await window.requestAnimationFrame(animateScroll);
	};

	await window.requestAnimationFrame(animateScroll);
};

// 알리익스프레스 상품정보 크롤링
const scrape = async (items: any, user: User) => {
	let result: any = form;

	result.user = user;

	// 페이지별 크롤링 방식 다름
	if (items.pageType === 1) {
		// 상품속성
		if (items.specsModule)
			items.specsModule.props.map((v: any) => {
				result['item']['attr'].push(`${v.attrName}:${v.attrValue}`);
			});

		// 배송비 정보
		if (items.shippingModule) {
			let shipping_list = items.shippingModule.generalFreightInfo.originalLayoutResultList;

			for (let i in shipping_list) {
				let shipping_data: any = {};

				shipping_data.name = shipping_list[i].bizData.company;

				if (shipping_list[i].bizData.shippingFee === 'free') {
					shipping_data.value = 0;
					shipping_data.format = '무료 배송';
				} else {
					try {
						shipping_data.value = parseInt(shipping_list[i].bizData.formattedAmount.replace(/[₩, ]/g, ''));
						shipping_data.format = shipping_list[i].bizData.formattedAmount;
					} catch (e) {
						continue;
					}
				}

				if (shipping_list[i].bizData.company === 'AliExpress Standard Shipping') shipping_data.default = true;
				else shipping_data.default = false;

				result['item']['props'].push(shipping_data);
			}
		}

		let thumnails = [];

		// 이미지 정보
		if (items.imageModule) {
			thumnails = items.imageModule.imagePathList;

			try {
				result['item']['video'] =
					'https://cloud.video.taobao.com/play/u/' +
					items.imageModule.videoUid +
					'/p/1/e/6/t/10301/' +
					items.imageModule.videoId.toString() +
					'.mp4';
			} catch (e) {
				console.log('알림: 동영상이 없는 상품입니다. (', e, ')');
			}
		}

		// 상세페이지
		let desc_resp = await fetch(items.descriptionModule.descriptionUrl);
		let desc_text = await desc_resp.text();
		let desc_html: any = new DOMParser().parseFromString(desc_text, 'text/html');
		let desc_scripts = desc_html.querySelectorAll('script');

		for (let i in desc_scripts) {
			try {
				desc_scripts[i].remove();
			} catch (e) {
				continue;
			}
		}

		let desc: any = desc_html.querySelectorAll('html > body img');
		let desc_imgs: any = [];

		for (let i in desc) {
			try {
				if (desc[i].src) {
					if (desc[i].src.includes('.gif')) desc[i].parentNode.removeChild(desc[i]);
					else {
						const image: any = await getImageSize(desc[i].src); //해당 이미지 사이즈가 100x100 이하 제거
						if (image < 1000)
							// console.log('흰색 이미지', desc[i]);
							desc[i].parentNode.removeChild(desc[i]);
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

		let desc_href: any = desc_html.querySelectorAll('a');

		for (let i in desc_href) {
			try {
				desc_href[i].remove();
			} catch (e) {
				continue;
			}
		}

		let desc_output = desc_html.querySelector('body').innerHTML;
		// 상세페이지 텍스트 추출
		let iterator = document.createNodeIterator(desc_html.querySelector('body'), NodeFilter.SHOW_TEXT);
		let textnode;

		while ((textnode = iterator.nextNode())) {
			const texts = textnode.textContent
				.split('\n')
				.map((v: any) => v.trim())
				.filter((v: any) => v);

			texts.map((v: any) => result['item']['desc_text'].push(v));
		}

		// 상품 기본정보 설정
		result['item']['shopName'] = 'express';
		result['item']['url'] = `https://ko.aliexpress.com/item/${items.commonModule.productId}.html`;
		result['item']['num_iid'] = items.commonModule.productId.toString();
		result['item']['title'] = items.titleModule.subject;
		result['item']['price'] = items.priceModule.hasOwnProperty('minActivityAmount')
			? items.priceModule.minActivityAmount.value.toString()
			: items.priceModule.minAmount.value.toString();
		result['item']['pic_url'] = /^https?:/.test(thumnails[0]) ? thumnails[0] : 'http:' + thumnails[0];
		// result['item']['brand'] = "";
		result['item']['desc'] = desc_output;
		result['item']['desc_img'] = desc_imgs;
		result['item']['tmall'] = false;
		result['item']['shop_id'] = 'express';

		// 썸네일이미지
		try {
			for (let i in thumnails) {
				try {
					// let image: any = await getImageSize(/^https?:/.test(thumnails[i]) ? thumnails[i] : "http:" + thumnails[i]);
					// if (image < 1000) {
					//   console.log("썸네일 흰색 이미지 발견", thumnails[i]);
					// } else {
					//   result["item"]["item_imgs"].push({
					//     url: /^https?:/.test(thumnails[i]) ? thumnails[i] : "http:" + thumnails[i],
					//   });
					// }
					result['item']['item_imgs'].push({
						url: /^https?:/.test(thumnails[i]) ? thumnails[i] : 'http:' + thumnails[i],
					});
				} catch (e) {
					continue;
				}
			}
		} catch (e) {
			console.log('에러: 대표 이미지를 찾을 수 없습니다. (', e, ')');

			return { error: '대표 이미지를 찾을 수 없습니다.' };
		}

		let delivery_code = '';

		// 옵션정보
		try {
			for (let i in items.skuModule.productSKUPropertyList) {
				let skus = items.skuModule.productSKUPropertyList[i];
				for (let j in skus.skuPropertyValues) {
					if (skus.skuPropertyName === '배송지' || skus.skuPropertyName === 'Ships From') {
						if (skus.skuPropertyValues[j].skuPropertySendGoodsCountryCode === 'CN')
							delivery_code = skus.skuPropertyId + ':' + skus.skuPropertyValues[j].propertyValueIdLong;

						continue;
					}

					try {
						let num = skus.skuPropertyId + ':' + skus.skuPropertyValues[j].propertyValueIdLong;
						let name = skus.skuPropertyName + ':' + skus.skuPropertyValues[j].propertyValueDisplayName;
						let image = skus.skuPropertyValues[j].skuPropertyImagePath;

						if (image)
							result['item']['prop_imgs']['prop_img'].push({
								properties: num,
								url: /^https?:/.test(image) ? image : 'http:' + image,
							});

						result['item']['props_list'][num] = name;
					} catch (e) {
						console.log(e);

						continue;
					}
				}
			}
		} catch (e) {
			console.log(e);
		}

		try {
			for (let i in items.skuModule.skuPriceList) {
				let skus = items.skuModule.skuPriceList[i];
				let properties = skus.skuAttr.split(';');
				let properties_id = '';
				let properties_name = '';
				let matched = false;

				if (delivery_code === '') matched = true;

				for (let j = 0; j < properties.length; j++) {
					let properties_fixed = properties[j].replace(/#.+/, '');

					if (properties_fixed === delivery_code) {
						matched = true;

						continue;
					}
					if (j < properties.length) {
						properties_id += properties_fixed;
						properties_name += properties_fixed + ':' + result['item']['props_list'][properties_fixed];
					}
					if (j < properties.length - 1) {
						properties_id += ';';
						properties_name += ';';
					}
				}

				let quantity = skus.skuVal.availQuantity.toString();

				if (matched && quantity !== '0') {
					let promotion_price = skus.skuVal.skuActivityAmount
						? skus.skuVal.skuActivityAmount.value
						: skus.skuVal.skuAmount
						? skus.skuVal.skuAmount.value
						: skus.skuVal.actSkuMultiCurrencyCalPrice ?? skus.skuVal.skuMultiCurrencyCalPrice;
					result['item']['skus']['sku'].push({
						price: promotion_price,
						total_price: 0,
						original_price: skus.skuVal.skuAmount
							? skus.skuVal.skuAmount.value
							: skus.skuVal.actSkuMultiCurrencyCalPrice,
						properties: properties_id,
						properties_name: properties_name,
						quantity:
							user.userInfo.collectStock === 0
								? quantity > 99999
									? '99999'
									: quantity.toString()
								: user.userInfo.collectStock.toString(),
						sku_id: skus.skuIdStr,
					});
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
	} else if (items.pageType === 3) {
		if (items.specsModule)
			items.specsModule.props.map((v: any) => {
				result['item']['attr'].push(`${v.attrName}:${v.attrValue}`);
			});
		if (items.shippingModule) {
			//해당 부분 데이터가 정상적으로 없는 상품 발견함. 이부분 dom에서 없을때 불러와야할듯 .
			let shipping_list = items.shippingModule.generalFreightInfo.originalLayoutResultList;
			for (let i in shipping_list) {
				let shipping_data: any = {};

				shipping_data.name = shipping_list[i].bizData.company;

				if (shipping_list[i].bizData.shippingFee === 'free') {
					shipping_data.value = 0;
					shipping_data.format = '무료 배송';
				} else {
					try {
						shipping_data.value = parseInt(shipping_list[i].bizData.formattedAmount.replace(/[₩, ]/g, ''));
						shipping_data.format = shipping_list[i].bizData.formattedAmount;
					} catch (e) {
						continue;
					}
				}

				if (shipping_list[i].bizData.company === 'AliExpress Standard Shipping') shipping_data.default = true;
				else shipping_data.default = false;

				result['item']['props'].push(shipping_data);
			}
		}

		let thumnails = [];

		if (items.imageModule) {
			thumnails = items.imageModule.imagePathList;

			try {
				result['item']['video'] =
					'https://cloud.video.taobao.com/play/u/' +
					items.imageModule.videoUid +
					'/p/1/e/6/t/10301/' +
					items.imageModule.videoId.toString() +
					'.mp4';
			} catch (e) {
				console.log('알림: 동영상이 없는 상품입니다. (', e, ')');
			}
		}

		let desc_resp = await fetch(items.descriptionModule.descriptionUrl);
		let desc_text = await desc_resp.text();
		let desc_html: any = new DOMParser().parseFromString(desc_text, 'text/html');
		let desc_scripts = desc_html.querySelectorAll('script');

		for (let i in desc_scripts) {
			try {
				desc_scripts[i].remove();
			} catch (e) {
				continue;
			}
		}

		let desc: any = desc_html.querySelectorAll('html > body img');
		let desc_imgs: any = [];

		for (let i in desc) {
			try {
				if (desc[i].src) {
					if (desc[i].src.includes('.gif')) desc[i].parentNode.removeChild(desc[i]);
					else {
						const image: any = await getImageSize(desc[i].src); //해당 이미지 사이즈가 100x100 이하 제거
						if (image < 1000)
							// console.log('흰색 이미지', desc[i]);
							desc[i].parentNode.removeChild(desc[i]);
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

		let desc_href: any = desc_html.querySelectorAll('a');

		for (let i in desc_href) {
			try {
				desc_href[i].remove();
			} catch (e) {
				continue;
			}
		}

		let desc_output = desc_html.querySelector('body').innerHTML;
		let iterator = document.createNodeIterator(desc_html.querySelector('body'), NodeFilter.SHOW_TEXT);
		let textnode;

		while ((textnode = iterator.nextNode())) {
			const texts = textnode.textContent
				.split('\n')
				.map((v: any) => v.trim())
				.filter((v: any) => v);

			texts.map((v: any) => result['item']['desc_text'].push(v));
		}

		result['item']['shopName'] = 'express'; //todo
		result['item']['url'] = `https://ko.aliexpress.com/item/${items.commonModule.id}.html`;
		result['item']['num_iid'] = items.commonModule.id.toString();
		result['item']['title'] = items.commonModule.subject;
		result['item']['price'] = items.priceModule.discountPrice.hasOwnProperty('minActivityAmount')
			? items.priceModule.discountPrice.minActivityAmount.value.toString()
			: items.priceModule.discountPrice.minAmount.value.toString();
		result['item']['pic_url'] = /^https?:/.test(thumnails[0]) ? thumnails[0] : 'http:' + thumnails[0];
		// result['item']['brand'] = "";
		result['item']['desc'] = desc_output;
		result['item']['desc_img'] = desc_imgs;
		result['item']['tmall'] = false;
		result['item']['shop_id'] = 'express';

		try {
			for (let i in thumnails) {
				try {
					// let image: any = await getImageSize(/^https?:/.test(thumnails[i]) ? thumnails[i] : "http:" + thumnails[i]);
					// if (image < 1000) {
					//   console.log("썸네일 흰색 이미지 발견", thumnails[i]);
					// } else {
					//   result["item"]["item_imgs"].push({
					//     url: /^https?:/.test(thumnails[i]) ? thumnails[i] : "http:" + thumnails[i],
					//   });
					// }
					result['item']['item_imgs'].push({
						url: /^https?:/.test(thumnails[i]) ? thumnails[i] : 'http:' + thumnails[i],
					});
				} catch (e) {
					continue;
				}
			}
		} catch (e) {
			console.log('에러: 대표 이미지를 찾을 수 없습니다. (', e, ')');

			return { error: '대표 이미지를 찾을 수 없습니다.' };
		}

		let delivery_code = '';

		try {
			for (let i in items.skuModule.productSKUPropertyList) {
				let skus = items.skuModule.productSKUPropertyList[i];
				for (let j in skus.skuPropertyValues) {
					if (skus.skuPropertyName === '배송지' || skus.skuPropertyName === 'Ships From') {
						if (skus.skuPropertyValues[j].skuPropertySendGoodsCountryCode === 'CN')
							delivery_code = skus.skuPropertyId + ':' + skus.skuPropertyValues[j].propertyValueIdLong;

						continue;
					}

					try {
						let num = skus.skuPropertyId + ':' + skus.skuPropertyValues[j].propertyValueIdLong;
						let name = skus.skuPropertyName + ':' + skus.skuPropertyValues[j].propertyValueDisplayName;
						let image = skus.skuPropertyValues[j].skuPropertyImagePath;

						if (image)
							result['item']['prop_imgs']['prop_img'].push({
								properties: num,
								url: /^https?:/.test(image) ? image : 'http:' + image,
							});

						result['item']['props_list'][num] = name;
					} catch (e) {
						console.log(e);

						continue;
					}
				}
			}
		} catch (e) {
			console.log(e);
		}

		try {
			for (let i in items.priceModule.skuPriceList) {
				let skus = items.priceModule.skuPriceList[i];
				let properties = skus.skuAttr.split(';');
				let properties_id = '';
				let properties_name = '';
				let matched = false;

				if (delivery_code === '') matched = true;

				for (let j = 0; j < properties.length; j++) {
					let properties_fixed = properties[j].replace(/#.+/, '');
					if (properties_fixed === delivery_code) {
						matched = true;

						continue;
					}
					if (j < properties.length) {
						properties_id += properties_fixed;
						properties_name += properties_fixed + ':' + result['item']['props_list'][properties_fixed];
					}
					if (j < properties.length - 1) {
						properties_id += ';';
						properties_name += ';';
					}
				}

				let quantity = skus.skuVal.availQuantity.toString();

				if (matched && quantity !== '0') {
					let promotion_price = skus.skuVal.skuActivityAmount
						? skus.skuVal.skuActivityAmount.value
						: skus.skuVal.skuAmount
						? skus.skuVal.skuAmount.value
						: skus.skuVal.actSkuMultiCurrencyCalPrice ?? skus.skuVal.skuMultiCurrencyCalPrice;

					result['item']['skus']['sku'].push({
						price: promotion_price,
						total_price: 0,
						original_price: skus.skuVal.skuAmount
							? skus.skuVal.skuAmount.value
							: skus.skuVal.actSkuMultiCurrencyCalPrice,
						properties: properties_id,
						properties_name: properties_name,
						quantity:
							user.userInfo.collectStock === 0
								? quantity > 99999
									? '99999'
									: quantity.toString()
								: user.userInfo.collectStock.toString(),
						sku_id: skus.skuIdStr,
					});
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
	} else if (items.pageType === 2) {
		if (items.specsModule)
			items.specsModule.specs.map((v: any) => result['item']['attr'].push(`${v.attrName}:${v.attrValue}`));
		if (items.shippingModule) {
			let shipping_list = items.shippingModule.generalFreightInfo.originalLayoutResultList;

			for (let i in shipping_list) {
				let shipping_data: any = {};

				shipping_data.name = shipping_list[i].bizData.company;

				if (shipping_list[i].bizData.shippingFee === 'free') {
					shipping_data.value = 0;
					shipping_data.format = '무료 배송';
				} else {
					try {
						shipping_data.value = parseInt(shipping_list[i].bizData.formattedAmount.replace(/[₩, ]/g, ''));
						shipping_data.format = shipping_list[i].bizData.formattedAmount;
					} catch (e) {
						continue;
					}
				}

				if (shipping_list[i].bizData.company === 'AliExpress Standard Shipping') shipping_data.default = true;
				else shipping_data.default = false;

				result['item']['props'].push(shipping_data);
			}
		}

		let thumnails = [];

		if (items.imageModule) {
			thumnails = items.imageModule.imagePathList;

			try {
				result['item']['video'] =
					'https://cloud.video.taobao.com/play/u/' +
					items.imageModule.videoUid +
					'/p/1/e/6/t/10301/' +
					items.imageModule.videoId.toString() +
					'.mp4';
			} catch (e) {
				console.log('알림: 동영상이 없는 상품입니다. (', e, ')');
			}
		}

		let desc_resp = await fetch(items.descriptionModule.detailDesc);
		let desc_text = await desc_resp.text();
		let desc_html: any = new DOMParser().parseFromString(desc_text, 'text/html');
		let desc_scripts = desc_html.querySelectorAll('script');

		for (let i in desc_scripts) {
			try {
				desc_scripts[i].remove();
			} catch (e) {
				continue;
			}
		}

		let desc: any = desc_html.querySelectorAll('html > body img');
		let desc_imgs: any = [];

		for (let i in desc) {
			try {
				if (desc[i].src) {
					if (desc[i].src.includes('.gif')) desc[i].parentNode.removeChild(desc[i]);
					else {
						const image: any = await getImageSize(desc[i].src); //해당 이미지 사이즈가 100x100 이하 제거
						if (image < 1000)
							// console.log('흰색 이미지', desc[i]);
							desc[i].parentNode.removeChild(desc[i]);
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

		let desc_href: any = desc_html.querySelectorAll('a');

		for (let i in desc_href) {
			try {
				desc_href[i].remove();
			} catch (e) {
				continue;
			}
		}

		let desc_output = desc_html.querySelector('body').innerHTML;
		let iterator = document.createNodeIterator(desc_html.querySelector('body'), NodeFilter.SHOW_TEXT);
		let textnode;

		while ((textnode = iterator.nextNode())) {
			const texts = textnode.textContent
				.split('\n')
				.map((v: any) => v.trim())
				.filter((v: any) => v);

			texts.map((v: any) => result['item']['desc_text'].push(v));
		}

		result['item']['shopName'] = 'express';
		result['item']['url'] = `https://ko.aliexpress.com/item/${items.commonModule.productId}.html`;
		result['item']['num_iid'] = items.commonModule.productId.toString();
		result['item']['title'] = items.titleModule.subject;
		result['item']['price'] = items.priceModule.hasOwnProperty('minActivityAmount')
			? items.priceModule.minActivityAmount.value.toString()
			: items.priceModule.minAmount.value.toString();
		result['item']['pic_url'] = /^https?:/.test(thumnails[0]) ? thumnails[0] : 'http:' + thumnails[0];
		// result['item']['brand'] = "";
		result['item']['desc'] = desc_output;
		result['item']['desc_img'] = desc_imgs;
		result['item']['tmall'] = false;
		result['item']['shop_id'] = 'express';

		try {
			for (let i in thumnails) {
				try {
					// let image: any = await getImageSize(/^https?:/.test(thumnails[i]) ? thumnails[i] : "http:" + thumnails[i]);
					// if (image < 1000) {
					//   console.log("썸네일 흰색 이미지 발견", thumnails[i]);
					// } else {
					//   result["item"]["item_imgs"].push({
					//     url: /^https?:/.test(thumnails[i]) ? thumnails[i] : "http:" + thumnails[i],
					//   });
					// }
					result['item']['item_imgs'].push({
						url: /^https?:/.test(thumnails[i]) ? thumnails[i] : 'http:' + thumnails[i],
					});
				} catch (e) {
					continue;
				}
			}
		} catch (e) {
			console.log('에러: 대표 이미지를 찾을 수 없습니다. (', e, ')');

			return { error: '대표 이미지를 찾을 수 없습니다.' };
		}

		let delivery_code = '';

		try {
			for (let i in items.skuModule.propertyList) {
				let skus = items.skuModule.propertyList[i];

				for (let j in skus.skuPropertyValues) {
					if (skus.skuPropertyName === '배송지' || skus.skuPropertyName === 'Ships From') {
						if (skus.skuPropertyValues[j].skuPropertySendGoodsCountryCode === 'CN')
							delivery_code = skus.skuPropertyId + ':' + skus.skuPropertyValues[j].propertyValueIdLong;

						continue;
					}

					try {
						let num = skus.skuPropertyId + ':' + skus.skuPropertyValues[j].propertyValueIdLong;
						let name = skus.skuPropertyName + ':' + skus.skuPropertyValues[j].propertyValueDisplayName;
						let image = skus.skuPropertyValues[j].skuPropertyImagePath;

						if (image)
							result['item']['prop_imgs']['prop_img'].push({
								properties: num,
								url: /^https?:/.test(image) ? image : 'http:' + image,
							});

						result['item']['props_list'][num] = name;
					} catch (e) {
						console.log(e);

						continue;
					}
				}
			}
		} catch (e) {
			console.log(e);
		}

		try {
			for (let i in items.skuModule.skuList) {
				let skus = items.skuModule.skuList[i];
				let properties = skus.skuAttr.split(';');
				let properties_id = '';
				let properties_name = '';
				let matched = false;

				if (delivery_code === '') matched = true;

				for (let j = 0; j < properties.length; j++) {
					let properties_fixed = properties[j].replace(/#.+/, '');

					if (properties_fixed === delivery_code) {
						matched = true;

						continue;
					}
					if (j < properties.length) {
						properties_id += properties_fixed;
						properties_name += properties_fixed + ':' + result['item']['props_list'][properties_fixed];
					}
					if (j < properties.length - 1) {
						properties_id += ';';
						properties_name += ';';
					}
				}

				let quantity = skus.skuVal.availQuantity.toString();

				if (matched && quantity !== '0') {
					let promotion_price = skus.skuVal.skuActivityAmount
						? skus.skuVal.skuActivityAmount.value
						: skus.skuVal.skuAmount
						? skus.skuVal.skuAmount.value
						: skus.skuVal.actSkuMultiCurrencyCalPrice ?? skus.skuVal.skuMultiCurrencyCalPrice;

					result['item']['skus']['sku'].push({
						price: promotion_price,
						total_price: 0,
						original_price: skus.skuVal.skuAmount
							? skus.skuVal.skuAmount.value
							: skus.skuVal.actSkuMultiCurrencyCalPrice,
						properties: properties_id,
						properties_name: properties_name,
						quantity:
							user.userInfo.collectStock === 0
								? quantity > 99999
									? '99999'
									: quantity.toString()
								: user.userInfo.collectStock.toString(),
						sku_id: skus.skuIdStr,
					});
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
export class express {
	constructor() {
		checkLogin('express').then((auth) => {
			if (!auth) return null;
		});
	}

	// 수집하기 버튼 클릭 시
	async get(user: User) {
		sessionStorage.removeItem('sfy-express-item');

		injectScript('express');

		let timeout = 0;

		while (true) {
			if (timeout === user.userInfo.collectTimeout)
				return {
					error: '알리익스프레스 접속상태가 원활하지 않습니다.\n잠시 후 다시시도해주세요.',
				};

			let data = sessionStorage.getItem('sfy-express-item');
			if (data) {
				let originalData = JSON.parse(data);
				console.log('sessonData', originalData);

				return await scrape(originalData, user);
			}

			timeout++;

			await sleep(1000 * 1);
		}
	}

	/** 대량수집 페이지별 체크표시 */
	async bulkTypeOne(user) {
		document.addEventListener('DOMNodeInserted', (e: any) => {
			try {
				if (e.target.getAttribute('href').includes('item')) {
					let input = document.createElement('input');
					let picker: any = document.getElementById('sfyPicker');

					input.id = e.target.getAttribute('href');
					input.className = 'SELLFORYOU-CHECKBOX';
					input.checked = picker?.value === 'false' ? false : true;
					input.type = 'checkbox';

					if (user.userInfo.collectCheckPosition === 'L') input.setAttribute('style', 'left: 0px !important');
					else input.setAttribute('style', 'right: 0px !important');

					e.target.style.position = 'relative';
					e.target.appendChild(input);
				}
			} catch (e) {
				return 0;
			}
		});
	}
	/** aliexpress.com\/w\/wholesale 페이지 체크박스용 */
	async bulkTypeTwo(user) {
		let timeout = 0;

		/** 알리 검색페이지 상품 리스트 url */
		// const resp = await fetch('https://ko.aliexpress.com/fn/search-pc/index', {
		// 	headers: {
		// 		accept: '*/*',
		// 		'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
		// 		'bx-v': '2.5.3',
		// 		'content-type': 'application/json;charset=UTF-8',
		// 		'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
		// 		'sec-ch-ua-mobile': '?0',
		// 		'sec-ch-ua-platform': '"Windows"',
		// 		'sec-fetch-dest': 'empty',
		// 		'sec-fetch-mode': 'cors',
		// 		'sec-fetch-site': 'same-origin',
		// 	},
		// 	referrer:
		// 		'https://ko.aliexpress.com/w/wholesale-%EC%A0%84%EA%B5%AC.html?page=2&g=y&SearchText=%EC%A0%84%EA%B5%AC',
		// 	referrerPolicy: 'strict-origin-when-cross-origin',
		// 	body: '{"pageVersion":"76cea70e82a7e928f556677984719aa1","target":"root","data":{"page":2,"g":"y","SearchText":"전구","origin":"y"},"eventName":"onChange","dependency":[]}',
		// 	method: 'POST',
		// 	mode: 'cors',
		// 	credentials: 'include',
		// });
		// console.log({ resp });
		// const json = await resp.json();
		// console.log({ json });
		// const productIds = json?.data?.result?.mods?.itemList?.content.map((v) => v.productId);
		// console.log({ productIds });
		/** */

		while (true) {
			if (timeout === 10) return 0;

			scrollToBottomSmooth();

			let count = 0;
			const root = document.getElementById('root');
			const products: any = root?.querySelectorAll('a[class*="multi--container"]');

			if (root && products && products.length >= 60)
				for (let i in products) {
					try {
						const productLink = products[i].getAttribute('href');
						if (!productLink?.includes('item') || !products[i].querySelector('img'))
							// || !productLink?.includes(productIds[i])
							continue;

						let input: any = document.createElement('input');
						let picker: any = document.getElementById('sfyPicker');

						input.id = /^https?:/.test(products[i].getAttribute('href')!)
							? products[i].getAttribute('href')
							: 'https:' + products[i].getAttribute('href');
						input.className = 'SELLFORYOU-CHECKBOX';
						input.checked = picker?.value === 'false' ? false : true;
						input.type = 'checkbox';

						if (user.userInfo.collectCheckPosition === 'L') input.setAttribute('style', 'left: 0px !important');
						else input.setAttribute('style', 'right: 0px !important');

						products[i].style.position = 'relative';
						products[i].appendChild(input);

						count++;
					} catch (e) {
						continue;
					}
				}

			if (count > 0) return count;

			await sleep(1000 * 1);

			timeout++;
		}
	}

	async bulkTypeThree(user) {
		let timeout = 0;

		while (true) {
			if (timeout === 10) return 0;

			let count = 0;
			let products: any = document.querySelectorAll(
				'#node-gallery > div.module.m-o.m-o-large-all-detail > div > div a',
			);

			for (let i in products) {
				try {
					let image = products[i].querySelector('img');

					if (!image) continue;

					let input: any = document.createElement('input');
					let picker: any = document.getElementById('sfyPicker');

					input.id = /^https?:/.test(products[i].getAttribute('href'))
						? products[i].getAttribute('href')
						: 'https:' + products[i].getAttribute('href');
					input.className = 'SELLFORYOU-CHECKBOX';
					input.checked = picker?.value === 'false' ? false : true;
					input.type = 'checkbox';

					if (user.userInfo.collectCheckPosition === 'L') input.setAttribute('style', 'left: 0px !important');
					else input.setAttribute('style', 'right: 0px !important');

					products[i].style.position = 'relative';
					products[i].appendChild(input);

					count++;
				} catch (e) {
					continue;
				}
			}

			if (count > 0) return count;

			await sleep(1000 * 1);

			timeout++;
		}
	}
}
