// 셀포유 로그인/인증 관련

import MUTATIONS from '../Main/GraphQL/Mutations';
import gql from '../Main/GraphQL/Requests';

import { getLocalStorage, setLocalStorage } from './ChromeAsync';

// 암시적 토큰 재발급 (지속적인 요청으로 세션이 계속 유지되고 있을 경우 로그인 유지)
async function refreshToken() {
  let auth: any = await getLocalStorage('appInfo');

  const refreshResponse = await gql(MUTATIONS.SILENT_REFRESH_TOKEN, { refreshToken: auth?.refreshToken }, false);

  // 토큰 재발급이 불가능한 경우 로그인 페이지로 이동
  if (refreshResponse.errors) {
    try {
      window.location.href = chrome.runtime.getURL('/signin.html');
    } catch (e) {
      //
    }

    return false;
  }

  // 새로운 토큰을 할당 후 저장
  auth.accessToken = refreshResponse.data.silentRefreshToken.accessToken;
  auth.refreshToken = refreshResponse.data.silentRefreshToken.refreshToken;

  await setLocalStorage({ appInfo: auth });

  return true;
}

export { refreshToken };
