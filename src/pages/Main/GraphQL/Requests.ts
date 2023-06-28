import { getLocalStorage } from "../../Tools/ChromeAsync";
import { sleep } from "../../Tools/Common";
import { refreshToken } from "../../Tools/Auth";

// 다중 요청이 들어올 때 세션 처리
let STATUS = "CONTINUED";

// 백엔드와 GraphQL 통신
const gql: any = async (query: any, variables: any, customHeaders: boolean) => {
  try {
    // 토큰 정보를 가져옴
    let auth: any = await getLocalStorage("appInfo");

    // 쿼리/뮤테이션 수행
    const resp = await fetch(`${process.env.SELLFORYOU_API_SERVER}/graphql`, {
      headers: customHeaders
        ? {
            Authorization: "Bearer " + auth?.accessToken,
          }
        : {
            Authorization: "Bearer " + auth?.accessToken,
            "Content-Type": "application/json",
          },

      method: "POST",
      body: customHeaders ? variables : JSON.stringify({ query, variables }),
    });

    let json: any = null;

    try {
      // 쿼리/뮤테이션의 결과를 JSON 파싱
      json = await resp.json();
    } catch (e) {
      // 파싱에 실패한 경우 (서버 오류인 경우)

      let message = ``;

      switch (resp.status) {
        case 502: {
          message = `서버에 연결할 수 없습니다. 채널톡으로 관리자에게 문의 바랍니다.`;
          break;
        }

        case 504: {
          message = `현재 PC에서 요청이 너무 많습니다. 잠시 후 다시시도 바랍니다.\n\n[해결방법]\n상품 조회, 등록, 수정 개수를 줄여주세요.`;

          break;
        }

        default: {
          message = `${resp.status} 에러, 채널톡으로 관리자에게 문의 바랍니다.`;

          break;
        }
      }

      return {
        errors: [{ message }],
      };
    }

    // 파싱 데이터에 오류가 반환된 경우
    if (json.errors) {
      // 토큰이 만료된 경우
      if (json.errors[0].message === "유효한 accessToken이 아닙니다.") {
        // 다중 요청이 들어왔을 때 로직이 한번만 수행될 수 있도록 STATUS를 통해 컨트롤
        switch (STATUS) {
          case "CONTINUED": {
            STATUS = "STOPPED";

            // 로그인 정보가 없는 경우 로그인 페이지로 이동
            if (!auth) {
              STATUS = "TERMINATED";

              try {
                window.location.href = chrome.runtime.getURL("/signin.html");
              } catch (e) {
                //
              }

              return {};
            }

            // 토큰 재발급이 필요한 경우
            const refreshResponse = await refreshToken();

            if (!refreshResponse) {
              STATUS = "TERMINATED";

              return {};
            }

            STATUS = "CONTINUED";

            return await gql(query, variables, customHeaders);
          }

          case "STOPPED": {
            await sleep(1000 * 1);

            return await gql(query, variables, customHeaders);
          }

          case "TERMINATED": {
            return {};
          }
        }
      } else if (json.errors[0].message.includes("timeout")) {
        // 그 외 요청 대기시간이 초과된 경우
        console.log(json.errors[0].message);

        return {
          errors: [
            {
              message: "서버로부터 응답시간이 초과하였습니다. 잠시 후 다시시도 바랍니다.",
            },
          ],
        };
      }
    }

    return json;
  } catch (e: any) {
    // 그 외 알 수 없는 응답의 경우

    let message = ``;

    if (e.toString().includes("Failed to fetch")) {
      message = `페이지를 이동하여 로딩이 중단되었습니다.`;
    }

    return {
      errors: [{ message }],
    };
  }
};

export default gql;
