// VVIC 페이지 삽입 스크립트
async function main() {
	// VVIC 상세페이지 API 링크 찾기
	const url = window.location.href;
	const itemVid = url.match(/\/item\/([a-fA-F0-9]+)/)[1];
	let timeStamp = new Date().getTime();
	let descResp = await fetch(url);
	let descText = await descResp.text();
	let descHtml = new DOMParser().parseFromString(descText, 'text/html');

	/** 상품 데이터 */
	const resp = await fetch(`https://www.vvic.com/apif/item/${itemVid}/detail`, {
		headers: {
			accept: 'application/json, text/plain, */*',
			'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
			'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"Windows"',
			'sec-fetch-dest': 'empty',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'same-origin',
		},
		referrer: url,
		referrerPolicy: 'strict-origin-when-cross-origin',
		body: null,
		method: 'GET',
		mode: 'cors',
		credentials: 'include',
	});
	const resp_json = await resp.json();
	const colorPairs = resp_json.data?.color_id?.split(',');
	const sizePairs = resp_json.data?.size_id?.split(',');
	const skumap = {};

	for (const size of sizePairs) {
		for (const color of colorPairs) {
			const key = `${size};${color}`;
			skumap[key] = {
				price: resp_json.data.discountPrice,
				skuId: timeStamp.toString(),
			};
			timeStamp += 1;
		}
	}

	// 데이터가 로드될 때까지 루프를 반복함
	while (true) {
		try {
			// 상품명
			// let title = document.querySelector(
			// 	'body > div.deatil-wrapper > article > main > section:nth-child(1) > div.detail.product-detail > div.detail-name > h1',
			// );

			// 상품 수집에 필요한 정보
			let json = {
				itemVid: resp_json.data.vid,
				discountPrice: resp_json.data.discountPrice,
				size: resp_json.data.size,
				color: resp_json.data.color,
				colorPics: resp_json.data.color_pics ?? [],
				skuMap: skumap,
				sizeId: resp_json.data.size_id,
				colorId: resp_json.data.color_id,
				video: resp_json.data.video_url ?? '',
				descriptions: resp_json.data.item_desc.desc,
				title: resp_json.data.title,
			};
			// 세션 스토리지로 데이터 공유할 때 주의사항
			// 1) sendMessage 사용 불가(삽입 스크립트와 크롬 확장프로그램 간 통신 방법은 스토리지가 유일함)
			// 2) 세션 스토리지 키 값이 충돌하지 않도록 고려해야 함
			sessionStorage.setItem('sfy-vvic-item', JSON.stringify(json));

			// 필수 데이터가 수집되었을 경우 루프를 종료
			break;
		} catch (e) {
			console.log(e);

			// 1초마다 루프 반복
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}
}

main();
