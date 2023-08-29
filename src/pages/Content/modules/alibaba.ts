// 1688 콘텐츠 스크립트

import { checkLogin } from './common/auth';
import { form } from './common/data';
import { injectScript } from './common/utils';
import { sleep, getImageSize } from '../../Tools/Common';

// 상품정보 크롤링
async function scrape(items: any, user: any) {
	let result: any = form;

	result.user = user;

	// 페이지 타입에 따라 크롤링 다름
	if (items.ipageType === 1) {
		let thumnails: any = [];

		// 썸네일이미지
		let imgs: any = document.querySelectorAll('#dt-tab > div > ul img');

		for (let i in imgs) {
			try {
				if (imgs[i].parentNode.getAttribute('class') === 'box-img') {
					let img;

					if (imgs[i].getAttribute('data-lazy-src')) {
						img = imgs[i].getAttribute('data-lazy-src').replace(/.[0-9]{2}x[0-9]{2}/, '');
					} else {
						img = imgs[i].getAttribute('src').replace(/.[0-9]{2}x[0-9]{2}/, '');
					}

					thumnails.push(img);
				}
			} catch (e) {
				continue;
			}
		}

		// 상세페이지
		let desc_data: any = document.querySelector('#desc-lazyload-container');

		let desc_resp = await fetch(desc_data.getAttribute('data-tfs-url'));
		let desc_text = await desc_resp.text();

		desc_text = desc_text.slice(18, desc_text.length - 1);
		let desc_json = JSON.parse(desc_text);
		let desc_html: any = new DOMParser().parseFromString(desc_json.content, 'text/html');
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
					if (desc[i].src.includes('.gif')) {
						desc[i].parentNode.removeChild(desc[i]);
					} else {
						const image: any = await getImageSize(desc[i].src); //해당 이미지 사이즈가 100x100 이하 제거
						if (image < 1000) {
							// console.log('흰색 이미지', desc[i]);
							desc[i].parentNode.removeChild(desc[i]);
						} else {
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

		let desc_output: any = desc_html.querySelector('html > body').innerHTML;

		// 상품명
		let title: any = document.querySelector('#mod-detail-title > h1');

		// 상품기본정보(소싱처, URL, 상품ID, 상품명, 판매가, 이미지 등)
		result['item']['shopName'] = 'alibaba';
		result['item']['url'] = `https://detail.1688.com/offer/${items.iDetailConfig.offerid}.html`;
		result['item']['num_iid'] = items.iDetailConfig.offerid.toString();
		result['item']['title'] = title.textContent;
		result['item']['price'] = items.iDetailConfig.refPrice;
		result['item']['pic_url'] = thumnails[0];
		// result['item']['brand'] = "";
		result['item']['desc'] = desc_output;
		result['item']['desc_img'] = desc_imgs;
		result['item']['desc_text'] = desc_html
			.querySelector('html > body')
			.textContent.split('\n')
			.map((v: any) => v.trim())
			.filter((v: any) => v);
		result['item']['tmall'] = false;

		// 동영상
		try {
			let video: any = document.querySelector(
				'#mod-detail-bd > div.detail-v2018-layout-left > div.region-custom.region-detail-gallery.region-takla.ui-sortable.region-vertical > div > div > div',
			);
			let video_data = video.getAttribute('data-mod-config');
			let video_json = JSON.parse(video_data);
			if (video_json.videoId !== '0') {
				result['item']['video'] =
					'https://cloud.video.taobao.com/play/u/' + video_json.userId + '/p/1/e/6/t/1/' + video_json.videoId + '.mp4';
			}
		} catch (e) {
			console.log('알림: 동영상이 없는 상품입니다. (', e, ')');
		}

		// 썸네일이미지
		try {
			for (let i in thumnails) {
				try {
					// let image: any = await getImageSize(thumnails[i]);
					// if (image < 1000) {
					//   console.log("썸네일 흰색 이미지 발견", thumnails[i]);
					// } else {
					//   result["item"]["item_imgs"].push({
					//     url: thumnails[i],
					//   });
					// }
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

		// 옵션정보
		try {
			for (let i in items.iDetailData.sku.skuProps) {
				let sku_prop = items.iDetailData.sku.skuProps[i];

				for (let j in sku_prop.value) {
					if (sku_prop.value[j].imageUrl) {
						result['item']['prop_imgs']['prop_img'].push({
							properties: i + ':' + (i + j),
							url: sku_prop.value[j].imageUrl,
						});
					}

					result['item']['props_list'][(i + ':' + (i + j)).toString()] = sku_prop.prop + ':' + sku_prop.value[j].name;
				}
			}
		} catch (e) {
			console.log(e);
		}

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
			for (let i in items.iDetailData.sku.skuMap) {
				let properties = i.split('&gt;');

				let properties_id = '';
				let properties_name = '';

				for (let j = 0; j < properties.length; j++) {
					for (let k in result['item']['props_list']) {
						if (result['item']['props_list'][k].split(':')[1] === properties[j]) {
							if (j < properties.length) {
								properties_id += k;
								properties_name += k + ':' + result['item']['props_list'][k];
							}

							if (j < properties.length - 1) {
								properties_id += ';';
								properties_name += ';';
							}
						}
					}
				}

				let quantity = items.iDetailData.sku.skuMap[i].canBookCount;

				if (quantity > 0) {
					result['item']['skus']['sku'].push({
						price:
							items.iDetailData.sku.skuMap[i].discountPrice ??
							items.iDetailData.sku.discountPrice ??
							items.iDetailConfig.refPrice,
						total_price: 0,
						original_price:
							items.iDetailData.sku.skuMap[i].price ?? items.iDetailData.sku.price ?? items.iDetailConfig.refPrice,
						properties: properties_id,
						properties_name: properties_name,
						quantity:
							user.userInfo.collectStock === 0
								? quantity > 99999
									? '99999'
									: quantity.toString()
								: user.userInfo.collectStock.toString(),
						sku_id: items.iDetailData.sku.skuMap[i].skuId.toString(),
					});
				}
			}
		} catch (e) {
			console.log('에러: 옵션 세부정보를 가져오지 못했습니다. (', e, ')');

			return { error: '옵션 세부정보를 가져오지 못했습니다.' };
		}
	}

	if (items.ipageType === 2) {
		let subs = JSON.parse(items.offerDomain ?? items.iDetailData.offerDomain);

		subs.offerDetail.featureAttributes.map((v: any) => {
			result['item']['attr'].push(`${v.name}:${v.values[0]}`);
		});

		// 썸네일이미지
		let thumnails: any = [];

		for (let i in items.iDetailData.images) {
			let img = items.iDetailData.images[i].fullPathImageURI;
			let img_fixed = /^https?:/.test(img) ? img : 'http:' + img;

			thumnails.push(img_fixed);
		}

		// 상세페이지
		let desc_resp = await fetch(subs.offerDetail.detailUrl);
		let desc_text = await desc_resp.text();

		desc_text = desc_text.slice(18, desc_text.length - 1);

		let desc_json = JSON.parse(desc_text);
		let desc_html: any = new DOMParser().parseFromString(desc_json.content, 'text/html');

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

		// for (let i in desc) {
		//   try {
		//     if (desc[i].src) {
		//       desc[i].src = desc[i].src;
		//       desc_imgs.push(desc[i].src);
		//     }
		//   } catch (e) {
		//     continue;
		//   }
		// }
		for (let i in desc) {
			try {
				if (desc[i].src) {
					if (desc[i].src.includes('.gif')) {
						desc[i].parentNode.removeChild(desc[i]);
					} else {
						const image: any = await getImageSize(desc[i].src); //해당 이미지 사이즈가 100x100 이하 제거
						if (image < 1000) {
							// console.log('흰색 이미지', desc[i]);
							desc[i].parentNode.removeChild(desc[i]);
						} else {
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

		let desc_output: any = desc_html.querySelector('html > body').innerHTML;
		// 상세페이지 텍스트 추출
		let iterator = document.createNodeIterator(desc_html.querySelector('html > body'), NodeFilter.SHOW_TEXT);
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

		// 상품 기본정보
		result['item']['shopName'] = 'alibaba';
		result['item']['url'] = `https://detail.1688.com/offer/${items.iDetailData.offerBaseInfo.offerId}.html`;
		result['item']['num_iid'] = items.iDetailData.offerBaseInfo.offerId.toString();
		result['item']['title'] = subs.offerDetail.subject;
		result['item']['price'] = subs.tradeModel.minPrice;
		result['item']['pic_url'] = thumnails[0];
		// result['item']['brand'] = "";
		result['item']['desc'] = desc_output;
		result['item']['desc_img'] = desc_imgs;
		result['item']['tmall'] = false;
		result['item']['shop_id'] = 'alibaba';

		// 동영상
		try {
			let video = subs.offerDetail.wirelessVideo.videoUrls.android;

			result['item']['video'] = video;
		} catch (e) {
			console.log('알림: 동영상이 없는 상품입니다. (', e, ')');
		}

		// 썸네일이미지
		try {
			for (let i in thumnails) {
				try {
					// let image: any = await getImageSize(thumnails[i]);
					// if (image < 1000) {
					//   console.log("썸네일 흰색 이미지 발견", thumnails[i]);
					// } else {
					//   result["item"]["item_imgs"].push({
					//     url: thumnails[i],
					//   });
					// }
					result['item']['item_imgs'].push({
						url: thumnails[i],
					});
				} catch (e) {
					continue;
				}
			}
		} catch (e) {
			console.log(e);
		}

		// 옵션정보
		try {
			for (let i in items.iDetailData.skuModel.skuProps) {
				let sku_prop = items.iDetailData.skuModel.skuProps[i];

				for (let j in sku_prop.value) {
					if (sku_prop.value[j].imageUrl) {
						result['item']['prop_imgs']['prop_img'].push({
							properties: i + ':' + (i + j),
							url: /^https?:/.test(sku_prop.value[j].imageUrl)
								? sku_prop.value[j].imageUrl
								: 'http:' + sku_prop.value[j].imageUrl,
						});
					}

					result['item']['props_list'][(i + ':' + (i + j)).toString()] = sku_prop.prop + ':' + sku_prop.value[j].name;
				}
			}
		} catch (e) {
			console.log(e);
		}

		try {
			for (let i in items.iDetailData.skuModel.skuInfoMap) {
				let properties = i.split('&gt;');

				let properties_id = '';
				let properties_name = '';

				for (let j = 0; j < properties.length; j++) {
					for (let k in result['item']['props_list']) {
						if (result['item']['props_list'][k].split(':')[1] === properties[j]) {
							if (j < properties.length) {
								properties_id += k;
								properties_name += k + ':' + result['item']['props_list'][k];
							}

							if (j < properties.length - 1) {
								properties_id += ';';
								properties_name += ';';
							}
						}
					}
				}

				let quantity = items.iDetailData.skuModel.skuInfoMap[i].canBookCount;

				if (quantity > 0) {
					result['item']['skus']['sku'].push({
						price: items.iDetailData.skuModel.skuInfoMap[i].price ?? subs.tradeModel.minPrice,
						total_price: 0,
						original_price: items.iDetailData.skuModel.skuInfoMap[i].price ?? subs.tradeModel.minPrice,
						properties: properties_id,
						properties_name: properties_name,
						quantity:
							user.userInfo.collectStock === 0
								? quantity > 99999
									? '99999'
									: quantity.toString()
								: user.userInfo.collectStock.toString(),
						sku_id: items.iDetailData.skuModel.skuInfoMap[i].skuId.toString(),
					});
				}
			}
		} catch (e) {
			console.log('에러: 옵션 세부정보를 가져오지 못했습니다. (', e, ')');
		}
	}

	let min_price = parseFloat(result['item']['price']);

	// 최저가 계산 (판매가와 옵션최저가 비교해서 더 작은 값으로 할당)
	for (let i in result['item']['skus']['sku']) {
		if (i === '0') {
			min_price = parseFloat(result['item']['skus']['sku'][i]['price']);

			continue;
		}

		let cur_price = parseFloat(result['item']['skus']['sku'][i]['price']);

		if (min_price > cur_price) {
			min_price = cur_price;
		}
	}

	if (parseFloat(result['item']['price']) !== min_price) {
		result['item']['price'] = min_price.toString();
	}

	if (Object.keys(result.item.props_list).length > 0 && result.item.skus.sku.length === 0) {
		console.log('에러: 해당 상품은 일시적으로 품절되었습니다.');

		return { error: '해당 상품은 일시적으로 품절되었습니다.' };
	}

	return result;
}

export class alibaba {
	constructor() {
		checkLogin('alibaba').then((auth) => {
			if (!auth) {
				return null;
			}
		});
	}

	// 수집하기 눌렀을 때
	async get(user: any) {
		sessionStorage.removeItem('sfy-alibaba-item');

		injectScript('alibaba');

		let timeout = 0;

		while (true) {
			if (timeout === user.userInfo.collectTimeout) {
				return {
					error: '1688 접속상태가 원활하지 않습니다.\n잠시 후 다시시도해주세요.',
				};
			}

			let data = sessionStorage.getItem('sfy-alibaba-item');
			if (data) {
				let originalData = JSON.parse(data);

				// console.log(originalData);

				return await scrape(originalData, user);
			}

			timeout++;

			await sleep(1000 * 1);
		}
	}

	// 대량수집 페이지별 체크표시
	async bulkTypeOne(user) {
		document.addEventListener('DOMNodeInserted', function (e: any) {
			// console.log(e.target);

			try {
				if (
					e.target.getAttribute('class') === 'list' ||
					e.target.getAttribute('class') === 'space-offer-card-box' ||
					e.target.getAttribute('class').includes('normalcommon-offer-card')
				) {
					let products = e.target.querySelectorAll('a');

					for (let i in products) {
						try {
							if (
								products[i].parentNode.className === 'cate1688-offer b2b-ocms-fusion-comp' ||
								products[i].parentNode.className === 'mojar-element-image'
							) {
								let input = document.createElement('input');
								let picker: any = document.getElementById('sfyPicker');

								input.id = products[i].getAttribute('href');
								input.className = 'SELLFORYOU-CHECKBOX';
								input.checked = picker?.value === 'false' ? false : true;
								input.type = 'checkbox';

								if (user.userInfo.collectCheckPosition === 'L') {
									input.setAttribute('style', 'left: 0px !important');
								} else {
									input.setAttribute('style', 'right: 0px !important');
								}

								products[i].style.position = 'relative';
								products[i].appendChild(input);
							}
						} catch (e) {
							continue;
						}
					}
				}
			} catch (e) {
				return 0;
			}
		});
	}

	async bulkTypeTwo(user) {
		let timeout = 0;

		while (true) {
			if (timeout === 10) {
				return 0;
			}

			let count = 0;
			let products: any = document.querySelectorAll('#sm-offer-list a');

			for (let i in products) {
				try {
					if (products[i].parentNode.className === 'mojar-element-image') {
						let input = document.createElement('input');
						let picker: any = document.getElementById('sfyPicker');

						input.id = products[i].getAttribute('href');
						input.className = 'SELLFORYOU-CHECKBOX';
						input.checked = picker?.value === 'false' ? false : true;
						input.type = 'checkbox';

						if (user.userInfo.collectCheckPosition === 'L') {
							input.setAttribute('style', 'left: 0px !important');
						} else {
							input.setAttribute('style', 'right: 0px !important');
						}

						products[i].style.position = 'relative';
						products[i].appendChild(input);

						count++;
					}
				} catch (e) {
					continue;
				}
			}

			if (count > 0) {
				return count;
			}

			await sleep(1000 * 1);

			timeout++;
		}
	}
}
