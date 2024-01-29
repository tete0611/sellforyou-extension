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
	const { changedWhere, setChangeWhere, categoryInfo } = product;
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
														changedWhere.createdAt?.gte
															? format(new Date(changedWhere.createdAt.gte), 'yyyy-MM-dd')
															: undefined
													}
													onChange={(e: any) => {
														setChangeWhere({
															...changedWhere,

															createdAt: {
																...changedWhere.createdAt,
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
														changedWhere.createdAt?.lte
															? format(new Date(changedWhere.createdAt.lte), 'yyyy-MM-dd')
															: undefined
													}
													onChange={(e: any) => {
														setChangeWhere({
															...changedWhere,
															createdAt: {
																...changedWhere.createdAt,
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
														changedWhere.stockUpdatedAt?.gte
															? format(new Date(changedWhere.stockUpdatedAt?.gte), 'yyyy-MM-dd')
															: undefined
													}
													onChange={(e: any) => {
														setChangeWhere({
															...changedWhere,

															stockUpdatedAt: {
																...changedWhere.stockUpdatedAt,
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
														changedWhere.stockUpdatedAt?.lte
															? format(new Date(changedWhere.stockUpdatedAt.lte), 'yyyy-MM-dd')
															: undefined
													}
													onChange={(e: any) => {
														setChangeWhere({
															...changedWhere,
															stockUpdatedAt: {
																...changedWhere.stockUpdatedAt,
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
													defaultValue={changedWhere.taobaoProduct?.price?.gte ?? ''}
													onChange={(e) => setPriceStart(e.target.value)}
													onBlur={() => {
														const value = parseFloat(priceStart);

														setChangeWhere({
															...changedWhere,
															taobaoProduct: {
																...changedWhere.taobaoProduct,
																price: {
																	...changedWhere.taobaoProduct?.price,
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
													defaultValue={changedWhere.taobaoProduct?.price?.lte ?? ''}
													onChange={(e) => setPriceEnd(e.target.value)}
													onBlur={() => {
														const value = parseFloat(priceEnd);

														setChangeWhere({
															...changedWhere,
															taobaoProduct: {
																price: {
																	...changedWhere.taobaoProduct?.price,
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
													defaultValue={changedWhere.cnyRate?.gte ?? ''}
													onChange={(e) => setCnyRateStart(e.target.value)}
													onBlur={() => {
														const value = parseFloat(cnyRateStart);

														setChangeWhere({
															...changedWhere,
															cnyRate: {
																...changedWhere.cnyRate,
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
													defaultValue={changedWhere.cnyRate?.lte ?? ''}
													onChange={(e) => setCnyRateEnd(e.target.value)}
													onBlur={() => {
														const value = parseFloat(cnyRateEnd);

														setChangeWhere({
															...changedWhere,
															cnyRate: {
																...changedWhere.cnyRate,
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
													defaultValue={changedWhere.localShippingFee?.gte ?? ''}
													onChange={(e) => {
														setLocalFeeStart(e.target.value);
													}}
													onBlur={() => {
														const value = parseInt(localFeeStart);

														setChangeWhere({
															...changedWhere,
															localShippingFee: {
																...changedWhere.localShippingFee,
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
													defaultValue={changedWhere.localShippingFee?.lte ?? ''}
													onChange={(e) => setLocalFeeEnd(e.target.value)}
													onBlur={() => {
														const value = parseInt(localFeeEnd);

														setChangeWhere({
															...changedWhere,
															localShippingFee: {
																...changedWhere.localShippingFee,
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
													defaultValue={changedWhere.marginRate?.gte ?? ''}
													onChange={(e) => setMarginRateStart(e.target.value)}
													onBlur={() => {
														const value = parseFloat(marginRateStart);

														setChangeWhere({
															...changedWhere,
															marginRate: {
																...changedWhere.marginRate,
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
													defaultValue={changedWhere.marginRate?.lte ?? ''}
													onChange={(e) => setMarginRateEnd(e.target.value)}
													onBlur={() => {
														const value = parseFloat(marginRateEnd);

														setChangeWhere({
															...changedWhere,
															marginRate: {
																...changedWhere.marginRate,
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
													defaultValue={changedWhere.price?.gte ?? ''}
													onChange={(e) => setBasicPriceStart(e.target.value)}
													onBlur={() => {
														const value = parseInt(basicPriceStart);

														setChangeWhere({
															...changedWhere,
															price: {
																...changedWhere.price,
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
													defaultValue={changedWhere.price?.lte ?? ''}
													onChange={(e) => setBasicPriceEnd(e.target.value)}
													onBlur={() => {
														const value = parseInt(basicPriceEnd);

														setChangeWhere({
															...changedWhere,
															price: {
																...changedWhere.price,
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
													defaultValue={changedWhere.shippingFee?.gte ?? ''}
													onChange={(e) => setShippingFeeStart(e.target.value)}
													onBlur={() => {
														const value = parseInt(shippingFeeStart);

														setChangeWhere({
															...changedWhere,
															shippingFee: {
																...changedWhere.shippingFee,
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
													defaultValue={changedWhere.shippingFee?.lte ?? ''}
													onChange={(e) => setShippingFeeEnd(e.target.value)}
													onBlur={() => {
														const value = parseInt(shippingFeeEnd);

														setChangeWhere({
															...changedWhere,
															shippingFee: {
																...changedWhere.shippingFee,
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
													value={changedWhere.taobaoProduct?.shopName?.equals ?? 'ALL'}
													sx={{
														textAlign: 'center',
														fontSize: 13,
														height: 30,
														width: 120,
													}}
													onChange={(e) => {
														setChangeWhere({
															...changedWhere,
															taobaoProduct: {
																...changedWhere.taobaoProduct,
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
														changedWhere.taobaoProduct?.videoUrl?.not
															? 'Y'
															: changedWhere.taobaoProduct?.videoUrl?.equals === null
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

														setChangeWhere({
															...changedWhere,
															taobaoProduct: {
																...changedWhere.taobaoProduct,
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
													value={changedWhere.productStore?.some?.siteCode?.equals ?? 'ALL'}
													sx={{
														textAlign: 'center',
														fontSize: 13,
														height: 30,
														width: 120,
													}}
													onChange={(e) => {
														setChangeWhere({
															...changedWhere,

															productStore: {
																...changedWhere.productStore,
																some: {
																	...changedWhere.productStore?.some,
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
														changedWhere.productStore?.some?.state
															? changedWhere.productStore.some.state.equals
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
														setChangeWhere({
															...changedWhere,
															productStore: {
																...changedWhere.productStore,
																some: {
																	...changedWhere.productStore?.some,
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
													value={changedWhere.categoryInfoA077}
													onChange={(_, value) => {
														setChangeWhere({
															...changedWhere,
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
