import React from 'react';

import { format } from 'date-fns';
import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { Box, Grid, MenuItem, Modal, Paper, Select, Typography } from '@mui/material';
import { Input, Search } from '../Common/UI';

// 검색필터 모달 뷰
export const SearchFilterModal = observer(() => {
	// MobX 스토리지 로드
	const { product } = React.useContext(AppContext);

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
														product.searchInfo.collectedStart
															? format(new Date(product.searchInfo.collectedStart), 'yyyy-MM-dd')
															: undefined
													}
													onChange={(e: any) => {
														product.setSearchInfo({
															...product.searchInfo,

															collectedStart: new Date(`${e.target.value} 00:00:00`).toISOString(),
														});
													}}
												/>

												<Box>~</Box>

												<Input
													width={120}
													type='date'
													value={
														product.searchInfo.collectedEnd
															? format(new Date(product.searchInfo.collectedEnd), 'yyyy-MM-dd')
															: undefined
													}
													onChange={(e: any) => {
														product.setSearchInfo({
															...product.searchInfo,

															collectedEnd: new Date(`${e.target.value} 23:59:59`).toISOString(),
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
														product.searchInfo.registeredStart
															? format(new Date(product.searchInfo.registeredStart), 'yyyy-MM-dd')
															: undefined
													}
													onChange={(e: any) => {
														product.setSearchInfo({
															...product.searchInfo,

															registeredStart: new Date(`${e.target.value} 00:00:00`).toISOString(),
														});
													}}
												/>

												<Box>~</Box>

												<Input
													width={120}
													type='date'
													value={
														product.searchInfo.registeredEnd
															? format(new Date(product.searchInfo.registeredEnd), 'yyyy-MM-dd')
															: undefined
													}
													onChange={(e: any) => {
														product.setSearchInfo({
															...product.searchInfo,

															registeredEnd: new Date(`${e.target.value} 23:59:59`).toISOString(),
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
													value={product.searchInfo.cnyPriceStart ? product.searchInfo.cnyPriceStart : ''}
													onChange={(e: any) => {
														product.setSearchInfo({
															...product.searchInfo,

															cnyPriceStart: parseInt(e.target.value),
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
													value={product.searchInfo.cnyPriceEnd ? product.searchInfo.cnyPriceEnd : ''}
													onChange={(e: any) => {
														product.setSearchInfo({
															...product.searchInfo,

															cnyPriceEnd: parseInt(e.target.value),
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
													id='product_tables_priceStart'
													style={{ width: 120 }}
													options={{
														textAlign: 'right',
													}}
													value={product.searchInfo.cnyRateStart ? product.searchInfo.cnyRateStart : ''}
													onChange={(e: any) => {
														product.setSearchInfo({
															...product.searchInfo,

															cnyRateStart: parseInt(e.target.value),
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
													value={product.searchInfo.cnyRateEnd ? product.searchInfo.cnyRateEnd : ''}
													onChange={(e: any) => {
														product.setSearchInfo({
															...product.searchInfo,

															cnyRateEnd: parseInt(e.target.value),
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
													value={product.searchInfo.localFeeStart ? product.searchInfo.localFeeStart : ''}
													onChange={(e: any) => {
														product.setSearchInfo({
															...product.searchInfo,

															localFeeStart: parseInt(e.target.value),
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
													value={product.searchInfo.localFeeEnd ? product.searchInfo.localFeeEnd : ''}
													onChange={(e: any) => {
														product.setSearchInfo({
															...product.searchInfo,

															localFeeEnd: parseInt(e.target.value),
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
													id='product_tables_priceStart'
													style={{ width: 120 }}
													options={{
														textAlign: 'right',
													}}
													value={product.searchInfo.marginRateStart ? product.searchInfo.marginRateStart : ''}
													onChange={(e: any) => {
														product.setSearchInfo({
															...product.searchInfo,

															marginRateStart: parseInt(e.target.value),
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
													value={product.searchInfo.marginRateEnd ? product.searchInfo.marginRateEnd : ''}
													onChange={(e: any) => {
														product.setSearchInfo({
															...product.searchInfo,

															marginRateEnd: parseInt(e.target.value),
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
													id='product_tables_priceStart'
													style={{ width: 120 }}
													options={{
														textAlign: 'right',
													}}
													value={product.searchInfo.priceStart ? product.searchInfo.priceStart : ''}
													onChange={(e: any) => {
														product.setSearchInfo({
															...product.searchInfo,

															priceStart: parseInt(e.target.value),
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
													value={product.searchInfo.priceEnd ? product.searchInfo.priceEnd : ''}
													onChange={(e: any) => {
														product.setSearchInfo({
															...product.searchInfo,

															priceEnd: parseInt(e.target.value),
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
													id='product_tables_feeStart'
													style={{ width: 120 }}
													options={{
														textAlign: 'right',
													}}
													value={product.searchInfo.feeStart ? product.searchInfo.feeStart : ''}
													onChange={(e: any) => {
														product.setSearchInfo({
															...product.searchInfo,

															feeStart: parseInt(e.target.value),
														});
													}}
												/>

												<Box>~</Box>

												<Input
													id='product_tables_feeEnd'
													style={{ width: 120 }}
													options={{
														textAlign: 'right',
													}}
													value={product.searchInfo.feeEnd ? product.searchInfo.feeEnd : ''}
													onChange={(e: any) => {
														product.setSearchInfo({
															...product.searchInfo,

															feeEnd: parseInt(e.target.value),
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
													value={product.searchInfo.shopName}
													sx={{
														textAlign: 'center',
														fontSize: 13,
														height: 30,
														width: 120,
													}}
													onChange={(e) => {
														product.setSearchInfo({
															...product.searchInfo,

															shopName: e.target.value,
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
													value={product.searchInfo.hasVideo}
													sx={{
														textAlign: 'center',
														fontSize: 13,
														height: 30,
														width: 120,
													}}
													onChange={(e) => {
														product.setSearchInfo({
															...product.searchInfo,

															hasVideo: e.target.value,
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
													value={product.searchInfo.marketName}
													sx={{
														textAlign: 'center',
														fontSize: 13,
														height: 30,
														width: 120,
													}}
													onChange={(e) => {
														product.setSearchInfo({
															...product.searchInfo,

															marketName: e.target.value,
														});
													}}
												>
													<MenuItem value='ALL'>모두보기</MenuItem>

													<MenuItem value='A077'>스마트스토어</MenuItem>

													<MenuItem value='B378'>쿠팡</MenuItem>

													<MenuItem value='A112'>11번가 (글로벌)</MenuItem>

													<MenuItem value='A113'>11번가 (일반)</MenuItem>

													<MenuItem value='A006'>지마켓</MenuItem>

													<MenuItem value='A001'>옥션</MenuItem>

													<MenuItem value='A027'>인터파크</MenuItem>

													<MenuItem value='B719'>위메프</MenuItem>

													<MenuItem value='A524'>롯데온 (글로벌)</MenuItem>

													<MenuItem value='A525'>롯데온 (일반)</MenuItem>

													<MenuItem value='B956'>티몬</MenuItem>
												</Select>

												<Box>▶</Box>

												<Select
													value={product.searchInfo.hasRegistered}
													sx={{
														textAlign: 'center',
														fontSize: 13,
														height: 30,
														width: 120,
													}}
													onChange={(e) => {
														product.setSearchInfo({
															...product.searchInfo,

															hasRegistered: e.target.value,
														});
													}}
												>
													<MenuItem value='ALL'>모두보기</MenuItem>

													<MenuItem value='Y'>등록완료</MenuItem>

													<MenuItem value='N'>등록실패</MenuItem>
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
													value={product.searchInfo.categoryInfo}
													onChange={(e: any, value: any) => {
														product.setSearchInfo({
															...product.searchInfo,

															categoryInfo: value,
														});
													}}
													onInputChange={(e, value, reason) => {
														if (reason !== 'input') {
															return;
														}

														product.setCategoryInput('A077', value);
													}}
													options={
														product.categoryInfo.markets.find((v: any) => v.code === 'A077')!.input
															? product.categoryInfo.markets.find((v: any) => v.code === 'A077')!.data
															: [product.manyCategoryInfo.categoryInfoA077]
													}
													getOptionLabel={(option: any) => option.name ?? ''}
													isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
													onOpen={() => {
														product.getCategoryList('A077');
													}}
													onClose={() => {
														product.setCategoryInput('A077', '');
													}}
													loading={product.categoryInfo.markets.find((v: any) => v.code === 'A077')!.loading}
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
