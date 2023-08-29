const MUTATIONS = {
	// 로그인
	SIGN_IN_USER_BY_EVERYONE: `
        mutation ($id: String!, $pw: String!) {
            signInUserByEveryone(userType: EMAIL, email: $id, password: $pw) {
                accessToken
                refreshToken
            }
        }
    `,
	// 로그아웃
	SIGN_OUT_USER_BY_EVERYONE: `
        mutation {
            signOutUserByEveryone
        }
    `,

	// 회원가입
	SIGN_UP_USER_BY_EVERYONE: `
        mutation ($email: String!, $password: String!, $phone: String!, $refCode: String) {
            signUpUserByEveryone2(email: $email, password: $password, phone: $phone, verificationId: 0, refCode: $refCode)
        }
    `,

	// 인증번호요청
	REQUEST_PHONE_VERIFICATION_BY_EVERYONE: `
        mutation ($phoneNumber: String!) {
            requestPhoneVerificationByEveryone(phoneNumber: $phoneNumber)
        }
    `,

	// 인증하기
	VERIFY_PHONE_BY_EVERYONE: `
        mutation ($phoneNumber: String!, $verificationNumber: String!) {
            verifyPhoneByEveryone(phoneNumber: $phoneNumber, verificationNumber: $verificationNumber)
        }
    `,

	// 내정보 수정
	UPDATE_MY_DATA_BY_USER: `
        mutation (
            $marginRate: Float
            $defaultShippingFee: Int
            $fixImageTop: Upload
            $fixImageSubTop: Upload
            $fixImageBottom: Upload
            $fixImageSubBottom: Upload
            $cnyRate: Float
            $cnyRateDollar: Float
            $cnyRateYen: Float
            $cnyRateEuro: Float
            $additionalShippingFeeJeju: Int
            $asTel: String
            $asInformation: String
            $refundShippingFee: Int
            $exchangeShippingFee: Int
            $naverOriginCode: String
            $naverOrigin: String
            $naverStoreUrl: String
            $naverStoreOnly: String
            $naverFee: Float
            $coupangOutboundShippingTimeDay: Int
            $coupangUnionDeliveryType: String
            $coupangMaximumBuyForPerson: Int
            $coupangLoginId: String
            $coupangVendorId: String
            $coupangAccessKey: String
            $coupangSecretKey: String
            $coupangImageOpt: String
            $coupangFee: Float
            $coupangDefaultOutbound: String
            $coupangDefaultInbound: String
            $streetApiKey: String
            $streetApiKey2: String
            $streetApiKey3: String
            $streetApiKey4: String
            $streetApiMemo: String
            $streetApiMemo2: String
            $streetApiMemo3: String
            $streetApiMemo4: String
            $streetUseKeyType: String
            $streetFee: Float
            $streetNormalApiKey: String
            $streetNormalApiKey2: String
            $streetNormalApiKey3: String
            $streetNormalApiKey4: String
            $streetNormalApiMemo: String
            $streetNormalApiMemo2: String
            $streetNormalApiMemo3: String
            $streetNormalApiMemo4: String
            $streetNormalUseKeyType: String
            $streetDefaultOutbound: String
            $streetDefaultInbound: String
            $streetNormalOutbound: String
            $streetNormalInbound: String
            $streetNormalFee: Float
            $interparkCertKey: String
            $interparkSecretKey: String
            $interparkEditCertKey: String
            $interparkEditSecretKey: String
            $interparkFee: Float
            $esmplusMasterId: String
            $esmplusAuctionId: String
            $esmplusGmarketId: String
            $gmarketFee: Float
            $auctionFee: Float
            $lotteonVendorId: String
            $lotteonApiKey: String
            $lotteonFee: Float
            $lotteonNormalFee: Float
            $wemakepriceId: String
            $wemakepriceFee: Float
            $tmonId: String
            $tmonFee: Float
            $optionAlignTop: String
            $optionTwoWays: String
            $optionIndexType: Int
            $discountAmount: Int
            $discountUnitType: String
            $descriptionShowTitle: String
            $collectTimeout: Int
            $collectStock: Int
            $marginUnitType: String
            $extraShippingFee: Int
            $streetUseType: String
            $lotteonUseType: String
            $naverAutoSearchTag: String
            $naverUseType: String
            $coupangUseType: String
            $streetNormalUseType: String
            $gmarketUseType: String
            $auctionUseType: String
            $interparkUseType: String
            $wemakepriceUseType: String
            $lotteonNormalUseType: String
            $tmonUseType: String
            $lotteonSellerType: String
            $autoPrice: String
            $defaultPrice: String
            $calculateWonType: String
            $useDetailInformation: String
            $orderToDeliveryName: String
            $orderToDeliveryMembership: String
            $orderToDeliveryMethod: String
            $collectCheckPosition: String
            $sillFromCategory: String
            $thumbnailRepresentNo: String
        ) {
            updateMyDataByUser(
                marginRate: $marginRate
                defaultShippingFee: $defaultShippingFee
                fixImageTop: $fixImageTop
                fixImageSubTop: $fixImageSubTop
                fixImageBottom: $fixImageBottom
                fixImageSubBottom: $fixImageSubBottom
                cnyRate: $cnyRate
                cnyRateDollar: $cnyRateDollar
                cnyRateYen: $cnyRateYen
                cnyRateEuro: $cnyRateEuro
                additionalShippingFeeJeju: $additionalShippingFeeJeju
                asTel: $asTel
                asInformation: $asInformation
                refundShippingFee: $refundShippingFee
                exchangeShippingFee: $exchangeShippingFee
                naverOriginCode: $naverOriginCode
                naverOrigin: $naverOrigin
                naverStoreUrl: $naverStoreUrl
                naverStoreOnly: $naverStoreOnly
                naverFee: $naverFee
                coupangOutboundShippingTimeDay: $coupangOutboundShippingTimeDay
                coupangUnionDeliveryType: $coupangUnionDeliveryType
                coupangMaximumBuyForPerson: $coupangMaximumBuyForPerson
                coupangLoginId: $coupangLoginId
                coupangVendorId: $coupangVendorId
                coupangAccessKey: $coupangAccessKey
                coupangSecretKey: $coupangSecretKey
                coupangImageOpt: $coupangImageOpt
                coupangFee: $coupangFee
                coupangDefaultOutbound: $coupangDefaultOutbound
                coupangDefaultInbound: $coupangDefaultInbound
                streetApiKey: $streetApiKey
                streetApiKey2: $streetApiKey2
                streetApiKey3: $streetApiKey3
                streetApiKey4: $streetApiKey4
                streetApiMemo: $streetApiMemo
                streetApiMemo2: $streetApiMemo2
                streetApiMemo3: $streetApiMemo3
                streetApiMemo4: $streetApiMemo4
                streetUseKeyType: $streetUseKeyType
                streetFee: $streetFee
                streetNormalApiKey: $streetNormalApiKey
                streetNormalApiKey2: $streetNormalApiKey2
                streetNormalApiKey3: $streetNormalApiKey3
                streetNormalApiKey4: $streetNormalApiKey4
                streetNormalApiMemo: $streetNormalApiMemo
                streetNormalApiMemo2: $streetNormalApiMemo2
                streetNormalApiMemo3: $streetNormalApiMemo3
                streetNormalApiMemo4: $streetNormalApiMemo4
                streetNormalUseKeyType: $streetNormalUseKeyType
                streetDefaultOutbound: $streetDefaultOutbound
                streetDefaultInbound: $streetDefaultInbound
                streetNormalOutbound: $streetNormalOutbound
                streetNormalInbound: $streetNormalInbound
                streetNormalFee: $streetNormalFee
                interparkCertKey: $interparkCertKey
                interparkSecretKey: $interparkSecretKey
                interparkEditCertKey: $interparkEditCertKey
                interparkEditSecretKey: $interparkEditSecretKey 
                interparkFee: $interparkFee
                esmplusMasterId: $esmplusMasterId
                esmplusAuctionId: $esmplusAuctionId
                esmplusGmarketId: $esmplusGmarketId
                gmarketFee: $gmarketFee
                auctionFee: $auctionFee
                lotteonVendorId: $lotteonVendorId
                lotteonApiKey: $lotteonApiKey
                lotteonFee: $lotteonFee
                lotteonNormalFee: $lotteonNormalFee
                wemakepriceId: $wemakepriceId
                wemakepriceFee: $wemakepriceFee
                tmonId: $tmonId
                tmonFee: $tmonFee
                optionAlignTop: $optionAlignTop
                optionTwoWays: $optionTwoWays
                optionIndexType: $optionIndexType
                discountAmount: $discountAmount
                discountUnitType: $discountUnitType
                descriptionShowTitle: $descriptionShowTitle
                collectTimeout: $collectTimeout
                collectStock: $collectStock
                marginUnitType: $marginUnitType
                extraShippingFee: $extraShippingFee
                streetUseType: $streetUseType
                lotteonUseType: $lotteonUseType
                naverAutoSearchTag: $naverAutoSearchTag
                naverUseType: $naverUseType
                coupangUseType: $coupangUseType
                streetNormalUseType: $streetNormalUseType
                gmarketUseType: $gmarketUseType
                auctionUseType: $auctionUseType
                interparkUseType: $interparkUseType
                wemakepriceUseType: $wemakepriceUseType
                lotteonNormalUseType: $lotteonNormalUseType
                tmonUseType: $tmonUseType
                lotteonSellerType: $lotteonSellerType
                autoPrice: $autoPrice
                defaultPrice: $defaultPrice
                calculateWonType: $calculateWonType
                useDetailInformation: $useDetailInformation
                orderToDeliveryName: $orderToDeliveryName
                orderToDeliveryMembership: $orderToDeliveryMembership
                orderToDeliveryMethod: $orderToDeliveryMethod
                collectCheckPosition: $collectCheckPosition
                sillFromCategory: $sillFromCategory
                thumbnailRepresentNo: $thumbnailRepresentNo
            )
        }
    `,

	UPDATE_MY_IMAGE_URL_BY_USER: `
        mutation ($fixImageTop: String, $fixImageSubTop: String, $fixImageBottom: String, $fixImageSubBottom: String) {
            updateMyImageByUser(fixImageTop: $fixImageTop, fixImageSubTop: $fixImageSubTop, fixImageBottom: $fixImageBottom, fixImageSubBottom: $fixImageSubBottom)
        }   
    `,

	SILENT_REFRESH_TOKEN: `
        mutation ($refreshToken: String!) {
            silentRefreshToken(refreshToken: $refreshToken) {
                accessToken
                refreshToken
            }
        }
    `,

	SET_PRODUCT_OPTION_NAME_BY_SOMEONE: `
        mutation ($productOptionNameId: Int!, $isActive: Boolean!, $name: String!) {
            setProductOptionNameBySomeOne(productOptionNameId: $productOptionNameId, isActive: $isActive, name: $name)
        }
    `,

	SET_PRODUCT_OPTION_VALUE_BY_SOMEONE: `
        mutation (
            $productOptionNameId: Int, 
            $productOptionValueId: Int, 
            $isActive: Boolean!, 
            $name: String, 
            $image: String, 
            $newImage: Upload
        ) {
            setProductOptionValueBySomeOne(
                productOptionNameId: $productOptionNameId, 
                productOptionValueId: $productOptionValueId, 
                isActive: $isActive, 
                name: $name, 
                image: $image, 
                newImage: $newImage
            )
        }
    `,

	UPDATE_PRODUCT_OPTION: `
        mutation ($id: Int!, $productOption: [setProductOption!]!) {
            updateProductOption(id: $id, productOption: $productOption)
        }
    `,

	DELETE_PRODUCT_BY_USER: `
        mutation ($productId: [Int!]!) {
            deleteProductByUser(productId: $productId)
        }
    `,

	GET_TAOBAO_ITEM_USING_EXTENSION_BY_USER: `
        mutation ($data: String!) {
            getTaobaoItemUsingExtensionByUser(data: $data)
        }
    `,

	UPDATE_PRODUCT_STORE_URL_INFO_BY_SOMEONE: `
        mutation ($productStoreId: Int!, $storeProductId: String!) {
            updateProductStoreUrlInfoBySomeone(productStoreId: $productStoreId, storeProductId: $storeProductId)
        }
    `,

	UPDATE_PRODUCT_NAME_BY_USER: `
        mutation ($productId: Int!, $name: String!) {
            updateProductNameByUser(productId: $productId, name: $name)
        }
    `,

	UPDATE_MULTIPLE_PRODUCT_NAME_BY_USER: `
        mutation($data: [ProductOptionNameInput!]!) {
            updateMultipleProductNameByUser(data: $data)
        }
    `,

	UPDATE_PRODUCT_TAG_BY_USER: `
        mutation ($productId: Int!, $searchTags: String, $immSearchTags: String) {
            updateProductTagByUser(productId: $productId, searchTags: $searchTags, immSearchTags: $immSearchTags)
        }
    `,

	UPDATE_PRODUCT_CATEGORY: `
        mutation (
            $productId: Int!,
            $categoryA077: String,
            $categoryB378: String,
            $categoryA112: String,
            $categoryA027: String,
            $categoryA001: String,
            $categoryA006: String,
            $categoryB719: String,
            $categoryA113: String,
            $categoryA524: String,
            $categoryA525: String,
            $categoryB956: String
        ) {
            updateProductCategory2(
                productId: $productId,
                categoryA077: $categoryA077,
                categoryB378: $categoryB378,
                categoryA112: $categoryA112,
                categoryA027: $categoryA027,
                categoryA001: $categoryA001,
                categoryA006: $categoryA006,
                categoryB719: $categoryB719,
                categoryA113: $categoryA113,
                categoryA524: $categoryA524,
                categoryA525: $categoryA525,
                categoryB956: $categoryB956
            )
        }
    `,

	UPDATE_PRODUCT_FEE: `
        mutation (
            $productId: Int!,
            $naverFee: Float,
            $coupangFee: Float,
            $streetFee: Float,
            $streetNormalFee: Float,
            $gmarketFee: Float,
            $auctionFee: Float,
            $interparkFee: Float,
            $wemakepriceFee: Float,
            $lotteonFee: Float,
            $lotteonNormalFee: Float,
            $tmonFee: Float
        ) {
            updateProductFee(
                productId: $productId,
                naverFee: $naverFee,
                coupangFee: $coupangFee,
                streetFee: $streetFee,
                streetNormalFee: $streetNormalFee,
                gmarketFee: $gmarketFee,
                auctionFee: $auctionFee,
                interparkFee: $interparkFee,
                wemakepriceFee: $wemakepriceFee,
                lotteonFee: $lotteonFee,
                lotteonNormalFee: $lotteonNormalFee,
                tmonFee: $tmonFee
            )
        }
    `,

	UPDATE_MANY_PRODUCT_PRICE_BY_USER: `
        mutation (
            $productIds: [Int!]!,
            $cnyRate: Float!,
            $marginRate: Float!,
            $marginUnitType: String!,
            $shippingFee: Int!,
            $localShippingFee: Int!,
            $localShippingCode: Int
        ) {
            updateProductPriceByUser(
                productIds: $productIds,
                cnyRate: $cnyRate,
                marginRate: $marginRate,
                marginUnitType: $marginUnitType,
                shippingFee: $shippingFee,
                localShippingFee: $localShippingFee,
                localShippingCode: $localShippingCode
            )
        }
    `,

	UPDATE_MANY_PRODUCT_FEE: `
        mutation (
            $productId: [Int!]!,
            $naverFee: Float,
            $coupangFee: Float,
            $streetFee: Float,
            $streetNormalFee: Float,
            $gmarketFee: Float,
            $auctionFee: Float,
            $interparkFee: Float,
            $wemakepriceFee: Float,
            $lotteonFee: Float,
            $lotteonNormalFee: Float,
            $tmonFee: Float,
        ) {
            updateManyProductFee(
                productId: $productId,
                naverFee: $naverFee,
                coupangFee: $coupangFee,
                streetFee: $streetFee,
                streetNormalFee: $streetNormalFee,
                gmarketFee: $gmarketFee,
                auctionFee: $auctionFee,
                interparkFee: $interparkFee,
                wemakepriceFee: $wemakepriceFee,
                lotteonFee: $lotteonFee,
                lotteonNormalFee: $lotteonNormalFee,
                tmonFee: $tmonFee
            )
        }
    `,

	UPDATE_MANY_PRODUCT_CATEGORY_BY_USER: `
        mutation (
            $productIds: [Int!]!,
            $categoryA077: String,
            $categoryB378: String,
            $categoryA112: String,
            $categoryA027: String,
            $categoryA001: String,
            $categoryA006: String,
            $categoryB719: String,
            $categoryA113: String,
            $categoryA524: String,
            $categoryA525: String,
            $categoryB956: String
        ) {
            updateManyProductCategoryByUser(
                productIds: $productIds,
                categoryA077: $categoryA077,
                categoryB378: $categoryB378,
                categoryA112: $categoryA112,
                categoryA027: $categoryA027,
                categoryA001: $categoryA001,
                categoryA006: $categoryA006,
                categoryB719: $categoryB719,
                categoryA113: $categoryA113,
                categoryA524: $categoryA524,
                categoryA525: $categoryA525,
                categoryB956: $categoryB956
            )
        }
    `,

	UPDATE_MANY_PRODUCT_NAME_BY_USER: `
        mutation (
            $productIds: [Int!]!,
            $head: String,
            $body: String,
            $tail: String
        ) {
            updateManyProductNameByUser(
                productIds: $productIds,
                head: $head,
                body: $body,
                tail: $tail
            )
        }
    `,

	UPDATE_MANY_PRODUCT_TAG_BY_USER: `
        mutation (
            $productIds: [Int!]!,
            $searchTags: String,
            $immSearchTags: String 
        ) {
            updateManyProductTagByUser(
                productIds: $productIds,
                searchTags: $searchTags,
                immSearchTags: $immSearchTags
            )
        }
    `,

	ADD_WORD_BY_USER: `
        mutation (
            $findWord: String!,
            $replaceWord: String
        ) {
            addWordByUser(
                findWord: $findWord,
                replaceWord: $replaceWord
            )
        }
    `,

	DELETE_WORD_BY_USER: `
        mutation (
            $wordId: [Int!]!,
        ) {
            deleteWordByUser(
                wordId: $wordId
            )
        }
    `,

	UPDATE_IMAGE_THUMBNAIL_DATA: `
        mutation (
            $productId: Int!,
            $thumbnails: [ProductThumbnailUpdateInput!]
        ) {
            updateImageThumbnailData(
                productId: $productId,
                thumbnails: $thumbnails
            )
        }
    `,

	UPDATE_DESCRIPTION: `
        mutation (
            $productId: Int!,
            $description: String!
        ) {
            updateDescription(
                productId: $productId,
                description: $description
            )
        }
    `,

	UPDATE_MANY_PRODUCT_OPTION: `
        mutation (
            $data: [ProductOptionInput!]!
        ) {
            updateManyProductOption(
                data: $data,
            )
        }
    `,

	UPDATE_MANY_PRODUCT_OPTION_VALUE: `
        mutation (
            $data: [ProductOptionValueInput!]!
        ) {
            updateManyProductOptionValue(
                data: $data,
            )
        }
    `,

	UPDATE_PRODUCT_SINGLE_PRICE_BY_USER: `
        mutation (
            $productId: Int!,
            $price: Int!
        ) {
            updateProductSinglePriceByUser(
                productId: $productId,
                price: $price
            )
        }
    `,

	INIT_PRODUCT_THUMBNAIL_IMAGE_BY_USER: `
        mutation (
            $productId: Int!
        ) {
            initProductThumbnailImageByUser(
                productId: $productId
            )
        }
    `,

	INIT_PRODUCT_OPTION_IMAGE_BY_USER: `
        mutation (
            $productId: Int!
        ) {
            initProductOptionImageByUser(
                productId: $productId
            )
        }
    `,

	INIT_PRODUCT_DESCRIPTION_BY_USER: `
        mutation (
            $productId: Int!
        ) {
            initProductDescriptionByUser(
                productId: $productId
            )
        }
    `,

	UNLINK_PRODUCT_STORE: `
        mutation (
            $productId: Int!
            $siteCode: String!
            
        ) {
            unlinkProductStore(
                productId: $productId
                siteCode: $siteCode

            )
        }
    `,
	CHECK_ESM_PLUS: `
    mutation (
        $productId: Int!
        $siteCode: String!
        
    ) {
        checkESMPlus(
            productId: $productId
            siteCode: $siteCode

        )
    }`,

	CREATE_NEW_ORDER: `
        mutation (
            $data: [newOrderInput!]!
        ) {
            createNewOrder(data: $data)
        }
    `,

	UPDATE_PRODUCT_ATTRIBUTE_BY_USER: `
        mutation (
            $productId: Int!
            $brandName: String
            $manufacturer: String
            $modelName: String
        ) {
            updateProductAttributeByUser(
                productId: $productId
                brandName: $brandName
                manufacturer: $manufacturer
                modelName: $modelName
            )
        }
    `,
	UPDATE_KEYWARD_LIST: `
  mutation(
    $productId : Int!
    $myKeyward : String!
  ){
    updateKeywardList(
        productId : $productId
        myKeyward : $myKeyward
    )
  }`,
	SET_LOCK_PRODUCT: `
  mutation (
    $productId : Int!
    $mylock : Int!
  ){
    setLockProduct(
        productId : $productId
        mylock : $mylock
    )
  }`,

	COUPANG_PRODUCTSTORE_DELETE: `
        mutation (
            $productId : Int!
        ){
            coupangProductStoreDelete(
                productId : $productId
            )
        }
  `,
	TEST_ADD_JOB_CALLBACK: `
        mutation (
            $response: String!
        ) {
            testAddjobCallBack(
                response: $response
            )
        }
    `,

	EDIT_PASSWORD_CREATE_VERIFICATION: `
        mutation (
            $email: String!
            $phoneNumber: String!
        ) {
            EditPasswordCreateVerification(
                email: $email
                phoneNumber: $phoneNumber
            )
        }
    `,

	EDIT_PASSWORD: `
        mutation (
            $email: String!
            $verificationNumber: String!
            $newPassword: String!
            $checkNewPassword: String!
        ) {
            EditPassword(
                email: $email
                verificationNumber: $verificationNumber
                newPassword: $newPassword
                checkNewPassword: $checkNewPassword
            )
        }
    `,

	CHANGE_PASSWORD_BY_USER: `
        mutation (
            $currentPassword: String!
            $newPassword: String!
        ) {
            changePasswordByUser(
                currentPassword: $currentPassword
                newPassword: $newPassword
            )
        }
    `,

	FIND_EMAIL_CREATE_VERIFICATION: `
        mutation (
            $phoneNumber: String!
        ) {
            findEmailCreateVerification(
                phoneNumber: $phoneNumber
            )
        }
    `,

	FIND_EMAIL: `
        mutation (
            $phone: String!
            $verificationNumber: String!
        ) {
            findEmail(
                phone: $phone
                verificationNumber: $verificationNumber
            )
        }
    `,
	UPDATE_MANY_KEYWARD_LIST: `
        mutation (
            $productIds :[Int!]!
            $myKeyward:String!
        ) {
            updateManyKeywardList(
                productIds : $productIds
                myKeyward : $myKeyward
            )
        }`,
	UPDATE_MANY_PRODUCT_ATTRIBUTE_BY_USER: `
        mutation (
            $productId: [Int!]!
            $brandName: String
            $manufacturer: String
            $modelName: String
        ) {
            updateManyProductAttributeByUser(
                productId: $productId
                brandName: $brandName
                manufacturer: $manufacturer
                modelName: $modelName
            )
        }
    `,

	COUPANG_CATEGORY_SILL_CODE_INPUT: `
        mutation (
            $data: [sillCodeInput!]!
        ) {
            coupangCategorySillCodeInput(
                data: $data
            )
        }
    `,

	UPDATE_PRODUCT_SILL_DATAS_BY_USER: `
        mutation (
            $productIds: [Int!]!
            $data_a077: String
            $data_b378: String
            $data_a112: String
            $data_a027: String
            $data_a001: String
            $data_a006: String
            $data_a113: String
            $data_a524: String
            $data_a525: String
            $data_b719: String
            $data_b956: String
        ) {
            updateProductSillDatasByUser(
                productIds: $productIds
                data_a077: $data_a077
                data_b378: $data_b378
                data_a112: $data_a112
                data_a027: $data_a027
                data_a001: $data_a001
                data_a006: $data_a006
                data_a113: $data_a113
                data_a524: $data_a524
                data_a525: $data_a525
                data_b719: $data_b719
                data_b956: $data_b956
            )
        }
    `,

	UPDATE_PRODUCT_SILL_CODES_BY_USER: `
        mutation (
            $productIds: [Int!]!
            $code_a077: String
            $code_b378: String
            $code_a112: String
            $code_a027: String
            $code_a001: String
            $code_a006: String
            $code_a113: String
            $code_a524: String
            $code_a525: String
            $code_b719: String
            $code_b956: String
        ) {
            updateProductSillCodesByUser(
                productIds: $productIds
                code_a077: $code_a077
                code_b378: $code_b378
                code_a112: $code_a112
                code_a027: $code_a027
                code_a001: $code_a001
                code_a006: $code_a006
                code_a113: $code_a113
                code_a524: $code_a524
                code_a525: $code_a525
                code_b719: $code_b719
                code_b956: $code_b956
            )
        }
    `,

	SET_MULTI_PURCHASE_INFO_BY_ADMIN: `
        mutation (
            $purchaseInputs: [purchaseInputs!]!
            $credit: Int!
        ) {
            setMultiPurchaseInfoByAdmin(
                purchaseInputs: $purchaseInputs
                credit: $credit
            )
        }
    `,

	UPDATE_MANY_DESCRIPTION: `
        mutation (
            $data: [DescriptionDataInput!]!
        ) {
            updateManyDescription(
                data: $data
            )
        }
    `,
};

export default MUTATIONS;
