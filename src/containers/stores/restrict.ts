// 금지어, 치환어 스토리지
import gql from '../../pages/Main/GraphQL/Requests';
import QUERIES from '../../pages/Main/GraphQL/Queries';
import MUTATIONS from '../../pages/Main/GraphQL/Mutations';
import { makeAutoObservable } from 'mobx';
import { RestrictWordInfo } from '../../type/type';

export class restrict {
	restrictWordInfo: RestrictWordInfo = {
		banChecked: [],
		banList: [],
		banExcelInput: null,
		banWordInput: '',
		findWordInput: '',
		replaceChecked: [],
		replaceList: [],
		replaceExcelInput: null,
		replaceWordInput: '',
		loading: false,
	};

	constructor() {
		makeAutoObservable(this);
	}

	/** 엑셀 업로드 뮤테이션 */
	uploadExcel = async (data: any) => {
		let formData = new FormData();
		let operations = {
			variables: {
				data: null,
				isReplace: data.isReplace,
			},
			query:
				'mutation ($data: Upload!, $isReplace: Boolean!) {\n  addWordByExcelByUser(data: $data, isReplace: $isReplace)\n}\n',
		};
		let map = { '1': ['variables.data'] };

		formData.append('operations', JSON.stringify(operations));
		formData.append('map', JSON.stringify(map));
		formData.append('1', data.data, `${data.data.name.split('.')[0]}.${data.data.name.split('.')[1]}`);

		const response = await gql(null, formData, true);

		if (response.errors) {
			alert(response.errors[0].message);
			return;
		}

		alert('등록되었습니다.');
		return true;
	};

	/** 금지어/치환어 조회 */
	getRestrictWords = async () => {
		const response = await gql(QUERIES.SELECT_WORD_TABLES_BY_SOMEONE, {}, false);

		if (response.errors) return;

		this.restrictWordInfo.banList = response.data.selectWordTablesBySomeone.filter(
			(v: any) => v.findWord && !v.replaceWord,
		);
		this.restrictWordInfo.banList.map(() => this.restrictWordInfo.banChecked.push(false));
		this.restrictWordInfo.replaceList = response.data.selectWordTablesBySomeone.filter(
			(v: any) => v.findWord && v.replaceWord,
		);
		this.restrictWordInfo.replaceList.map(() => this.restrictWordInfo.replaceChecked.push(false));

		this.restrictWordInfo.banChecked.fill(false);
		this.restrictWordInfo.replaceChecked.fill(false);

		this.restrictWordInfo.loading = true;
	};

	/** 금지어/치환어 설정정보 */
	setRestrictWordInfo = (data: RestrictWordInfo) => (this.restrictWordInfo = data);

	/** 금지어/치환어 추가
	 * @description replaceWord = null 입력시 금지어 그렇지않으면 치환어
	 * */
	addWordTable = async ({
		findWord,
		replaceWord = null,
	}: {
		findWord: string;
		replaceWord: string | null;
	}): Promise<boolean> => {
		const response = await gql(MUTATIONS.ADD_WORD_BY_USER, {
			findWord: findWord,
			replaceWord: replaceWord !== null ? (replaceWord !== '' ? replaceWord : ' ') : null,
		});

		if (response.errors) {
			alert(response.errors[0].message);
			return false;
		}
		alert('추가되었습니다.');
		return true;
	};

	/** 금지어,치환어 삭제 */
	deleteWordTable = async ({ type }: { type: 'banWord' | 'replaceWord' }): Promise<boolean | void> => {
		let wordIds: number[] = [];
		const { restrictWordInfo } = this;
		const { banChecked, banList, replaceList, replaceChecked } = restrictWordInfo;

		if (type === 'banWord') {
			if (banChecked.every((v) => !v)) return alert('선택된 금지어가 없습니다.');
			banList.map((v, i) => banChecked[i] && wordIds.push(v.id));
		} else {
			if (replaceChecked.every((v) => !v)) return alert('선택된 치환어가 없습니다.');
			replaceList.map((v, i) => replaceChecked[i] && wordIds.push(v.id));
		}

		if (!confirm(`선택한 ${wordIds.length}개의 ${type === 'banWord' ? `금지어` : `치환어`}를 삭제하시겠습니까?`))
			return;
		const response = await gql(MUTATIONS.DELETE_WORD_BY_USER, { wordId: wordIds }, false);

		if (response.errors) {
			alert(response.errors[0].message);
			return false;
		}

		alert('삭제되었습니다.');
		if (type === 'banWord') banChecked.fill(false);
		else replaceChecked.fill(false);
		return true;
	};

	/** 금지어 단일선택 */
	toggleBanChecked = (value: boolean, index: number) => (this.restrictWordInfo.banChecked[index] = value);

	/** 금지어 전체선택 */
	toggleBanCheckedAll = (value: boolean) =>
		(this.restrictWordInfo.banChecked = this.restrictWordInfo.banChecked.map(() => value));

	/** 치환어 단일선택 */
	toggleReplaceChecked = (value: boolean, index: number) => (this.restrictWordInfo.replaceChecked[index] = value);

	/** 치환어 전체선택 */
	toggleReplaceCheckedAll = (value: boolean) =>
		(this.restrictWordInfo.replaceChecked = this.restrictWordInfo.replaceChecked.map(() => value));
}
