import gql from "../../pages/Main/GraphQL/Requests";
import QUERIES from "../../pages/Main/GraphQL/Queries";
import MUTATIONS from "../../pages/Main/GraphQL/Mutations";

import { makeAutoObservable } from "mobx";

export class restrict {
    restrictWordInfo: any = {
        banChecked: [],
        banList: [],
        banExcelInput: null,
        banWordInput: "",

        findWordInput: "",

        replaceChecked: [],
        replaceList: [],
        replaceExcelInput: null,
        replaceWordInput: "",

        loading: false
    };

    constructor() {
        makeAutoObservable(this);
    }

    uploadExcel = async (data: any) => {
        let formData: any = new FormData();

        let operations = {
            "variables": {
                "data": null,
                "isReplace": data.isReplace
            },

            "query": "mutation ($data: Upload!, $isReplace: Boolean!) {\n  addWordByExcelByUser(data: $data, isReplace: $isReplace)\n}\n"
        };

        let map = { "1": ["variables.data"] };

        formData.append('operations', JSON.stringify(operations));
        formData.append('map', JSON.stringify(map));
        formData.append('1', data.data, `${data.data.name.split(".")[0]}.${data.data.name.split(".")[1]}`);

        const response = await gql(null, formData, true);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        window.location.reload();
    }

    getRestrictWords = async () => {
        const response = await gql(QUERIES.SELECT_WORD_TABLES_BY_SOMEONE, {}, false);

        if (response.errors) {
            return;
        }

        this.restrictWordInfo.banList = response.data.selectWordTablesBySomeone.filter((v: any) => v.findWord && !v.replaceWord);
        this.restrictWordInfo.banList.map(() => this.restrictWordInfo.banChecked.push(false));

        this.restrictWordInfo.replaceList = response.data.selectWordTablesBySomeone.filter((v: any) => v.findWord && v.replaceWord);
        this.restrictWordInfo.replaceList.map(() => this.restrictWordInfo.replaceChecked.push(false));

        this.restrictWordInfo.loading = true;
    }

    setRestrictWordInfo = async (data: any) => {
        this.restrictWordInfo = data;
    }

    addBanWordTable = async () => {
        const response = await gql(MUTATIONS.ADD_WORD_BY_USER, {
            findWord: this.restrictWordInfo.banWordInput,
            replaceWord: null,
        });

        if (response.errors) {
            return;
        }

        window.location.reload();
    }

    addReplaceWordTable = async () => {
        if (!this.restrictWordInfo.findWordInput) {
            alert("검색어명에 공백을 입력하실 수 없습니다.");

            return;
        }

        const response = await gql(MUTATIONS.ADD_WORD_BY_USER, {
            findWord: this.restrictWordInfo.findWordInput,
            replaceWord: this.restrictWordInfo.replaceWordInput !== "" ? this.restrictWordInfo.replaceWordInput : " ",
        });

        if (response.errors) {
            return;
        }

        window.location.reload();
    }

    deleteBanWordFromTable = async () => {
        let wordIds: any = [];

        this.restrictWordInfo.banList.map((v: any, index: number) => {
            if (!this.restrictWordInfo.banChecked[index]) {
                return;
            }

            if (v.findWord && !v.replaceWord) {
                wordIds.push(v.id);
            }
        })

        const response = await gql(MUTATIONS.DELETE_WORD_BY_USER, { wordId: wordIds }, false)

        if (response.errors) {
            return;
        }

        window.location.reload();
    }

    deleteReplaceWordFromTable = async () => {
        let wordIds: any = [];

        this.restrictWordInfo.replaceList.map((v: any, index: number) => {
            if (!this.restrictWordInfo.replaceChecked[index]) {
                return;
            }

            if (v.findWord && v.replaceWord) {
                wordIds.push(v.id);
            }
        })

        const response = await gql(MUTATIONS.DELETE_WORD_BY_USER, { wordId: wordIds }, false)

        if (response.errors) {
            return;
        }

        window.location.reload();
    }

    toggleBanChecked = (value: boolean, index: number) => {
        this.restrictWordInfo.banChecked[index] = value;
    }

    toggleBanCheckedAll = (value: boolean) => {
        this.restrictWordInfo.banChecked = this.restrictWordInfo.banChecked.map(() => value);
    }

    toggleReplaceChecked = (value: boolean, index: number) => {
        this.restrictWordInfo.replaceChecked[index] = value;
    }

    toggleReplaceCheckedAll = (value: boolean) => {
        this.restrictWordInfo.replaceChecked = this.restrictWordInfo.replaceChecked.map(() => value);
    }
}