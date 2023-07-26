// 자주사용하는 유용한 함수 모음

import MUTATIONS from '../Main/GraphQL/Mutations';
import gql from '../Main/GraphQL/Requests';

const XLSX = require('xlsx');
const xml2js = require('xml2js');

// 문자열의 바이트 길이 계산
export function byteLength(str: string) {
	let strLen = str.length;
	let cnt = 0;
	let oneChar = '';

	for (let ii = 0; ii < strLen; ii++) {
		oneChar = str.charAt(ii);
		if (escape(oneChar).length > 4) {
			cnt += 2;
		} else {
			cnt++;
		}
	}
	return cnt;
}

// 문자열을 바이트만큼 잘라냄
export function byteSlice(str: string, limit: number) {
	while (true) {
		let blen;

		blen = byteLength(str);

		if (blen > limit) {
			str = str.slice(0, str.length - 1);
		} else {
			return str;
		}
	}
}

// 카티션 프로덕트
export function cartesian(...args: any) {
	var r: any = [],
		max = args.length - 1;
	function helper(arr: any, i: any) {
		for (var j = 0, l = args[i].length; j < l; j++) {
			var a = arr.slice(0); // clone arr
			a.push(args[i][j]);
			if (i == max) r.push(a);
			else helper(a, i + 1);
		}
	}
	helper([], 0);
	return r;
}

// 통관부호 체크
export async function checkIndividualCustomUniqueCode(data: any, loop: boolean) {
	let icuc = {
		code: data.individualCustomUniqueCode,
		name: loop ? data.receiverName : data.orderMemberName,
		phone: loop ? data.receiverTelNo1 : data.orderMemberTelNo,
	};

	icuc.phone = icuc.phone.replaceAll('-', '');

	const icucResp = await fetch(
		`https://unipass.customs.go.kr:38010/ext/rest/persEcmQry/retrievePersEcm?crkyCn=j260j221x046z292y040z030n0&persEcm=${icuc.code}&pltxNm=${icuc.name}&cralTelno=${icuc.phone}`,
	);
	const icucText = await icucResp.text();

	const response: any = await new Promise((resolve, reject) => {
		xml2js.parseString(icucText, function (e: any, result: any) {
			if (e) {
				reject(e);
			} else {
				resolve(result);
			}
		});
	});

	if (response.persEcmQryRtnVo.tCnt[0] === '1') {
		if (loop) {
			return {
				code: 1,
				message: '통관가능(모두일치)',
			};
		} else {
			return {
				code: 2,
				message: '수취인불일치(구매자일치)',
			};
		}
	} else {
		if (loop) {
			if (
				response.persEcmQryRtnVo.tCnt[0] === '0' &&
				response.persEcmQryRtnVo.persEcmQryRtnErrInfoVo[0].errMsgCn[0].includes(
					'납세의무자 휴대전화번호가 일치하지 않습니다.',
				)
			) {
				return {
					code: 1,
					message: '수취인일치(전화번호불일치)',
				};
			}

			return await checkIndividualCustomUniqueCode(data, false);
		} else {
			if (response.persEcmQryRtnVo.tCnt[0] === '0') {
				if (
					response.persEcmQryRtnVo.persEcmQryRtnErrInfoVo[0].errMsgCn[0].includes(
						'납세의무자 휴대전화번호가 일치하지 않습니다.',
					)
				) {
					return {
						code: 2,
						message: '구매자일치(전화번호불일치)',
					};
				} else if (
					response.persEcmQryRtnVo.persEcmQryRtnErrInfoVo[0].errMsgCn[0].includes(
						'개인통관고유부호의 성명과 일치하지 않습니다.',
					)
				) {
					return {
						code: 0,
						message: '통관불가(모두불일치)',
					};
				} else if (
					response.persEcmQryRtnVo.persEcmQryRtnErrInfoVo[0].errMsgCn[0].includes(
						'납세의무자 개인통관고유부호가 존재하지 않습니다.',
					)
				) {
					return {
						code: 0,
						message: '통관불가(통관부호오류)',
					};
				} else {
					return {
						code: 0,
						message: '통관불가(기타오류)',
					};
				}
			} else {
				return {
					code: 0,
					message: '통관불가(기타오류)',
				};
			}
		}
	}
}

// 이미지 WEBP 확장자를 JPG 확장자로 변환
export function convertWebpToJpg(base64: any) {
	return new Promise((resolve, reject) => {
		let image = new Image();

		image.src = base64;
		image.onload = async () => {
			let canvas: any = document.createElement('canvas');

			canvas.width = image.naturalWidth;
			canvas.height = image.naturalHeight;

			canvas.getContext('2d').drawImage(image, 0, 0);

			let fixed_base64 = canvas.toDataURL('image/jpeg');
			let fixed_resp = await fetch(fixed_base64);
			let fixed_blob = await fixed_resp.blob();

			resolve(fixed_blob);

			canvas.remove();
		};

		image.onerror = reject;
	});
}

// JSON Object to XLSX 변환 후 다운로드
export async function downloadExcel(
	result_array: any,
	sheetName: string,
	fileName: string,
	saveAs: boolean,
	extension: string,
) {
	let t = getClock();

	let workbook = XLSX.utils.book_new();
	let worksheet = XLSX.utils.json_to_sheet(result_array);

	XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

	let workdata = null;

	if (extension === 'xlsx') {
		workdata = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
	} else {
		workdata = XLSX.write(workbook, { bookType: 'biff8', type: 'binary' });
	}

	let workurl = URL.createObjectURL(
		new Blob([stringToArrayBuffer(workdata)], {
			type: 'application/octet-stream',
		}),
	);

	chrome.downloads.download({
		url: workurl,
		filename: `${fileName}${saveAs ? '' : '(자동저장)'}_${t.YY}-${t.MM}-${t.DD}.${extension}`,
		saveAs: saveAs,
	});
}

// HTML 문자열에서 텍스트만 추출
export function extractContent(s: String) {
	let span: any = document.createElement('div');

	span.innerHTML = s;

	return span.textContent || span.innerText;
}

// 티몬 주문번호 데이터 가공
export function extractTmonContent(s: String) {
	return s.replace(/\^.+/g, '');
}

// 우측 하단 상태 관련 플로팅 메시지 (~일괄 설정되었습니다.)
export async function floatingToast(message: any, type: any) {
	let toast = document.createElement('div');
	let toastContainer: any = document.getElementById('toastContainer');

	toast.className = `toast ${type}`;
	toast.innerHTML = `
        <div style="display: flex; align-items: center;">
            <img src='${chrome.runtime.getURL(`/resources/icon-${type}.png`)}' width="24px" height="24px" /> 

            &nbsp;

            ${message}
        </div>
    `;

	toastContainer.appendChild(toast);

	await sleep(1000 * 3);

	toast.style.setProperty('-webkit-animation', 'fadeout 1s');
	toast.style.setProperty('animation', 'fadeout 1s');

	await sleep(1000 * 0.8);

	toast.remove();
}

// 한글인명 로마자 변환
export async function getAirportName(name) {
	let res = await fetch('https://dict.naver.com/name-to-roman/translation/?query=' + name);
	let text: string = await res.text();

	const parser = new DOMParser();
	const htmlDocument = parser.parseFromString(text, 'text/html');
	const section = htmlDocument.documentElement.querySelector(
		'#container > div > table > tbody > tr:nth-child(1) > td.cell_engname > a',
	);

	return section?.textContent?.replace(' ', '').toUpperCase();
}

// 현재 시간 객체로 가져오기
export function getClock() {
	let date = new Date();

	return {
		YY: date.getFullYear().toString(),
		MM: (date.getMonth() + 1).toString().padStart(2, '0'),
		DD: date.getDate().toString().padStart(2, '0'),
		hh: date.getHours().toString().padStart(2, '0'),
		mm: date.getMinutes().toString().padStart(2, '0'),
		ss: date.getSeconds().toString().padStart(2, '0'),
	};
}

// 현재 시간 기준 오프셋이 적용된 시간 객체로 가져오기
export function getClockOffset(H: number, M: number, D: number, h: number, m: number, s: number) {
	let date = new Date();

	date.setFullYear(date.getFullYear() + H);
	date.setMonth(date.getMonth() + M);
	date.setDate(date.getDate() + D);
	date.setHours(date.getHours() + h);
	date.setMinutes(date.getMinutes() + m);
	date.setSeconds(date.getSeconds() + s);

	return {
		YY: date.getFullYear().toString(),
		MM: (date.getMonth() + 1).toString().padStart(2, '0'),
		DD: date.getDate().toString().padStart(2, '0'),
		hh: date.getHours().toString().padStart(2, '0'),
		mm: date.getMinutes().toString().padStart(2, '0'),
		ss: date.getSeconds().toString().padStart(2, '0'),
	};
}

// 쿠키 정보 가져오기
export function getCookie(cookieName: string) {
	let cookieValue = '';

	if (document.cookie) {
		let array = document.cookie.split(escape(cookieName) + '=');

		if (array.length >= 2) {
			let arraySub = array[1].split(';');

			cookieValue = unescape(arraySub[0]);
		}
	}

	return cookieValue;
}

// 이미지 URL로 이미지 사이즈 가져오기
export async function getImageMeta(src: string) {
	return new Promise(function (resolve, reject) {
		let image: any = new Image();

		image.onload = function () {
			console.log(resolve(image));
		};

		image.onerror = function () {
			console.log('error');
		};
		// image.onerror = reject;
		image.src = src;
	});
}

// 이미지 용량 구하기
// async function getImageSize(url: any) {
//   return fetch(url)
//     .then((response) => response.blob())
//     .then((blob) => blob.size)
//     .catch((e) => {
//       console.log(e);
//     });
// }
export async function getImageSize(url: string): Promise<number | string> {
	try {
		const response = await fetch(url);
		const blob = await response.blob();
		return blob.size;
	} catch (error) {
		console.log(error);
		if (url.startsWith('https://')) {
			throw error;
		} else {
			const httpsImageUrl = 'https://images.weserv.nl/?url=' + encodeURIComponent(url);
			try {
				const response = await fetch(httpsImageUrl, { method: 'HEAD' });
				const contentLength = response.headers.get('content-length');
				return contentLength ? parseInt(contentLength, 10) : '';
			} catch (e) {
				console.error(e);
				throw e;
			}
		}
	}
}

//타오바오 이미지는 로드하면 aliexpress의 이미지로 넘어가는데 해당 이미지의 프로토콜 문제로
//보안 이슈가 생기므로 https://images.weserv.nl 서비스를 사용함. 이 서비스는 입력받은 이미지 URL을 HTTP나 HTTPS 상관없이 HTTPS 프로토콜로 반환해주는 서비스입니다.

export async function getTaobaoImageSize(url: any) {
	const httpsImageUrl = 'https://images.weserv.nl/?url=' + encodeURIComponent(url);
	return fetch(httpsImageUrl, { method: 'HEAD' })
		.then((response) => response.headers.get('content-length'))
		.catch((error) => {
			console.error(error);
		});
}

// 오픈마켓 등록상품URL 가져오기
export function getStoreUrl(commonStore: any, marketCode: string, productId: any) {
	switch (marketCode) {
		case 'A077': {
			return `${commonStore.user.userInfo.naverStoreUrl}/products/${productId}`;
		}

		case 'B378': {
			return `https://www.coupang.com/vp/products/${productId}`;
		}

		case 'A112': {
			return `https://www.11st.co.kr/products/${productId}`;
		}

		case 'A113': {
			return `https://www.11st.co.kr/products/${productId}`;
		}

		case 'A001': {
			return `http://itempage3.auction.co.kr/DetailView.aspx?ItemNo=${productId}&frm3=V2`;
		}

		case 'A006': {
			return `http://item.gmarket.co.kr/Item?goodscode=${productId}`;
		}

		case 'A027': {
			return `https://shopping.interpark.com/product/productInfo.do?prdNo=${productId}`;
		}

		case 'B719': {
			return `https://front.wemakeprice.com/product/${productId}`;
		}

		case 'A524': {
			return `https://www.lotteon.com/p/product/${productId}`;
		}

		case 'A525': {
			return `https://www.lotteon.com/p/product/${productId}`;
		}

		case 'B956': {
			return `https://www.tmon.co.kr/deal/${productId}`;
		}
	}
}

// 셀포유 추적코드 (미사용)
// function getStoreTraceCode(img: string, productId: number, siteCode: string) {
//   return `<img src="${img}" style="display: none;" onload="(async function(){
//     let body = {
//       query: \`
//         mutation (
//           $productId: Int!
//           $siteCode: String!
//         ) {
//           testProductStoreCnt(
//             productId: $productId
//             siteCode: $siteCode
//           )
//         }
//       \`,

//       variables: {
//         productId: ${productId},
//         siteCode: '${siteCode}'
//       }
//     }

//     const dataResp = await fetch('https://api.sellforyou.co.kr/graphql', {
//       'headers': {
//         'content-type': 'application/json',
//       },
//       'body': JSON.stringify(body),
//       'method': 'POST',
//     });

//     const dataJson = await dataResp.json();
//   })();">`;
// }

// 셀포유 추적코드 (스마트스토어, 11번가(글로벌/일반), 지마켓, 옥션, 인터파크, 위메프)
export function getStoreTraceCodeV1(productId: number, siteCode: string) {
	// return `<img src="https://api.sellforyou.co.kr/api/dataProvider?productId=${productId}&siteCode=${siteCode}" style="display: none;">`;
	return `<img src="https://api.sellforyou.co.kr/api/dataProvider?productId=${productId}&siteCode=${siteCode}" width="1px" height="1px">`;
}

// 셀포유 추적코드 (쿠팡, 롯데온(글로벌/일반), 티몬)
export function getStoreTraceCodeV2(productId: number, siteCode: string) {
	return `<iframe src="https://api.sellforyou.co.kr/api/dataProvider?youtube.com&productId=${productId}&siteCode=${siteCode}" style="display:none;visibility:hidden"></iframe>`;
}

// 난수 생성기 (이미지 스왑용으로 사용 중)
export function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);

	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 두개의 문자열을 비교해서 겹치는 부분만 반환하는 함수
// (예: string1 (수집때옵션이름), string2(카테고리에 따른 권장 옵션이름의 배열) => string2의 배열에서 string1과 매칭되는 걸 찾아,권장 옵션 이름을 옵션 이름으로 지정)
export function matchesCharacter(string1: string, string2: string) {
	const s1 = [...string1];
	const s2 = [...string2];

	const substringMatrix = Array(s2.length + 1)
		.fill(null)
		.map(() => {
			return Array(s1.length + 1).fill(null);
		});

	for (let columnIndex = 0; columnIndex <= s1.length; columnIndex += 1) {
		substringMatrix[0][columnIndex] = 0;
	}

	for (let rowIndex = 0; rowIndex <= s2.length; rowIndex += 1) {
		substringMatrix[rowIndex][0] = 0;
	}

	let longestSubstringLength = 0;
	let longestSubstringColumn = 0;
	let longestSubstringRow = 0;

	for (let rowIndex = 1; rowIndex <= s2.length; rowIndex += 1) {
		for (let columnIndex = 1; columnIndex <= s1.length; columnIndex += 1) {
			if (s1[columnIndex - 1] === s2[rowIndex - 1]) {
				substringMatrix[rowIndex][columnIndex] = substringMatrix[rowIndex - 1][columnIndex - 1] + 1;
			} else {
				substringMatrix[rowIndex][columnIndex] = 0;
			}

			if (substringMatrix[rowIndex][columnIndex] > longestSubstringLength) {
				longestSubstringLength = substringMatrix[rowIndex][columnIndex];
				longestSubstringColumn = columnIndex;
				longestSubstringRow = rowIndex;
			}
		}
	}

	if (longestSubstringLength === 0) {
		return '';
	}

	let longestSubstring = '';

	while (substringMatrix[longestSubstringRow][longestSubstringColumn] > 0) {
		longestSubstring = s1[longestSubstringColumn - 1] + longestSubstring;
		longestSubstringRow -= 1;
		longestSubstringColumn -= 1;
	}

	return longestSubstring;
}

// 원래 우측하단에 윈도우 알림으로 뜨던 기능인데 너무 번잡해서 없애고 플로팅 메시팅만 띄우게 변경됨
export function notificationByEveryTime(message: string) {
	floatingToast(message, 'warning');

	// chrome.notifications.create('sellforyou-' + new Date().getTime(), {
	//     type: 'basic',
	//     iconUrl: '/icon128.png',
	//     title: '셀포유',
	//     message: message,
	//     isClickable: true
	// });
}

// 타오바오 API 사용 시 응답 데이터에서 텍스트 부분이 깨져서 나오는 현상이 있는데 이 경우 블롭형식으로 응답을 받아와서 이 함수를 쓰면 깔끔하게 변환됨
export function parseDecode(blob) {
	return new Promise((resolve, reject) => {
		var reader = new FileReader();

		reader.onload = function (e) {
			var text = reader.result;

			resolve(text);
		};

		reader.readAsText(blob, 'GBK');
	});
}

// XHR Request 비동기 구현
export function request(url: any, opts: any) {
	return new Promise(function (resolve, reject) {
		let xhr = new XMLHttpRequest();

		xhr.open(opts.method, url);

		if (opts.headers) {
			Object.keys(opts.headers).map((v: any) => {
				xhr.setRequestHeader(v, opts.headers[v]);
			});
		}

		xhr.onload = function () {
			resolve(xhr.response);
		};

		xhr.onerror = function () {
			reject({
				status: this.status,
				statusText: xhr.statusText,
				data: 'rejected',
			});
		};

		xhr.send(opts.body);
	});
}

// 파일 업로드 등으로 파일을 읽었을 때 바이너리 스트링으로 가져와야 할 경우 사용 (예: XLSX 라이브러리에서 read할 때)
export function readFileBinary(blob: any) {
	return new Promise((resolve, reject) => {
		let reader = new FileReader();

		reader.onload = () => {
			resolve(reader.result);
		};

		reader.onerror = reject;
		reader.readAsBinaryString(blob);
	});
}

// 보통 이미지 파일을 업로드했을 때 base64 형식으로 변환해야할 경우 사용
export function readFileDataURL(blob: any) {
	return new Promise((resolve, reject) => {
		let reader = new FileReader();

		reader.onload = () => {
			resolve(reader.result);
		};

		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}

// 블롭 데이터 만들 때 사용 (예: XLSX write에서 URL.createObjectUrl로 파일 다운로드 시킬 때 사용)
export function stringToArrayBuffer(s: any) {
	let buf = new ArrayBuffer(s.length);
	let view = new Uint8Array(buf);

	for (let i = 0; i < s.length; i++) {
		view[i] = s.charCodeAt(i) & 0xff;
	}

	return buf;
}

// 상품 등록/수정 시 작업 성공/실패 여부를 백엔드에 전달하는 함수
export async function sendCallback(
	commonStore: any,
	data: any,
	code: string,
	seq: number,
	state: number,
	message: string,
) {
	const today = getClock();

	const progressValue = Math.round(((seq + 1) * 100) / data.DShopInfo.prod_codes.length);

	commonStore.setProgressValue(data.DShopInfo.site_code, progressValue);

	const callbackData = JSON.stringify({
		job_id: 'KOOZA',
		title: 'KOOZA',
		results: {
			'config.json': {
				sol_code: 'KOOZA',
			},

			'result.json': [
				{
					state: state,
					site_code: data.DShopInfo.site_code,
					site_id: '',
					code: code,
					sku_code: null,
					single_yn: null,
					groupkey: null,
					slave_reg_code: data.DShopInfo.site_code !== 'B378' && state === 1 ? message : '0',
					slave_reg_code_sub: data.DShopInfo.site_code === 'B378' && state === 1 ? message : '',
					reg_type: '',
					reg_sell_term: 0,
					reg_fee: 0,
					reg_premium: '',
					slave_wdate: '',
					slave_edate: '',
					msg: state === 1 ? '' : message,
					err_code: null,
					setdata: '',
					setName: data.DShopInfo.site_name,
					toState: '',
					fromWork: 0,
					gmp_sale_no: null,
					isSavedToDB: false,
				},
			],

			datetime: `${today.hh}:${today.mm}:${today.ss}`,
		},
	});

	await gql(MUTATIONS.TEST_ADD_JOB_CALLBACK, { response: callbackData }, false);
}

// 대기 시간 설정
export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Object의 특정 key의 value 값을 기준으로 정렬하는 함수
export function sortBy(array: any, key: string, asc: boolean) {
	let sorted = array.sort(function (a: any, b: any) {
		if (a[key] < b[key]) {
			return asc ? -1 : 1;
		}

		if (a[key] > b[key]) {
			return asc ? 1 : -1;
		}

		return 0;
	});

	return sorted;
}

// Date 날짜객체를 ISO 시간대 문자열로 변환
export function toISO(date: any) {
	function pad(num: any) {
		let norm = Math.floor(Math.abs(num));

		return (norm < 10 ? '0' : '') + norm;
	}

	return (
		date.getFullYear() +
		'-' +
		pad(date.getMonth() + 1) +
		'-' +
		pad(date.getDate()) +
		'T' +
		pad(date.getHours()) +
		':' +
		pad(date.getMinutes()) +
		':' +
		pad(date.getSeconds())
	);
}

// 이미지 좌우 폭을 자동으로 조정하고 <p> 태그에 감싸서 오픈마켓 상세페이지 호환성을 맞춤
export function transformContent(content: any) {
	const descHtml = new DOMParser().parseFromString(content, 'text/html');
	const chunks = descHtml.querySelectorAll('p');

	for (let i in chunks) {
		try {
			chunks[i].style.margin = '0 auto';
		} catch (e) {
			continue;
		}
	}

	return descHtml.body.innerHTML;
}

// URL의 쿼리스트링(key)를 특정값(value)로 변경
export function updateQueryStringParameter(uri, key, value) {
	var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
	var separator = uri.indexOf('?') !== -1 ? '&' : '?';
	if (uri.match(re)) {
		return uri.replace(re, '$1' + key + '=' + value + '$2');
	} else {
		return uri + separator + key + '=' + value;
	}
}

// AJAX Content-Type가 application/x-www-form-urlencoded인 경우, JSON Object를 Encode하는 과정이 필요함
export function urlEncodedObject(urlEncodedData: any) {
	let urlEncodedContent: any = [];

	for (let property in urlEncodedData) {
		let encodedKey = encodeURIComponent(property);
		let encodedValue = encodeURIComponent(urlEncodedData[property]);

		urlEncodedContent.push(encodedKey + '=' + encodedValue);
	}

	return urlEncodedContent.join('&');
}
