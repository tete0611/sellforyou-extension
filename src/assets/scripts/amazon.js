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
			const script = document.createElement('script');
			const scriptData = document.getElementById('imageBlockVariations_feature_div')?.innerHTML;
			// 문자열 데이터를 JSON으로 파싱 가능한 형식으로 변환하기 위해 일부 영역을 잘라냄
			const frontScriptData = scriptData?.slice(58, -57);
			const endScriptData = scriptData?.slice(-57, -40);
			const midScriptData = `sessionStorage.setItem("amazon-item",JSON.stringify(data)); \n`;

			// 가공된 데이터 합치기
			const fullScriptData = frontScriptData + midScriptData + endScriptData;
			const resultData = fullScriptData.replace(/ImageBlockBTF/, 'copy');

			// 엘리먼트에 가공한 데이터 내용 추가
			script.innerHTML = resultData;

			// DOM 트리에 엘리먼트 추가
			const scriptExist = document.getElementsByTagName('head')[0].innerText.includes(`.register('copy'`);
			if (!scriptExist && scriptData) document.getElementsByTagName('head')[0].appendChild(script);

			// 썸네일이미지 파싱 후 엘리먼트 추가
			const thumbnailScript = document.createElement('script');
			const thumbnailScriptData = document.getElementById('imageBlock')?.nextElementSibling?.innerHTML;
			const thumbnailFrontScriptData = thumbnailScriptData?.slice(0, -17);
			const thumbnailEndScriptData = thumbnailScriptData?.slice(-17);
			const thumbnailMidScriptData = `sessionStorage.setItem("amazon-thumbnailItem",JSON.stringify(data)); \n`;
			const thumbnailFullScriptData = thumbnailFrontScriptData + thumbnailMidScriptData + thumbnailEndScriptData;
			const thumbnailResultData = thumbnailFullScriptData.replace(/ImageBlockATF/, 'thumbnailCopy');

			thumbnailScript.innerHTML = thumbnailResultData;

			const thumbnailScriptExist = document.getElementsByTagName('head')[0].innerText.includes('thumbnailCopy');
			if (!thumbnailScriptExist && thumbnailScriptData)
				document.getElementsByTagName('head')[0].appendChild(thumbnailScript);

			try {
				// 옵션 데이터 파싱 후 엘리먼트 추가
				const optionScript = document.createElement('script');
				const otpionScriptData =
					document.getElementById('twisterContainer')?.parentElement?.lastElementChild?.innerHTML;
				const frontOtpionScriptData = otpionScriptData?.slice(9, -102);
				const endOtionScriptData = otpionScriptData?.slice(-103, -1);
				const midOptionScriptData = `sessionStorage.setItem("amazon-optionItem",JSON.stringify(dataToReturn)); \n`;
				const fullOptionScriptData = frontOtpionScriptData + midOptionScriptData + endOtionScriptData;
				const resultOptionData = fullOptionScriptData.replace(/twister-js-init-dpx-data/, 'optionCopy');

				optionScript.innerHTML = resultOptionData;

				const optionScriptExist = document.getElementsByTagName('head')[0].innerText.includes('optionCopy');
				if (!optionScriptExist && otpionScriptData) document.getElementsByTagName('head')[0].appendChild(optionScript);
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
				const json = {
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
