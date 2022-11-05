import gql from "../../pages/Main/GraphQL/Requests";
import QUERIES from "../../pages/Main/GraphQL/Queries";
import MUTATIONS from "../../pages/Main/GraphQL/Mutations";

import { runInAction, makeAutoObservable } from "mobx";
import { getLocalStorage, setLocalStorage } from "../../pages/Tools/ChromeAsync";
import { coupangApiGateway } from "../../pages/Tools/Coupang";
import { streetApiGateway } from "../../pages/Tools/Street";
import { floatingToast, request } from "../../pages/Tools/Common";

export class common {
    loaded: boolean = false;

    chips: any = [];
    user: any = [];

    sideBar: any = false;

    popOver: any = false;
    popOverAnchor: any = null;

    streetMaxmumCount: any = 0;

    deliveryInfo: any = {
        coupangOutboundList: [],
        coupangInboundList: [],

        streetGlobalOutboundList: [],
        streetGlobalInboundList: [],

        streetNormalOutboundList: [],
        streetNormalInboundList: [],

        wemakepricePolicyList: [],

        lotteonPolicyList: [],

        tmonPolicyList: []
    };

    uploadDisabledInfo: any = {
        markets: [
            {
                code: "A077",
                disabled: true,
                progress: 0,
                upload: false,
            },

            {
                code: "B378",
                disabled: true,
                progress: 0,
                upload: false,
            },

            {
                code: "A112",
                disabled: true,
                progress: 0,
                upload: false,
            },

            {
                code: "A113",
                disabled: true,
                progress: 0,
                upload: false,
            },

            {
                code: "A006",
                disabled: true,
                progress: 0,
                upload: false,
            },

            {
                code: "A001",
                disabled: true,
                progress: 0,
                upload: false,
            },

            {
                code: "A027",
                disabled: true,
                progress: 0,
                upload: false,
            },

            {
                code: "B719",
                disabled: true,
                progress: 0,
                upload: false,
            },

            {
                code: "A524",
                disabled: true,
                progress: 0,
                upload: false,
            },

            {
                code: "A525",
                disabled: true,
                progress: 0,
                upload: false,
            },

            {
                code: "B956",
                disabled: true,
                progress: 0,
                upload: false,
            }
        ],
    }

    uploadInfo: any = {
        stopped: true,
        editable: false,
        uploadable: true,

        markets: [
            {
                code: "A077",
                name: "스마트스토어",
                connected: false,
                disabled: true,
                upload: false,
                video: false,
                progress: 0,
            },

            {
                code: "B378",
                name: "쿠팡",
                connected: false,
                disabled: true,
                upload: false,
                video: false,
                progress: 0,
            },

            {
                code: "A112",
                name: "11번가 글로벌",
                connected: false,
                disabled: true,
                upload: false,
                video: false,
                progress: 0,
            },

            {
                code: "A113",
                name: "11번가 일반",
                connected: false,
                disabled: true,
                upload: false,
                video: false,
                progress: 0,
            },

            {
                code: "A006",
                name: "지마켓 1.0",
                connected: false,
                disabled: true,
                upload: false,
                video: false,
                progress: 0,
            },

            {
                code: "A001",
                name: "옥션 1.0",
                connected: false,
                disabled: true,
                upload: false,
                video: false,
                progress: 0,
            },

            {
                code: "A027",
                name: "인터파크",
                connected: false,
                disabled: true,
                upload: false,
                video: false,
                progress: 0,
            },

            {
                code: "B719",
                name: "위메프 2.0",
                connected: false,
                disabled: true,
                upload: false,
                video: false,
                progress: 0,
                policyInfo: null
            },

            {
                code: "A524",
                name: "롯데온 글로벌",
                connected: false,
                disabled: true,
                upload: false,
                video: false,
                progress: 0,
                policyInfo: null
            },

            {
                code: "A525",
                name: "롯데온 일반",
                connected: false,
                disabled: true,
                upload: false,
                video: false,
                progress: 0,
                policyInfo: null
            },

            {
                code: "B956",
                name: "티몬",
                connected: false,
                disabled: true,
                upload: false,
                video: false,
                progress: 0,
                policyInfo: null
            }
        ],
    };

    constructor() {
        makeAutoObservable(this);

        this.loadStack();
        this.getUserInfo();

        console.log("%cSELL FOR YOU", "color: #1976d2; font-size: 50px; font-weight: bold; font-family: NNSQUAREROUNDR;");
        console.log("%c구  매  대  행  솔  루  션", "color: lightgray; font-size: 30px; font-weight: bold; font-family: NNSQUAREROUNDR;");
    }

    getMaximumLimitsStreet = () => {
        if (this.user.userInfo.streetApiKey) {
            this.streetMaxmumCount += 1;
        }

        if (this.user.userInfo.streetApiKey2) {
            this.streetMaxmumCount += 1;
        }

        if (this.user.userInfo.streetApiKey3) {
            this.streetMaxmumCount += 1;
        }

        if (this.user.userInfo.streetApiKey4) {
            this.streetMaxmumCount += 1;
        }

        if (this.user.userInfo.streetNormalApiKey) {
            this.streetMaxmumCount += 1;
        }

        if (this.user.userInfo.streetNormalApiKey2) {
            this.streetMaxmumCount += 1;
        }

        if (this.user.userInfo.streetNormalApiKey3) {
            this.streetMaxmumCount += 1;
        }

        if (this.user.userInfo.streetNormalApiKey4) {
            this.streetMaxmumCount += 1;
        }
    }

    getUserInfo = async () => {
        const response = await gql(QUERIES.SELECT_MY_INFO_BY_USER, {}, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        let fixImageTop = response.data.selectMyInfoByUser.userInfo.fixImageTop;
        let fixImageSubTop = response.data.selectMyInfoByUser.userInfo.fixImageSubTop;
        let fixImageBottom = response.data.selectMyInfoByUser.userInfo.fixImageBottom;
        let fixImageSubBottom = response.data.selectMyInfoByUser.userInfo.fixImageSubBottom;

        if (fixImageTop) {
            fixImageTop = /^https?/.test(fixImageTop) ? fixImageTop : `${process.env.SELLFORYOU_MINIO_HTTPS}/${fixImageTop}?${new Date().getTime()}`;
        }

        if (fixImageSubTop) {
            fixImageSubTop = /^https?/.test(fixImageSubTop) ? fixImageSubTop : `${process.env.SELLFORYOU_MINIO_HTTPS}/${fixImageSubTop}?${new Date().getTime()}`;
        }

        if (fixImageBottom) {
            fixImageBottom = /^https?/.test(fixImageBottom) ? fixImageBottom : `${process.env.SELLFORYOU_MINIO_HTTPS}/${fixImageBottom}?${new Date().getTime()}`;
        }

        if (fixImageSubBottom) {
            fixImageSubBottom = /^https?/.test(fixImageSubBottom) ? fixImageSubBottom : `${process.env.SELLFORYOU_MINIO_HTTPS}/${fixImageSubBottom}?${new Date().getTime()}`;
        }

        response.data.selectMyInfoByUser.userInfo = {
            ...response.data.selectMyInfoByUser.userInfo,

            fixImageTop,
            fixImageSubTop,
            fixImageBottom,
            fixImageSubBottom
        }

        runInAction(() => {
            this.user = response.data.selectMyInfoByUser;

            if (this.user.purchaseInfo.level < 2 && this.user.userInfo.productCollectCount > 100) {
                const accept = confirm("해당 계정의 이용기간이 만료되었습니다.\n결제를 진행하시겠습니까?");

                if (!accept) {
                    window.close();

                    return;
                }

                window.location.href = "https://www.sellforyou.co.kr/user/payment";
            }

            if (this.user.userInfo.naverStoreUrl) {
                let result = this.uploadInfo.markets.find((v: any) => v.code === 'A077');

                result.connected = true;

                if (this.user.userInfo.naverUseType === 'Y') {
                    result.disabled = false;
                    result.upload = true;
                    result.video = true;
                }
            }

            if (this.user.userInfo.coupangLoginId && this.user.userInfo.coupangVendorId && this.user.userInfo.coupangAccessKey && this.user.userInfo.coupangSecretKey) {
                let result = this.uploadInfo.markets.find((v: any) => v.code === 'B378');

                result.connected = true;

                if (this.user.userInfo.coupangUseType === 'Y') {
                    result.disabled = false;
                    result.upload = true;
                    result.video = true;
                }
            }

            this.getMaximumLimitsStreet();

            if (
                (this.user.userInfo.streetApiKey && this.user.userInfo.streetUseKeyType === '1') ||
                (this.user.userInfo.streetApiKey2 && this.user.userInfo.streetUseKeyType === '2') ||
                (this.user.userInfo.streetApiKey3 && this.user.userInfo.streetUseKeyType === '3') ||
                (this.user.userInfo.streetApiKey4 && this.user.userInfo.streetUseKeyType === '4')
            ) {
                let result = this.uploadInfo.markets.find((v: any) => v.code === 'A112');

                result.connected = true;

                if (this.user.userInfo.streetUseType === 'Y') {
                    result.disabled = false;
                    result.upload = true;
                    result.video = true;
                }
            }

            if (
                (this.user.userInfo.streetNormalApiKey && this.user.userInfo.streetNormalUseKeyType === '1') ||
                (this.user.userInfo.streetNormalApiKey2 && this.user.userInfo.streetNormalUseKeyType === '2') ||
                (this.user.userInfo.streetNormalApiKey3 && this.user.userInfo.streetNormalUseKeyType === '3') ||
                (this.user.userInfo.streetNormalApiKey4 && this.user.userInfo.streetNormalUseKeyType === '4')
            ) {
                let result = this.uploadInfo.markets.find((v: any) => v.code === 'A113');

                result.connected = true;

                if (this.user.userInfo.streetNormalUseType === 'Y') {
                    result.disabled = false;
                    result.upload = true;
                    result.video = true;
                }
            }

            if (this.user.userInfo.esmplusGmarketId) {
                let result = this.uploadInfo.markets.find((v: any) => v.code === 'A006');

                result.connected = true;

                if (this.user.userInfo.gmarketUseType === 'Y') {
                    result.disabled = false;
                    result.upload = true;
                    result.video = true;
                }
            }

            if (this.user.userInfo.esmplusAuctionId) {
                let result = this.uploadInfo.markets.find((v: any) => v.code === 'A001');

                result.connected = true;

                if (this.user.userInfo.auctionUseType === 'Y') {
                    result.disabled = false;
                    result.upload = true;
                    result.video = true;
                }
            }

            if (this.user.userInfo.interparkCertKey &&
                this.user.userInfo.interparkSecretKey &&
                this.user.userInfo.interparkEditCertKey &&
                this.user.userInfo.interparkEditSecretKey) {
                let result = this.uploadInfo.markets.find((v: any) => v.code === 'A027');

                result.connected = true;

                if (this.user.userInfo.interparkUseType === 'Y') {
                    result.disabled = false;
                    result.upload = true;
                    result.video = true;
                }
            }

            if (this.user.userInfo.wemakepriceId) {
                let result = this.uploadInfo.markets.find((v: any) => v.code === 'B719');

                result.connected = true;

                if (this.user.userInfo.wemakepriceUseType === 'Y') {
                    result.disabled = false;
                    result.upload = true;
                    result.video = true;
                }
            }

            if (this.user.userInfo.lotteonVendorId &&
                this.user.userInfo.lotteonApiKey) {
                let result: any = null;

                let result1 = this.uploadInfo.markets.find((v: any) => v.code === 'A524');
                let result2 = this.uploadInfo.markets.find((v: any) => v.code === 'A525');

                result1.connected = true;
                result2.connected = true;

                if (this.user.userInfo.lotteonSellerType === 'G') {
                    result = result1;
                } else {
                    result = result2;
                }

                if (result && this.user.userInfo.lotteonUseType === 'Y') {
                    result.connected = true;
                    result.disabled = false;
                    result.upload = true;
                    result.video = true;
                }
            }

            if (this.user.userInfo.tmonId) {
                let result = this.uploadInfo.markets.find((v: any) => v.code === 'B956');

                result.connected = true;

                if (this.user.userInfo.tmonUseType === 'Y') {
                    result.disabled = false;
                    result.upload = true;
                    result.video = true;
                }
            }

            this.loaded = true;

            this.getDeliveryInfo();
        });
    }

    setUserInfo = async (data: any) => {
        this.user.userInfo = data;
    }

    testUserInfo = async (data: any) => {
        const response = await gql(MUTATIONS.UPDATE_MY_DATA_BY_USER, data, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        floatingToast('기본설정이 저장되었습니다.', 'success');
    }

    initConnectedInfo = async (marketCode: string) => {
        this.uploadInfo.markets.find((v: any) => v.code === marketCode).connected = false;
    }

    verifyConnectedInfo = async (marketCode: string) => {
        switch (marketCode) {
            case "A077": {
                if (!this.user.userInfo.naverStoreUrl) {
                    alert("(스마트스토어) 주소가 입력되지 않았습니다.");

                    return 0;
                }

                if (!this.user.userInfo.naverStoreUrl.includes('https://smartstore.naver.com/')) {
                    alert("(스마트스토어) 주소가 올바르지 않습니다.\n아래 형식에 맞게 입력해주세요.\n(https://smartstore.naver.com/example)");

                    return 0;
                }

                let storeResp = await fetch("https://sell.smartstore.naver.com/api/clone-accounts?_action=init")
                let storeJson = await storeResp.json();
                let storeId = storeJson.simpleAccountInfo.creatableChannelInfoListMap.STOREFARM[0].url;

                if (this.user.userInfo.naverStoreUrl !== "https://smartstore.naver.com/" + storeId) {
                    alert("(스마트스토어) 입력된 정보가 로그인 정보와 일치하지 않습니다.");

                    return 0;
                }

                this.uploadInfo.markets.find((v: any) => v.code === 'A077').connected = true;
                this.testUserInfo({ naverStoreUrl: this.user.userInfo.naverStoreUrl });

                break;
            }

            case "B378": {
                if (!this.user.userInfo.coupangLoginId) {
                    alert("(쿠팡) 아이디가 입력되지 않았습니다.");

                    return 0;
                }

                if (!this.user.userInfo.coupangVendorId) {
                    alert("(쿠팡) 업체코드가 입력되지 않았습니다.");

                    return 0;
                }

                if (!this.user.userInfo.coupangAccessKey) {
                    alert("(쿠팡) 액세스키가 입력되지 않았습니다.");

                    return 0;
                }

                if (!this.user.userInfo.coupangSecretKey) {
                    alert("(쿠팡) 시크릿키가 입력되지 않았습니다.");

                    return 0;
                }

                const outbound_body = {
                    "accesskey": this.user.userInfo.coupangAccessKey,
                    "secretkey": this.user.userInfo.coupangSecretKey,

                    "path": "/v2/providers/marketplace_openapi/apis/api/v1/vendor/shipping-place/outbound",
                    "query": "pageSize=50&pageNum=1",
                    "method": "GET",

                    "data": {}
                }

                let outbound_json = await coupangApiGateway(outbound_body);

                if (!outbound_json.hasOwnProperty('content') && outbound_json.hasOwnProperty('code') && outbound_json.code === 'ERROR') {
                    if (outbound_json.message === 'Specified key is not registered.') {
                        alert("(쿠팡) 연동에 실패하였습니다.\n액세스키가 잘못되었습니다.");
                    } else if (outbound_json.message === 'Invalid signature.') {
                        alert("(쿠팡) 연동에 실패하였습니다.\n시크릿키가 잘못되었습니다.");
                    } else {
                        alert(outbound_json.message);
                    }

                    return;
                }

                this.uploadInfo.markets.find((v: any) => v.code === 'B378').connected = true;
                this.testUserInfo({
                    coupangLoginId: this.user.userInfo.coupangLoginId,
                    coupangVendorId: this.user.userInfo.coupangVendorId,
                    coupangAccessKey: this.user.userInfo.coupangAccessKey,
                    coupangSecretKey: this.user.userInfo.coupangSecretKey
                });

                break;
            }

            case "A112": {
                let apiKey = null;

                switch (this.user.userInfo.streetUseKeyType) {
                    case "1": {
                        apiKey = this.user.userInfo.streetApiKey;

                        break;
                    }

                    case "2": {
                        apiKey = this.user.userInfo.streetApiKey2;

                        break;
                    }

                    case "3": {
                        apiKey = this.user.userInfo.streetApiKey3;

                        break;
                    }

                    case "4": {
                        apiKey = this.user.userInfo.streetApiKey4;

                        break;
                    }
                }

                if (!apiKey) {
                    alert("(11번가 글로벌) 오픈 API 키가 입력되지 않았습니다.");

                    return 0;
                }

                let body = {
                    "apikey": apiKey,

                    "path": "areaservice/outboundarea",
                    "method": "GET",

                    "data": {}
                };

                const sgoList: any = await streetApiGateway(body);

                if (!sgoList["ns2:inOutAddresss"]) {
                    alert("(11번가 글로벌) 연동에 실패하였습니다.\n오픈 API 키를 확인해주세요.");

                    return;
                }

                this.uploadInfo.markets.find((v: any) => v.code === 'A112').connected = true;

                this.testUserInfo({
                    streetUseKeyType: this.user.userInfo.streetUseKeyType,
                    streetApiKey: this.user.userInfo.streetApiKey,
                    streetApiKey2: this.user.userInfo.streetApiKey2,
                    streetApiKey3: this.user.userInfo.streetApiKey3,
                    streetApiKey4: this.user.userInfo.streetApiKey4,
                });

                this.streetMaxmumCount += 1;

                break;
            }

            case "A113": {
                let apiKey = null;

                switch (this.user.userInfo.streetNormalUseKeyType) {
                    case "1": {
                        apiKey = this.user.userInfo.streetNormalApiKey;

                        break;
                    }

                    case "2": {
                        apiKey = this.user.userInfo.streetNormalApiKey2;

                        break;
                    }

                    case "3": {
                        apiKey = this.user.userInfo.streetNormalApiKey3;

                        break;
                    }

                    case "4": {
                        apiKey = this.user.userInfo.streetNormalApiKey4;

                        break;
                    }
                }

                if (!apiKey) {
                    alert("(11번가 일반) 오픈 API 키가 입력되지 않았습니다.");

                    return 0;
                }

                let body = {
                    "apikey": apiKey,

                    "path": "areaservice/outboundarea",
                    "method": "GET",

                    "data": {}
                };

                const sgoList: any = await streetApiGateway(body);

                if (!sgoList["ns2:inOutAddresss"]) {
                    alert("(11번가 일반) 연동에 실패하였습니다.\n오픈 API 키를 확인해주세요.");

                    return;
                }

                this.uploadInfo.markets.find((v: any) => v.code === 'A113').connected = true;

                this.testUserInfo({
                    streetNormalUseKeyType: this.user.userInfo.streetNormalUseKeyType,
                    streetNormalApiKey: this.user.userInfo.streetNormalApiKey,
                    streetNormalApiKey2: this.user.userInfo.streetNormalApiKey2,
                    streetNormalApiKey3: this.user.userInfo.streetNormalApiKey3,
                    streetNormalApiKey4: this.user.userInfo.streetNormalApiKey4,
                });

                this.streetMaxmumCount += 1;

                break;
            }

            case "A006": {
                if (!this.user.userInfo.esmplusGmarketId) {
                    alert("(지마켓) ID가 입력되지 않았습니다.");

                    return 0;
                }

                try {
                    let gg_resp = await fetch("https://www.esmplus.com/Member/AntiMoneyLaundering/GetAMLSellerList");
                    let gg_text = await gg_resp.json();
                    let gg_json = JSON.parse(gg_text);

                    let user_g_resp = await fetch("https://www.esmplus.com/Home/HomeSellerActivityBalanceGmktData?sellerid=");
                    let user_g_json = await user_g_resp.json();

                    let matched = false;

                    if (this.user.userInfo.esmplusGmarketId === user_g_json.sellerid) {
                        matched = true;
                    } else {
                        for (let i in gg_json) {
                            if (gg_json[i].SiteId === 2 && this.user.userInfo.esmplusGmarketId === gg_json[i].SellerId) {
                                matched = true;

                                break;
                            }
                        }
                    }

                    if (!matched) {
                        alert("(지마켓) 입력된 정보가 로그인 정보와 일치하지 않습니다.");

                        return;
                    }
                } catch (e) {
                    alert("(지마켓) ESMPLUS 로그인 후 재시도 바랍니다.");

                    return;
                }

                this.uploadInfo.markets.find((v: any) => v.code === 'A006').connected = true;
                this.testUserInfo({
                    esmplusGmarketId: this.user.userInfo.esmplusGmarketId,
                });

                break;
            }

            case "A001": {
                if (!this.user.userInfo.esmplusAuctionId) {
                    alert("(옥션) ID가 입력되지 않았습니다.");

                    return 0;
                }

                try {
                    let gg_resp = await fetch("https://www.esmplus.com/Member/AntiMoneyLaundering/GetAMLSellerList");
                    let gg_text = await gg_resp.json();
                    let gg_json = JSON.parse(gg_text);

                    let user_a_resp = await fetch("https://www.esmplus.com/Home/HomeSellerActivityBalanceIacData?sellerid=");
                    let user_a_json = await user_a_resp.json();

                    let matched = false;

                    if (this.user.userInfo.esmplusAuctionId === user_a_json.sellerid) {
                        matched = true;
                    } else {
                        for (let i in gg_json) {
                            if (gg_json[i].SiteId === 1 && this.user.userInfo.esmplusAuctionId === gg_json[i].SellerId) {
                                matched = true;

                                break;
                            }
                        }

                    }

                    if (!matched) {
                        alert("(옥션) 입력된 정보가 로그인 정보와 일치하지 않습니다.");

                        return;
                    }
                } catch (e) {
                    alert("(옥션) ESMPLUS 로그인 후 재시도 바랍니다.");

                    return;
                }

                this.uploadInfo.markets.find((v: any) => v.code === 'A001').connected = true;
                this.testUserInfo({
                    esmplusAuctionId: this.user.userInfo.esmplusAuctionId,
                });

                break;
            }

            case "A027": {
                if (!this.user.userInfo.interparkCertKey) {
                    alert("(인터파크) 상품등록 인증키가 입력되지 않았습니다.");

                    return;
                }

                if (!this.user.userInfo.interparkSecretKey) {
                    alert("(인터파크) 상품등록 비밀키가 입력되지 않았습니다.");

                    return;
                }

                if (!this.user.userInfo.interparkEditCertKey) {
                    alert("(인터파크) 상품수정 인증키가 입력되지 않았습니다.");

                    return;
                }

                if (!this.user.userInfo.interparkEditSecretKey) {
                    alert("(인터파크) 상품수정 비밀키가 입력되지 않았습니다.");

                    return;
                }

                this.uploadInfo.markets.find((v: any) => v.code === 'A027').connected = true;
                this.testUserInfo({
                    interparkCertKey: this.user.userInfo.interparkCertKey,
                    interparkSecretKey: this.user.userInfo.interparkSecretKey,
                    interparkEditCertKey: this.user.userInfo.interparkEditCertKey,
                    interparkEditSecretKey: this.user.userInfo.interparkEditSecretKey,
                });

                break;
            }

            case "B719": {
                if (!this.user.userInfo.wemakepriceId) {
                    alert("(위메프) ID가 입력되지 않았습니다.");

                    return;
                }

                try {
                    let login_resp = await fetch("https://wpartner.wemakeprice.com/getLoginUser.json?_=1651030385673");
                    let login_json = await login_resp.json();

                    if (login_json.userId !== this.user.userInfo.wemakepriceId) {
                        alert("(위메프) 입력된 정보가 로그인 정보와 일치하지 않습니다.");

                        return;
                    }
                } catch (e) {
                    alert("(위메프) 위메프 파트너 로그인 후 재시도 바랍니다.");
                }

                this.uploadInfo.markets.find((v: any) => v.code === 'B719').connected = true;
                this.testUserInfo({
                    wemakepriceId: this.user.userInfo.wemakepriceId,
                });

                break;
            }

            case "A524/A525": {
                if (!this.user.userInfo.lotteonVendorId) {
                    alert("(롯데온) 거래처번호가 입력되지 않았습니다.");

                    return;
                }

                if (!this.user.userInfo.lotteonApiKey) {
                    alert("(롯데온) 인증키가 입력되지 않았습니다.");

                    return;
                }

                this.uploadInfo.markets.find((v: any) => v.code === 'A524').connected = true;
                this.uploadInfo.markets.find((v: any) => v.code === 'A525').connected = true;
                this.testUserInfo({
                    lotteonVendorId: this.user.userInfo.lotteonVendorId,
                    lotteonApiKey: this.user.userInfo.lotteonApiKey,
                });

                break;
            }

            case "B956": {
                if (!this.user.userInfo.tmonId) {
                    alert("(티몬) 파트너번호가 입력되지 않았습니다.");

                    return
                }

                let loginResp: any = await request("https://spc-om.tmon.co.kr/api/partner/creatable-deal-count", { "method": "GET" });
                let loginJson: any = null;

                try {
                    loginJson = JSON.parse(loginResp);
                } catch (e) {
                    //
                }

                if (!loginJson) {
                    alert("(티몬) 파트너센터 로그인 후 재시도 바랍니다.");

                    return;
                }

                if (loginJson.data.partnerNo.toString() !== this.user.userInfo.tmonId) {
                    alert("(티몬) 입력된 정보가 로그인 정보와 일치하지 않습니다.");

                    return;
                }

                this.uploadInfo.markets.find((v: any) => v.code === 'B956').connected = true;
                this.testUserInfo({
                    tmonId: this.user.userInfo.tmonId
                });

                break;
            }

            default: {
                alert("해당 쇼핑몰은 현재 연동하실 수 없습니다.");

                return;
            }
        }
    }

    setDeliveryInfo = async (data: any) => {
        this.deliveryInfo = data;
    }

    getDeliveryInfo = async () => {
        if (this.uploadInfo.markets.find((v: any) => v.code === 'B378').connected) {
            let body = {
                "accesskey": this.user.userInfo.coupangAccessKey,
                "secretkey": this.user.userInfo.coupangSecretKey,

                "path": "/v2/providers/marketplace_openapi/apis/api/v1/vendor/shipping-place/outbound",
                "query": "pageSize=50&pageNum=1",
                "method": "GET",

                "data": {}
            }

            let coList = await coupangApiGateway(body);

            body.path = "/v2/providers/openapi/apis/api/v4/vendors/" + this.user.userInfo.coupangVendorId + "/returnShippingCenters";

            let ciList = await coupangApiGateway(body);

            runInAction(() => {
                this.deliveryInfo.coupangOutboundList = coList.content.filter((v: any) => v.usable);
                this.deliveryInfo.coupangInboundList = ciList.data.content.filter((v: any) => v.usable);
            });
        }

        if (this.uploadInfo.markets.find((v: any) => v.code === 'A112').connected) {
            let apiKey = null;

            switch (this.user.userInfo.streetUseKeyType) {
                case "1": {
                    apiKey = this.user.userInfo.streetApiKey;

                    break;
                }

                case "2": {
                    apiKey = this.user.userInfo.streetApiKey2;

                    break;
                }

                case "3": {
                    apiKey = this.user.userInfo.streetApiKey3;

                    break;
                }

                case "4": {
                    apiKey = this.user.userInfo.streetApiKey4;

                    break;
                }
            }

            let body = {
                "apikey": apiKey,

                "path": "areaservice/outboundarea",
                "method": "GET",

                "data": {}
            };

            const sgoList: any = await streetApiGateway(body);

            body.path = "areaservice/inboundarea";

            const sgiList: any = await streetApiGateway(body);

            runInAction(() => {
                this.deliveryInfo.streetGlobalOutboundList = sgoList["ns2:inOutAddresss"]["ns2:inOutAddress"];
                this.deliveryInfo.streetGlobalInboundList = sgiList["ns2:inOutAddresss"]["ns2:inOutAddress"];
            });
        }

        if (this.uploadInfo.markets.find((v: any) => v.code === 'A113').connected) {
            let apiKey = null;

            switch (this.user.userInfo.streetNormalUseKeyType) {
                case "1": {
                    apiKey = this.user.userInfo.streetNormalApiKey;

                    break;
                }

                case "2": {
                    apiKey = this.user.userInfo.streetNormalApiKey2;

                    break;
                }

                case "3": {
                    apiKey = this.user.userInfo.streetNormalApiKey3;

                    break;
                }

                case "4": {
                    apiKey = this.user.userInfo.streetNormalApiKey4;

                    break;
                }
            }

            let body = {
                "apikey": apiKey,

                "path": "areaservice/outboundarea",
                "method": "GET",

                "data": {}
            };

            const snoList: any = await streetApiGateway(body);

            body.path = "areaservice/inboundarea";

            const sniList: any = await streetApiGateway(body);

            runInAction(() => {
                this.deliveryInfo.streetNormalOutboundList = snoList["ns2:inOutAddresss"]["ns2:inOutAddress"];
                this.deliveryInfo.streetNormalInboundList = sniList["ns2:inOutAddresss"]["ns2:inOutAddress"];
            });
        }
    };

    loadStack = async () => {
        const stack: any = await getLocalStorage('stack');

        runInAction(() => {
            this.chips = stack ?? [];
        });
    }

    addToStack = (data: any) => {
        window.location.href = data.url;

        let found = false;

        this.chips.map((v: any) => {
            if (v.url === data.url) {
                found = true;
            }
        });

        if (found) {
            return;
        }

        this.chips.push(data);

        const stack = JSON.parse(JSON.stringify(this.chips));

        setLocalStorage({ stack: stack });
    }

    deleteFromStack = (index: number) => {
        this.chips = this.chips.filter((v: any, i: number) => {
            if (i === index) {
                return false;
            }

            return true;
        });

        const stack = JSON.parse(JSON.stringify(this.chips));

        setLocalStorage({ stack: stack });
    }

    setPolicyInfo = (marketCode: string, value: any) => {
        this.uploadInfo.markets.find((v: any) => v.code === marketCode).policyInfo = value;
    }

    setDisabledProgressValue = (marketCode: string, value: number) => {
        this.uploadDisabledInfo.markets.find((v: any) => v.code === marketCode).progress = value;
    }

    setProgressValue = (marketCode: string, value: number) => {
        this.uploadInfo.markets.find((v: any) => v.code === marketCode).progress = value;
    }

    setPopOverAnchor = (target: any) => {
        if (target) {
            this.popOver = true;
        } else {
            this.popOver = false;
        }

        this.popOverAnchor = target;
    }

    toggleSideBar = () => {
        this.sideBar = !this.sideBar;
    }

    toggleUploadDisabledInfoMarket = (marketCode: string, value: boolean) => {
        this.uploadDisabledInfo.markets.find((v: any) => v.code === marketCode).upload = value;
    }

    toggleUploadDisabledInfoMarketAll = (value: boolean) => {
        this.uploadDisabledInfo.markets.filter((v: any) => !v.disabled).map((v: any) => v.upload = value)
    }

    toggleUploadInfoMarket = (marketCode: string, value: boolean) => {
        this.uploadInfo.markets.find((v: any) => v.code === marketCode).upload = value;
    }

    toggleUploadInfoMarketAll = (value: boolean) => {
        this.uploadInfo.markets.filter((v: any) => !v.disabled).map((v: any) => v.upload = value)
    }

    toggleUploadInfoVideo = (marketCode: string, value: boolean) => {
        this.uploadInfo.markets.find((v: any) => v.code === marketCode).video = value;
    }

    toggleUploadInfoVideoAll = (value: boolean) => {
        this.uploadInfo.markets.filter((v: any) => !v.disabled).map((v: any) => v.video = value)
    }

    setEditedUpload = (value: boolean) => {
        this.uploadInfo.editable = value;
    }

    setUploadable = (value: boolean) => {
        this.uploadInfo.uploadable = value;
    }

    setStopped = (value: boolean) => {
        this.uploadInfo.stopped = value;
    }

    initUploadDisabledMarketProgress = () => {
        this.uploadDisabledInfo.markets.map((v: any) => v.progress = 0);
    }

    initUploadMarketProgress = () => {
        this.uploadInfo.markets.map((v: any) => v.progress = 0);
    }
}