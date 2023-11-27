import html2canvas from 'html2canvas';
import { checkLogin } from './common/auth';
import { form } from './common/data';
import { injectScript } from './common/utils';
import { sleep, getImageSize } from '../../Tools/Common';
import { Buffer } from 'buffer';
import { User } from '../../../type/type';

const iconv = require('iconv-lite');

/** 타오바오 상품정보 크롤링 */
const scrape = async (items: any, user: User) => {
	let result: any = form;

	result.user = user;

	// 상품속성
	let attributes: any = document.getElementsByClassName('attributes-list')[0].querySelectorAll('li');

	for (let i in attributes) {
		try {
			const text = attributes[i].textContent.trim();

			if (!text) continue;

			result['item']['attr'].push(text);
		} catch (e) {
			continue;
		}
	}

	let details = items.price;
	let configs = items.config;
	let script_video = items.video;
	let script_option = items.sku.valItemInfo.skuMap;
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
	let shipping_info = details.deliveryFee
		? details.deliveryFee.data.serviceInfo.hasOwnProperty('sku')
			? details.deliveryFee.data.serviceInfo.sku.default[0].info
			: details.deliveryFee.data.serviceInfo.list[0].info
		: '0.0';
	let shipping_fee = parseFloat(shipping_info.replace(/[^\.0-9]/g, ''));

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
	let desc_html: any = new DOMParser().parseFromString(items.desc, 'text/html');
	let desc: any = desc_html.querySelectorAll('html > body img');
	let desc_imgs: any = [];
	let descTable = desc_html.querySelectorAll('html > body table');
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
		let test = document.createElement('div');
		test.id = 'capture';
		test.innerHTML = descText;
		test.style.display = 'inline-block';
		document.body.appendChild(test);
		let canvas = await html2canvas(test, {
			useCORS: true,
			width: 750,
		});
		let canvas_output = canvas.toDataURL('image/png');

		test.remove();

		desc_imgs.push(canvas_output);
	}

	//html domparse는 이렇게 배열처럼 할수있음 .
	for (let i in desc) {
		try {
			if (desc[i].getAttribute('data-ks-lazyload')) desc[i].src = desc[i].getAttribute('data-ks-lazyload');
			if (desc[i].getAttribute('data-src')) desc[i].src = desc[i].getAttribute('data-src');
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

	let desc_output = desc_html.querySelector('html > body').innerHTML;

	// 상세페이지 텍스트 추출
	let iterator = document.createNodeIterator(desc_html.querySelector('html > body'), NodeFilter.SHOW_TEXT);
	let textnode;

	while ((textnode = iterator.nextNode())) {
		const texts = textnode.textContent
			.split('\n')
			.map((v: any) => v.trim())
			.filter((v: any) => v);

		texts.map((v: any) => result['item']['desc_text'].push(v));
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
		for (let i in configs.idata.item.auctionImages) {
			try {
				// let image: any = await getImageSize(
				//   /^https?:/.test(configs.idata.item.auctionImages[i]) ? configs.idata.item.auctionImages[i] : "http:" + configs.idata.item.auctionImages[i]
				// );
				// console.log("test", image);
				// if (image < 1000) {
				//   console.log(
				//     "썸네일 흰색 이미지 발견",
				//     /^https?:/.test(configs.idata.item.auctionImages[i]) ? configs.idata.item.auctionImages[i] : "http:" + configs.idata.item.auctionImages[i]
				//   );
				// } else {
				//   result["item"]["item_imgs"].push({
				//     url: /^https?:/.test(configs.idata.item.auctionImages[i]) ? configs.idata.item.auctionImages[i] : "http:" + configs.idata.item.auctionImages[i],
				//   });
				// }
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
	let options = document.querySelectorAll('#J_isku > div ul');

	for (let i in options) {
		try {
			let id = options[i].querySelectorAll('li');
			let name = options[i].getAttribute('data-property');

			for (let j in id) {
				try {
					let img: any = id[j].querySelector('a');
					let num: any = id[j].getAttribute('data-value');
					let val = img.textContent;
					let url = img.style.backgroundImage.length
						? img.style.backgroundImage.match(/(\/\/.*)"/)[1].replace(/_\d{2}x\d{2}.[a-zA-Z]{3}/, '')
						: '';

					if (url !== '')
						result['item']['prop_imgs']['prop_img'].push({
							properties: num,
							url: /^https?:/.test(url) ? url : 'http:' + url,
						});
					if (val !== null) {
						let value = val.trim() ?? items.sku.valItemInfo.propertyMemoMap[num];

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

	try {
		for (let i in script_option) {
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
				if (details.dynStock.sku.hasOwnProperty(i)) {
					let quantity = details.dynStock.sku[i].stock.toString();

					if (quantity !== '0') {
						let promotion_price = details.promotion.promoData[i]
							? details.promotion.promoData[i][0].price
							: details.originalPrice[i].price;

						result['item']['skus']['sku'].push({
							price: shipping_fee > 0 ? (parseFloat(promotion_price) + shipping_fee).toString() : promotion_price,
							total_price: 0,
							original_price: details.originalPrice.hasOwnProperty(i) ? details.originalPrice[i].price : '',
							properties: properties_id,
							properties_name: properties_name,
							quantity:
								user.userInfo.collectStock === 0
									? quantity > 99999
										? '99999'
										: quantity.toString()
									: user.userInfo.collectStock.toString(),
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
};

export class taobao {
	constructor() {
		checkLogin('taobao').then((auth) => {
			if (!auth) return null;
		});
	}

	// 수집하기 눌렀을 때
	async get(user: User) {
		sessionStorage.removeItem('sfy-taobao-item');

		injectScript('taobao');

		let timeout = 0;

		while (true) {
			if (timeout === user.userInfo.collectTimeout)
				return {
					error: '타오바오 접속상태가 원활하지 않습니다.\n잠시 후 다시시도해주세요.',
				};

			let data = sessionStorage.getItem('sfy-taobao-item');

			if (data) {
				let originalData = JSON.parse(data);

				try {
					// 상세페이지 파싱
					let descResp = await fetch(originalData.descUrl);
					let descBuffer = await descResp.arrayBuffer();
					let descText = iconv.decode(Buffer.from(descBuffer), 'gbk').toString();

					originalData = {
						...originalData,
						desc: descText,
					};

					console.log(originalData);

					return await scrape(originalData, user);
				} catch (e) {
					timeout = user.userInfo.collectTimeout;

					continue;
				}
			}

			timeout++;

			await sleep(1000 * 1);
		}
	}

	// 페이지별 대량수집 체크버튼 활성화
	async bulkTypeOne(user: User) {
		document.addEventListener('DOMNodeInserted', async (e: any) => {
			//콘솔테스트 예시
			//아래 항목의 products 항목만 좀 바꿔서 하면 됨 a태그 찾아서
			// console.log("DomNode", e.target);
			// let products: any = document.querySelectorAll(
			//   "#root > div > div:nth-child(2) > div.PageContent--contentWrap--mep7AEm > div.LeftLay--leftWrap--xBQipVc a"
			// );
			// console.log("products", products);
			try {
				if (e.target.getAttribute('class') === 'm-feedback') {
					//DomNode콘솔찍으면서 products에 상품 리스트가 모두 들어오고난 다음 e.target에 뜨는 고유의 class나 id를 해당 조건에 넣어서
					//배열이 다 모였을때 체크박스 뜨도록 하기위함
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

								if (user.userInfo.collectCheckPosition === 'L') input.setAttribute('style', 'left: 0px !important');
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
					// 	console.log('함수발동했는디');
					// 	console.log(json);
					// 	const start = json.indexOf('{');
					// 	const end = json.lastIndexOf('}');
					// 	const result = json.substring(start, end + 1);
					// 	console.log(JSON.parse(result));
					// }
					// console.log('여기왔느냐');
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
					// 	console.log({ resp });
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
									let input: any = document.createElement('input');
									let picker: any = document.getElementById('sfyPicker');
									input.id = products[i].getAttribute('href');
									input.className = 'SELLFORYOU-CHECKBOX';
									input.checked = picker?.value === 'false' ? false : true;
									input.type = 'checkbox';
									// input.setAttribute("style", "left: 0px !important");
									if (user.userInfo.collectCheckPosition === 'L') input.setAttribute('style', 'left: 0px !important');
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

						if (user.userInfo.collectCheckPosition === 'L') input.setAttribute('style', 'left: 0px !important');
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
