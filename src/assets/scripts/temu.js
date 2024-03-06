// temu 페이지 삽입 스크립트

/** 최종 result 해야하는 목록
 * 1. result['item']['shopName'] // 소싱처명 -> temu
 * 2. result['item']['url'] // 상품 url -> window.rawData.store.seoData.ogInfo["og:url"]
 * 3. result['item']['num_iid'] // 상품 고유아이디?
 * 4. result['item']['title'] // 상품명 -> window.rawData.store.goods.goodsName
 * 5. result['item']['price'] // 가격 -> window.rawData.store.seoData.ogInfo["product:price:amount"] 또는 window.rawData.store.goods.minOnSalePrice(최소가격), window.rawData.store.goods.maxOnSalePrice(최대가격) 인듯
 * 6. result['item']['pic_url'] // 썸네일 -> window.rawData.store.goods.hdThumbUrl
 * 7. result['item']['desc'] // 상세 html
 * 8. result['item']['desc_img'] // 상세 이미지들 -> window.rawData.store.productDetail 또는 window.rawData.store.productDetail.floorList[n].items[].url
 * 9. result['item']['post_fee'] // 배송비?
 * 10. result['item']['shop_id'] // 소싱처명 (아이디) -> temu
 * 11. result['item']['video'] // 비디오 url -> window.rawData.store.goods.video.videoUrl
 * 12. result['item']['item_imgs'] // 상품이미지들 -> window.rawData.store.goods.gallery[].url 중 id가 음수가 아닌 것들인듯
 * 13. result['item']['prop_imgs']['prop_img'] // 옵션이미지들 -> window.rawData.store.goods.gallery[].url 중 id가 음수인 것들
 * 14. result['item']['props_list'] // {"키":"옵션명"} 의 객체
 * 15. result['item']['skus']['sku'] // 옵션정보 -> window.rawData.store.sku[]
 * 		 price // 옵션가격 -> window.rawData.store.sku[n].normalPrice
 * 		 total_price // 최종가격? ->
 * 		 original_price // 원래가격? -> window.rawData.store.sku[n].normalLinePrice
 * 		 properties // 옵션키 인듯 -> window.rawData.store.sku[n].specs[n].specKey
 * 		 properties_name // 옵션명 -> window.rawData.store.sku[n].specs[n].specValue
 * 		 quantity // 수량 -> window.rawData.store.sku[n].stockQuantity 또는 window.rawData.store.sku[n].limitQuantity
 * 		 sku_id // 아무거나 유니크한값 넣기 (타임스탬프)
 * 16. result['item']['desc_text'] // 상세설명 텍스트?
 */

const main = async () => {
	while (true) {
		try {
			let json = {};
			console.log(window.rawData);

			const existGoodsData = Object.keys(window.rawData.store.goods).length > 0;
			const existSkuData = Object.keys(window.rawData.store.sku).length > 0;
			const existSeoData = Object.keys(window.rawData.store.seoData).length > 0;
			const controlData = window.rawData.store?.control;

			if (window.rawData.store && existGoodsData && existSkuData && existSeoData && controlData) {
				json = {
					goodsData: window.rawData.store.goods,
					skuData: window.rawData.store.sku,
					seoData: window.rawData.store.seoData,
					descData: window.rawData.store.productDetailFlatList,
					descTextData: window.rawData.store.productDetail,
					controlData: controlData,
				};

				if (json['goodsData'] && json['skuData'] && json['seoData'] && json['controlData']) {
					sessionStorage.setItem('sfy-temu-item', JSON.stringify(json));
					break;
				}
			}

			await new Promise((resolve) => setTimeout(resolve, 1000));
		} catch (error) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}
};

main();
