import gql from "../../pages/Main/GraphQL/Requests";
import QUERIES from "../../pages/Main/GraphQL/Queries";
import MUTATIONS from "../../pages/Main/GraphQL/Mutations";

import { runInAction, makeAutoObservable } from "mobx";
import { cartesian, downloadExcel, floatingToast, getClock, getImageMeta } from "../../pages/Tools/Common";
import { deleteSmartStore, uploadSmartStore } from "../../pages/Tools/SmartStore";
import { coupangApiGateway, deleteCoupang, uploadCoupang } from "../../pages/Tools/Coupang";
import { deleteStreet, uploadStreet } from "../../pages/Tools/Street";
import { deleteESMPlus, uploadESMPlus } from "../../pages/Tools/ESMPlus";
import { deleteInterpark, uploadInterpark } from "../../pages/Tools/Interpark";
import { deleteWemakeprice, uploadWemakeprice } from "../../pages/Tools/Wemakeprice";
import { deleteLotteon, uploadLotteon } from "../../pages/Tools/Lotteon";
import { deleteTmon, uploadTmon } from "../../pages/Tools/Tmon";
import { getLocalStorage, setLocalStorage } from "../../pages/Tools/ChromeAsync";

export class product {
    count: number = 0;

    etcPageSize: boolean = false;

    pageTemp: number = 1;
    page: number = 1;
    pages: number = 0;
    pageSize: number = 10;

    state: number = 6;

    tagDict: any = [];

    uploadConsole: any = [];
    uploadDisabledIndex: number = -1;
    uploadFailedIndex: number = -1;
    uploadIndex: number = -1;

    itemInfo: any = {
        checkedAll: false,
        current: 0,

        items: [],

        loading: false
    }

    collectInfo: any = {
        wait: [],
        success: [],
        failed: []
    }

    registeredInfo: any = {
        wait: [],
        success: [],
        failed: []
    }

    popOverInfo: any = {
        image: {
            open: false,
            element: null,
            data: {
                src: ""
            }
        },

        addOptionName: {
            index: -1,
            open: false,
            element: null,
            data: {
                index: -1,
                head: "",
                tail: ""
            }
        },

        replaceOptionName: {
            index: -1,
            open: false,
            element: null,
            data: {
                index: -1,
                find: "",
                replace: ""
            }
        },

        addOptionPrice: {
            index: -1,
            open: false,
            element: null,
            data: {
                nameIndex: -1,
                valueIndex: -1,
                price: ""
            }
        },

        subtractOptionPrice: {
            index: -1,
            open: false,
            element: null,
            data: {
                nameIndex: -1,
                valueIndex: -1,
                price: ""
            }
        },

        setOptionPrice: {
            index: -1,
            open: false,
            element: null,
            data: {
                nameIndex: -1,
                valueIndex: -1,
                price: ""
            }
        },

        setOptionStock: {
            index: -1,
            open: false,
            element: null,
            data: {
                nameIndex: -1,
                valueIndex: -1,
                stock: ""
            }
        }
    }

    modalInfo: any = {
        addOptionName: false,
        category: false,
        collectExcel: false,
        description: false,
        fee: false,
        name: false,
        price: false,
        replaceOptionName: false,
        tag: false,
        upload: false,
        uploadDisabled: false,
        uploadFailed: false,
    }

    searchInfo: any = {
        categoryInfo: {
            code: null,
            name: null
        },

        collectedStart: null,
        collectedEnd: null,

        registeredStart: null,
        registeredEnd: null,

        cnyPriceStart: null,
        cnyPriceEnd: null,

        cnyRateStart: null,
        cnyRateEnd: null,

        localFeeStart: null,
        localFeeEnd: null,

        marginRateStart: null,
        marginRateEnd: null,

        priceStart: null,
        priceEnd: null,

        feeStart: null,
        feeEnd: null,

        shopName: "ALL",
        marketName: "ALL",

        hasVideo: "ALL",
        hasRegistered: "ALL",

        searchKeyword: "",
        searchType: "PCODE",

        useFilter: false,

        whereInput: {}
    }

    categoryInfo: any = {
        markets: [
            {
                code: "A077",
                data: [],
                loading: false,
                input: "",
            },

            {
                code: "B378",
                data: [],
                loading: false,
                input: "",
            },

            {
                code: "A112",
                data: [],
                loading: false,
                input: "",
            },

            {
                code: "A113",
                data: [],
                loading: false,
                input: "",
            },

            {
                code: "A006",
                data: [],
                loading: false,
                input: "",
            },

            {
                code: "A001",
                data: [],
                loading: false,
                input: "",
            },

            {
                code: "A027",
                data: [],
                loading: false,
                input: "",
            },

            {
                code: "B719",
                data: [],
                loading: false,
                input: "",
            },

            {
                code: "A524",
                data: [],
                loading: false,
                input: "",
            },

            {
                code: "A525",
                data: [],
                loading: false,
                input: "",
            },

            {
                code: "B956",
                data: [],
                loading: false,
                input: "",
            }
        ],
    };

    manyPriceInfo: any = {
        cnyRate: 185,
        marginRate: 25,
        marginUnitType: "PERCENT",
        localShippingFee: 6000,
        shippingFee: 0
    }

    manyFeeInfo: any = {
        naverFee: 0,
        coupangFee: 0,
        streetFee: 0,
        streetNormalFee: 0,
        gmarketFee: 0,
        auctionFee: 0,
        interparkFee: 0,
        wemakepriceFee: 0,
        lotteonFee: 0,
        lotteonNormalFee: 0,
        tmonFee: 0
    }

    manyNameInfo: any = {
        type: "1",

        body: "",

        head: "",
        tail: "",

        find: "",
        replace: ""
    }

    manyTagInfo: any = {
        searchTags: "",
        searchTagsDisabled: false,

        immSearchTags: "",
        immSearchTagsDisabled: false
    }

    manyCategoryInfo: any = {
        categoryInfoA077: {
            code: null,
            name: ""
        },

        categoryInfoB378: {
            code: null,
            name: ""
        },

        categoryInfoA112: {
            code: null,
            name: ""
        },

        categoryInfoA113: {
            code: null,
            name: ""
        },

        categoryInfoA006: {
            code: null,
            name: ""
        },

        categoryInfoA001: {
            code: null,
            name: ""
        },

        categoryInfoA027: {
            code: null,
            name: ""
        },

        categoryInfoB719: {
            code: null,
            name: ""
        },

        categoryInfoA524: {
            code: null,
            name: ""
        },

        categoryInfoA525: {
            code: null,
            name: ""
        },

        categoryInfoB956: {
            code: null,
            name: ""
        }
    }

    constructor() {
        makeAutoObservable(this);

        this.loadAppInfo();
    }

    loadAppInfo = async () => {
        let auth: any = await getLocalStorage('appInfo');

        runInAction(() => {
            this.pageSize = auth.pageSize ?? 10;

            if (
                this.pageSize !== 10 &&
                this.pageSize !== 20 &&
                this.pageSize !== 50 &&
                this.pageSize !== 100 &&
                this.pageSize !== 200
            ) {
                this.etcPageSize = true;
            }
        });
    }

    setImagePopOver = (data: any) => {
        this.popOverInfo.image = data;
    }

    setAddOptionNamePopOver = (data: any) => {
        this.popOverInfo.addOptionName = data;
    }

    setReplaceOptionNamePopOver = (data: any) => {
        this.popOverInfo.replaceOptionName = data;
    }

    setAddOptionPricePopOver = (data: any) => {
        this.popOverInfo.addOptionPrice = data;
    }

    setSubtractOptionPricePopOver = (data: any) => {
        this.popOverInfo.subtractOptionPrice = data;
    }

    setOptionPricePopOver = (data: any) => {
        this.popOverInfo.setOptionPrice = data;
    }

    setOptionStockPopOver = (data: any) => {
        this.popOverInfo.setOptionStock = data;
    }

    getCategoryList = async (marketCode: string) => {
        let result = this.categoryInfo.markets.find((v: any) => v.code === marketCode)

        if (result.data.length > 0) {
            return;
        }

        result.loading = true;

        let categories: any = null;

        switch (marketCode) {
            case "A077": categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_A077_BY_SOMEONE, {}, false); break;
            case "B378": categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_B378_BY_SOMEONE, {}, false); break;
            case "A112": categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_A112_BY_SOMEONE, {}, false); break;
            case "A113": categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_A113_BY_SOMEONE, {}, false); break;
            case "A006": categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_A006_BY_SOMEONE, {}, false); break;
            case "A001": categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_A001_BY_SOMEONE, {}, false); break;
            case "A027": categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_A027_BY_SOMEONE, {}, false); break;
            case "B719": categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_B719_BY_SOMEONE, {}, false); break;
            case "A524": categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_A524_BY_SOMEONE, {}, false); break;
            case "A525": categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_A525_BY_SOMEONE, {}, false); break;
            case "B956": categories = await gql(QUERIES.SEARCH_CATEGORY_INFO_B956_BY_SOMEONE, {}, false); break;
        }

        if (categories.errors) {
            return;
        }

        runInAction(() => {
            switch (marketCode) {
                case "A077": result.data = categories.data.searchCategoryInfoA077BySomeone; break;
                case "B378": result.data = categories.data.searchCategoryInfoB378BySomeone; break;
                case "A112": result.data = categories.data.searchCategoryInfoA112BySomeone; break;
                case "A113": result.data = categories.data.searchCategoryInfoA113BySomeone; break;
                case "A006": result.data = categories.data.searchCategoryInfoA006BySomeone; break;
                case "A001": result.data = categories.data.searchCategoryInfoA001BySomeone; break;
                case "A027": result.data = categories.data.searchCategoryInfoA027BySomeone; break;
                case "B719": result.data = categories.data.searchCategoryInfoB719BySomeone; break;
                case "A524": result.data = categories.data.searchCategoryInfoA524BySomeone; break;
                case "A525": result.data = categories.data.searchCategoryInfoA525BySomeone; break;
                case "B956": result.data = categories.data.searchCategoryInfoB956BySomeone; break;
            }

            result.loading = false;
        });
    }

    setCategoryInput = async (marketCode: string, value: string) => {
        this.categoryInfo.markets.find((v: any) => v.code === marketCode).input = value;
    }

    setManyCategory = async (marketCode: string, value: any) => {
        switch (marketCode) {
            case "A077": this.manyCategoryInfo.categoryInfoA077 = value; break;
            case "B378": this.manyCategoryInfo.categoryInfoB378 = value; break;
            case "A112": this.manyCategoryInfo.categoryInfoA112 = value; break;
            case "A113": this.manyCategoryInfo.categoryInfoA113 = value; break;
            case "A006": this.manyCategoryInfo.categoryInfoA006 = value; break;
            case "A001": this.manyCategoryInfo.categoryInfoA001 = value; break;
            case "A027": this.manyCategoryInfo.categoryInfoA027 = value; break;
            case "B719": this.manyCategoryInfo.categoryInfoB719 = value; break;
            case "A524": this.manyCategoryInfo.categoryInfoA524 = value; break;
            case "A525": this.manyCategoryInfo.categoryInfoA525 = value; break;
            case "B956": this.manyCategoryInfo.categoryInfoB956 = value; break;
        }
    }

    setCategory = (index: number) => {
        this.itemInfo.items[index] = {
            ...this.itemInfo.items[index],

            categoryInfoA077: this.manyCategoryInfo.categoryInfoA077,
            categoryInfoB378: this.manyCategoryInfo.categoryInfoB378,
            categoryInfoA112: this.manyCategoryInfo.categoryInfoA112,
            categoryInfoA113: this.manyCategoryInfo.categoryInfoA113,
            categoryInfoA006: this.manyCategoryInfo.categoryInfoA006,
            categoryInfoA001: this.manyCategoryInfo.categoryInfoA001,
            categoryInfoA027: this.manyCategoryInfo.categoryInfoA027,
            categoryInfoB719: this.manyCategoryInfo.categoryInfoB719,
            categoryInfoA524: this.manyCategoryInfo.categoryInfoA524,
            categoryInfoA525: this.manyCategoryInfo.categoryInfoA525,
            categoryInfoB956: this.manyCategoryInfo.categoryInfoB956
        };
    }

    updateCategory = async (marketCode: string, value: any, index: number) => {
        let data: any = null;

        switch (marketCode) {
            case "A077": data = { productId: this.itemInfo.items[index].id, categoryA077: value.code }; break;
            case "B378": data = { productId: this.itemInfo.items[index].id, categoryB378: value.code }; break;
            case "A112": data = { productId: this.itemInfo.items[index].id, categoryA112: value.code }; break;
            case "A113": data = { productId: this.itemInfo.items[index].id, categoryA113: value.code }; break;
            case "A006": data = { productId: this.itemInfo.items[index].id, categoryA006: value.code }; break;
            case "A001": data = { productId: this.itemInfo.items[index].id, categoryA001: value.code }; break;
            case "A027": data = { productId: this.itemInfo.items[index].id, categoryA027: value.code }; break;
            case "B719": data = { productId: this.itemInfo.items[index].id, categoryB719: value.code }; break;
            case "A524": data = { productId: this.itemInfo.items[index].id, categoryA524: value.code }; break;
            case "A525": data = { productId: this.itemInfo.items[index].id, categoryA525: value.code }; break;
            case "B956": data = { productId: this.itemInfo.items[index].id, categoryB956: value.code }; break;
        }

        if (!data) {
            floatingToast('카테고리정보를 찾을 수 없습니다.', 'failed');

            return;
        }

        let categories = await gql(MUTATIONS.UPDATE_PRODUCT_CATEGORY, data, false);

        if (categories.errors) {
            alert(categories.errors[0].message);

            return;
        }

        runInAction(() => {
            switch (marketCode) {
                case "A077": {
                    this.itemInfo.items[index].categoryInfoA077 = value;
                    this.itemInfo.items[index].tagInfo = this.tagDict.find((w: any) => w.code === value.code).tagJson;

                    break;
                }

                case "B378": this.itemInfo.items[index].categoryInfoB378 = value; break;
                case "A112": this.itemInfo.items[index].categoryInfoA112 = value; break;
                case "A113": this.itemInfo.items[index].categoryInfoA113 = value; break;
                case "A006": this.itemInfo.items[index].categoryInfoA006 = value; break;
                case "A001": this.itemInfo.items[index].categoryInfoA001 = value; break;
                case "A027": this.itemInfo.items[index].categoryInfoA027 = value; break;
                case "B719": this.itemInfo.items[index].categoryInfoB719 = value; break;
                case "A524": this.itemInfo.items[index].categoryInfoA524 = value; break;
                case "A525": this.itemInfo.items[index].categoryInfoA525 = value; break;
                case "B956": this.itemInfo.items[index].categoryInfoB956 = value; break;
            }
        });

        floatingToast('카테고리가 저장되었습니다.', 'success');
    }

    updateCategoryAuto = async (value: any, index: number) => {
        const response = await gql(QUERIES.SEARCH_CATEGORY_INFO_A077_BY_CODE, { code: value.code }, false);

        if (response.errors) {
            return;
        }

        const categories = response.data.searchCategoryInfoA077BySomeone[0];

        const updateResponse = await gql(MUTATIONS.UPDATE_PRODUCT_CATEGORY, {
            productId: this.itemInfo.items[index].id,
            categoryA077: categories.code,
            categoryB378: categories.categoryInfoB378.code,
            categoryA112: categories.categoryInfoA112.code,
            categoryA113: categories.categoryInfoA113.code,
            categoryA006: categories.categoryInfoA006.code,
            categoryA001: categories.categoryInfoA001.code,
            categoryA027: categories.categoryInfoA027.code,
            categoryB719: categories.categoryInfoB719.code,
            categoryA524: categories.categoryInfoA524.code,
            categoryA525: categories.categoryInfoA525.code,
            categoryB956: categories.categoryInfoB956.code,
        }, false);

        if (updateResponse.errors) {
            return;
        }

        const tagInfo = this.tagDict.find((w: any) => w.code === value.code).tagJson;

        this.itemInfo.items[index] = {
            ...this.itemInfo.items[index],

            categoryInfoA077: {
                code: categories.code,
                name: categories.name
            },

            categoryInfoB378: categories.categoryInfoB378,
            categoryInfoA112: categories.categoryInfoA112,
            categoryInfoA113: categories.categoryInfoA113,
            categoryInfoA006: categories.categoryInfoA006,
            categoryInfoA001: categories.categoryInfoA001,
            categoryInfoA027: categories.categoryInfoA027,
            categoryInfoB719: categories.categoryInfoB719,
            categoryInfoA524: categories.categoryInfoA524,
            categoryInfoA525: categories.categoryInfoA525,
            categoryInfoB956: categories.categoryInfoB956,

            tagInfo
        };

        floatingToast('카테고리가 저장되었습니다.', 'success');
    }

    updateManyCategoryAuto = async (value: any) => {
        const response = await gql(QUERIES.SEARCH_CATEGORY_INFO_A077_BY_CODE, { code: value.code }, false);

        if (response.errors) {
            return;
        }

        const categories = response.data.searchCategoryInfoA077BySomeone[0];

        runInAction(() => {
            this.manyCategoryInfo = {
                categoryInfoA077: {
                    code: categories.code,
                    name: categories.name
                },

                categoryInfoB378: categories.categoryInfoB378,
                categoryInfoA112: categories.categoryInfoA112,
                categoryInfoA113: categories.categoryInfoA113,
                categoryInfoA006: categories.categoryInfoA006,
                categoryInfoA001: categories.categoryInfoA001,
                categoryInfoA027: categories.categoryInfoA027,
                categoryInfoB719: categories.categoryInfoB719,
                categoryInfoA524: categories.categoryInfoA524,
                categoryInfoA525: categories.categoryInfoA525,
                categoryInfoB956: categories.categoryInfoB956
            };
        })
    }

    setState = (value: number) => {
        this.state = value;
    }

    setPageTemp = (value: number) => {
        this.pageTemp = value;
    }

    setPageSize = async (value: number) => {
        let auth: any = await getLocalStorage('appInfo');

        auth.pageSize = value;

        await setLocalStorage({ appInfo: auth });

        runInAction(() => {
            this.pageSize = value;
        });
    }

    getTagDict = async () => {
        const tagResp = await fetch('/resources/dictionary.json');
        const tagJson = await tagResp.json();

        runInAction(() => {
            this.tagDict = tagJson;
        });
    }

    getProduct = async (p: number) => {
        this.itemInfo.loading = true;

        // Backup
        const oldItems = this.itemInfo.items;

        const response1 = await gql(QUERIES.SELECT_MY_PRODUCT_COUNT_BY_USER, { where: this.searchInfo.whereInput }, false);

        if (response1.errors) {
            alert(response1.errors[0].message);

            return;
        }

        runInAction(() => {
            this.itemInfo.items = [];

            this.page = p;
            // this.pageSize = s;

            this.count = response1.data.selectMyProductsCountByUser;

            const pagesOffset = Math.ceil(this.count / this.pageSize);

            this.pages = pagesOffset;
        });

        let s = this.pageSize;

        if (s > this.count) {
            s = this.count;
        }

        const skipOffset = (p - 1) * s;

        const response2 = await gql(QUERIES.SELECT_MY_PRODUCT_BY_USER, {
            where: this.searchInfo.whereInput,
            orderBy: { createdAt: "desc" },
            skip: skipOffset,
            take: s
        }, false);

        if (response2.errors) {
            alert(response2.errors[0].message);

            return;
        }

        const result = await Promise.all(response2.data.selectMyProductByUser.map(async (v: any) => {
            v.attribute = v.attribute ? JSON.parse(v.attribute) : [];

            v.imageThumbnail = v.imageThumbnail.map((w: any) => {
                return /^https?/.test(w) ? w : `${process.env.SELLFORYOU_MINIO_HTTPS}/${w}`
            });

            if (v.activeTaobaoProduct.videoUrl) {
                v.activeTaobaoProduct.videoUrl = /^https?/.test(v.activeTaobaoProduct.videoUrl) ? v.activeTaobaoProduct.videoUrl : "https:" + v.activeTaobaoProduct.videoUrl;
            }

            v.productOptionName.map((w: any) => {
                w.productOptionValue.map((x: any) => {
                    if (x.image) {
                        x.image = /^https?/.test(x.image) ? x.image : `${process.env.SELLFORYOU_MINIO_HTTPS}/${x.image}`
                    }
                })
            })

            let descHtml: any = null;

            if (v.description.includes("description.html")) {
                let descResp = await fetch(`${process.env.SELLFORYOU_MINIO_HTTPS}/${v.description}?${new Date().getTime()}`);
                let descText = await descResp.text();

                descHtml = new DOMParser().parseFromString(descText, "text/html");

                v.description = descText ?? v.description;
            } else {
                descHtml = new DOMParser().parseFromString(v.description, "text/html");
            }

            if (descHtml) {
                v.descriptionImages = [];

                const imageList: any = descHtml.querySelectorAll('img');

                for (let i in imageList) {
                    if (!imageList[i].src) {
                        continue;
                    }

                    v.descriptionImages.push(imageList[i].src);
                }
            }

            if (!v.categoryInfoA077) {
                v.categoryInfoA077 = {
                    code: null,
                    name: "카테고리를 선택해주세요."
                }
            }

            if (!v.categoryInfoB378) {
                v.categoryInfoB378 = {
                    code: null,
                    name: "카테고리를 선택해주세요."
                }
            }

            if (!v.categoryInfoA112) {
                v.categoryInfoA112 = {
                    code: null,
                    name: "카테고리를 선택해주세요."
                }
            }

            if (!v.categoryInfoA113) {
                v.categoryInfoA113 = {
                    code: null,
                    name: "카테고리를 선택해주세요."
                }
            }

            if (!v.categoryInfoA006) {
                v.categoryInfoA006 = {
                    code: null,
                    name: "카테고리를 선택해주세요."
                }
            }

            if (!v.categoryInfoA001) {
                v.categoryInfoA001 = {
                    code: null,
                    name: "카테고리를 선택해주세요."
                }
            }

            if (!v.categoryInfoA027) {
                v.categoryInfoA027 = {
                    code: null,
                    name: "카테고리를 선택해주세요."
                }
            }

            if (!v.categoryInfoB719) {
                v.categoryInfoB719 = {
                    code: null,
                    name: "카테고리를 선택해주세요."
                }
            }

            if (!v.categoryInfoA524) {
                v.categoryInfoA524 = {
                    code: null,
                    name: "카테고리를 선택해주세요."
                }
            }

            if (!v.categoryInfoA525) {
                v.categoryInfoA525 = {
                    code: null,
                    name: "카테고리를 선택해주세요."
                }
            }

            if (!v.categoryInfoB956) {
                v.categoryInfoB956 = {
                    code: null,
                    name: "카테고리를 선택해주세요."
                }
            }

            const tagInfo = this.tagDict.find((w: any) => w.code === v.categoryInfoA077?.code)?.tagJson;
            const checked = oldItems.find((w: any) => w.id === v.id)?.checked ?? false;

            return {
                ...v,

                tagInfo,

                checked,
                collapse: false,
                delete: false,
                error: false,
                tabs: 0,

                thumbnailImageError: false,
                optionPriceError: false,
                optionImageError: false,
                descriptionImageError: false
            }
        }));

        runInAction(() => {
            this.itemInfo.items = result;
            this.itemInfo.loading = false;
            this.itemInfo.checkedAll = false;
        });

        console.log(this.itemInfo);
    };

    deleteProduct = async (productId: number) => {
        let productIds: any = [];

        if (productId === -1) {
            this.itemInfo.items.filter((v: any) => v.checked).map((v: any) => {
                productIds.push(v.id);
            });

            if (productIds.length < 1) {
                alert("상품이 선택되지 않았습니다.");

                return;
            }

            const accept = confirm(`선택한 상품 ${productIds.length}개를 삭제하시겠습니까?\n삭제된 상품은 다시 복구하실 수 없습니다.`);

            if (!accept) {
                return;
            }

            this.itemInfo.items.filter((v: any) => v.checked).map((v: any) => {
                v.delete = true;
            });
        } else {
            productIds.push(productId);

            const accept = confirm(`상품을 삭제하시겠습니까?\n삭제된 상품은 다시 복구하실 수 없습니다.`);

            if (!accept) {
                return;
            }

            this.itemInfo.items.find((v: any) => v.id === productId).delete = true;
        }

        await gql(MUTATIONS.DELETE_PRODUCT_BY_USER, { productId: productIds }, false);

        this.getProduct(this.page);
    }

    setProductName = async (data: any, index: number) => {
        this.itemInfo.items[index].name = data;
    }

    updateProductName = async (index: number) => {
        const response = await gql(MUTATIONS.UPDATE_PRODUCT_NAME_BY_USER, { productId: this.itemInfo.items[index].id, name: this.itemInfo.items[index].name }, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        floatingToast('상품명이 저장되었습니다.', 'success');
    }

    updateProductSearchTag = async (data: any, index: number) => {
        const response = await gql(MUTATIONS.UPDATE_PRODUCT_TAG_BY_USER, { productId: this.itemInfo.items[index].id, searchTags: data });

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        this.itemInfo.items[index].searchTags = data;

        floatingToast('검색어태그(쿠팡)가 저장되었습니다.', 'success');
    }

    updateProductImmSearchTag = async (data: any, index: number) => {
        let tagList = this.itemInfo.items[index].immSearchTags?.split(",") ?? [];

        tagList = tagList.filter((v: any) => v);

        if (tagList.find((v: any) => v === data)) {
            return;
        }

        if (tagList.length > 9) {
            floatingToast('검색어는 최대 10개까지만 입력하실 수 있습니다.', 'information');

            return;
        }

        tagList.push(data);

        let output = "";

        tagList.map((v: any) => {
            output += `${v},`;
        });

        output = output.slice(0, output.length - 1);

        this.itemInfo.items[index].immSearchTags = output;

        const response = await gql(MUTATIONS.UPDATE_PRODUCT_TAG_BY_USER, { productId: this.itemInfo.items[index].id, immSearchTags: output });

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        floatingToast('검색어태그(스마트스토어)가 저장되었습니다.', 'success');
    }

    verifyProductImmSearchTag = async (data: any, index: number) => {
        let tagList = this.itemInfo.items[index].immSearchTags?.split(",") ?? [];

        tagList = tagList.filter((v: any) => v);

        if (tagList.length > 9) {
            floatingToast('검색어는 최대 10개까지만 입력하실 수 있습니다.', 'information');

            return;
        }

        let output = "";

        let addList = data.replaceAll(" ", "").split(",") ?? [];

        let userResp = await fetch("https://sell.smartstore.naver.com/api/products?_action=create");
        let userJson = await userResp.json();

        if (userJson.error) {
            floatingToast('스마트스토어 로그인 후 이용해주세요.', 'warning');

            return;
        }

        let tagDataSet = await Promise.all(addList.filter((v: any) => v).map(async (v: any) => {
            const tagResp = await fetch(`https://sell.smartstore.naver.com/api/product/shared/is-restrict-tag?_action=isRestrictTag&tag=${encodeURI(v)}`);
            const tagJson = await tagResp.json();

            return {
                tag: v,
                restricted: tagJson.restricted
            }
        }));

        tagDataSet.map((v: any) => {
            if (tagList.length > 9) {
                floatingToast('검색어는 최대 10개까지만 입력하실 수 있습니다.', 'information');

                return;
            }

            if (tagList.find((w: any) => w === v.tag)) {
                return;
            }

            if (v.restricted) {
                floatingToast(`사용할 수 없는 검색어입니다. [${v.tag}]`, 'failed');

                return;
            }

            tagList.push(v.tag);
        });

        tagList.map((v: any) => {
            output += `${v},`;
        });

        output = output.slice(0, output.length - 1);

        this.itemInfo.items[index].immSearchTags = output;

        await gql(MUTATIONS.UPDATE_PRODUCT_TAG_BY_USER, { productId: this.itemInfo.items[index].id, immSearchTags: output });

        floatingToast('검색어태그(스마트스토어)가 저장되었습니다.', 'success');
    }

    filterProductImmSearchTag = async (data: any, index: number) => {
        let tagList = this.itemInfo.items[index].immSearchTags?.split(",") ?? [];

        let output = "";

        tagList = tagList.filter((v: any) => v && v !== data);
        tagList.map((v: any) => {
            output += `${v},`;
        });

        output = output.slice(0, output.length - 1);

        this.itemInfo.items[index].immSearchTags = output;

        await gql(MUTATIONS.UPDATE_PRODUCT_TAG_BY_USER, { productId: this.itemInfo.items[index].id, immSearchTags: output });

        floatingToast('검색어태그(스마트스토어)가 저장되었습니다.', 'success');
    }

    addProductThumbnailImage = async (blob: any, base64: any, index: number) => {
        const temp: any = {
            productId: this.itemInfo.items[index].id,
            thumbnails: []
        };

        const thumbnails = this.itemInfo.items[index].imageThumbnail.map((v: any) => {
            temp.thumbnails.push({
                defaultImage: v,
                uploadImage: null
            })

            return v;
        })

        temp.thumbnails.push({
            defaultImage: "",
            uploadImage: null
        })

        let formData: any = new FormData();

        let operations = {
            "variables": temp,

            "query": MUTATIONS.UPDATE_IMAGE_THUMBNAIL_DATA
        };

        let map = { "1": [`variables.thumbnails.${temp.thumbnails.length - 1}.uploadImage`] };

        formData.append('operations', JSON.stringify(operations));
        formData.append('map', JSON.stringify(map));
        formData.append("1", blob, blob.name);

        const response = await gql(null, formData, true);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        runInAction(() => {
            thumbnails.push(response.data.updateImageThumbnailData);

            this.itemInfo.items[index].imageThumbnail = thumbnails;
        });

        floatingToast('썸네일이미지정보가 추가되었습니다.', 'success');
    }

    updateProductThumbnailImage = async (src: number, dst: number, index: number) => {
        if (src === dst) {
            return;
        }

        const temp = [...this.itemInfo.items[index].imageThumbnail];

        temp.splice(src, 1);

        if (dst >= 0) {
            temp.splice(dst, 0, this.itemInfo.items[index].imageThumbnail[src]);
        }

        const response = await gql(MUTATIONS.UPDATE_IMAGE_THUMBNAIL_DATA, {
            productId: this.itemInfo.items[index].id,
            thumbnails: temp.map((v: any) => {
                return {
                    defaultImage: v,
                    uploadImage: null
                }
            })
        })

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        runInAction(() => {
            this.itemInfo.items[index].imageThumbnail = temp;
        });

        floatingToast('썸네일이미지정보가 저장되었습니다.', 'success');
    }

    setProductPrice = async (price: number, index: number) => {
        this.itemInfo.items[index].price = price;
    }

    updateProductPrice = async (index: number) => {
        const response = await gql(MUTATIONS.UPDATE_PRODUCT_SINGLE_PRICE_BY_USER, {
            productId: this.itemInfo.items[index].id,
            price: this.itemInfo.items[index].price
        }, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        floatingToast('가격정보가 저장되었습니다.', 'success');
    }

    setProductOption = async (commonStore: any, data: any, index: number, optionIndex: number, handlePrice: boolean) => {
        let price: any = null;

        if (!handlePrice) {
            let priceInfo: any = {
                cnyRate: this.itemInfo.items[index].cnyRate,
                marginRate: this.itemInfo.items[index].marginRate,
                marginUnitType: this.itemInfo.items[index].marginUnitType,
            };

            if (priceInfo.marginUnitType === 'PERCENT') {
                price = ((data.priceCny * priceInfo.cnyRate) + data.defaultShippingFee) * (1 + priceInfo.marginRate / 100);
            } else {
                price = (data.priceCny * priceInfo.cnyRate) + data.defaultShippingFee + priceInfo.marginRate;
            }

            const wonType = commonStore.user.userInfo.calculateWonType;

            price = Math.round(price / wonType) * wonType;
        } else {
            price = data.price;
        }

        this.itemInfo.items[index].productOption[optionIndex] = { ...data, price };
    }

    updateManyProductOption = async (index: number, optionIds: any) => {
        let options: any = [];

        let priceList = this.itemInfo.items[index].productOption.filter((v: any) => {
            let found = optionIds.find((w: any) => w === v.id);

            if (found) {
                options.push({
                    productOptionId: v.id,
                    defaultShippingFee: v.defaultShippingFee,
                    price: v.price,
                    stock: v.stock,
                    isActive: v.isActive
                });
            }

            return v.isActive;
        }).map((v: any) => v.price);

        const response = await gql(MUTATIONS.UPDATE_MANY_PRODUCT_OPTION, { data: options }, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        if (priceList.length > 0) {
            let priceLowest = Math.min(...priceList);

            if (this.itemInfo.items[index].price !== priceLowest) {
                const response = await gql(MUTATIONS.UPDATE_PRODUCT_SINGLE_PRICE_BY_USER, {
                    productId: this.itemInfo.items[index].id,
                    price: priceLowest
                }, false);

                if (response.errors) {
                    alert(response.errors[0].message);

                    return;
                }

                this.itemInfo.items[index].price = priceLowest;
            }
        }

        floatingToast('옵션세부정보가 저장되었습니다.', 'success');
    }

    replaceProductOption = async (commonStore: any, index: number) => {
        const taobaoData = JSON.parse(this.itemInfo.items[index].activeTaobaoProduct.originalData);

        let options: any = [];
        let optionNames: any = [];

        this.itemInfo.items[index].productOptionName.map((w: any) => {
            if (!w.isActive) {
                return [];
            }

            let optionValues: any = [];

            w.productOptionValue.map((x: any) => {
                if (!x.isActive) {
                    return;
                }

                optionValues.push({
                    name: w,
                    value: x
                });
            });

            if (optionValues.length > 0) {
                optionNames.push(optionValues);
            }
        });

        if (optionNames.length > 0) {
            const wonType = commonStore.user.userInfo.calculateWonType;

            let combination = cartesian(...optionNames)

            combination.map((w: any, nameIndex: number) => {
                let option: any = {
                    productId: this.itemInfo.items[index].id,
                    optionValue1Id: "",
                    optionValue2Id: null,
                    optionValue3Id: null,
                    optionValue4Id: null,
                    optionValue5Id: null,
                    isActive: true,
                    taobaoSkuId: nameIndex.toString(),
                    priceCny: 0,
                    price: 0,
                    stock: 0,
                    optionString: "",
                    name: "",
                    defaultShippingFee: this.itemInfo.items[index].localShippingFee
                };

                let optionInfo = taobaoData.skus.sku;

                w.map((x: any, valueIndex: number) => {
                    optionInfo = optionInfo.filter((y: any) => {
                        const skus = y.properties.split(";");
                        const matched = skus.find((z: any) => z === `${x.name.taobaoPid}:${x.value.taobaoVid}`);

                        if (!matched) {
                            return false;
                        }

                        return true;
                    });

                    option['name'] += `${x.name.name}:${x.value.name}, `

                    option[`optionValue${valueIndex + 1}Id`] = x.value.id;
                    option['optionString'] += `${x.value.number.toString().padStart(2, '0')}_`
                });

                if (optionInfo.length > 0) {
                    let price: any = null;
                    let priceInfo: any = {
                        priceCny: parseFloat(optionInfo[0].price),
                        cnyRate: this.itemInfo.items[index].cnyRate,
                        marginRate: this.itemInfo.items[index].marginRate,
                        marginUnitType: this.itemInfo.items[index].marginUnitType,
                        localShippingFee: this.itemInfo.items[index].localShippingFee,
                    };

                    if (priceInfo.marginUnitType === 'PERCENT') {
                        price = ((priceInfo.priceCny * priceInfo.cnyRate) + priceInfo.localShippingFee) * (1 + priceInfo.marginRate / 100);
                    } else {
                        price = (priceInfo.priceCny * priceInfo.cnyRate) + priceInfo.localShippingFee + priceInfo.marginRate;
                    }

                    price = Math.round(price / wonType) * wonType;

                    option['priceCny'] = priceInfo.priceCny;
                    option['price'] = price;
                    option['stock'] = parseInt(optionInfo[0].quantity);
                    option['optionString'] = option['optionString'].slice(0, option['optionString'].length - 1);
                    option['name'] = option['name'].slice(0, option['name'].length - 2);

                    options.push(option);
                }
            });
        }

        const response = await gql(MUTATIONS.UPDATE_PRODUCT_OPTION, {
            id: this.itemInfo.items[index].id,
            productOption: options
        }, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        runInAction(() => {
            this.itemInfo.items[index].productOption = options.map((v: any, index: number) => {
                return {
                    ...v,

                    id: response.data.updateProductOption[index]
                }
            });

            const priceList = this.itemInfo.items[index].productOption.map((v: any) => v.price);

            if (priceList.length > 0) {
                const priceLowest = Math.min(...priceList);

                this.itemInfo.items[index].price = priceLowest;
                this.updateProductPrice(index);
            }
        });
    }

    toggleProductOption = async (value: boolean, index: number) => {
        const optionIds = this.itemInfo.items[index].productOption.map((v: any) => {
            v.isActive = value;

            return v.id;
        });

        this.updateManyProductOption(index, optionIds);
    }

    calcProductOptionPrice = async (offset: number, type: string, index: number, valueIndex: any, activeOnly: any) => {
        let options: any = null;

        runInAction(() => {
            options = this.itemInfo.items[index].productOption.map((v: any) => {
                let matched = true;

                if (valueIndex) {
                    if (
                        valueIndex !== v.optionValue1Id &&
                        valueIndex !== v.optionValue2Id &&
                        valueIndex !== v.optionValue3Id &&
                        valueIndex !== v.optionValue4Id &&
                        valueIndex !== v.optionValue5Id
                    ) {
                        matched = false;
                    }
                }

                if (matched) {
                    switch (type) {
                        case "addPrice": {
                            if (activeOnly && !v.isActive) {
                                break;
                            }

                            v.price += offset;

                            break;
                        }

                        case "subPrice": {
                            if (activeOnly && !v.isActive) {
                                break;
                            }

                            v.price -= offset;

                            break;
                        }

                        case "setPrice": {
                            if (activeOnly && !v.isActive) {
                                break;
                            }

                            v.price = offset;

                            break;
                        }

                        case "setStock": {
                            if (activeOnly && !v.isActive) {
                                break;
                            }

                            v.stock = offset;

                            break;
                        }

                        case "setActive": {
                            let active = Math.floor((v.price / this.itemInfo.items[index].price - 1) * 100);

                            if (active > offset) {
                                v.isActive = false;
                            } else {
                                v.isActive = true;
                            }

                            break;
                        }

                        default: break;
                    }
                }

                return {
                    productId: this.itemInfo.items[index].id,
                    optionValue1Id: v.optionValue1Id,
                    optionValue2Id: v.optionValue2Id,
                    optionValue3Id: v.optionValue3Id,
                    optionValue4Id: v.optionValue4Id,
                    optionValue5Id: v.optionValue5Id,
                    isActive: v.isActive,
                    taobaoSkuId: v.taobaoSkuId,
                    priceCny: v.priceCny,
                    price: v.price,
                    stock: v.stock,
                    optionString: v.optionString,
                    name: v.name,
                    defaultShippingFee: v.defaultShippingFee,
                };
            })

            if (!options) {
                return;
            }

            const priceList = this.itemInfo.items[index].productOption.filter((v: any) => v.isActive).map((v: any) => v.price)
            const priceLowest = Math.min(...priceList);

            this.itemInfo.items[index].price = priceLowest;
        });

        await this.updateProductPrice(index);

        const response = await gql(MUTATIONS.UPDATE_PRODUCT_OPTION, {
            id: this.itemInfo.items[index].id,
            productOption: options
        }, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        runInAction(() => {
            this.itemInfo.items[index].productOption = options.map((v: any, index: number) => {
                return {
                    ...v,

                    id: response.data.updateProductOption[index]
                }
            });
        });

        floatingToast('옵션세부정보가 저장되었습니다.', 'success');
    }

    updateProductOptionPrice = async (commonStore: any, data: any, index: number) => {
        let priceInfo: any = {
            cnyRate: this.itemInfo.items[index].cnyRate,
            marginRate: this.itemInfo.items[index].marginRate,
            marginUnitType: this.itemInfo.items[index].marginUnitType,
            shippingFee: this.itemInfo.items[index].shippingFee,
            localShippingFee: this.itemInfo.items[index].localShippingFee,
            localShippingCode: this.itemInfo.items[index].localShippingCode,
        }

        Object.assign(priceInfo, data);

        const response1 = await gql(MUTATIONS.UPDATE_MANY_PRODUCT_PRICE_BY_USER, {
            ...priceInfo,

            productIds: [this.itemInfo.items[index].id]
        }, false);

        if (response1.errors) {
            alert(response1.errors[0].message);

            return;
        }

        const originalPrice = this.itemInfo.items[index].activeTaobaoProduct.price;

        if (priceInfo.marginUnitType === 'PERCENT') {
            priceInfo.price = ((originalPrice * priceInfo.cnyRate) + priceInfo.localShippingFee) * (1 + priceInfo.marginRate / 100);
        } else {
            priceInfo.price = (originalPrice * priceInfo.cnyRate) + priceInfo.localShippingFee + priceInfo.marginRate;
        }

        const wonType = commonStore.user.userInfo.calculateWonType;

        priceInfo.price = Math.round(priceInfo.price / wonType) * wonType;

        let options: any = null;

        runInAction(() => {
            options = this.itemInfo.items[index].productOption.map((v: any) => {
                let optionPrice: any = null;

                if (priceInfo.marginUnitType === 'PERCENT') {
                    optionPrice = ((v.priceCny * priceInfo.cnyRate) + priceInfo.localShippingFee) * (1 + priceInfo.marginRate / 100);
                } else {
                    optionPrice = (v.priceCny * priceInfo.cnyRate) + priceInfo.localShippingFee + priceInfo.marginRate;
                }

                optionPrice = Math.round(optionPrice / wonType) * wonType;

                v.price = optionPrice ?? v.price;
                v.defaultShippingFee = priceInfo.localShippingFee;

                return {
                    productId: this.itemInfo.items[index].id,
                    optionValue1Id: v.optionValue1Id,
                    optionValue2Id: v.optionValue2Id,
                    optionValue3Id: v.optionValue3Id,
                    optionValue4Id: v.optionValue4Id,
                    optionValue5Id: v.optionValue5Id,
                    isActive: v.isActive,
                    taobaoSkuId: v.taobaoSkuId,
                    priceCny: v.priceCny,
                    price: v.price,
                    stock: v.stock,
                    optionString: v.optionString,
                    name: v.name,
                    defaultShippingFee: v.defaultShippingFee,
                };
            });

            const activeOptions = options.filter((v: any) => v.isActive);

            if (activeOptions.length > 0) {
                priceInfo.price = Math.min(...activeOptions.map((v: any) => v.price));
            }
        });

        if (!options) {
            return;
        }

        const response2 = await gql(MUTATIONS.UPDATE_PRODUCT_OPTION, {
            id: this.itemInfo.items[index].id,
            productOption: options
        }, false);

        if (response2.errors) {
            alert(response2.errors[0].message);

            return;
        }

        runInAction(() => {
            Object.assign(this.itemInfo.items[index], priceInfo);

            this.itemInfo.items[index].productOption = options.map((v: any, index: number) => {
                return {
                    ...v,

                    id: response2.data.updateProductOption[index]
                }
            });
        });

        floatingToast('가격정보가 저장되었습니다.', 'success');
    }

    updateProductOptionImage = async (data: any, index: number, nameIndex: number, valueIndex: number, base64: any) => {
        if (data.newImage) {
            let formData: any = new FormData();

            let operations = {
                "variables": {
                    "productOptionValueId": data.id,
                    "isActive": data.isActive,
                    "image": data.image,
                    "newImage": null
                },

                "query": MUTATIONS.SET_PRODUCT_OPTION_VALUE_BY_SOMEONE
            };

            let map = { "1": ["variables.newImage"] };

            formData.append('operations', JSON.stringify(operations));
            formData.append('map', JSON.stringify(map));
            formData.append('1', data.newImage, `${data.newImage.name.split(".")[0]}.${data.newImage.name.split(".")[1]}`);

            const response = await gql(null, formData, true);

            if (response.errors) {
                alert(response.errors[0].message);

                return;
            }

            this.itemInfo.items[index].productOptionName[nameIndex].productOptionValue[valueIndex].image = response.data.setProductOptionValueBySomeOne;
        } else {
            const response = await gql(MUTATIONS.SET_PRODUCT_OPTION_VALUE_BY_SOMEONE, {
                productOptionValueId: data.id,
                isActive: data.isActive,
                image: data.image,
            }, false);

            if (response.errors) {
                alert(response.errors[0].message);

                return;
            }

            this.itemInfo.items[index].productOptionName[nameIndex].productOptionValue[valueIndex].image = "";
        }

        floatingToast('옵션이미지정보가 저장되었습니다.', 'success');
    }

    setProductOptionValue = async (data: any, index: number, nameIndex: number, valueIndex: any) => {
        if (valueIndex === null) {
            this.itemInfo.items[index].productOptionName[nameIndex].productOptionValue = data;

            return;
        }

        this.itemInfo.items[index].productOptionName[nameIndex].productOptionValue[valueIndex] = data;
    }

    updateProductOptionValue = async (commonStore: any, index: number, nameIndex: number, valueIds: any) => {
        let values: any = [];

        this.itemInfo.items[index].productOptionName[nameIndex].productOptionValue.map((v: any) => {
            valueIds.map((w: any) => {
                if (v.id === w) {
                    values.push(v);
                }
            })
        })

        if (values.length > 1) {
            const response = await gql(MUTATIONS.UPDATE_MANY_PRODUCT_OPTION_VALUE, {
                data: values.map((v: any) => {
                    return {
                        productOptionValueId: v.id,
                        name: v.name
                    }
                })
            }, false);

            if (response.errors) {
                alert(response.errors[0].message);

                return;
            }
        } else {
            const response = await gql(MUTATIONS.SET_PRODUCT_OPTION_VALUE_BY_SOMEONE, {
                productOptionValueId: values[0].id,
                isActive: values[0].isActive,
                name: values[0].name,
            }, false);

            if (response.errors) {
                alert(response.errors[0].message);

                return;
            }
        }

        this.replaceProductOption(commonStore, index);

        floatingToast('옵션정보가 저장되었습니다.', 'success');
    }

    updateProductOptionValueAll = async (commonStore: any, data: any, index: number, nameIndex: number) => {
        this.itemInfo.items[index].productOptionName[nameIndex].productOptionValue.map((v: any) => {
            v.isActive = data.isActive;
        });

        const response = await gql(MUTATIONS.SET_PRODUCT_OPTION_VALUE_BY_SOMEONE, {
            productOptionNameId: data.id,
            isActive: data.isActive,
        }, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        this.replaceProductOption(commonStore, index);

        floatingToast('옵션정보가 저장되었습니다.', 'success');
    }

    updateProductOptionName = async (commonStore: any, data: any, index: number, nameIndex: number) => {
        this.itemInfo.items[index].productOptionName[nameIndex] = data;

        const response = await gql(MUTATIONS.SET_PRODUCT_OPTION_NAME_BY_SOMEONE, {
            productOptionNameId: data.id,
            isActive: data.isActive,
            name: data.name
        }, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        this.replaceProductOption(commonStore, index);

        floatingToast('옵션정보가 저장되었습니다.', 'success');
    }

    filterDescription = async (itemIndex: number, imageIndex: number) => {
        const imageList = this.itemInfo.items[itemIndex].descriptionImages.filter((v: any, i: number) => {
            if (i !== imageIndex) {
                return true;
            }

            const descHtml = new DOMParser().parseFromString(this.itemInfo.items[itemIndex].description, 'text/html');
            const descImages = descHtml.querySelectorAll('img');

            for (let j in descImages) {
                if (!descImages[j].src) {
                    continue;
                }

                if (descImages[j].src === v) {
                    descImages[j].remove();
                }
            }

            this.itemInfo.items[itemIndex].description = descHtml.body.outerHTML;

            return false;
        });

        this.itemInfo.items[itemIndex].descriptionImages = imageList;

        this.updateDescription(itemIndex);
    }

    setDescription = async (html: any, index: number) => {
        this.itemInfo.items[index].description = html;
    }

    switchDescription = async (src: number, dst: number, index: number) => {
        if (src === dst) {
            return;
        }

        const temp = [...this.itemInfo.items[index].descriptionImages];

        temp.splice(src, 1);

        if (dst >= 0) {
            temp.splice(dst, 0, this.itemInfo.items[index].descriptionImages[src]);
        }

        const descHtml = new DOMParser().parseFromString(this.itemInfo.items[index].description, 'text/html');
        const descImages = descHtml.querySelectorAll('img');

        temp.map((v: any, i: number) => {
            descImages[i].src = v;
        });

        this.itemInfo.items[index].description = descHtml.body.outerHTML;
        this.itemInfo.items[index].descriptionImages = temp;

        this.updateDescription(index);
    }

    updateDescription = async (index: number) => {
        const response = await gql(MUTATIONS.UPDATE_DESCRIPTION, {
            productId: this.itemInfo.items[index].id,
            description: this.itemInfo.items[index].description
        }, false)

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        floatingToast('상세페이지가 저장되었습니다.', 'success');
    }

    updateDescriptionImages = async (index: number) => {
        const response = await gql(MUTATIONS.UPDATE_DESCRIPTION, {
            productId: this.itemInfo.items[index].id,
            description: this.itemInfo.items[index].description
        }, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        if (response.data.updateDescription.includes("description.html")) {
            let descResp = await fetch(`${process.env.SELLFORYOU_MINIO_HTTPS}/${response.data.updateDescription}?${new Date().getTime()}`);
            let descText = await descResp.text();
            runInAction(() => {
                this.itemInfo.items[index].description = descText ? descText : this.itemInfo.items[index].description;
            });
        }

        const imageList: any = [];

        const descHtml = new DOMParser().parseFromString(this.itemInfo.items[index].description, 'text/html');
        const descImages = descHtml.querySelectorAll('img');

        for (let j in descImages) {
            if (!descImages[j].outerHTML) {
                continue;
            } else {
                imageList.push(descImages[j].src);
            }
        }

        this.itemInfo.items[index].descriptionImages = imageList;

        floatingToast('상세페이지이미지목록이 수정되었습니다.', 'success');
    }

    updateProductFee = async (data: any) => {
        const response = await gql(MUTATIONS.UPDATE_PRODUCT_FEE, data);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        floatingToast('오픈마켓수수료적용가가 저장되었습니다.', 'success');
    }

    setManyPriceInfo = async (data: any) => {
        this.manyPriceInfo = data;
    }

    setManyFeeInfo = async (data: any) => {
        this.manyFeeInfo = data;
    }

    setManyCategoryInfo = async (data: any) => {
        this.manyCategoryInfo = data;
    }

    setManyNameInfo = async (data: any) => {
        this.manyNameInfo = data;
    }

    setManyTagInfo = async (data: any) => {
        this.manyTagInfo = data;
    }

    updateManyPrice = async () => {
        let productIds: any = [];

        this.itemInfo.items.map((v: any) => {
            if (v.checked) {
                productIds.push(v.id);
            }
        });

        if (productIds.length < 1) {
            alert("상품이 선택되지 않았습니다.");

            return null;
        }

        if (this.manyPriceInfo.cnyRate <= 0) {
            alert("환율은 0 보다 큰 값으로 입력해주세요.");

            return;
        }

        if (this.manyPriceInfo.marginRate < 0) {
            alert("마진율은 0% 이상으로 입력해주세요.");

            return;
        }

        if (!this.manyPriceInfo.marginUnitType) {
            alert("마진단위를 선택해주세요.");

            return;
        }

        if (this.manyPriceInfo.localShippingFee < 0) {
            alert("해외배송비는 0원 이상으로 입력해주세요.");

            return;
        }

        if (this.manyPriceInfo.shippingFee < 0) {
            alert("유료배송비는 0원 이상으로 입력해주세요.");

            return;
        }

        const response = await gql(MUTATIONS.UPDATE_MANY_PRODUCT_PRICE_BY_USER, { ...this.manyPriceInfo, productIds }, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        floatingToast(`상품 ${productIds.length}개의 가격을 일괄설정하였습니다.`, 'success');

        this.toggleManyPriceModal(false);
        this.refreshProduct();
    }

    updateManyFee = async (ids: any) => {
        let productIds: any = [];

        if (ids) {
            productIds = ids;
        } else {
            this.itemInfo.items.map((v: any) => {
                if (v.checked) {
                    productIds.push(v.id);
                }
            });

            if (productIds.length < 1) {
                alert("상품이 선택되지 않았습니다.");

                return null;
            }
        }

        const response = await gql(MUTATIONS.UPDATE_MANY_PRODUCT_FEE, {
            productId: productIds,
            naverFee: this.manyFeeInfo.naverFee,
            coupangFee: this.manyFeeInfo.coupangFee,
            streetFee: this.manyFeeInfo.streetFee,
            streetNormalFee: this.manyFeeInfo.streetNormalFee,
            gmarketFee: this.manyFeeInfo.gmarketFee,
            auctionFee: this.manyFeeInfo.auctionFee,
            interparkFee: this.manyFeeInfo.interparkFee,
            wemakepriceFee: this.manyFeeInfo.wemakepriceFee,
            lotteonFee: this.manyFeeInfo.lotteonFee,
            lotteonNormalFee: this.manyFeeInfo.lotteonNormalFee,
            tmonFee: this.manyFeeInfo.tmonFee
        }, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        floatingToast(`상품 ${productIds.length}개의 수수료를 일괄설정하였습니다.`, 'success');

        this.toggleManyFeeModal(false);
        this.refreshProduct();
    }

    updateManyCategory = async (ids: any) => {
        let productIds: any = [];

        if (ids) {
            productIds = ids;
        } else {
            this.itemInfo.items.map((v: any) => {
                if (v.checked) {
                    productIds.push(v.id);
                }
            });

            if (productIds.length < 1) {
                alert("상품이 선택되지 않았습니다.");

                return null;
            }
        }

        const response = await gql(MUTATIONS.UPDATE_MANY_PRODUCT_CATEGORY_BY_USER, {
            productIds,
            categoryA077: this.manyCategoryInfo.categoryInfoA077.code,
            categoryB378: this.manyCategoryInfo.categoryInfoB378.code,
            categoryA112: this.manyCategoryInfo.categoryInfoA112.code,
            categoryA113: this.manyCategoryInfo.categoryInfoA113.code,
            categoryA006: this.manyCategoryInfo.categoryInfoA006.code,
            categoryA001: this.manyCategoryInfo.categoryInfoA001.code,
            categoryA027: this.manyCategoryInfo.categoryInfoA027.code,
            categoryB719: this.manyCategoryInfo.categoryInfoB719.code,
            categoryA524: this.manyCategoryInfo.categoryInfoA524.code,
            categoryA525: this.manyCategoryInfo.categoryInfoA525.code,
            categoryB956: this.manyCategoryInfo.categoryInfoB956.code,
        }, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        floatingToast(`상품 ${productIds.length}개의 카테고리를 일괄설정하였습니다.`, 'success');

        this.toggleManyCategoryModal(false);
        this.refreshProduct();
    }

    updateManyName = async (data: any) => {
        let productIds: any = [];

        this.itemInfo.items.map((v: any) => {
            if (v.checked) {
                productIds.push(v.id);
            }
        });

        if (productIds.length < 1) {
            alert("상품이 선택되지 않았습니다.");

            return null;
        }

        const response = await gql(MUTATIONS.UPDATE_MANY_PRODUCT_NAME_BY_USER, { ...data, productIds }, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        floatingToast(`상품 ${productIds.length}개의 상품명을 일괄설정하였습니다.`, 'success');

        this.toggleManyNameModal(false);
        this.refreshProduct();
    }

    updateManyTag = async () => {
        let productIds: any = [];

        this.itemInfo.items.map((v: any) => {
            if (v.checked) {
                productIds.push(v.id);
            }
        });

        if (productIds.length < 1) {
            alert("상품이 선택되지 않았습니다.");

            return null;
        }

        if (!this.manyTagInfo.immSearchTagsDisabled) {
            let output = "";

            let tagList: any = [];
            let addList = this.manyTagInfo.immSearchTags.replaceAll(" ", "").split(",") ?? [];

            let userResp = await fetch("https://sell.smartstore.naver.com/api/products?_action=create");
            let userJson = await userResp.json();

            if (userJson.error) {
                floatingToast('스마트스토어 로그인 후 이용해주세요.', 'warning');

                return;
            }

            let tagDataSet = await Promise.all(addList.filter((v: any) => v).map(async (v: any) => {
                const tagResp = await fetch(`https://sell.smartstore.naver.com/api/product/shared/is-restrict-tag?_action=isRestrictTag&tag=${encodeURI(v)}`);
                const tagJson = await tagResp.json();

                return {
                    tag: v,
                    restricted: tagJson.restricted
                }
            }));

            tagDataSet.map((v: any) => {
                if (tagList.length > 9) {
                    floatingToast('검색어는 최대 10개까지만 입력하실 수 있습니다.', 'information');

                    return;
                }

                if (tagList.find((w: any) => w === v.tag)) {
                    return;
                }

                if (v.restricted) {
                    floatingToast(`사용할 수 없는 검색어입니다. [${v.tag}]`, 'failed');

                    return;
                }

                tagList.push(v.tag);
            });

            tagList.map((v: any) => {
                output += `${v},`;
            });

            output = output.slice(0, output.length - 1);

            this.manyTagInfo.immSearchTags = output;
        }

        const response = await gql(MUTATIONS.UPDATE_MANY_PRODUCT_TAG_BY_USER, {
            searchTags: this.manyTagInfo.searchTagsDisabled ? null : this.manyTagInfo.searchTags,
            immSearchTags: this.manyTagInfo.immSearchTagsDisabled ? null : this.manyTagInfo.immSearchTags,

            productIds
        }, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        floatingToast(`상품 ${productIds.length}개의 검색어태그를 일괄설정하였습니다.`, 'success');

        this.toggleManyTagModal(false);
        this.refreshProduct();
    }

    updateMultipleProductName = async (data: any) => {
        data = data.filter((v: any, i: number) => {
            if (!v) {
                return false;
            }

            this.itemInfo.items[i].name = v.name;

            return true;
        });

        const response = await gql(MUTATIONS.UPDATE_MULTIPLE_PRODUCT_NAME_BY_USER, { data }, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        floatingToast(`상품 ${data.length}개의 상품명이 일괄변경되었습니다.`, 'success');

        this.toggleManyNameModal(false);
        this.refreshProduct();
    }

    toggleItemChecked = (index: number, value: boolean) => {
        this.itemInfo.items[index].checked = value;
    }

    toggleItemCheckedAll = (value: boolean) => {
        this.itemInfo.checkedAll = value;
        this.itemInfo.items.map((v: any) => {
            v.checked = value;
        });
    }

    toggleItemCollapse = (index: number) => {
        this.itemInfo.items[index].collapse = !this.itemInfo.items[index].collapse;
    }

    toggleUploadModal = async (index: number, value: boolean) => {
        this.uploadIndex = index;
        this.modalInfo.upload = value;
    }

    toggleUploadDisabledModal = async (index: number, value: boolean, commonStore: any) => {
        if (value) {
            if (index > -1) {
                commonStore.uploadDisabledInfo.markets.map((v: any) => {
                    const matched = this.itemInfo.items[index].activeProductStore.find((w: any) => w.siteCode === v.code);

                    v.disabled = !matched;
                    v.upload = matched;
                });
            } else {
                commonStore.uploadDisabledInfo.markets.map((v: any) => {
                    v.disabled = false;
                    v.upload = true;
                });
            }
        }

        this.uploadDisabledIndex = index;
        this.modalInfo.uploadDisabled = value;
    }

    toggleUploadFailedModal = async (index: number, value: boolean) => {
        if (index > -1) {
            this.uploadFailedIndex = index;
        }

        this.modalInfo.uploadFailed = value;
    }

    toggleDescriptionModal = (value: boolean, index: number) => {
        this.itemInfo.current = index;
        this.modalInfo.description = value;
    }

    toggleManyPriceModal = (value: boolean) => {
        this.modalInfo.price = value;
    }

    toggleManyFeeModal = (value: boolean) => {
        this.modalInfo.fee = value;
    }

    toggleManyCategoryModal = (value: boolean) => {
        this.modalInfo.category = value;
    }

    toggleManyNameModal = (value: boolean) => {
        this.modalInfo.name = value;
    }

    toggleManyTagModal = async (value: boolean) => {
        this.modalInfo.tag = value;
    }

    toggleSearchFilterModal = (value: boolean) => {
        this.modalInfo.userFilter = value;
    }

    toggleCollectExcelModal = (value: boolean) => {
        this.modalInfo.collectExcel = value;
    }

    toggleSearchFilter = () => {
        this.searchInfo.userFilter = !this.searchInfo.userFilter;
    }

    setSearchInfo = (data: any) => {
        this.searchInfo = data;
    }

    setSearchWhereAndInput = (where: any) => {
        this.searchInfo.whereInput.AND = where;
    }

    setSearchWhereOrInput = (where: any) => {
        this.searchInfo.whereInput.OR = where;
    }

    getSearchResult = () => {
        this.setSearchWhereAndInput([
            { state: { equals: this.state } },

            { categoryInfoA077: this.searchInfo.categoryInfo.code ? { code: { equals: this.searchInfo.categoryInfo.code } } : {} },

            { createdAt: this.searchInfo.collectedStart ? { gte: this.searchInfo.collectedStart } : {} },
            { createdAt: this.searchInfo.collectedEnd ? { lte: this.searchInfo.collectedEnd } : {} },

            { stockUpdatedAt: this.searchInfo.registeredStart ? { gte: this.searchInfo.registeredStart } : {} },
            { stockUpdatedAt: this.searchInfo.registeredEnd ? { lte: this.searchInfo.registeredEnd } : {} },

            { taobaoProduct: this.searchInfo.cnyPriceStart ? { price: { gte: this.searchInfo.cnyPriceStart } } : {} },
            { taobaoProduct: this.searchInfo.cnyPriceEnd ? { price: { lte: this.searchInfo.cnyPriceEnd } } : {} },

            { cnyRate: this.searchInfo.cnyRateStart ? { gte: this.searchInfo.cnyRateStart } : {} },
            { cnyRate: this.searchInfo.cnyRateEnd ? { lte: this.searchInfo.cnyRateEnd } : {} },

            { localShippingFee: this.searchInfo.localFeeStart ? { gte: this.searchInfo.localFeeStart } : {} },
            { localShippingFee: this.searchInfo.localFeeEnd ? { lte: this.searchInfo.localFeeEnd } : {} },

            { marginRate: this.searchInfo.marginRateStart ? { gte: this.searchInfo.marginRateStart } : {} },
            { marginRate: this.searchInfo.marginRateEnd ? { lte: this.searchInfo.marginRateEnd } : {} },

            { price: this.searchInfo.priceStart ? { gte: this.searchInfo.priceStart } : {} },
            { price: this.searchInfo.priceEnd ? { lte: this.searchInfo.priceEnd } : {} },

            { shippingFee: this.searchInfo.feeStart ? { gte: this.searchInfo.feeStart } : {} },
            { shippingFee: this.searchInfo.feeEnd ? { lte: this.searchInfo.feeEnd } : {} },

            { taobaoProduct: this.searchInfo.shopName === 'ALL' ? {} : { shopName: { equals: this.searchInfo.shopName } } },
            { taobaoProduct: this.searchInfo.hasVideo === 'ALL' ? {} : this.searchInfo.hasVideo === 'Y' ? { videoUrl: { not: { equals: null } } } : { videoUrl: { equals: null } } },

            {
                productStore: this.state === 6 ? {} : {
                    some: {
                        AND: [
                            { siteCode: this.searchInfo.marketName === 'ALL' ? {} : { equals: this.searchInfo.marketName } },
                            { state: this.searchInfo.hasRegistered === 'ALL' ? {} : this.searchInfo.hasRegistered === 'Y' ? { equals: 2 } : { not: { equals: 2 } } }
                        ]
                    }
                }
            }
        ]);

        switch (this.searchInfo.searchType) {
            case "ALL": {
                this.setSearchWhereOrInput([
                    { productCode: { contains: this.searchInfo.searchKeyword } },
                    { taobaoProduct: { name: { contains: this.searchInfo.searchKeyword } } },
                    { name: { contains: this.searchInfo.searchKeyword } },
                    { categoryInfoA077: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoB378: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoA112: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoA113: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoA006: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoA001: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoA027: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoB719: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoA524: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoA525: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoB956: { name: { contains: this.searchInfo.searchKeyword } } },
                    { taobaoProduct: { taobaoNumIid: { contains: this.searchInfo.searchKeyword } } },
                    { productStore: { some: { storeProductId: { contains: this.searchInfo.searchKeyword } } } }
                ]);

                break;
            }

            case "PCODE": {
                if (!this.searchInfo.searchKeyword.includes("SFY_")) {
                    alert("상품코드는 SFY_000 형식으로 입력해주세요.");

                    return;
                }
                let list: any = [];
                let parseList: any = [];

                list = this.searchInfo.searchKeyword.split(",");
                list.map((v: any) => {
                    if (!v.includes("SFY_")) { alert("모든 상품코드는 SFY_000 형식으로 입력해주세요."); return; }
                    parseList.push(parseInt(v.split("_")[1], 36));
                })

                this.setSearchWhereOrInput([{ id: { in: parseList } }]);

                break;
            }

            case "ONAME": {
                this.setSearchWhereOrInput([{ taobaoProduct: { name: { contains: this.searchInfo.searchKeyword } } }]);

                break;
            }

            case "NAME": {
                this.setSearchWhereOrInput([{ name: { contains: this.searchInfo.searchKeyword } }]);

                break;
            }

            case "CNAME": {
                this.setSearchWhereOrInput([
                    { categoryInfoA077: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoB378: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoA112: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoA113: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoA006: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoA001: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoA027: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoB719: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoA524: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoA525: { name: { contains: this.searchInfo.searchKeyword } } },
                    { categoryInfoB956: { name: { contains: this.searchInfo.searchKeyword } } }
                ]);

                break;
            }

            case "OID": {
                this.setSearchWhereOrInput([{ taobaoProduct: { taobaoNumIid: { contains: this.searchInfo.searchKeyword } } }]);

                break;
            }

            case "MID": {
                this.setSearchWhereOrInput([{ productStore: { some: { storeProductId: { contains: this.searchInfo.searchKeyword } } } }]);

                break;
            }
        }

        this.page = 1;

        this.getProduct(this.page);
    }

    switchTabs = (index: number, value: number) => {
        this.itemInfo.items[index].tabs = value;
    }

    addRegisteredQueue = (data: any) => {
        this.registeredInfo.wait.push(data);
    }

    addRegisteredSuccess = (data: any) => {
        this.registeredInfo.wait = this.registeredInfo.wait.filter((v: any) => {
            if (v.site_name === data.site_name && v.code === data.code) {
                return false;
            }

            return true;
        });

        this.registeredInfo.success.push(data);
    }

    addRegisteredFailed = (data: any) => {
        this.registeredInfo.wait = this.registeredInfo.wait.filter((v: any) => {
            if (v.site_name === data.site_name && v.code === data.code) {
                return false;
            }

            return true;
        });

        this.registeredInfo.failed.push(data);
    }

    disableItems = async (commonStore: any) => {
        let productIds: any = [];

        if (this.uploadDisabledIndex > -1) {
            this.itemInfo.items[this.uploadDisabledIndex].delete = true;

            productIds.push(this.itemInfo.items[this.uploadDisabledIndex].id);
        } else {
            this.itemInfo.items.map((v: any) => {
                if (v.checked) {
                    v.delete = true;

                    productIds.push(v.id);
                }
            });
        }

        if (productIds.length < 1) {
            alert("상품이 선택되지 않았습니다.");

            return;
        }

        const markets = commonStore.uploadDisabledInfo.markets.filter((v: any) => v.upload).map((v: any) => v.code);

        if (markets.length < 1) {
            alert("오픈마켓이 선택되지 않았습니다.");

            return;
        }

        const response = await gql(QUERIES.GET_REGISTER_PRODUCTS_DATA_BY_USER, { productIds, siteCode: markets });

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        const data = JSON.parse(response.data.getRegisterProductsDataByUser);

        await Promise.all([
            deleteSmartStore(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'A077')),
            deleteCoupang(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'B378')),
            deleteStreet(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'A112')),
            deleteStreet(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'A113')),
            deleteESMPlus(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'A006')),
            deleteESMPlus(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'A001')),
            deleteInterpark(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'A027')),
            deleteWemakeprice(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'B719')),
            deleteLotteon(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'A524')),
            deleteLotteon(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'A525')),
            deleteTmon(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'B956'))
        ]);

        // if (commonStore.uploadInfo.stopped) {
        //     alert("업로드가 중단되었습니다.");
        // }

        // this.clearDisabledConsoleText();
        this.refreshProduct();

        commonStore.initUploadDisabledMarketProgress();
        commonStore.setUploadable(true);
        commonStore.setStopped(true);
    }

    uploadItems = async (commonStore: any, edit: boolean) => {
        let productIds: any = [];

        if (this.uploadIndex > -1) {
            productIds.push(this.itemInfo.items[this.uploadIndex].id);
        } else {
            this.itemInfo.items.map((v: any) => {
                if (v.checked) {
                    productIds.push(v.id);
                }
            });
        }

        if (productIds.length < 1) {
            alert("상품이 선택되지 않았습니다.");

            return;
        }

        const markets = commonStore.uploadInfo.markets.filter((v: any) => v.upload).map((v: any) => v.code);

        if (markets.length < 1) {
            alert("오픈마켓이 선택되지 않았습니다.");

            return;
        }

        const response = await gql(QUERIES.GET_REGISTER_PRODUCTS_DATA_BY_USER, { productIds, siteCode: markets });

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        const data = JSON.parse(response.data.getRegisterProductsDataByUser);

        if (edit) {
            commonStore.setEditedUpload(true);

            this.addConsoleText('상품 수정을 시작합니다.');
        } else {
            commonStore.setEditedUpload(false);

            this.addConsoleText('상품 등록을 시작합니다.');
        }

        commonStore.setStopped(false);

        await Promise.all([
            uploadSmartStore(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'A077')),
            uploadCoupang(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'B378')),
            uploadStreet(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'A112')),
            uploadStreet(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'A113')),
            uploadESMPlus(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'A006')),
            uploadESMPlus(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'A001')),
            uploadInterpark(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'A027')),
            uploadWemakeprice(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'B719')),
            uploadLotteon(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'A524')),
            uploadLotteon(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'A525')),
            uploadTmon(this, commonStore, data.job_json_array.find((v: any) => v.DShopInfo.site_code === 'B956'))
        ]);

        if (commonStore.uploadInfo.stopped) {
            alert("업로드가 중단되었습니다.");
        }

        this.clearConsoleText();
        this.refreshProduct();

        commonStore.initUploadMarketProgress();
        commonStore.setUploadable(true);
        commonStore.setStopped(true);
    }

    addConsoleText = (text: string) => {
        const today = getClock();
        const result = `[${today.hh}:${today.mm}:${today.ss}] ${text}`;

        this.uploadConsole.push(result);
    }

    clearConsoleText = () => {
        this.uploadConsole = [];
    }

    updateCoupangUrl = (index: number, user: any) => {
        this.itemInfo.items[index].productStore.map(async (v: any) => {
            if (v.siteCode === 'B378' && v.state === 2) {
                if (v.storeProductId !== "0") {
                    window.open(v.storeUrl);

                    return;
                }

                const body = {
                    "accesskey": user.userInfo.coupangAccessKey,
                    "secretkey": user.userInfo.coupangSecretKey,

                    "path": `/v2/providers/seller_api/apis/api/v1/marketplace/seller-products/${v.etcVendorItemId}`,
                    "query": "",
                    "method": "GET",

                    "data": {}
                }

                const response = await coupangApiGateway(body);

                if (!response.data) {
                    alert(response.message);

                    return;
                }

                if (response.data.statusName !== '승인완료') {
                    alert(`상품이 현재 [${response.data.statusName}] 상태입니다.`);

                    return;
                }

                await gql(MUTATIONS.UPDATE_PRODUCT_STORE_URL_INFO_BY_SOMEONE, { productStoreId: v.id, storeProductId: response.data.productId.toString() });

                v.storeProductId = response.data.productId;
                v.storeUrl = `https://www.coupang.com/vp/products/${response.data.productId}`;

                window.open(v.storeUrl);
            }

            return;
        });
    }

    itemToExcel = () => {
        const excelData = this.itemInfo.items.map((v: any) => {
            const image = v.imageThumbnail[0]

            return {
                "상품명": v.name,
                "대표이미지": image,
                "구매처URL": v.activeTaobaoProduct.url,
                "상태": v.state === 6 ? "수집됨" : "등록됨",
                "도매가": v.activeTaobaoProduct.price,
                "판매가": v.price,
                "해외배송비": v.localShippingFee,
                "유료배송비": v.shippingFee,
                "상품코드": v.productCode,
                "수집일": new Date(v.createdAt),
                "등록일": new Date(v.stockUpdatedAt),
                "네이버검색태그": v.immSearchTags,
                "쿠팡검색태그": v.searchTags,
                "스마트스토어카테고리": v.categoryInfoA077.name,
                "쿠팡카테고리": v.categoryInfoB378.name,
                "11번가(글로벌)카테고리": v.categoryInfoA112.name,
                "11번가(일반)카테고리": v.categoryInfoA113.name,
                "지마켓카테고리": v.categoryInfoA006.name,
                "옥션카테고리": v.categoryInfoA001.name,
                "인터파크카테고리": v.categoryInfoA027.name,
                "위메프카테고리": v.categoryInfoB719.name,
                "롯데온(글로벌)카테고리": v.categoryInfoA524.name,
                "롯데온(일반)카테고리": v.categoryInfoA524.name,
                "티몬카테고리": v.categoryInfoB956.name,
                "스마트스토어등록여부": v.activeProductStore.find((v: any) => v.siteCode === 'A077') ? "Y" : "N",
                "쿠팡등록여부": v.activeProductStore.find((v: any) => v.siteCode === 'B378') ? "Y" : "N",
                "11번가(글로벌)등록여부": v.activeProductStore.find((v: any) => v.siteCode === 'A112') ? "Y" : "N",
                "11번가(일반)등록여부": v.activeProductStore.find((v: any) => v.siteCode === 'A113') ? "Y" : "N",
                "지마켓등록여부": v.activeProductStore.find((v: any) => v.siteCode === 'A006') ? "Y" : "N",
                "옥션등록여부": v.activeProductStore.find((v: any) => v.siteCode === 'A001') ? "Y" : "N",
                "인터파크등록여부": v.activeProductStore.find((v: any) => v.siteCode === 'A027') ? "Y" : "N",
                "위메프등록여부": v.activeProductStore.find((v: any) => v.siteCode === 'B719') ? "Y" : "N",
                "옷데온(글로벌)등록여부": v.activeProductStore.find((v: any) => v.siteCode === 'A524') ? "Y" : "N",
                "옷데온(일반)등록여부": v.activeProductStore.find((v: any) => v.siteCode === 'A525') ? "Y" : "N",
                "티몬등록여부": v.activeProductStore.find((v: any) => v.siteCode === 'B956') ? "Y" : "N",
            }
        });

        downloadExcel(excelData, '상품리스트', false);
    }

    refreshProduct = () => {
        this.getProduct(this.page);
    }

    initProductThumbnailImage = async (id: any, index: number) => {
        let accept = confirm("원본 이미지로 복구하시겠습니까?\n이미지 번역 등 수정한 정보는 사라집니다.");

        if (!accept) {
            return;
        }

        const response = await gql(MUTATIONS.INIT_PRODUCT_THUMBNAIL_IMAGE_BY_USER, { productId: id }, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        const thumbnailList = JSON.parse(response.data.initProductThumbnailImageByUser);

        this.itemInfo.items[index].imageThumbnail = thumbnailList;

        floatingToast('원본 이미지로 복구되었습니다.', 'success');
    }

    initProductOptionImage = async (id: any, index: number) => {
        let accept = confirm("원본 이미지로 복구하시겠습니까?\n이미지 번역 등 수정한 정보는 사라집니다.");

        if (!accept) {
            return;
        }

        const response = await gql(MUTATIONS.INIT_PRODUCT_OPTION_IMAGE_BY_USER, { productId: id }, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        const optionList = JSON.parse(response.data.initProductOptionImageByUser);

        this.itemInfo.items[index].productOptionName.map((v: any) => {
            const resultOptionName = optionList.find((w: any) => w.id === v.id)

            if (!resultOptionName) {
                return;
            }

            v.productOptionValue.map((x: any) => {
                const resultOptionValue = resultOptionName.optionValues.find((y: any) => y.id === x.id);

                if (!resultOptionValue) {
                    return;
                }

                x.image = resultOptionValue.img;
            })
        })

        floatingToast('원본 이미지로 복구되었습니다.', 'success');
    }

    initProductDescription = async (id: any, index: number) => {
        let accept = confirm("원본 상세페이지로 복구하시겠습니까?\n이미지 번역 등 수정한 정보는 사라집니다.");

        if (!accept) {
            return;
        }

        const response = await gql(MUTATIONS.INIT_PRODUCT_DESCRIPTION_BY_USER, { productId: id }, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        this.itemInfo.items[index].description = response.data.initProductDescriptionByUser;

        let descHtml: any = null;

        if (this.itemInfo.items[index].description.includes("description.html")) {
            let descResp = await fetch(`${process.env.SELLFORYOU_MINIO_HTTPS}/${this.itemInfo.items[index].description}?${new Date().getTime()}`);
            let descText = await descResp.text();

            descHtml = new DOMParser().parseFromString(descText, "text/html");

            runInAction(() => {
                this.itemInfo.items[index].description = descText ?? this.itemInfo.items[index].description;
            });
        } else {
            descHtml = new DOMParser().parseFromString(this.itemInfo.items[index].description, "text/html");
        }

        runInAction(() => {
            if (descHtml) {
                this.itemInfo.items[index].descriptionImages = [];

                const imageList: any = descHtml.querySelectorAll('img');

                for (let i in imageList) {
                    if (!imageList[i].src) {
                        continue;
                    }

                    this.itemInfo.items[index].descriptionImages.push(imageList[i].src);
                }
            }
        });

        floatingToast('원본 상세페이지로 복구되었습니다.', 'success');
    }

    updateImageTranslatedData = async (data: any) => {
        const product = this.itemInfo.items.find((v: any) => v.id === data.productId);

        product.imageThumbnail = product.imageThumbnail.map((v: any, i: number) => {
            const matched = data.thumbnails.find((w: any) => i === w.index);

            if (!matched) {
                return v;
            }

            return matched.newImage;
        });

        product.productOptionName.flatMap((v: any) => v.productOptionValue).map((v: any) => {
            const matched = data.optionValues.find((w: any) => w.id === v.id);

            if (!matched || !matched.newImage) {
                return;
            }

            v.image = matched.newImage;
        });

        if (data.description && data.description.includes("description.html")) {
            let descResp = await fetch(`${data.description}?${new Date().getTime()}`);
            let descText = await descResp.text();
            let descHtml = new DOMParser().parseFromString(descText, 'text/html');

            runInAction(() => {
                product.description = descText;

                if (descHtml) {
                    product.descriptionImages = [];

                    const imageList: any = descHtml.querySelectorAll('img');

                    for (let i in imageList) {
                        if (!imageList[i].src) {
                            continue;
                        }

                        product.descriptionImages.push(imageList[i].src);
                    }
                }
            });
        }

        floatingToast('이미지번역이 적용되었습니다.', 'success');
    }

    toggleAddOptionNameModal = (value: boolean) => {
        this.modalInfo.addOptionName = value;
    }

    toggleReplaceOptionNameModal = (value: boolean) => {
        this.modalInfo.replaceOptionName = value;
    }

    toggleETCPageSize = (value: boolean) => {
        this.etcPageSize = value;
    }

    checkErrorExist = async (index: number) => {
        let errorFound = false;

        this.itemInfo.items[index].error = true;

        this.itemInfo.items[index].optionPriceError = false;
        this.itemInfo.items[index].thumbnailImageError = false;
        this.itemInfo.items[index].optionImageError = false;
        this.itemInfo.items[index].descriptionImageError = false;

        this.itemInfo.items[index].imageCheckList = {};

        const activeProductOption = this.itemInfo.items[index].productOption.filter((v: any) => v.isActive);

        if (activeProductOption.length > 0) {
            const priceList = activeProductOption.map((v: any) => v.price);
            const price = Math.min(...priceList);

            if (price !== this.itemInfo.items[index].price) {
                this.itemInfo.items[index].optionPriceError = true;

                errorFound = true;
            }
        }

        await Promise.all(this.itemInfo.items[index].imageThumbnail.map(async (v: any) => {
            runInAction(() => {
                this.itemInfo.items[index].imageCheckList[v] = false;
            });

            const imageResp = await fetch(v);
            const imageBlob = await imageResp.blob();

            const image: any = await getImageMeta(v);

            runInAction(() => {
                if (image.width < 600) {
                    this.itemInfo.items[index].imageCheckList[v] = true;
                    this.itemInfo.items[index].thumbnailImageError = true;

                    errorFound = true;
                }

                if (image.height < 600) {
                    this.itemInfo.items[index].imageCheckList[v] = true;
                    this.itemInfo.items[index].thumbnailImageError = true;

                    errorFound = true;
                }

                switch (imageBlob.type) {
                    case "image/webp": {
                        break;
                    }

                    case "image/jpeg": {
                        if (!v.includes('jpg')) {
                            this.itemInfo.items[index].imageCheckList[v] = true;
                            this.itemInfo.items[index].thumbnailImageError = true;

                            errorFound = true;
                        }

                        break;
                    }

                    case "image/png": {
                        if (!v.includes('png')) {
                            this.itemInfo.items[index].imageCheckList[v] = true;
                            this.itemInfo.items[index].thumbnailImageError = true;

                            errorFound = true;
                        }

                        break;
                    }

                    default: {
                        this.itemInfo.items[index].imageCheckList[v] = true;
                        this.itemInfo.items[index].thumbnailImageError = true;

                        errorFound = true;

                        break;
                    }
                }
            });
        }));

        await Promise.all(this.itemInfo.items[index].productOptionName.flatMap((v: any) => v.productOptionValue).map(async (v: any) => {
            if (!v.image) {
                return;
            }

            runInAction(() => {
                this.itemInfo.items[index].imageCheckList[v.image] = false;
            });

            const imageResp = await fetch(v.image);
            const imageBlob = await imageResp.blob();

            runInAction(() => {
                switch (imageBlob.type) {
                    case "image/webp": {
                        break;
                    }

                    case "image/jpeg": {
                        if (!v.image.includes('jpg')) {
                            this.itemInfo.items[index].imageCheckList[v.image] = true;
                            this.itemInfo.items[index].optionImageError = true;

                            errorFound = true;
                        }

                        break;
                    }

                    case "image/png": {
                        if (!v.image.includes('png')) {
                            this.itemInfo.items[index].imageCheckList[v.image] = true;
                            this.itemInfo.items[index].optionImageError = true;

                            errorFound = true;
                        }

                        break;
                    }

                    default: {
                        this.itemInfo.items[index].imageCheckList[v.image] = true;
                        this.itemInfo.items[index].optionImageError = true;

                        errorFound = true;

                        break;
                    }
                }
            });
        }));

        await Promise.all(this.itemInfo.items[index].descriptionImages.map(async (v: any) => {
            runInAction(() => {
                this.itemInfo.items[index].imageCheckList[v] = false;
            });

            const imageResp = await fetch(v);
            const imageBlob = await imageResp.blob();

            runInAction(() => {
                switch (imageBlob.type) {
                    case "image/webp": {
                        break;
                    }

                    case "image/jpeg": {
                        if (!v.includes('jpg')) {
                            this.itemInfo.items[index].imageCheckList[v] = true;
                            this.itemInfo.items[index].descriptionImageError = true;

                            errorFound = true;
                        }

                        break;
                    }

                    case "image/png": {
                        if (!v.includes('png')) {
                            this.itemInfo.items[index].imageCheckList[v] = true;
                            this.itemInfo.items[index].descriptionImageError = true;

                            errorFound = true;
                        }

                        break;
                    }

                    default: {
                        this.itemInfo.items[index].imageCheckList[v] = true;
                        this.itemInfo.items[index].descriptionImageError = true;

                        errorFound = true;

                        break;
                    }
                }
            });
        }));

        runInAction(() => {
            this.itemInfo.items[index].error = false;

            if (errorFound) {
                floatingToast('에러가 발견되었습니다.', 'failed');

                this.itemInfo.items[index].collapse = true;
            } else {
                floatingToast('에러가 발견되지 않았습니다.', 'success');
            }
        });
    }

    updateProductAttribute = async (index: number, data: any) => {
        const response = await gql(MUTATIONS.UPDATE_PRODUCT_ATTRIBUTE_BY_USER, data, false);

        if (response.errors) {
            alert(response.errors[0].message);

            return;
        }

        runInAction(() => {
            this.itemInfo.items[index].brandName = data.brandName ?? this.itemInfo.items[index].brandName;
            this.itemInfo.items[index].manuFacturer = data.manufacturer ?? this.itemInfo.items[index].manuFacturer;
            this.itemInfo.items[index].modelName = data.modelName ?? this.itemInfo.items[index].modelName;
        });

        floatingToast('상품속성정보가 변경되었습니다.', 'success');
    }
}