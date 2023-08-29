import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { Header } from '../Common/Header';
import {
	styled,
	Box,
	Button,
	Checkbox,
	CircularProgress,
	Container,
	FormControlLabel,
	FormGroup,
	Grid,
	LinearProgress,
	Paper,
	Radio,
	RadioGroup,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Typography,
} from '@mui/material';
import { Frame, Image, Input, Search, Title } from '../Common/UI';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// 커스텀 테이블 컬럼 스타일
const StyledTableCell = styled(TableCell)({
	textAlign: 'center',
	padding: '4px',
	fontSize: 11,
});

// 소싱기 뷰
export const Sourcing = observer(() => {
	// MobX 스토리지 로드
	const { common, sourcing } = React.useContext(AppContext);

	// 다크모드 지원 설정
	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: common.darkTheme ? 'dark' : 'light',
				},
			}),
		[common.darkTheme],
	);

	return (
		<ThemeProvider theme={theme}>
			<Frame dark={common.darkTheme}>
				<Header />

				<Container
					maxWidth={'xl'}
					sx={{
						py: '10px',
					}}
				>
					<Paper
						variant='outlined'
						sx={{
							mb: 1,
						}}
					>
						<LinearProgress variant='determinate' value={sourcing.searchInfo.progress} />

						<Title dark={common.darkTheme}>
							소싱 설정
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'right',
								}}
							>
								{sourcing.searchInfo.progress > 0 ? (
									<Button
										disableElevation
										disabled
										sx={{
											fontSize: 13,
											width: 150,
											height: 30,
										}}
										variant='contained'
									>
										<CircularProgress size='1rem' />
										&nbsp; 소싱중...
									</Button>
								) : (
									<Button
										disableElevation
										color='info'
										sx={{
											fontSize: 13,
											width: 150,
											height: 30,
										}}
										variant='contained'
										onClick={sourcing.searchProduct}
									>
										소싱 시작
									</Button>
								)}
							</Box>
						</Title>

						<Grid
							container
							spacing={1}
							sx={{
								textAlign: 'center',
								p: 1,
							}}
						>
							<Grid
								item
								xs={6}
								md={4.5}
								sx={{
									margin: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
										mb: 0.5,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={6}
											md={3.3}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Typography fontSize={14}>카테고리명</Typography>
											</Box>
										</Grid>

										<Grid
											item
											xs={6}
											md={8.7}
											sx={{
												margin: 'auto',
											}}
										>
											<Search
												value={sourcing.categoryInfo.info}
												onChange={(e: any, value: any) => {
													sourcing.setCategoryInfo(value);
												}}
												onInputChange={(e: any, value: any, reason: any) => {
													if (reason !== 'input') {
														return;
													}

													sourcing.setCategoryInput(value);
												}}
												options={sourcing.categoryInfo.input ? sourcing.categoryInfo.data : []}
												getOptionLabel={(option: any) => option.name ?? ''}
												isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
												onOpen={() => {
													sourcing.getCategoryList();
												}}
												onClose={() => {
													sourcing.setCategoryInput('');
												}}
												loading={sourcing.categoryInfo.loading}
											/>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid
								item
								xs={6}
								md={4.5}
								sx={{
									margin: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
										mb: 0.5,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={6}
											md={3.3}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Typography fontSize={14}>상품명</Typography>
											</Box>
										</Grid>

										<Grid
											item
											xs={6}
											md={8.7}
											sx={{
												margin: 'auto',
											}}
										>
											<Input
												id='sourcing_productName'
												placeholder='상품명을 입력해주세요.'
												onBlur={(e: any) => {
													sourcing.setSearchInfo({
														...sourcing.searchInfo,

														query: e.target.value,
													});
												}}
											/>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid
								item
								xs={6}
								md={3}
								sx={{
									margin: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
										mb: 0.5,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={6}
											md={6}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Typography fontSize={14}>최대상품수</Typography>
											</Box>
										</Grid>

										<Grid
											item
											xs={6}
											md={6}
											sx={{
												margin: 'auto',
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
													id='sourcing_maxCount'
													inputProps={{
														style: {
															textAlign: 'right',
														},
													}}
													defaultValue={sourcing.searchInfo.maxLimits}
													onBlur={(e: any) => {
														sourcing.setSearchInfo({
															...sourcing.searchInfo,

															maxLimits: parseInt(e.target.value),
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
								xs={6}
								md={3}
								sx={{
									margin: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
										mb: 0.5,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={6}
											md={5}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Typography fontSize={14}>등록일</Typography>
											</Box>
										</Grid>

										<Grid
											item
											xs={6}
											md={3}
											sx={{
												margin: 'auto',
											}}
										>
											<Input
												id='sourcing_dateStart'
												placeholder='YYYYMMDD'
												defaultValue={sourcing.searchInfo.dateStart}
												onBlur={(e: any) => {
													sourcing.setSearchInfo({
														...sourcing.searchInfo,

														dateStart: e.target.value,
													});
												}}
											/>
										</Grid>

										<Grid
											item
											xs={6}
											md={1}
											sx={{
												margin: 'auto',
											}}
										>
											~
										</Grid>

										<Grid
											item
											xs={6}
											md={3}
											sx={{
												margin: 'auto',
											}}
										>
											<Input
												id='sourcing_dateEnd'
												placeholder='YYYYMMDD'
												defaultValue={sourcing.searchInfo.dateEnd}
												onBlur={(e: any) => {
													sourcing.setSearchInfo({
														...sourcing.searchInfo,

														dateEnd: e.target.value,
													});
												}}
											/>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid
								item
								xs={6}
								md={3}
								sx={{
									margin: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
										mb: 0.5,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={6}
											md={6}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Typography fontSize={14}>최소구매수</Typography>
											</Box>
										</Grid>

										<Grid
											item
											xs={6}
											md={6}
											sx={{
												margin: 'auto',
											}}
										>
											<Input
												id='sourcing_buyCount'
												inputProps={{
													style: {
														textAlign: 'right',
													},
												}}
												defaultValue={sourcing.searchInfo.purchaseCnt}
												onBlur={(e: any) => {
													sourcing.setSearchInfo({
														...sourcing.searchInfo,

														purchaseCnt: parseInt(e.target.value),
													});
												}}
											/>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid
								item
								xs={6}
								md={3}
								sx={{
									margin: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
										mb: 0.5,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={6}
											md={6}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Typography fontSize={14}>최소리뷰수</Typography>
											</Box>
										</Grid>

										<Grid
											item
											xs={6}
											md={6}
											sx={{
												margin: 'auto',
											}}
										>
											<Input
												id='sourcing_reviewCount'
												inputProps={{
													style: {
														textAlign: 'right',
													},
												}}
												defaultValue={sourcing.searchInfo.reviewCount}
												onBlur={(e: any) => {
													sourcing.setSearchInfo({
														...sourcing.searchInfo,

														reviewCount: parseInt(e.target.value),
													});
												}}
											/>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid
								item
								xs={6}
								md={3}
								sx={{
									margin: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
										mb: 0.5,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={6}
											md={6}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Typography fontSize={14}>최소찜수</Typography>
											</Box>
										</Grid>

										<Grid
											item
											xs={6}
											md={6}
											sx={{
												margin: 'auto',
											}}
										>
											<Input
												id='sourcing_favCount'
												inputProps={{
													style: {
														textAlign: 'right',
													},
												}}
												defaultValue={sourcing.searchInfo.keepCnt}
												onBlur={(e: any) => {
													sourcing.setSearchInfo({
														...sourcing.searchInfo,

														keepCnt: parseInt(e.target.value),
													});
												}}
											/>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid
								item
								xs={6}
								md={3}
								sx={{
									margin: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
										mb: 0.5,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={6}
											md={6}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Typography fontSize={14}>구분</Typography>
											</Box>
										</Grid>

										<Grid
											item
											xs={6}
											md={6}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													height: 60,
												}}
											>
												<RadioGroup
													defaultValue={'total'}
													onChange={(e) => {
														sourcing.setSearchInfo({
															...sourcing.searchInfo,

															productSet: e.target.value,
														});
													}}
												>
													<FormControlLabel
														value='total'
														control={<Radio size='small' />}
														label={
															<Typography
																sx={{
																	fontSize: 14,
																}}
															>
																전체(해외 {'&'} 국내)
															</Typography>
														}
													/>

													<FormControlLabel
														value='overseas'
														control={<Radio size='small' />}
														label={
															<Typography
																sx={{
																	fontSize: 14,
																}}
															>
																해외
															</Typography>
														}
													/>
												</RadioGroup>
											</Box>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid
								item
								xs={6}
								md={3}
								sx={{
									margin: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
										mb: 0.5,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={6}
											md={6}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Typography fontSize={14}>정렬</Typography>
											</Box>
										</Grid>

										<Grid
											item
											xs={6}
											md={6}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													height: 60,
												}}
											>
												<RadioGroup
													defaultValue={'review'}
													onChange={(e) => {
														sourcing.setSearchInfo({
															...sourcing.searchInfo,

															sort: e.target.value,
														});
													}}
												>
													<FormControlLabel
														value='review'
														control={<Radio size='small' />}
														label={
															<Typography
																sx={{
																	fontSize: 14,
																}}
															>
																리뷰순
															</Typography>
														}
													/>

													<FormControlLabel
														value='sold'
														control={<Radio size='small' />}
														label={
															<Typography
																sx={{
																	fontSize: 14,
																}}
															>
																구매순
															</Typography>
														}
													/>
												</RadioGroup>
											</Box>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid
								item
								xs={6}
								md={3}
								sx={{
									margin: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
										mb: 0.5,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={6}
											md={5}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Typography fontSize={14}>쇼핑몰등급</Typography>
											</Box>
										</Grid>

										<Grid
											item
											xs={6}
											md={7}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													height: 60,
												}}
											>
												<FormGroup>
													<FormControlLabel
														control={
															<Checkbox
																defaultChecked
																onChange={(e) => {
																	sourcing.setSearchInfo({
																		...sourcing.searchInfo,

																		includePlatinum: e.target.checked,
																	});
																}}
															/>
														}
														sx={{
															height: 20,
														}}
														label={
															<Typography
																sx={{
																	fontSize: 14,
																}}
															>
																플래티넘
															</Typography>
														}
													/>

													<FormControlLabel
														control={
															<Checkbox
																defaultChecked
																onChange={(e) => {
																	sourcing.setSearchInfo({
																		...sourcing.searchInfo,

																		includePremium: e.target.checked,
																	});
																}}
															/>
														}
														sx={{
															height: 20,
														}}
														label={
															<Typography
																sx={{
																	fontSize: 14,
																}}
															>
																프리미엄
															</Typography>
														}
													/>

													<FormControlLabel
														control={
															<Checkbox
																defaultChecked
																onChange={(e) => {
																	sourcing.setSearchInfo({
																		...sourcing.searchInfo,

																		inclueBigPower: e.target.checked,
																	});
																}}
															/>
														}
														sx={{
															height: 20,
														}}
														label={
															<Typography
																sx={{
																	fontSize: 14,
																}}
															>
																빅파워
															</Typography>
														}
													/>
												</FormGroup>

												<FormGroup>
													<FormControlLabel
														control={
															<Checkbox
																defaultChecked
																onChange={(e) => {
																	sourcing.setSearchInfo({
																		...sourcing.searchInfo,

																		includePower: e.target.checked,
																	});
																}}
															/>
														}
														sx={{
															height: 20,
														}}
														label={
															<Typography
																sx={{
																	fontSize: 14,
																}}
															>
																파워
															</Typography>
														}
													/>

													<FormControlLabel
														control={
															<Checkbox
																defaultChecked
																onChange={(e) => {
																	sourcing.setSearchInfo({
																		...sourcing.searchInfo,

																		includePlant: e.target.checked,
																	});
																}}
															/>
														}
														sx={{
															height: 20,
														}}
														label={
															<Typography
																sx={{
																	fontSize: 14,
																}}
															>
																새싹
															</Typography>
														}
													/>

													<FormControlLabel
														control={
															<Checkbox
																defaultChecked
																onChange={(e) => {
																	sourcing.setSearchInfo({
																		...sourcing.searchInfo,

																		includeSeed: e.target.checked,
																	});
																}}
															/>
														}
														sx={{
															height: 20,
														}}
														label={
															<Typography
																sx={{
																	fontSize: 14,
																}}
															>
																씨앗
															</Typography>
														}
													/>
												</FormGroup>
											</Box>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							<Grid
								item
								xs={6}
								md={3}
								sx={{
									margin: 'auto',
								}}
							>
								<Paper
									variant='outlined'
									sx={{
										p: 1,
										mb: 0.5,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={6}
											md={5}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
												}}
											>
												<Typography fontSize={14}>제외쇼핑몰</Typography>
											</Box>
										</Grid>

										<Grid
											item
											xs={6}
											md={7}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													height: 60,
												}}
											>
												<FormGroup>
													<FormControlLabel
														control={
															<Checkbox
																defaultChecked
																onChange={(e) => {
																	sourcing.setSearchInfo({
																		...sourcing.searchInfo,

																		exceptAliExpress: e.target.checked,
																	});
																}}
															/>
														}
														sx={{
															height: 20,
														}}
														label={
															<Typography
																sx={{
																	fontSize: 14,
																}}
															>
																알리익스프레스
															</Typography>
														}
													/>

													<FormControlLabel
														control={
															<Checkbox
																defaultChecked
																onChange={(e) => {
																	sourcing.setSearchInfo({
																		...sourcing.searchInfo,

																		exceptCoupang: e.target.checked,
																	});
																}}
															/>
														}
														sx={{
															height: 20,
														}}
														label={
															<Typography
																sx={{
																	fontSize: 14,
																}}
															>
																쿠팡
															</Typography>
														}
													/>

													<FormControlLabel
														control={
															<Checkbox
																defaultChecked
																onChange={(e) => {
																	sourcing.setSearchInfo({
																		...sourcing.searchInfo,

																		exceptQooten: e.target.checked,
																	});
																}}
															/>
														}
														sx={{
															height: 20,
														}}
														label={
															<Typography
																sx={{
																	fontSize: 14,
																}}
															>
																쿠텐
															</Typography>
														}
													/>
												</FormGroup>
											</Box>
										</Grid>
									</Grid>
								</Paper>
							</Grid>
						</Grid>
					</Paper>

					<Paper variant='outlined'>
						<Title dark={common.darkTheme}>
							소싱 결과
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'right',
								}}
							>
								<Button
									disableElevation
									color='info'
									sx={{
										fontSize: 13,
										width: 150,
										height: 30,
									}}
									variant='contained'
									onClick={() => {
										sourcing.download();
									}}
								>
									소싱결과 다운로드
								</Button>
							</Box>
						</Title>

						<Box
							sx={{
								height: common.innerSize.height - 383,
								overflowY: 'auto',
							}}
						>
							<Table size='small' stickyHeader>
								<TableHead>
									<TableRow>
										<StyledTableCell width={50}>순번</StyledTableCell>

										<StyledTableCell
											width={50}
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
											}}
										>
											이미지
										</StyledTableCell>

										<StyledTableCell
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
											}}
										>
											상품명
										</StyledTableCell>

										<StyledTableCell
											width={300}
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
											}}
										>
											카테고리
										</StyledTableCell>

										<StyledTableCell
											width={100}
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
											}}
										>
											등록일
										</StyledTableCell>

										<StyledTableCell
											width={50}
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
											}}
										>
											구매
										</StyledTableCell>

										<StyledTableCell
											width={50}
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
											}}
										>
											리뷰
										</StyledTableCell>

										<StyledTableCell
											width={50}
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
											}}
										>
											찜
										</StyledTableCell>

										<StyledTableCell
											width={75}
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
											}}
										>
											가격
										</StyledTableCell>

										<StyledTableCell
											width={100}
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
											}}
										>
											판매처
										</StyledTableCell>

										<StyledTableCell
											width={75}
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
											}}
										>
											등급
										</StyledTableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{sourcing.result.map((v: any) => (
										<>
											<TableRow hover>
												<StyledTableCell>{v.rank}</StyledTableCell>

												<StyledTableCell
													sx={{
														borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
													}}
												>
													<Box
														sx={{
															display: 'flex',
															justifyContent: 'center',
															alignItems: 'center',
														}}
													>
														<Image
															src={v.imageUrl}
															width={30}
															height={30}
															onClick={() => {
																window.open(v.imageUrl);
															}}
														/>
													</Box>
												</StyledTableCell>

												<StyledTableCell
													sx={{
														borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
														textAlign: 'left',
													}}
												>
													<Box
														sx={{
															width: 300,
														}}
													>
														<Typography
															noWrap
															sx={{
																color: 'gray',
																cursor: 'pointer',
																fontSize: 13,
															}}
															onClick={() => {
																window.open(v.crUrl);
															}}
														>
															{v.productName}
														</Typography>
													</Box>
												</StyledTableCell>

												<StyledTableCell
													sx={{
														borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
														textAlign: 'left',
													}}
												>
													<Box
														sx={{
															width: 300,
														}}
													>
														<Typography
															noWrap
															sx={{
																color: 'cornflowerblue',
																cursor: 'pointer',
																fontSize: 13,
															}}
															onClick={() => {
																window.open(v.url);
															}}
														>
															{v.categorySummary}
														</Typography>
													</Box>
												</StyledTableCell>

												<StyledTableCell
													sx={{
														borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
													}}
												>
													{v.time}
												</StyledTableCell>

												<StyledTableCell
													sx={{
														borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
														textAlign: 'right',
													}}
												>
													{v.purchaseCnt?.toLocaleString('ko-KR')}
												</StyledTableCell>

												<StyledTableCell
													sx={{
														borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
														textAlign: 'right',
													}}
												>
													{v.reviewCount?.toLocaleString('ko-KR')}
												</StyledTableCell>

												<StyledTableCell
													sx={{
														borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
														textAlign: 'right',
													}}
												>
													{v.keepCnt?.toLocaleString('ko-KR')}
												</StyledTableCell>

												<StyledTableCell
													sx={{
														borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
														textAlign: 'right',
													}}
												>
													{parseInt(v.price)?.toLocaleString('ko-KR')}
												</StyledTableCell>

												<StyledTableCell
													sx={{
														borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
													}}
												>
													{v.mallName}
												</StyledTableCell>

												<StyledTableCell
													sx={{
														borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
													}}
												>
													{v.mallGrade}
												</StyledTableCell>
											</TableRow>
										</>
									))}
								</TableBody>
							</Table>
						</Box>
					</Paper>
				</Container>
			</Frame>
		</ThemeProvider>
	);
});
