async function main() {
    while (true) {
        try {
            let domain = null;

            if (window.__STORE_DATA && window.__INIT_DATA) {
                Object.keys(window.__INIT_DATA.data).map((v) => {
                    if (window.__INIT_DATA.data[v].componentType === '@ali/tdmod-od-pc-offer-price') {
                        domain = v;
                    }
                });
            }

            let json = {
                ipageType: window.iDetailConfig && window.iDetailData ? 1 : window.__STORE_DATA && window.__INIT_DATA ? 2 : 0,
                iDetailConfig: window.iDetailConfig ?? window.__STORE_DATA.globalData,
                iDetailData: window.iDetailData ?? window.__INIT_DATA.globalData,
                offerDomain: domain ? window.__INIT_DATA.data[domain].data.offerDomain : ""
            };

            if (json['ipageType'] && json['iDetailConfig'] && json['iDetailData']) {
                sessionStorage.setItem("sfy-alibaba-item", JSON.stringify(json));

                break;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (e) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

main();