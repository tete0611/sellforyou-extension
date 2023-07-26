// VVIC 페이지 삽입 스크립트
async function main() {
	// VVIC 상세페이지 API 링크 찾기
	let descResp = await fetch(window.location.href);
	let descText = await descResp.text();
	let descHtml = new DOMParser().parseFromString(descText, 'text/html');

	// 데이터가 로드될 때까지 루프를 반복함
	while (true) {
		try {
			// 상품명
			let title = document.querySelector(
				'body > div.deatil-wrapper > article > main > section:nth-child(1) > div.detail.product-detail > div.detail-name > h1',
			);

			// 상품 수집에 필요한 정보
			let json = {
				itemVid: ITEM_VID,
				discountPrice: _DISCOUNTPRICE,
				size: _SIZE,
				color: _COLOR,
				colorPics: _COLORPICS === '' ? [] : JSON.parse(_COLORPICS),
				skuMap: _SKUMAP === '' ? [] : JSON.parse(_SKUMAP),
				sizeId: _SIZEID,
				colorId: _COLORID,
				video: _ITEMVIDEO,
				descriptions: descHtml.querySelector('#descTemplate').innerHTML,
				title: title.textContent,
			};
			console.log(json);
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
