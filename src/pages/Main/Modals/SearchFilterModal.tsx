import React, { useState } from 'react';
import { format } from 'date-fns';
import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { Box, Grid, MenuItem, Modal, Paper, Select, Typography } from '@mui/material';
import { Input, Search } from '../Common/UI';
import { SHOPCODE } from '../../../type/variable';
import { ProductStoreWhereInput, TaobaoProductWhereInput } from '../../../type/schema';

// 검색필터 모달 뷰
export const SearchFilterModal = observer(() => {
	// MobX 스토리지 로드
	const { product } = React.useContext(AppContext);
	const { searchInfo, setSearchInfo, categoryInfo } = product;
	const {
		SMART_STORE,
		AUCTION_2,
		COUPANG,
		G_MARKET_2,
		INTER_PARK,
		LOTTE_ON_GLOBAL,
		LOTTE_ON_NORMAL,
		STREET11_GLOBAL,
		STREET11_NORMAL,
		TMON,
		WE_MAKE_PRICE,
	} = SHOPCODE;

	// 인풋 컴포넌트 들만 useState로 관리
	const [priceStart, setPriceStart] = useState(''); // 도매가 시작
	const [priceEnd, setPriceEnd] = useState(''); // 도매가 끝
	const [cnyRateStart, setCnyRateStart] = useState(''); // 환율 시작
	const [cnyRateEnd, setCnyRateEnd] = useState(''); // 환율 끝
	const [localFeeStart, setLocalFeeStart] = useState(''); // 배대지배송비 시작
	const [localFeeEnd, setLocalFeeEnd] = useState(''); // 배대지배송비 끝
	const [marginRateStart, setMarginRateStart] = useState(''); // 마진율 시작
	const [marginRateEnd, setMarginRateEnd] = useState(''); // 마진율 끝
	const [basicPriceStart, setBasicPriceStart] = useState(''); // 기본판매가 시작
	const [basicPriceEnd, setBasicPriceEnd] = useState(''); // 기본판매가 끝
	const [shippingFeeStart, setShippingFeeStart] = useState(''); // 유료배송비 시작
	const [shippingFeeEnd, setShippingFeeEnd] = useState(''); // 유료배송비 끝

	return (
		<Modal open={product.modalInfo.userFilter ?? false} onClose={() => product.toggleSearchFilterModal(false)}>
			<Paper
				className='uploadModal'
				sx={{
					width: 850,
				}}
			>
				<Typography
					fontSize={16}
					sx={{
						mb: 3,
					}}
				>
					검색필터 설정
				</Typography>

				<Paper variant='outlined'>
					<Box
						sx={{
							p: 1,
						}}
					>
						<Grid container spacing={1}>
							<Grid
								item
								xs={8}
								md={6}
								sx={{
									m: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={8}
											md={4}
											sx={{
												m: 'auto',
											}}
										>
											<Typography fontSize={14}>수집일</Typography>
										</Grid>

										<Grid
											item
											xs={8}
											md={8}
											sx={{
												m: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Input
													width={120}
													type='date'
													value={
														searchInfo.createdAt?.gte
															? format(new Date(searchInfo.createdAt.gte), 'yyyy-MM-dd')
															: undefined
													}
													onChange={(e: any) => {
														setSearchInfo({
															...searchInfo,

															createdAt: {
																...searchInfo.createdAt,
																gte: new Date(`${e.target.value} 00:00:00`).toISOString(),
															},
														});
													}}
												/>

												<Box>~</Box>

												<Input
													width={120}
													type='date'
													value={
														searchInfo.createdAt?.lte
															? format(new Date(searchInfo.createdAt.lte), 'yyyy-MM-dd')
															: undefined
													}
													onChange={(e: any) => {
														setSearchInfo({
															...searchInfo,
															createdAt: {
																...searchInfo.createdAt,
																lte: new Date(`${e.target.value} 23:59:59`).toISOString(),
															},
														});
													}}
												/>
											</Box>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid
								item
								xs={8}
								md={6}
								sx={{
									m: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={8}
											md={4}
											sx={{
												m: 'auto',
											}}
										>
											<Typography fontSize={14}>등록일</Typography>
										</Grid>

										<Grid
											item
											xs={8}
											md={8}
											sx={{
												m: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Input
													width={120}
													type='date'
													value={
														searchInfo.stockUpdatedAt?.gte
															? format(new Date(searchInfo.stockUpdatedAt?.gte), 'yyyy-MM-dd')
															: undefined
													}
													onChange={(e: any) => {
														setSearchInfo({
															...searchInfo,

															stockUpdatedAt: {
																...searchInfo.stockUpdatedAt,
																gte: new Date(`${e.target.value} 00:00:00`).toISOString(),
															},
														});
													}}
												/>

												<Box>~</Box>

												<Input
													width={120}
													type='date'
													value={
														searchInfo.stockUpdatedAt?.lte
															? format(new Date(searchInfo.stockUpdatedAt.lte), 'yyyy-MM-dd')
															: undefined
													}
													onChange={(e: any) => {
														setSearchInfo({
															...searchInfo,
															stockUpdatedAt: {
																...searchInfo.stockUpdatedAt,
																lte: new Date(`${e.target.value} 23:59:59`).toISOString(),
															},
														});
													}}
												/>
											</Box>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid
								item
								xs={8}
								md={6}
								sx={{
									m: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={8}
											md={4}
											sx={{
												m: 'auto',
											}}
										>
											<Typography fontSize={14}>도매가</Typography>
										</Grid>

										<Grid
											item
											xs={8}
											md={8}
											sx={{
												m: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Input
													id='product_tables_priceStart'
													style={{ width: 120 }}
													options={{
														textAlign: 'right',
													}}
													defaultValue={searchInfo.taobaoProduct?.price?.gte ?? ''}
													onChange={(e) => setPriceStart(e.target.value)}
													onBlur={() => {
														const value = parseFloat(priceStart);

														setSearchInfo({
															...searchInfo,
															taobaoProduct: {
																...searchInfo.taobaoProduct,
																price: {
																	...searchInfo.taobaoProduct?.price,
																	gte: isNaN(value) ? undefined : value,
																},
															},
														});
													}}
												/>

												<Box>~</Box>

												<Input
													id='product_tables_priceEnd'
													style={{ width: 120 }}
													options={{
														textAlign: 'right',
													}}
													defaultValue={searchInfo.taobaoProduct?.price?.lte ?? ''}
													onChange={(e) => setPriceEnd(e.target.value)}
													onBlur={() => {
														const value = parseFloat(priceEnd);

														setSearchInfo({
															...searchInfo,
															taobaoProduct: {
																price: {
																	...searchInfo.taobaoProduct?.price,
																	lte: isNaN(value) ? undefined : value,
																},
															},
														});
													}}
												/>
											</Box>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid
								item
								xs={8}
								md={6}
								sx={{
									m: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={8}
											md={4}
											sx={{
												m: 'auto',
											}}
										>
											<Typography fontSize={14}>환율</Typography>
										</Grid>

										<Grid
											item
											xs={8}
											md={8}
											sx={{
												m: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Input
													id='product_tables_cnyRateStart'
													style={{ width: 120 }}
													options={{
														textAlign: 'right',
													}}
													defaultValue={searchInfo.cnyRate?.gte ?? ''}
													onChange={(e) => setCnyRateStart(e.target.value)}
													onBlur={() => {
														const value = parseFloat(cnyRateStart);

														setSearchInfo({
															...searchInfo,
															cnyRate: {
																...searchInfo.cnyRate,
																gte: isNaN(value) ? undefined : value,
															},
														});
													}}
												/>

												<Box>~</Box>

												<Input
													id='product_tables_cnyRateEnd'
													style={{ width: 120 }}
													options={{
														textAlign: 'right',
													}}
													defaultValue={searchInfo.cnyRate?.lte ?? ''}
													onChange={(e) => setCnyRateEnd(e.target.value)}
													onBlur={() => {
														const value = parseFloat(cnyRateEnd);

														setSearchInfo({
															...searchInfo,
															cnyRate: {
																...searchInfo.cnyRate,
																lte: isNaN(value) ? undefined : value,
															},
														});
													}}
												/>
											</Box>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid
								item
								xs={8}
								md={6}
								sx={{
									m: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={8}
											md={4}
											sx={{
												m: 'auto',
											}}
										>
											<Typography fontSize={14}>배대지배송비</Typography>
										</Grid>

										<Grid
											item
											xs={8}
											md={8}
											sx={{
												m: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Input
													id='product_tables_localFeeStart'
													style={{ width: 120 }}
													options={{
														textAlign: 'right',
													}}
													defaultValue={searchInfo.localShippingFee?.gte ?? ''}
													onChange={(e) => {
														setLocalFeeStart(e.target.value);
													}}
													onBlur={() => {
														const value = parseInt(localFeeStart);

														setSearchInfo({
															...searchInfo,
															localShippingFee: {
																...searchInfo.localShippingFee,
																gte: isNaN(value) ? undefined : value,
															},
														});
													}}
												/>

												<Box>~</Box>

												<Input
													id='product_tables_localFeeEnd'
													style={{ width: 120 }}
													options={{
														textAlign: 'right',
													}}
													defaultValue={searchInfo.localShippingFee?.lte ?? ''}
													onChange={(e) => setLocalFeeEnd(e.target.value)}
													onBlur={() => {
														const value = parseInt(localFeeEnd);

														setSearchInfo({
															...searchInfo,
															localShippingFee: {
																...searchInfo.localShippingFee,
																lte: isNaN(value) ? undefined : value,
															},
														});
													}}
												/>
											</Box>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid
								item
								xs={8}
								md={6}
								sx={{
									m: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={8}
											md={4}
											sx={{
												m: 'auto',
											}}
										>
											<Typography fontSize={14}>마진율</Typography>
										</Grid>

										<Grid
											item
											xs={8}
											md={8}
											sx={{
												m: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Input
													id='product_tables_marginRateStart'
													style={{ width: 120 }}
													options={{
														textAlign: 'right',
													}}
													defaultValue={searchInfo.marginRate?.gte ?? ''}
													onChange={(e) => setMarginRateStart(e.target.value)}
													onBlur={() => {
														const value = parseFloat(marginRateStart);

														setSearchInfo({
															...searchInfo,
															marginRate: {
																...searchInfo.marginRate,
																gte: isNaN(value) ? undefined : value,
															},
														});
													}}
												/>

												<Box>~</Box>

												<Input
													id='product_tables_marginRateEnd'
													style={{ width: 120 }}
													options={{
														textAlign: 'right',
													}}
													defaultValue={searchInfo.marginRate?.lte ?? ''}
													onChange={(e) => setMarginRateEnd(e.target.value)}
													onBlur={() => {
														const value = parseFloat(marginRateEnd);

														setSearchInfo({
															...searchInfo,
															marginRate: {
																...searchInfo.marginRate,
																lte: isNaN(value) ? undefined : value,
															},
														});
													}}
												/>
											</Box>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid
								item
								xs={8}
								md={6}
								sx={{
									m: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={8}
											md={4}
											sx={{
												m: 'auto',
											}}
										>
											<Typography fontSize={14}>기본판매가</Typography>
										</Grid>

										<Grid
											item
											xs={8}
											md={8}
											sx={{
												m: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Input
													id='product_tables_basicPriceStart'
													style={{ width: 120 }}
													options={{
														textAlign: 'right',
													}}
													defaultValue={searchInfo.price?.gte ?? ''}
													onChange={(e) => setBasicPriceStart(e.target.value)}
													onBlur={() => {
														const value = parseInt(basicPriceStart);

														setSearchInfo({
															...searchInfo,
															price: {
																...searchInfo.price,
																gte: isNaN(value) ? undefined : value,
															},
														});
													}}
												/>

												<Box>~</Box>

												<Input
													id='product_tables_basicPriceEnd'
													style={{ width: 120 }}
													options={{
														textAlign: 'right',
													}}
													defaultValue={searchInfo.price?.lte ?? ''}
													onChange={(e) => setBasicPriceEnd(e.target.value)}
													onBlur={() => {
														const value = parseInt(basicPriceEnd);

														setSearchInfo({
															...searchInfo,
															price: {
																...searchInfo.price,
																lte: isNaN(value) ? undefined : value,
															},
														});
													}}
												/>
											</Box>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid
								item
								xs={8}
								md={6}
								sx={{
									m: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={8}
											md={4}
											sx={{
												m: 'auto',
											}}
										>
											<Typography fontSize={14}>유료배송비</Typography>
										</Grid>

										<Grid
											item
											xs={8}
											md={8}
											sx={{
												m: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Input
													id='product_tables_shippingFeeStart'
													style={{ width: 120 }}
													options={{
														textAlign: 'right',
													}}
													defaultValue={searchInfo.shippingFee?.gte ?? ''}
													onChange={(e) => setShippingFeeStart(e.target.value)}
													onBlur={() => {
														const value = parseInt(shippingFeeStart);

														setSearchInfo({
															...searchInfo,
															shippingFee: {
																...searchInfo.shippingFee,
																gte: isNaN(value) ? undefined : value,
															},
														});
													}}
												/>

												<Box>~</Box>

												<Input
													id='product_tables_shippingFeeEnd'
													style={{ width: 120 }}
													options={{
														textAlign: 'right',
													}}
													defaultValue={searchInfo.shippingFee?.lte ?? ''}
													onChange={(e) => setShippingFeeEnd(e.target.value)}
													onBlur={() => {
														const value = parseInt(shippingFeeEnd);

														setSearchInfo({
															...searchInfo,
															shippingFee: {
																...searchInfo.shippingFee,
																lte: isNaN(value) ? undefined : value,
															},
														});
													}}
												/>
											</Box>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid
								item
								xs={8}
								md={6}
								sx={{
									m: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={8}
											md={4}
											sx={{
												m: 'auto',
											}}
										>
											<Typography fontSize={14}>구매처</Typography>
										</Grid>

										<Grid
											item
											xs={8}
											md={8}
											sx={{
												m: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Select
													value={searchInfo.taobaoProduct?.shopName?.equals ?? 'ALL'}
													sx={{
														textAlign: 'center',
														fontSize: 13,
														height: 30,
														width: 120,
													}}
													onChange={(e) => {
														setSearchInfo({
															...searchInfo,
															taobaoProduct: {
																...searchInfo.taobaoProduct,
																shopName: e.target.value === 'ALL' ? {} : { equals: e.target.value },
															},
														});
													}}
												>
													<MenuItem value='ALL'>모두보기</MenuItem>
													<MenuItem value='taobao'>타오바오</MenuItem>
													<MenuItem value='tmall'>티몰</MenuItem>
													<MenuItem value='express'>알리익스프레스</MenuItem>
													<MenuItem value='alibaba'>1688</MenuItem>
													<MenuItem value='vvic'>VVIC</MenuItem>
												</Select>

												<Box>▶</Box>

												<Select
													value={
														searchInfo.taobaoProduct?.videoUrl?.not
															? 'Y'
															: searchInfo.taobaoProduct?.videoUrl?.equals === null
															? 'N'
															: 'ALL'
													}
													sx={{
														textAlign: 'center',
														fontSize: 13,
														height: 30,
														width: 120,
													}}
													onChange={(e) => {
														const { value } = e.target;
														let videoUrl: TaobaoProductWhereInput['videoUrl'];
														if (value === 'ALL') videoUrl = {};
														else if (value === 'Y') videoUrl = { not: { equals: null } };
														else if (value === 'N') videoUrl = { equals: null };

														setSearchInfo({
															...searchInfo,
															taobaoProduct: {
																...searchInfo.taobaoProduct,
																videoUrl: videoUrl,
															},
														});
													}}
												>
													<MenuItem value='ALL'>모두보기</MenuItem>
													<MenuItem value='Y'>동영상있음</MenuItem>
													<MenuItem value='N'>동영상없음</MenuItem>
												</Select>
											</Box>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid
								item
								xs={8}
								md={6}
								sx={{
									m: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={8}
											md={4}
											sx={{
												m: 'auto',
											}}
										>
											<Typography fontSize={14}>오픈마켓</Typography>
										</Grid>

										<Grid
											item
											xs={8}
											md={8}
											sx={{
												m: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Select
													value={searchInfo.productStore?.some?.siteCode?.equals ?? 'ALL'}
													sx={{
														textAlign: 'center',
														fontSize: 13,
														height: 30,
														width: 120,
													}}
													onChange={(e) => {
														setSearchInfo({
															...searchInfo,

															productStore: {
																...searchInfo.productStore,
																some: {
																	...searchInfo.productStore?.some,
																	siteCode: e.target.value === 'ALL' ? {} : { equals: e.target.value },
																},
															},
														});
													}}
												>
													<MenuItem value='ALL'>모두보기</MenuItem>
													<MenuItem value={SMART_STORE}>스마트스토어</MenuItem>
													<MenuItem value={COUPANG}>쿠팡</MenuItem>
													<MenuItem value={STREET11_GLOBAL}>11번가 (글로벌)</MenuItem>
													<MenuItem value={STREET11_NORMAL}>11번가 (일반)</MenuItem>
													<MenuItem value={G_MARKET_2}>지마켓</MenuItem>
													<MenuItem value={AUCTION_2}>옥션</MenuItem>
													<MenuItem value={INTER_PARK}>인터파크</MenuItem>
													<MenuItem value={WE_MAKE_PRICE}>위메프</MenuItem>
													<MenuItem value={LOTTE_ON_GLOBAL}>롯데온 (글로벌)</MenuItem>
													<MenuItem value={LOTTE_ON_NORMAL}>롯데온 (일반)</MenuItem>
													<MenuItem value={TMON}>티몬</MenuItem>
												</Select>

												<Box>▶</Box>

												<Select
													value={
														searchInfo.productStore?.some?.state
															? searchInfo.productStore.some.state.equals
																? 'Y'
																: 'N'
															: 'ALL'
													}
													sx={{
														textAlign: 'center',
														fontSize: 13,
														height: 30,
														width: 120,
													}}
													onChange={(e) => {
														const { value } = e.target;
														let state: ProductStoreWhereInput['state'];
														if (value === 'ALL') state = undefined;
														else if (value === 'Y') state = { equals: 2 };
														else if (value === 'N') state = { not: { equals: 2 } };
														setSearchInfo({
															...searchInfo,
															productStore: {
																...searchInfo.productStore,
																some: {
																	...searchInfo.productStore?.some,
																	state: state,
																},
															},
														});
													}}
												>
													<MenuItem value={'ALL'}>모두보기</MenuItem>
													<MenuItem value={'Y'}>등록완료</MenuItem>
													<MenuItem value={'N'}>등록실패</MenuItem>
												</Select>
											</Box>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid
								item
								xs={8}
								md={12}
								sx={{
									m: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={8}
											md={1.95}
											sx={{
												m: 'auto',
											}}
										>
											<Typography fontSize={14}>카테고리</Typography>
										</Grid>

										<Grid
											item
											xs={8}
											md={10.05}
											sx={{
												m: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Search
													value={searchInfo.categoryInfoA077}
													onChange={(_, value) => {
														setSearchInfo({
															...searchInfo,
															categoryInfoA077: value,
														});
													}}
													onInputChange={(_, value, reason) => {
														if (reason === 'input') product.setCategoryInput(SMART_STORE, value);
													}}
													options={
														categoryInfo.markets.find((v) => v.code === SMART_STORE)!.input
															? product.categoryInfo.markets.find((v) => v.code === SMART_STORE)!.data
															: [product.manyCategoryInfo.categoryInfoA077]
													}
													getOptionLabel={(option: any) => option.name ?? ''}
													isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
													onOpen={() => product.getCategoryList(SMART_STORE)}
													onClose={() => product.setCategoryInput(SMART_STORE, '')}
													loading={product.categoryInfo.markets.find((v) => v.code === SMART_STORE)!.loading}
												/>
											</Box>
										</Grid>
									</Grid>
								</Paper>
							</Grid>
						</Grid>
					</Box>
				</Paper>
			</Paper>
		</Modal>
	);
});
