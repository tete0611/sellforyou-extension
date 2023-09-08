// import React from 'react';
// import CloseIcon from '@mui/icons-material/Close';

// import { observer } from 'mobx-react';
// import { AppContext } from '../../../containers/AppContext';
// import {
// 	styled,
// 	Box,
// 	Button,
// 	Checkbox,
// 	CircularProgress,
// 	FormControlLabel,
// 	FormControl,
// 	FormHelperText,
// 	Grid,
// 	IconButton,
// 	MenuItem,
// 	Modal,
// 	Paper,
// 	Select,
// 	Tab,
// 	Tabs,
// 	Table,
// 	TableRow,
// 	TableCell,
// 	Typography,
// } from '@mui/material';
// import { request } from '../../Tools/Common';
// import { useTheme } from '@mui/material/styles';
// import { ComboBox, Image } from '../Common/UI';

// // 커스텀 테이블 열 스타일 설정
// const StyledTableCell = styled(TableCell)({
// 	textAlign: 'center',
// 	borderBottom: '1px solid ghostwhite',
// 	padding: 0,
// 	fontSize: 12,
// });

// interface TabPanelProps {
// 	children?: React.ReactNode;
// 	dir?: string;
// 	index: number;
// 	value: number;
// }

// // 탭 뷰 (등록완료 / 등록실패 / 등록중으로 구분)
// function TabPanel(props: TabPanelProps) {
// 	const { children, value, index, ...other } = props;

// 	return (
// 		<div
// 			role='tabpanel'
// 			hidden={value !== index}
// 			id={`full-width-tabpanel-${index}`}
// 			aria-labelledby={`full-width-tab-${index}`}
// 			{...other}
// 		>
// 			{value === index && (
// 				<Box
// 					sx={{
// 						p: 0.5,
// 					}}
// 				>
// 					{children}
// 				</Box>
// 			)}
// 		</div>
// 	);
// }

// // 탭 엘리먼트 속성 동적 처리
// function tabProps(index: number) {
// 	return {
// 		id: `full-width-tab-${index}`,
// 		'aria-controls': `full-width-tabpanel-${index}`,
// 	};
// }

// // 빙글빙글 돌아가는 로딩 아이콘 안에 퍼센테이지와 함께 표기되는 뷰
// function CircularProgressWithLabel(props: any) {
// 	return (
// 		<Box
// 			sx={{
// 				position: 'relative',
// 				display: 'inline-flex',
// 				alignItems: 'center',
// 			}}
// 		>
// 			<CircularProgress variant='determinate' {...props} size='2rem' />

// 			{props.value > 0 ? (
// 				<Box
// 					sx={{
// 						top: 0,
// 						left: 0,
// 						bottom: 0,
// 						right: 0,
// 						position: 'absolute',
// 						display: 'flex',
// 						alignItems: 'center',
// 						justifyContent: 'center',
// 					}}
// 				>
// 					<Typography variant='caption' component='div' fontSize={10} fontWeight='bold'>
// 						{`${Math.round(props.value)}`}
// 					</Typography>
// 				</Box>
// 			) : null}
// 		</Box>
// 	);
// }

// // 상품등록 모달 뷰
// export const Esm2UploadModal = observer(() => {
// 	// MobX 스토리지 로드
// 	const { common, product } = React.useContext(AppContext);
// 	const theme = useTheme();

// 	return (
// 		<Modal open={product.modalInfo.Esm2upload}>
// 			<Paper
// 				className='uploadModal'
// 				sx={{
// 					width: 600,
// 				}}
// 			>
// 				<Box
// 					sx={{
// 						display: 'flex',
// 						justifyContent: 'space-between',
// 						alignItems: 'center',
// 						mb: 3,
// 					}}
// 				>
// 					<Typography fontSize={16} sx={{}}>
// 						{common.uploadInfo.editable ? 'ESM2.0 상품 수정등록' : 'ESM2.0 상품 신규등록'}
// 					</Typography>

// 					<IconButton
// 						size='small'
// 						onClick={() => {
// 							product.toggleEsm2UploadModal(-1, false);
// 						}}
// 					>
// 						<CloseIcon />
// 					</IconButton>
// 				</Box>

// 				<Paper variant='outlined'>
// 					<Tabs
// 						style={{
// 							borderBottom: '1px solid #0000001f',
// 						}}
// 						value={product.modalInfo.Esm2uploadTabIndex}
// 						onChange={(e, value) => {
// 							product.switchEsm2UploadTabs(value);
// 						}}
// 					>
// 						<Tab
// 							label={
// 								<Box
// 									sx={{
// 										display: 'flex',
// 										alignItems: 'center',
// 									}}
// 								>
// 									<Typography fontSize={12} sx={{}}>
// 										{common.uploadInfo.editable ? '수정대기' : '등록대기'}
// 									</Typography>
// 								</Box>
// 							}
// 							{...tabProps(0)}
// 						/>

// 						<Tab
// 							label={
// 								<Box
// 									sx={{
// 										display: 'flex',
// 										alignItems: 'center',
// 									}}
// 								>
// 									<img src={chrome.runtime.getURL('/resources/icon-success.png')} width={16} height={16} />

// 									<Typography
// 										fontSize={12}
// 										sx={{
// 											ml: 1,
// 										}}
// 									>
// 										{common.uploadInfo.editable ? '수정완료' : '등록완료'} (
// 										{
// 											product.registeredInfo.success.filter(
// 												(w: any) => w.site_code === 'A522' || w.site_code === 'A523',
// 											).length
// 										}
// 										)
// 									</Typography>
// 								</Box>
// 							}
// 							{...tabProps(2)}
// 						/>

// 						<Tab
// 							label={
// 								<Box
// 									sx={{
// 										display: 'flex',
// 										alignItems: 'center',
// 									}}
// 								>
// 									<img src={chrome.runtime.getURL('/resources/icon-failed.png')} width={16} height={16} />

// 									<Typography
// 										fontSize={12}
// 										sx={{
// 											ml: 1,
// 										}}
// 									>
// 										{common.uploadInfo.editable ? '수정실패' : '등록실패'} (
// 										{
// 											product.registeredInfo.failed.filter((w: any) => w.site_code === 'A522' || w.site_code === 'A523')
// 												.length
// 										}
// 										)
// 									</Typography>
// 								</Box>
// 							}
// 							{...tabProps(3)}
// 						/>

// 						{product.registeredInfo.wait.filter((w: any) => w.site_code === 'A522' || w.site_code === 'A523').length >
// 						0 ? (
// 							<Tab
// 								label={
// 									<Box
// 										sx={{
// 											display: 'flex',
// 											alignItems: 'center',
// 										}}
// 									>
// 										<CircularProgress size='1rem' />

// 										<Typography
// 											fontSize={12}
// 											sx={{
// 												ml: 1,
// 											}}
// 										>
// 											{common.uploadInfo.editable ? '수정중' : '등록중'} (
// 											{
// 												product.registeredInfo.wait.filter((w: any) => w.site_code === 'A522' || w.site_code === 'A523')
// 													.length
// 											}
// 											)
// 										</Typography>
// 									</Box>
// 								}
// 								{...tabProps(1)}
// 							/>
// 						) : null}
// 					</Tabs>

// 					<TabPanel value={product.modalInfo.Esm2uploadTabIndex} index={0} dir={theme.direction}>
// 						<>
// 							<Paper variant='outlined'>
// 								<Box
// 									sx={{
// 										p: 1,
// 										height: 449,
// 									}}
// 								>
// 									<Table>
// 										<TableRow>
// 											<StyledTableCell
// 												colSpan={3}
// 												sx={{
// 													textAlign: 'left',
// 												}}
// 											>
// 												<FormControlLabel
// 													control={
// 														<Checkbox
// 															size='small'
// 															onChange={(e) => {
// 																common.toggleUploadInfoMarketAll(e.target.checked);
// 															}}
// 														/>
// 													}
// 													label={
// 														<Box
// 															sx={{
// 																display: 'flex',
// 																fontSize: 12,
// 																alignItems: 'center',
// 															}}
// 														>
// 															오픈마켓 전체선택
// 														</Box>
// 													}
// 												/>
// 											</StyledTableCell>

// 											<StyledTableCell
// 												colSpan={3}
// 												sx={{
// 													textAlign: 'left',
// 												}}
// 											>
// 												<FormControlLabel
// 													control={
// 														<Checkbox
// 															size='small'
// 															onChange={(e) => {
// 																common.toggleUploadInfoVideoAll(e.target.checked);
// 															}}
// 														/>
// 													}
// 													label={
// 														<Box
// 															sx={{
// 																display: 'flex',
// 																fontSize: 12,
// 																alignItems: 'center',
// 															}}
// 														>
// 															동영상 전체선택
// 														</Box>
// 													}
// 												/>
// 											</StyledTableCell>
// 										</TableRow>

// 										<TableRow>
// 											<StyledTableCell
// 												width={'30%'}
// 												sx={{
// 													textAlign: 'left',
// 												}}
// 											>
// 												오픈마켓
// 											</StyledTableCell>

// 											<StyledTableCell width={'5%'}>동영상</StyledTableCell>

// 											<StyledTableCell width={'15%'}>상태</StyledTableCell>

// 											<StyledTableCell
// 												width={'30%'}
// 												sx={{
// 													textAlign: 'left',
// 												}}
// 											>
// 												오픈마켓
// 											</StyledTableCell>

// 											<StyledTableCell width={'5%'}>동영상</StyledTableCell>

// 											<StyledTableCell width={'15%'}>상태</StyledTableCell>
// 										</TableRow>

// 										<TableRow>
// 											<StyledTableCell
// 												sx={{
// 													textAlign: 'left',
// 												}}
// 											>
// 												<FormControlLabel
// 													control={
// 														<Checkbox
// 															size='small'
// 															disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A523').disabled}
// 															checked={common.uploadInfo.markets.find((v: any) => v.code === 'A523').upload}
// 															onChange={(e) => {
// 																common.toggleUploadInfoMarket('A523', e.target.checked);
// 															}}
// 														/>
// 													}
// 													label={
// 														<Box
// 															sx={{
// 																display: 'flex',
// 																fontSize: 12,
// 																alignItems: 'center',
// 															}}
// 														>
// 															<img src='/resources/icon-gmarket.png' />
// 															&nbsp; 지마켓 2.0
// 														</Box>
// 													}
// 												/>
// 											</StyledTableCell>

// 											<StyledTableCell>
// 												<Checkbox
// 													size='small'
// 													disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A523').disabled}
// 													checked={common.uploadInfo.markets.find((v: any) => v.code === 'A523').video}
// 													onChange={(e) => {
// 														common.toggleUploadInfoVideo('A523', e.target.checked);
// 													}}
// 												/>
// 											</StyledTableCell>

// 											<StyledTableCell>
// 												{common.uploadInfo.markets.find((v: any) => v.code === 'A523').progress > 0 ? (
// 													<CircularProgressWithLabel
// 														value={common.uploadInfo.markets.find((v: any) => v.code === 'A523').progress}
// 													/>
// 												) : common.uploadInfo.markets.find((v: any) => v.code === 'A523').disabled ? (
// 													<Typography
// 														sx={{
// 															color: 'error.main',
// 															fontSize: 12,
// 														}}
// 													>
// 														{common.uploadInfo.editable ? '수정불가' : '등록불가'}
// 													</Typography>
// 												) : (
// 													<Typography
// 														sx={{
// 															color: 'success.main',
// 															fontSize: 12,
// 														}}
// 													>
// 														{common.uploadInfo.editable ? '수정가능' : '등록가능'}
// 													</Typography>
// 												)}
// 											</StyledTableCell>

// 											<StyledTableCell
// 												sx={{
// 													textAlign: 'left',
// 												}}
// 											>
// 												<FormControlLabel
// 													control={
// 														<Checkbox
// 															size='small'
// 															disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A522').disabled}
// 															checked={common.uploadInfo.markets.find((v: any) => v.code === 'A522').upload}
// 															onChange={(e) => {
// 																common.toggleUploadInfoMarket('A522', e.target.checked);
// 															}}
// 														/>
// 													}
// 													label={
// 														<Box
// 															sx={{
// 																display: 'flex',
// 																fontSize: 12,
// 																alignItems: 'center',
// 															}}
// 														>
// 															<img src='/resources/icon-auction.png' />
// 															&nbsp; 옥션 2.0
// 														</Box>
// 													}
// 												/>
// 											</StyledTableCell>

// 											<StyledTableCell>
// 												<Checkbox
// 													size='small'
// 													disabled={common.uploadInfo.markets.find((v: any) => v.code === 'A522').disabled}
// 													checked={common.uploadInfo.markets.find((v: any) => v.code === 'A522').video}
// 													onChange={(e) => {
// 														common.toggleUploadInfoVideo('A522', e.target.checked);
// 													}}
// 												/>
// 											</StyledTableCell>

// 											<StyledTableCell>
// 												{common.uploadInfo.markets.find((v: any) => v.code === 'A522').progress > 0 ? (
// 													<CircularProgressWithLabel
// 														value={common.uploadInfo.markets.find((v: any) => v.code === 'A522').progress}
// 													/>
// 												) : common.uploadInfo.markets.find((v: any) => v.code === 'A522').disabled ? (
// 													<Typography
// 														sx={{
// 															color: 'error.main',
// 															fontSize: 12,
// 														}}
// 													>
// 														{common.uploadInfo.editable ? '수정불가' : '등록불가'}
// 													</Typography>
// 												) : (
// 													<Typography
// 														sx={{
// 															color: 'success.main',
// 															fontSize: 12,
// 														}}
// 													>
// 														{common.uploadInfo.editable ? '수정가능' : '등록가능'}
// 													</Typography>
// 												)}
// 											</StyledTableCell>
// 										</TableRow>
// 									</Table>
// 								</Box>
// 							</Paper>
// 						</>
// 					</TabPanel>

// 					<TabPanel value={product.modalInfo.Esm2uploadTabIndex} index={1} dir={theme.direction}>
// 						<Box
// 							sx={{
// 								p: 1,
// 								height: 449,
// 								overflowY: 'scroll',
// 							}}
// 						>
// 							{product.registeredInfo.success
// 								.filter((w: any) => w.site_code === 'A522' || w.site_code === 'A523')
// 								.map((v: any) => (
// 									<Box
// 										sx={{
// 											display: 'flex',
// 											alignItems: 'center',
// 											justifyContent: 'space-between',
// 											p: 0,
// 										}}
// 									>
// 										<Grid container spacing={1}>
// 											<Grid
// 												item
// 												xs={6}
// 												md={4}
// 												sx={{
// 													m: 'auto',
// 												}}
// 											>
// 												<Box
// 													sx={{
// 														display: 'flex',
// 														alignItems: 'center',
// 													}}
// 												>
// 													<IconButton
// 														size='small'
// 														sx={{
// 															mr: 1,
// 														}}
// 														onClick={() => {
// 															switch (v.site_code) {
// 																case 'A523': {
// 																	window.open(`http://item.gmarket.co.kr/Item?goodscode=${v.error}`);

// 																	break;
// 																}

// 																case 'A522': {
// 																	window.open(
// 																		`http://itempage3.auction.co.kr/DetailView.aspx?ItemNo=${v.error}&frm3=V2`,
// 																	);

// 																	break;
// 																}

// 																default:
// 																	break;
// 															}
// 														}}
// 													>
// 														{v.site_code === 'A523' ? (
// 															<img src='/resources/icon-gmarket.png' />
// 														) : v.site_code === 'A522' ? (
// 															<img src='/resources/icon-auction.png' />
// 														) : null}
// 													</IconButton>

// 													<Image
// 														src={v.img1}
// 														width={24}
// 														height={24}
// 														style={{
// 															// border: "1px solid lightgray",
// 															background: 'black',
// 															objectFit: 'contain',
// 														}}
// 														onClick={(e) => {
// 															product.setImagePopOver({
// 																element: e.target,
// 																data: { src: v.img1 },
// 																open: true,
// 															});
// 														}}
// 													/>

// 													<Typography
// 														noWrap
// 														sx={{
// 															ml: 1,
// 															fontSize: 12,
// 														}}
// 													>
// 														{v.name3}
// 													</Typography>
// 												</Box>
// 											</Grid>

// 											<Grid
// 												item
// 												xs={6}
// 												md={2}
// 												sx={{
// 													m: 'auto',
// 												}}
// 											>
// 												<Typography
// 													noWrap
// 													sx={{
// 														ml: 1,
// 														fontSize: 12,
// 													}}
// 												>
// 													{v.code}
// 												</Typography>
// 											</Grid>

// 											<Grid
// 												item
// 												xs={6}
// 												md={6}
// 												sx={{
// 													m: 'auto',
// 													justifyContent: 'right',
// 												}}
// 											>
// 												<Typography
// 													sx={{
// 														ml: 1,
// 														fontSize: 12,
// 														textAlign: 'right',
// 													}}
// 												>
// 													상품이 정상 {common.uploadInfo.editable ? '수정' : '등록'}
// 													되었습니다.
// 												</Typography>
// 											</Grid>
// 										</Grid>
// 									</Box>
// 								))}
// 						</Box>
// 					</TabPanel>

// 					<TabPanel value={product.modalInfo.Esm2uploadTabIndex} index={2} dir={theme.direction}>
// 						<Box
// 							sx={{
// 								p: 1,
// 								height: 449,
// 								overflowY: 'scroll',
// 							}}
// 						>
// 							{product.registeredInfo.failed
// 								.filter((w: any) => w.site_code === 'A522' || w.site_code === 'A523')
// 								.map((v: any) => (
// 									<Box
// 										sx={{
// 											display: 'flex',
// 											alignItems: 'center',
// 											justifyContent: 'space-between',
// 											p: 0,
// 										}}
// 									>
// 										<Grid container spacing={1}>
// 											<Grid
// 												item
// 												xs={6}
// 												md={4}
// 												sx={{
// 													m: 'auto',
// 												}}
// 											>
// 												<Box
// 													sx={{
// 														display: 'flex',
// 														alignItems: 'center',
// 													}}
// 												>
// 													<IconButton
// 														size='small'
// 														sx={{
// 															mr: 1,
// 														}}
// 													>
// 														{v.site_code === 'A523' ? (
// 															<img src='/resources/icon-gmarket.png' />
// 														) : v.site_code === 'A522' ? (
// 															<img src='/resources/icon-auction.png' />
// 														) : null}
// 													</IconButton>

// 													<Image
// 														src={v.img1}
// 														width={24}
// 														height={24}
// 														style={{
// 															// border: "1px solid lightgray",
// 															background: 'black',
// 															objectFit: 'contain',
// 														}}
// 														onClick={(e) => {
// 															product.setImagePopOver({
// 																element: e.target,
// 																data: { src: v.img1 },
// 																open: true,
// 															});
// 														}}
// 													/>

// 													<Typography
// 														noWrap
// 														sx={{
// 															ml: 1,
// 															fontSize: 12,
// 														}}
// 													>
// 														{v.name3}
// 													</Typography>
// 												</Box>
// 											</Grid>

// 											<Grid
// 												item
// 												xs={6}
// 												md={2}
// 												sx={{
// 													m: 'auto',
// 												}}
// 											>
// 												<Typography
// 													noWrap
// 													sx={{
// 														ml: 1,
// 														fontSize: 12,
// 													}}
// 												>
// 													{v.code}
// 												</Typography>
// 											</Grid>

// 											<Grid
// 												item
// 												xs={6}
// 												md={6}
// 												sx={{
// 													m: 'auto',
// 													justifyContent: 'right',
// 												}}
// 											>
// 												<Typography
// 													sx={{
// 														ml: 1,
// 														textAlign: 'right',
// 														fontSize: 12,
// 													}}
// 												>
// 													{v.error}
// 												</Typography>
// 											</Grid>
// 										</Grid>
// 									</Box>
// 								))}
// 						</Box>
// 					</TabPanel>

// 					<TabPanel value={product.modalInfo.Esm2uploadTabIndex} index={3} dir={theme.direction}>
// 						<Box
// 							sx={{
// 								p: 1,
// 								height: 449,
// 								overflowY: 'scroll',
// 							}}
// 						>
// 							{product.registeredInfo.wait
// 								.filter((w: any) => w.site_code === 'A522' || w.site_code === 'A523')
// 								.map((v: any) => (
// 									<Box
// 										sx={{
// 											display: 'flex',
// 											alignItems: 'center',
// 											justifyContent: 'space-between',
// 											p: 0,
// 										}}
// 									>
// 										<Grid container spacing={1}>
// 											<Grid
// 												item
// 												xs={6}
// 												md={4}
// 												sx={{
// 													m: 'auto',
// 												}}
// 											>
// 												<Box
// 													sx={{
// 														display: 'flex',
// 														alignItems: 'center',
// 													}}
// 												>
// 													<IconButton
// 														size='small'
// 														sx={{
// 															mr: 1,
// 														}}
// 													>
// 														{v.site_code === 'A523' ? (
// 															<img src='/resources/icon-gmarket.png' />
// 														) : v.site_code === 'A522' ? (
// 															<img src='/resources/icon-auction.png' />
// 														) : null}
// 													</IconButton>

// 													<Image
// 														src={v.img1}
// 														width={24}
// 														height={24}
// 														style={{
// 															// border: "1px solid lightgray",
// 															background: 'black',
// 															objectFit: 'contain',
// 														}}
// 														onClick={(e) => {
// 															product.setImagePopOver({
// 																element: e.target,
// 																data: { src: v.img1 },
// 																open: true,
// 															});
// 														}}
// 													/>

// 													<Typography
// 														noWrap
// 														sx={{
// 															ml: 1,
// 															fontSize: 12,
// 														}}
// 													>
// 														{v.name3}
// 													</Typography>
// 												</Box>
// 											</Grid>

// 											<Grid
// 												item
// 												xs={6}
// 												md={2}
// 												sx={{
// 													m: 'auto',
// 												}}
// 											>
// 												<Typography
// 													noWrap
// 													sx={{
// 														ml: 1,
// 														fontSize: 12,
// 													}}
// 												>
// 													{v.code}
// 												</Typography>
// 											</Grid>

// 											<Grid
// 												item
// 												xs={6}
// 												md={6}
// 												sx={{
// 													m: 'auto',
// 													justifyContent: 'right',
// 												}}
// 											>
// 												<Typography
// 													sx={{
// 														ml: 1,
// 														textAlign: 'right',
// 														fontSize: 12,
// 													}}
// 												>
// 													상품을 {common.uploadInfo.editable ? '수정' : '등록'}
// 													하는 중...
// 												</Typography>
// 											</Grid>
// 										</Grid>
// 									</Box>
// 								))}
// 						</Box>
// 					</TabPanel>
// 				</Paper>

// 				<Paper
// 					variant='outlined'
// 					sx={{
// 						height: 50,
// 						overflowY: 'auto',
// 						mt: 1,
// 						p: 1,
// 					}}
// 				>
// 					{product.uploadConsole
// 						?.filter((w: any) => w.includes('2.0)'))
// 						.map((v: any) => (
// 							<Typography
// 								sx={{
// 									fontSize: 12,
// 								}}
// 							>
// 								{v}
// 							</Typography>
// 						))}
// 				</Paper>

// 				<Box
// 					sx={{
// 						display: 'flex',
// 						alignItems: 'center',
// 						justifyContent: 'center',
// 						mt: 3,
// 					}}
// 				>
// 					{common.uploadInfo.editable ? (
// 						<Button
// 							disabled={!common.uploadInfo.uploadable}
// 							disableElevation
// 							variant='contained'
// 							color='info'
// 							sx={{
// 								width: '33%',
// 								mx: 0.5,
// 							}}
// 							onClick={async () => {
// 								await common.setUploadable(false);

// 								await product.Esm2uploadItems(common, true);
// 							}}
// 						>
// 							{!common.uploadInfo.uploadable && !common.uploadInfo.stopped ? '수정 중...' : '수정'}
// 						</Button>
// 					) : (
// 						<Button
// 							disabled={!common.uploadInfo.uploadable}
// 							disableElevation
// 							variant='contained'
// 							color='info'
// 							sx={{
// 								width: '33%',
// 								mx: 0.5,
// 							}}
// 							onClick={async () => {
// 								await common.setUploadable(false);

// 								await product.Esm2uploadItems(common, false);
// 							}}
// 						>
// 							{!common.uploadInfo.uploadable && !common.uploadInfo.stopped ? '등록 중...' : '등록'}
// 						</Button>
// 					)}

// 					<Button
// 						disabled={common.uploadInfo.stopped}
// 						disableElevation
// 						variant='contained'
// 						color='error'
// 						sx={{
// 							width: '33%',
// 							mx: 0.5,
// 						}}
// 						onClick={async () => {
// 							let accept = confirm(
// 								'상품등록/수정을 중단하시겠습니까? 중단 이전에 등록/수정된 상품은 삭제되지 않을 수 있습니다.',
// 							);

// 							if (accept) {
// 								await common.setStopped(true);
// 							}
// 						}}
// 					>
// 						{!common.uploadInfo.uploadable && common.uploadInfo.stopped ? '중단 중...' : '중단'}
// 					</Button>

// 					<Button
// 						disableElevation
// 						variant='contained'
// 						color='inherit'
// 						sx={{
// 							width: '33%',
// 							mx: 0.5,
// 						}}
// 						onClick={() => {
// 							product.toggleEsm2UploadModal(-1, false);
// 						}}
// 					>
// 						닫기
// 					</Button>
// 				</Box>
// 			</Paper>
// 		</Modal>
// 	);
// });
