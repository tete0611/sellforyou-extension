// 사용자, 공통 스토리지

import gql from '../../pages/Main/GraphQL/Requests';
import QUERIES from '../../pages/Main/GraphQL/Queries';
import MUTATIONS from '../../pages/Main/GraphQL/Mutations';
import { runInAction, makeAutoObservable } from 'mobx';
import { getLocalStorage, setLocalStorage } from '../../pages/Tools/ChromeAsync';
import { coupangApiGateway } from '../../pages/Tools/Coupang';
import { streetApiGateway } from '../../pages/Tools/Street';
import { floatingToast, request } from '../../pages/Tools/Common';
import { refreshToken } from '../../pages/Tools/Auth';
import { AppInfo, Nullable, UploadDisabledInfo, UploadInfo, User, UserInfo } from '../../type/type';
import { SHOPCODE } from '../../type/variable';

export class common {
	notionPage = null;

	banner01Image = null;
	banner01Url = null;

	innerSize = {
		width: window.innerWidth,
		height: window.innerHeight,
	};

	darkTheme: boolean = false;

	loaded: boolean = false;

	chips: any = [];
	user: User = {
		userInfo: null as any,
		productCount: 0,
		email: '',
		id: 0,
		refCode: null,
		refAvailable: false,
	};

	sideBar: any = false;

	popOver: any = false;
	popOverAnchor: any = null;

	streetMaxmumCount: any = 0;

	payHistoryInfo: any = {
		userId: null,
	};

	modalInfo: any = {
		payHistory: false,
	};

	deliveryPolicy: any = {
		coupangOutboundList: [],
		coupangInboundList: [],

		streetGlobalOutboundList: [],
		streetGlobalInboundList: [],

		streetNormalOutboundList: [],
		streetNormalInboundList: [],

		wemakepricePolicyList: [],

		lotteonPolicyList: [],

		tmonPolicyList: [],
	};

	uploadDisabledInfo: UploadDisabledInfo = {
		markets: [
			{
				code: 'A077',
				disabled: true,
				progress: 0,
				upload: false,
			},
			{
				code: 'B378',
				disabled: true,
				progress: 0,
				upload: false,
			},
			{
				code: 'A112',
				disabled: true,
				progress: 0,
				upload: false,
			},
			{
				code: 'A113',
				disabled: true,
				progress: 0,
				upload: false,
			},
			{
				code: 'A523',
				disabled: true,
				progress: 0,
				upload: false,
			},
			{
				code: 'A522',
				disabled: true,
				progress: 0,
				upload: false,
			},
			{
				code: 'A006',
				disabled: true,
				progress: 0,
				upload: false,
			},
			{
				code: 'A001',
				disabled: true,
				progress: 0,
				upload: false,
			},
			{
				code: 'A027',
				disabled: true,
				progress: 0,
				upload: false,
			},
			{
				code: 'B719',
				disabled: true,
				progress: 0,
				upload: false,
			},
			{
				code: 'A524',
				disabled: true,
				progress: 0,
				upload: false,
			},
			{
				code: 'A525',
				disabled: true,
				progress: 0,
				upload: false,
			},
			{
				code: 'B956',
				disabled: true,
				progress: 0,
				upload: false,
			},
		],
	};

	uploadInfo: UploadInfo = {
		stopped: true,
		editable: false,
		uploadable: true,
		markets: [
			{
				code: 'A077',
				name: '스마트스토어',
				connected: false,
				disabled: true,
				upload: false,
				video: false,
				progress: 0,
			},
			{
				code: 'B378',
				name: '쿠팡',
				connected: false,
				disabled: true,
				upload: false,
				video: false,
				progress: 0,
			},
			{
				code: 'A112',
				name: '11번가 글로벌',
				connected: false,
				disabled: true,
				upload: false,
				video: false,
				progress: 0,
			},
			{
				code: 'A113',
				name: '11번가 일반',
				connected: false,
				disabled: true,
				upload: false,
				video: false,
				progress: 0,
			},
			{
				code: 'A006',
				name: '지마켓 1.0',
				connected: false,
				disabled: true,
				upload: false,
				video: false,
				progress: 0,
			},
			{
				code: 'A523',
				name: '지마켓 2.0',
				connected: false,
				disabled: true,
				upload: false,
				video: false,
				progress: 0,
			},
			{
				code: 'A522',
				name: '옥션 2.0',
				connected: false,
				disabled: true,
				upload: false,
				video: false,
				progress: 0,
			},
			{
				code: 'A001',
				name: '옥션 1.0',
				connected: false,
				disabled: true,
				upload: false,
				video: false,
				progress: 0,
			},
			{
				code: 'A027',
				name: '인터파크',
				connected: false,
				disabled: true,
				upload: false,
				video: false,
				progress: 0,
			},
			{
				code: 'B719',
				name: '위메프 2.0',
				connected: false,
				disabled: true,
				upload: false,
				video: false,
				progress: 0,
				policyInfo: null,
			},
			{
				code: 'A524',
				name: '롯데온 글로벌',
				connected: false,
				disabled: true,
				upload: false,
				video: false,
				progress: 0,
				policyInfo: null,
			},
			{
				code: 'A525',
				name: '롯데온 일반',
				connected: false,
				disabled: true,
				upload: false,
				video: false,
				progress: 0,
				policyInfo: null,
			},
			{
				code: 'B956',
				name: '티몬',
				connected: false,
				disabled: true,
				upload: false,
				video: false,
				progress: 0,
				policyInfo: null,
			},
		],
	};

	constructor() {
		makeAutoObservable(this);

		// 다크모드, 페이지 상단 열린 탭 정보
		this.loadTheme();
		this.loadStack();

		// 사용자 정보
		this.getUserInfo();

		console.log('%cSELL FOR YOU', 'color: #1976d2; font-size: 50px; font-weight: bold; font-family: NNSQUAREROUNDR;');
		console.log(
			'%c구  매  대  행  솔  루  션',
			'color: lightgray; font-size: 30px; font-weight: bold; font-family: NNSQUAREROUNDR;',
		);
	}

	// 다크모드 스위치
	toggleTheme = async () => {
		this.darkTheme = !this.darkTheme;

		let appInfo = await getLocalStorage<AppInfo>('appInfo');

		appInfo = {
			...appInfo,

			darkTheme: this.darkTheme,
		};

		setLocalStorage({
			appInfo,
		});
	};

	// 11번가 복수아이디 개수 체크
	getMaximumLimitsStreet = () => {
		const { user } = this;
		const { userInfo } = user;
		const {
			streetApiKey,
			streetApiKey2,
			streetApiKey3,
			streetApiKey4,
			streetNormalApiKey,
			streetNormalApiKey2,
			streetNormalApiKey3,
			streetNormalApiKey4,
		} = userInfo;

		if (streetApiKey) this.streetMaxmumCount += 1;
		if (streetApiKey2) this.streetMaxmumCount += 1;
		if (streetApiKey3) this.streetMaxmumCount += 1;
		if (streetApiKey4) this.streetMaxmumCount += 1;
		if (streetNormalApiKey) this.streetMaxmumCount += 1;
		if (streetNormalApiKey2) this.streetMaxmumCount += 1;
		if (streetNormalApiKey3) this.streetMaxmumCount += 1;
		if (streetNormalApiKey4) this.streetMaxmumCount += 1;
	};

	// 사용자 정보 조회
	getUserInfo = async () => {
		if (
			window.location.href === chrome.runtime.getURL('/signin.html') ||
			window.location.href === chrome.runtime.getURL('/signup.html') ||
			window.location.href === chrome.runtime.getURL('/lostandfound.html')
		)
			return;

		const response = await gql(QUERIES.SELECT_MY_INFO_BY_USER, {}, false);
		if (response.errors) return alert(response.errors[0].message);

		// 상하단 이미지 사전수정
		let fixImageTop = response.data.selectMyInfoByUser.userInfo.fixImageTop;
		let fixImageSubTop = response.data.selectMyInfoByUser.userInfo.fixImageSubTop;
		let fixImageBottom = response.data.selectMyInfoByUser.userInfo.fixImageBottom;
		let fixImageSubBottom = response.data.selectMyInfoByUser.userInfo.fixImageSubBottom;

		if (fixImageTop)
			fixImageTop = /^https?/.test(fixImageTop)
				? fixImageTop
				: `${process.env.SELLFORYOU_MINIO_HTTPS}/${fixImageTop}?${new Date().getTime()}`;

		if (fixImageSubTop)
			fixImageSubTop = /^https?/.test(fixImageSubTop)
				? fixImageSubTop
				: `${process.env.SELLFORYOU_MINIO_HTTPS}/${fixImageSubTop}?${new Date().getTime()}`;

		if (fixImageBottom)
			fixImageBottom = /^https?/.test(fixImageBottom)
				? fixImageBottom
				: `${process.env.SELLFORYOU_MINIO_HTTPS}/${fixImageBottom}?${new Date().getTime()}`;

		if (fixImageSubBottom)
			fixImageSubBottom = /^https?/.test(fixImageSubBottom)
				? fixImageSubBottom
				: `${process.env.SELLFORYOU_MINIO_HTTPS}/${fixImageSubBottom}?${new Date().getTime()}`;

		response.data.selectMyInfoByUser.userInfo = {
			...response.data.selectMyInfoByUser.userInfo,

			fixImageTop,
			fixImageSubTop,
			fixImageBottom,
			fixImageSubBottom,
		};

		runInAction(() => {
			const {
				AUCTION_1,
				COUPANG,
				G_MARKET_1,
				AUCTION_2,
				G_MARKET_2,
				INTER_PARK,
				LOTTE_ON_GLOBAL,
				LOTTE_ON_NORMAL,
				SMART_STORE,
				STREET11_GLOBAL,
				STREET11_NORMAL,
				TMON,
				WE_MAKE_PRICE,
			} = SHOPCODE;
			this.user = response.data.selectMyInfoByUser;
			console.log('유저정보', this.user);
			if (!this.user.createdToken) {
				refreshToken().then(() => {
					alert('해당 계정의 이용정보가 변경되어 로그인 화면으로 이동합니다.');

					window.location.href = chrome.runtime.getURL('/signin.html');
				});

				return;
			}

			if (window.location.href !== chrome.runtime.getURL('/payments.html'))
				if (
					(this.user.purchaseInfo2.level < 2 && this.user.userInfo.productCollectCount > 100) ||
					this.user.purchaseInfo2.level === 0
				) {
					if (!confirm('해당 계정의 이용기간이 만료되었습니다.\n결제를 진행하시겠습니까?')) return this.signOut();

					window.location.href = '/payments.html';
				}

			// 오픈마켓 연동상태 설정
			if (this.user.userInfo.naverStoreUrl) {
				let result = this.uploadInfo.markets.find((v) => v.code === SMART_STORE);

				result!.connected = true;

				if (this.user.userInfo.naverUseType === 'Y') {
					result!.disabled = false;
					result!.upload = true;
					result!.video = true;
				}
			}

			if (
				this.user.userInfo.coupangLoginId &&
				this.user.userInfo.coupangVendorId &&
				this.user.userInfo.coupangAccessKey &&
				this.user.userInfo.coupangSecretKey
			) {
				let result = this.uploadInfo.markets.find((v) => v.code === COUPANG);

				result!.connected = true;

				if (this.user.userInfo.coupangUseType === 'Y') {
					result!.disabled = false;
					result!.upload = true;
					result!.video = true;
				}
			}

			this.getMaximumLimitsStreet();

			if (
				(this.user.userInfo.streetApiKey && this.user.userInfo.streetUseKeyType === '1') ||
				(this.user.userInfo.streetApiKey2 && this.user.userInfo.streetUseKeyType === '2') ||
				(this.user.userInfo.streetApiKey3 && this.user.userInfo.streetUseKeyType === '3') ||
				(this.user.userInfo.streetApiKey4 && this.user.userInfo.streetUseKeyType === '4')
			) {
				let result = this.uploadInfo.markets.find((v) => v.code === STREET11_GLOBAL);

				result!.connected = true;

				if (this.user.userInfo.streetUseType === 'Y') {
					result!.disabled = false;
					result!.upload = true;
					result!.video = true;
				}
			}

			if (
				(this.user.userInfo.streetNormalApiKey && this.user.userInfo.streetNormalUseKeyType === '1') ||
				(this.user.userInfo.streetNormalApiKey2 && this.user.userInfo.streetNormalUseKeyType === '2') ||
				(this.user.userInfo.streetNormalApiKey3 && this.user.userInfo.streetNormalUseKeyType === '3') ||
				(this.user.userInfo.streetNormalApiKey4 && this.user.userInfo.streetNormalUseKeyType === '4')
			) {
				let result = this.uploadInfo.markets.find((v) => v.code === STREET11_NORMAL);

				result!.connected = true;

				if (this.user.userInfo.streetNormalUseType === 'Y') {
					result!.disabled = false;
					result!.upload = true;
					result!.video = true;
				}
			}

			if (this.user.userInfo.esmplusGmarketId) {
				let result = this.uploadInfo.markets.find((v) => v.code === G_MARKET_1);

				result!.connected = true;

				if (this.user.userInfo.gmarketUseType === 'Y') {
					result!.disabled = false;
					result!.upload = false;
					result!.video = false;
				}
			}

			if (this.user.userInfo.esmplusGmarketId) {
				let result = this.uploadInfo.markets.find((v) => v.code === G_MARKET_2);

				result!.connected = true;

				if (this.user.userInfo.gmarketUseType === 'Y') {
					result!.disabled = false;
					result!.upload = true;
					result!.video = true;
				}
			}

			if (this.user.userInfo.esmplusAuctionId) {
				let result = this.uploadInfo.markets.find((v) => v.code === AUCTION_2);

				result!.connected = true;

				if (this.user.userInfo.auctionUseType === 'Y') {
					result!.disabled = false;
					result!.upload = true;
					result!.video = true;
				}
			}
			if (this.user.userInfo.esmplusAuctionId) {
				let result = this.uploadInfo.markets.find((v) => v.code === AUCTION_1);

				result!.connected = true;

				if (this.user.userInfo.auctionUseType === 'Y') {
					result!.disabled = false;
					result!.upload = false;
					result!.video = false;
				}
			}

			if (
				this.user.userInfo.interparkCertKey &&
				this.user.userInfo.interparkSecretKey &&
				this.user.userInfo.interparkEditCertKey &&
				this.user.userInfo.interparkEditSecretKey
			) {
				let result = this.uploadInfo.markets.find((v) => v.code === INTER_PARK);

				result!.connected = true;

				if (this.user.userInfo.interparkUseType === 'Y') {
					result!.disabled = false;
					result!.upload = true;
					result!.video = true;
				}
			}

			if (this.user.userInfo.wemakepriceId) {
				let result = this.uploadInfo.markets.find((v) => v.code === WE_MAKE_PRICE);

				result!.connected = true;

				if (this.user.userInfo.wemakepriceUseType === 'Y') {
					result!.disabled = false;
					result!.upload = true;
					result!.video = true;
				}
			}

			if (this.user.userInfo.lotteonVendorId && this.user.userInfo.lotteonApiKey) {
				let result: any = null;

				let result1 = this.uploadInfo.markets.find((v) => v.code === LOTTE_ON_GLOBAL);
				let result2 = this.uploadInfo.markets.find((v) => v.code === LOTTE_ON_NORMAL);

				result1!.connected = true;
				result2!.connected = true;

				if (this.user.userInfo.lotteonSellerType === 'G') result = result1;
				else result = result2;

				if (result && this.user.userInfo.lotteonUseType === 'Y') {
					result.connected = true;
					result.disabled = false;
					result.upload = true;
					result.video = true;
				}
			}

			if (this.user.userInfo.tmonId) {
				let result = this.uploadInfo.markets.find((v) => v.code === TMON);

				result!.connected = true;

				if (this.user.userInfo.tmonUseType === 'Y') {
					result!.disabled = false;
					result!.upload = true;
					result!.video = true;
				}
			}

			this.loaded = true;

			this.getDeliveryInfo();
		});
	};

	// 로그아웃
	signOut = async () => {
		let appInfo = await getLocalStorage<AppInfo>('appInfo');

		appInfo = {
			...appInfo,

			accessToken: '',
			refreshToken: '',
			loading: false,
			autoLogin: false,
		};

		await setLocalStorage({
			appInfo,
		});

		window.location.href = chrome.runtime.getURL('/signin.html');
	};

	// 사용자 정보 설정
	setUserInfo = (data: UserInfo) => (this.user.userInfo = data);

	// 사용자 정보 업데이트(DB적용)
	testUserInfo = async (data: any) => {
		const response = await gql(MUTATIONS.UPDATE_MY_DATA_BY_USER, data, false);

		if (response.errors) return alert(response.errors[0].message);

		floatingToast('기본설정이 저장되었습니다.', 'success');
	};

	// 연동 초기화
	initConnectedInfo = (marketCode: string) =>
		(this.uploadInfo.markets.find((v) => v.code === marketCode)!.connected = false);

	// 연동정보 검증
	verifyConnectedInfo = async (marketCode: string) => {
		const {
			SMART_STORE,
			AUCTION_1,
			COUPANG,
			G_MARKET_1,
			INTER_PARK,
			LOTTE_ON_GLOBAL,
			LOTTE_ON_NORMAL,
			STREET11_GLOBAL,
			STREET11_NORMAL,
			TMON,
			WE_MAKE_PRICE,
		} = SHOPCODE;
		switch (marketCode) {
			case SMART_STORE: {
				if (!this.user.userInfo.naverStoreUrl) return alert('(스마트스토어) 주소가 입력되지 않았습니다.');
				if (!this.user.userInfo.naverStoreUrl.includes('https://smartstore.naver.com/'))
					return alert(
						'(스마트스토어) 주소가 올바르지 않습니다.\n아래 형식에 맞게 입력해주세요.\n(https://smartstore.naver.com/example)',
					);

				let storeResp = await fetch('https://sell.smartstore.naver.com/api/clone-accounts?_action=init');
				let storeJson = await storeResp.json();
				let storeId = storeJson.simpleAccountInfo.creatableChannelInfoListMap.STOREFARM[0].url;

				if (this.user.userInfo.naverStoreUrl !== 'https://smartstore.naver.com/' + storeId)
					return alert('(스마트스토어) 입력된 정보가 로그인 정보와 일치하지 않습니다.');

				this.uploadInfo.markets.find((v) => v.code === SMART_STORE)!.connected = true;
				this.testUserInfo({
					naverStoreUrl: this.user.userInfo.naverStoreUrl,
				});

				break;
			}

			case COUPANG: {
				if (!this.user.userInfo.coupangLoginId) return alert('(쿠팡) 아이디가 입력되지 않았습니다.');
				if (!this.user.userInfo.coupangVendorId) return alert('(쿠팡) 업체코드가 입력되지 않았습니다.');
				if (!this.user.userInfo.coupangAccessKey) return alert('(쿠팡) 액세스키가 입력되지 않았습니다.');
				if (!this.user.userInfo.coupangSecretKey) return alert('(쿠팡) 시크릿키가 입력되지 않았습니다.');

				const outbound_body = {
					accesskey: this.user.userInfo.coupangAccessKey,
					secretkey: this.user.userInfo.coupangSecretKey,
					path: '/v2/providers/marketplace_openapi/apis/api/v1/vendor/shipping-place/outbound',
					query: 'pageSize=50&pageNum=1',
					method: 'GET',
					data: {},
				};

				let outbound_json = await coupangApiGateway(outbound_body);

				if (
					!outbound_json.hasOwnProperty('content') &&
					outbound_json.hasOwnProperty('code') &&
					outbound_json.code === 'ERROR'
				) {
					if (outbound_json.message === 'Specified key is not registered.')
						alert('(쿠팡) 연동에 실패하였습니다.\n액세스키가 잘못되었습니다.');
					else if (outbound_json.message === 'Invalid signature.')
						alert('(쿠팡) 연동에 실패하였습니다.\n시크릿키가 잘못되었습니다.');
					else alert(outbound_json.message);

					return;
				}

				this.uploadInfo.markets.find((v) => v.code === 'B378')!.connected = true;
				this.testUserInfo({
					coupangLoginId: this.user.userInfo.coupangLoginId,
					coupangVendorId: this.user.userInfo.coupangVendorId,
					coupangAccessKey: this.user.userInfo.coupangAccessKey,
					coupangSecretKey: this.user.userInfo.coupangSecretKey,
				});

				break;
			}

			case STREET11_GLOBAL: {
				let apiKey: Nullable<string> = null;

				switch (this.user.userInfo.streetUseKeyType) {
					case '1': {
						apiKey = this.user.userInfo.streetApiKey;
						break;
					}

					case '2': {
						apiKey = this.user.userInfo.streetApiKey2;
						break;
					}

					case '3': {
						apiKey = this.user.userInfo.streetApiKey3;
						break;
					}

					case '4': {
						apiKey = this.user.userInfo.streetApiKey4;
						break;
					}
				}

				if (!apiKey) return alert('(11번가 글로벌) 오픈 API 키가 입력되지 않았습니다.');

				let body = {
					apikey: apiKey,
					path: 'areaservice/outboundarea',
					method: 'GET',
					data: {},
				};

				const sgoList: any = await streetApiGateway(body);

				if (!sgoList['ns2:inOutAddresss'])
					return alert('(11번가 글로벌) 연동에 실패하였습니다.\n오픈 API 키를 확인해주세요.');

				this.uploadInfo.markets.find((v) => v.code === STREET11_GLOBAL)!.connected = true;
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

			case STREET11_NORMAL: {
				let apiKey: Nullable<string> = null;

				switch (this.user.userInfo.streetNormalUseKeyType) {
					case '1': {
						apiKey = this.user.userInfo.streetNormalApiKey;
						break;
					}

					case '2': {
						apiKey = this.user.userInfo.streetNormalApiKey2;
						break;
					}

					case '3': {
						apiKey = this.user.userInfo.streetNormalApiKey3;
						break;
					}

					case '4': {
						apiKey = this.user.userInfo.streetNormalApiKey4;
						break;
					}
				}

				if (!apiKey) return alert('(11번가 일반) 오픈 API 키가 입력되지 않았습니다.');

				let body = {
					apikey: apiKey,
					path: 'areaservice/outboundarea',
					method: 'GET',
					data: {},
				};

				const sgoList: any = await streetApiGateway(body);

				if (!sgoList['ns2:inOutAddresss'])
					return alert('(11번가 일반) 연동에 실패하였습니다.\n오픈 API 키를 확인해주세요.');

				this.uploadInfo.markets.find((v) => v.code === STREET11_NORMAL)!.connected = true;
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

			case G_MARKET_1: {
				if (!this.user.userInfo.esmplusGmarketId) return alert('(지마켓) ID가 입력되지 않았습니다.');

				try {
					let gg_resp = await fetch('https://www.esmplus.com/Member/AntiMoneyLaundering/GetAMLSellerList');
					let gg_text = await gg_resp.json();
					let gg_json = JSON.parse(gg_text);
					let user_g_resp = await fetch('https://www.esmplus.com/Home/HomeSellerActivityBalanceGmktData?sellerid=');
					let user_g_json = await user_g_resp.json();
					let matched = false;

					if (this.user.userInfo.esmplusGmarketId === user_g_json.sellerid) matched = true;
					else
						for (let i in gg_json) {
							if (gg_json[i].SiteId === 2 && this.user.userInfo.esmplusGmarketId === gg_json[i].SellerId) {
								matched = true;
								break;
							}
						}

					if (!matched) return alert('(지마켓) 입력된 정보가 로그인 정보와 일치하지 않습니다.');
				} catch (e) {
					return alert('(지마켓) ESMPLUS 로그인 후 재시도 바랍니다.');
				}

				this.uploadInfo.markets.find((v) => v.code === G_MARKET_1)!.connected = true;
				this.testUserInfo({
					esmplusGmarketId: this.user.userInfo.esmplusGmarketId,
				});

				break;
			}

			case AUCTION_1: {
				if (!this.user.userInfo.esmplusAuctionId) return alert('(옥션) ID가 입력되지 않았습니다.');

				try {
					let gg_resp = await fetch('https://www.esmplus.com/Member/AntiMoneyLaundering/GetAMLSellerList');
					let gg_text = await gg_resp.json();
					let gg_json = JSON.parse(gg_text);
					let user_a_resp = await fetch('https://www.esmplus.com/Home/HomeSellerActivityBalanceIacData?sellerid=');
					let user_a_json = await user_a_resp.json();
					let matched = false;

					if (this.user.userInfo.esmplusAuctionId === user_a_json.sellerid) matched = true;
					else
						for (let i in gg_json) {
							if (gg_json[i].SiteId === 1 && this.user.userInfo.esmplusAuctionId === gg_json[i].SellerId) {
								matched = true;
								break;
							}
						}

					if (!matched) return alert('(옥션) 입력된 정보가 로그인 정보와 일치하지 않습니다.');
				} catch (e) {
					return alert('(옥션) ESMPLUS 로그인 후 재시도 바랍니다.');
				}

				this.uploadInfo.markets.find((v) => v.code === AUCTION_1)!.connected = true;
				this.testUserInfo({
					esmplusAuctionId: this.user.userInfo.esmplusAuctionId,
				});

				break;
			}

			case INTER_PARK: {
				if (!this.user.userInfo.interparkCertKey) return alert('(인터파크) 상품등록 인증키가 입력되지 않았습니다.');
				if (!this.user.userInfo.interparkSecretKey) return alert('(인터파크) 상품등록 비밀키가 입력되지 않았습니다.');
				if (!this.user.userInfo.interparkEditCertKey) return alert('(인터파크) 상품수정 인증키가 입력되지 않았습니다.');
				if (!this.user.userInfo.interparkEditSecretKey)
					return alert('(인터파크) 상품수정 비밀키가 입력되지 않았습니다.');

				this.uploadInfo.markets.find((v) => v.code === INTER_PARK)!.connected = true;
				this.testUserInfo({
					interparkCertKey: this.user.userInfo.interparkCertKey,
					interparkSecretKey: this.user.userInfo.interparkSecretKey,
					interparkEditCertKey: this.user.userInfo.interparkEditCertKey,
					interparkEditSecretKey: this.user.userInfo.interparkEditSecretKey,
				});

				break;
			}

			case WE_MAKE_PRICE: {
				if (!this.user.userInfo.wemakepriceId) return alert('(위메프) ID가 입력되지 않았습니다.');

				try {
					let login_resp = await fetch('https://wpartner.wemakeprice.com/getLoginUser.json?_=1651030385673');
					let login_json = await login_resp.json();

					if (login_json.userId !== this.user.userInfo.wemakepriceId)
						return alert('(위메프) 입력된 정보가 로그인 정보와 일치하지 않습니다.');
				} catch (e) {
					alert('(위메프) 위메프 파트너 로그인 후 재시도 바랍니다.');
				}

				this.uploadInfo.markets.find((v) => v.code === WE_MAKE_PRICE)!.connected = true;
				this.testUserInfo({
					wemakepriceId: this.user.userInfo.wemakepriceId,
				});

				break;
			}

			case `${LOTTE_ON_GLOBAL}/${LOTTE_ON_NORMAL}`: {
				if (!this.user.userInfo.lotteonVendorId) return alert('(롯데온) 거래처번호가 입력되지 않았습니다.');
				if (!this.user.userInfo.lotteonApiKey) return alert('(롯데온) 인증키가 입력되지 않았습니다.');

				this.uploadInfo.markets.find((v) => v.code === LOTTE_ON_GLOBAL)!.connected = true;
				this.uploadInfo.markets.find((v) => v.code === LOTTE_ON_NORMAL)!.connected = true;
				this.testUserInfo({
					lotteonVendorId: this.user.userInfo.lotteonVendorId,
					lotteonApiKey: this.user.userInfo.lotteonApiKey,
				});

				break;
			}

			case TMON: {
				if (!this.user.userInfo.tmonId) return alert('(티몬) 파트너번호가 입력되지 않았습니다.');

				let loginResp: any = await request('https://spc-om.tmon.co.kr/api/partner/creatable-deal-count', {
					method: 'GET',
				});
				let loginJson: any = null;

				try {
					loginJson = JSON.parse(loginResp);
				} catch (e) {
					//
				}

				if (!loginJson) return alert('(티몬) 파트너센터 로그인 후 재시도 바랍니다.');
				if (loginJson.data.partnerNo.toString() !== this.user.userInfo.tmonId)
					return alert('(티몬) 입력된 정보가 로그인 정보와 일치하지 않습니다.');

				this.uploadInfo.markets.find((v) => v.code === TMON)!.connected = true;
				this.testUserInfo({
					tmonId: this.user.userInfo.tmonId,
				});

				break;
			}

			default: {
				return alert('해당 쇼핑몰은 현재 연동하실 수 없습니다.');
			}
		}
	};

	// 배송정책 설정
	setDeliveryPolicy = (data: any) => (this.deliveryPolicy = data);

	// 배송정보 조회
	getDeliveryInfo = async () => {
		try {
			if (this.uploadInfo.markets.find((v) => v.code === 'B378')!.connected) {
				let body = {
					accesskey: this.user.userInfo.coupangAccessKey,
					secretkey: this.user.userInfo.coupangSecretKey,
					path: '/v2/providers/marketplace_openapi/apis/api/v1/vendor/shipping-place/outbound',
					query: 'pageSize=50&pageNum=1',
					method: 'GET',
					data: {},
				};
				let coList = await coupangApiGateway(body);

				body.path =
					'/v2/providers/openapi/apis/api/v4/vendors/' + this.user.userInfo.coupangVendorId + '/returnShippingCenters';

				let ciList = await coupangApiGateway(body);

				runInAction(() => {
					this.deliveryPolicy.coupangOutboundList = coList.content.filter((v: any) => v.usable);
					this.deliveryPolicy.coupangInboundList = ciList.data.content.filter((v: any) => v.usable);
				});
			}
		} catch (e) {
			console.log('error', e);
		}
		try {
			if (this.uploadInfo.markets.find((v) => v.code === 'A112')!.connected) {
				let apiKey: Nullable<string> = null;

				switch (this.user.userInfo.streetUseKeyType) {
					case '1': {
						apiKey = this.user.userInfo.streetApiKey;
						break;
					}

					case '2': {
						apiKey = this.user.userInfo.streetApiKey2;
						break;
					}

					case '3': {
						apiKey = this.user.userInfo.streetApiKey3;
						break;
					}

					case '4': {
						apiKey = this.user.userInfo.streetApiKey4;
						break;
					}
				}

				let body = {
					apikey: apiKey,
					path: 'areaservice/outboundarea',
					method: 'GET',
					data: {},
				};

				const sgoList: any = await streetApiGateway(body);
				body.path = 'areaservice/inboundarea';
				const sgiList: any = await streetApiGateway(body);

				runInAction(() => {
					this.deliveryPolicy.streetGlobalOutboundList = sgoList['ns2:inOutAddresss']['ns2:inOutAddress'];
					this.deliveryPolicy.streetGlobalInboundList = sgiList['ns2:inOutAddresss']['ns2:inOutAddress'];
				});
			}
		} catch (e) {
			console.log('error', e);
		}

		try {
			if (this.uploadInfo.markets.find((v) => v.code === 'A113')!.connected) {
				let apiKey: Nullable<string> = null;

				switch (this.user.userInfo.streetNormalUseKeyType) {
					case '1': {
						apiKey = this.user.userInfo.streetNormalApiKey;
						break;
					}

					case '2': {
						apiKey = this.user.userInfo.streetNormalApiKey2;
						break;
					}

					case '3': {
						apiKey = this.user.userInfo.streetNormalApiKey3;
						break;
					}

					case '4': {
						apiKey = this.user.userInfo.streetNormalApiKey4;
						break;
					}
				}

				let body = {
					apikey: apiKey,
					path: 'areaservice/outboundarea',
					method: 'GET',
					data: {},
				};

				const snoList: any = await streetApiGateway(body);
				body.path = 'areaservice/inboundarea';
				const sniList: any = await streetApiGateway(body);

				runInAction(() => {
					this.deliveryPolicy.streetNormalOutboundList = snoList['ns2:inOutAddresss']['ns2:inOutAddress'];
					this.deliveryPolicy.streetNormalInboundList = sniList['ns2:inOutAddresss']['ns2:inOutAddress'];
				});
			}
		} catch (e) {
			console.log('error', e);
		}
	};

	// 다크모드 ON/OFF 상태
	loadTheme = async () => {
		let appInfo = (await getLocalStorage<AppInfo>('appInfo')) ?? null;

		if (!appInfo) return;

		runInAction(() => (this.darkTheme = appInfo.darkTheme));
	};

	// 상단 열려있는 탭 상태
	loadStack = async () => {
		const stack = (await getLocalStorage<any>('stack')) ?? [];

		runInAction(() => (this.chips = stack));
	};

	// 탭 추가
	addToStack = (data: any) => {
		window.location.href = data.url;

		let found = false;

		this.chips.map((v: any) => {
			if (v.url === data.url) found = true;
		});

		if (found) return;

		this.chips.push(data);

		const stack = JSON.parse(JSON.stringify(this.chips));

		setLocalStorage({
			stack: stack,
		});
	};

	// 탭 삭제
	deleteFromStack = (index: number) => {
		this.chips = this.chips.filter((_: any, i: number) => (i === index ? false : true));

		const stack = JSON.parse(JSON.stringify(this.chips));

		setLocalStorage({
			stack: stack,
		});
	};

	// 배송정책 설정
	setPolicyInfo = (marketCode: string, value: any) =>
		(this.uploadInfo.markets.find((v) => v.code === marketCode)!.policyInfo = value);

	// 등록해제 시 퍼센테이지
	setDisabledProgressValue = (marketCode: string, value: number) =>
		(this.uploadDisabledInfo.markets.find((v) => v.code === marketCode)!.progress = value);

	// 등록 시 퍼센테이지
	setProgressValue = (marketCode: string, value: number) =>
		(this.uploadInfo.markets.find((v) => v.code === marketCode)!.progress = value);

	// 팝업 기준위치
	setPopOverAnchor = (target: any) => {
		if (target) this.popOver = true;
		else this.popOver = false;

		this.popOverAnchor = target;
	};

	// 메뉴바 ON/OFF
	toggleSideBar = () => (this.sideBar = !this.sideBar);

	// 오픈마켓 등록해제 여부 설정
	toggleUploadDisabledInfoMarket = (marketCode: string, value: boolean) =>
		(this.uploadDisabledInfo.markets.find((v) => v.code === marketCode)!.upload = value);

	// 전체마켓 등록해제 여부 설정
	toggleUploadDisabledInfoMarketAll = (value: boolean) =>
		this.uploadDisabledInfo.markets.filter((v) => !v.disabled).map((v) => (v.upload = value));

	// 오픈마켓 등록 여부 설정
	toggleUploadInfoMarket = (marketCode: string, value: boolean) =>
		(this.uploadInfo.markets.find((v) => v.code === marketCode)!.upload = value);

	// 전체마켓 등록 여부 설정
	toggleUploadInfoMarketAll = (value: boolean) =>
		this.uploadInfo.markets
			.filter((v) => !v.disabled)
			.map((v) => (v.code === 'A006' || v.code === 'A001' ? (v.upload = false) : (v.upload = value)));

	// 오픈마켓 동영상 업로드 여부 설정
	toggleUploadInfoVideo = (marketCode: string, value: boolean) =>
		(this.uploadInfo.markets.find((v) => v.code === marketCode)!.video = value);

	// 전체마켓 동영상 업로드 여부 설정
	toggleUploadInfoVideoAll = (value: boolean) =>
		this.uploadInfo.markets
			.filter((v) => !v.disabled)
			.map((v) => (v.code === 'A006' || v.code === 'A001' ? (v.video = false) : (v.video = value)));

	// 수정모드 설정
	setEditedUpload = (value: boolean) => (this.uploadInfo.editable = value);
	// 업로드가능여부 설정
	setUploadable = (value: boolean) => (this.uploadInfo.uploadable = value);
	// 업로드 중단여부 설정
	setStopped = (value: boolean) => (this.uploadInfo.stopped = value);
	// 등록해제 퍼센테이지 초기설정
	initUploadDisabledMarketProgress = () => this.uploadDisabledInfo.markets.map((v) => (v.progress = 0));
	// 등록 퍼센테이지 초기설정
	initUploadMarketProgress = () => this.uploadInfo.markets.map((v) => (v.progress = 0));
	// 결제내역 모달 ON/OFF
	togglePayHistoryModal = (userId: any, value: boolean) => {
		this.payHistoryInfo.userId = userId;
		this.modalInfo.payHistory = value;
	};

	// 윈도우 창 크기
	setInnerSize = (data: any) => (this.innerSize = data);
	// 노션 페이지 설정
	setNotionPage = (data: any) => (this.notionPage = data);
	setBanner01Image = (data: any) => (this.banner01Image = data);
	setBanner01Url = (data: any) => (this.banner01Url = data);

	/** 내 개인분류 초기화 */
	resetKeywardList = async (data: { userId: number }) => {
		if (!data.userId) {
			alert('유저ID가 조회되지 않았습니다\n관리자문의 요망.');
			return false;
		}
		const response = await gql(MUTATIONS.RESET_KEYWARD_LIST, data, false);
		if (!response.data.resetKeywardList) {
			alert('개인분류삭제 에러\n관리자문의 요망');
			return false;
		}

		floatingToast('삭제 되었습니다.', 'success');

		runInAction(() => (this.user.keywardMemo = null));
		return true;
	};
}
