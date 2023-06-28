const QUERIES = {
  SELECT_MY_INFO_BY_USER: `
        query {
            selectMyInfoByUser {
                id
                email
                password
                state
                credit
                createdToken
                refCode
                keywardMemo
                productCount

                purchaseInfo2 {
                    level
                    levelExpiredAt
                    history
                }

                connectedUsers {
                    id
                    email
                    master

                    purchaseInfo2 {
                        level
                        levelExpiredAt
                        history
                    }
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
                    cnyRateDollar
                    cnyRateEuro
                    cnyRateYen
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
                    useDetailInformation
                    orderToDeliveryName
                    orderToDeliveryMembership
                    orderToDeliveryMethod
                    collectCheckPosition
                    sillFromCategory
                    thumbnailRepresentNo
                }
            }
        }
    `,

  SELECT_MY_PRODUCT_IMAGES_BY_USER: `
        query ($where: ProductWhereInput, $orderBy: [ProductOrderByWithRelationInput!], $take: Int, $skip: Int, $cursor: ProductWhereUniqueInput) {
            selectMyProductByUser(where: $where, orderBy: $orderBy, take: $take, skip: $skip, cursor: $cursor) {
                id
                productCode
                imageThumbnail
            }
        }
    `,

  SELECT_MY_SIMPLE_PRODUCT_BY_USER: `
        query ($where: ProductWhereInput, $orderBy: [ProductOrderByWithRelationInput!], $take: Int, $skip: Int, $cursor: ProductWhereUniqueInput) {
            selectMyProductByUser(where: $where, orderBy: $orderBy, take: $take, skip: $skip, cursor: $cursor) {
                id
                imageThumbnail
                name
                productCode

                sillCodeA077
                sillCodeB378
                sillCodeA112
                sillCodeA027
                sillCodeA001
                sillCodeA006
                sillCodeB719
                sillCodeA113
                sillCodeA524
                sillCodeA525
                sillCodeB956
                
                sillDataA077
                sillDataB378
                sillDataA112
                sillDataA027
                sillDataA001
                sillDataA006
                sillDataB719
                sillDataA113
                sillDataA524
                sillDataA525
                sillDataB956
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
                isImageTranslated

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
                    cnt
                    inflow
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
                    cnt
                    inflow
                }

                categoryInfoA077 {
                    code
                    name

                    sillInfoA077 {
                        code
                        name
                        data
                    }

                    activeSillDataA077{
                        code
                        name
                        data
                    }
                }

                categoryInfoB378 {
                    code
                    name

                    sillInfoB378 {
                        code
                        name
                        data
                    }

                    activeSillDataB378 {
                        code
                        name
                        data
                    }
                }

                categoryInfoA112 {
                    code
                    name

                    sillInfoA112 {
                        code
                        name
                        data
                    }

                    activeSillDataA112 {
                        code
                        name
                        data
                    }
                }

                categoryInfoA113 {
                    code
                    name

                    sillInfoA113 {
                        code
                        name
                        data
                    }

                    activeSillDataA113 {
                        code
                        name
                        data
                    }
                }

                categoryInfoA006 {
                    code
                    name

                    sillInfoA006 {
                        code
                        name
                        data
                    }

                    activeSillDataA006 {
                        code
                        name
                        data
                    }
                }

                categoryInfoA001 {
                    code
                    name

                    sillInfoA001 {
                        code
                        name
                        data
                    }

                    activeSillDataA001 {
                        code
                        name
                        data
                    }
                }

                categoryInfoA027 {
                    code
                    name

                    sillInfoA027 {
                        code
                        name
                        data
                    }

                    activeSillDataA027 {
                        code
                        name
                        data
                    }
                }

                categoryInfoB719 {
                    code
                    name

                    sillInfoB719 {
                        code
                        name
                        data
                    }

                    activeSillDataB719 {
                        code
                        name
                        data
                    }
                }

                categoryInfoA524 {
                    code
                    name

                    sillInfoA524 {
                        code
                        name
                        data
                    }

                    activeSillDataA524 {
                        code
                        name
                        data
                    }
                }

                categoryInfoA525 {
                    code
                    name

                    sillInfoA525 {
                        code
                        name
                        data
                    }

                    activeSillDataA525 {
                        code
                        name
                        data
                    }
                }

                categoryInfoB956 {
                    code
                    name

                    sillInfoB956 {
                        code
                        name
                        data
                    }

                    activeSillDataB956 {
                        code
                        name
                        data
                    }
                }

                sillCodeA077
                sillCodeB378
                sillCodeA112
                sillCodeA027
                sillCodeA001
                sillCodeA006
                sillCodeB719
                sillCodeA113
                sillCodeA524
                sillCodeA525
                sillCodeB956
                
                sillDataA077
                sillDataB378
                sillDataA112
                sillDataA027
                sillDataA001
                sillDataA006
                sillDataB719
                sillDataA113
                sillDataA524
                sillDataA525
                sillDataB956
                myLock
                myKeyward
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
    `,

  SELECT_PRODUCT_VIEW_LOG_BY_USER: `
        mutation (
            $timeStart: String!
            $timeEnd: String!
        ) {
            selectProductViewLogByUser (
                timeStart: $timeStart
                timeEnd: $timeEnd
            )
        }
    `,

  SELECT_PRODUCT_VIEW_LOG_DATE_FILTER_BY_USER: `
        mutation (
            $productId: Int
            $productName: String
            $timeStart: String!
            $timeEnd: String!
        ) {
            selectProductViewLogDatefilterByUser (
                productId: $productId
                productName: $productName
                timeStart: $timeStart
                timeEnd: $timeEnd
            )
        }
    `,
};

export default QUERIES;
