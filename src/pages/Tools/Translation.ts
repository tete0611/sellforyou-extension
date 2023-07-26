import CryptoJS from 'crypto-js';
const papagoApiKey = 'v1.7.6_fa52a4d6c8';
// 파파고 번역 엔진 크롤러
// 파파고 번역 페이지 버전과 다를 경우 응답이 오지 않을 수 있음
// 번역 오류 발생 시 해당 부분 수정 필요
// 현재 버전: v1.7.1_12f919c9b5
async function papagoTranslation(textdict: any, source: string, target: string, input: any) {
	let input_string = '';
	if (!input) {
		for (let i in textdict) {
			input_string += textdict[i];
			input_string += '\n';
		}
	} else {
		input_string = input;
	}

	let device_json: any = {
		url: 'https://papago.naver.com/apis/n2mt/translate',
		id: '364961ac-efa2-49ca-a998-ad55f7f9d32d',
		timestamp: new Date().getTime(),
	};

	device_json['hash'] = CryptoJS.HmacMD5(
		`${device_json.id}\n${device_json.url}\n${device_json.timestamp}`,
		papagoApiKey,
	).toString(CryptoJS.enc.Base64);

	input_string = input_string.replace(/[&]/g, '');

	let encoded = encodeURI(input_string);

	let output = await fetch(device_json.url, {
		headers: {
			authorization: `PPG ${device_json.id}:${device_json.hash}`,
			'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			timestamp: device_json.timestamp,
			'x-apigw-partnerid': 'papago',
		},

		body: `deviceId=${device_json.id}&locale=ko&dict=true&dictDisplay=30&honorific=false&instant=false&paging=false&source=${source}&target=${target}&text=${encoded}`,
		method: 'POST',
	});

	try {
		let result = await output.json();

		let result_array = result.translatedText.split('\n');

		if (!input) {
			let result_count = 0;

			for (let i in textdict) {
				let translated = result_array[result_count];

				translated = translated.replace(/[*]/gi, 'x'); // * => X 처리
				translated = translated.replace(/[\\\?\"<>,]/gi, ' '); // \ / : * ? " < > , => 공백 처리

				textdict[i] = translated;

				result_count += 1;
			}

			return textdict;
		} else {
			return result_array;
		}
	} catch (e) {
		console.log(e);

		return null;
	}
}

export default papagoTranslation;
