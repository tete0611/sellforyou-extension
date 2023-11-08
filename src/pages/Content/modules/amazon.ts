import { injectScript } from './common/utils';
import { request, sleep } from '../../Tools/Common';
import { form } from './common/data';
import { checkLogin } from './common/auth';
import { User } from '../../../type/type';

// 아마존 상품정보 크롤링
async function scrape(items: any, user: any, region: string) {
	let result: any = form;

	result.user = user;

	const sessionData = items.item;
	const sessionOtionData = items.optionItem;
	const sessionThumbnailData = items.thumbnailItem;

	const parseData = JSON.parse(sessionData);
	const parseThumbnailData = JSON.parse(sessionThumbnailData);
	const optionsLength = Object.keys(parseData.colorImages).length;
	const thumbnailLength = document.querySelectorAll('.imageThumbnail').length;

	// 옵션이 있는 상품 옵션데이터
	if (sessionOtionData) {
		let newObject = [];
		let sortLabel = {};
		let properties = {};

		const parseOtionData = JSON.parse(sessionOtionData);
		let valueData = parseOtionData.variationValues;
		let dimensions = parseOtionData.dimensions;
		let dimensionsDisplay = parseOtionData.dimensionsDisplay;

		for (let i = 0; i < dimensions.length; i++) {
			sortLabel[dimensions[i]] = dimensionsDisplay[i];
		}

		Object.keys(sortLabel).map((v: any, vIndex: any) => {
			if (!valueData[v]) {
				return;
			}

			valueData[v].map((w: any, wIndex: any) => {
				newObject[`${sortLabel[v]}:${w}`] = '';
				properties[`${vIndex}:${wIndex}`] = '';
			});
		});

		let index0 = 0;
		let index1 = 1;
		let index2 = 2;

		let properties_list: any = [];
		let properties_name_list: any = [];

		let properties0 = '';
		let properties1 = '';
		let properties2 = '';
		let name0 = '';
		let name1 = '';
		let name2 = '';

		const propertiesLength = parseOtionData.dimensions.length;

		for (let i = 0; i < propertiesLength; i++) {
			let aa = parseOtionData.dimensions[0];

			parseOtionData.variationValues[aa].map((v: any, i0: any) => {
				switch (propertiesLength) {
					case 1: {
						if (!parseOtionData.dimensionToAsinMap[i0]) {
							return;
						}

						properties0 = index0 + ':' + i0;

						name0 = parseOtionData.dimensionsDisplay[0] + ':' + v;

						properties_list.push(properties0);
						properties_name_list.push(properties0 + ':' + name0);

						break;
					}

					case 2: {
						let bb = parseOtionData.dimensions[1];

						parseOtionData.variationValues[bb].map((w: any, i1: any) => {
							let skuidInfo = i0 + '_' + i1;

							if (!parseOtionData.dimensionToAsinMap[skuidInfo]) {
								return;
							}

							properties0 = index0 + ':' + i0;
							properties1 = index1 + ':' + i1;

							name0 = parseOtionData.dimensionsDisplay[0] + ':' + v;
							name1 = parseOtionData.dimensionsDisplay[1] + ':' + w;

							properties_list.push(properties0 + ';' + properties1);
							properties_name_list.push(properties0 + ':' + name0 + ';' + properties1 + ':' + name1);
						});

						break;
					}

					case 3: {
						let bb = parseOtionData.dimensions[1];
						let cc = parseOtionData.dimensions[2];

						parseOtionData.variationValues[bb].map((w: any, i1: any) => {
							parseOtionData.variationValues[cc].map((z: any, i2: any) => {
								let skuidInfo = i0 + '_' + i1 + '_' + i2;

								if (!parseOtionData.dimensionToAsinMap[skuidInfo]) {
									return;
								}

								properties0 = index0 + ':' + i0;
								properties1 = index1 + ':' + i1;
								properties2 = index2 + ':' + i2;

								name0 = parseOtionData.dimensionsDisplay[0] + ':' + v;
								name1 = parseOtionData.dimensionsDisplay[1] + ':' + w;
								name2 = parseOtionData.dimensionsDisplay[2] + ':' + z;

								properties_list.push(properties0 + ';' + properties1 + ';' + properties2);
								properties_name_list.push(
									properties0 + ':' + name0 + ';' + properties1 + ':' + name1 + ';' + properties2 + ':' + name2,
								);
							});
						});

						break;
					}
				}
			});
		}

		let dispalyValuesLength = Object.values(parseOtionData.dimensionToAsinMap).length;
		const parentAsin = parseOtionData.parentAsin;

		const skuNumSort = Object.fromEntries(
			Object.entries(parseOtionData.dimensionToAsinMap).sort(([a], [b]) => {
				const inputA = a.split('_');
				const inputB = b.split('_');

				let outputA = ``;
				let outputB = ``;

				inputA.map((v: any) => (outputA += v.padStart(4, '0')));
				inputB.map((v: any) => (outputB += v.padStart(4, '0')));

				return Number(outputA) - Number(outputB) > 0 ? 1 : -1;
			}),
		);

		// 가격정보 가져오기
		const priceList = await Promise.all(
			Object.values(skuNumSort).map(async (asin: any) => {
				switch (region) {
					case 'jp': {
						var resp: any = await request(
							`https://www.amazon.co.jp/gp/twister/ajaxv2?&acAsin=${parentAsin}sid=141-7145968-2426033&ptd=BOOT&sCac=1&twisterView=glance&pgid=apparel_display_on_website&rid=0TVZCED6SB5V5K56VSEM&auiAjax=1&json=1&dpxAjaxFlag=1&isUDPFlag=1&ee=2&originalHttpReferer=https://www.amazon.com/&parentAsin=${parentAsin}&enPre=1&storeID=apparel&ppw=&ppl=&isFlushing=2&dpEnvironment=softlines&asinList=${asin}&id=${asin}&mType=partial&psc=1`,
							{
								method: 'GET',
							},
						);

						break;
					}

					case 'de': {
						var resp: any = await request(
							`https://www.amazon.de/gp/twister/ajaxv2?&acAsin=${parentAsin}sid=141-7145968-2426033&ptd=BOOT&sCac=1&twisterView=glance&pgid=apparel_display_on_website&rid=0TVZCED6SB5V5K56VSEM&auiAjax=1&json=1&dpxAjaxFlag=1&isUDPFlag=1&ee=2&originalHttpReferer=https://www.amazon.com/&parentAsin=${parentAsin}&enPre=1&storeID=apparel&ppw=&ppl=&isFlushing=2&dpEnvironment=softlines&asinList=${asin}&id=${asin}&mType=partial&psc=1`,
							{
								method: 'GET',
							},
						);

						break;
					}

					default: {
						var resp: any = await request(
							`https://www.amazon.com/gp/twister/ajaxv2?&acAsin=${parentAsin}sid=141-7145968-2426033&ptd=BOOT&sCac=1&twisterView=glance&pgid=apparel_display_on_website&rid=0TVZCED6SB5V5K56VSEM&auiAjax=1&json=1&dpxAjaxFlag=1&isUDPFlag=1&ee=2&originalHttpReferer=https://www.amazon.com/&parentAsin=${parentAsin}&enPre=1&storeID=apparel&ppw=&ppl=&isFlushing=2&dpEnvironment=softlines&asinList=${asin}&id=${asin}&mType=partial&psc=1`,
							{
								method: 'GET',
							},
						);
					}
				}

				const resp_parse = JSON.parse(('[' + resp.trim() + ']').replace(/&&&/g, ','));

				const matched1 = resp_parse.find((v: any) => v.FeatureName === 'apex_desktop');
				const matched2 = resp_parse.find((v: any) => v.FeatureName === 'twister-slot-price_feature_div');

				let textHtml = new DOMParser().parseFromString(matched1.Value.content.apex_desktop, 'text/html');
				let textInPrice = textHtml.querySelector('.a-offscreen');

				let price = matched2.Value.content.priceToSet ?? textInPrice?.innerHTML;

				if (region === 'de') {
					price = price.replace(',', '.');
				}

				return price.replace(/[^0-9.]/g, '');
			}),
		);

		for (let i = 0; i < dispalyValuesLength; i++) {
			if (!priceList[i]) {
				result['item']['price'] = priceList[i];
				break;
			}
		}

		let valuesLength = 0;
		let totalValuesLength = 1;

		Object.keys(parseOtionData.variationValues).map((v: any) => {
			valuesLength += parseOtionData.variationValues[v].length;
		});

		Object.keys(parseOtionData.variationValues).map((v: any) => {
			totalValuesLength *= parseOtionData.variationValues[v].length;
		});

		for (let i = 0; i < valuesLength; i++) {
			result['item']['props_list'][Object.keys(properties)[i]] = Object.keys(newObject)[i];
		}

		for (let i = 0; i < totalValuesLength; i++) {
			if (!priceList[i]) {
				continue;
			}

			result['item']['skus']['sku'].push({
				price: priceList[i],
				total_price: 0,
				original_price: 0,
				properties: properties_list[i],
				properties_name: properties_name_list[i],
				quantity: user.userInfo.collectStock === 0 ? '99999' : user.userInfo.collectStock.toString(),
				sku_id: Object.values(skuNumSort)[i],
			});
		}

		const visualImg = parseData.visualDimensions.length;
		// console.log('test', visualImg);
		let optionProperties: any = [];

		try {
			parseOtionData.variationValues[parseData.visualDimensions[0]].map((v: any) => {
				switch (visualImg) {
					case 1: {
						optionProperties.push(v);

						break;
					}

					case 2: {
						parseOtionData.variationValues[parseData.visualDimensions[1]].map((w: any) => {
							optionProperties.push(v + ' ' + w);
						});

						break;
					}

					case 3: {
						parseOtionData.variationValues[parseData.visualDimensions[1]].map((w: any) => {
							parseOtionData.variationValues[parseData.visualDimensions[2]].map((z: any) => {
								optionProperties.push(v + ' ' + w + ' ' + z);
							});
						});

						break;
					}
				}
			});
		} catch {
			return { error: '재고가 없는 상품입니다.' };
		}

		let colorImages: any = [];
		optionProperties.map((v: any) => {
			try {
				colorImages.push(parseData.colorImages[v][0].large);
			} catch (e) {
				//
			}
		});

		let optionIndex: number = 0;
		parseOtionData.dimensions.map((v: any) => {
			switch (v) {
				case 'color_name': {
					optionIndex = parseOtionData.dimensions.findIndex((v: any) => v === 'color_name');

					break;
				}

				case 'style_name': {
					optionIndex = parseOtionData.dimensions.findIndex((v: any) => v === 'style_name');

					break;
				}
			}
		});

		for (let i = 0; i < optionsLength; i++) {
			try {
				if (colorImages[i].split('png').length - 1 < 2) {
					result['item']['prop_imgs']['prop_img'].push({
						properties: optionIndex + ':' + [i],
						url: colorImages[i].replace(/[.]_[_][.]/g, '.US800_AC.'),
					});
				} else {
					result['item']['prop_imgs']['prop_img'].push({
						properties: optionIndex + ':' + [i],
						url: colorImages[i],
					});
				}
			} catch (e) {
				continue;
			}
		}

		let min_price = parseFloat(result['item']['price']);

		// 판매가와 옵션최저가 중 낮은 값으로 할당
		try {
			if (dispalyValuesLength > 0) {
				let priceList = result['item']['skus']['sku'].map((v: any) => {
					return v.price;
				});

				min_price = Math.min(...priceList);

				for (let i in result['item']['props_list']) {
					let matched = false;

					for (let j in result['item']['skus']['sku']) {
						if (result['item']['skus']['sku'][j]['properties'].includes(i)) {
							matched = true;

							break;
						}
					}

					if (matched) {
						continue;
					}

					delete result['item']['props_list'][i];
				}
			}
		} catch (e) {
			console.log('에러: 옵션 가격정보를 가져오지 못했습니다. (', e, ')');
		}

		if (parseFloat(result['item']['price']) !== min_price) {
			result['item']['price'] = min_price.toString();
		}
	}

	let descs1: any = document.querySelectorAll('#aplus_feature_div img');
	let descs2: any = document.querySelectorAll('#aplus3p_feature_div img');
	let descs3: any = document.querySelectorAll('.aplus-v2 img');

	if (descs1.length != '0' && descs3.length != '0') {
		for (let i in descs1) {
			try {
				let desc = descs1[i].getAttribute('src');
				let lazyDesc = descs1[i].dataset.src;
				if (lazyDesc == undefined) {
					result['item']['desc_img'].push(desc);
				} else {
					result['item']['desc_img'].push(lazyDesc);
				}
			} catch (e) {
				continue;
			}
		}
	} else if (descs2.length != '0' && descs3.length != '0') {
		for (let i in descs2) {
			try {
				let desc = descs2[i].getAttribute('src');
				let lazyDesc = descs2[i].dataset.src;

				if (lazyDesc == undefined) {
					result['item']['desc_img'].push(desc);
				} else {
					result['item']['desc_img'].push(lazyDesc);
				}
			} catch (e) {
				continue;
			}
		}
	} else if (descs1.length != '0') {
		for (let i in descs1) {
			try {
				let desc = descs1[i].getAttribute('src');
				let lazyDesc = descs1[i].dataset.src;

				if (lazyDesc == undefined) {
					result['item']['desc_img'].push(desc);
				} else {
					result['item']['desc_img'].push(lazyDesc);
				}
			} catch (e) {
				continue;
			}
		}
	} else if (descs2.length != '0') {
		for (let i in descs2) {
			try {
				let desc = descs2[i].getAttribute('src');
				let lazyDesc = descs2[i].dataset.src;

				if (lazyDesc == undefined) {
					result['item']['desc_img'].push(desc);
				} else {
					result['item']['desc_img'].push(lazyDesc);
				}
			} catch (e) {
				continue;
			}
		}
	} else if (descs3.length != '0') {
		for (let i in descs3) {
			try {
				let desc = descs3[i].getAttribute('src');
				let lazyDesc = descs3[i].dataset.src;

				if (lazyDesc == undefined) {
					result['item']['desc_img'].push(desc);
				} else {
					result['item']['desc_img'].push(lazyDesc);
				}
			} catch (e) {
				continue;
			}
		}
	}

	let desc_output = `<p>`;

	result.item.desc_img.map((v: any) => {
		desc_output += `<img src=${v.replace(/[.]_[_][.]/g, '.US800_AC.')} align=\"absmiddle\">`;
	});

	//1. dom to string
	//2. string to virtual dom
	//3. remove script
	//4. desc_text

	let desc_text = document.querySelector('#feature-bullets');
	let desc_html = new DOMParser().parseFromString(desc_text?.outerHTML ?? '', 'text/html');
	let desc_result = desc_html?.querySelector('#feature-bullets');

	const scripts = desc_result?.getElementsByTagName('script') ?? [];

	for (let i = 0; i < scripts?.length; i++) {
		try {
			scripts[i].remove();
		} catch (e) {
			//
		}
	}

	if (desc_result) {
		let iterator = document.createNodeIterator(desc_result, NodeFilter.SHOW_TEXT);
		let textnode;

		while ((textnode = iterator.nextNode())) {
			const texts = textnode.textContent
				.split('\n')
				.map((v: any) => v.trim())
				.filter((v: any) => v);

			texts.map((v: any) => {
				result['item']['desc_text'].push(v);
			});
		}

		if (desc_result.innerHTML) {
			desc_output += desc_result.innerHTML + '</p>';

			result['item']['desc'] = desc_output;
		}
	}

	let price = document.querySelector('#corePrice_feature_div > div > span > span.a-offscreen')?.innerHTML ?? '0';

	if (region === 'de') {
		price = price.replace(',', '.');
	}

	price = price.replace(/[^0-9.]/g, '');

	if (!sessionOtionData) {
		if (price === '0') {
			return { error: '가격정보를 찾을 수 없습니다.' };
		} else {
			result['item']['price'] = price;
		}
	}
	// console.log("test", parseThumbnailData);
	for (let i = 0; i < thumbnailLength; i++) {
		try {
			// if (parseThumbnailData.colorImages.initial[i].hiRes.split("png").length - 1 < 2) {
			//   result["item"]["item_imgs"].push({
			//     // url: parseThumbnailData.colorImages.initial[i].hiRes.replace(/[.]_[_][.]/g, ".US800_AC."),
			//     url: parseThumbnailData.colorImages.initial[i].hiRes.replace(/[.]_[_][.]/g, "."),
			//   });
			// } else {
			//   result["item"]["item_imgs"].push({
			//     url: parseThumbnailData.colorImages.initial[i].hiRes,
			//   });
			// }
			result['item']['item_imgs'].push({
				// url: parseThumbnailData.colorImages.initial[i].hiRes.replace(/[.]_[_][.]/g, ".US800_AC."),
				url: parseThumbnailData.colorImages.initial[i].hiRes.replace(/(._[\w\d]+_.)/g, '.'),
			});
		} catch (e) {
			continue;
		}
	}

	try {
		let video = parseData.videos[0].url;
		result['item']['video'] = video;
	} catch (e) {
		console.log('알림: 동영상이 없는 상품입니다. (', e, ')');
	}

	result['item']['pic_url'] = parseThumbnailData.colorImages.initial[0].large;
	result['item']['title'] = document.getElementById('productTitle')?.textContent?.trim();
	result['item']['num_iid'] = parseData.parentAsin;

	switch (region) {
		case 'jp': {
			result['item']['url'] = `https://www.amazon.co.jp/dp/${parseData.parentAsin}`;

			break;
		}

		case 'de': {
			result['item']['url'] = `https://www.amazon.de/dp/${parseData.parentAsin}`;

			break;
		}

		default: {
			result['item']['url'] = `https://www.amazon.com/dp/${parseData.parentAsin}`;

			break;
		}
	}

	result['item']['shopName'] = `amazon-${region}`;
	result['item']['shop_id'] = `amazon-${region}`;

	return result;
}

export class amazon {
	async get(user: User, region: string) {
		checkLogin(`amazon-${region}`).then((auth) => {
			if (!auth) {
				return null;
			}
		});

		sessionStorage.removeItem('sfy-amazon-item');

		injectScript('amazon');

		let timeout = 0;

		while (true) {
			if (timeout === user.userInfo.collectTimeout) {
				return {
					error: '아마존 접속상태가 원활하지 않습니다.\n잠시 후 다시시도해주세요.',
				};
			}

			let data = sessionStorage.getItem('sfy-amazon-item');

			if (data) {
				let originalData = JSON.parse(data);

				return await scrape(originalData, user, region);
			}

			timeout++;

			await sleep(1000 * 1);
		}
	}

	async bulkTypeOne(user, nation: any) {
		document.addEventListener('DOMNodeInserted', (e: any) => {
			try {
				if (e.target.tagName == 'A') {
					const check: any = document.querySelectorAll('.a-spacing-base');
					const checks = [...check].filter(
						(container) =>
							container.className === 'a-section a-spacing-base' || 'a-section a-spacing-base a-text-center',
					);

					for (let i in checks) {
						try {
							const product = checks[i].querySelector('.s-no-outline');
							const temp = checks[i].querySelector('.SELLFORYOU-CHECKBOX');

							if (temp) {
								continue;
							}

							let input = document.createElement('input');
							let picker: any = document.getElementById('sfyPicker');

							input.id = nation + product.getAttribute('href');
							input.className = 'SELLFORYOU-CHECKBOX';
							input.checked = picker?.value === 'false' ? false : true;
							input.type = 'checkbox';

							if (user.userInfo.collectCheckPosition === 'L') {
								input.setAttribute('style', 'left: 0px !important');
							} else {
								input.setAttribute('style', 'right: 0px !important');
							}

							checks[i].style.position = 'relative';
							checks[i].appendChild(input);
						} catch (e) {
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

	async bulkTypeTwo(user, nation: any) {
		document.addEventListener('DOMNodeInserted', (e: any) => {
			let check: any = '';

			try {
				if (e.target.tagName == 'LI') {
					switch (nation) {
						case 'amazon.com': {
							check = document.querySelectorAll('.ProductGridItem__imageContainer__30eVr');

							break;
						}

						case 'amazon.co.jp': {
							check = document.querySelectorAll('.ProductGridItem__imageContainer__Ts5N_');

							break;
						}

						case 'amazon.de': {
							check = document.querySelectorAll('.ProductGridItem__imageContainer__30eVr');

							break;
						}
					}

					const products: any = [];

					for (let i in check) {
						let test = check[i].children;

						for (let i in test) {
							if (test[i].href) {
								products.push(test[i].href);
							}
						}
					}

					for (let i in products) {
						const temp = check[i].querySelector('.SELLFORYOU-CHECKBOX');

						if (temp) {
							continue;
						}

						let input = document.createElement('input');
						let picker: any = document.getElementById('sfyPicker');

						input.id = products[i];
						input.className = 'SELLFORYOU-CHECKBOX';
						input.checked = picker?.value === 'false' ? false : true;
						input.type = 'checkbox';

						if (user.userInfo.collectCheckPosition === 'L') {
							input.setAttribute('style', 'left: 0px !important');
						} else {
							input.setAttribute('style', 'right: 0px !important');
						}

						check[i].style.position = 'relative';
						check[i].appendChild(input);
					}

					return;
				}
			} catch (e) {
				//
			}
		});
	}
}
