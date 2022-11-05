import MUTATIONS from "../Main/GraphQL/Mutations";
import QUERIES from "../Main/GraphQL/Queries";
import gql from "../Main/GraphQL/Requests";

import { byteSlice, extractContent, getClock, getClockOffset, notificationByEveryTime, sendCallback, transformContent, urlEncodedObject } from "./Common";

async function deleteESMPlus(productStore: any, commonStore: any, data: any) {
    if (!data) {
        return false;
    }

    let shopName = data.DShopInfo.site_name;

    console.log(`(${shopName}) 등록정보:`, data);

    try {
        let esmplusAuctionId;
        let esmplusGmarketId;

        let upload_type: any = [];

        let delivery_policy_code = "0";

        let gg_text = null;

        try {
            let gg_resp = await fetch("https://www.esmplus.com/Member/AntiMoneyLaundering/GetAMLSellerList");

            gg_text = await gg_resp.json();
        } catch (e) {
            //
        }

        if (!gg_text) {
            productStore.addConsoleText(`(${shopName}) ESMPLUS 로그인 실패`);
            notificationByEveryTime(`(${shopName}) ESMPLUS 로그인 후 재시도 바랍니다.`);

            return false;
        }

        let gg_json = JSON.parse(gg_text);

        switch (data.DShopInfo.site_code) {
            case "A006": {
                let user_g_resp = await fetch("https://www.esmplus.com/Home/HomeSellerActivityBalanceGmktData?sellerid=", {
                    "body": null,
                    "method": "GET",
                });

                let user_g_json = await user_g_resp.json();

                esmplusGmarketId = commonStore.user.userInfo.esmplusGmarketId;

                if (esmplusGmarketId === user_g_json.sellerid) {
                    upload_type.push({ key: "1", value: "" });
                    upload_type.push({ key: "2", value: esmplusGmarketId });
                } else {
                    let matched = false;

                    for (let i in gg_json) {
                        if (gg_json[i].SiteId === 2 && esmplusGmarketId === gg_json[i].SellerId) {
                            upload_type.push({ key: "1", value: "" });
                            upload_type.push({ key: "2", value: esmplusGmarketId });

                            matched = true;

                            break;
                        }
                    }

                    if (!matched) {
                        productStore.addConsoleText(`(${shopName}) 스토어 연동정보 확인 실패`);
                        notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

                        return false;
                    }
                }

                let delivery_policy_resp = await fetch(`https://www.esmplus.com/SELL/SYI/GetTransPolicyList?siteId=2&sellerId=${esmplusGmarketId}`);
                let delivery_policy_json = await delivery_policy_resp.json();

                delivery_policy_code = delivery_policy_json[0].TransPolicyNo.toString();

                break;
            }

            case "A001": {
                let user_a_resp = await fetch("https://www.esmplus.com/Home/HomeSellerActivityBalanceIacData?sellerid=", {
                    "body": null,
                    "method": "GET",
                });

                let user_a_json = await user_a_resp.json();

                esmplusAuctionId = commonStore.user.userInfo.esmplusAuctionId;

                if (esmplusAuctionId === user_a_json.sellerid) {
                    upload_type.push({ key: "1", value: esmplusAuctionId });
                    upload_type.push({ key: "2", value: "" });
                } else {
                    let matched = false;

                    for (let i in gg_json) {
                        if (gg_json[i].SiteId === 1 && esmplusAuctionId === gg_json[i].SellerId) {
                            upload_type.push({ key: "1", value: esmplusAuctionId });
                            upload_type.push({ key: "2", value: "" });

                            matched = true;

                            break;
                        }
                    }

                    if (!matched) {
                        productStore.addConsoleText(`(${shopName}) 스토어 연동정보 확인 실패`);
                        notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

                        return false;
                    }
                }

                let delivery_policy_resp = await fetch(`https://www.esmplus.com/SELL/SYI/GetTransPolicyList?siteId=1&sellerId=${esmplusAuctionId}`);
                let delivery_policy_json = await delivery_policy_resp.json();

                delivery_policy_code = delivery_policy_json[0].TransPolicyNo.toString();

                break;
            }

            default: break;
        }

        let delivery_shipping_code = "0";

        let delivery_shipping_resp = await fetch('https://www.esmplus.com/SELL/SYI/GetShipmentPlaces');
        let delivery_shipping_json = await delivery_shipping_resp.json();

        for (let i in delivery_shipping_json) {
            if (delivery_shipping_json[i].DefaultIs) {
                delivery_shipping_code = delivery_shipping_json[i].ShipmentPlaceNo;

                break;
            }
        }

        let delivery_return_code = "0";

        let delivery_return_resp = await fetch('https://www.esmplus.com/SELL/SYI/GetDefaultReturnMemberAddress');
        let delivery_return_json = await delivery_return_resp.json();

        delivery_return_code = delivery_return_json.MembAddrNo.toString();

        for (let product in data.DShopInfo.prod_codes) {
            let market_code = data.DShopInfo.prod_codes[product];
            let market_item = data.DShopInfo.DataDataSet.data[product];
            let market_optn = data.DShopInfo.DataDataSet.data_opt;

            if (market_item.cert) {
                continue;
            }

            let image_list: any = [];

            let name = byteSlice(market_item.name3, 50);

            for (let i in market_item) {
                if (i.match(/img[0-9]/) && !i.includes('blob') && i !== "img1") {
                    if (market_item[i] !== "") {
                        try {
                            let img = /^https?:/.test(market_item[i]) ? market_item[i] : "http:" + market_item[i];

                            image_list.push({
                                "Operation": 1,
                                "Url": img,
                                "BigImage": "false",
                                "ImageSourceCode": "0",
                                "ImageSourceOriginId": ""
                            })
                        } catch {
                            continue;
                        }
                    }
                }
            }

            if (!commonStore.uploadInfo.markets.find((v: any) => v.code === data.DShopInfo.site_code).video) {
                market_item.misc1 = "";
            }

            let desc = `
                ${market_item.content2}

				<div style="text-align: center;">
					${market_item.misc1 !== "" ?
                    `
							<video controls>
								<source src="${market_item.misc1}" type="video/mp4">
							</video>
							
							<br />
							<br />
						`
                    :
                    ``
                }

					${commonStore.user.userInfo.descriptionShowTitle === "Y" ?
                    market_item.name3
                    :
                    ``
                }
				</div>
								
				<br />
				<br />
				
				${transformContent(market_item.content1)}
                ${market_item.content3}
			`;

            let group: any = {};

            let words = await gql(QUERIES.SELECT_WORD_TABLES_BY_SOMEONE, {}, false);
            let words_list = words.data.selectWordTablesBySomeone;

            let words_restrict: any = {};

            for (let i in words_list) {
                if (words_list[i].findWord && !words_list[i].replaceWord) {
                    if (market_item.name3.includes(words_list[i].findWord)) {
                        words_restrict['상품명'] = words_list[i].findWord;
                    }
                }
            }

            for (let i in market_optn) {
                if (market_optn[i].code === market_code) {
                    for (let j in market_optn[i]) {
                        if (j.includes('misc') && market_optn[i][j] !== "") {
                            group[market_optn[i][j]] = j.replace("misc", "opt");
                        }

                        if (j.includes('opt') && j !== 'optimg' && market_optn[i][j] !== "") {
                            for (let k in words_list) {
                                if (words_list[k].findWord && !words_list[k].replaceWord) {
                                    if (market_optn[i][j].includes(words_list[k].findWord)) {
                                        words_restrict['옵션명'] = words_list[k].findWord;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (Object.keys(words_restrict).length > 0) {
                let message = "";

                for (let i in words_restrict) {
                    message += i + "에서 금지어(" + words_restrict[i] + ")가 발견되었습니다. ";
                }

                productStore.addRegisteredFailed(Object.assign(market_item, { error: message }));
                productStore.addConsoleText(`(${shopName}) [${market_code}] 금지어 발견됨`);

                await sendCallback(commonStore, data, market_code, parseInt(product), 2, message);

                continue;
            }

            let option_count = Object.keys(group).length;

            let option_data: any = {
                "OptTextList": [],
                "OptSel": {
                    "ObjOptInfo": {
                        "ObjOptNo1": 0,
                        "ObjOptNo2": 0,
                        "ObjOptNo3": 0,
                        "ObjOptNo4": 0,
                        "ObjOptNo5": 0,

                        "ObjOptClaseNm1": "",
                        "ObjOptClaseNm2": "",
                        "ObjOptClaseNm3": "",
                        "ObjOptClaseNm4": "",
                        "ObjOptClaseNm5": "",

                        "EngObjOptClaseNm1": "",
                        "EngObjOptClaseNm2": "",
                        "EngObjOptClaseNm3": "",
                        "EngObjOptClaseNm4": "",
                        "EngObjOptClaseNm5": "",

                        "ChnObjOptClaseNm1": "",
                        "ChnObjOptClaseNm2": "",
                        "ChnObjOptClaseNm3": "",
                        "ChnObjOptClaseNm4": "",
                        "ChnObjOptClaseNm5": "",

                        "JpnObjOptClaseNm1": "",
                        "JpnObjOptClaseNm2": "",
                        "JpnObjOptClaseNm3": "",
                        "JpnObjOptClaseNm4": "",
                        "JpnObjOptClaseNm5": ""
                    },

                    "StockList": [],
                    "Calculation": null,
                    "OptSelType": option_count,
                    "OptRepImageLevel": 0,
                    "OptDetailImageLevel": 0,
                    "StockMngIs": false,
                    "SortOrder": 1,
                },

                "OptAdd": null,
                // "OptQty":99999,
                "OptQtySiteStockNo": 0,
                "OptAddQty": 0,
                "OptSelUseIs": true,
                "OptTextUseIs": false,
                "OptAddUseIs": false,
                "IsUseCommonGoods": false,
                "CommonGoodsNo": null,
                "NotModified": false,
                "OptVerType": 2
            };

            for (let i in market_optn) {
                if (market_optn[i].code === market_code) {
                    if (commonStore.user.userInfo.autoPrice === 'Y') {
                        let iprice = market_item.sprice;
                        let oprice = market_item.sprice + market_optn[i].price;

                        let percent = Math.ceil((oprice / iprice - 1) * 100);

                        if (data.DShopInfo.site_code === 'A001') {
                            if (percent < -50 || percent > 50) {
                                continue;
                            }
                        }
                    }

                    option_data['OptSel']['ObjOptInfo']['ObjOptClaseNm1'] = market_optn[i].misc1;
                    option_data['OptSel']['ObjOptInfo']['ObjOptClaseNm2'] = market_optn[i].misc2;
                    option_data['OptSel']['ObjOptInfo']['ObjOptClaseNm3'] = market_optn[i].misc3;

                    if (option_count === 1) {
                        option_data['OptSel']['StockList'].push({
                            "SiteStockNo": 0,
                            "Text1": market_optn[i].misc1,
                            "Text1En": "",
                            "Text1Chn": "",
                            "Text1Jpn": "",
                            "Text2": market_optn[i].opt1,
                            "Text2En": "",
                            "Text2Chn": "",
                            "Text2Jpn": "",
                            "Text3": "",
                            "Text3En": "",
                            "Text3Chn": "",
                            "Text3Jpn": "",
                            "ObjOptClaseEssenNo1": 0,
                            "ObjOptClaseEssenNo2": 0,
                            "ObjOptClaseEssenNo3": 0,
                            "Qty": market_optn[i].stock,
                            "Price": market_optn[i].price,
                            "SoldOutIs": false,
                            "DisplayIs": true,
                            "RepImageUrl": "",
                            "DetailImageMasterSeq": 0,
                            "DetailImageUseIs": "N",
                            "ManageCode": "",
                            "SkuList": [],
                            "ChangeType": 1
                        });
                    } else {
                        option_data['OptSel']['StockList'].push({
                            "SiteStockNo": 0,
                            "Text1": market_optn[i].opt1,
                            "Text1En": "",
                            "Text1Chn": "",
                            "Text1Jpn": "",
                            "Text2": market_optn[i].opt2,
                            "Text2En": "",
                            "Text2Chn": "",
                            "Text2Jpn": "",
                            "Text3": market_optn[i].opt3,
                            "Text3En": "",
                            "Text3Chn": "",
                            "Text3Jpn": "",
                            "ObjOptClaseEssenNo1": 0,
                            "ObjOptClaseEssenNo2": 0,
                            "ObjOptClaseEssenNo3": 0,
                            "Qty": market_optn[i].stock,
                            "Price": market_optn[i].price,
                            "SoldOutIs": false,
                            "DisplayIs": true,
                            "RepImageUrl": "",
                            "DetailImageMasterSeq": 0,
                            "DetailImageUseIs": "N",
                            "ManageCode": "",
                            "SkuList": [],
                            "ChangeType": 1
                        });
                    }
                }
            }

            let date = new Date();

            let YY1 = date.getFullYear().toString()
            let MM1 = (date.getMonth() + 1).toString().padStart(2, '0')
            let DD1 = date.getDate().toString().padStart(2, '0')

            date.setDate(date.getDate() + 90);

            let YY2 = date.getFullYear().toString()
            let MM2 = (date.getMonth() + 1).toString().padStart(2, '0')
            let DD2 = date.getDate().toString().padStart(2, '0')

            let test_body: any = {
                "SYIStep1": {
                    "RegMarketType": data.DShopInfo.site_code === 'A001' ? '1' : '2',
                    "SiteSellerId": upload_type,
                    "SellType": "1",
                    "GoodsType": "1",

                    "GoodsName": {
                        "InputType": "1",
                        "GoodsName": name,
                    },

                    "SiteCategoryCode": [
                        {
                            "key": "1",
                            "value": market_item.cate_code
                        },
                        {
                            "key": "2",
                            "value": market_item.cate_code
                        }
                    ],
                },

                "SYIStep2": {
                    "SellingStatus": "0",
                    "GoodsStatus": "1",

                    "Price": {
                        "InputType": "1",
                        "GoodsPrice": market_item.sprice.toString(),
                        "GoodsPriceIAC": market_item.sprice.toString(),
                        "GoodsPriceGMKT": market_item.sprice.toString(),
                    },

                    "Stock": {
                        "InputType": "1",
                        "GoodsCount": market_item.stock.toString(),
                        "GoodsCountIAC": market_item.stock.toString(),
                        "GoodsCountGMKT": market_item.stock.toString()
                    },

                    "Options": {
                        "InputType": "1",
                        "OptVerType": "2",
                        "OptVerTypeIAC": "1",
                        "OptVerTypeGMKT": "1",
                        "JsonData": option_count > 0 ? JSON.stringify(option_data) : "",
                    },

                    "SellingPeriod": {
                        "InputType": "1",

                        "IAC": {
                            "StartDate": `${YY1}-${MM1}-${DD1} 00:00:00`,
                            "EndDate": `${YY2}-${MM2}-${DD2} 23:59:59`
                        },

                        "GMKT": {
                            "StartDate": `${YY1}-${MM1}-${DD1} 00:00:00`,
                            "EndDate": `${YY2}-${MM2}-${DD2} 23:59:59`
                        },
                    },

                    "GoodsImage": {
                        "PrimaryImage": {
                            "Operation": "1",
                            "Url": market_item.img1,
                            "BigImage": "false"
                        },

                        "ListImage": {
                            "Operation": "1",
                            "Url": market_item.img1,
                            "BigImage": "false"
                        },

                        "FixedImage": {
                            "Operation": "1",
                            "Url": market_item.img1,
                            "BigImage": "false"
                        },

                        "ExpandedImage": {
                            "Operation": "1",
                            "Url": market_item.img1,
                            "BigImage": "false"
                        },

                        "AdditionalImagesSite": "0",
                        "AdditionalImagesStr": JSON.stringify(image_list)
                    },

                    "DescriptionTypeSpecified": true,

                    "NewDescription": {
                        "InputType": "1",
                        "Text": desc
                    },

                    "ItemCode": market_code,

                    "DeliveryInfo": {
                        "CommonDeliveryUseYn": true,
                        "InvalidDeliveryInfo": false,
                        "CommonDeliveryWayOPTSEL": "1",
                        "GmktDeliveryWayOPTSEL": "0",
                        "IsCommonGmktUnifyDelivery": false,
                        "GmktDeliveryCOMP": "100000244",
                        "IacDeliveryCOMP": "10034",
                        "IsCommonVisitTake": false,
                        "IsCommonQuickService": false,
                        "IsCommonIACPost": false,
                        "CommonIACPostType": "0",
                        "CommonIACPostPaidPrice": "0",
                        "IsGmktVisitTake": false,
                        "IsGmktQuickService": false,
                        "IsGmktTodayDEPAR": false,
                        "IsGmktTodayDEPARAgree": false,
                        "IsGmktVisitReceiptTier": false,
                        "MountBranchGroupSeq": "0",
                        "CommonVisitTakeType": "0",
                        "CommonVisitTakePriceDcAmnt": "0",
                        "CommonVisitTakeFreeGiftName": null,
                        "CommonVisitTakeADDRNo": null,
                        "CommonQuickServiceCOMPName": null,
                        "CommonQuickServicePhone": null,
                        "CommonQuickServiceDeliveryEnableRegionNo": null,
                        "ShipmentPlaceNo": delivery_shipping_code.toString(),
                        "DeliveryFeeType": "2",
                        "EachDeliveryFeeType": market_item.deliv_fee > 0 ? "2" : "1",
                        "EachDeliveryFeeQTYEachGradeType": null,
                        "DeliveryFeeTemplateJSON": market_item.deliv_fee > 0 ?
                            JSON.stringify({
                                "DeliveryFeeType": 2,
                                "DeliveryFeeSubType": 0,
                                "FeeAmnt": market_item.deliv_fee,
                                "PrepayIs": true,
                                "CodIs": false,
                                "JejuAddDeliveryFee": commonStore.user.userInfo.additionalShippingFeeJeju,
                                "BackwoodsAddDeliveryFee": commonStore.user.userInfo.additionalShippingFeeJeju,
                                "ShipmentPlaceNo": delivery_shipping_code,
                                "DetailList": []
                            })
                            :
                            JSON.stringify({
                                "DeliveryFeeType": 1,
                                "DeliveryFeeSubType": 0,
                                "FeeAmnt": 0,
                                "PrepayIs": false,
                                "CodIs": false,
                                "JejuAddDeliveryFee": 0,
                                "BackwoodsAddDeliveryFee": 0,
                                "ShipmentPlaceNo": delivery_shipping_code,
                                "DetailList": []
                            }),
                        "EachDeliveryFeePayYn": "2",
                        "IsCommonGmktEachADDR": false,
                        "ReturnExchangeADDRNo": delivery_return_code,
                        "OldReturnExchangeADDR": null,
                        "OldReturnExchangeADDRTel": null,
                        "OldReturnExchangeSetupDeliveryCOMPName": null,
                        "OldReturnExchangeDeliveryFeeStr": null,
                        "ExchangeADDRNo": "",
                        "ReturnExchangeSetupDeliveryCOMP": null,
                        "ReturnExchangeSetupDeliveryCOMPName": null,
                        "ReturnExchangeDeliveryFee": "0",
                        "ReturnExchangeDeliveryFeeStr": commonStore.user.userInfo.refundShippingFee.toString(),
                        "IacTransPolicyNo": delivery_policy_code,
                        "GmktTransPolicyNo": delivery_policy_code,
                        "BackwoodsDeliveryYn": null,
                        "IsTplConvertible": false,
                        "IsGmktIACPost": false
                    },

                    "IsAdultProduct": "False",
                    "IsVATFree": "False",

                    "CertIAC": {
                        "ChildProductSafeCert": {
                            "ChangeType": "0",
                            "SafeCertDetailInfoList": null
                        },

                        "IntegrateSafeCert": {
                            "ItemNo": null,

                            "IntegrateSafeCertGroupList": [
                                {
                                    "SafeCertGroupNo": "1",
                                    "CertificationType": "1"
                                },
                                {
                                    "SafeCertGroupNo": "2",
                                    "CertificationType": "1"
                                },
                                {
                                    "SafeCertGroupNo": "3",
                                    "CertificationType": "1"
                                }
                            ]
                        }
                    },

                    "OfficialNotice": {
                        "NoticeItemGroupNo": "35",
                        "NoticeItemCodes": [
                            {
                                "NoticeItemCode": "35-1",
                                "NoticeItemValue": "상세설명참조"
                            },
                            {
                                "NoticeItemCode": "35-2",
                                "NoticeItemValue": "상세설명참조"
                            },
                            {
                                "NoticeItemCode": "35-3",
                                "NoticeItemValue": "상세설명참조"
                            },
                            {
                                "NoticeItemCode": "35-4",
                                "NoticeItemValue": "상세설명참조"
                            },
                            {
                                "NoticeItemCode": "35-5",
                                "NoticeItemValue": "상세설명참조"
                            },
                            {
                                "NoticeItemCode": "35-6",
                                "NoticeItemValue": "상세설명참조"
                            },
                            {
                                "NoticeItemCode": "999-5",
                                "NoticeItemValue": ""
                            }
                        ]
                    }
                },

                "SYIStep3": {
                    "SellerDiscount": {
                        "IsUsed": "2",
                        "IsUsedSpecified": true,
                    },

                    "IacDiscountAgreement": false,
                    "IacDiscountAgreementSpecified": true,
                    "GmkDiscountAgreement": false,
                    "GmkDiscountAgreementSpecified": true,
                }
            };

            let productId = productStore.itemInfo.items.find((v: any) => v.productCode === market_code).activeProductStore.find((v: any) => v.siteCode === data.DShopInfo.site_code).storeProductId;

            if (!productId) {
                continue;
            }

            let productData = {
                paramsData: `{"Keyword": "${productId}","SiteId":"0","SellType":0,"CategoryCode":"","CustCategoryCode":0,"TransPolicyNo":0,"StatusCode":"","SearchDateType":0,"StartDate":"","EndDate":"","SellerId":"","StockQty":-1,"SellPeriod":0,"DeliveryFeeApplyType":0,"OptAddDeliveryType":0,"SellMinPrice":0,"SellMaxPrice":0,"OptSelUseIs":-1,"PremiumEnd":0,"PremiumPlusEnd":0,"FocusEnd":0,"FocusPlusEnd":0,"GoodsIds":"","SellMngCode":"","OrderByType":11,"NotiItemReg":-1,"EpinMatch":-1,"UserEvaluate":"","ShopCateReg":-1,"IsTPLUse":"","GoodsName":"","SdBrandId":0,"SdBrandName":""}`,
                page: 1,
                start: 0,
                limit: 30
            };

            let productContent: any = [];

            for (let property in productData) {
                let encodedKey = encodeURIComponent(property);
                let encodedValue = encodeURIComponent(productData[property]);

                productContent.push(encodedKey + "=" + encodedValue);
            }

            productContent = productContent.join("&");

            const productResp = await fetch("https://www.esmplus.com/Sell/Items/GetItemMngList", {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"104\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrer": "https://www.esmplus.com/Sell/Items/ItemsMng?menuCode=TDM100",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": productContent,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });

            const productJson = await productResp.json();

            if (productJson.data.length < 1) {
                const progressValue = Math.round((parseInt(product) + 1) * 100 / data.DShopInfo.prod_codes.length);

                commonStore.setDisabledProgressValue(data.DShopInfo.site_code, progressValue);

                await gql(MUTATIONS.UNLINK_PRODUCT_STORE, { productId: market_item.id, siteCode: data.DShopInfo.site_code })

                continue;
            }

            let deleteBody = {
                "model": {
                    ...test_body,

                    "GoodsNo": productJson.data[0].GoodsNo.toString(),
                    "SiteGoodsNo": productId,
                    "CommandType": "2",
                    "IsIacSellingStatus": "2",
                }
            }

            if (data.DShopInfo.site_code === 'A006') {
                deleteBody.model.SYIStep1.StatusCode = "11";
                deleteBody.model.SYIStep2.SellingStatus = "21";
            }

            const stopResp = await fetch("https://www.esmplus.com/sell/goods/save", {
                "headers": {
                    "content-type": "application/json",
                },

                "body": JSON.stringify(deleteBody),
                "method": "POST",
            });

            try {
                await stopResp.json();
            } catch (e) {
                deleteBody.model.CommandType = "4";

                const deleteResp = await fetch("https://www.esmplus.com/sell/goods/save", {
                    "headers": {
                        "content-type": "application/json",
                    },

                    "body": JSON.stringify(deleteBody),
                    "method": "POST",
                });

                try {
                    await deleteResp.json();
                } catch (e) {
                    const progressValue = Math.round((parseInt(product) + 1) * 100 / data.DShopInfo.prod_codes.length);

                    commonStore.setDisabledProgressValue(data.DShopInfo.site_code, progressValue);

                    await gql(MUTATIONS.UNLINK_PRODUCT_STORE, { productId: market_item.id, siteCode: data.DShopInfo.site_code })
                }
            }
        }
    } catch (e: any) {
        productStore.addConsoleText(`(${shopName}) 상품 등록해제 중단`);
        notificationByEveryTime(`(${shopName}) 상품 등록해제 도중 오류가 발생하였습니다. (${e.toString()})`);

        return false;
    }

    productStore.addConsoleText(`(${shopName}) 상품 등록해제 완료`);

    return true;
}

async function uploadESMPlus(productStore: any, commonStore: any, data: any) {
    if (!data) {
        return false;
    }

    let shopName = data.DShopInfo.site_name;

    console.log(`(${shopName}) 등록정보:`, data);

    try {
        let esmplusAuctionId;
        let esmplusGmarketId;

        let upload_type: any = [];

        let delivery_policy_code = "0";

        let gg_text = null;

        try {
            let gg_resp = await fetch("https://www.esmplus.com/Member/AntiMoneyLaundering/GetAMLSellerList");

            gg_text = await gg_resp.json();
        } catch (e) {
            //
        }

        if (!gg_text) {
            productStore.addConsoleText(`(${shopName}) ESMPLUS 로그인 실패`);
            notificationByEveryTime(`(${shopName}) ESMPLUS 로그인 후 재시도 바랍니다.`);

            return false;
        }

        let gg_json = JSON.parse(gg_text);

        switch (data.DShopInfo.site_code) {
            case "A006": {
                let user_g_resp = await fetch("https://www.esmplus.com/Home/HomeSellerActivityBalanceGmktData?sellerid=", {
                    "body": null,
                    "method": "GET",
                });

                let user_g_json = await user_g_resp.json();

                esmplusGmarketId = commonStore.user.userInfo.esmplusGmarketId;

                if (esmplusGmarketId === user_g_json.sellerid) {
                    upload_type.push({ key: "1", value: "" });
                    upload_type.push({ key: "2", value: esmplusGmarketId });
                } else {
                    let matched = false;

                    for (let i in gg_json) {
                        if (gg_json[i].SiteId === 2 && esmplusGmarketId === gg_json[i].SellerId) {
                            upload_type.push({ key: "1", value: "" });
                            upload_type.push({ key: "2", value: esmplusGmarketId });

                            matched = true;

                            break;
                        }
                    }

                    if (!matched) {
                        productStore.addConsoleText(`(${shopName}) 스토어 연동정보 확인 실패`);
                        notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

                        return false;
                    }
                }

                let delivery_policy_resp = await fetch(`https://www.esmplus.com/SELL/SYI/GetTransPolicyList?siteId=2&sellerId=${esmplusGmarketId}`);
                let delivery_policy_json = await delivery_policy_resp.json();

                delivery_policy_code = delivery_policy_json[0].TransPolicyNo.toString();

                break;
            }

            case "A001": {
                let user_a_resp = await fetch("https://www.esmplus.com/Home/HomeSellerActivityBalanceIacData?sellerid=", {
                    "body": null,
                    "method": "GET",
                });

                let user_a_json = await user_a_resp.json();

                esmplusAuctionId = commonStore.user.userInfo.esmplusAuctionId;

                if (esmplusAuctionId === user_a_json.sellerid) {
                    upload_type.push({ key: "1", value: esmplusAuctionId });
                    upload_type.push({ key: "2", value: "" });
                } else {
                    let matched = false;

                    for (let i in gg_json) {
                        if (gg_json[i].SiteId === 1 && esmplusAuctionId === gg_json[i].SellerId) {
                            upload_type.push({ key: "1", value: esmplusAuctionId });
                            upload_type.push({ key: "2", value: "" });

                            matched = true;

                            break;
                        }
                    }

                    if (!matched) {
                        productStore.addConsoleText(`(${shopName}) 스토어 연동정보 확인 실패`);
                        notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

                        return false;
                    }
                }

                let delivery_policy_resp = await fetch(`https://www.esmplus.com/SELL/SYI/GetTransPolicyList?siteId=1&sellerId=${esmplusAuctionId}`);
                let delivery_policy_json = await delivery_policy_resp.json();

                delivery_policy_code = delivery_policy_json[0].TransPolicyNo.toString();

                break;
            }

            default: break;
        }

        let delivery_shipping_code = "0";

        let delivery_shipping_resp = await fetch('https://www.esmplus.com/SELL/SYI/GetShipmentPlaces');
        let delivery_shipping_json = await delivery_shipping_resp.json();

        for (let i in delivery_shipping_json) {
            if (delivery_shipping_json[i].DefaultIs) {
                delivery_shipping_code = delivery_shipping_json[i].ShipmentPlaceNo;

                break;
            }
        }

        let delivery_return_code = "0";

        let delivery_return_resp = await fetch('https://www.esmplus.com/SELL/SYI/GetDefaultReturnMemberAddress');
        let delivery_return_json = await delivery_return_resp.json();

        delivery_return_code = delivery_return_json.MembAddrNo.toString();

        for (let product in data.DShopInfo.prod_codes) {
            let market_code = data.DShopInfo.prod_codes[product];
            let market_item = data.DShopInfo.DataDataSet.data[product];
            let market_optn = data.DShopInfo.DataDataSet.data_opt;

            if (commonStore.uploadInfo.stopped) {
                productStore.addConsoleText(`(${shopName}) [${market_code}] 업로드 중단`);

                return false;
            }

            if (!market_item.cert) {
                if (!commonStore.uploadInfo.editable) {
                    productStore.addRegisteredFailed(Object.assign(market_item, { error: "스토어에 이미 등록된 상품입니다." }));
                    productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);

                    continue;
                }
            } else {
                if (commonStore.uploadInfo.editable) {
                    productStore.addRegisteredFailed(Object.assign(market_item, { error: "상품 신규등록을 먼저 진행해주세요." }));
                    productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);

                    continue;
                }
            }

            let image_list: any = [];
            //todo
            let name = byteSlice(market_item.name3, 100);

            for (let i in market_item) {
                if (i.match(/img[0-9]/) && !i.includes('blob') && i !== "img1") {
                    if (market_item[i] !== "") {
                        try {
                            let img = /^https?:/.test(market_item[i]) ? market_item[i] : "http:" + market_item[i];

                            image_list.push({
                                "Operation": 1,
                                "Url": img,
                                "BigImage": "false",
                                "ImageSourceCode": "0",
                                "ImageSourceOriginId": ""
                            })
                        } catch {
                            continue;
                        }
                    }
                }
            }

            if (!commonStore.uploadInfo.markets.find((v: any) => v.code === data.DShopInfo.site_code).video) {
                market_item.misc1 = "";
            }

            let desc = `
                ${market_item.content2}

				<div style="text-align: center;">
					${market_item.misc1 !== "" ?
                    `
							<video controls>
								<source src="${market_item.misc1}" type="video/mp4">
							</video>
							
							<br />
							<br />
						`
                    :
                    ``
                }

					${commonStore.user.userInfo.descriptionShowTitle === "Y" ?
                    market_item.name3
                    :
                    ``
                }
				</div>
								
				<br />
				<br />
				
				${transformContent(market_item.content1)}
                ${market_item.content3}
			`;

            let group: any = {};

            let words = await gql(QUERIES.SELECT_WORD_TABLES_BY_SOMEONE, {}, false);
            let words_list = words.data.selectWordTablesBySomeone;

            let words_restrict: any = {};

            for (let i in words_list) {
                if (words_list[i].findWord && !words_list[i].replaceWord) {
                    if (market_item.name3.includes(words_list[i].findWord)) {
                        words_restrict['상품명'] = words_list[i].findWord;
                    }
                }
            }

            for (let i in market_optn) {
                if (market_optn[i].code === market_code) {
                    for (let j in market_optn[i]) {
                        if (j.includes('misc') && market_optn[i][j] !== "") {
                            group[market_optn[i][j]] = j.replace("misc", "opt");
                        }

                        if (j.includes('opt') && j !== 'optimg' && market_optn[i][j] !== "") {
                            for (let k in words_list) {
                                if (words_list[k].findWord && !words_list[k].replaceWord) {
                                    if (market_optn[i][j].includes(words_list[k].findWord)) {
                                        words_restrict['옵션명'] = words_list[k].findWord;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (Object.keys(words_restrict).length > 0) {
                let message = "";

                for (let i in words_restrict) {
                    message += i + "에서 금지어(" + words_restrict[i] + ")가 발견되었습니다. ";
                }

                productStore.addRegisteredFailed(Object.assign(market_item, { error: message }));
                productStore.addConsoleText(`(${shopName}) [${market_code}] 금지어 발견됨`);

                await sendCallback(commonStore, data, market_code, parseInt(product), 2, message);

                continue;
            }

            let option_count = Object.keys(group).length;

            let option_data: any = {
                "OptTextList": [],
                "OptSel": {
                    "ObjOptInfo": {
                        "ObjOptNo1": 0,
                        "ObjOptNo2": 0,
                        "ObjOptNo3": 0,
                        "ObjOptNo4": 0,
                        "ObjOptNo5": 0,

                        "ObjOptClaseNm1": "",
                        "ObjOptClaseNm2": "",
                        "ObjOptClaseNm3": "",
                        "ObjOptClaseNm4": "",
                        "ObjOptClaseNm5": "",

                        "EngObjOptClaseNm1": "",
                        "EngObjOptClaseNm2": "",
                        "EngObjOptClaseNm3": "",
                        "EngObjOptClaseNm4": "",
                        "EngObjOptClaseNm5": "",

                        "ChnObjOptClaseNm1": "",
                        "ChnObjOptClaseNm2": "",
                        "ChnObjOptClaseNm3": "",
                        "ChnObjOptClaseNm4": "",
                        "ChnObjOptClaseNm5": "",

                        "JpnObjOptClaseNm1": "",
                        "JpnObjOptClaseNm2": "",
                        "JpnObjOptClaseNm3": "",
                        "JpnObjOptClaseNm4": "",
                        "JpnObjOptClaseNm5": ""
                    },

                    "StockList": [],
                    "Calculation": null,
                    "OptSelType": option_count,
                    "OptRepImageLevel": 0,
                    "OptDetailImageLevel": 0,
                    "StockMngIs": false,
                    "SortOrder": 1,
                },

                "OptAdd": null,
                // "OptQty":99999,
                "OptQtySiteStockNo": 0,
                "OptAddQty": 0,
                "OptSelUseIs": true,
                "OptTextUseIs": false,
                "OptAddUseIs": false,
                "IsUseCommonGoods": false,
                "CommonGoodsNo": null,
                "NotModified": false,
                "OptVerType": 2
            };

            for (let i in market_optn) {
                if (market_optn[i].code === market_code) {
                    if (commonStore.user.userInfo.autoPrice === 'Y') {
                        let iprice = market_item.sprice;
                        let oprice = market_item.sprice + market_optn[i].price;

                        let percent = Math.ceil((oprice / iprice - 1) * 100);

                        if (data.DShopInfo.site_code === 'A001') {
                            if (percent < -50 || percent > 50) {
                                continue;
                            }
                        }
                    }

                    option_data['OptSel']['ObjOptInfo']['ObjOptClaseNm1'] = market_optn[i].misc1;
                    option_data['OptSel']['ObjOptInfo']['ObjOptClaseNm2'] = market_optn[i].misc2;
                    option_data['OptSel']['ObjOptInfo']['ObjOptClaseNm3'] = market_optn[i].misc3;

                    if (option_count === 1) {
                        option_data['OptSel']['StockList'].push({
                            "SiteStockNo": 0,
                            "Text1": market_optn[i].misc1,
                            "Text1En": "",
                            "Text1Chn": "",
                            "Text1Jpn": "",
                            "Text2": market_optn[i].opt1,
                            "Text2En": "",
                            "Text2Chn": "",
                            "Text2Jpn": "",
                            "Text3": "",
                            "Text3En": "",
                            "Text3Chn": "",
                            "Text3Jpn": "",
                            "ObjOptClaseEssenNo1": 0,
                            "ObjOptClaseEssenNo2": 0,
                            "ObjOptClaseEssenNo3": 0,
                            "Qty": market_optn[i].stock,
                            "Price": market_optn[i].price,
                            "SoldOutIs": false,
                            "DisplayIs": true,
                            "RepImageUrl": "",
                            "DetailImageMasterSeq": 0,
                            "DetailImageUseIs": "N",
                            "ManageCode": "",
                            "SkuList": [],
                            "ChangeType": 1
                        });
                    } else {
                        option_data['OptSel']['StockList'].push({
                            "SiteStockNo": 0,
                            "Text1": market_optn[i].opt1,
                            "Text1En": "",
                            "Text1Chn": "",
                            "Text1Jpn": "",
                            "Text2": market_optn[i].opt2,
                            "Text2En": "",
                            "Text2Chn": "",
                            "Text2Jpn": "",
                            "Text3": market_optn[i].opt3,
                            "Text3En": "",
                            "Text3Chn": "",
                            "Text3Jpn": "",
                            "ObjOptClaseEssenNo1": 0,
                            "ObjOptClaseEssenNo2": 0,
                            "ObjOptClaseEssenNo3": 0,
                            "Qty": market_optn[i].stock,
                            "Price": market_optn[i].price,
                            "SoldOutIs": false,
                            "DisplayIs": true,
                            "RepImageUrl": "",
                            "DetailImageMasterSeq": 0,
                            "DetailImageUseIs": "N",
                            "ManageCode": "",
                            "SkuList": [],
                            "ChangeType": 1
                        });
                    }
                }
            }

            let date = new Date();

            let YY1 = date.getFullYear().toString()
            let MM1 = (date.getMonth() + 1).toString().padStart(2, '0')
            let DD1 = date.getDate().toString().padStart(2, '0')

            date.setDate(date.getDate() + 90);

            let YY2 = date.getFullYear().toString()
            let MM2 = (date.getMonth() + 1).toString().padStart(2, '0')
            let DD2 = date.getDate().toString().padStart(2, '0')

            let test_body = {
                "SYIStep1": {
                    "RegMarketType": data.DShopInfo.site_code === 'A001' ? '1' : '2',
                    "SiteSellerId": upload_type,
                    "SellType": "1",
                    "GoodsType": "1",

                    "GoodsName": {
                        "InputType": "1",
                        "GoodsName": name,
                    },

                    "SiteCategoryCode": [
                        {
                            "key": "1",
                            "value": market_item.cate_code
                        },
                        {
                            "key": "2",
                            "value": market_item.cate_code
                        }
                    ],
                },

                "SYIStep2": {
                    "SellingStatus": "0",
                    "GoodsStatus": "1",

                    "Price": {
                        "InputType": "1",
                        "GoodsPrice": market_item.sprice.toString(),
                        "GoodsPriceIAC": market_item.sprice.toString(),
                        "GoodsPriceGMKT": market_item.sprice.toString(),
                    },

                    "Stock": {
                        "InputType": "1",
                        "GoodsCount": market_item.stock.toString(),
                        "GoodsCountIAC": market_item.stock.toString(),
                        "GoodsCountGMKT": market_item.stock.toString()
                    },

                    "Options": {
                        "InputType": "1",
                        "OptVerType": "2",
                        "OptVerTypeIAC": "1",
                        "OptVerTypeGMKT": "1",
                        "JsonData": option_count > 0 ? JSON.stringify(option_data) : "",
                    },

                    "SellingPeriod": {
                        "InputType": "1",

                        "IAC": {
                            "StartDate": `${YY1}-${MM1}-${DD1} 00:00:00`,
                            "EndDate": `${YY2}-${MM2}-${DD2} 23:59:59`
                        },

                        "GMKT": {
                            "StartDate": `${YY1}-${MM1}-${DD1} 00:00:00`,
                            "EndDate": `${YY2}-${MM2}-${DD2} 23:59:59`
                        },
                    },

                    "GoodsImage": {
                        "PrimaryImage": {
                            "Operation": "1",
                            "Url": market_item.img1,
                            "BigImage": "false"
                        },

                        "ListImage": {
                            "Operation": "1",
                            "Url": market_item.img1,
                            "BigImage": "false"
                        },

                        "FixedImage": {
                            "Operation": "1",
                            "Url": market_item.img1,
                            "BigImage": "false"
                        },

                        "ExpandedImage": {
                            "Operation": "1",
                            "Url": market_item.img1,
                            "BigImage": "false"
                        },

                        "AdditionalImagesSite": "0",
                        "AdditionalImagesStr": JSON.stringify(image_list)
                    },

                    "DescriptionTypeSpecified": true,

                    "NewDescription": {
                        "InputType": "1",
                        "Text": desc
                    },

                    "ItemCode": market_code,

                    "DeliveryInfo": {
                        "CommonDeliveryUseYn": true,
                        "InvalidDeliveryInfo": false,
                        "CommonDeliveryWayOPTSEL": "1",
                        "GmktDeliveryWayOPTSEL": "0",
                        "IsCommonGmktUnifyDelivery": false,
                        "GmktDeliveryCOMP": "100000244",
                        "IacDeliveryCOMP": "10034",
                        "IsCommonVisitTake": false,
                        "IsCommonQuickService": false,
                        "IsCommonIACPost": false,
                        "CommonIACPostType": "0",
                        "CommonIACPostPaidPrice": "0",
                        "IsGmktVisitTake": false,
                        "IsGmktQuickService": false,
                        "IsGmktTodayDEPAR": false,
                        "IsGmktTodayDEPARAgree": false,
                        "IsGmktVisitReceiptTier": false,
                        "MountBranchGroupSeq": "0",
                        "CommonVisitTakeType": "0",
                        "CommonVisitTakePriceDcAmnt": "0",
                        "CommonVisitTakeFreeGiftName": null,
                        "CommonVisitTakeADDRNo": null,
                        "CommonQuickServiceCOMPName": null,
                        "CommonQuickServicePhone": null,
                        "CommonQuickServiceDeliveryEnableRegionNo": null,
                        "ShipmentPlaceNo": delivery_shipping_code.toString(),
                        "DeliveryFeeType": "2",
                        "EachDeliveryFeeType": market_item.deliv_fee > 0 ? "2" : "1",
                        "EachDeliveryFeeQTYEachGradeType": null,
                        "DeliveryFeeTemplateJSON": market_item.deliv_fee > 0 ?
                            JSON.stringify({
                                "DeliveryFeeType": 2,
                                "DeliveryFeeSubType": 0,
                                "FeeAmnt": market_item.deliv_fee,
                                "PrepayIs": true,
                                "CodIs": false,
                                "JejuAddDeliveryFee": commonStore.user.userInfo.additionalShippingFeeJeju,
                                "BackwoodsAddDeliveryFee": commonStore.user.userInfo.additionalShippingFeeJeju,
                                "ShipmentPlaceNo": delivery_shipping_code,
                                "DetailList": []
                            })
                            :
                            JSON.stringify({
                                "DeliveryFeeType": 1,
                                "DeliveryFeeSubType": 0,
                                "FeeAmnt": 0,
                                "PrepayIs": false,
                                "CodIs": false,
                                "JejuAddDeliveryFee": 0,
                                "BackwoodsAddDeliveryFee": 0,
                                "ShipmentPlaceNo": delivery_shipping_code,
                                "DetailList": []
                            }),
                        "EachDeliveryFeePayYn": "2",
                        "IsCommonGmktEachADDR": false,
                        "ReturnExchangeADDRNo": delivery_return_code,
                        "OldReturnExchangeADDR": null,
                        "OldReturnExchangeADDRTel": null,
                        "OldReturnExchangeSetupDeliveryCOMPName": null,
                        "OldReturnExchangeDeliveryFeeStr": null,
                        "ExchangeADDRNo": "",
                        "ReturnExchangeSetupDeliveryCOMP": null,
                        "ReturnExchangeSetupDeliveryCOMPName": null,
                        "ReturnExchangeDeliveryFee": "0",
                        "ReturnExchangeDeliveryFeeStr": commonStore.user.userInfo.refundShippingFee.toString(),
                        "IacTransPolicyNo": delivery_policy_code,
                        "GmktTransPolicyNo": delivery_policy_code,
                        "BackwoodsDeliveryYn": null,
                        "IsTplConvertible": false,
                        "IsGmktIACPost": false
                    },

                    "IsAdultProduct": "False",
                    "IsVATFree": "False",

                    "CertIAC": {
                        "ChildProductSafeCert": {
                            "ChangeType": "0",
                            "SafeCertDetailInfoList": null
                        },

                        "IntegrateSafeCert": {
                            "ItemNo": null,

                            "IntegrateSafeCertGroupList": [
                                {
                                    "SafeCertGroupNo": "1",
                                    "CertificationType": "1"
                                },
                                {
                                    "SafeCertGroupNo": "2",
                                    "CertificationType": "1"
                                },
                                {
                                    "SafeCertGroupNo": "3",
                                    "CertificationType": "1"
                                }
                            ]
                        }
                    },

                    "OfficialNotice": {
                        "NoticeItemGroupNo": "35",
                        "NoticeItemCodes": [
                            {
                                "NoticeItemCode": "35-1",
                                "NoticeItemValue": "상세설명참조"
                            },
                            {
                                "NoticeItemCode": "35-2",
                                "NoticeItemValue": "상세설명참조"
                            },
                            {
                                "NoticeItemCode": "35-3",
                                "NoticeItemValue": "상세설명참조"
                            },
                            {
                                "NoticeItemCode": "35-4",
                                "NoticeItemValue": "상세설명참조"
                            },
                            {
                                "NoticeItemCode": "35-5",
                                "NoticeItemValue": "상세설명참조"
                            },
                            {
                                "NoticeItemCode": "35-6",
                                "NoticeItemValue": "상세설명참조"
                            },
                            {
                                "NoticeItemCode": "999-5",
                                "NoticeItemValue": ""
                            }
                        ]
                    }
                },

                "SYIStep3": {
                    "SellerDiscount": {
                        "IsUsed": "2",
                        "IsUsedSpecified": true,
                    },

                    "IacDiscountAgreement": false,
                    "IacDiscountAgreementSpecified": true,
                    "GmkDiscountAgreement": false,
                    "GmkDiscountAgreementSpecified": true,
                }
            };

            if (commonStore.uploadInfo.stopped) {
                productStore.addConsoleText(`(${shopName}) [${market_code}] 업로드 중단`);

                return false;
            }

            if (!market_item.cert && commonStore.uploadInfo.editable) {
                let productId = productStore.itemInfo.items.find((v: any) => v.productCode === market_code).activeProductStore.find((v: any) => v.siteCode === data.DShopInfo.site_code).storeProductId;

                if (!productId) {
                    productStore.addRegisteredFailed(Object.assign(market_item, { error: '상품 ID를 찾을 수 없습니다.' }));
                    productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 실패`);

                    await sendCallback(commonStore, data, market_code, parseInt(product), 2, '상품 ID를 찾을 수 없습니다.');

                    continue;
                }

                let productData = {
                    paramsData: `{"Keyword": "${productId}","SiteId":"0","SellType":0,"CategoryCode":"","CustCategoryCode":0,"TransPolicyNo":0,"StatusCode":"","SearchDateType":0,"StartDate":"","EndDate":"","SellerId":"","StockQty":-1,"SellPeriod":0,"DeliveryFeeApplyType":0,"OptAddDeliveryType":0,"SellMinPrice":0,"SellMaxPrice":0,"OptSelUseIs":-1,"PremiumEnd":0,"PremiumPlusEnd":0,"FocusEnd":0,"FocusPlusEnd":0,"GoodsIds":"","SellMngCode":"","OrderByType":11,"NotiItemReg":-1,"EpinMatch":-1,"UserEvaluate":"","ShopCateReg":-1,"IsTPLUse":"","GoodsName":"","SdBrandId":0,"SdBrandName":""}`,
                    page: 1,
                    start: 0,
                    limit: 30
                };

                let productContent: any = [];

                for (let property in productData) {
                    let encodedKey = encodeURIComponent(property);
                    let encodedValue = encodeURIComponent(productData[property]);

                    productContent.push(encodedKey + "=" + encodedValue);
                }

                productContent = productContent.join("&");

                const productResp = await fetch("https://www.esmplus.com/Sell/Items/GetItemMngList", {
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "sec-ch-ua": "\"Chromium\";v=\"104\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"104\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-requested-with": "XMLHttpRequest"
                    },
                    "referrer": "https://www.esmplus.com/Sell/Items/ItemsMng?menuCode=TDM100",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": productContent,
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                });

                const productJson = await productResp.json();

                if (!productJson.data) {
                    productStore.addRegisteredFailed(Object.assign(market_item, { error: '상품 ID를 찾을 수 없습니다.' }));
                    productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 실패`);

                    await sendCallback(commonStore, data, market_code, parseInt(product), 2, '상품 ID를 찾을 수 없습니다.');

                    continue;
                }

                let product_body = {
                    "model": {
                        ...test_body,

                        "GoodsNo": productJson.data[0].GoodsNo,
                        "SiteGoodsNo": productId,
                        "CommandType": "2",
                    }
                }

                productStore.addRegisteredQueue(market_item);
                productStore.addConsoleText(`(${shopName}) 상품 수정 중...`);

                let test_resp = await fetch("https://www.esmplus.com/sell/goods/save", {
                    "headers": {
                        "content-type": "application/json",
                    },

                    "body": JSON.stringify(product_body),
                    "method": "POST",
                });

                let test_text = await test_resp.text();

                try {
                    let test_json = JSON.parse(test_text);
                    let errorMessage: any = null;

                    if (test_json.Unknown) {
                        errorMessage = test_json.Unknown.ErrorList[0].ErrorMessage;
                    } else {
                        if (test_json.ExceptionMessage) {
                            errorMessage = test_json.ExceptionMessage;
                        } else {
                            if (test_json["1"]) {
                                errorMessage = test_json['1'].ErrorList[0].ApiErrorMessage;
                            }

                            if (test_json["2"]) {
                                errorMessage = test_json['2'].ErrorList[0].ApiErrorMessage;
                            }
                        }
                    }

                    if (!errorMessage) {
                        errorMessage = '일시적인 오류로 서비스를 이용할 수 없습니다.';
                    }

                    productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 실패`);
                    productStore.addRegisteredFailed(Object.assign(market_item, { error: errorMessage }));

                    await sendCallback(commonStore, data, market_code, parseInt(product), 2, errorMessage);
                } catch (e) {
                    let product_html = new DOMParser().parseFromString(test_text, "text/html");
                    let product_data: any = product_html.querySelector('body > div.basic_contents > div.product_complete > div.product_regist > div > table > tbody > tr:nth-child(1) > td > span');
                    let product_code = product_data ? product_data.textContent.trim() : "";

                    if (!product_code) {
                        productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 실패`);
                        productStore.addRegisteredFailed(Object.assign(market_item, { error: '일시적인 오류로 서비스를 이용할 수 없습니다.' }));

                        await sendCallback(commonStore, data, market_code, parseInt(product), 2, '일시적인 오류로 서비스를 이용할 수 없습니다.');

                        return false;
                    }

                    productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 수정 성공`);
                    productStore.addRegisteredSuccess(Object.assign(market_item, { error: product_code }));

                    await sendCallback(commonStore, data, market_code, parseInt(product), 1, product_code);
                }
            } else {
                productStore.addRegisteredQueue(market_item);
                productStore.addConsoleText(`(${shopName}) 상품 등록 중...`);

                let test_resp = await fetch("https://www.esmplus.com/sell/goods/save", {
                    "headers": {
                        "content-type": "application/json",
                    },

                    "body": JSON.stringify(test_body),
                    "method": "POST",
                });

                let test_text = await test_resp.text();

                try {
                    let test_json = JSON.parse(test_text);
                    let errorMessage: any = null;

                    if (test_json.Unknown) {
                        errorMessage = test_json.Unknown.ErrorList[0].ErrorMessage;
                    } else {
                        if (test_json.ExceptionMessage) {
                            errorMessage = test_json.ExceptionMessage;
                        } else {
                            if (test_json["1"]) {
                                errorMessage = test_json['1'].ErrorList[0].ApiErrorMessage;
                            }

                            if (test_json["2"]) {
                                errorMessage = test_json['2'].ErrorList[0].ApiErrorMessage;
                            }
                        }
                    }

                    if (!errorMessage) {
                        errorMessage = '일시적인 오류로 서비스를 이용할 수 없습니다.';
                    }

                    productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);
                    productStore.addRegisteredFailed(Object.assign(market_item, { error: errorMessage }));

                    await sendCallback(commonStore, data, market_code, parseInt(product), 2, errorMessage);
                } catch (e) {
                    let product_html = new DOMParser().parseFromString(test_text, "text/html");
                    let product_data: any = product_html.querySelector('body > div.basic_contents > div.product_complete > div.product_regist > div > table > tbody > tr:nth-child(1) > td > span');
                    let product_code = product_data ? product_data.textContent.trim() : "";

                    if (!product_code) {
                        productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 실패`);
                        productStore.addRegisteredFailed(Object.assign(market_item, { error: '일시적인 오류로 서비스를 이용할 수 없습니다.' }));

                        await sendCallback(commonStore, data, market_code, parseInt(product), 2, '일시적인 오류로 서비스를 이용할 수 없습니다.');

                        return false;
                    }

                    productStore.addConsoleText(`(${shopName}) [${market_code}] 상품 등록 성공`);
                    productStore.addRegisteredSuccess(Object.assign(market_item, { error: product_code }));

                    await sendCallback(commonStore, data, market_code, parseInt(product), 1, product_code);
                }
            }
        }
    } catch (e: any) {
        productStore.addConsoleText(`(${shopName}) ESMPLUS 업로드 중단`);
        notificationByEveryTime(`(${shopName}) 업로드 도중 오류가 발생하였습니다. (${e.toString()})`);

        return false;
    }

    productStore.addConsoleText(`(${shopName}) ESMPLUS 업로드 완료`);

    return true;
}

async function newOrderESMPlus(commonStore: any, shopInfo: any) {
    const shopName = shopInfo.name;

    if (!shopInfo.connected || shopInfo.disabled) {
        return [];
    }

    try {
        let esmplusAuctionId;
        let esmplusGmarketId;

        let gg_text = null;

        try {
            let gg_resp = await fetch("https://www.esmplus.com/Member/AntiMoneyLaundering/GetAMLSellerList");

            gg_text = await gg_resp.json();
        } catch (e) {
            //
        }

        if (!gg_text) {
            notificationByEveryTime(`(${shopName}) ESMPLUS 로그인 후 재시도 바랍니다.`);

            return [];
        }

        let gg_json = JSON.parse(gg_text);

        switch (shopInfo.code) {
            case "A006": {
                let user_g_resp = await fetch("https://www.esmplus.com/Home/HomeSellerActivityBalanceGmktData?sellerid=", {
                    "body": null,
                    "method": "GET",
                });

                let user_g_json = await user_g_resp.json();

                esmplusGmarketId = commonStore.user.userInfo.esmplusGmarketId;

                if (esmplusGmarketId !== user_g_json.sellerid) {
                    let matched = false;

                    for (let i in gg_json) {
                        if (gg_json[i].SiteId === 2 && esmplusGmarketId === gg_json[i].SellerId) {
                            matched = true;

                            break;
                        }
                    }

                    if (!matched) {
                        notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

                        return [];
                    }
                }

                break;
            }

            case "A001": {
                let user_a_resp = await fetch("https://www.esmplus.com/Home/HomeSellerActivityBalanceIacData?sellerid=", {
                    "body": null,
                    "method": "GET",
                });

                let user_a_json = await user_a_resp.json();

                esmplusAuctionId = commonStore.user.userInfo.esmplusAuctionId;

                if (esmplusAuctionId !== user_a_json.sellerid) {
                    let matched = false;

                    for (let i in gg_json) {
                        if (gg_json[i].SiteId === 1 && esmplusAuctionId === gg_json[i].SellerId) {
                            matched = true;

                            break;
                        }
                    }

                    if (!matched) {
                        notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

                        return [];
                    }
                }

                break;
            }

            default: break;
        }

        const userResp = await fetch("https://www.esmplus.com/Escrow/Order/NewOrder");
        const userText = await userResp.text();
        const userMatched: any = userText.match(/var masterID = "([0-9]+)"/);

        let dateStart = getClockOffset(0, 0, -1, 0, 0, 0);
        let dateEnd = getClock();

        let orderData = {
            "page": "1",
            "limit": "50",
            "siteGbn": "0",
            "searchAccount": userMatched[1],
            "searchDateType": "ODD",
            "searchSDT": `${dateStart.YY}-${dateStart.MM}-${dateStart.DD}`,
            "searchEDT": `${dateEnd.YY}-${dateEnd.MM}-${dateEnd.DD}`,
            "searchKey": "ON",
            "searchKeyword": "",
            "searchDistrType": "AL",
            "searchAllYn": "N",
            "SortFeild": "PayDate",
            "SortType": "Desc",
            "start": "0",
            "searchTransPolicyType": ""
        };

        const orderResp = await fetch("https://www.esmplus.com/Escrow/Order/NewOrderSearch", {
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://www.esmplus.com/Escrow/Order/NewOrder?menuCode=TDM105",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": urlEncodedObject(orderData),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });

        let orderJson = await orderResp.json();

        switch (shopInfo.code) {
            case "A001": {
                orderJson.data = orderJson.data.filter((v: any) => v.SiteIDValue === "1");

                break;
            }

            case "A006": {
                orderJson.data = orderJson.data.filter((v: any) => v.SiteIDValue === "2");

                break;
            }

            default: {
                return [];
            }
        }

        console.log(shopName, orderJson.data);

        return orderJson.data.map((v: any) => {
            return {
                marketCode: shopInfo.code,
                marketName: shopInfo.name,
                taobaoOrderNo: null,
                productName: extractContent(v.GoodsName),
                productOptionContents: extractContent(v.SelOption).split(":").join(", "),
                sellerProductManagementCode: extractContent(v.SellerMngCode),
                orderNo: v.SiteOrderNo,
                orderQuantity: v.OrderQty,
                orderMemberName: v.BuyerName,
                orderMemberTelNo: v.BuyerCp,
                productPayAmt: parseInt(v.OrderAmnt.replaceAll(",", "")),
                deliveryFeeAmt: parseInt(v.DeliveryFee.replaceAll(",", "")),
                individualCustomUniqueCode: v.ReceiverEntryNo,
                receiverName: v.RcverName,
                receiverTelNo1: v.RcverInfoCp,
                receiverIntegratedAddress: extractContent(v.RcverInfoAd),
                receiverZipCode: v.ZipCode,
                productOrderMemo: extractContent(v.DeliveryMemo),
                OrderNo: v.OrderNo,
                SellerCustNo: v.SellerCustNo,
            }
        })
    } catch (e) {
        console.log(shopName, e);

        return [];
    }
}

async function productPreparedESMPlus(commonStore: any, shopInfo: any, props: any) {

    let productorderInfo: any = [];

    if (props !== "" && props.item.marketCode === 'A001') {
        productorderInfo.push(`${props.item.OrderNo},1,${props.item.SellerCustNo}`);
    } else if (props !== "" && props.item.marketCode === 'A006') {
        productorderInfo.push(`${props.item.OrderNo},2,${props.item.SellerCustNo}`);
    } else {
        return;
    }

    console.log("productshipNo", productorderInfo);


    const shopName = shopInfo.name;

    if (!shopInfo.connected || shopInfo.disabled) {
        return [];
    }

    try {
        let esmplusAuctionId;
        let esmplusGmarketId;

        let gg_text = null;

        try {
            let gg_resp = await fetch("https://www.esmplus.com/Member/AntiMoneyLaundering/GetAMLSellerList");

            gg_text = await gg_resp.json();
        } catch (e) {
            //
        }

        if (!gg_text) {
            notificationByEveryTime(`(${shopName}) ESMPLUS 로그인 후 재시도 바랍니다.`);

            return [];
        }

        let gg_json = JSON.parse(gg_text);

        switch (shopInfo.code) {
            case "A006": {
                let user_g_resp = await fetch("https://www.esmplus.com/Home/HomeSellerActivityBalanceGmktData?sellerid=", {
                    "body": null,
                    "method": "GET",
                });

                let user_g_json = await user_g_resp.json();

                esmplusGmarketId = commonStore.user.userInfo.esmplusGmarketId;

                if (esmplusGmarketId !== user_g_json.sellerid) {
                    let matched = false;

                    for (let i in gg_json) {
                        if (gg_json[i].SiteId === 2 && esmplusGmarketId === gg_json[i].SellerId) {
                            matched = true;

                            break;
                        }
                    }

                    if (!matched) {
                        notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

                        return [];
                    }
                }

                break;
            }

            case "A001": {
                let user_a_resp = await fetch("https://www.esmplus.com/Home/HomeSellerActivityBalanceIacData?sellerid=", {
                    "body": null,
                    "method": "GET",
                });

                let user_a_json = await user_a_resp.json();

                esmplusAuctionId = commonStore.user.userInfo.esmplusAuctionId;

                if (esmplusAuctionId !== user_a_json.sellerid) {
                    let matched = false;

                    for (let i in gg_json) {
                        if (gg_json[i].SiteId === 1 && esmplusAuctionId === gg_json[i].SellerId) {
                            matched = true;

                            break;
                        }
                    }

                    if (!matched) {
                        notificationByEveryTime(`(${shopName}) 스토어 연동정보가 일치하지 않습니다. 오픈마켓연동 상태를 확인해주세요.`);

                        return [];
                    }
                }

                break;
            }

            default: break;
        }

        const userResp = await fetch("https://www.esmplus.com/Escrow/Order/NewOrder");
        const userText = await userResp.text();
        const userMatched: any = userText.match(/var masterID = "([0-9]+)"/);

        productorderInfo.map(async (v: any) => {
            let orderData: any = {
                "mID": userMatched[1],//예시 542010
                "orderInfo": v//예시 4005936514,2,153802169
            };
            const orderResp = await fetch("https://www.esmplus.com/Escrow/Order/OrderCheck", {
                "headers": {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "ko,en-US;q=0.9,en;q=0.8,ko-KR;q=0.7",
                    "content-type": "application/x-www-form-urlencoded",
                    "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrer": "https://www.esmplus.com/Escrow/Order/NewOrder?menuCode=TDM105",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": urlEncodedObject(orderData),
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
            let orderJson = await orderResp.json();
            console.log(shopName, orderJson.data);
        })

    } catch (e) {
        console.log(shopName, e);
        return [];
    }
}

export {
    deleteESMPlus,
    uploadESMPlus,

    newOrderESMPlus,

    productPreparedESMPlus
}