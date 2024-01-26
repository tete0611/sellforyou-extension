// 키워드 분석 스토리지

import CryptoJS from 'crypto-js';
import QUERIES from '../../pages/Main/GraphQL/Queries';
import gql from '../../pages/Main/GraphQL/Requests';
import papagoTranslation from '../../pages/Tools/Translation';

import { runInAction, makeAutoObservable } from 'mobx';
import { downloadExcel, sleep } from '../../../common/function';

const GBK = require('gbk-encode');

export class analysis {
	searchInfo: any = {
		expose: 100,
		keyword: null,
		results: [],
		saveAuto: 'N',
		progress: 0,
	};

	constructor() {
		makeAutoObservable(this);
	}

	// 검색정보
	setSearchInfo = (value: number) => {
		this.searchInfo = value;
	};

	// 네이버 기반 키워드 분석
	searchKeywordByNaver = async () => {
		this.setSearchInfo({
			...this.searchInfo,

			results: [],
			progress: 0,
		});

		if (!this.searchInfo.keyword) {
			alert('키워드를 입력해주세요.');

			return;
		}

		let keyword_list = this.searchInfo.keyword.split('\n');
		let keyword_string = '';

		if (keyword_list.length > 5) {
			alert('키워드는 최대 5개까지만 입력 가능합니다.');

			return 0;
		}

		for (let i in keyword_list) {
			let word = keyword_list[i].replaceAll(' ', '');

			if (word !== '') {
				keyword_string += word;

				if (parseInt(i) < keyword_list.length - 1) {
					keyword_string += ',';
				}
			}
		}

		let refer_body = {
			method: 'GET',
			path: 'https://api.naver.com',
			query: '/keywordstool',
			params: `?hintKeywords=${encodeURI(keyword_string)}&showDetail=1`,
			data: {},
		};

		let now = new Date().getTime();

		const accesskey = '01000000002bb6eefe11996a564314121b57c8d70cf7435ccf640f458eb5094e4eba6a0696';
		const secretkey = 'AQAAAAArtu7+EZlqVkMUEhtXyNcMIRQiJOWkR0m3rzMeoViXyw==';
		const base_str = `${now}.${refer_body.method}.${refer_body.query}`;
		const signature = CryptoJS.HmacSHA256(base_str, secretkey).toString(CryptoJS.enc.Base64);

		let refer_headers: any = {
			'X-Timestamp': now,
			'X-API-KEY': accesskey,
			'X-Customer': '2356466',
			'X-Signature': signature,
		};

		// 네이버 광고 API
		let refer_resp = await fetch(`${refer_body.path}${refer_body.query}${refer_body.params}`, {
			headers: refer_headers,
		});

		let refer_json = await refer_resp.json();

		if (refer_json.title === 'Invalid Parameter') {
			alert('키워드를 입력해주세요.');

			return;
		}

		let sliced = refer_json.keywordList.slice(0, this.searchInfo.expose);

		let result_count = 0;
		let result_category_list: any = [];

		let translate_string = '';
		let translate_string_temp = '';

		for (let i in sliced) {
			let keyword_filtered = sliced[i].relKeyword.replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi, '');

			if (translate_string.length + keyword_filtered.length + 1 > 4000) {
				translate_string_temp += keyword_filtered;
				translate_string_temp += '\n';
			} else {
				translate_string += keyword_filtered;
				translate_string += '\n';
			}
		}

		let translate_list = await papagoTranslation(null, 'ko', 'zh-CN', translate_string);

		if (translate_string_temp.length > 0) {
			let translate_list_temp = await papagoTranslation(null, 'ko', 'zh-CN', translate_string_temp);

			translate_list = translate_list.concat(translate_list_temp);
		}

		// 네이버 쇼핑 검색결과 크롤링
		let result_array = await Promise.all(
			sliced.map(async (keyword: any, index: number) => {
				// 반드시 현재값 고정 (지금보다 빠르면 IP 차단, 느리면 성능 이슈가 있음)
				await sleep((1000 * index) / 3);

				result_count += 1;

				let search_link = `https://search.shopping.naver.com/search/all?query=${encodeURI(keyword.relKeyword)}`;
				let search_resp = await fetch(search_link);

				let search_text = await search_resp.text();
				let search_html: any = new DOMParser().parseFromString(search_text, 'text/html');
				let search_json = JSON.parse(search_html.querySelector('#__NEXT_DATA__').innerText);

				let summary_search = keyword.monthlyPcQcCnt + keyword.monthlyMobileQcCnt;
				let summary_product = 0;

				let category_id = '';

				if (search_json.props.pageProps.cmpResult && search_json.props.pageProps.cmpResult.catId) {
					category_id = search_json.props.pageProps.cmpResult.catId;

					result_category_list.push(category_id);
				}

				if (search_json.props.pageProps.initialState.subFilters.length > 0) {
					summary_product = search_json.props.pageProps.initialState.subFilters[0].filterValues[0].productCount;
				}

				let competition: any = Math.round((summary_product / summary_search) * 100) / 100;

				let percentage = Math.round((result_count * 100) / sliced.length);

				competition = isNaN(competition) ? '산정 불가' : competition;

				runInAction(() => {
					this.setSearchInfo({
						...this.searchInfo,

						progress: percentage,
					});
				});

				return {
					순번: index + 1,
					연관키워드: keyword.relKeyword,
					'월간검색수(PC)': keyword.monthlyPcQcCnt,
					'월간검색수(모바일)': keyword.monthlyMobileQcCnt,
					'월간검색수(합계)': summary_search,
					검색상품수: summary_product,
					경쟁률: competition,
					카테고리: category_id,
					'월평균클릭수(PC)': keyword.monthlyAvePcClkCnt,
					'월평균클릭수(모바일)': keyword.monthlyAveMobileClkCnt,
					'월평균클릭률(PC)': keyword.monthlyAvePcCtr,
					'월평균클릭률(모바일)': keyword.monthlyAveMobileCtr,
					광고경쟁정도: keyword.compIdx,
					월평균노출광고수: keyword.plAvgDepth,

					URL_TAOBAO: `https://s.taobao.com/search?q=${encodeURI(translate_list[index])}`,
					URL_TMALL: `https://list.tmall.com/search_product.htm?q=${encodeURI(translate_list[index])}`,
					URL_ALIEXPRESS: `https://ko.aliexpress.com/wholesale?SearchText=${encodeURI(keyword.relKeyword)}`,
					URL_1688: `https://s.1688.com/selloffer/offer_search.htm?keywords=${GBK.encode(translate_list[index])}`,
					URL_VVIC: `https://www.vvic.com/gz/search/index.html?q=${encodeURI(translate_list[index])}`,
				};
			}),
		);

		let result_sorted = result_array.sort(function (a, b) {
			if (a['순번'] < b['순번']) {
				return -1;
			}

			if (a['순번'] > b['순번']) {
				return 1;
			}

			return 0;
		});

		const category_set = new Set(result_category_list);
		const category_unique_list = [...category_set];

		let category_info = await gql(QUERIES.SEARCH_MANY_CATEGORY_INFO_A077_BY_SOMEONE, { code: category_unique_list });

		if (category_info.errors) {
			alert(category_info.erros[0].message);

			return;
		}

		for (let i in result_sorted) {
			result_sorted[i]['카테고리'] =
				category_info.data.searchManyCategoryInfoA077BySomeone.find((v: any) => v.code === result_sorted[i]['카테고리'])
					?.name ?? '-';
		}

		runInAction(() => {
			this.searchInfo.results = result_sorted;

			this.setSearchInfo({
				...this.searchInfo,

				progress: 0,
			});

			if (this.searchInfo.saveAuto === 'Y') {
				this.download();
			}
		});
	};

	// 엑셀 다운로드
	download = () => {
		if (this.searchInfo.results.length <= 0) {
			alert('분석 결과를 찾을 수 없습니다.');

			return 0;
		}

		downloadExcel(this.searchInfo.results, `키워드분석`, `키워드분석`, false, 'xlsx');
	};
}
