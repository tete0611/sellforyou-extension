import React from 'react';
import {
	Error as ErrorIcon,
	AutoFixHigh as AutoFixHighIcon,
	Translate as TranslateIcon,
	Lock as LockIcon,
	LockOpen as LockOpenIcon,
	LooksTwoOutlined as LooksTwoOutlinedIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { observer } from 'mobx-react';
import { AppContext } from '../../../../containers/AppContext';
import {
	styled,
	Box,
	Chip,
	Grid,
	IconButton,
	TableCell,
	TableRow,
	Tooltip,
	Typography,
	Button,
	Checkbox,
	CircularProgress,
	Paper,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Image, Input, MyButton, Search } from '../../Common/UI';
import { byteLength, byteSlice, formatToEachShop } from '../../../../../common/function';
import { Item } from '../../../../type/type';
import { SHOPCODE } from '../../../../type/variable';

// 커스텀 테이블 컬럼 스타일
const StyledTableCell = styled(TableCell)({
	textAlign: 'center',
	padding: 0,
	border: 'none',
	fontSize: 14,
});

interface Props {
	item: Item;
	index: number;
	tableRef: any;
}

// 상품목록 테이블 행 뷰
export const Summary = observer((props: Props) => {
	// MobX 스토리지 로드
	const { common, product } = React.useContext(AppContext);
	const {
		AUCTION_1,
		AUCTION_2,
		COUPANG,
		G_MARKET_1,
		G_MARKET_2,
		INTER_PARK,
		LOTTE_ON_GLOBAL,
		LOTTE_ON_NORMAL,
		SMART_STORE,
		STREET11_GLOBAL,
		STREET11_NORMAL,
		TMON,
		WE_MAKE_PRICE,
	} = SHOPCODE;

	// 상품에 변화가 생기면
	const loading = (
		<div className='inform'>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<div className='loading' />
				&nbsp; 상품정보를 저장하는 중입니다...
			</div>
		</div>
	);

	const iconPath = formatToEachShop().iconPath({ shopName: props.item.activeTaobaoProduct.shopName });

	return (
		<>
			{props.item.edited.summary === 2 ? loading : null}
			<TableRow hover>
				<StyledTableCell width={50}>
					<Checkbox
						size='small'
						checked={props.item.checked}
						onChange={(e) => product.toggleItemChecked(props.index, e.target.checked)}
					/>

					<Tooltip title={props.item.collapse ? '상세정보접기' : '상세정보열기'}>
						<IconButton
							size='small'
							onClick={() => {
								product.toggleItemCollapse(props.index);

								props.tableRef.current.recomputeRowHeights();
							}}
						>
							{props.item.collapse ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
						</IconButton>
					</Tooltip>
				</StyledTableCell>

				<StyledTableCell width={90}>
					<Chip
						size='small'
						color='info'
						sx={{ fontSize: 12, width: 85, mb: 1, mr: 1 }}
						label={props.item.productCode}
						onClick={() => {
							navigator.clipboard.writeText(props.item.productCode).then(
								() => alert('클립보드에 복사되었습니다.'),
								() => alert('클립보드에 복사할 수 없습니다.'),
							);
						}}
					/>
					{props.item.state === 6 ? (
						<Chip
							size='small'
							sx={{ fontSize: 13, width: 85, mr: 1 }}
							label={`${format(new Date(props.item.createdAt), 'yy-MM-dd')}`}
						/>
					) : (
						<Chip
							size='small'
							sx={{ fontSize: 13, width: 85, mr: 1 }}
							label={`${format(new Date(props.item.stockUpdatedAt), 'yy-MM-dd')}`}
						/>
					)}
				</StyledTableCell>

				<StyledTableCell width={props.item.state === 7 ? 105 : 82}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							p: 0,
							height: '100%',
							width: '100%',
						}}
						style={{
							boxShadow:
								'0px 2px 14px rgba(2, 136, 209, 0.15), ' +
								'0px -2px 14px rgba(2, 136, 209, 0.15), ' +
								'2px 0px 14px rgba(2, 136, 209, 0.15), ' +
								'-2px 0px 14px rgba(2, 136, 209, 0.15)',
						}}
					>
						<Image
							src={props.item.imageThumbnail[0]}
							width={props.item.state === 7 ? 105 : 82}
							height={props.item.state === 7 ? 105 : 82}
							style={{
								background: 'black',
								objectFit: 'contain',
							}}
							onClick={(e) =>
								product.setImagePopOver({
									element: e.target,
									data: { src: props.item.imageThumbnail[0] },
									open: true,
								})
							}
						/>
					</Box>
				</StyledTableCell>

				<StyledTableCell>
					<Grid container spacing={0.5} style={{ marginLeft: 0 }}>
						<Grid item xs={6} md={4.5}>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									p: 0,
									height: '100%',
									width: '100%',
								}}
							>
								<Input
									color={props.item.edited.summary ? 'warning' : 'info'}
									id={`product_row_title_${props.index}`}
									value={props.item.name}
									onChange={(e: any) => product.setProductName(e.target.value, props.index)}
									onBlur={(e: any) => product.updateProductName(props.index)}
								/>

								<Paper
									variant='outlined'
									sx={{
										ml: 0.5,
										minWidth: 36,
										height: 30,
										p: 0,
									}}
								>
									<Typography
										sx={{
											fontSize: '10px',
										}}
									>
										{props.item.name.length} 자
									</Typography>

									<Typography
										sx={{
											color: common.darkTheme ? 'info.light' : 'info.dark',
											fontSize: '10px',
										}}
									>
										{byteLength(props.item.name)} B
									</Typography>
								</Paper>

								<Tooltip title='상품명최적화(특수문자제거&길이조절)'>
									<Button
										disableElevation
										size='small'
										color='info'
										variant='contained'
										sx={{
											ml: 0.5,
											minWidth: 30,
											height: 30,
											p: 0,
										}}
										onClick={async () => {
											const regExp = /[^가-힣a-zA-Z0-9 ]+/g;
											const name1 = props.item.name.replace(regExp, ' ');
											const name2 = byteSlice(name1, 100);
											const nameList = name2.split(' ');
											const nameListFixed = [...new Set(nameList)];
											const name3 = nameListFixed.join(' ');
											const name4 = name3.replaceAll('  ', ' ');

											product.setProductName(name4, props.index);
											product.updateProductName(props.index);
										}}
									>
										<AutoFixHighIcon fontSize='small' />
									</Button>
								</Tooltip>
							</Box>
						</Grid>

						<Grid
							item
							xs={6}
							md={2.7}
							sx={{
								margin: 'auto',
							}}
						>
							<Grid container spacing={0.5}>
								<Grid
									item
									xs={6}
									md={12}
									sx={{
										margin: 'auto',
									}}
								>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
											p: '4.5px',
										}}
									>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
											}}
										>
											<Tooltip
												title={
													<>
														<img
															style={{ margin: '1px' }}
															src={
																props.item.activeProductStore.find((v: any) => v.siteCode === SMART_STORE && v.inflow)
																	? '/resources/icon-smartstore.png'
																	: '/resources/icon-smartstore-gray.png'
															}
														/>

														<img
															style={{ margin: '1px' }}
															src={
																props.item.activeProductStore.find((v: any) => v.siteCode === COUPANG && v.inflow)
																	? '/resources/icon-coupang.png'
																	: '/resources/icon-coupang-gray.png'
															}
														/>

														<img
															style={{ margin: '1px' }}
															src={
																props.item.activeProductStore.find(
																	(v: any) => v.siteCode === STREET11_GLOBAL && v.inflow,
																)
																	? '/resources/icon-street-global.png'
																	: '/resources/icon-street-global-gray.png'
															}
														/>

														<img
															style={{ margin: '1px' }}
															src={
																props.item.activeProductStore.find(
																	(v: any) => v.siteCode === STREET11_NORMAL && v.inflow,
																)
																	? '/resources/icon-street-normal.png'
																	: '/resources/icon-street-normal-gray.png'
															}
														/>

														<img
															style={{ margin: '1px' }}
															src={
																props.item.activeProductStore.find((v: any) => v.siteCode === G_MARKET_1 && v.inflow)
																	? '/resources/icon-gmarket.png'
																	: '/resources/icon-gmarket-gray.png'
															}
														/>

														<img
															style={{ margin: '1px' }}
															src={
																props.item.activeProductStore.find((v: any) => v.siteCode === AUCTION_1 && v.inflow)
																	? '/resources/icon-auction.png'
																	: '/resources/icon-auction-gray.png'
															}
														/>

														<img
															style={{ margin: '1px' }}
															src={
																props.item.activeProductStore.find((v: any) => v.siteCode === INTER_PARK && v.inflow)
																	? '/resources/icon-interpark.png'
																	: '/resources/icon-interpark-gray.png'
															}
														/>

														<img
															style={{ margin: '1px' }}
															src={
																props.item.activeProductStore.find((v: any) => v.siteCode === WE_MAKE_PRICE && v.inflow)
																	? '/resources/icon-wemakeprice.png'
																	: '/resources/icon-wemakeprice-gray.png'
															}
														/>

														<img
															style={{ margin: '1px' }}
															src={
																props.item.activeProductStore.find(
																	(v: any) => v.siteCode === LOTTE_ON_GLOBAL && v.inflow,
																)
																	? '/resources/icon-lotteon-global.png'
																	: '/resources/icon-lotteon-global-gray.png'
															}
														/>

														<img
															style={{ margin: '1px' }}
															src={
																props.item.activeProductStore.find(
																	(v: any) => v.siteCode === LOTTE_ON_NORMAL && v.inflow,
																)
																	? '/resources/icon-lotteon-normal.png'
																	: '/resources/icon-lotteon-normal-gray.png'
															}
														/>

														<img
															style={{ margin: '1px' }}
															src={
																props.item.activeProductStore.find((v: any) => v.siteCode === TMON && v.inflow)
																	? '/resources/icon-tmon.png'
																	: '/resources/icon-tmon-gray.png'
															}
														/>
													</>
												}
											>
												<Chip
													size='small'
													color={props.item.activeProductStore.some((v) => v.inflow) ? 'success' : 'default'}
													sx={{ fontSize: 12 }}
													label={props.item.activeProductStore.some((v) => v.inflow) ? '추적분석중' : '코드미설치'}
												/>
											</Tooltip>
										</Box>

										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
											}}
										>
											<Typography
												fontSize={13}
												sx={{
													color: common.darkTheme ? 'error.light' : 'error.dark',
													textAlign: 'right',
												}}
											>
												{props.item.activeTaobaoProduct.price.toLocaleString('ko-KR')}
												{formatToEachShop().cny({ shopName: props.item.activeTaobaoProduct.shopName })}
											</Typography>
											&nbsp; / &nbsp;
											<Typography
												fontSize={13}
												sx={{
													color: common.darkTheme ? 'info.light' : 'info.dark',
													textAlign: 'right',
												}}
											>
												{props.item.price.toLocaleString('ko-KR')}원
											</Typography>
										</Box>
									</Box>
								</Grid>
							</Grid>
						</Grid>

						<Grid item xs={6} md={4.8}>
							<Box
								sx={{
									mr: 1,
								}}
							>
								<Search
									value={props.item.categoryInfoA077}
									options={
										product.categoryInfo.markets.find((v) => v.code === SMART_STORE)!.input
											? product.categoryInfo.markets.find((v) => v.code === SMART_STORE)!.data
											: [props.item.categoryInfoA077]
									}
									getOptionLabel={(option: any) => option.name ?? ''}
									isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
									onChange={(e: any, value: any) => product.updateCategoryAuto(value, props.index)}
									onInputChange={(e: any, value: any, reason: string) =>
										reason === 'input' && product.setCategoryInput(SMART_STORE, value)
									}
									onOpen={() => product.getCategoryList(SMART_STORE)}
									onClose={() => product.setCategoryInput(SMART_STORE, '')}
									loading={product.categoryInfo.markets.find((v) => v.code === SMART_STORE)!.loading}
								/>
							</Box>
						</Grid>

						<Grid item xs={6} md={4.5}>
							<Box
								sx={{
									display: 'flex',
									// alignItems: "center",
									marginTop: '6px',
									p: 0,
									// height: "100%",
									// width: "100%",
								}}
							>
								<Box
									sx={{
										display: 'flex',
										// alignItems: "center",
									}}
								>
									<Tooltip title='소싱처링크'>
										<IconButton
											size='small'
											onClick={() => {
												if (props.item.activeTaobaoProduct.shopName === 'temu') {
													// 테무는 보안감지를 피하기 위해 더미 파라미터를 넣어줌
													const refer_page_name = `&refer_page_name=search_result`;
													const refer_page_id = `&refer_page_id=${'10005_1710217424193_1tg3e43ppf'}`;
													const refer_page_sn = `&refer_page_sn=${'10005'}`;

													window.open(
														props.item.activeTaobaoProduct.url + '?' + refer_page_name + refer_page_id + refer_page_sn,
													);
												} else window.open(props.item.activeTaobaoProduct.url);
											}}
										>
											{iconPath ? <img width={16} height={16} src={iconPath} /> : null}
										</IconButton>
									</Tooltip>

									<Tooltip title='동영상링크'>
										<IconButton
											size='small'
											onClick={() =>
												props.item.activeTaobaoProduct.videoUrl && window.open(props.item.activeTaobaoProduct.videoUrl)
											}
										>
											{props.item.activeTaobaoProduct.videoUrl ? (
												<img src='/resources/icon-video.png' />
											) : (
												<img src='/resources/icon-video-gray.png' />
											)}
										</IconButton>
									</Tooltip>
								</Box>

								<Typography
									noWrap
									sx={{
										color: common.darkTheme ? 'info.light' : 'info.dark',
										fontSize: 13,
										maxWidth: 500,
										marginTop: '4px',
									}}
								>
									{props.item.activeTaobaoProduct.name}
								</Typography>
							</Box>
						</Grid>

						<Grid
							item
							xs={6}
							md={2.7}
							sx={{
								// margin: "auto",
								marginTop: '4px',
							}}
						>
							{props.item.state === 7 ? (
								<Box
									sx={{
										display: 'flex',
										flexWrap: 'wrap',
										// alignItems: "center",
										justifyContent: 'right',
										p: '4.5px',
									}}
								>
									<IconButton
										size='small'
										style={{
											padding: 0,
											margin: 1,
										}}
										onClick={() => {
											const connected = props.item.productStore.find(
												(v: any) => v.siteCode === SMART_STORE && v.state === 2,
											);

											if (!connected) return;

											window.open(connected.storeUrl);
										}}
									>
										<img
											src={
												props.item.productStore.find((v) => v.siteCode === SMART_STORE && v.state === 2)
													? '/resources/icon-smartstore.png'
													: '/resources/icon-smartstore-gray.png'
											}
										/>
									</IconButton>

									<IconButton
										size='small'
										style={{
											padding: 0,
											margin: 1,
										}}
										onClick={() => product.updateCoupangUrl(props.index, common.user)}
									>
										<img
											src={
												props.item.productStore.find((v) => v.siteCode === COUPANG && v.state === 2)
													? '/resources/icon-coupang.png'
													: '/resources/icon-coupang-gray.png'
											}
										/>
									</IconButton>

									<IconButton
										size='small'
										style={{
											padding: 0,
											margin: 1,
										}}
										onClick={() => {
											const connected = props.item.productStore.find(
												(v: any) => v.siteCode === STREET11_GLOBAL && v.state === 2,
											);

											if (!connected) return;

											window.open(connected.storeUrl);
										}}
									>
										<img
											src={
												props.item.productStore.find((v) => v.siteCode === STREET11_GLOBAL && v.state === 2)
													? '/resources/icon-street-global.png'
													: '/resources/icon-street-global-gray.png'
											}
										/>
									</IconButton>

									<IconButton
										size='small'
										style={{
											padding: 0,
											margin: 1,
										}}
										onClick={() => {
											const connected = props.item.productStore.find(
												(v: any) => v.siteCode === STREET11_NORMAL && v.state === 2,
											);

											if (!connected) return;

											window.open(connected.storeUrl);
										}}
									>
										<img
											src={
												props.item.productStore.find((v) => v.siteCode === STREET11_NORMAL && v.state === 2)
													? '/resources/icon-street-normal.png'
													: '/resources/icon-street-normal-gray.png'
											}
										/>
									</IconButton>

									<IconButton
										size='small'
										style={{
											padding: 0,
											margin: 1,
										}}
										onClick={() => {
											const connected = props.item.productStore.find(
												(v: any) => v.siteCode === G_MARKET_1 && v.state === 2,
											);

											if (!connected) return;

											window.open(connected.storeUrl);
										}}
									>
										<img
											src={
												props.item.productStore.find((v) => v.siteCode === G_MARKET_1 && v.state === 2)
													? '/resources/icon-gmarket.png'
													: '/resources/icon-gmarket-gray.png'
											}
										/>
									</IconButton>

									<IconButton
										size='small'
										style={{
											padding: 0,
											margin: 1,
										}}
										onClick={() => {
											const connected = props.item.productStore.find(
												(v: any) => v.siteCode === AUCTION_1 && v.state === 2,
											);

											if (!connected) return;

											window.open(connected.storeUrl);
										}}
									>
										<img
											src={
												props.item.productStore.find((v) => v.siteCode === AUCTION_1 && v.state === 2)
													? '/resources/icon-auction.png'
													: '/resources/icon-auction-gray.png'
											}
										/>
									</IconButton>

									<IconButton
										size='small'
										style={{
											padding: 0,
											margin: 1,
										}}
										onClick={() => {
											const connected = props.item.productStore.find(
												(v: any) => v.siteCode === INTER_PARK && v.state === 2,
											);

											if (!connected) return;

											window.open(connected.storeUrl);
										}}
									>
										<img
											src={
												props.item.productStore.find((v) => v.siteCode === INTER_PARK && v.state === 2)
													? '/resources/icon-interpark.png'
													: '/resources/icon-interpark-gray.png'
											}
										/>
									</IconButton>

									<IconButton
										size='small'
										style={{
											padding: 0,
											margin: 1,
										}}
										onClick={() => {
											const connected = props.item.productStore.find(
												(v: any) => v.siteCode === WE_MAKE_PRICE && v.state === 2,
											);

											if (!connected) return;

											window.open(connected.storeUrl);
										}}
									>
										<img
											src={
												props.item.productStore.find((v) => v.siteCode === WE_MAKE_PRICE && v.state === 2)
													? '/resources/icon-wemakeprice.png'
													: '/resources/icon-wemakeprice-gray.png'
											}
										/>
									</IconButton>

									<IconButton
										size='small'
										style={{
											padding: 0,
											margin: 1,
										}}
										onClick={() => {
											const connected = props.item.productStore.find(
												(v: any) => v.siteCode === LOTTE_ON_GLOBAL && v.state === 2,
											);

											if (!connected) return;

											window.open(connected.storeUrl);
										}}
									>
										<img
											src={
												props.item.productStore.find((v) => v.siteCode === LOTTE_ON_GLOBAL && v.state === 2)
													? '/resources/icon-lotteon-global.png'
													: '/resources/icon-lotteon-global-gray.png'
											}
										/>
									</IconButton>

									<IconButton
										size='small'
										style={{
											padding: 0,
											margin: 1,
										}}
										onClick={() => {
											const connected = props.item.productStore.find(
												(v: any) => v.siteCode === LOTTE_ON_NORMAL && v.state === 2,
											);

											if (!connected) return;

											window.open(connected.storeUrl);
										}}
									>
										<img
											src={
												props.item.productStore.find((v) => v.siteCode === LOTTE_ON_NORMAL && v.state === 2)
													? '/resources/icon-lotteon-normal.png'
													: '/resources/icon-lotteon-normal-gray.png'
											}
										/>
									</IconButton>

									<IconButton
										size='small'
										style={{
											padding: 0,
											margin: 1,
										}}
										onClick={() => {
											const connected = props.item.productStore.find((v: any) => v.siteCode === TMON && v.state === 2);

											if (!connected) return;

											window.open(connected.storeUrl);
										}}
									>
										<img
											src={
												props.item.productStore.find((v) => v.siteCode === TMON && v.state === 2)
													? '/resources/icon-tmon.png'
													: '/resources/icon-tmon-gray.png'
											}
										/>
									</IconButton>
								</Box>
							) : null}
						</Grid>

						<Grid item xs={6} md={4.8}>
							<Box
								sx={{
									alignItems: 'center',
									display: 'flex',
									justifyContent: 'right',
								}}
							>
								{/* 주석필요 */}
								{props.item.state === 7 ? (
									<Tooltip title='esm2.0'>
										<LooksTwoOutlinedIcon />
									</Tooltip>
								) : null}
								{props.item.state === 7 ? (
									<Box>
										<IconButton
											size='small'
											style={{
												padding: 0,
												margin: 1,
											}}
											onClick={() => {
												const connected = props.item.productStore.find(
													(v: any) => v.siteCode === G_MARKET_2 && v.state === 2,
												);

												if (!connected) return;

												window.open(connected.storeUrl);
											}}
										>
											<img
												src={
													props.item.productStore.find((v) => v.siteCode === G_MARKET_2 && v.state === 2)
														? '/resources/icon-gmarket.png'
														: '/resources/icon-gmarket-gray.png'
												}
											/>
										</IconButton>

										<IconButton
											size='small'
											style={{
												padding: 0,
												margin: 1,
											}}
											onClick={() => {
												const connected = props.item.productStore.find(
													(v: any) => v.siteCode === AUCTION_2 && v.state === 2,
												);

												if (!connected) return;

												window.open(connected.storeUrl);
											}}
										>
											<img
												src={
													props.item.productStore.find((v) => v.siteCode === AUCTION_2 && v.state === 2)
														? '/resources/icon-auction.png'
														: '/resources/icon-auction-gray.png'
												}
											/>
										</IconButton>
									</Box>
								) : null}

								{props.item.state === 7 ? (
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
										}}
									>
										<IconButton
											size='small'
											onClick={() => {
												if (common.user.purchaseInfo2.level < 3)
													return alert('[프로] 등급부터 사용 가능한 기능입니다.');

												if (props.item.myLock === 2) {
													let test: any = confirm('해당 상품을 정말로 잠금 해제하시겠습니까?');
													if (test)
														product.updateLockProduct(props.index, {
															productId: props.item.id,
															mylock: 1,
														});
												} else
													product.updateLockProduct(props.index, {
														productId: props.item.id,
														mylock: 2,
													});
											}}
										>
											{props.item.myLock === 1 ? <LockOpenIcon /> : <LockIcon />}
										</IconButton>
									</Box>
								) : null}

								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										mr: 0.5,
									}}
								>
									{props.item.productStore.filter((v: any) => v.productStoreLog.length > 0).length > 0 ? (
										<Tooltip title='상품등록/수정 실패내역이 있습니다.'>
											<IconButton
												size='small'
												color='error'
												onClick={() => product.toggleUploadFailedModal(props.index, true)}
											>
												<ErrorIcon />
											</IconButton>
										</Tooltip>
									) : null}

									<Tooltip title='이미지번역을 적용한 이력이 있습니다.'>
										<IconButton disabled={!props.item.isImageTranslated} color='info' size='small'>
											<TranslateIcon fontSize='small' />
										</IconButton>
									</Tooltip>
								</Box>

								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'left',
										mr: 1,
									}}
								>
									<MyButton
										disabled={props.item.error}
										color='warning'
										sx={{
											mr: 0.5,
											minWidth: 60,
										}}
										onClick={async () => {
											await product.checkErrorExist(props.index);

											props.tableRef.current.recomputeRowHeights();
										}}
									>
										{props.item.error ? (
											<>
												<CircularProgress size='1rem' />
											</>
										) : (
											'에러체크'
										)}
									</MyButton>

									<MyButton
										disabled={product.itemInfo.items.find((v) => v.translate)}
										color='secondary'
										sx={{
											mr: 0.5,
											minWidth: 60,
										}}
										onClick={() => {
											if (common.user.purchaseInfo2.level < 3) return alert('[프로] 등급부터 사용 가능한 기능입니다.');

											product.autoImageTranslate(props.index, 0);
										}}
									>
										{props.item.translate ? (
											<>
												<CircularProgress size='1rem' />
											</>
										) : (
											<>자동번역</>
										)}
									</MyButton>

									{props.item.state === 7 ? (
										<MyButton
											color='info'
											sx={{
												mr: 0.5,
												minWidth: 60,
											}}
											onClick={() => {
												common.setEditedUpload(true);

												product.toggleUploadModal(props.index, true);
											}}
										>
											상품수정
										</MyButton>
									) : null}

									<MyButton
										color='info'
										sx={{
											mr: 0.5,
											minWidth: 60,
										}}
										onClick={() => {
											common.setEditedUpload(false);

											product.toggleUploadModal(props.index, true);
										}}
									>
										상품등록
									</MyButton>
									{/* 주석필요 */}

									{/* {props.item.state === 6 ? (
										<MyButton
											color='info'
											sx={{
												mr: 0.5,
												minWidth: 60,
											}}
											onClick={() => {
												common.setEditedUpload(false);

												product.toggleEsm2UploadModal(props.index, true);
											}}
										>
											ESM2.0
										</MyButton>
									) : null} */}

									{props.item.state === 7 ? (
										<MyButton
											disabled={props.item.delete}
											color='error'
											sx={{
												minWidth: 60,
											}}
											onClick={() => {
												if (props.item.myLock === 2) return alert('잠금 상품은 등록해제 불가능 합니다');

												product.toggleUploadDisabledModal(props.index, true, common);
											}}
										>
											{props.item.delete ? (
												<>
													<CircularProgress size='1rem' />
												</>
											) : (
												'등록해제'
											)}
										</MyButton>
									) : (
										<MyButton
											disabled={props.item.delete}
											color='error'
											sx={{
												minWidth: 60,
											}}
											onClick={() => product.deleteProduct(common, props.item.id)}
										>
											{props.item.delete ? (
												<>
													<CircularProgress size='1rem' />
												</>
											) : (
												'상품삭제'
											)}
										</MyButton>
									)}
								</Box>
							</Box>

							{/* {props.item.state === 7 ? (
								<Box
									style={{
										display: 'flex',
										justifyContent: 'flex-end',
										marginRight: '8px',
										margin: '5px',
									}}
								>
									<Button
										disableElevation
										variant='contained'
										color='info'
										sx={{
											ml: 0.5,
											fontSize: 13,
											height: 26,
											px: 0.5,
											py: 0,
										}}
										onClick={() => {
											common.setEditedUpload(true); //수정모드

											product.toggleEsm2UploadModal(props.index, true);
										}}
									>
										상품수정(2.0)
									</Button>

									<Button
										disableElevation
										variant='contained'
										color='info'
										sx={{
											ml: 0.5,
											fontSize: 13,
											height: 26,
											px: 0.5,
											py: 0,
										}}
										onClick={() => {
											common.setEditedUpload(false);

											product.toggleEsm2UploadModal(props.index, true);
										}}
									>
										상품등록(2.0)
									</Button>
									<Button
										disableElevation
										variant='contained'
										color='error'
										sx={{
											ml: 0.5,
											fontSize: 13,
											height: 26,
											px: 0.5,
											py: 0,
										}}
										onClick={() => {
											if (props.item.myLock === 2) {
												alert('잠금 상품은 등록해제 불가능 합니다');
												return;
											}
											product.toggleEsm2UploadDisabledModal(props.index, true, common);
										}}
									>
										{props.item.delete ? (
											<>
												<CircularProgress size='1rem' />
											</>
										) : (
											'등록해제(2.0)'
										)}
									</Button>
								</Box>
							) : null} */}
						</Grid>
					</Grid>
				</StyledTableCell>
			</TableRow>
		</>
	);
});
