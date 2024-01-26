// import "react-notion/src/styles.css";
import { NotionRenderer } from 'react-notion';
import React from 'react';
import gql from '../../../pages/Main/GraphQL/Requests';
import MUTATIONS from '../../../pages/Main/GraphQL/Mutations';
import { Info as InfoIcon } from '@mui/icons-material';
import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { readFileDataURL } from '../../../../common/function';
import { makeStyles } from '@material-ui/core/styles';
import {
	Avatar,
	Box,
	Button,
	Checkbox,
	Chip,
	Container,
	Divider,
	FormControlLabel,
	Grid,
	MenuItem,
	Paper,
	Radio,
	RadioGroup,
	Select,
	TextField,
	Typography,
	Link,
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
} from '@mui/material';
import { PayCardModal, PayHistoryModal } from '../Modals';
import { createTabCompletely, sendTabMessage } from '../../Tools/ChromeAsync';
import { Frame, MyButton, Title } from '../Common/UI';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// 이용신청서 등록용 위버 백엔드 API Endpoint
const ENDPOINT_KOOZAPAS = 'https://we.sellforyou.co.kr/api/';

// 컴포넌트 커스텀 스타일 설정
const useStyles = makeStyles((theme) => ({
	defaultPaper: {
		background: 'unset',
		color: 'unset',
	},

	checkedPaper: {
		background: '#0288d1 !important',
		color: 'white !important',
	},

	listItem: {
		'& span, & svg': {
			fontSize: '0.8rem',
		},
	},
}));

// 결제페이지 뷰
export const Payments = observer(() => {
	// MobX 스토리지 로드
	const { common, payments } = React.useContext(AppContext);
	const classes = useStyles();

	// 사용자 정보 로드
	React.useEffect(() => {
		if (!common.loaded) return;

		// 결제정보 초기화 (현재 로그인된 계정을 자동으로 체크하도록 설정)
		payments.setPayInfo({
			...payments.payInfo,

			accounts: common.user.connectedUsers.map((v) => {
				let checked = false;

				if (common.user.id === v.id) checked = true;

				return {
					...v,

					checked,
				};
			}),
		});

		// 노션으로부터 결제 플랜 정보를 받아오기 위함
		const notionPageList = [
			'0b1a2ad629f9492a8433a6d82b1d9cd1',
			'c35f7f72f86d44ac861f118fd351ca63',
			'af62b3a75d654ccfac7e3014b3506de9',
		];

		// 노션 페이지 API 요청 후 가져온 데이터를 상태에 저장
		Promise.all(
			notionPageList.map(async (v, i) => {
				const response = await getNotionPage(v);

				payments.setPlanInfo({
					...payments.planInfo,

					[`func${i + 1}`]: response,
				});
			}),
		);
	}, [common.loaded]);

	// 가격 정책이 변경될 때마다 실행
	React.useEffect(() => {
		// 기타금액 결제의 경우 실행되지 않음
		if (payments.payInfo.etc === 'true') return;

		// 가격 초기화
		let priceInfo = {
			add: 0,
			base: 0,
			discount: 0,
			original: 0,
			total: 0,
		};

		if (payments.payInfo.planLevel === '2') {
			// 베이직
			if (payments.payInfo.period === '1') {
				priceInfo.base = 99000;
				priceInfo.add = 55000;
			} else if (payments.payInfo.period === '2') {
				priceInfo.base = 990000;
				priceInfo.add = 550000;
			} else if (payments.payInfo.period === '4') {
				priceInfo.base = 495000;
				priceInfo.add = 275000;
			}
		} else if (payments.payInfo.planLevel === '3') {
			// 프로

			if (payments.payInfo.period === '1') {
				priceInfo.base = 132000;
				priceInfo.add = 77000;
			} else if (payments.payInfo.period === '2') {
				priceInfo.base = 1320000;
				priceInfo.add = 770000;
			} else if (payments.payInfo.period === '4') {
				priceInfo.base = 660000;
				priceInfo.add = 385000;
			}
		}

		// 체크된 계정이 몇 개인지 확인
		const members = payments.payInfo.accounts.filter((v) => v.checked);

		// 1개 이상인 경우 공식에 따라 이용 가격 책정
		if (members.length > 0) {
			priceInfo.discount += (priceInfo.base - priceInfo.add) * (members.length - 1);
			priceInfo.discount += payments.payInfo.point;

			priceInfo.original = priceInfo.base * members.length;
			priceInfo.total = priceInfo.original - priceInfo.discount;
		}

		// 가격 정보 최종 설정
		payments.setPriceInfo(priceInfo);
	}, [payments.payInfo]);

	// 노션 페이지 정보를 가져오는 API
	const getNotionPage = async (id) => {
		const pageResp = await fetch(`https://notion-api.splitbee.io/v1/page/${id}`);
		const pageJson = await pageResp.json();

		return pageJson;
	};

	// 결제하기를 눌렀을 때 동작하는 함수
	const payNow = async () => {
		if (payments.payInfo.etc === 'false') {
			if (payments.payInfo.accounts.every((v) => !v.checked)) {
				alert('결제할 계정을 선택해주세요.');

				return;
			}
		} else {
			if (payments.priceInfo.original === 0) {
				alert('결제할 금액은 0원 이상으로 입력해주세요.');

				return;
			}
		}

		if (!payments.payInfo.name) {
			alert('입금자명(성명)을 입력해주세요.');

			return;
		}

		if (payments.payInfo.type === 'CASH' && payments.payInfo.company === 'null') {
			alert('사업자등록증을 업로드해주세요.');

			return;
		}

		if (!payments.payInfo.serviceAgreed) {
			alert('서비스 이용약관에 동의해주세요.');

			return;
		}

		if (payments.priceInfo.total === 0) {
			// 계정 이용기간 설정
			await sendForm(true);

			alert('결제가 완료되었습니다.');
		} else {
			// 신용카드로 결제했을 경우
			if (payments.payInfo.type === 'CARD') {
				// 셀포유 홈페이지를 통해 카드 결제모듈에 접근해야 함
				// 크롬 확장프로그램 특성 상 CDN 라이브러리 설치 불가
				const tab = await createTabCompletely({ active: true, url: 'https://www.sellforyou.co.kr/pay' }, 10);

				payments.togglePayCardModal(true);

				// 셀포유 홈페이지를 열고, 해당 페이지에 메시지 전송 후 콘텐츠 스크립트에서 처리
				const response = await sendTabMessage(tab.id, {
					action: 'pay-card',
					source: {
						code: 'imp75486003',
						data: {
							pg: 'html5_inicis',
							pay_method: 'card',
							merchant_uid: `order_no_${common.user.email}_${new Date().getTime()}`,
							name: '셀포유 결제',
							amount: payments.priceInfo.total,
							buyer_email: common.user.email,
							buyer_name: payments.payInfo.name,
							buyer_tel: common.user.userInfo.phone,
							buyer_addr: '없음',
							buyer_postcode: '000-000',
							m_redirect_url: '{모바일에서 결제 완료 후 리디렉션 될 URL}',
						},
					},
				});

				// 작업이 끝나면 셀포유 홈페이지를 자동으로 닫음
				if (tab.id) chrome.tabs.remove(tab.id);

				// 결제중인 상태를 나타내는 모달 뷰를 끔
				payments.togglePayCardModal(false);

				// 사용자가 결제를 취소했을 경우
				if (!response) {
					alert('결제가 취소되었습니다.');

					return;
				}

				//계정 이용기간 설정
				await sendForm(true);

				alert('결제가 완료되었습니다.');
			} else {
				//계정 이용기간 설정
				await sendForm(false);

				alert('신청서 작성이 완료되었습니다.\n1영업일 이내에 담당자 승인 후 계정 이용기간이 설정됩니다.');
			}
		}

		// 결제가 완료되면 로그인 페이지로 이동
		window.location.href = './signin.html';
	};

	// 계정에 이용기간 설정하는 함수
	const confirmPay = async () => {
		if (payments.payInfo.etc === 'true') {
			return;
		}

		// 체크된 계정의 정보와 해당 계정의 이용기간 만료일을 기준으로 날짜를 연장하여 계산
		const purchaseInputs = payments.payInfo.accounts
			.filter((v) => v.checked)
			.map((v: any) => {
				let d: Date | null = null;

				const plan = JSON.parse(v.purchaseInfo2.history)
					.filter((v) => v.planInfo.planLevel > 1)
					.sort((a, b) => {
						const source: any = new Date(a.expiredAt);
						const target: any = new Date(b.expiredAt);

						return target - source;
					})[0];

				if (plan) {
					d = new Date(plan.expiredAt);
				} else {
					d = new Date();
				}

				if (payments.payInfo.period === '1') {
					d.setMonth(d.getMonth() + 1);
				} else if (payments.payInfo.period === '2') {
					d.setFullYear(d.getFullYear() + 1);
				} else if (payments.payInfo.period === '4') {
					d.setMonth(d.getMonth() + 6);
				}

				let date = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);

				return {
					userId: v.id,
					planInfoId: parseInt(payments.payInfo.planLevel),
					expiredAt: new Date(date + ' 23:59:59'),
				};
			});

		// 날짜 설정이 완료되면 백엔드에 이용기간 수정 요청
		const purchaseJson = await gql(
			MUTATIONS.SET_MULTI_PURCHASE_INFO_BY_ADMIN,
			{
				purchaseInputs,
				credit: payments.payInfo.point,
			},
			false,
		);

		if (purchaseJson.errors) {
			alert(purchaseJson.errors[0].message);

			return;
		}
	};

	// 셀포유 이용신청서 위버 전송
	const sendForm = async (preset: boolean) => {
		// preset은 사용자가 결제를 했는지 안했는지 확인하는 변수로 true일 경우 결제를 했다고 판단
		if (preset) {
			// 이용기간 설정
			await confirmPay();
		}

		// 이용신청서 양식
		const payBody = {
			email: common.user.email,
			password: 'sitezero1*',
			title: '셀포유 이용 신청서',
			description: payments.payInfo.point.toString(),
			moment: new Date().toISOString(),
			visit: 0,
			comment: '',
			servicetype: parseInt(payments.payInfo.period),
			user: {
				name: payments.payInfo.name,
				phone: common.user.userInfo.phone,
				company: payments.payInfo.type === 'CASH' ? payments.payInfo.company : 'null',
			},
			etc1: payments.payInfo.type,
			etc2: common.user.refAvailable ? common.user.refCode : '',
			etc3: '',
		};

		// 위버 백엔드에 데이터 전송
		let payResp = await fetch(ENDPOINT_KOOZAPAS + 'query', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify(payBody),
		});

		let payText = await payResp.text();

		// 성공적으로 전송된 경우
		if (payText === 'OK') {
			let emailBody = {
				type: 'naver',
				to: 'koozapas@naver.com',
				subject: '[셀포유] 셀포유 이용 신청서 (' + common.user.email + ')',
				text: '셀포유 이용 신청서가 접수되었습니다. 위버에서 확인 바랍니다.',
			};

			// koozapas@naver.com 이메일로 신청내역 전송
			await fetch(ENDPOINT_KOOZAPAS + 'mail', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8',
				},
				body: JSON.stringify(emailBody),
			});
		} else {
			alert('실패하였습니다. 다시시도 바랍니다.');
		}

		// window.location.reload();
	};

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
				<Container
					maxWidth={'md'}
					sx={{
						py: '10px',
					}}
				>
					{common.user.userInfo ? (
						<>
							<Grid
								container
								spacing={1}
								sx={{
									mb: 1,
								}}
							>
								<Grid item xs={6} md={12}>
									<Paper
										variant='outlined'
										sx={{
											fontSize: 14,
											p: 0,
										}}
									>
										<Title dark={common.darkTheme}>결제유형 선택</Title>

										<RadioGroup
											row
											aria-labelledby='demo-row-radio-buttons-group-label'
											name='row-radio-normal-group'
											onChange={(e) => {
												payments.setPayInfo({
													...payments.payInfo,

													type: 'CASH',
													etc: e.target.value,
												});

												payments.setPriceInfo({
													...payments.priceInfo,

													add: 0,
													base: 0,
													discount: 0,
													original: 0,
													total: 0,
												});
											}}
											value={payments.payInfo.etc}
										>
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
														className={payments.payInfo.etc === 'false' ? classes.checkedPaper : classes.defaultPaper}
														variant='outlined'
													>
														<FormControlLabel
															sx={{
																display: 'flex',
																width: '100%',
																justifyContent: 'center',
																m: 0,
															}}
															value='false'
															control={<Radio style={{ display: 'none' }} size='small' />}
															label={
																<Box
																	sx={{
																		p: 1,
																	}}
																>
																	<Typography noWrap fontSize={16}>
																		플랜(베이직/프로/프리미엄) 결제
																	</Typography>
																</Box>
															}
														/>
													</Paper>
												</Grid>

												<Grid item xs={6} md={6}>
													<Paper
														className={payments.payInfo.etc === 'true' ? classes.checkedPaper : classes.defaultPaper}
														variant='outlined'
													>
														<FormControlLabel
															sx={{
																display: 'flex',
																width: '100%',
																justifyContent: 'center',
																m: 0,
															}}
															value='true'
															control={<Radio style={{ display: 'none' }} size='small' />}
															label={
																<Box
																	sx={{
																		p: 1,
																	}}
																>
																	<Typography noWrap fontSize={16}>
																		기타금액 결제
																	</Typography>
																</Box>
															}
														/>
													</Paper>
												</Grid>
											</Grid>
										</RadioGroup>
									</Paper>
								</Grid>

								{payments.payInfo.etc === 'true' ? null : (
									<>
										<Grid item xs={6} md={8}>
											<Paper
												variant='outlined'
												sx={{
													fontSize: 14,
													p: 0,
												}}
											>
												<Title dark={common.darkTheme}>결제할 계정 선택</Title>

												<Box
													sx={{
														height: 142,
														p: 1,
														overflowY: 'scroll',
													}}
												>
													{payments.payInfo.accounts.map((v, i) => (
														<Box>
															<FormControlLabel
																control={
																	<Checkbox
																		size='small'
																		checked={v.checked}
																		onChange={(e) => {
																			const copied = payments.payInfo.accounts;

																			copied[i].checked = e.target.checked;

																			payments.setPayInfo({
																				...payments.payInfo,

																				accounts: copied,
																				type: copied.length > 1 ? 'CASH' : 'CARD',
																				point: 0,
																			});
																		}}
																	/>
																}
																label={
																	<Box
																		sx={{
																			display: 'flex',
																			alignItems: 'center',
																		}}
																	>
																		{v.purchaseInfo2.level === 1 ? (
																			<Chip size='small' label='체험판' color='warning' sx={{ width: 65 }} />
																		) : v.purchaseInfo2.level === 2 ? (
																			<Chip size='small' label='베이직' color='info' sx={{ width: 65 }} />
																		) : v.purchaseInfo2.level === 3 ? (
																			<Chip size='small' label='프로' color='secondary' sx={{ width: 65 }} />
																		) : v.purchaseInfo2.level === 4 ? (
																			<Chip size='small' label='프리미엄' color='error' sx={{ width: 65 }} />
																		) : (
																			<Chip size='small' label='미설정' color='default' sx={{ width: 65 }} />
																		)}
																		&nbsp;
																		<Typography fontSize={14}>
																			{v.email} ({v.master ? '본계정' : '부계정'})
																		</Typography>
																		&nbsp;
																		<Button
																			disableElevation
																			onClick={() => {
																				common.togglePayHistoryModal(v.id, true);
																			}}
																		>
																			결제내역
																		</Button>
																	</Box>
																}
															/>
														</Box>
													))}
												</Box>
											</Paper>
										</Grid>

										<Grid item xs={6} md={4}>
											<Paper
												variant='outlined'
												sx={{
													fontSize: 14,
													p: 0,
												}}
											>
												<Title dark={common.darkTheme}>이용기간 선택</Title>

												<RadioGroup
													row
													aria-labelledby='demo-row-radio-buttons-group-label'
													name='row-radio-normal-group'
													onChange={(e) => {
														payments.setPayInfo({
															...payments.payInfo,

															period: e.target.value,
															point: 0,
														});
													}}
													value={payments.payInfo.period}
												>
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
																className={
																	payments.payInfo.period === '1' ? classes.checkedPaper : classes.defaultPaper
																}
																variant='outlined'
															>
																<FormControlLabel
																	sx={{
																		display: 'flex',
																		width: '100%',
																		justifyContent: 'center',
																		m: 0,
																	}}
																	value='1'
																	control={<Radio style={{ display: 'none' }} size='small' />}
																	label={
																		<Box
																			sx={{
																				p: 1,
																			}}
																		>
																			<Typography noWrap fontSize={16}>
																				1개월
																			</Typography>
																		</Box>
																	}
																/>
															</Paper>
														</Grid>

														<Grid item xs={6} md={12}>
															<Paper
																className={
																	payments.payInfo.period === '4' ? classes.checkedPaper : classes.defaultPaper
																}
																variant='outlined'
															>
																<FormControlLabel
																	sx={{
																		display: 'flex',
																		width: '100%',
																		justifyContent: 'center',
																		m: 0,
																	}}
																	value='4'
																	control={<Radio style={{ display: 'none' }} size='small' />}
																	label={
																		<Box
																			sx={{
																				p: 1,
																			}}
																		>
																			<Typography noWrap fontSize={16}>
																				6개월
																			</Typography>
																		</Box>
																	}
																/>
															</Paper>
														</Grid>

														<Grid item xs={6} md={12}>
															<Paper
																className={
																	payments.payInfo.period === '2' ? classes.checkedPaper : classes.defaultPaper
																}
																variant='outlined'
															>
																<FormControlLabel
																	sx={{
																		display: 'flex',
																		width: '100%',
																		justifyContent: 'center',
																		m: 0,
																	}}
																	value='2'
																	control={<Radio style={{ display: 'none' }} size='small' />}
																	label={
																		<Box
																			sx={{
																				p: 1,
																			}}
																		>
																			<Typography noWrap fontSize={16}>
																				12개월
																			</Typography>
																		</Box>
																	}
																/>
															</Paper>
														</Grid>
													</Grid>
												</RadioGroup>
											</Paper>
										</Grid>
									</>
								)}
							</Grid>

							{payments.payInfo.etc === 'true' ? null : (
								<Paper
									variant='outlined'
									sx={{
										fontSize: 14,
										p: 0,
										mb: 1,
									}}
								>
									<Title dark={common.darkTheme}>이용등급 선택</Title>

									<RadioGroup
										row
										aria-labelledby='demo-row-radio-buttons-group-label'
										name='row-radio-normal-group'
										onChange={(e) => {
											payments.setPayInfo({
												...payments.payInfo,

												planLevel: e.target.value,
												point: 0,
											});
										}}
										value={payments.payInfo.planLevel}
									>
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
													className={payments.payInfo.planLevel === '2' ? classes.checkedPaper : classes.defaultPaper}
													variant='outlined'
												>
													<FormControlLabel
														sx={{
															display: 'flex',
															width: '100%',
															justifyContent: 'center',
															m: 0,
														}}
														value='2'
														control={<Radio style={{ display: 'none' }} size='small' />}
														label={
															<Box
																sx={{
																	px: 1,
																	py: 2,
																	width: 250,
																	height: 440,
																}}
															>
																<Typography noWrap fontSize={20}>
																	베이직
																</Typography>

																<Divider sx={{ my: 2 }} />

																<Box
																	sx={{
																		my: 4,
																	}}
																>
																	{payments.payInfo.period === '1' ? (
																		<>
																			<Typography noWrap fontSize={30} fontWeight='bold'>
																				\ 99,000
																			</Typography>
																			<Typography noWrap fontSize={14}>
																				/ 1개월 (VAT 포함)
																			</Typography>
																		</>
																	) : payments.payInfo.period === '4' ? (
																		<>
																			<Typography noWrap fontSize={30} fontWeight='bold'>
																				\ 495,000
																			</Typography>
																			<Typography noWrap fontSize={14}>
																				/ 6개월 (VAT 포함, \ 82,500 / 1개월)
																			</Typography>
																		</>
																	) : payments.payInfo.period === '2' ? (
																		<>
																			<Typography noWrap fontSize={30} fontWeight='bold'>
																				\ 990,000
																			</Typography>
																			<Typography noWrap fontSize={14}>
																				/ 12개월 (VAT 포함, \ 82,500 / 1개월)
																			</Typography>
																		</>
																	) : null}
																</Box>

																<Box
																	sx={{
																		fontSize: '14px',
																		textAlign: 'left',
																	}}
																>
																	{payments.planInfo.func1 ? (
																		<NotionRenderer blockMap={payments.planInfo.func1} />
																	) : null}
																</Box>
															</Box>
														}
													/>
												</Paper>
											</Grid>

											<Grid item xs={6} md={6}>
												<Paper
													className={payments.payInfo.planLevel === '3' ? classes.checkedPaper : classes.defaultPaper}
													variant='outlined'
												>
													<FormControlLabel
														sx={{
															display: 'flex',
															width: '100%',
															justifyContent: 'center',
															m: 0,
														}}
														value='3'
														control={<Radio style={{ display: 'none' }} size='small' />}
														label={
															<Box
																sx={{
																	px: 1,
																	py: 2,
																	width: 250,
																	height: 440,
																}}
															>
																<Typography noWrap fontSize={20}>
																	프로
																</Typography>

																<Divider sx={{ my: 2 }} />

																<Box
																	sx={{
																		my: 4,
																	}}
																>
																	{payments.payInfo.period === '1' ? (
																		<>
																			<Typography noWrap fontSize={30} fontWeight='bold'>
																				\ 132,000
																			</Typography>
																			<Typography noWrap fontSize={14}>
																				/ 1개월 (VAT 포함)
																			</Typography>
																		</>
																	) : payments.payInfo.period === '4' ? (
																		<>
																			<Typography noWrap fontSize={30} fontWeight='bold'>
																				\ 660,000
																			</Typography>
																			<Typography noWrap fontSize={14}>
																				/ 6개월 (VAT 포함, \ 110,000 / 1개월)
																			</Typography>
																		</>
																	) : payments.payInfo.period === '2' ? (
																		<>
																			<Typography noWrap fontSize={30} fontWeight='bold'>
																				\ 1,320,000
																			</Typography>
																			<Typography noWrap fontSize={14}>
																				/ 12개월 (VAT 포함, \ 110,000 / 1개월)
																			</Typography>
																		</>
																	) : null}
																</Box>

																<Box
																	sx={{
																		fontSize: '14px',
																		textAlign: 'left',
																	}}
																>
																	{payments.planInfo.func2 ? (
																		<NotionRenderer blockMap={payments.planInfo.func2} />
																	) : null}
																</Box>
															</Box>
														}
													/>
												</Paper>
											</Grid>

											{/* <Grid item xs={6} md={4}>
                        <Paper className={payments.payInfo.planLevel === "4" ? classes.checkedPaper : classes.defaultPaper} variant="outlined">
                          <FormControlLabel
                            sx={{
                              display: "flex",
                              width: "100%",
                              justifyContent: "center",
                              m: 0,
                            }}
                            disabled
                            value="4"
                            control={<Radio style={{ display: "none" }} size="small" />}
                            label={
                              <Box
                                sx={{
                                  px: 1,
                                  py: 2,
                                  width: 250,
                                  height: 420,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography noWrap fontSize={20}>
                                    프리미엄
                                  </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box
                                  sx={{
                                    my: 4,
                                  }}
                                >
                                  <Typography noWrap fontSize={30} fontWeight="bold">
                                    준비중
                                  </Typography>
                                  <Typography noWrap fontSize={14}>
                                    / -
                                  </Typography>
                                </Box>

                                <Box
                                  sx={{
                                    fontSize: "14px",
                                    textAlign: "left",
                                  }}
                                >
                                  {payments.planInfo.func3 ? <NotionRenderer blockMap={payments.planInfo.func3} /> : null}
                                </Box>
                              </Box>
                            }
                          />
                        </Paper>
                      </Grid> */}
										</Grid>
									</RadioGroup>
								</Paper>
							)}

							<Grid container spacing={1}>
								<Grid item xs={6} md={6}>
									<Paper
										variant='outlined'
										sx={{
											fontSize: 14,
											p: 0,
											mb: 1,
										}}
									>
										<Title dark={common.darkTheme}>결제정보 입력</Title>

										<Grid
											container
											spacing={1}
											sx={{
												textAlign: 'center',
												p: 1,
											}}
										>
											<Grid item xs={6} md={6}>
												<Box
													sx={{
														display: 'flex',
														p: 1,
													}}
												>
													<Typography noWrap fontSize={16} color='red'>
														*
													</Typography>

													<Typography noWrap fontSize={16}>
														입금자명(성명)
													</Typography>
												</Box>
											</Grid>

											<Grid item xs={6} md={6}>
												<TextField
													id='settings_marginRate'
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
													onChange={(e) => {
														payments.setPayInfo({
															...payments.payInfo,

															name: e.target.value,
														});
													}}
													value={payments.payInfo.name}
												/>
											</Grid>

											<Grid item xs={6} md={6}>
												<Box
													sx={{
														display: 'flex',
														p: 1,
													}}
												>
													<Typography noWrap fontSize={16} color='red'>
														*
													</Typography>

													<Typography noWrap fontSize={16}>
														결제방법
													</Typography>
												</Box>
											</Grid>

											<Grid
												item
												xs={6}
												md={6}
												sx={{
													m: 'auto',
												}}
											>
												<Select
													size='small'
													sx={{
														fontSize: 14,
														width: '100%',
													}}
													value={payments.payInfo.type}
													onChange={async (e) => {
														if (
															payments.payInfo.etc === 'false' &&
															payments.payInfo.accounts.filter((v) => v.checked).length > 1 &&
															e.target.value === 'CARD'
														) {
															alert('복수 계정 결제는 현금 결제를 이용해주세요.');

															return;
														}

														payments.setPayInfo({
															...payments.payInfo,

															type: e.target.value,
														});
													}}
												>
													<MenuItem value='CASH'>현금 계좌이체</MenuItem>

													<MenuItem value='CARD'>신용카드로 결제</MenuItem>
												</Select>
											</Grid>

											<Grid item xs={6} md={6}>
												<Box
													sx={{
														display: 'flex',
														p: 1,
													}}
												>
													{payments.payInfo.type === 'CASH' ? (
														<>
															<Typography noWrap fontSize={16} color='red'>
																*
															</Typography>
														</>
													) : null}

													<Typography noWrap fontSize={16}>
														사업자등록증
													</Typography>
												</Box>
											</Grid>

											<Grid
												item
												xs={6}
												md={6}
												sx={{
													m: 'auto',
													textAlign: 'right',
												}}
											>
												{payments.payInfo.type === 'CASH' ? (
													<>
														{payments.payInfo.company === 'null' ? (
															<Button
																size='medium'
																disableElevation
																variant='outlined'
																color='info'
																component='label'
																sx={{
																	width: '100%',
																}}
															>
																사업자등록증 첨부
																<input
																	hidden
																	accept='image/*'
																	multiple
																	type='file'
																	onChange={async (e) => {
																		const fileList = e.target.files ?? [];
																		const fileData = await readFileDataURL(fileList[0]);

																		payments.setPayInfo({
																			...payments.payInfo,

																			company: `${fileData}`,
																		});
																	}}
																/>
															</Button>
														) : (
															<Typography noWrap fontSize={16} color='gray'>
																첨부완료
															</Typography>
														)}
													</>
												) : (
													<>
														<Typography noWrap fontSize={16} color='gray'>
															미첨부
														</Typography>
													</>
												)}
											</Grid>

											<Grid
												item
												xs={6}
												md={6}
												sx={{
													m: 'auto',
												}}
											>
												<Box
													sx={{
														display: 'flex',
														p: 1,
													}}
												>
													<Typography noWrap fontSize={16}>
														보유적립금
													</Typography>
												</Box>
											</Grid>

											<Grid
												item
												xs={6}
												md={6}
												sx={{
													m: 'auto',
													textAlign: 'right',
												}}
											>
												<Typography noWrap fontSize={16}>
													{common.user.credit.toLocaleString('ko-KR')} P
												</Typography>
											</Grid>

											<Grid
												item
												xs={6}
												md={6}
												sx={{
													m: 'auto',
												}}
											>
												<Box
													sx={{
														display: 'flex',
														p: 1,
													}}
												>
													<Typography noWrap fontSize={16}>
														사용적립금
													</Typography>
												</Box>
											</Grid>

											<Grid
												item
												xs={6}
												md={6}
												sx={{
													m: 'auto',
												}}
											>
												<Box
													sx={{
														display: 'flex',
													}}
												>
													<Button
														size='medium'
														disableElevation
														variant='outlined'
														color='info'
														sx={{
															width: '50%',
														}}
														onClick={() => {
															payments.setPayInfo({
																...payments.payInfo,

																point: 0,
															});
														}}
													>
														재설정
													</Button>
													&nbsp;
													<TextField
														disabled={payments.payInfo.etc === 'true' || payments.payInfo.point > 0}
														id='settings_marginRate'
														size='small'
														variant='outlined'
														sx={{
															width: '100%',
														}}
														inputProps={{
															style: {
																fontSize: 14,
																textAlign: 'right',
															},
														}}
														defaultValue={payments.payInfo.point}
														onBlur={(e) => {
															const point = parseInt(e.target.value);

															if (isNaN(point)) {
																alert('숫자만 입력 가능합니다.');

																return;
															}

															if (point > common.user.credit) {
																alert('보유적립금을 초과하여 입력할 수 없습니다.');

																return;
															}

															if (point > payments.priceInfo.original - payments.priceInfo.discount) {
																alert('이용가격을 초과하여 입력할 수 없습니다.');

																return;
															}

															payments.setPayInfo({
																...payments.payInfo,

																point,
															});
														}}
													/>
												</Box>
											</Grid>
										</Grid>
									</Paper>
								</Grid>

								<Grid item xs={6} md={6}>
									<Paper
										variant='outlined'
										sx={{
											fontSize: 14,
											p: 0,
											mb: 1,
										}}
									>
										<Title dark={common.darkTheme}>결제 요약</Title>

										<Grid
											container
											spacing={1}
											sx={{
												textAlign: 'center',
												p: 1,
											}}
										>
											<Grid item xs={6} md={6}>
												<Box
													sx={{
														display: 'flex',
														p: 1,
													}}
												>
													<Typography noWrap fontSize={16}>
														이용가격
													</Typography>
												</Box>
											</Grid>

											<Grid
												item
												xs={6}
												md={6}
												sx={{
													m: 'auto',
													textAlign: 'right',
												}}
											>
												{payments.payInfo.etc === 'true' ? (
													<TextField
														id='settings_marginRate'
														size='small'
														variant='outlined'
														sx={{
															width: '100%',
														}}
														inputProps={{
															style: {
																fontSize: 14,
																textAlign: 'right',
															},
														}}
														onChange={(e) => {
															const point = parseInt(e.target.value);

															if (isNaN(point)) {
																alert('숫자만 입력 가능합니다.');

																return;
															}

															payments.setPriceInfo({
																add: 0,
																base: 0,
																discount: 0,
																original: point,
																total: point,
															});

															// payments.setPayInfo({
															//   ...payments.payInfo,
															//   name: e.target.value,
															// });
														}}
														value={payments.priceInfo.original}
													/>
												) : (
													<Typography noWrap fontSize={16}>
														\ {payments.priceInfo.original.toLocaleString('ko-KR')}
													</Typography>
												)}
											</Grid>

											<Grid item xs={6} md={6}>
												<Box
													sx={{
														display: 'flex',
														p: 1,
													}}
												>
													<Typography noWrap fontSize={16}>
														할인금액
													</Typography>
												</Box>
											</Grid>

											<Grid
												item
												xs={6}
												md={6}
												sx={{
													m: 'auto',
													textAlign: 'right',
												}}
											>
												<Typography noWrap fontSize={16} color='gray'>
													{payments.priceInfo.discount > 0
														? `- \\ ${payments.priceInfo.discount.toLocaleString('ko-KR')}`
														: '미적용'}
												</Typography>
											</Grid>

											<Grid
												item
												xs={6}
												md={6}
												sx={{
													m: 'auto',
												}}
											>
												<Box
													sx={{
														display: 'flex',
														p: 1,
													}}
												>
													<Typography noWrap fontSize={16}>
														최종결제금액
													</Typography>
												</Box>
											</Grid>

											<Grid
												item
												xs={6}
												md={6}
												sx={{
													m: 'auto',
													textAlign: 'right',
												}}
											>
												<Typography noWrap fontSize={16} fontWeight='bold' color='warning'>
													\ {payments.priceInfo.total.toLocaleString('ko-KR')}
												</Typography>
											</Grid>

											<Grid
												item
												xs={6}
												md={12}
												sx={{
													m: 'auto',
												}}
											>
												<Box
													sx={{
														bgcolor: 'background.default',
													}}
												>
													<FormControlLabel
														control={
															<Checkbox
																size='small'
																checked={payments.payInfo.serviceAgreed}
																onChange={(e) => {
																	payments.setPayInfo({
																		...payments.payInfo,

																		serviceAgreed: e.target.checked,
																	});
																}}
															/>
														}
														label={
															<Typography fontSize={14}>
																주문 내용을 확인하였으며,&nbsp;
																<Link href='https://panoramic-butternut-291.notion.site/5090b4282d88479f8608cd7f60bce6c2'>
																	서비스 이용약관
																</Link>
																에 동의합니다.
															</Typography>
														}
													/>
												</Box>
											</Grid>

											<Grid
												item
												xs={6}
												md={12}
												sx={{
													m: 'auto',
												}}
											>
												<Button
													size='large'
													disableElevation
													variant='contained'
													color='info'
													sx={{
														width: '100%',
													}}
													onClick={payNow}
												>
													결제하기
												</Button>
											</Grid>
										</Grid>
									</Paper>
								</Grid>
							</Grid>

							<Paper
								variant='outlined'
								sx={{
									fontSize: 14,
									p: 0,
								}}
							>
								<List sx={{ width: '100%' }}>
									<ListItem>
										<ListItemAvatar>
											<Avatar
												sx={{
													bgcolor: 'whitesmoke',
												}}
											>
												<InfoIcon color='info' />
											</Avatar>
										</ListItemAvatar>
										<ListItemText
											primary='현금 결제 시 아래의 계좌로 입금을 진행해주세요.'
											secondary='우리은행 1005-904-020848 / 주식회사 쿠자피에이에스'
										/>
									</ListItem>
									<ListItem>
										<ListItemAvatar>
											<Avatar
												sx={{
													bgcolor: 'whitesmoke',
												}}
											>
												<InfoIcon color='info' />
											</Avatar>
										</ListItemAvatar>
										<ListItemText
											primary='결제 진행 순서: 안내에 따라 결제 정보 입력 > 결제하기 버튼 클릭 > 현금 또는 카드 결제 > 결제 확인 후 승인'
											secondary='현금 결제 시 1영업일 내로 승인되며 세금계산서는 월단위 일괄 발급됩니다.'
										/>
									</ListItem>
									<ListItem>
										<ListItemAvatar>
											<Avatar
												sx={{
													bgcolor: 'whitesmoke',
												}}
											>
												<InfoIcon color='info' />
											</Avatar>
										</ListItemAvatar>
										<ListItemText
											primary='추가사업자 및 추천인코드 할인혜택의 경우 현금 결제를 이용해주세요.'
											secondary={
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
													}}
												>
													추천인코드를 입력하셨나요? &nbsp;
													<MyButton
														variant='text'
														onClick={() => {
															const refCode = common.user.refCode;

															if (!refCode) {
																alert('추천인코드를 입력하지 않으셨습니다.');

																return;
															}

															let message = `내 추천인코드: ${refCode}`;

															switch (refCode) {
																case 'dream': {
																	message += `(소통하는셀러꿈)\n\n- 첫 결제시 1개월 추가 연장`;

																	break;
																}

																case '1%': {
																	message += `(상위1%셀러의정석)\n\n- 첫 결제 후 6개월간 할인\n\n- 1개월(20%할인): 79,200원\n- 3개월(25%할인): 221,100원\n- 6개월(30%할인): 415,800원`;

																	break;
																}

																case '1%수강': {
																	message += `(상위1%셀러의정석)\n\n- 첫 결제 후 1개월 추가 연장, 이후 6개월간 할인\n\n- 1개월(20%할인): 79,200원\n- 3개월(30%할인): 207,900원\n- 6개월(40%할인): 356,400원`;

																	break;
																}

																case '돈벌삶': {
																	message += `(돈이벌리는삶)\n\n- 첫 결제 후 6개월간 할인 혜택\n\n- 1개월(20%할인): 79,200원\n- 3개월(25%할인): 221,100원\n- 6개월(30%할인): 415,800원`;

																	break;
																}

																default: {
																	message += ``;

																	break;
																}
															}

															alert(message);
														}}
													>
														내 추천인코드 확인하기
													</MyButton>
												</Box>
											}
										/>
									</ListItem>
								</List>
							</Paper>

							{/* <Paper
              variant="outlined"
              sx={{
                border: "1px solid #d1e8ff",
                fontSize: 14,
                p: 1,
                mb: 1,
              }}
            >
              <a target="_blank" href="https://www.sellforyou.co.kr/user/payment">
                구 결제페이지 바로가기(베이직 플랜 결제만 가능)
              </a>
            </Paper> */}
						</>
					) : null}
				</Container>

				<PayCardModal />
				<PayHistoryModal />
			</Frame>
		</ThemeProvider>
	);
});
