const QUERIES = {
    SELECT_MY_INFO_BY_USER: `
        query {
            selectMyInfoByUser {
                id
                email
                password
                state
                credit
                
                purchaseInfo {
                    level
                    levelExpiredAt
                }

                productCount

                connectedUsers {
                    id
                    email
                    master
                }

                userInfo {
                    userId
                    phone
                    marginRate
                    defaultShippingFee
                    fixImageTop
                    fixImageSubTop
                    fixImageBottom
                    fixImageSubBottom
                    cnyRate
                    productCollectCount
                    maxProductLimit
                    additionalShippingFeeJeju
                    asTel
                    asInformation
                    refundShippingFee
                    exchangeShippingFee
                    naverOriginCode
                    naverOrigin
                    naverStoreUrl
                    naverStoreOnly
                    naverFee
                    naverAutoSearchTag
                    naverUseType
                    coupangOutboundShippingTimeDay
                    coupangUnionDeliveryType
                    coupangMaximumBuyForPerson
                    coupangLoginId
                    coupangVendorId
                    coupangAccessKey
                    coupangSecretKey
                    coupangImageOpt
                    coupangFee
                    coupangDefaultOutbound
                    coupangDefaultInbound
                    coupangUseType
                    streetApiKey
                    streetApiKey2
                    streetApiKey3
                    streetApiKey4
                    streetApiMemo
                    streetApiMemo2
                    streetApiMemo3
                    streetApiMemo4
                    streetUseKeyType
                    streetFee
                    streetUseType
                    streetDefaultOutbound
                    streetDefaultInbound
                    streetNormalApiKey
                    streetNormalApiKey2
                    streetNormalApiKey3
                    streetNormalApiKey4
                    streetNormalApiMemo
                    streetNormalApiMemo2
                    streetNormalApiMemo3
                    streetNormalApiMemo4
                    streetNormalUseKeyType
                    streetNormalOutbound
                    streetNormalInbound
                    streetNormalFee
                    streetNormalUseType
                    interparkCertKey
                    interparkSecretKey
                    interparkEditCertKey
                    interparkEditSecretKey
                    interparkFee
                    interparkUseType
                    esmplusMasterId
                    esmplusAuctionId
                    esmplusGmarketId
                    gmarketFee
                    gmarketUseType
                    auctionFee
                    auctionUseType
                    lotteonVendorId
                    lotteonApiKey
                    lotteonFee
                    lotteonUseType
                    lotteonNormalFee
                    lotteonNormalUseType
                    lotteonSellerType
                    wemakepriceId
                    wemakepriceFee
                    wemakepriceUseType
                    tmonId
                    tmonFee
                    tmonUseType
                    optionAlignTop
                    optionTwoWays
                    optionIndexType
                    discountAmount
                    discountUnitType
                    descriptionShowTitle
                    collectTimeout
                    collectStock
                    marginUnitType
                    extraShippingFee
                    autoPrice
                    defaultPrice
                    calculateWonType
                }
            }
        }
    `,

    SELECT_MY_PRODUCT_BY_USER: `
        query ($where: ProductWhereInput, $orderBy: [ProductOrderByWithRelationInput!], $take: Int, $skip: Int, $cursor: ProductWhereUniqueInput) {
            selectMyProductByUser(where: $where, orderBy: $orderBy, take: $take, skip: $skip, cursor: $cursor) {
                id
                createdAt
                modifiedAt
                stockUpdatedAt
                cnyRate
                description
                imageThumbnail
                localShippingFee
                marginRate
                marginUnitType
                modifiedAt
                name
                productCode
                price
                state
                shippingFee
                searchTags
                immSearchTags
                naverFee
                coupangFee
                streetFee
                streetNormalFee
                gmarketFee
                auctionFee
                interparkFee
                wemakepriceFee
                lotteonFee
                lotteonNormalFee
                tmonFee
                brandName
                manuFacturer
                modelName
                attribute

                activeTaobaoProduct {
                    name
                    originalData
                    price
                    videoUrl
                    shopName
                    url
                }

                productOption {
                    id
                    productId
                    optionValue1Id
                    optionValue2Id
                    optionValue3Id
                    optionValue4Id
                    optionValue5Id
                    name
                    isActive
                    taobaoSkuId
                    priceCny
                    price
                    stock
                    optionString
                    defaultShippingFee
                }

                productOptionName {
                    id
                    productId
                    order
                    name
                    isNameTranslated
                    taobaoPid
                    isActive
                    productOptionValue {
                        id
                        productOptionNameId
                        optionNameOrder
                        name
                        isNameTranslated
                        taobaoVid
                        image
                        number
                        isActive
                        originalName
                    }
                }

                activeProductStore {
                    id
                    siteCode
                    state
                    storeProductId
                    productStoreLog {
                        createdAt
                        errorMessage
                    }
                    etcVendorItemId
                    storeUrl
                    connectedAt
                }

                productStore {
                    id
                    siteCode
                    state
                    storeProductId
                    productStoreLog {
                        createdAt
                        errorMessage
                    }
                    etcVendorItemId
                    storeUrl
                    connectedAt
                }

                categoryInfoA077 {
                    code
                    name
                }

                categoryInfoB378 {
                    code
                    name
                }

                categoryInfoA112 {
                    code
                    name
                }

                categoryInfoA113 {
                    code
                    name
                }

                categoryInfoA006 {
                    code
                    name
                }

                categoryInfoA001 {
                    code
                    name
                }

                categoryInfoA027 {
                    code
                    name
                }

                categoryInfoB719 {
                    code
                    name
                }

                categoryInfoA524 {
                    code
                    name
                }

                categoryInfoA525 {
                    code
                    name
                }

                categoryInfoB956 {
                    code
                    name
                }
            }
        }
    `,

    SELECT_MY_PRODUCT_COUNT_BY_USER: `
        query ($where: ProductWhereInput) {
            selectMyProductsCountByUser(where: $where)
        }
    `,

    SELECT_NOTICES_BY_EVERYONE: `
        query ($where: NoticeWhereInput, $orderBy: [NoticeOrderByWithRelationInput!], $take: Int, $skip: Int, $cursor: NoticeWhereUniqueInput) {
            selectNoticesByEveryone(where: $where, orderBy: $orderBy, take: $take, skip: $skip, cursor: $cursor) {
                id
                title
                content
                createdAt
            }
        }
    `,

    GET_REGISTER_PRODUCTS_DATA_BY_USER: `
        query ($productIds: [Int!]!, $siteCode: [String!]!) {
            getRegisterProductsDataByUser(productIds: $productIds, siteCode: $siteCode)
        }
    `,

    SEARCH_CATEGORY_INFO_A077_BY_CODE: `
        query ($code: String) {
            searchCategoryInfoA077BySomeone(code: $code) {
                code
                name

                categoryInfoB378 {
                    code
                    name
                }

                categoryInfoA112 {
                    code
                    name
                }

                categoryInfoA113 {
                    code
                    name
                }

                categoryInfoA006 {
                    code
                    name
                }

                categoryInfoA001 {
                    code
                    name
                }

                categoryInfoA027 {
                    code
                    name
                }

                categoryInfoB719 {
                    code
                    name
                }

                categoryInfoA524 {
                    code
                    name
                }

                categoryInfoA525 {
                    code
                    name
                }

                categoryInfoB956 {
                    code
                    name
                }
            }
        }
    `,

    SEARCH_MANY_CATEGORY_INFO_A077_BY_SOMEONE: `
        query ($code: [String!]!) {
            searchManyCategoryInfoA077BySomeone(code: $code) {
                code
                name
            }
        }
    `,

    SEARCH_CATEGORY_INFO_A077_BY_SOMEONE: `
        query ($code: String) {
            searchCategoryInfoA077BySomeone(code: $code) {
                code
                name
            }
        }
    `,

    SEARCH_CATEGORY_INFO_B378_BY_SOMEONE: `
        query ($code: String) {
            searchCategoryInfoB378BySomeone(code: $code) {
                code
                name
            }
        }
    `,

    SEARCH_CATEGORY_INFO_A112_BY_SOMEONE: `
        query ($code: String) {
            searchCategoryInfoA112BySomeone(code: $code) {
                code
                name
            }
        }
    `,

    SEARCH_CATEGORY_INFO_A113_BY_SOMEONE: `
        query ($code: String) {
            searchCategoryInfoA113BySomeone(code: $code) {
                code
                name
            }
        }
    `,

    SEARCH_CATEGORY_INFO_A006_BY_SOMEONE: `
        query ($code: String) {
            searchCategoryInfoA006BySomeone(code: $code) {
                code
                name
            }
        }
    `,

    SEARCH_CATEGORY_INFO_A001_BY_SOMEONE: `
        query ($code: String) {
            searchCategoryInfoA001BySomeone(code: $code) {
                code
                name
            }
        }
    `,

    SEARCH_CATEGORY_INFO_A027_BY_SOMEONE: `
        query ($code: String) {
            searchCategoryInfoA027BySomeone(code: $code) {
                code
                name
            }
        }
    `,

    SEARCH_CATEGORY_INFO_B719_BY_SOMEONE: `
        query ($code: String) {
            searchCategoryInfoB719BySomeone(code: $code) {
                code
                name
            }
        }
    `,

    SEARCH_CATEGORY_INFO_A524_BY_SOMEONE: `
        query ($code: String) {
            searchCategoryInfoA524BySomeone(code: $code) {
                code
                name
            }
        }
    `,

    SEARCH_CATEGORY_INFO_A525_BY_SOMEONE: `
        query ($code: String) {
            searchCategoryInfoA525BySomeone(code: $code) {
                code
                name
            }
        }
    `,

    SEARCH_CATEGORY_INFO_B956_BY_SOMEONE: `
        query ($code: String) {
            searchCategoryInfoB956BySomeone(code: $code) {
                code
                name
            }
        }
    `,

    SELECT_WORD_TABLES_BY_SOMEONE: `
        query (
            $where: WordTableWhereInput,
            $orderBy: [WordTableOrderByWithRelationInput!],
            $take: Int,
            $skip: Int,
            $cursor: WordTableWhereUniqueInput
        ) {
            selectWordTablesBySomeone(
                where: $where
                orderBy: $orderBy
                take: $take
                skip: $skip
                cursor: $cursor
            ) {
                id
                findWord
                replaceWord
            }
        }
    `,

    SELECT_MY_ORDER_BY_USER: `
        query (
            $where: orderWhereInput
            $orderBy: [orderOrderByWithRelationInput!]
            $take: Int
            $skip: Int
            $cursor: orderWhereUniqueInput
        ) {
            selectMyOrderByUser(
                where: $where
                orderBy: $orderBy
                take: $take
                skip: $skip
                cursor: $cursor
            ) {
                productId
                marketCode
                orderNo
                taobaoOrderNo
                productName
                orderQuantity
                productOptionContents
                sellerProductManagementCode
                orderMemberName
                orderMemberTelNo
                productPayAmt
                deliveryFeeAmt
                individualCustomUniqueCode
                receiverName
                receiverTelNo1
                receiverIntegratedAddress
                receiverZipCode
                productOrderMemo
            }
        }
    `,

    SELECT_EXIST_PURCHASE_LOG: `
        query (
            $email: String!
        ) {
            seletExistPurchaseLog (
                email: $email
            )
        }
    `
}

export default QUERIES;