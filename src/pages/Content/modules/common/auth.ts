import { getCookie } from '../../../Tools/Common';

// 상품 수집 전 페이지 사전 점검 (로그인, 페이지 언어/통화 설정)
async function checkLogin(type: string) {
	switch (type) {
		case 'taobao': {
			// if (getCookie('lgc')) {
			//     return true;
			// } else {
			//     alert("타오바오 로그인이 필요합니다.");

			//     return false;
			// }

			return true;
		}

		case 'tmall': {
			// if (getCookie('lgc') || getCookie('login')) {
			//     return true;
			// } else {
			//     alert("티몰 로그인이 필요합니다.");

			//     return false;
			// }

			return true;
		}

		case 'express': {
			// if (getCookie('rmb_pp')) {
			//     if (/^kor/.test(getCookie('site')) && /^KRW/.test(getCookie('c_tp')) && /^KR/.test(getCookie('region')) && /^ko_KR/.test(getCookie('b_locale'))) {
			//         return true;
			//     } else {
			//         alert("배송지: Korea, 언어: 한국어, 통화: KRW 설정 후 재시도 바랍니다.");

			//         return false;
			//     }
			// } else {
			//     alert("알리 익스프레스 로그인이 필요합니다.");

			//     return false;
			// }

			if (
				/^kor/.test(getCookie('site')) &&
				/^KRW/.test(getCookie('c_tp')) &&
				/^KR/.test(getCookie('region')) &&
				/^ko_KR/.test(getCookie('b_locale'))
			) {
				return true;
			} else {
				alert('배송지: Korea, 언어: 한국어, 통화: KRW 설정 후 재시도 바랍니다.');

				return false;
			}
		}

		case 'alibaba': {
			// if (getCookie('__cn_logon_id__')) {
			//     return true;
			// } else {
			//     alert("1688 로그인이 필요합니다.");

			//     return false;
			// }

			return true;
		}

		case 'vvic': {
			// let loginResp = await fetch("https://www.vvic.com/apic/loginUserInfo?user_key=&city=gz&cityMarketId=1", {
			//     "method": "GET",
			//     "credentials": "include"
			// });

			// let loginJson = await loginResp.json();

			// if (loginJson.code === 200) {
			//     return true;
			// } else {
			//     alert("VVIC 로그인이 필요합니다.");

			//     return false;
			// }

			return true;
		}

		case 'amazon-us': {
			if (/^en_US/.test(getCookie('lc-main')) && /^USD/.test(getCookie('i18n-prefs'))) {
				return true;
			} else {
				alert('아마존 미국 상단에서 언어: English, 통화: USD 설정 후 재시도 바랍니다.');

				return false;
			}
		}

		case 'amazon-jp': {
			if (/^ja_JP/.test(getCookie('lc-acbjp')) && /^JPY/.test(getCookie('i18n-prefs'))) {
				return true;
			} else {
				alert('아마존 일본 상단에서 언어: 日本語, 통화: JPY 설정 후 재시도 바랍니다.');

				return false;
			}
		}

		case 'amazon-de': {
			if (/^de_DE/.test(getCookie('lc-acbde')) && /^EUR/.test(getCookie('i18n-prefs'))) {
				return true;
			} else {
				alert('아마존 독일 상단에서 언어: Deutsch, 통화: EUR 설정 후 재시도 바랍니다.');

				return false;
			}
		}

		default:
			break;
	}

	return true;
}

export { checkLogin };
