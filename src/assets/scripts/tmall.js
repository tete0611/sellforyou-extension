async function main() {
    while (true) {
        try {
            let json = {};

            if (window.NEW_DETAIL_ENV) {
                json.pageType = 2;

                sessionStorage.setItem("sfy-tmall-item", JSON.stringify(json));

                break;
            } else {
                let descUrl = null;

                const scripts = document.getElementsByTagName('script');

                for (let i in scripts) {
                    if (scripts[i].innerHTML && scripts[i].innerHTML.includes('TShop.Setup')) {
                        const matched = scripts[i].innerHTML.match(/TShop\.Setup\(([\S\s]+)\);[\S\s]+\);/);
                        const info = JSON.parse(matched[1]);

                        descUrl = /^https?/.test(info.api.descUrl) ? info.api.descUrl : 'https:' + info.api.descUrl;

                        break;
                    }
                }

                window.TShop.onProduct(e => {
                    json = {
                        pageType: 1,
                        itemDO: e.__attrVals.itemDO,
                        buyPrice: e.__attrVals.buyPrice,
                        desc: e.__attrVals.desc,
                        descUrl,
                        propertyPics: e.__attrVals.propertyPics,
                        skuProp: e.__attrVals.skuProp,
                        skuMap: e.__attrVals.skuMap,
                        priceInfo: e.__attrVals.priceInfo,
                        inventory: e.__attrVals.inventory,
                        delivery: e.__attrVals.delivery
                    };
                });

                if (json['itemDO'] && json['buyPrice'] && (json['desc'] || json['descUrl']) && json['priceInfo'] && json['inventory']) {
                    sessionStorage.setItem("sfy-tmall-item", JSON.stringify(json));

                    break;
                }
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (e) {
            console.log(e);

            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

main();