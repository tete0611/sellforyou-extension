import gql from '../Main/GraphQL/Requests';
import QUERIES from '../Main/GraphQL/Queries';
import MUTATIONS from '../Main/GraphQL/Mutations';

import {
	convertWebpToJpg,
	getStoreTraceCodeV1,
	notificationByEveryTime,
	readFileDataURL,
	request,
	sendCallback,
	sleep,
	transformContent,
} from './Common';
import { createTabCompletely, sendTabMessage } from './ChromeAsync';
import { product } from '../../containers/stores/product';
import { common } from '../../containers/stores/common';

// 스마트스토어 이미지업로드
export async function uploadA077Images(image_list: string[]) {
	let image_data: { index: string; data: any }[] = [];

	for (let i in image_list) {
		let result = await fetch(image_list[i]);

		if (result.status !== 200) {
			continue;
		}

		let formData = new FormData();

		let blob: any = await result.blob();

		// 이미지 확장자별 예외처리
		switch (blob.type) {
			case 'image/jpeg': {
				formData.append('files[' + i.toString() + ']', blob, 'image.jpg');

				break;
			}

			case 'image/gif': {
				formData.append('files[' + i.toString() + ']', blob, 'image.gif');

				break;
			}

			case 'image/png': {
				formData.append('files[' + i.toString() + ']', blob, 'image.png');

				break;
			}

			case 'image/bmp': {
				formData.append('files[' + i.toString() + ']', blob, 'image.bmp');

				break;
			}

			case 'image/webp': {
				let base64: any = await readFileDataURL(blob);
				let blob2: any = await convertWebpToJpg(base64);

				formData.append('files[' + i.toString() + ']', blob2, 'image.jpg');

				break;
			}

			default: {
				break;
			}
		}
		/** 업로드 API */
		// 간혹 452 에러를 반환할때가 있음 (리소스저작권 문제나 네트워크 문제같은데 확실하지 않음)
		// 버전1 : https://sell.smartstore.naver.com/api/file/photoinfra/uploads?acceptedPatterns=image%2Fjpeg,image%2Fgif,image%2Fpng,image%2Fbmp
		// 버전2(현재) : https://sell.smartstore.naver.com/api/v2/product-photos/uploads?acceptedPatterns=image%2Fjpeg,image%2Fgif,image%2Fpng,image%2Fbmp
		let image_resp: any = await request(
			'https://sell.smartstore.naver.com/api/v2/product-photos/uploads?acceptedPatterns=image%2Fjpeg,image%2Fgif,image%2Fpng,image%2Fbmp',
			{
				method: 'POST',
				body: formData,
			},
		);

		let image_json = await JSON.parse(image_resp);

		image_data.push({
			index: i,
			data: image_json,
		});
	}

	return image_data;
}

// 스마트스토어 리소스업로드 (이미지 & 동영상)
export async function uploadA077Resources(input: any) {
	try {
		let image_list: string[] = [];

		for (let i in input) {
			if (i.match(/img[0-9]/) && !i.includes('blob')) {
				if (input[i] !== '') {
					try {
						let img: string = input[i].includes('http://') ? input[i].replaceAll('http://', 'https://') : input[i];
						image_list.push(img);
					} catch {
						continue;
					}
				}
			}
		}
		let image_data = await uploadA077Images(image_list);

		let image_sort: any = image_data.sort(function (a, b) {
			return parseFloat(a.index) - parseFloat(b.index);
		});

		let image_output: any = [];

		for (let i in image_sort) {
			image_output.push(image_sort[i]['data'][0]);
		}

		if (input.misc1 === '') {
			return {
				image: image_output,
				video: null,
			};
		} else {
			try {
				// 동영상 업로드
				let video_resp = await fetch(input.misc1);
				let video_blob: any = await video_resp.blob();
				let video_chunks: any = [];
				let video_filename = 'video.mp4';

				// 고정값
				let chunk_size = 5242880;

				// 비디오 분할 (최대 204개)
				for (let i = 0; i < 204; i++) {
					let start = i * chunk_size;
					let end = (i + 1) * chunk_size;

					if (video_blob.size >= end) {
						video_chunks.push(video_blob.slice(start, end));
					} else {
						video_chunks.push(video_blob.slice(start, video_blob.size));

						break;
					}
				}

				// 업로드 토큰 생성
				let token_resp: any = await request(
					'https://sell.smartstore.naver.com/api/videoinfra/SELLER/bypass/token?durationLimit=900&fileSizeLimit=1073741824',
					{
						method: 'GET',
					},
				);

				let token_json = await JSON.parse(token_resp);

				let session_body = {
					token: token_json.token,
					userId: parseInt(token_json.data.userId),
					serviceId: 21,
					chunkSize: chunk_size,
					fileName: video_filename,
					fileSize: video_blob.size,
					chunkUpload: true,
					delayIngestion: 'additional',
				};

				// 업로드 세션 생성
				let session_resp: any = await request('https://warp.vod.naver.com/upload/v2/sessions', {
					method: 'POST',
					body: JSON.stringify(session_body),
				});

				let session_json = await JSON.parse(session_resp);

				if (!session_json.hasOwnProperty('key')) {
					return {
						image: image_output,
						video: null,
					};
				}

				// 동영상 데이터를 쪼개어 폼데이터에 저장
				for (let i = 0; i < video_chunks.length; i++) {
					let formData = new FormData();

					formData.append('key', session_json.key);
					formData.append('fileName', video_filename);
					formData.append('fileSize', video_blob.size);
					formData.append('chunkIndex', `${i + 1}`);
					formData.append('chunkSize', `${chunk_size}`);
					formData.append('currentChunkSize', video_chunks[i].size);
					formData.append('chunkUpload', `${true}`);
					formData.append('file', video_chunks[i], video_filename);

					// 동영상 업로드 API
					await request('https://warp-cr1.vod.naver.com/upload/v2/files', {
						method: 'POST',
						body: formData,
					});
				}

				let addinfo_body = {
					encodeType: 'normal',
					previewStartTime: 0,
					previewEndTime: 0,
					previewTime: 0,
					channel: null,
					logoId: null,
					secureHls: false,
					aniGifStartTimeSec: 0,
					aniGifDurationSec: 10,
				};

				// 업로드 부가정보
				await request('https://warp.vod.naver.com/upload/v2/files/' + session_json.key + '/additionalInfo', {
					method: 'POST',
					body: JSON.stringify(addinfo_body),
				});

				let video_timeout = 0;
				let video_output: any = {};

				while (true) {
					if (video_timeout === 10) {
						return {
							image: image_output,
							video: null,
						};
					}

					// 동영상 업로드 진행상태 조회 API
					let vid_resp: any = await request('https://nexus.vod.naver.com/api/v1/files', {
						method: 'POST',
						body: JSON.stringify({
							query:
								'{\n  _0_0: video(id: "' +
								session_json.key +
								'", type: ["Ingest", "VideoHeader"]) {\n    type\n    status\n    data {\n      ...ingest\n      ...videoHeader\n    }\n    errors {\n      code\n      message\n    }\n  }\n}\n\nfragment ingest on Ingest {\n  videoId\n  encodeType\n}\n\nfragment videoHeader on VideoHeader {\n  videoCodec\n  videoBitrate\n  audioCodec\n  audioBitrate\n  audioSamplingRate\n  audioChannel\n  audioSamplingBit\n  duration\n  width\n  height\n  fps\n  rotation\n  fileSize\n}\n',
						}),
					});

					let vid_json = JSON.parse(vid_resp).data._0_0;

					for (let i in vid_json) {
						if (vid_json[i].data.length > 0) {
							video_output[vid_json[i].type] = vid_json[i].data;
						}
					}

					let vinfo_resp: any = await request('https://nexus.vod.naver.com/api/v1/files', {
						method: 'POST',
						body: JSON.stringify({
							query:
								'{\n  _0_0: video(id: "' +
								session_json.key +
								'", type: ["VideoHashCode", "Thumbnails", "Encoding", "Hls", "AbrHls"]) {\n    type\n    status\n    data {\n      ...videoHashCode\n      ...thumbnails\n      ...encoding\n      ...hls\n      ...abrHls\n    }\n    errors {\n      code\n      message\n    }\n  }\n}\n\nfragment videoHashCode on VideoHashCode {\n  videoMD5\n  videoSHA256\n}\n\nfragment thumbnails on Thumbnails {\n  type\n  path\n  timeMark\n}\n\nfragment encoding on Encoding {\n  encoding\n  complete\n  percentage\n  totalFrames\n  qualityId\n}\n\nfragment hls on Hls {\n  status\n  qualityId\n}\n\nfragment abrHls on AbrHls {\n  status\n}\n',
						}),
					});

					let vinfo_json = JSON.parse(vinfo_resp).data._0_0;

					for (let i in vinfo_json) {
						if (vinfo_json[i].data.length > 0) {
							video_output[vinfo_json[i].type] = vinfo_json[i].data;
						}
					}

					if (
						video_output.hasOwnProperty('Ingest') &&
						video_output.hasOwnProperty('VideoHeader') &&
						video_output.hasOwnProperty('VideoHashCode') &&
						video_output.hasOwnProperty('Thumbnails')
					) {
						let vthum_resp = await fetch('https://sell.smartstore.naver.com/api/file/photoinfra/uploadUrl', {
							headers: {
								accept: '*/*',
								'accept-language': 'ko,ko-KR;q=0.9,en-US;q=0.8,en;q=0.7',
								'cache-control': 'no-cache',
								'content-type': 'application/json;charset=UTF-8',
								pragma: 'no-cache',
								'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
								'sec-ch-ua-mobile': '?0',
								'sec-fetch-dest': 'empty',
								'sec-fetch-mode': 'cors',
								'sec-fetch-site': 'same-origin',
								'x-current-state': 'https://sell.smartstore.naver.com/#/products/edit/5824657518',
								'x-current-statename': 'main.product.edit',
								'x-to-statename': 'main.product.edit',
							},

							referrer: 'https://sell.smartstore.naver.com/',
							referrerPolicy: 'strict-origin-when-cross-origin',
							body: '{"url":"' + video_output.Thumbnails[0].path + '"}',
							method: 'POST',
							mode: 'cors',
							credentials: 'include',
						});

						let vthum_json = await vthum_resp.json();

						video_output['Picture'] = vthum_json;

						break;
					}

					video_timeout++;

					await sleep(1000 * 1);
				}

				video_timeout = 0;

				while (true) {
					if (video_timeout === 30) {
						return {
							image: image_output,
							video: null,
						};
					}

					// 인코딩 결과 조회 API
					let encode_resp: any = await request(
						'https://sell.smartstore.naver.com/api/videoinfra/SELLER/' + video_output.Ingest[0].videoId + '/encoding',
						{
							method: 'GET',
						},
					);

					let encode_json = JSON.parse(encode_resp);

					// 동영상 썸네일 API
					let gif_resp: any = await request(
						'https://sell.smartstore.naver.com/api/videoinfra/SELLER/' +
							video_output.Ingest[0].videoId +
							'/animated-gif',
						{
							method: 'GET',
						},
					);

					let gif_json = JSON.parse(gif_resp);

					if (encode_json.result && gif_json.hasOwnProperty('imageUrl')) {
						video_output['Complete'] = encode_json;
						video_output['GIF'] = gif_json;

						break;
					}

					video_timeout++;

					await sleep(1000 * 1);
				}

				return {
					image: image_output,
					video: video_output,
				};
			} catch (e) {
				console.log(e);

				return {
					image: image_output,
					video: null,
				};
			}
		}
	} catch (e) {
		console.log(e);

		return {
			image: null,
			video: null,
		};
	}
}

// 스마트스토어 상품등록
export async function uploadA077Products(data: any) {
	const resp_text: any = await request('https://sell.smartstore.naver.com/api/products', {
		headers: {
			'content-type': 'application/json;charset=UTF-8',
			'x-current-state': 'https://sell.smartstore.naver.com/#/products/create',
			'x-current-statename': 'main.product.create',
			'x-to-statename': 'main.product.create',
		},

		body: data,
		method: 'POST',
	});

	const resp_json = JSON.parse(resp_text);

	return resp_json;
}

// 스마트스토어 상품수정
export async function editedA077Products(data: any) {
	const resp_text: any = await request('https://sell.smartstore.naver.com/api/products', {
		headers: {
			'content-type': 'application/json;charset=UTF-8',
			'x-current-state': 'https://sell.smartstore.naver.com/#/products/edit',
			'x-current-statename': 'main.product.edit',
			'x-to-statename': 'main.product.edit',
		},

		body: data,
		method: 'PATCH',
	});

	const resp_json = JSON.parse(resp_text);

	return resp_json;
}

// 스마트스토어 상품조회
export async function searchA077Products(data: any) {
	const resp_text: any = await request('https://sell.smartstore.naver.com/api/products/list/search', {
		headers: {
			'content-type': 'application/json;charset=UTF-8',
			'x-current-state': 'https://sell.smartstore.naver.com/#/products/origin-list',
			'x-current-statename': 'main.product.origin-list',
			'x-to-statename': 'main.product.origin-list',
		},

		body: data,
		method: 'POST',
	});

	const resp_json = JSON.parse(resp_text);

	return resp_json;
}

// 스마트스토어 상품삭제
export async function deleteA077Products(data: any) {
	const resp_text: any = await request(
		'https://sell.smartstore.naver.com/api/products/bulk-update?_action=updateProductStatusType',
		{
			headers: {
				'content-type': 'application/json;charset=UTF-8',
				'x-current-state': 'https://sell.smartstore.naver.com/#/products/origin-list',
				'x-current-statename': 'main.product.origin-list',
				'x-to-statename': 'main.product.origin-list',
			},

			body: data,
			method: 'PATCH',
		},
	);

	const resp_json = JSON.parse(resp_text);

	return resp_json;
}

// 스마트스토어 상품등록
export async function uploadSmartStore(productStore: product, commonStore: common, data: any) {
	if (!data) {
		return false;
	}

	let newTab: any = {};
	let shopName = data.DShopInfo.site_name;

	console.log(`(${shopName}) 등록정보:`, data);

	try {
		let user_resp = await fetch('https://sell.smartstore.naver.com/api/products?_action=create');
		let user_json = await user_resp.json();

		if (user_json.error) {
			productStore.addConsoleText(`(${shopName}) 로그인 실패`);
			notificationByEveryTime(`(${shopName}) 스마트스토어센터 로그인 후 재시도 바랍니다.`);

			return false;
		}

		newTab = await createTabCompletely({ active: false, url: 'https://sell.smartstore.naver.com/' }, 10);

		if (!newTab.id) {
			productStore.addConsoleText(`(${shopName}) 스마트스토어센터 접속 실패`);
			notificationByEveryTime(`(${shopName}) 스마트스토어센터 접속에 실패하였습니다.`);

			return false;
		}

		let store_resp = await fetch('https://sell.smartstore.naver.com/api/clone-accounts?_action=init');
		let store_json = await store_resp.json();

		if (!store_json.simpleAccountInfo?.creatableChannelInfoListMap?.hasOwnProperty('STOREFARM')) {
			productStore.addConsoleText(`(${shopName}) 스토어팜 정보 확인 실패`);
			notificationByEveryTime(`(${shopName}) 스토어 정보를 확인할 수 없습니다. 개설상태를 확인해주세요.`);

			chrome.tabs.remove(newTab.id);

			return false;
		}

		let store_id = store_json.simpleAccountInfo?.creatableChannelInfoListMap?.STOREFARM[0].url;

		if (commonStore.user.userInfo.naverStoreUrl !== 'https://smartstore.naver.com/' + store_id) {
			productStore.addConsoleText(`(${shopName}) 스토어 연동정보 확인 실패`);
			notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

			chrome.tabs.remove(newTab.id);

			return false;
		}

		for (let product in data.DShopInfo.prod_codes) {
			try {
				let market_code = data.DShopInfo.prod_codes[product];
				let market_item = data.DShopInfo.DataDataSet.data[product];
				let market_optn = data.DShopInfo.DataDataSet.data_opt;

				if (commonStore.uploadInfo.stopped) {
					productStore.addConsoleText(`(${shopName}) [${market_code}] 업로드 중단`);

					chrome.tabs.remove(newTab.id);

					return false;
				}

				if (!market_item.cert) {
					if (!commonStore.uploadInfo.editable) {
						productStore.addRegisteredFailed(
							Object.assign(market_item, {
								error: '스토어에 이미 등록된 상품입니다.',
							}),
						);
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);

						continue;
					}
				} else {
					if (commonStore.uploadInfo.editable) {
						productStore.addRegisteredFailed(
							Object.assign(market_item, {
								error: '상품 신규등록을 먼저 진행해주세요.',
							}),
						);
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);

						continue;
					}
				}

				let desc_resp = await fetch('https://sell.smartstore.naver.com/api/v2/editor/convert?editorType=NONE', {
					body: `${getStoreTraceCodeV1(market_item.id, data.DShopInfo.site_code)}${market_item.content2}${
						commonStore.user.userInfo.descriptionShowTitle === 'Y'
							? `<br /><br /><div style="text-align: center;">${market_item.name3}</div><br /><br />`
							: `<br /><br />`
					}${transformContent(market_item.content1)}${market_item.content3}`,
					method: 'POST',
				});

				let desc_json = await desc_resp.json();

				let json = {
					json: JSON.stringify(desc_json),
				};

				let optn_json: any = {
					optionUsable: false,
					options: [],
					optionCombinations: [],
					optionStandards: [],
					optionDeliveryAttributes: [],
					useStockManagement: true,
				};

				let group: any = {};
				let stock;

				let words = await gql(QUERIES.SELECT_WORD_TABLES_BY_SOMEONE, {}, false);
				let words_list = words.data.selectWordTablesBySomeone;

				let words_restrict: any = {};

				for (let i in words_list) {
					if (words_list[i].findWord && !words_list[i].replaceWord) {
						if (market_item.name3.includes(words_list[i].findWord)) {
							words_restrict['상품명'] = words_list[i].findWord;
						}
					}
				}

				for (let i in market_optn) {
					if (market_optn[i].code === market_code) {
						for (let j in market_optn[i]) {
							if (j.includes('misc') && market_optn[i][j] !== '') {
								group[market_optn[i][j]] = '';
							}

							if (j.includes('opt') && j !== 'optimg' && market_optn[i][j] !== '') {
								for (let k in words_list) {
									if (words_list[k].findWord && !words_list[k].replaceWord) {
										if (market_optn[i][j].includes(words_list[k].findWord)) {
											words_restrict['옵션명'] = words_list[k].findWord;
										}
									}
								}
							}
						}
					}
				}

				if (Object.keys(words_restrict).length > 0) {
					let message = '';

					for (let i in words_restrict) {
						message += i + '에서 금지어(' + words_restrict[i] + ')가 발견되었습니다. ';
					}

					productStore.addRegisteredFailed(Object.assign(market_item, { error: message }));
					productStore.addConsoleText(`(${shopName}) [${market_code}] 금지어 발견됨`);

					await sendCallback(commonStore, data, market_code, parseInt(product), 2, message);

					continue;
				}

				let option_count = Object.keys(group).length;

				if (option_count > 0) {
					stock = 0;

					optn_json['optionUsable'] = true;

					for (let i in group) {
						optn_json['options'].push({
							groupName: i,
							usable: true,
							optionType: 'COMBINATION',
							sortType: 'CREATE',
						});
					}

					for (let i in market_optn) {
						if (market_optn[i].code === market_code) {
							let option_detail: any = {};

							stock += market_optn[i].stock;

							option_detail['price'] = market_optn[i].price.toString();
							option_detail['stockQuantity'] = market_optn[i].stock.toString();
							option_detail['sellerManagerCode'] = '';
							option_detail['usable'] = true;
							option_detail['optionType'] = 'COMBINATION';
							option_detail['sortType'] = 'CREATE';

							if (option_count === 1) {
								option_detail['optionName1'] = market_optn[i].opt1 ? market_optn[i].opt1 : 'ERROR';
							}

							if (option_count === 2) {
								option_detail['optionName1'] = market_optn[i].opt1 ? market_optn[i].opt1 : 'ERROR';
								option_detail['optionName2'] = market_optn[i].opt2 ? market_optn[i].opt2 : 'ERROR';
							}

							if (option_count === 3) {
								option_detail['optionName1'] = market_optn[i].opt1 ? market_optn[i].opt1 : 'ERROR';
								option_detail['optionName2'] = market_optn[i].opt2 ? market_optn[i].opt2 : 'ERROR';
								option_detail['optionName3'] = market_optn[i].opt3 ? market_optn[i].opt3 : 'ERROR';
							}

							optn_json['optionCombinations'].push(option_detail);
						}
					}
				} else {
					stock = market_item.stock;
				}

				if (commonStore.uploadInfo.stopped) {
					productStore.addConsoleText(`(${shopName}) [${market_code}] 업로드 중단`);

					chrome.tabs.remove(newTab.id);

					return false;
				}

				productStore.addConsoleText(`(${shopName}) [${market_code}] 리소스 업로드 중...`);

				let images: any = [];

				if (!commonStore.uploadInfo.markets.find((v) => v.code === data.DShopInfo.site_code)?.video) {
					market_item.misc1 = '';
				}

				const uploaded_naver: any = await sendTabMessage(newTab.id, {
					action: 'upload-A077',
					source: market_item,
				});

				if (commonStore.uploadInfo.stopped) {
					productStore.addConsoleText(`(${shopName}) [${market_code}] 업로드 중단`);

					chrome.tabs.remove(newTab.id);

					return false;
				}
				/** 썸네일이미지 업로드 부문 */
				if (!uploaded_naver || !uploaded_naver.image || uploaded_naver.image.length < 1) {
					productStore.addRegisteredFailed(
						Object.assign(market_item, {
							error: '이미지 업로드 도중 오류가 발생하였습니다.',
						}),
					);
					productStore.addConsoleText(`(${shopName}) [${market_code}] 이미지 업로드 실패`);

					await sendCallback(
						commonStore,
						data,
						market_code,
						parseInt(product),
						2,
						'이미지 업로드 도중 오류가 발생하였습니다.',
					);

					continue;
				}

				productStore.addConsoleText(`(${shopName}) [${market_code}] 이미지 업로드 완료`);

				if (market_item.misc1 !== '') {
					if (!uploaded_naver.video) {
						productStore.addConsoleText(`(${shopName}) [${market_code}] 동영상 업로드 실패`);
					} else {
						productStore.addConsoleText(`(${shopName}) [${market_code}] 동영상 업로드 완료`);
					}
				}

				for (let i = uploaded_naver.image.length - 1; i >= 0; i--) {
					let temp: any = {};

					if (i === 0) {
						temp['imageType'] = 'REPRESENTATIVE';
					} else {
						temp['imageType'] = 'OPTIONAL';
					}

					temp['imageUrl'] = uploaded_naver.image[i].imageUrl;
					temp['order'] = 1;

					images.push(temp);
				}

				let delivery_fee: any = {};

				if (market_item.deliv_fee > 0) {
					delivery_fee['deliveryFeeType'] = 'PAID';
					delivery_fee['baseFee'] = market_item.deliv_fee.toString();
					delivery_fee['deliveryFeePayType'] = 'PREPAID';
				} else {
					delivery_fee['deliveryFeeType'] = 'FREE';
				}

				delivery_fee['deliveryFeeByArea'] = {
					deliveryAreaType: 'AREA_2',
					area2extraFee: commonStore.user.userInfo.additionalShippingFeeJeju
						? commonStore.user.userInfo.additionalShippingFeeJeju
						: 5000,
				};

				let search_tags: any = [];

				if (market_item.keyword2 !== '') {
					let tags = market_item.keyword2.split(',');

					for (let i in tags) {
						search_tags.push({
							code: '1',
							text: tags[i].trim(),
						});
					}
				}

				let name = market_item.name3.slice(0, 100);

				const itemInfo = productStore.itemInfo.items.find((v: any) => v.productCode === market_code);

				const sillCode = itemInfo[`sillCode${data.DShopInfo.site_code}`]
					? itemInfo[`sillCode${data.DShopInfo.site_code}`]
					: 'ETC';
				const sillData = itemInfo[`sillData${data.DShopInfo.site_code}`]
					? JSON.parse(itemInfo[`sillData${data.DShopInfo.site_code}`])
					: [
							{ code: 'itemName', name: '품명', type: 'input' },
							{ code: 'modelName', name: '모델명', type: 'input' },
							{
								code: 'certificateDetails',
								name: '법에 의한 인증, 허가 등을 받았음을 확인할 수 있는 경우 그에 대한 사항.',
								type: 'input',
							},
							{ code: 'manufacturer', name: '제조자(사)', type: 'input' },
							{ code: 'afterServiceDirector', name: 'A/S 책임자 또는 소비자상담 관련 전화번호', type: 'input' },
					  ];

				const sillResult = {
					productInfoProvidedNoticeType: sillCode,
					productInfoProvidedNoticeContent: {
						templateType: 'PRODUCT_INFO_PROVIDED_NOTICE',
						productInfoProvidedNoticeType: sillCode,
						returnCostReason: '상세설명참조',
						noRefundReason: '상세설명참조',
						qualityAssuranceStandard: '상세설명참조',
						compensationProcedure: '상세설명참조',
						troubleShootingContents: '상세설명참조',
					},
				};

				sillData.map((v) => {
					sillResult.productInfoProvidedNoticeContent[v.code] = v.value ?? '상세설명참조';
				});

				let body = {
					product: {
						saleType: 'NEW',
						excludeAdminDiscount: false,
						excludeGivePresent: false,
						payExposure: true,

						images: images,

						videoRegisterYn: true,
						videos: uploaded_naver.video
							? [
									{
										videoId: uploaded_naver.video.Ingest[0].videoId,
										thumbnailUrl: uploaded_naver.video.Picture.imageUrl,
										thumbnailWidth: uploaded_naver.video.Picture.width,
										thumbnailHeight: uploaded_naver.video.Picture.height,

										detailInfo: {
											error: false,

											...uploaded_naver.video.VideoHeader[0],
										},

										encodeStatusType: 'COMPLETE',
										order: 1,

										gifThumbnailInfo: {
											gifThumbnailStatusType: 'COMPLETE',
											gifThumbnailUrl: uploaded_naver.video.GIF.imageUrl,
											gifThumbnailWidth: uploaded_naver.video.GIF.width,
											gifThumbnailHeight: uploaded_naver.video.GIF.height,
										},

										title: market_item.name3.length > 20 ? market_item.name3.slice(0, 20) : market_item.name3,
									},
							  ]
							: null,

						detailAttribute: {
							naverShoppingSearchInfo: {
								modelName: market_item.model,
								manufacturerName: market_item.maker,
								brandName: market_item.brand,
							},

							afterServiceInfo: {
								afterServiceTelephoneNumber: commonStore.user.userInfo.asTel
									? commonStore.user.userInfo.asTel
									: '000-0000-0000',
								afterServiceGuideContent: commonStore.user.userInfo.asInformation
									? commonStore.user.userInfo.asInformation
									: '해외구매대행 상품은 국내에서 A/S가 불가능합니다.',
							},

							originAreaInfo: {
								type: 'IMPORT',
								originArea: {
									code: commonStore.user.userInfo.naverOriginCode
										? commonStore.user.userInfo.naverOriginCode
										: '0200037',
								},
								plural: false,
								importer: commonStore.user.userInfo.naverOrigin ? commonStore.user.userInfo.naverOrigin : '수입산',
							},

							sellerCodeInfo: {
								sellerManagementCode: market_code,
								sellerBarcode: '',
								sellerCustomCode1: '',
								sellerCustomCode2: '',
							},

							seoInfo: {
								sellerTags: search_tags,
								pageTitle: '',
								metaDescription: '',
							},

							optionInfo: optn_json,

							supplementProductInfo: {
								count: 0,
								sortType: 'CREATE',
								supplementProducts: [],
								usable: false,
							},

							purchaseReviewInfo: {
								purchaseReviewExposure: true,
								reviewUnExposeReason: '',
							},

							customMadeInfo: {
								customMade: false,
							},

							minorPurchasable: true,
							productCertificationInfos: [],
							taxType: 'TAX',

							productInfoProvidedNotice: sillResult,

							certificationTargetExcludeContent: {
								kcYn: 'KC_EXEMPTION_OBJECT',
								kcExemption: 'OVERSEAS',
								childYn: true,
							},

							consumptionTax: 'TEN',
							productAttributes: [],
							useReturnCancelNotification: false,
						},

						detailContent: {
							editorType: 'SEONE',
							editorTypeForEditor: 'SEONE',
							existsRemoveTags: false,
							productDetailInfoContent: JSON.stringify(json),
						},

						deliveryInfo: {
							deliveryType: 'DELIVERY',
							deliveryAttributeType: 'NORMAL',
							deliveryFee: delivery_fee,

							claimDeliveryInfo: {
								returnDeliveryCompany: user_json.deliveryBaseInfoVO.returnDeliveryCompanies[0],
								returnDeliveryCompanySeq: user_json.deliveryBaseInfoVO.returnDeliveryCompanies[0].id,
								returnDeliveryFee: commonStore.user.userInfo.refundShippingFee,
								exchangeDeliveryFee: commonStore.user.userInfo.exchangeShippingFee,
								shippingAddress: user_json.deliveryBaseInfoVO.baseShippingAddress,
								shippingAddressId: user_json.deliveryBaseInfoVO.baseShippingAddress.id,
								returnAddress: user_json.deliveryBaseInfoVO.baseReturnAddress,
								returnAddressId: user_json.deliveryBaseInfoVO.baseReturnAddress.id,
								freeReturnInsuranceYn: false,
							},

							installationFee: false,
							accountNo: user_json.deliveryBaseInfoVO.baseDeliveryBundleGroup.accountNo,
							cloneDeliveryAttributeType: 'NORMAL',
							customMadeDirectInputYn: false,
							expectedDeliveryPeriodType: '',
							expectedDeliveryPeriodDirectInput: '',
							deliveryCompany: {
								id: 'CJGLS',
								name: 'CJ대한통운',
							},
							deliveryCompanyId: 'CJGLS',
						},

						customerBenefit:
							market_item.nprice > 0
								? {
										immediateDiscountPolicy: {
											discountMethod: {
												discountUnitType: 'WON',
												value: market_item.nprice,
											},
											mobileDiscountMethod: {
												discountUnitType: 'WON',
												value: market_item.nprice,
											},
										},
								  }
								: commonStore.user.userInfo.discountAmount > 0
								? {
										immediateDiscountPolicy: {
											discountMethod: {
												discountUnitType: commonStore.user.userInfo.discountUnitType,
												value: commonStore.user.userInfo.discountAmount,
											},
											mobileDiscountMethod: {
												discountUnitType: commonStore.user.userInfo.discountUnitType,
												value: commonStore.user.userInfo.discountAmount,
											},
										},
								  }
								: {},
						productStats: {},
						representImageUrl: '',
						useSalePeriod: false,

						category: {
							id: market_item.cate_code,
							lastLevel: true,
							deleted: false,
							sellBlogUse: true,
							sortOrder: 0,
							juvenileHarmful: false,
							$promise: {},
							$resolved: true,
							$order: 21,

							exceptionalCategoryTypes: ['REGULAR_SUBSCRIPTION', 'FREE_RETURN_INSURANCE'],

							exceptionalCategoryAttributes: [],
						},

						name: name,
						liveDiscountBenefit: null,

						salePrice: market_item.wprice1.toString(),
						stockQuantity: stock.toString(),
					},

					singleChannelProductMap: {
						STOREFARM: {
							id: '',
							selfProductNameUsable: commonStore.user.userInfo.naverStoreOnly === 'Y' ? true : false,
							channelProductName: commonStore.user.userInfo.naverStoreOnly === 'Y' ? name : '',
							channelServiceType: 'STOREFARM',
							channelProductType: 'SINGLE',
							channelProductSupplyType: 'OWNER',
							channel: null,

							epInfo: {
								naverShoppingRegistration: true,
								enuriRegistration: false,
								danawaRegistration: false,
								naverDisabled: false,
								enuriDisabled: true,
								danawaDisabled: true,
								disabledAll: false,
							},

							channelProductDisplayStatusType: 'ON',
							channelProductStatusType: 'NORMAL',
							storeKeepExclusiveProduct: false,
							orderRequestUsable: false,
							best: false,
							bbsConfig: false,
							materialImages: [],
							tagImages: [],
							barcodeImage: null,

							affiliateInfo: {
								affiliateYn: false,
							},

							channelNo: user_json.simpleAccountInfo.defaultChannelNo,
						},
					},
				};

				if (commonStore.uploadInfo.stopped) {
					productStore.addConsoleText(`(${shopName}) [${market_code}] 업로드 중단`);

					chrome.tabs.remove(newTab.id);

					return false;
				}

				if (!market_item.cert && commonStore.uploadInfo.editable) {
					let productId = market_item.name2;

					if (!productId) {
						productStore.addRegisteredFailed(Object.assign(market_item, { error: '상품 ID를 찾을 수 없습니다.' }));
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 실패`);

						await sendCallback(commonStore, data, market_code, parseInt(product), 2, '상품 ID를 찾을 수 없습니다.');

						continue;
					}

					let search_body = {
						searchKeywordType: 'CHANNEL_PRODUCT_NO',
						searchKeyword: productId,
						productName: '',
						modelName: '',
						manufacturerName: '',
						brandName: '',
						searchPaymentType: 'ALL',
						searchPeriodType: 'PROD_REG_DAY',
						deliveryAttributeType: '',
						productKindType: '',
						etcCondition: '',
						subscriptionType: '',
						fromDate: '',
						toDate: '',

						viewData: {
							productStatusTypes: ['SALE'],

							channelServiceTypes: ['STOREFARM', 'WINDOW', 'AFFILIATE', ''],

							pageSize: 100,
						},

						searchOrderType: 'REG_DATE',

						productStatusTypes: ['SALE'],

						channelServiceTypes: ['STOREFARM', 'WINDOW', 'AFFILIATE'],

						page: 0,
						size: 100,
						sort: [],
					};

					let search_json: any = await sendTabMessage(newTab.id, {
						action: 'search-A077-products',
						source: JSON.stringify(search_body),
					});

					// 스마트스토어 수정 등록 모듈 (2021-12-22)
					let view_resp = await fetch(
						`https://sell.smartstore.naver.com/api/products/${search_json.content[0].id.toString()}`,
						{
							headers: {
								'x-current-state': `https://sell.smartstore.naver.com/#/products/edit/${search_json.content[0].id.toString()}`,
								'x-current-statename': '',
								'x-to-statename': 'main.product.edit',
							},

							referrer: 'https://sell.smartstore.naver.com/',
							referrerPolicy: 'strict-origin-when-cross-origin',
							body: null,
							method: 'GET',
							mode: 'cors',
							credentials: 'include',
						},
					);

					let view_json = await view_resp.json();

					let body2 = {
						product: {
							...view_json.product,

							deliveryInfo: {
								deliveryType: 'DELIVERY',
								deliveryAttributeType: 'NORMAL',
								deliveryFee: delivery_fee,

								claimDeliveryInfo: {
									returnDeliveryCompany: user_json.deliveryBaseInfoVO.returnDeliveryCompanies[0],
									returnDeliveryCompanySeq: user_json.deliveryBaseInfoVO.returnDeliveryCompanies[0].id,
									returnDeliveryFee: commonStore.user.userInfo.refundShippingFee,
									exchangeDeliveryFee: commonStore.user.userInfo.exchangeShippingFee,
									shippingAddress: user_json.deliveryBaseInfoVO.baseShippingAddress,
									shippingAddressId: user_json.deliveryBaseInfoVO.baseShippingAddress.id,
									returnAddress: user_json.deliveryBaseInfoVO.baseReturnAddress,
									returnAddressId: user_json.deliveryBaseInfoVO.baseReturnAddress.id,
									freeReturnInsuranceYn: false,
								},

								installationFee: false,
								accountNo: user_json.deliveryBaseInfoVO.baseDeliveryBundleGroup.accountNo,
								cloneDeliveryAttributeType: 'NORMAL',
								customMadeDirectInputYn: false,
								expectedDeliveryPeriodType: '',
								expectedDeliveryPeriodDirectInput: '',
								deliveryCompany: {
									id: 'CJGLS',
									name: 'CJ대한통운',
								},
								deliveryCompanyId: 'CJGLS',
							},

							images: images,

							videoRegisterYn: true,
							videos: uploaded_naver.video
								? [
										{
											videoId: uploaded_naver.video.Ingest[0].videoId,
											thumbnailUrl: uploaded_naver.video.Picture.imageUrl,
											thumbnailWidth: uploaded_naver.video.Picture.width,
											thumbnailHeight: uploaded_naver.video.Picture.height,

											detailInfo: {
												error: false,

												...uploaded_naver.video.VideoHeader[0],
											},

											encodeStatusType: 'COMPLETE',
											order: 1,

											gifThumbnailInfo: {
												gifThumbnailStatusType: 'COMPLETE',
												gifThumbnailUrl: uploaded_naver.video.GIF.imageUrl,
												gifThumbnailWidth: uploaded_naver.video.GIF.width,
												gifThumbnailHeight: uploaded_naver.video.GIF.height,
											},

											title: market_item.name3.length > 20 ? market_item.name3.slice(0, 20) : market_item.name3,
										},
								  ]
								: null,

							detailAttribute: {
								naverShoppingSearchInfo: {
									modelName: market_item.model,
									manufacturerName: market_item.maker,
									brandName: market_item.brand,
								},

								afterServiceInfo: {
									afterServiceTelephoneNumber: commonStore.user.userInfo.asTel
										? commonStore.user.userInfo.asTel
										: '000-0000-0000',
									afterServiceGuideContent: commonStore.user.userInfo.asInformation
										? commonStore.user.userInfo.asInformation
										: '해외구매대행 상품은 국내에서 A/S가 불가능합니다.',
								},

								originAreaInfo: {
									type: 'IMPORT',
									originArea: {
										code: commonStore.user.userInfo.naverOriginCode
											? commonStore.user.userInfo.naverOriginCode
											: '0200037', // 원산지: 수입산 (중국)
									},
									plural: false,
									importer: commonStore.user.userInfo.naverOrigin ? commonStore.user.userInfo.naverOrigin : '수입산',
								},

								sellerCodeInfo: {
									sellerManagementCode: market_code,
									sellerBarcode: '',
									sellerCustomCode1: '',
									sellerCustomCode2: '',
								},

								seoInfo: {
									sellerTags: search_tags,
									pageTitle: '',
									metaDescription: '',
								},

								optionInfo: optn_json,

								supplementProductInfo: {
									count: 0,
									sortType: 'CREATE',
									supplementProducts: [],
									usable: false,
								},

								purchaseReviewInfo: {
									purchaseReviewExposure: true,
									reviewUnExposeReason: '',
								},

								customMadeInfo: {
									customMade: false,
								},

								minorPurchasable: true,
								productCertificationInfos: [],
								taxType: 'TAX',

								productInfoProvidedNotice: sillResult,

								certificationTargetExcludeContent: {
									kcYn: 'KC_EXEMPTION_OBJECT',
									kcExemption: 'OVERSEAS',
									childYn: true,
								},

								consumptionTax: 'TEN',
								productAttributes: [],
								useReturnCancelNotification: false,
							},

							detailContent: {
								editorType: 'SEONE',
								editorTypeForEditor: 'SEONE',
								existsRemoveTags: false,
								productDetailInfoContent: JSON.stringify(json),
							},

							customerBenefit:
								market_item.nprice > 0
									? {
											immediateDiscountPolicy: {
												discountMethod: {
													discountUnitType: 'WON',
													value: market_item.nprice, // PC 할인가격
												},
												mobileDiscountMethod: {
													discountUnitType: 'WON',
													value: market_item.nprice, // 모바일 할인가격
												},
											},
									  }
									: commonStore.user.userInfo.discountAmount > 0
									? {
											immediateDiscountPolicy: {
												discountMethod: {
													discountUnitType: commonStore.user.userInfo.discountUnitType,
													value: commonStore.user.userInfo.discountAmount, // PC 할인가격
												},
												mobileDiscountMethod: {
													discountUnitType: commonStore.user.userInfo.discountUnitType,
													value: commonStore.user.userInfo.discountAmount, // 모바일 할인가격
												},
											},
									  }
									: {},

							name: name,

							salePrice: market_item.wprice1.toString(),
							stockQuantity: stock.toString(),
						},
						savedTemplate: {
							EVENT_PHRASE: false,
						},
						singleChannelProductMap: {
							STOREFARM: {
								...view_json.singleChannelProductMap.STOREFARM,
							},
						},
					};

					productStore.addRegisteredQueue(market_item);
					productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 중...`);

					let edit_json: any = await sendTabMessage(newTab.id, {
						action: 'edited-A077-products',
						source: JSON.stringify(body2),
					});

					if (edit_json.productId === undefined) {
						let messagebox = '';

						for (let i = 0; i < edit_json.invalidInputs.length; i++) {
							if (i < edit_json.invalidInputs.length - 1) {
								messagebox += i + 1 + '. ' + edit_json.invalidInputs[i].message + ' // ';
							} else {
								messagebox += i + 1 + '. ' + edit_json.invalidInputs[i].message;
							}
						}

						productStore.addRegisteredFailed(Object.assign(market_item, { error: messagebox }));
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 실패`);

						await sendCallback(commonStore, data, market_code, parseInt(product), 2, messagebox);
					} else {
						const productId = edit_json.singleChannelProductMap.STOREFARM.id.toString();

						productStore.addRegisteredSuccess(Object.assign(market_item, { error: productId }));
						productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 성공`);

						await sendCallback(commonStore, data, market_code, parseInt(product), 1, productId);
					}
				} else {
					productStore.addRegisteredQueue(market_item);
					productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 중...`);

					let resp_json: any = await sendTabMessage(newTab.id, {
						action: 'upload-A077-products',
						source: JSON.stringify(body),
					});

					try {
						if (resp_json.productId === undefined) {
							let messagebox = '';

							for (let i = 0; i < resp_json.invalidInputs.length; i++) {
								if (i < resp_json.invalidInputs.length - 1) {
									messagebox += i + 1 + '. ' + resp_json.invalidInputs[i].message + ' // ';
								} else {
									messagebox += i + 1 + '. ' + resp_json.invalidInputs[i].message;
								}
							}

							productStore.addRegisteredFailed(Object.assign(market_item, { error: messagebox }));
							productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);

							await sendCallback(commonStore, data, market_code, parseInt(product), 2, messagebox);
						} else {
							const productId = resp_json.singleChannelProductMap.STOREFARM.id.toString();

							productStore.addRegisteredSuccess(Object.assign(market_item, { error: productId }));
							productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 성공`);

							await sendCallback(commonStore, data, market_code, parseInt(product), 1, productId);
						}
					} catch (e) {
						console.log(e);
					}
				}
			} catch (e: any) {
				notificationByEveryTime(`(${shopName}) 업로드 도중 오류가 발생하였습니다. (${e.toString()})`);

				continue;
			}
		}
	} catch (e: any) {
		productStore.addConsoleText(`(${shopName}) 업로드 중단`);
		notificationByEveryTime(`(${shopName}) 업로드 도중 오류가 발생하였습니다. (${e.toString()})`);

		if (newTab.id) {
			chrome.tabs.remove(newTab.id);
		}

		return false;
	}

	productStore.addConsoleText(`(${shopName}) 업로드 완료`);

	chrome.tabs.remove(newTab.id);

	return true;
}

// 스마트스토어 상품 등록해제
export async function deleteSmartStore(productStore: any, commonStore: any, data: any) {
	if (!data) {
		return false;
	}

	let newTab: any = {};
	let shopName = data.DShopInfo.site_name;

	console.log(`(${shopName}) 등록정보:`, data);

	try {
		let user_resp = await fetch('https://sell.smartstore.naver.com/api/products?_action=create');
		let user_json = await user_resp.json();

		if (user_json.error) {
			productStore.addConsoleText(`(${shopName}) 로그인 실패`);
			notificationByEveryTime(`(${shopName}) 스마트스토어센터 로그인 후 재시도 바랍니다.`);

			return false;
		}

		let store_resp = await fetch('https://sell.smartstore.naver.com/api/clone-accounts?_action=init');
		let store_json = await store_resp.json();

		if (!store_json.simpleAccountInfo?.creatableChannelInfoListMap?.hasOwnProperty('STOREFARM')) {
			productStore.addConsoleText(`(${shopName}) 스토어팜 정보 확인 실패`);
			notificationByEveryTime(`(${shopName}) 스토어 정보를 확인할 수 없습니다. 개설상태를 확인해주세요.`);

			return false;
		}

		let store_id = store_json.simpleAccountInfo?.creatableChannelInfoListMap?.STOREFARM[0].url;

		if (commonStore.user.userInfo.naverStoreUrl !== 'https://smartstore.naver.com/' + store_id) {
			productStore.addConsoleText(`(${shopName}) 스토어 연동정보 확인 실패`);
			notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

			return false;
		}

		newTab = await createTabCompletely({ active: false, url: 'https://sell.smartstore.naver.com/' }, 10);

		for (let product in data.DShopInfo.prod_codes) {
			try {
				let market_code = data.DShopInfo.prod_codes[product];
				let market_item = data.DShopInfo.DataDataSet.data[product];

				if (market_item.cert) {
					continue;
				}

				let productId = market_item.name2;

				if (!productId) {
					continue;
				}

				let searchBody = {
					searchKeywordType: 'CHANNEL_PRODUCT_NO',
					searchKeyword: productId,
					productName: '',
					modelName: '',
					manufacturerName: '',
					brandName: '',
					searchPaymentType: 'ALL',
					searchPeriodType: 'PROD_REG_DAY',
					deliveryAttributeType: '',
					productKindType: '',
					etcCondition: '',
					subscriptionType: '',
					fromDate: '',
					toDate: '',

					viewData: {
						productStatusTypes: ['SALE'],

						channelServiceTypes: ['STOREFARM', 'WINDOW', 'AFFILIATE', ''],

						pageSize: 100,
					},

					searchOrderType: 'REG_DATE',

					productStatusTypes: ['SALE'],

					channelServiceTypes: ['STOREFARM', 'WINDOW', 'AFFILIATE'],

					page: 0,
					size: 100,
					sort: [],
				};

				let searchJson: any = await sendTabMessage(newTab.id, {
					action: 'search-A077-products',
					source: JSON.stringify(searchBody),
				});

				if (searchJson.content.length < 1) {
					const progressValue = Math.round(((parseInt(product) + 1) * 100) / data.DShopInfo.prod_codes.length);

					commonStore.setDisabledProgressValue(data.DShopInfo.site_code, progressValue);

					await gql(MUTATIONS.UNLINK_PRODUCT_STORE, {
						productId: market_item.id,
						siteCode: data.DShopInfo.site_code,
					});

					continue;
				}

				const deleteBody = {
					productNos: [searchJson.content[0].id],
					productStatusType: 'DELETE',
					productBulkUpdateType: 'DELETE',
				};

				productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록해제 중...`);

				let deleteJson: any = await sendTabMessage(newTab.id, {
					action: 'delete-A077-products',
					source: JSON.stringify(deleteBody),
				});

				if (deleteJson.status === 'STARTED') {
					const progressValue = Math.round(((parseInt(product) + 1) * 100) / data.DShopInfo.prod_codes.length);

					commonStore.setDisabledProgressValue(data.DShopInfo.site_code, progressValue);

					await gql(MUTATIONS.UNLINK_PRODUCT_STORE, {
						productId: market_item.id,
						siteCode: data.DShopInfo.site_code,
					});
				}
			} catch (e: any) {
				notificationByEveryTime(`(${shopName}) 상품 등록해제 도중 오류가 발생하였습니다. (${e.toString()})`);

				continue;
			}
		}
	} catch (e: any) {
		productStore.addConsoleText(`(${shopName}) 상품 등록해제 중단`);
		notificationByEveryTime(`(${shopName}) 상품 등록해제 도중 오류가 발생하였습니다. (${e.toString()})`);

		chrome.tabs.remove(newTab.id);

		return false;
	}

	productStore.addConsoleText(`(${shopName}) 상품 등록해제 완료`);

	chrome.tabs.remove(newTab.id);

	return true;
}

// 스마트스토어 신규주문조회
export async function newOrderSmartStore(commonStore: any, shopInfo: any) {
	const shopName = shopInfo.name;

	if (!shopInfo.connected || shopInfo.disabled) {
		return [];
	}

	try {
		let user_resp = await fetch('https://sell.smartstore.naver.com/api/products?_action=create');
		let user_json = await user_resp.json();

		if (user_json.error) {
			notificationByEveryTime(`(${shopName}) 스마트스토어센터 로그인 후 재시도 바랍니다.`);

			return [];
		}

		let store_resp = await fetch('https://sell.smartstore.naver.com/api/clone-accounts?_action=init');
		let store_json = await store_resp.json();

		if (!store_json.simpleAccountInfo?.creatableChannelInfoListMap?.hasOwnProperty('STOREFARM')) {
			notificationByEveryTime(`(${shopName}) 스토어 정보를 확인할 수 없습니다. 개설상태를 확인해주세요.`);

			return [];
		}

		let store_id = store_json.simpleAccountInfo?.creatableChannelInfoListMap?.STOREFARM[0].url;

		if (commonStore.user.userInfo.naverStoreUrl !== 'https://smartstore.naver.com/' + store_id) {
			notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

			return [];
		}

		const orderData = {
			operationName: 'smartstoreFindDeliveriesBySummaryInfoType_ForSaleDelivery',
			variables: {
				merchantNo: store_json.simpleAccountInfo.sellerNo.toString(),
				serviceType: 'MP',
				paging_page: 1,
				paging_size: 100,
				sort_type: 'RECENTLY_ORDER_YMDT',
				sort_direction: 'DESC',
				summaryInfoType: 'NEW_ORDERS_DELIVERY_OPERATED_BEFORE',
				sellerOrderSearchTypes: ['NORMAL_ORDER', 'TODAY_DISPATCH', 'PRE_ORDER', 'SUBSCRIPTION', 'RENTAL'],
			},

			query: `query smartstoreFindDeliveriesBySummaryInfoType_ForSaleDelivery($merchantNo: String!, $paging_page: Int, $paging_size: Int, $serviceType: ServiceType!, $sort_direction: SortDirectionType, $sort_type: SortType, $summaryInfoType: SummaryInfoType!, $sellerOrderSearchTypes: [String]!) {
        deliveryList: smartstoreFindDeliveriesBySummaryInfoType_ForSaleDelivery(merchantNo: $merchantNo, paging_page: $paging_page, paging_size: $paging_size, serviceType: $serviceType, sort_direction: $sort_direction, sort_type: $sort_type, summaryInfoType: $summaryInfoType, sellerOrderSearchTypes: $sellerOrderSearchTypes) {
          elements {
            ...deliveryElementField
            __typename
          }
          pagination {
            ...paginationField
            __typename
          }
          __typename
        }
      }
      
      fragment deliveryElementField on SaleDeliverySeller {
        returnCareTarget
        branchId
        merchantChannelNo
        deliveryFeeClass
        deliveryInvoiceNo
        orderQuantity
        productName
        payDateTime
        deliveryDateTime
        deliveryFeeRatingClass
        productOrderMemo
        orderMemberId
        remoteAreaCostChargeAmt
        salesCommissionPrepay
        payLocationType
        totalDiscountAmt
        orderNo
        payMeansClass
        productClass
        commissionClassType
        oneYearOrderAmt
        saleChannelType
        oneYearOrderCount
        deliveryCompanyName
        sellerProductManagementCode
        grade
        sellingInterlockCommissionInflowPath
        orderMemberTelNo
        deliveryFeeAmt
        claimNo
        deliveryMethod
        deliveryMethodPay
        biztalkAccountId
        giftName
        receiverTelNo2
        productPayAmt
        receiverTelNo1
        sixMonthOrderAmt
        orderStatus
        productUnitPrice
        waybillPrintDateTime
        threeMonthOrderCount
        orderMemberName
        productOrderNo
        deliveryCompanyCode
        productOptionContents
        dispatchDueDateTime
        knowledgeShoppingCommissionAmt
        productOptionAmt
        productNo
        individualCustomUniqueCode
        orderDateTime
        placingOrderDateTime
        inflowPath
        receiverName
        settlementExpectAmt
        deliveryNo
        threeMonthOrderAmt
        sellerDiscountAmt
        deliveryFeeDiscountAmt
        dispatchDateTime
        sixMonthOrderCount
        receiverZipCode
        payCommissionAmt
        takingGoodsPlaceAddress
        syncDateTime
        productOrderStatus
        sellerInternalCode2
        sellerOptionManagementCode
        sellerInternalCode1
        deliveryBundleGroupSeq
        productUrl
        subscriptionRound
        subscriptionPeriodCount
        fulfillmentCompanyName
        receiverIntegratedAddress
        receiverDisplayBaseAddress
        receiverDisplayDetailAddress
        deliveryAttributeText
        __typename
      }
      
      fragment paginationField on Pagination {
        size
        totalElements
        page
        totalPages
        __typename
      }
      `,
		};

		const orderResp = await fetch('https://sell.smartstore.naver.com/o/v3/graphql', {
			headers: {
				accept: '*/*',
				'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
				'content-type': 'application/json',
				'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"Windows"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin',
			},
			referrer: 'https://sell.smartstore.naver.com/o/v3/n/sale/delivery',
			referrerPolicy: 'strict-origin-when-cross-origin',
			body: JSON.stringify(orderData),
			method: 'POST',
			mode: 'cors',
			credentials: 'include',
		});

		const orderJson = await orderResp.json();

		console.log(shopName, orderJson.data.deliveryList.elements);

		return orderJson.data.deliveryList.elements.map((v: any) => {
			return {
				productId: v.productNo,
				marketCode: shopInfo.code,
				marketName: shopInfo.name,
				taobaoOrderNo: null,
				productName: v.productName,
				productOptionContents: v.productOptionContents,
				sellerProductManagementCode: v.sellerProductManagementCode,
				orderNo: v.productOrderNo,
				orderQuantity: v.orderQuantity,
				orderMemberName: v.orderMemberName,
				orderMemberTelNo: v.orderMemberTelNo,
				productPayAmt: parseInt(v.productPayAmt),
				deliveryFeeAmt: parseInt(v.deliveryFeeAmt),
				individualCustomUniqueCode: v.individualCustomUniqueCode,
				receiverName: v.receiverName,
				receiverTelNo1: v.receiverTelNo1,
				receiverIntegratedAddress: v.receiverIntegratedAddress,
				receiverZipCode: v.receiverZipCode,
				productOrderMemo: v.productOrderMemo,
			};
		});
	} catch (e: any) {
		console.log(shopName, e);

		return [];
	}
}

// 스마트스토어 발주확인처리
export async function productPreparedSmartStore(commonStore: any, shopInfo: any, props: any) {
	let productOrderIds: any = [];
	console.log(props);
	if (props !== '' && props.item.marketCode === 'A077') {
		productOrderIds.push(props.item.orderNo.toString());
	} else {
		return;
	}
	const shopName = shopInfo.name;

	if (!shopInfo.connected || shopInfo.disabled) {
		return [];
	}

	try {
		let user_resp = await fetch('https://sell.smartstore.naver.com/api/products?_action=create');
		let user_json = await user_resp.json();

		if (user_json.error) {
			notificationByEveryTime(`(${shopName}) 스마트스토어센터 로그인 후 재시도 바랍니다.`);

			return [];
		}

		let store_resp = await fetch('https://sell.smartstore.naver.com/api/clone-accounts?_action=init');
		let store_json = await store_resp.json();

		if (!store_json.simpleAccountInfo?.creatableChannelInfoListMap?.hasOwnProperty('STOREFARM')) {
			notificationByEveryTime(`(${shopName}) 스토어 정보를 확인할 수 없습니다. 개설상태를 확인해주세요.`);

			return [];
		}

		let store_id = store_json.simpleAccountInfo?.creatableChannelInfoListMap?.STOREFARM[0].url;

		if (commonStore.user.userInfo.naverStoreUrl !== 'https://smartstore.naver.com/' + store_id) {
			notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

			return [];
		}

		const test = {
			productOrderIds: props.item.orderNo.toString(),
			onlyValidation: true,
			patch: 'placeOrder',
			validationSuccess: true,
		};

		const test2 = await fetch('https://sell.smartstore.naver.com/o/v3/oa/delivery/placeOrder', {
			headers: {
				accept: 'application/json, text/plain, */*',
				'accept-language': 'ko,en-US;q=0.9,en;q=0.8,ko-KR;q=0.7',
				'content-type': 'application/json;charset=UTF-8',
				'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"Windows"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin',
			},
			referrer: 'https://sell.smartstore.naver.com/o/v3/n/sale/delivery',
			referrerPolicy: 'strict-origin-when-cross-origin',
			body: JSON.stringify(test),
			method: 'POST',
			mode: 'cors',
			credentials: 'include',
		});

		console.log(await test2.json());
	} catch (e: any) {
		console.log(shopName, e);

		return [];
	}
}

// 스마트스토어 발송처리주문조회
export async function deliveryOrderSmartStore(commonStore: any, shopInfo: any) {
	const shopName = shopInfo.name;

	if (!shopInfo.connected || shopInfo.disabled) {
		return [];
	}

	try {
		let user_resp = await fetch('https://sell.smartstore.naver.com/api/products?_action=create');
		let user_json = await user_resp.json();

		if (user_json.error) {
			notificationByEveryTime(`(${shopName}) 스마트스토어센터 로그인 후 재시도 바랍니다.`);

			return [];
		}

		let store_resp = await fetch('https://sell.smartstore.naver.com/api/clone-accounts?_action=init');
		let store_json = await store_resp.json();

		if (!store_json.simpleAccountInfo?.creatableChannelInfoListMap?.hasOwnProperty('STOREFARM')) {
			notificationByEveryTime(`(${shopName}) 스토어 정보를 확인할 수 없습니다. 개설상태를 확인해주세요.`);

			return [];
		}

		let store_id = store_json.simpleAccountInfo?.creatableChannelInfoListMap?.STOREFARM[0].url;

		if (commonStore.user.userInfo.naverStoreUrl !== 'https://smartstore.naver.com/' + store_id) {
			notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

			return [];
		}

		const orderData = {
			operationName: 'smartstoreFindDeliveriesBySummaryInfoType_ForSaleDelivery',
			variables: {
				merchantNo: store_json.simpleAccountInfo.sellerNo.toString(),
				serviceType: 'MP',
				paging_page: 1,
				paging_size: 100,
				sort_type: 'RECENTLY_ORDER_YMDT',
				sort_direction: 'DESC',
				summaryInfoType: 'DELIVERY_READY',
			},

			query: `query smartstoreFindDeliveriesBySummaryInfoType_ForSaleDelivery($merchantNo: String!, $paging_page: Int, $paging_size: Int, $serviceType: ServiceType!, $sort_direction: SortDirectionType, $sort_type: SortType, $summaryInfoType: SummaryInfoType!, $sellerOrderSearchTypes: [String]!) {
        deliveryList: smartstoreFindDeliveriesBySummaryInfoType_ForSaleDelivery(merchantNo: $merchantNo, paging_page: $paging_page, paging_size: $paging_size, serviceType: $serviceType, sort_direction: $sort_direction, sort_type: $sort_type, summaryInfoType: $summaryInfoType, sellerOrderSearchTypes: $sellerOrderSearchTypes) {
          elements {
            ...deliveryElementField
            __typename
          }
          pagination {
            ...paginationField
            __typename
          }
          __typename
        }
      }
      
      fragment deliveryElementField on SaleDeliverySeller {
        returnCareTarget
        branchId
        merchantChannelNo
        deliveryFeeClass
        deliveryInvoiceNo
        orderQuantity
        productName
        payDateTime
        deliveryDateTime
        deliveryFeeRatingClass
        productOrderMemo
        orderMemberId
        remoteAreaCostChargeAmt
        salesCommissionPrepay
        payLocationType
        totalDiscountAmt
        orderNo
        payMeansClass
        productClass
        commissionClassType
        oneYearOrderAmt
        saleChannelType
        oneYearOrderCount
        deliveryCompanyName
        sellerProductManagementCode
        grade
        sellingInterlockCommissionInflowPath
        orderMemberTelNo
        deliveryFeeAmt
        claimNo
        deliveryMethod
        deliveryMethodPay
        biztalkAccountId
        giftName
        receiverTelNo2
        productPayAmt
        receiverTelNo1
        sixMonthOrderAmt
        orderStatus
        productUnitPrice
        waybillPrintDateTime
        threeMonthOrderCount
        orderMemberName
        productOrderNo
        deliveryCompanyCode
        productOptionContents
        dispatchDueDateTime
        knowledgeShoppingCommissionAmt
        productOptionAmt
        productNo
        individualCustomUniqueCode
        orderDateTime
        placingOrderDateTime
        inflowPath
        receiverName
        settlementExpectAmt
        deliveryNo
        threeMonthOrderAmt
        sellerDiscountAmt
        deliveryFeeDiscountAmt
        dispatchDateTime
        sixMonthOrderCount
        receiverZipCode
        payCommissionAmt
        takingGoodsPlaceAddress
        syncDateTime
        productOrderStatus
        sellerInternalCode2
        sellerOptionManagementCode
        sellerInternalCode1
        deliveryBundleGroupSeq
        productUrl
        subscriptionRound
        subscriptionPeriodCount
        fulfillmentCompanyName
        receiverIntegratedAddress
        receiverDisplayBaseAddress
        receiverDisplayDetailAddress
        deliveryAttributeText
        __typename
      }
      
      fragment paginationField on Pagination {
        size
        totalElements
        page
        totalPages
        __typename
      }
      `,
		};

		const orderResp = await fetch('https://sell.smartstore.naver.com/o/v3/graphql', {
			headers: {
				accept: '*/*',
				'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
				'content-type': 'application/json',
				'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"Windows"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-origin',
			},
			referrer: 'https://sell.smartstore.naver.com/o/v3/n/sale/delivery',
			referrerPolicy: 'strict-origin-when-cross-origin',
			body: JSON.stringify(orderData),
			method: 'POST',
			mode: 'cors',
			credentials: 'include',
		});

		const orderJson = await orderResp.json();

		return orderJson.data.deliveryList.elements.map((v: any) => {
			return {
				productId: v.productNo,
				marketCode: shopInfo.code,
				marketName: shopInfo.name,
				taobaoOrderNo: null,
				productName: v.productName,
				productOptionContents: v.productOptionContents,
				sellerProductManagementCode: v.sellerProductManagementCode,
				orderNo: v.productOrderNo,
				orderQuantity: v.orderQuantity,
				orderMemberName: v.orderMemberName,
				orderMemberTelNo: v.orderMemberTelNo,
				productPayAmt: parseInt(v.productPayAmt),
				deliveryFeeAmt: parseInt(v.deliveryFeeAmt),
				individualCustomUniqueCode: v.individualCustomUniqueCode,
				receiverName: v.receiverName,
				receiverTelNo1: v.receiverTelNo1,
				receiverIntegratedAddress: v.receiverIntegratedAddress,
				receiverZipCode: v.receiverZipCode,
				productOrderMemo: v.productOrderMemo,
			};
		});
	} catch (e: any) {
		console.log(shopName, e);

		return [];
	}
}
