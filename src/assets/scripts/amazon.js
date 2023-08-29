// 아마존 페이지 삽입 스크립트

async function main() {
	// 세션 스토리지 초기화
	sessionStorage.removeItem('amazon-item');
	sessionStorage.removeItem('amazon-thumbnailItem');
	sessionStorage.removeItem('amazon-optionItem');

	// 데이터가 로드될 때까지 루프를 반복함
	while (true) {
		try {
			// 필수 데이터를 그대로 가져와서 쓸 수 없기 때문에 가공하는 과정 필요
			let script = document.createElement('script');
			let scriptData = document.getElementById('imageBlockVariations_feature_div').innerHTML;

			// 문자열 데이터를 JSON으로 파싱 가능한 형식으로 변환하기 위해 일부 영역을 잘라냄
			let frontScriptData = scriptData.slice(58, -57);
			let endScriptData = scriptData.slice(-57, -40);
			let midScriptData = `sessionStorage.setItem("amazon-item",JSON.stringify(data)); \n`;

			// 가공된 데이터 합치기
			let fullScriptData = frontScriptData + midScriptData + endScriptData;

			let resultData = fullScriptData.replace(/ImageBlockBTF/, 'copy');

			// 엘리먼트에 가공한 데이터 내용 추가
			script.innerHTML = resultData;

			// DOM 트리에 엘리먼트 추가
			document.getElementsByTagName('head')[0].appendChild(script);

			// 썸네일이미지 파싱 후 엘리먼트 추가
			let thumbnailScript = document.createElement('script');
			let thumbnailScriptData = document.getElementById('imageBlock').nextElementSibling.innerHTML;
			let thumbnailFrontScriptData = thumbnailScriptData.slice(0, -17);
			let thumbnailEndScriptData = thumbnailScriptData.slice(-17);
			let thumbnailMidScriptData = `sessionStorage.setItem("amazon-thumbnailItem",JSON.stringify(data)); \n`;

			let thumbnailFullScriptData = thumbnailFrontScriptData + thumbnailMidScriptData + thumbnailEndScriptData;

			let thumbnailResultData = thumbnailFullScriptData.replace(/ImageBlockATF/, 'thumbnailCopy');

			thumbnailScript.innerHTML = thumbnailResultData;

			document.getElementsByTagName('head')[0].appendChild(thumbnailScript);

			try {
				// 옵션 데이터 파싱 후 엘리먼트 추가
				let optionScript = document.createElement('script');
				let otpionScriptData = document.getElementById('twisterContainer').parentElement.lastElementChild.innerHTML;

				let frontOtpionScriptData = otpionScriptData.slice(9, -102);
				let endOtionScriptData = otpionScriptData.slice(-103, -1);
				let midOptionScriptData = `sessionStorage.setItem("amazon-optionItem",JSON.stringify(dataToReturn)); \n`;

				let fullOptionScriptData = frontOtpionScriptData + midOptionScriptData + endOtionScriptData;

				let resultOptionData = fullOptionScriptData.replace(/twister-js-init-dpx-data/, 'optionCopy');

				optionScript.innerHTML = resultOptionData;

				document.getElementsByTagName('head')[0].appendChild(optionScript);
			} catch (e) {
				// 옵션 데이터가 없는 경우
				console.log('에러: 옵션 세부정보를 가져오지 못했습니다. (', e, ')');
			}

			// 삽입된 엘리먼트로부터 데이터 가져오기
			const item = sessionStorage.getItem('amazon-item');
			const thumbnailItem = sessionStorage.getItem('amazon-thumbnailItem');
			const optionItem = sessionStorage.getItem('amazon-optionItem');

			// 필수 데이터 체크 (상품 기본정보, 썸네일이미지)
			if (item && thumbnailItem) {
				let json = {
					item,
					thumbnailItem,
					optionItem,
				};

				// 세션 스토리지로 데이터 공유할 때 주의사항
				// 1) sendMessage 사용 불가(삽입 스크립트와 크롬 확장프로그램 간 통신 방법은 스토리지가 유일함)
				// 2) 세션 스토리지 키 값이 충돌하지 않도록 고려해야 함
				sessionStorage.setItem('sfy-amazon-item', JSON.stringify(json));

				break;
			}

			// 1초마다 루프 반복
			await new Promise((resolve) => setTimeout(resolve, 1000));
		} catch (e) {
			console.log(e);

			// 1초마다 루프 반복
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}
}

main();
