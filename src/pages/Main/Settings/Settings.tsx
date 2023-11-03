import React from 'react';
import gql from '../../../pages/Main/GraphQL/Requests';
import MUTATIONS from '../../../pages/Main/GraphQL/Mutations';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { Header } from '../Common/Header';
import { readFileDataURL } from '../../Tools/Common';
import {
	Box,
	Container,
	Grid,
	IconButton,
	MenuItem,
	Paper,
	Select,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { Frame, Title } from '../Common/UI';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { REG_EXP } from '../../../../common/regex';

// 다른 GQL과 달리 formData 형식으로 백엔드에 요청해야 해서 별도로 구현
async function uploadImage(data: any) {
	// 폼 데이터 객체 생성
	let formData = new FormData();

	// 상단이미지1
	if (data.fixImageTop) {
		let operations = {
			variables: {
				fixImageTop: null,
			},

			query: 'mutation ($fixImageTop: Upload) {\n  updateMyDataByUser(\n    fixImageTop: $fixImageTop\n  )\n}\n',
		};

		let map = { '1': ['variables.fixImageTop'] };

		formData.append('operations', JSON.stringify(operations));
		formData.append('map', JSON.stringify(map));
		formData.append('1', data.fixImageTop, `top1.${data.fixImageTop.name.split('.')[1]}`);
	}

	// 상단이미지2
	if (data.fixImageSubTop) {
		let operations = {
			variables: {
				fixImageSubTop: null,
			},

			query:
				'mutation ($fixImageSubTop: Upload) {\n  updateMyDataByUser(\n    fixImageSubTop: $fixImageSubTop\n  )\n}\n',
		};

		let map = { '1': ['variables.fixImageSubTop'] };

		formData.append('operations', JSON.stringify(operations));
		formData.append('map', JSON.stringify(map));
		formData.append('1', data.fixImageSubTop, `top2.${data.fixImageSubTop.name.split('.')[1]}`);
	}

	// 하단이미지 1
	if (data.fixImageBottom) {
		let operations = {
			variables: {
				fixImageBottom: null,
			},

			query:
				'mutation ($fixImageBottom: Upload) {\n  updateMyDataByUser(\n    fixImageBottom: $fixImageBottom\n  )\n}\n',
		};

		let map = { '1': ['variables.fixImageBottom'] };

		formData.append('operations', JSON.stringify(operations));
		formData.append('map', JSON.stringify(map));
		formData.append('1', data.fixImageBottom, `bottom1.${data.fixImageBottom.name.split('.')[1]}`);
	}

	// 하단이미지 2
	if (data.fixImageSubBottom) {
		let operations = {
			variables: {
				fixImageSubBottom: null,
			},

			query:
				'mutation ($fixImageSubBottom: Upload) {\n  updateMyDataByUser(\n    fixImageSubBottom: $fixImageSubBottom\n  )\n}\n',
		};

		let map = { '1': ['variables.fixImageSubBottom'] };

		formData.append('operations', JSON.stringify(operations));
		formData.append('map', JSON.stringify(map));
		formData.append('1', data.fixImageSubBottom, `bottom2.${data.fixImageSubBottom.name.split('.')[1]}`);
	}

	// 폼데이터 전송
	const response = await gql(null, formData, true);

	if (response.errors) return alert(response.errors[0].message);
}

// 상하단이미지 URL 업로드 방식
async function uploadImageFromUrl(data: any) {
	const response = await gql(MUTATIONS.UPDATE_MY_IMAGE_URL_BY_USER, data, false);

	if (response.errors) return alert(response.errors[0].message);
}

// 기본설정 뷰
export const Settings = observer(() => {
	// MobX 스토리지 로드
	const { common, delivery } = React.useContext(AppContext);
	const { darkTheme, loaded, user, testUserInfo, setUserInfo, deliveryPolicy } = common;
	const { getDeliveryInfo, deliveryList, deliveryData, initDeliveryInfo } = delivery;

	// 사용자 정보 로드
	React.useEffect(() => {
		if (!loaded) return;

		getDeliveryInfo(); // 출고지/반품지 정보 가져오기
	}, [loaded]);

	// 다크모드 지원 설정
	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: darkTheme ? 'dark' : 'light',
				},
			}),
		[darkTheme],
	);

	return (
		<ThemeProvider theme={theme}>
			<Frame dark={darkTheme}>
				<Header />

				<Container
					maxWidth={'lg'}
					sx={{
						py: '10px',
					}}
				>
					{user.userInfo ? (
						<>
							<Paper variant='outlined'>
								<Title dark={darkTheme}>개인 분류</Title>
								<Grid
									container
									spacing={1}
									sx={{
										textAlign: 'center',
										p: 1,
									}}
								>
									<Grid item xs={6} md={12}>
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
													md={1}
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
														<Typography fontSize={14}>개인 분류</Typography>
													</Box>
												</Grid>

												<Grid
													item
													xs={6}
													md={11}
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
														<TextField
															id='views_keywardMemo'
															size='small'
															variant='outlined'
															sx={{
																width: '100%',
															}}
															inputProps={{
																readOnly: true,
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																	overflow: 'auto',
																},
															}}
															value={`${user.keywardMemo === null ? '설정된 키워드가 없습니다. ' : user.keywardMemo}`}
														/>
														{/* {user.keywardMemo && (
															<IconButton
																size='small'
																color='error'
																component='span'
																onClick={async () => {
																	if (
																		confirm(
																			'개인 분류를 비우시겠습니까?\n상품에 등록되어있는 개인분류는 삭제되지않습니다.',
																		)
																	)
																		await common.resetKeywardList({ userId: common.user.id });
																}}
															>
																<DeleteIcon />
															</IconButton>
														)} */}
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>
								</Grid>
							</Paper>
							<Paper
								variant='outlined'
								sx={{
									mb: 1,
								}}
							>
								<Title dark={darkTheme}>구매처 환율 설정</Title>

								<Grid
									container
									spacing={1}
									sx={{
										textAlign: 'center',
										p: 1,
									}}
								>
									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>위안화 환율</Typography>

														<Tooltip title='위안화인 경우 원화로 환산될 단위를 설정합니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<TextField
															id='settings_cnyRate'
															size='small'
															variant='outlined'
															sx={{
																width: 100,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={`${user.userInfo?.cnyRate}`}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value))) return alert('[환율] 숫자만 입력하실 수 있습니다.');

																const cnyRate = parseInt(e.target.value);

																await testUserInfo({ cnyRate });
																setUserInfo({ ...user.userInfo, cnyRate });
															}}
														/>
														<Typography fontSize={14}>원</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>달러화 환율</Typography>

														<Tooltip title='달러화인 경우 원화로 환산될 단위를 설정합니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<TextField
															id='settings_cnyRate'
															size='small'
															variant='outlined'
															sx={{
																width: 100,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={`${user.userInfo?.cnyRateDollar}`}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value))) return alert('[환율] 숫자만 입력하실 수 있습니다.');

																const cnyRateDollar = parseInt(e.target.value);

																await testUserInfo({ cnyRateDollar });
																setUserInfo({ ...user.userInfo, cnyRateDollar });
															}}
														/>
														<Typography fontSize={14}>원</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>유로화 환율</Typography>

														<Tooltip title='유로화인 경우 원화로 환산될 단위를 설정합니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<TextField
															id='settings_cnyRate'
															size='small'
															variant='outlined'
															sx={{
																width: 100,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={`${user.userInfo?.cnyRateEuro}`}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value))) return alert('[환율] 숫자만 입력하실 수 있습니다.');

																const cnyRateEuro = parseInt(e.target.value);

																await testUserInfo({ cnyRateEuro });
																setUserInfo({ ...user.userInfo, cnyRateEuro });
															}}
														/>
														<Typography fontSize={14}>원</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>엔화 환율</Typography>

														<Tooltip title='엔화인 경우 원화로 환산될 단위를 설정합니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<TextField
															id='settings_cnyRate'
															size='small'
															variant='outlined'
															sx={{
																width: 100,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={`${user.userInfo?.cnyRateYen}`}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value))) return alert('[환율] 숫자만 입력하실 수 있습니다.');

																const cnyRateYen = parseInt(e.target.value);

																await testUserInfo({ cnyRateYen });
																setUserInfo({ ...user.userInfo, cnyRateYen });
															}}
														/>
														<Typography fontSize={14}>원</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>
								</Grid>
							</Paper>

							<Paper
								variant='outlined'
								sx={{
									mb: 1,
								}}
							>
								<Title dark={darkTheme}>공통 설정</Title>

								<Grid
									container
									spacing={1}
									sx={{
										textAlign: 'center',
										p: 1,
									}}
								>
									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>배대지배송비</Typography>

														<Tooltip title='배대지까지의 운송비용을 설정합니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<TextField
															id='settings_defaultShippingFee'
															size='small'
															variant='outlined'
															sx={{
																width: 100,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={`${user.userInfo?.defaultShippingFee}`}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[배대지배송비] 숫자만 입력하실 수 있습니다.');

																const defaultShippingFee = parseInt(e.target.value);

																await testUserInfo({ defaultShippingFee });
																setUserInfo({ ...user.userInfo, defaultShippingFee });
															}}
														/>
														<Typography fontSize={14}>원</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>마진율</Typography>

														<Tooltip title='원화 + 배대지배송비 기준 추가 마진 금액을 설정합니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<TextField
															id='settings_marginRate'
															size='small'
															variant='outlined'
															sx={{
																width: 60,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={`${user.userInfo?.marginRate}`}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[마진율] 숫자만 입력하실 수 있습니다.');

																const marginRate = parseInt(e.target.value);

																await testUserInfo({ marginRate });
																setUserInfo({ ...user.userInfo, marginRate });
															}}
														/>
														&nbsp;
														<Select
															size='small'
															sx={{
																fontSize: 14,
																width: 60,
															}}
															value={user.userInfo?.marginUnitType}
															onChange={async (e) => {
																const marginUnitType = e.target.value;

																if (!marginUnitType) return alert('[마진단위] 입력이 잘못되었습니다.');

																await testUserInfo({ marginUnitType });
																setUserInfo({ ...user.userInfo, marginUnitType });
															}}
														>
															<MenuItem value='PERCENT'>%</MenuItem>
															<MenuItem value='WON'>원</MenuItem>
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>기본할인가</Typography>

														<Tooltip title='오픈마켓에 표시할 할인금액을 설정합니다. (0 입력 시 미적용)'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<TextField
															id='settings_discountAmount'
															size='small'
															variant='outlined'
															sx={{
																width: 60,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={`${user.userInfo?.discountAmount}`}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[기본할인가] 숫자만 입력하실 수 있습니다.');

																const discountAmount = parseInt(e.target.value);

																await testUserInfo({ discountAmount });
																setUserInfo({ ...user.userInfo, discountAmount });
															}}
														/>
														&nbsp;
														<Select
															size='small'
															sx={{
																fontSize: 14,
																width: 60,
															}}
															value={user.userInfo?.discountUnitType}
															onChange={async (e) => {
																if (!e.target.value) return alert('[기본할인가단위] 입력이 잘못되었습니다.');

																const discountUnitType = e.target.value;

																await testUserInfo({ discountUnitType });
																setUserInfo({ ...user.userInfo, discountUnitType });
															}}
														>
															<MenuItem value='PERCENT'>%</MenuItem>
															<MenuItem value='WON'>원</MenuItem>
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>유료배송비</Typography>

														<Tooltip title='오픈마켓에 표시할 배송비를 설정합니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<TextField
															id='settings_extraShippingFee'
															size='small'
															variant='outlined'
															sx={{
																width: 100,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={`${user.userInfo?.extraShippingFee}`}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[유료배송비] 숫자만 입력하실 수 있습니다.');

																const extraShippingFee = parseInt(e.target.value);

																await testUserInfo({ extraShippingFee });
																setUserInfo({ ...user.userInfo, extraShippingFee });
															}}
														/>
														<Typography fontSize={14}>원</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>반품배송비</Typography>
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
														<TextField
															id='settings_refundShippingFee'
															size='small'
															variant='outlined'
															sx={{
																width: 100,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={`${user.userInfo?.refundShippingFee}`}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[반품배송비] 숫자만 입력하실 수 있습니다.');

																const refundShippingFee = parseInt(e.target.value);

																await testUserInfo({ refundShippingFee });
																setUserInfo({ ...user.userInfo, refundShippingFee });
															}}
														/>
														<Typography fontSize={14}>원</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>교환배송비</Typography>
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
														<TextField
															id='settings_exchangeShippingFee'
															size='small'
															variant='outlined'
															sx={{
																width: 100,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={`${user.userInfo?.exchangeShippingFee}`}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[교환배송비] 숫자만 입력하실 수 있습니다.');

																const exchangeShippingFee = parseInt(e.target.value);

																await testUserInfo({ exchangeShippingFee });
																setUserInfo({ ...user.userInfo, exchangeShippingFee });
															}}
														/>
														<Typography fontSize={14}>원</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>제주/도서배송비</Typography>
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
														<TextField
															id='settings_additionalShippingFeeJeju'
															size='small'
															variant='outlined'
															sx={{
																width: 100,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={`${user.userInfo?.additionalShippingFeeJeju}`}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[제주/도서배송비] 숫자만 입력하실 수 있습니다.');

																const additionalShippingFeeJeju = parseInt(e.target.value);

																await testUserInfo({ additionalShippingFeeJeju });
																setUserInfo({ ...user.userInfo, additionalShippingFeeJeju });
															}}
														/>
														<Typography fontSize={14}>원</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>재고수량</Typography>
														<Tooltip title='상품 수집 시 고정 재고수량을 설정합니다. (0 입력 시 자동설정)'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<TextField
															id='settings_collectStock'
															size='small'
															variant='outlined'
															sx={{
																width: 100,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={`${user.userInfo?.collectStock}`}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value))) return alert('[재고수량] 입력이 잘못되었습니다.');

																const collectStock = parseInt(e.target.value);

																await testUserInfo({ collectStock });
																setUserInfo({ ...user.userInfo, collectStock });
															}}
														/>
														<Typography fontSize={14}>개</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>A/S전화번호</Typography>
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
														<TextField
															id='settings_asTel'
															size='small'
															variant='outlined'
															sx={{
																width: '100%',
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																},
															}}
															defaultValue={`${user.userInfo?.asTel}`}
															onBlur={async (e) => {
																if (!e.target.value) return alert('[A/S전화번호] 입력이 잘못되었습니다.');

																const asTel = e.target.value;

																await testUserInfo({ asTel });
																setUserInfo({ ...user.userInfo, asTel });
															}}
														/>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={9}>
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
													md={1.9}
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
														<Typography fontSize={14}>A/S안내내용</Typography>
													</Box>
												</Grid>

												<Grid
													item
													xs={6}
													md={10.1}
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
														<TextField
															id='settings_asInformation'
															size='small'
															variant='outlined'
															sx={{
																width: '100%',
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																},
															}}
															defaultValue={`${user.userInfo?.asInformation}`}
															onBlur={async (e) => {
																if (!e.target.value) return alert('[A/S안내내용] 입력이 잘못되었습니다.');

																const asInformation = e.target.value;

																await testUserInfo({ asInformation });
																setUserInfo({ ...user.userInfo, asInformation });
															}}
														/>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>상단이미지1</Typography>
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
														}}
													>
														<a target='_blank' href={user.userInfo?.fixImageTop ?? ''}>
															<img
																src={user.userInfo?.fixImageTop ?? ''}
																width={126}
																height={126}
																style={{
																	objectFit: 'contain',
																}}
															/>
														</a>
													</Box>

													<Paper
														variant='outlined'
														sx={{
															display: 'flex',
															justifyContent: 'center',
														}}
													>
														<label htmlFor='fixImageTop'>
															<input
																accept='image/*'
																id='fixImageTop'
																type='file'
																style={{
																	display: 'none',
																}}
																onChange={async (e) => {
																	const fileList = e.target.files ?? [];
																	const fileData = (await readFileDataURL(fileList[0])) as string;

																	await uploadImage({ fixImageTop: fileList[0] });

																	setUserInfo({
																		...user.userInfo,
																		fixImageTop: fileData,
																	});
																}}
															/>
															<IconButton size='small' color='info' component='span'>
																<InsertPhotoIcon />
															</IconButton>
														</label>

														<IconButton
															size='small'
															component='span'
															onClick={async () => {
																const url = prompt('이미지 URL을 입력해주세요.');
																if (!url) return;
																else if (!REG_EXP.url.test(url)) return alert('주소가 올바르지 않습니다.');

																await uploadImageFromUrl({ fixImageTop: url });

																setUserInfo({
																	...user.userInfo,
																	fixImageTop: url,
																});
															}}
														>
															<LinkIcon />
														</IconButton>

														<IconButton
															size='small'
															color='error'
															component='span'
															onClick={async () => {
																await testUserInfo({ fixImageTop: null });

																setUserInfo({ ...user.userInfo, fixImageTop: null });
															}}
														>
															<DeleteIcon />
														</IconButton>
													</Paper>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>상단이미지2</Typography>
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
														}}
													>
														<a target='_blank' href={user.userInfo?.fixImageSubTop ?? ''}>
															<img
																src={user.userInfo?.fixImageSubTop ?? ''}
																width={126}
																height={126}
																style={{
																	objectFit: 'contain',
																}}
															/>
														</a>
													</Box>

													<Paper
														variant='outlined'
														sx={{
															display: 'flex',
															justifyContent: 'center',
														}}
													>
														<label htmlFor='fixImageSubTop'>
															<input
																accept='image/*'
																id='fixImageSubTop'
																type='file'
																style={{
																	display: 'none',
																}}
																onChange={async (e) => {
																	const fileList = e.target.files ?? [];
																	const fileData = (await readFileDataURL(fileList[0])) as string;

																	await uploadImage({ fixImageSubTop: fileList[0] });

																	setUserInfo({
																		...user.userInfo,
																		fixImageSubTop: fileData,
																	});
																}}
															/>
															<IconButton size='small' color='info' component='span'>
																<InsertPhotoIcon />
															</IconButton>
														</label>

														<IconButton
															size='small'
															component='span'
															onClick={async () => {
																const url = prompt('이미지 URL을 입력해주세요.');
																if (!url) return;
																else if (!REG_EXP.url.test(url)) return alert('주소가 올바르지 않습니다.');

																await uploadImageFromUrl({ fixImageSubTop: url });

																setUserInfo({
																	...user.userInfo,
																	fixImageSubTop: url,
																});
															}}
														>
															<LinkIcon />
														</IconButton>

														<IconButton
															size='small'
															color='error'
															component='span'
															onClick={async () => {
																await testUserInfo({ fixImageSubTop: null });

																setUserInfo({ ...user.userInfo, fixImageSubTop: null });
															}}
														>
															<DeleteIcon />
														</IconButton>
													</Paper>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>하단이미지1</Typography>
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
														}}
													>
														<a target='_blank' href={user.userInfo?.fixImageBottom ?? ''}>
															<img
																src={user.userInfo?.fixImageBottom ?? ''}
																width={126}
																height={126}
																style={{
																	objectFit: 'contain',
																}}
															/>
														</a>
													</Box>

													<Paper
														variant='outlined'
														sx={{
															display: 'flex',
															justifyContent: 'center',
														}}
													>
														<label htmlFor='fixImageBottom'>
															<input
																accept='image/*'
																id='fixImageBottom'
																type='file'
																style={{
																	display: 'none',
																}}
																onChange={async (e) => {
																	const fileList = e.target.files ?? [];
																	const fileData = (await readFileDataURL(fileList[0])) as string;

																	await uploadImage({ fixImageBottom: fileList[0] });

																	setUserInfo({
																		...user.userInfo,
																		fixImageBottom: fileData,
																	});
																}}
															/>
															<IconButton size='small' color='info' component='span'>
																<InsertPhotoIcon />
															</IconButton>
														</label>

														<IconButton
															size='small'
															component='span'
															onClick={async () => {
																const url = prompt('이미지 URL을 입력해주세요.');
																if (!url) return;
																else if (!REG_EXP.url.test(url)) return alert('주소가 올바르지 않습니다.');

																await uploadImageFromUrl({ fixImageBottom: url });

																setUserInfo({
																	...user.userInfo,
																	fixImageBottom: url,
																});
															}}
														>
															<LinkIcon />
														</IconButton>

														<IconButton
															size='small'
															color='error'
															component='span'
															onClick={async () => {
																await testUserInfo({ fixImageBottom: null });

																setUserInfo({ ...user.userInfo, fixImageBottom: null });
															}}
														>
															<DeleteIcon />
														</IconButton>
													</Paper>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>하단이미지2</Typography>
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
														}}
													>
														<a target='_blank' href={user.userInfo?.fixImageSubBottom ?? ''}>
															<img
																src={user.userInfo?.fixImageSubBottom ?? ''}
																width={126}
																height={126}
																style={{
																	objectFit: 'contain',
																}}
															/>
														</a>
													</Box>

													<Paper
														variant='outlined'
														sx={{
															display: 'flex',
															justifyContent: 'center',
														}}
													>
														<label htmlFor='fixImageSubBottom'>
															<input
																accept='image/*'
																id='fixImageSubBottom'
																type='file'
																style={{
																	display: 'none',
																}}
																onChange={async (e) => {
																	const fileList = e.target.files ?? [];
																	const fileData = (await readFileDataURL(fileList[0])) as string;

																	await uploadImage({ fixImageSubBottom: fileList[0] });

																	setUserInfo({
																		...user.userInfo,
																		fixImageSubBottom: fileData,
																	});
																}}
															/>
															<IconButton size='small' color='info' component='span'>
																<InsertPhotoIcon />
															</IconButton>
														</label>

														<IconButton
															size='small'
															component='span'
															onClick={async () => {
																const url = prompt('이미지 URL을 입력해주세요.');
																if (!url) return;
																else if (!REG_EXP.url.test(url)) return alert('주소가 올바르지 않습니다.');

																await uploadImageFromUrl({ fixImageSubBottom: url });

																setUserInfo({
																	...user.userInfo,
																	fixImageSubBottom: url,
																});
															}}
														>
															<LinkIcon />
														</IconButton>

														<IconButton
															size='small'
															color='error'
															component='span'
															onClick={async () => {
																await testUserInfo({ fixImageSubBottom: null });

																setUserInfo({ ...user.userInfo, fixImageSubBottom: null });
															}}
														>
															<DeleteIcon />
														</IconButton>
													</Paper>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
															상세페이지
															<br />
															옵션위치
														</Typography>

														<Tooltip title='상세페이지에 옵션을 표시할 위치를 설정합니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={user.userInfo?.optionAlignTop ?? ''}
															onChange={async (e) => {
																const optionAlignTop = e.target.value;

																if (!optionAlignTop) return alert('[상세페이지옵션위치] 입력이 잘못되었습니다.');

																await testUserInfo({ optionAlignTop });
																setUserInfo({ ...user.userInfo, optionAlignTop });
															}}
														>
															<MenuItem value={'Y'}>상단</MenuItem>
															<MenuItem value={'N'}>하단</MenuItem>
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
															상세페이지
															<br />
															상품명표시
														</Typography>

														<Tooltip title='상세페이지 상단에 상품명을 표기할 수 있습니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={user.userInfo?.descriptionShowTitle ?? ''}
															onChange={async (e) => {
																const descriptionShowTitle = e.target.value;

																if (!descriptionShowTitle)
																	return alert('[상세페이지상품명표시] 입력이 잘못되었습니다.');

																await testUserInfo({ descriptionShowTitle });
																setUserInfo({ ...user.userInfo, descriptionShowTitle });
															}}
														>
															<MenuItem value={'Y'}>사용</MenuItem>
															<MenuItem value={'N'}>사용안함</MenuItem>
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
															옵션정보
															<br />
															안내문구
														</Typography>

														<Tooltip title='옵션정보 상단에 안내문구를 표시합니다. (예: 옵션 설명입니다.)'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={user.userInfo?.useDetailInformation ?? ''}
															onChange={async (e) => {
																const useDetailInformation = e.target.value;

																if (!useDetailInformation)
																	return alert('[옵션정보안내문구표시] 입력이 잘못되었습니다.');

																await testUserInfo({ useDetailInformation });
																setUserInfo({ ...user.userInfo, useDetailInformation });
															}}
														>
															<MenuItem value={'Y'}>사용</MenuItem>
															<MenuItem value={'N'}>사용안함</MenuItem>
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
															옵션정보
															<br />
															표기방식
														</Typography>

														<Tooltip title='옵션을 표기할 방식을 설정합니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={user.userInfo?.optionIndexType}
															onChange={async (e) => {
																const optionIndexType = Number(e.target.value);

																if (!optionIndexType) return alert('[옵션정보표기방식] 입력이 잘못되었습니다.');

																await testUserInfo({ optionIndexType });
																setUserInfo({ ...user.userInfo, optionIndexType });
															}}
														>
															<MenuItem value={1}>숫자 + 옵션명</MenuItem>
															<MenuItem value={2}>옵션명만 사용</MenuItem>
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
															옵션정보
															<br />
															배치형식
														</Typography>

														<Tooltip title='옵션을 배치할 레이아웃을 설정합니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={user.userInfo?.optionTwoWays ?? ''}
															onChange={async (e) => {
																const optionTwoWays = e.target.value;

																if (!optionTwoWays) return;
																alert('[옵션정보배치형식] 입력이 잘못되었습니다.');

																await testUserInfo({ optionTwoWays });
																setUserInfo({ ...user.userInfo, optionTwoWays });
															}}
														>
															<MenuItem value={'N'}>1열</MenuItem>
															<MenuItem value={'Y'}>2열</MenuItem>
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
															옵션가격
															<br />
															자동설정
														</Typography>

														<Tooltip title='오픈마켓 가격 허용범위를 초과하는 옵션을 자동으로 탐색합니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={user.userInfo?.autoPrice ?? ''}
															onChange={async (e) => {
																const autoPrice = e.target.value;

																if (!autoPrice) return alert('[옵션가격자동설정] 입력이 잘못되었습니다.');

																await testUserInfo({ autoPrice });
																setUserInfo({ ...user.userInfo, autoPrice });
															}}
														>
															<MenuItem value={'Y'}>사용</MenuItem>
															<MenuItem value={'N'}>사용안함</MenuItem>
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
															판매가격
															<br />
															노출설정
														</Typography>

														<Tooltip title='상품에 표시되는 기준가격을 설정합니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={user.userInfo?.defaultPrice ?? ''}
															onChange={async (e) => {
																const defaultPrice = e.target.value;

																if (!defaultPrice) return alert('[판매가격노출설정] 입력이 잘못되었습니다.');

																await testUserInfo({ defaultPrice });
																setUserInfo({ ...user.userInfo, defaultPrice });
															}}
														>
															<MenuItem value={'L'}>최저가격</MenuItem>
															<MenuItem value={'M'}>중간가격</MenuItem>
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
															판매가격
															<br />
															환산단위
														</Typography>

														<Tooltip title='환산될 단위를 설정합니다. (오픈마켓 등록 시 올림으로 처리)'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={user.userInfo?.calculateWonType ?? ''}
															onChange={async (e) => {
																const calculateWonType = e.target.value;

																if (!calculateWonType) return alert('[판매가격설정단위] 입력이 잘못되었습니다.');

																await testUserInfo({ calculateWonType });
																setUserInfo({ ...user.userInfo, calculateWonType });
															}}
														>
															<MenuItem value={'100'}>100원</MenuItem>
															<MenuItem value={'500'}>500원</MenuItem>
															<MenuItem value={'1000'}>1000원</MenuItem>
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>
								</Grid>
							</Paper>

							<Paper
								variant='outlined'
								sx={{
									mb: 1,
								}}
							>
								<Title dark={darkTheme}>수집 설정</Title>

								<Grid
									container
									spacing={1}
									sx={{
										textAlign: 'center',
										p: 1,
									}}
								>
									<Grid item xs={6} md={3}>
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
															상품수집
															<br />
															제한시간
														</Typography>

														<Tooltip title='상품 수집 시 최대 대기시간을 설정합니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<TextField
															id='settings_collectTimeout'
															size='small'
															variant='outlined'
															sx={{
																width: 100,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={`${user.userInfo?.collectTimeout}`}
															onBlur={async (e) => {
																const collectTimeout = parseInt(e.target.value);

																if (isNaN(collectTimeout)) return alert('[상품수집제한시간] 입력이 잘못되었습니다.');

																await testUserInfo({ collectTimeout });
																setUserInfo({ ...user.userInfo, collectTimeout });
															}}
														/>

														<Typography fontSize={14}>초</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
															대량수집
															<br />
															체크위치
														</Typography>

														<Tooltip title='대량수집 목록 선택 시 체크버튼이 나타날 위치를 설정합니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={user.userInfo?.collectCheckPosition ?? ''}
															onChange={async (e) => {
																const collectCheckPosition = e.target.value;

																if (!collectCheckPosition) return alert('[대량수집체크위치] 입력이 잘못되었습니다.');

																await testUserInfo({ collectCheckPosition });
																setUserInfo({ ...user.userInfo, collectCheckPosition });
															}}
														>
															<MenuItem value={'L'}>왼쪽</MenuItem>
															<MenuItem value={'R'}>오른쪽</MenuItem>
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
															고시정보
															<br />
															기본설정
														</Typography>

														<Tooltip title='상품 수집 시 고시정보 기본값을 설정합니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={user.userInfo?.sillFromCategory ?? ''}
															onChange={async (e) => {
																const sillFromCategory = e.target.value;

																if (!sillFromCategory) return alert('[고시정보자동설정] 입력이 잘못되었습니다.');

																await testUserInfo({ sillFromCategory });
																setUserInfo({ ...user.userInfo, sillFromCategory });
															}}
														>
															<MenuItem value={'Y'}>카테고리에 따라 지정</MenuItem>
															<MenuItem value={'N'}>기타재화로 일괄 지정</MenuItem>
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
															대표이미지
															<br />
															기준값설정
														</Typography>

														<Tooltip title='[프로전용] 상품 수집 시 대표이미지 위치를 설정합니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={user.userInfo?.thumbnailRepresentNo}
															onChange={async (e) => {
																if (user.purchaseInfo2.level < 3)
																	return alert('[프로] 등급부터 사용 가능한 기능입니다.');

																const thumbnailRepresentNo = parseInt(e.target.value);

																if (isNaN(thumbnailRepresentNo))
																	return alert('[대표이미지기준값설정] 입력이 잘못되었습니다.');

																const converted = thumbnailRepresentNo.toString();

																await testUserInfo({ thumbnailRepresentNo: converted });
																setUserInfo({ ...user.userInfo, thumbnailRepresentNo: converted });
															}}
														>
															<MenuItem value={'0'}>랜덤</MenuItem>
															<MenuItem value={'1'}>첫번째이미지</MenuItem>
															<MenuItem value={'2'}>두번째이미지</MenuItem>
															<MenuItem value={'3'}>세번째이미지</MenuItem>
															<MenuItem value={'4'}>네번째이미지</MenuItem>
															<MenuItem value={'5'}>다섯번째이미지</MenuItem>
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>
								</Grid>
							</Paper>

							<Paper
								variant='outlined'
								sx={{
									mb: 1,
								}}
							>
								<Title dark={darkTheme}>배대지 설정</Title>

								<Grid
									container
									spacing={1}
									sx={{
										textAlign: 'center',
										p: 1,
									}}
								>
									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>기본배대지</Typography>

														<Tooltip title='주문발송처리시 사용할 배대지를 설정합니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={user.userInfo?.orderToDeliveryName}
															onChange={async (e) => {
																const orderToDeliveryName = e.target.value;

																if (!orderToDeliveryName) return alert('[기본배대지] 입력이 잘못되었습니다.');

																await testUserInfo({
																	orderToDeliveryName,
																	orderToDeliveryMembership: '',
																	orderToDeliveryMethod: '',
																});

																setUserInfo({
																	...user.userInfo,

																	orderToDeliveryName,
																	orderToDeliveryMembership: '',
																	orderToDeliveryMethod: '',
																});

																initDeliveryInfo();
															}}
														>
															{deliveryList.map((v) => (
																<MenuItem value={v.name}>{v.name}</MenuItem>
															))}
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									{deliveryList.find((v) => v.name === user.userInfo?.orderToDeliveryName && v.membership) ? (
										<Grid item xs={6} md={3}>
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
															<Typography fontSize={14}>배송등급</Typography>

															<Tooltip title='주문발송처리시 사용할 배송등급을 설정합니다.'>
																<HelpOutlineIcon
																	color='info'
																	sx={{
																		fontSize: 14,
																	}}
																/>
															</Tooltip>
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
															<Select
																size='small'
																sx={{
																	width: '100%',
																	fontSize: 14,
																}}
																value={user.userInfo?.orderToDeliveryMembership}
																onChange={async (e) => {
																	const orderToDeliveryMembership = e.target.value;

																	if (!orderToDeliveryMembership) return alert('[배송등급] 입력이 잘못되었습니다.');

																	await testUserInfo({ orderToDeliveryMembership });
																	setUserInfo({ ...user.userInfo, orderToDeliveryMembership });
																}}
															>
																{deliveryData
																	.find((v) => v.company === user.userInfo?.orderToDeliveryName)
																	?.membership.map((v) => <MenuItem value={v.code}>{v.name}</MenuItem>) ?? null}
															</Select>
														</Box>
													</Grid>
												</Grid>
											</Paper>
										</Grid>
									) : null}

									{deliveryList.find((v) => v.name === user.userInfo?.orderToDeliveryName && v.method) ? (
										<Grid item xs={6} md={3}>
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
															<Typography fontSize={14}>배송방법</Typography>

															<Tooltip title='주문발송처리시 사용할 배송방법을 설정합니다.'>
																<HelpOutlineIcon
																	color='info'
																	sx={{
																		fontSize: 14,
																	}}
																/>
															</Tooltip>
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
															<Select
																size='small'
																sx={{
																	width: '100%',
																	fontSize: 14,
																}}
																value={user.userInfo?.orderToDeliveryMethod}
																onChange={async (e) => {
																	const orderToDeliveryMethod = e.target.value;

																	if (!orderToDeliveryMethod) return alert('[배송방법] 입력이 잘못되었습니다.');

																	await testUserInfo({ orderToDeliveryMethod });
																	setUserInfo({ ...user.userInfo, orderToDeliveryMethod });
																}}
															>
																{deliveryData
																	.find((v) => v.company === user.userInfo?.orderToDeliveryName)
																	?.method.map((v) => <MenuItem value={v.code}>{v.name}</MenuItem>) ?? null}
															</Select>
														</Box>
													</Grid>
												</Grid>
											</Paper>
										</Grid>
									) : null}
								</Grid>
							</Paper>

							<Paper
								variant='outlined'
								sx={{
									mb: 1,
								}}
							>
								<Title dark={darkTheme}>오픈마켓수수료 설정</Title>

								<Grid
									container
									spacing={1}
									sx={{
										textAlign: 'center',
										p: 1,
									}}
								>
									<Grid item xs={6} md={1.5}>
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
													md={4}
													sx={{
														margin: 'auto',
													}}
												>
													<img src='/resources/icon-smartstore.png' />
												</Grid>

												<Grid
													item
													xs={6}
													md={8}
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
														<TextField
															id='settings_naverFee'
															size='small'
															variant='outlined'
															sx={{
																width: 50,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={user.userInfo?.naverFee}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[스마트스토어 수수료] 숫자만 입력할 수 있습니다.');

																const naverFee = parseFloat(e.target.value);

																await testUserInfo({ naverFee });
																setUserInfo({ ...user.userInfo, naverFee });
															}}
														/>

														<Typography fontSize={14}>%</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={1.5}>
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
													md={4}
													sx={{
														margin: 'auto',
													}}
												>
													<img src='/resources/icon-coupang.png' />
												</Grid>

												<Grid
													item
													xs={6}
													md={8}
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
														<TextField
															id='settings_coupangFee'
															size='small'
															variant='outlined'
															sx={{
																width: 50,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={user.userInfo?.coupangFee}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[쿠팡 수수료] 숫자만 입력할 수 있습니다.');

																const coupangFee = parseFloat(e.target.value);

																await testUserInfo({ coupangFee });
																setUserInfo({ ...user.userInfo, coupangFee });
															}}
														/>

														<Typography fontSize={14}>%</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={1.5}>
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
													md={4}
													sx={{
														margin: 'auto',
													}}
												>
													<img src='/resources/icon-street-global.png' />
												</Grid>

												<Grid
													item
													xs={6}
													md={8}
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
														<TextField
															id='settings_streetFee'
															size='small'
															variant='outlined'
															sx={{
																width: 50,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={user.userInfo?.streetFee}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[11번가(글로벌) 수수료] 숫자만 입력할 수 있습니다.');

																const streetFee = parseFloat(e.target.value);

																await testUserInfo({ streetFee });
																setUserInfo({ ...user.userInfo, streetFee });
															}}
														/>

														<Typography fontSize={14}>%</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={1.5}>
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
													md={4}
													sx={{
														margin: 'auto',
													}}
												>
													<img src='/resources/icon-street-normal.png' />
												</Grid>

												<Grid
													item
													xs={6}
													md={8}
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
														<TextField
															id='settings_streetNormalFee'
															size='small'
															variant='outlined'
															sx={{
																width: 50,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={user.userInfo?.streetNormalFee}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[11번가(일반) 수수료] 숫자만 입력할 수 있습니다.');

																const streetNormalFee = parseFloat(e.target.value);

																await testUserInfo({ streetNormalFee });
																setUserInfo({ ...user.userInfo, streetNormalFee });
															}}
														/>

														<Typography fontSize={14}>%</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={1.5}>
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
													md={4}
													sx={{
														margin: 'auto',
													}}
												>
													<img src='/resources/icon-gmarket.png' />
												</Grid>

												<Grid
													item
													xs={6}
													md={8}
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
														<TextField
															id='settings_gmarketFee'
															size='small'
															variant='outlined'
															sx={{
																width: 50,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={user.userInfo?.gmarketFee}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[지마켓 수수료] 숫자만 입력할 수 있습니다.');

																const gmarketFee = parseFloat(e.target.value);

																await testUserInfo({ gmarketFee });
																setUserInfo({ ...user.userInfo, gmarketFee });
															}}
														/>

														<Typography fontSize={14}>%</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={1.5}>
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
													md={4}
													sx={{
														margin: 'auto',
													}}
												>
													<img src='/resources/icon-auction.png' />
												</Grid>

												<Grid
													item
													xs={6}
													md={8}
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
														<TextField
															id='settings_auctionFee'
															size='small'
															variant='outlined'
															sx={{
																width: 50,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={user.userInfo?.auctionFee}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[옥션 수수료] 숫자만 입력할 수 있습니다.');

																const auctionFee = parseFloat(e.target.value);

																await testUserInfo({ auctionFee });
																setUserInfo({ ...user.userInfo, auctionFee });
															}}
														/>

														<Typography fontSize={14}>%</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={1.5}>
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
													md={4}
													sx={{
														margin: 'auto',
													}}
												>
													<img src='/resources/icon-interpark.png' />
												</Grid>

												<Grid
													item
													xs={6}
													md={8}
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
														<TextField
															id='settings_interparkFee'
															size='small'
															variant='outlined'
															sx={{
																width: 50,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={user.userInfo?.interparkFee}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[인터파크 수수료] 숫자만 입력할 수 있습니다.');

																const interparkFee = parseFloat(e.target.value);

																await testUserInfo({ interparkFee });
																setUserInfo({ ...user.userInfo, interparkFee });
															}}
														/>

														<Typography fontSize={14}>%</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={1.5}>
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
													md={4}
													sx={{
														margin: 'auto',
													}}
												>
													<img src='/resources/icon-wemakeprice.png' />
												</Grid>

												<Grid
													item
													xs={6}
													md={8}
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
														<TextField
															id='settings_wemakepriceFee'
															size='small'
															variant='outlined'
															sx={{
																width: 50,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={user.userInfo?.wemakepriceFee}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[위메프 수수료] 숫자만 입력할 수 있습니다.');

																const wemakepriceFee = parseFloat(e.target.value);

																await testUserInfo({ wemakepriceFee });
																setUserInfo({ ...user.userInfo, wemakepriceFee });
															}}
														/>

														<Typography fontSize={14}>%</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={1.5}>
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
													md={4}
													sx={{
														margin: 'auto',
													}}
												>
													<img src='/resources/icon-lotteon-global.png' />
												</Grid>

												<Grid
													item
													xs={6}
													md={8}
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
														<TextField
															id='settings_lotteonFee'
															size='small'
															variant='outlined'
															sx={{
																width: 50,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={user.userInfo?.lotteonFee}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[롯데온(글로벌) 수수료] 숫자만 입력할 수 있습니다.');

																const lotteonFee = parseFloat(e.target.value);

																await testUserInfo({ lotteonFee });
																setUserInfo({ ...user.userInfo, lotteonFee });
															}}
														/>

														<Typography fontSize={14}>%</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={1.5}>
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
													md={4}
													sx={{
														margin: 'auto',
													}}
												>
													<img src='/resources/icon-lotteon-normal.png' />
												</Grid>

												<Grid
													item
													xs={6}
													md={8}
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
														<TextField
															id='settings_lotteonNormalFee'
															size='small'
															variant='outlined'
															sx={{
																width: 50,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={user.userInfo?.lotteonNormalFee}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[롯데온(일반) 수수료] 숫자만 입력할 수 있습니다.');

																const lotteonNormalFee = parseFloat(e.target.value);

																await testUserInfo({ lotteonNormalFee });
																setUserInfo({ ...user.userInfo, lotteonNormalFee });
															}}
														/>

														<Typography fontSize={14}>%</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={1.5}>
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
													md={4}
													sx={{
														margin: 'auto',
													}}
												>
													<img src='/resources/icon-tmon.png' />
												</Grid>

												<Grid
													item
													xs={6}
													md={8}
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
														<TextField
															id='settings_tmonFee'
															size='small'
															variant='outlined'
															sx={{
																width: 50,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={user.userInfo?.tmonFee}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[티몬 수수료] 숫자만 입력할 수 있습니다.');

																const tmonFee = parseFloat(e.target.value);

																await testUserInfo({ tmonFee });
																setUserInfo({ ...user.userInfo, tmonFee });
															}}
														/>

														<Typography fontSize={14}>%</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>
								</Grid>
							</Paper>

							<Paper
								variant='outlined'
								sx={{
									mb: 1,
								}}
							>
								<Title dark={darkTheme}>스마트스토어 설정</Title>

								<Grid
									container
									spacing={1}
									sx={{
										textAlign: 'center',
										p: 1,
									}}
								>
									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>원산지</Typography>
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={user.userInfo?.naverOriginCode ?? ''}
															onChange={async (e) => {
																const naverOriginCode = e.target.value;

																if (!naverOriginCode) return alert('[원산지] 입력이 잘못되었습니다.');

																await testUserInfo({ naverOriginCode });
																setUserInfo({ ...user.userInfo, naverOriginCode });
															}}
														>
															<MenuItem value={'0200037'}>중국</MenuItem>
															<MenuItem value={'0204000'}>미국</MenuItem>
															<MenuItem value={'0200036'}>일본</MenuItem>
															<MenuItem value={'0201005'}>독일</MenuItem>
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>수입사</Typography>
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
														<TextField
															id='settings_naverOrigin'
															size='small'
															variant='outlined'
															sx={{
																width: '100%',
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																},
															}}
															defaultValue={`${user.userInfo?.naverOrigin}`}
															onBlur={async (e) => {
																const naverOrigin = e.target.value;

																if (!naverOrigin) return alert('[수입사] 입력이 잘못되었습니다.');

																await testUserInfo({ naverOrigin });
																setUserInfo({ ...user.userInfo, naverOrigin });
															}}
														/>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>스토어전용상품명</Typography>
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={user.userInfo?.naverStoreOnly ?? ''}
															onChange={async (e) => {
																const naverStoreOnly = e.target.value;

																if (!naverStoreOnly) return alert('[스토어상품명] 입력이 잘못되었습니다.');

																await testUserInfo({ naverStoreOnly });
																setUserInfo({ ...user.userInfo, naverStoreOnly });
															}}
														>
															<MenuItem value={'Y'}>사용</MenuItem>
															<MenuItem value={'N'}>사용안함</MenuItem>
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>태그자동입력</Typography>

														<Tooltip title='상품 수집 시 카테고리에 맞는 태그 10개가 임의로 설정됩니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={`${user.userInfo?.naverAutoSearchTag}`}
															onChange={async (e) => {
																const naverAutoSearchTag = e.target.value;

																if (!naverAutoSearchTag) return alert('[태그자동입력] 입력이 잘못되었습니다.');

																await testUserInfo({ naverAutoSearchTag });
																setUserInfo({ ...user.userInfo, naverAutoSearchTag });
															}}
														>
															<MenuItem value='Y'>사용</MenuItem>

															<MenuItem value='N'>미사용</MenuItem>
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>
								</Grid>
							</Paper>

							<Paper
								variant='outlined'
								sx={{
									mb: 1,
								}}
							>
								<Title dark={darkTheme}>쿠팡 설정</Title>

								<Grid
									container
									spacing={1}
									sx={{
										textAlign: 'center',
										p: 1,
									}}
								>
									<Grid item xs={6} md={6}>
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
													md={2.9}
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
														<Typography fontSize={14}>기본출고지</Typography>
													</Box>
												</Grid>

												<Grid
													item
													xs={6}
													md={9.1}
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={`${user.userInfo?.coupangDefaultOutbound}`}
															onChange={async (e) => {
																const coupangDefaultOutbound = e.target.value;

																if (!coupangDefaultOutbound) return alert('[기본출고지] 입력이 잘못되었습니다.');

																await testUserInfo({ coupangDefaultOutbound });
																setUserInfo({ ...user.userInfo, coupangDefaultOutbound });
															}}
														>
															{deliveryPolicy.coupangOutboundList?.map((v: any) => (
																<MenuItem value={`${v.outboundShippingPlaceCode}`}>
																	[{v.shippingPlaceName}] {v.placeAddresses[0].returnAddress}{' '}
																	{v.placeAddresses[0].returnAddressDetail}
																</MenuItem>
															))}
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={6}>
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
													md={2.9}
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
														<Typography fontSize={14}>기본반품지</Typography>
													</Box>
												</Grid>

												<Grid
													item
													xs={6}
													md={9.1}
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={`${user.userInfo?.coupangDefaultInbound}`}
															onChange={async (e) => {
																const coupangDefaultInbound = e.target.value;

																if (!coupangDefaultInbound) return alert('[기본반품지] 입력이 잘못되었습니다.');

																await testUserInfo({ coupangDefaultInbound });
																setUserInfo({ ...user.userInfo, coupangDefaultInbound });
															}}
														>
															{deliveryPolicy.coupangInboundList?.map((v: any) => (
																<MenuItem value={`${v.returnCenterCode}`}>
																	[{v.shippingPlaceName}] {v.placeAddresses[0].returnAddress}{' '}
																	{v.placeAddresses[0].returnAddressDetail}
																</MenuItem>
															))}
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
															배송출고
															<br />
															소요기간
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
													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
														}}
													>
														<TextField
															id='settings_coupangOutboundShippingTimeDay'
															size='small'
															variant='outlined'
															sx={{
																width: 100,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={user.userInfo?.coupangOutboundShippingTimeDay}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[배송출고소요기간] 입력이 잘못되었습니다.');

																const coupangOutboundShippingTimeDay = parseInt(e.target.value);

																await testUserInfo({ coupangOutboundShippingTimeDay });
																setUserInfo({ ...user.userInfo, coupangOutboundShippingTimeDay });
															}}
														/>

														<Typography fontSize={14}>일</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
															묶음배송
															<br />
															처리여부
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
													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
														}}
													>
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={user.userInfo?.coupangUnionDeliveryType ?? ''}
															onChange={async (e) => {
																const coupangUnionDeliveryType = e.target.value;

																if (!coupangUnionDeliveryType) return alert('[묶음배송] 입력이 잘못되었습니다.');

																await testUserInfo({ coupangUnionDeliveryType });
																setUserInfo({ ...user.userInfo, coupangUnionDeliveryType });
															}}
														>
															<MenuItem value={'Y'}>사용</MenuItem>
															<MenuItem value={'N'}>사용안함</MenuItem>
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={3}>
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
															1인당최대
															<br />
															구매수량
														</Typography>

														<Tooltip title='1인당 최대 구매수량을 제한합니다. (0 입력 시 제한없음)'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<TextField
															id='settings_coupangMaximumBuyForPerson'
															size='small'
															variant='outlined'
															sx={{
																width: 100,
															}}
															inputProps={{
																style: {
																	fontSize: 14,
																	textAlign: 'right',
																},
															}}
															defaultValue={user.userInfo?.coupangMaximumBuyForPerson}
															onBlur={async (e) => {
																if (isNaN(Number(e.target.value)))
																	return alert('[1인당최대구매수량] 입력이 잘못되었습니다.');

																const coupangMaximumBuyForPerson = parseInt(e.target.value);

																await testUserInfo({ coupangMaximumBuyForPerson });
																setUserInfo({ ...user.userInfo, coupangMaximumBuyForPerson });
															}}
														/>

														<Typography fontSize={14}>개</Typography>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									{/* <Grid item xs={6} md={3}>
                    <Paper
                      variant="outlined"
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
                            margin: "auto",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography fontSize={14}>
                              옵션이미지
                              <br />
                              대표설정
                            </Typography>

                            <Tooltip title="옵션별 대표이미지를 다르게 설정합니다. (상품이 분리될 수 있음)">
                              <HelpOutlineIcon
                                color="info"
                                sx={{
                                  fontSize: 14,
                                }}
                              />
                            </Tooltip>
                          </Box>
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={6}
                          sx={{
                            margin: "auto",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Select
                              size="small"
                              sx={{
                                width: "100%",
                                fontSize: 14,
                              }}
                              value={user.userInfo?.coupangImageOpt ?? ""}
                              onChange={async (e) => {
                                const coupangImageOpt = e.target.value;

                                if (!coupangImageOpt) {
                                  alert("[옵션이미지대표설정] 입력이 잘못되었습니다.");

                                  return;
                                }

                                await testUserInfo({ coupangImageOpt });
                                setUserInfo({ ...user.userInfo, coupangImageOpt });
                              }}
                            >
                              <MenuItem value={"Y"}>사용</MenuItem>
                              <MenuItem value={"N"}>사용안함</MenuItem>
                            </Select>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid> */}
								</Grid>
							</Paper>

							<Paper
								variant='outlined'
								sx={{
									mb: 1,
								}}
							>
								<Title dark={darkTheme}>11번가 설정</Title>

								<Grid
									container
									spacing={1}
									sx={{
										textAlign: 'center',
										p: 1,
									}}
								>
									<Grid item xs={6} md={6}>
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
													md={2.9}
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
														<Typography fontSize={14}>기본출고지(글로벌)</Typography>
													</Box>
												</Grid>

												<Grid
													item
													xs={6}
													md={9.1}
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={`${user.userInfo?.streetDefaultOutbound}`}
															onChange={async (e) => {
																const streetDefaultOutbound = e.target.value;

																if (!streetDefaultOutbound) return alert('[기본출고지(글로벌)] 입력이 잘못되었습니다.');

																await testUserInfo({ streetDefaultOutbound });
																setUserInfo({ ...user.userInfo, streetDefaultOutbound });
															}}
														>
															{deliveryPolicy.streetGlobalOutboundList?.map((v: any) => (
																<MenuItem value={`${v.addrSeq[0]}`}>
																	[{v.addrNm[0]}] {v.addr[0]}
																</MenuItem>
															))}
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={6}>
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
													md={2.9}
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
														<Typography fontSize={14}>기본반품지(글로벌)</Typography>
													</Box>
												</Grid>

												<Grid
													item
													xs={6}
													md={9.1}
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={`${user.userInfo?.streetDefaultInbound}`}
															onChange={async (e) => {
																const streetDefaultInbound = e.target.value;

																if (!streetDefaultInbound) return alert('[기본반품지(글로벌)] 입력이 잘못되었습니다.');

																await testUserInfo({ streetDefaultInbound });
																setUserInfo({ ...user.userInfo, streetDefaultInbound });
															}}
														>
															{deliveryPolicy.streetGlobalInboundList?.map((v: any) => (
																<MenuItem value={`${v.addrSeq[0]}`}>
																	[{v.addrNm[0]}] {v.addr[0]}
																</MenuItem>
															))}
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={6}>
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
													md={2.9}
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
														<Typography fontSize={14}>기본출고지(일반)</Typography>
													</Box>
												</Grid>

												<Grid
													item
													xs={6}
													md={9.1}
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={`${user.userInfo?.streetNormalOutbound}`}
															onChange={async (e) => {
																const streetNormalOutbound = e.target.value;

																if (!streetNormalOutbound) return alert('[기본출고지(일반)] 입력이 잘못되었습니다.');

																await testUserInfo({ streetNormalOutbound });
																setUserInfo({ ...user.userInfo, streetNormalOutbound });
															}}
														>
															{deliveryPolicy.streetNormalOutboundList?.map((v: any) => (
																<MenuItem value={`${v.addrSeq[0]}`}>
																	[{v.addrNm[0]}] {v.addr[0]}
																</MenuItem>
															))}
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={6}>
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
													md={2.9}
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
														<Typography fontSize={14}>기본반품지(일반)</Typography>
													</Box>
												</Grid>

												<Grid
													item
													xs={6}
													md={9.1}
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={`${user.userInfo?.streetNormalInbound}`}
															onChange={async (e) => {
																const streetNormalInbound = e.target.value;

																if (!streetNormalInbound) return alert('[기본반품지(일반)] 입력이 잘못되었습니다.');

																await testUserInfo({ streetNormalInbound });
																setUserInfo({ ...user.userInfo, streetNormalInbound });
															}}
														>
															{deliveryPolicy.streetNormalInboundList?.map((v: any) => (
																<MenuItem value={`${v.addrSeq[0]}`}>
																	[{v.addrNm[0]}] {v.addr[0]}
																</MenuItem>
															))}
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>
								</Grid>
							</Paper>

							<Paper variant='outlined'>
								<Title dark={darkTheme}>롯데온 설정</Title>

								<Grid
									container
									spacing={1}
									sx={{
										textAlign: 'center',
										p: 1,
									}}
								>
									<Grid item xs={6} md={3}>
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
														<Typography fontSize={14}>셀러구분</Typography>

														<Tooltip title='글로벌유형과 일반유형 중 하나만 사용할 수 있습니다.'>
															<HelpOutlineIcon
																color='info'
																sx={{
																	fontSize: 14,
																}}
															/>
														</Tooltip>
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
														<Select
															size='small'
															sx={{
																width: '100%',
																fontSize: 14,
															}}
															value={`${user.userInfo?.lotteonSellerType}`}
															onChange={async (e) => {
																const lotteonSellerType = e.target.value;

																if (!lotteonSellerType) return alert('[기본반품지(일반)] 입력이 잘못되었습니다.');

																await testUserInfo({ lotteonSellerType });
																setUserInfo({ ...user.userInfo, lotteonSellerType });
															}}
														>
															<MenuItem value={'G'}>글로벌</MenuItem>

															<MenuItem value={'N'}>일반</MenuItem>
														</Select>
													</Box>
												</Grid>
											</Grid>
										</Paper>
									</Grid>

									<Grid item xs={6} md={9}></Grid>
								</Grid>
							</Paper>
						</>
					) : null}
				</Container>
			</Frame>
		</ThemeProvider>
	);
});
