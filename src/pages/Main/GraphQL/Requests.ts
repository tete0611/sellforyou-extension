import MUTATIONS from "./Mutations";

import { getLocalStorage, setLocalStorage } from '../../Tools/ChromeAsync';
import { sleep } from '../../Tools/Common';

let STATUS = "CONTINUED";

const gql: any = async (query: any, variables: any, customHeaders: boolean) => {
    try {
        let auth: any = await getLocalStorage('appInfo');

        const resp = await fetch(`${process.env.SELLFORYOU_API_SERVER}/graphql`, {
            headers: customHeaders ? {
                "Authorization": "Bearer " + auth?.accessToken,
            } : {
                "Authorization": "Bearer " + auth?.accessToken,
                "Content-Type": "application/json"
            },

            method: "POST",
            body: customHeaders ? variables : JSON.stringify({ query, variables }),
        });

        const json = await resp.json();

        if (json.errors) {
            if (json.errors[0].message === '유효한 accessToken이 아닙니다.') {
                switch (STATUS) {
                    case "CONTINUED": {
                        STATUS = "STOPPED";

                        if (!auth) {
                            STATUS = "TERMINATED";

                            try {
                                window.location.href = chrome.runtime.getURL("/signin.html");
                            } catch (e) {
                                //
                            }

                            return {};
                        }

                        const refreshResponse = await gql(MUTATIONS.SILENT_REFRESH_TOKEN, { refreshToken: auth?.refreshToken }, false);

                        if (refreshResponse.errors) {
                            STATUS = "TERMINATED";

                            try {
                                window.location.href = chrome.runtime.getURL("/signin.html");
                            } catch (e) {
                                //
                            }

                            return {};
                        }

                        auth.accessToken = refreshResponse.data.silentRefreshToken.accessToken;
                        auth.refreshToken = refreshResponse.data.silentRefreshToken.refreshToken;

                        await setLocalStorage({ appInfo: auth });

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
            } else if (json.errors[0].message.includes('timeout')) {
                console.log(json.errors[0].message);

                return {
                    errors: [{
                        message: "서버에 연결할 수 없습니다. 잠시 후 다시시도 바랍니다."
                    }]
                }
            }
        }

        return json;
    } catch (e) {
        console.log(e);

        return {
            errors: [{
                message: "서버에 연결할 수 없습니다. 잠시 후 다시시도 바랍니다."
            }]
        }
    }
};

export default gql;