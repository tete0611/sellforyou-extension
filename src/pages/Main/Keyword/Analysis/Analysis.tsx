import React from 'react';

import { AppContext } from '../../../../containers/AppContext';
import { observer } from 'mobx-react';
import {
	styled,
	Box,
	Button,
	Container,
	CircularProgress,
	Grid,
	IconButton,
	MenuItem,
	LinearProgress,
	Paper,
	Select,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Typography,
} from '@mui/material';
import { Input, Title } from '../../Common/UI';
import { formatToEachShop } from '../../../../../common/function';

// 커스텀 테이블 컬럼 뷰
const StyledTableCell = styled(TableCell)({
	textAlign: 'center',
	padding: '4px',
	fontSize: 11,
});

// 키워드 분석 뷰
const Analysis = observer(() => {
	// MobX 스토리지 로드
	const { common, analysis } = React.useContext(AppContext);
	const tableHeaderProps = [
		{
			title: '순번',
			width: 25,
		},
		{
			title: '연관키워드',
			width: 100,
		},
		{
			title: '카테고리',
			width: undefined,
		},
		{
			title: '구매처',
			width: 125,
		},
		{
			title: '검색상품수',
			width: 75,
		},
		{
			title: '경쟁률',
			width: 50,
		},
		{
			title: '월간검색수(PC)',
			width: 75,
		},
		{
			title: '월간검색수(모바일)',
			width: 100,
		},
		{
			title: '월평균클릭수(PC)',
			width: 85,
		},
		{
			title: '월평균클릭수(모바일)',
			width: 100,
		},
		{
			title: '월평균클릭률(PC)',
			width: 85,
		},
		{
			title: '월평균클릭률(모바일)',
			width: 100,
		},
		{
			title: '월평균노출광고수',
			width: 100,
		},
		{
			title: '광고경쟁도',
			width: 55,
		},
	];
	const iconButtonElement = [
		{
			url: 'URL_TAOBAO',
			shopName: 'taobao',
		},
		{
			url: 'URL_TMALL',
			shopName: 'tmall',
		},
		{
			url: 'URL_ALIEXPRESS',
			shopName: 'express',
		},
		{
			url: 'URL_1688',
			shopName: 'alibaba',
		},
		{
			url: 'URL_VVIC',
			shopName: 'vvic',
		},
		{
			url: 'URL_TEMU',
			shopName: 'temu',
		},
	];

	return (
		<>
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
					<LinearProgress variant='determinate' value={analysis.searchInfo.progress} />

					<Title dark={common.darkTheme}>
						키워드 분석
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'right',
							}}
						>
							{analysis.searchInfo.progress > 0 ? (
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
									&nbsp; 분석중...
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
									onClick={analysis.searchKeywordByNaver}
								>
									분석 시작
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
											<Typography fontSize={14}>
												연관키워드
												<br />
												노출개수
											</Typography>
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
										<Select
											size='small'
											sx={{
												fontSize: 14,
												width: '100%',
											}}
											defaultValue={analysis.searchInfo.expose}
											onChange={(e) => {
												analysis.setSearchInfo({
													...analysis.searchInfo,

													expose: e.target.value,
												});
											}}
										>
											<MenuItem value={100}>100</MenuItem>
											<MenuItem value={200}>200</MenuItem>
											<MenuItem value={300}>300</MenuItem>
											<MenuItem value={500}>500</MenuItem>
											<MenuItem value={1000}>1000</MenuItem>
										</Select>
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
											<Typography fontSize={14}>
												분석결과
												<br />
												자동저장
											</Typography>
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
										<Select
											size='small'
											sx={{
												fontSize: 14,
												width: '100%',
											}}
											value={analysis.searchInfo.saveAuto}
											onChange={(e) => {
												analysis.setSearchInfo({
													...analysis.searchInfo,

													saveAuto: e.target.value,
												});
											}}
										>
											<MenuItem value={'Y'}>사용</MenuItem>

											<MenuItem value={'N'}>미사용</MenuItem>
										</Select>
									</Grid>
								</Grid>
							</Paper>
						</Grid>

						<Grid item xs={6} md={6}></Grid>

						<Grid item xs={6} md={12}>
							<Input
								id='analysis_keyword'
								placeholder='키워드를 입력해주세요. (복수 입력 시 최대 5개까지 입력 가능, Enter로 구분)'
								multiline
								rows={3}
								onBlur={(e: any) => {
									analysis.setSearchInfo({
										...analysis.searchInfo,

										keyword: e.target.value,
									});
								}}
								defaultValue={analysis.searchInfo.keyword}
							/>
						</Grid>
					</Grid>
				</Paper>

				<Paper variant='outlined'>
					<Title dark={common.darkTheme}>
						키워드 분석결과
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
									analysis.download();
								}}
							>
								분석결과 다운로드
							</Button>
						</Box>
					</Title>

					<Box
						sx={{
							height: common.innerSize.height - 339,
							overflowY: 'auto',
						}}
					>
						{/* 키워드 분석결과 헤더 */}
						<Table size='small' stickyHeader>
							<TableHead>
								<TableRow>
									{tableHeaderProps.map((v, i) => (
										<StyledTableCell
											width={v.width}
											sx={{
												borderLeft: i !== 0 ? '1px solid rgba(0, 0, 0, 0.12)' : '',
											}}
										>
											{v.title}
										</StyledTableCell>
									))}
								</TableRow>
							</TableHead>

							<TableBody>
								{analysis.searchInfo.results.map((v, i) => (
									<TableRow hover key={i}>
										<StyledTableCell>{v['순번']}</StyledTableCell>
										<StyledTableCell
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
												textAlign: 'left',
											}}
										>
											{v['연관키워드']}
										</StyledTableCell>
										<StyledTableCell
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
												textAlign: 'left',
											}}
										>
											{v['카테고리']}
										</StyledTableCell>
										<StyledTableCell
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												{iconButtonElement.map((v2) => (
													<IconButton
														key={v2.shopName}
														size='small'
														onClick={() => {
															window.open(v[v2.url]);
														}}
													>
														<img
															width={16}
															height={16}
															src={formatToEachShop().iconPath({ shopName: v2.shopName }) ?? ''}
														/>
													</IconButton>
												))}
											</Box>
										</StyledTableCell>
										<StyledTableCell
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
												textAlign: 'right',
											}}
										>
											{v['검색상품수'].toLocaleString('ko-KR')}
										</StyledTableCell>
										<StyledTableCell
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
												textAlign: 'right',
											}}
										>
											{v['경쟁률'].toLocaleString('ko-KR')}
										</StyledTableCell>
										<StyledTableCell
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
												textAlign: 'right',
											}}
										>
											{v['월간검색수(PC)'].toLocaleString('ko-KR')}
										</StyledTableCell>
										<StyledTableCell
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
												textAlign: 'right',
											}}
										>
											{v['월간검색수(모바일)'].toLocaleString('ko-KR')}
										</StyledTableCell>
										<StyledTableCell
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
												textAlign: 'right',
											}}
										>
											{v['월평균클릭수(PC)'].toLocaleString('ko-KR')}
										</StyledTableCell>
										<StyledTableCell
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
												textAlign: 'right',
											}}
										>
											{v['월평균클릭수(모바일)'].toLocaleString('ko-KR')}
										</StyledTableCell>
										<StyledTableCell
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
												textAlign: 'right',
											}}
										>
											{v['월평균클릭률(PC)'].toLocaleString('ko-KR')}
										</StyledTableCell>
										<StyledTableCell
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
												textAlign: 'right',
											}}
										>
											{v['월평균클릭률(모바일)'].toLocaleString('ko-KR')}
										</StyledTableCell>
										<StyledTableCell
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
												textAlign: 'right',
											}}
										>
											{v['월평균노출광고수'].toLocaleString('ko-KR')}
										</StyledTableCell>
										<StyledTableCell
											sx={{
												borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
											}}
										>
											{v['광고경쟁정도']}
										</StyledTableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Box>
				</Paper>
			</Container>
		</>
	);
});
export default Analysis;
