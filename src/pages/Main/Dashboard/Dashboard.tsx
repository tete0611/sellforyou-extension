import React from 'react';

import { format } from 'date-fns';
import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { Header } from '../Common/Header';
import { NoticeModal } from '../Modals/NoticeModal';
import { Box, Button, CircularProgress, Container, Grid, Paper, Tooltip, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Frame } from '../Common/UI';

// 대시보드 뷰
export const Dashboard = observer(() => {
	// MobX 스토리지 로드
	const { common, dashboard, inflow } = React.useContext(AppContext);

	React.useEffect(() => {
		if (!common.loaded) return;
		// 관리상품수 가져오기
		dashboard.getProductCount();

		// 신규주문수 가져오기
		dashboard.getOrderCount(common);

		// 공지사항 가져오기
		dashboard.loadNotices();

		// 유입수 가져오기
		inflow.getInflowCounts(inflow.searchInfo.timeStart, inflow.searchInfo.timeEnd);
	}, [common.loaded]);

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
				{/* 
        <Container
          maxWidth={"xl"}
          sx={{
            py: "0px",
          }}
        >
          test
        </Container> */}

				<Container
					maxWidth={'xl'}
					sx={{
						py: '10px',
					}}
				>
					<Grid container spacing={1}>
						<Grid item xs={6} md={9}>
							<Grid container spacing={1}>
								{/* 한칸 grid 안 paper */}
								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											height: 190,
										}}
									>
										<img
											style={{
												width: '100%',
												height: '100%',
												// objectFit: "cover", 이미지 비율 맞춤 여부
												cursor: 'pointer',
											}}
											src={
												common.banner01Image
													? common.banner01Image + `?${Date.now()}`
													: 'https://ai.esmplus.com/koozapas/banner01.jpg?' + Date.now()
											}
											onClick={() => window.open(`${common.banner01Url}`)}
										/>
									</Paper>
								</Grid>
								{/* 한칸 grid 안 paper */}
								<Grid
									item
									xs={6}
									md={4}
									sx={{
										opacity: 0, //영역은 차지하지만 보이진 않게 일단 처리
									}}
								>
									<Paper
										variant='outlined'
										sx={{
											height: 190,
										}}
									>
										<Box
											sx={{
												height: '100%',
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												justifyContent: 'space-between',
											}}
										>
											<Grid
												container
												spacing={2}
												sx={{
													p: 2,
												}}
											>
												<Grid item xs={6} md={8}>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														광고베너
													</Typography>
												</Grid>
											</Grid>

											<Grid
												container
												spacing={2}
												sx={{
													p: 2,
												}}
											></Grid>
										</Box>
									</Paper>
								</Grid>
								{/* 한칸 grid 안 paper */}
								<Grid
									item
									xs={6}
									md={4}
									sx={{
										opacity: 0, //영역은 차지하지만 보이진 않게 일단 처리
									}}
								>
									<Paper
										variant='outlined'
										sx={{
											height: 190,
										}}
									>
										<Box
											sx={{
												height: '100%',
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												justifyContent: 'space-between',
											}}
										>
											<Grid
												container
												spacing={2}
												sx={{
													p: 2,
												}}
											>
												<Grid item xs={6} md={8}>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														광고베너
													</Typography>
												</Grid>
											</Grid>

											<Grid
												container
												spacing={2}
												sx={{
													p: 2,
												}}
											></Grid>
										</Box>
									</Paper>
								</Grid>
								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											height: 280,
										}}
									>
										<Box
											sx={{
												height: '100%',
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												justifyContent: 'space-between',
											}}
										>
											<Grid
												container
												spacing={2}
												sx={{
													p: 2,
												}}
											>
												<Grid item xs={6} md={8}>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														관리상품
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={4}
													sx={{
														textAlign: 'right',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{common.user.productCount}
													</Typography>
												</Grid>
											</Grid>

											<Grid
												container
												spacing={2}
												sx={{
													p: 2,
												}}
											>
												<Grid item xs={6} md={8}>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														수집상품
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={4}
													sx={{
														textAlign: 'right',
													}}
												>
													{dashboard.countInfo.product.collected === '-' ? (
														<CircularProgress disableShrink size='1.5rem' />
													) : (
														<Typography
															noWrap
															sx={{
																cursor: 'pointer',
																fontSize: 18,
																fontWeight: 'bold',
																textDecoration: 'underline',
															}}
															onClick={() => (window.location.href = '/product/collected.html')}
														>
															{dashboard.countInfo.product.collected}
														</Typography>
													)}
												</Grid>

												<Grid item xs={6} md={8}>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														등록상품
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={4}
													sx={{
														textAlign: 'right',
													}}
												>
													{dashboard.countInfo.product.registered === '-' ? (
														<CircularProgress disableShrink size='1.5rem' />
													) : (
														<Typography
															noWrap
															sx={{
																cursor: 'pointer',
																fontSize: 18,
																fontWeight: 'bold',
																textDecoration: 'underline',
															}}
															onClick={() => (window.location.href = '/product/registered.html')}
														>
															{dashboard.countInfo.product.registered}
														</Typography>
													)}
												</Grid>

												<Grid item xs={6} md={8}>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														잠금상품
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={4}
													sx={{
														textAlign: 'right',
													}}
												>
													{dashboard.countInfo.product.collected === '-' ? (
														<CircularProgress disableShrink size='1.5rem' />
													) : (
														<Typography
															noWrap
															sx={{
																cursor: 'pointer',
																fontSize: 18,
																fontWeight: 'bold',
																textDecoration: 'underline',
															}}
															onClick={() => (window.location.href = '/product/locked.html')}
														>
															{dashboard.countInfo.product.locked}
														</Typography>
													)}
												</Grid>
											</Grid>
										</Box>
									</Paper>
								</Grid>
								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											height: 280,
										}}
									>
										<Box
											sx={{
												height: '100%',
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												justifyContent: 'space-between',
											}}
										>
											<Grid
												container
												spacing={2}
												sx={{
													p: 2,
												}}
											>
												<Grid item xs={6} md={8}>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														신규주문
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={4}
													sx={{
														textAlign: 'right',
													}}
												>
													{dashboard.countInfo.order.countAll === '-' ? (
														<CircularProgress disableShrink size='1.5rem' />
													) : (
														<Typography
															noWrap
															sx={{
																cursor: 'pointer',
																fontSize: 18,
																fontWeight: 'bold',
																textDecoration: 'underline',
															}}
															onClick={() => (window.location.href = '/order/new.html')}
														>
															{dashboard.countInfo.order.countAll}
														</Typography>
													)}
												</Grid>
											</Grid>

											<Grid
												container
												spacing={0.5}
												sx={{
													p: 2,
												}}
											>
												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'A077' && v.connected) ? (
														<img src='/resources/icon-smartstore.png' />
													) : (
														<img src='/resources/icon-smartstore-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{dashboard.countInfo.order.countA077}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'B378' && v.connected) ? (
														<img src='/resources/icon-coupang.png' />
													) : (
														<img src='/resources/icon-coupang-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{dashboard.countInfo.order.countB378}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'A112' && v.connected) ? (
														<img src='/resources/icon-street-global.png' />
													) : (
														<img src='/resources/icon-street-global-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{dashboard.countInfo.order.countA112}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'A113' && v.connected) ? (
														<img src='/resources/icon-street-normal.png' />
													) : (
														<img src='/resources/icon-street-normal-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{dashboard.countInfo.order.countA113}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'A006' && v.connected) ? (
														<img src='/resources/icon-gmarket.png' />
													) : (
														<img src='/resources/icon-gmarket-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{dashboard.countInfo.order.countA006}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'A001' && v.connected) ? (
														<img src='/resources/icon-auction.png' />
													) : (
														<img src='/resources/icon-auction-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{dashboard.countInfo.order.countA001}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'A027' && v.connected) ? (
														<img src='/resources/icon-interpark.png' />
													) : (
														<img src='/resources/icon-interpark-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{dashboard.countInfo.order.countA027}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'B719' && v.connected) ? (
														<img src='/resources/icon-wemakeprice.png' />
													) : (
														<img src='/resources/icon-wemakeprice-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{dashboard.countInfo.order.countB719}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'A524' && v.connected) ? (
														<img src='/resources/icon-lotteon-global.png' />
													) : (
														<img src='/resources/icon-lotteon-global-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{dashboard.countInfo.order.countA524}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'A525' && v.connected) ? (
														<img src='/resources/icon-lotteon-normal.png' />
													) : (
														<img src='/resources/icon-lotteon-normal-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{dashboard.countInfo.order.countA525}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'B956' && v.connected) ? (
														<img src='/resources/icon-tmon.png' />
													) : (
														<img src='/resources/icon-tmon-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{dashboard.countInfo.order.countB956}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={4}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												></Grid>
											</Grid>
										</Box>
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											height: 280,
										}}
									>
										<Box
											sx={{
												height: '100%',
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												justifyContent: 'space-between',
											}}
										>
											<Grid
												container
												spacing={2}
												sx={{
													p: 2,
												}}
											>
												<Grid item xs={6} md={8}>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														주간유입수
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={4}
													sx={{
														textAlign: 'right',
													}}
												>
													{inflow.dataCounts.total === '-' ? (
														<CircularProgress disableShrink size='1.5rem' />
													) : (
														<Typography
															noWrap
															sx={{
																cursor: 'pointer',
																fontSize: 18,
																fontWeight: 'bold',
																textDecoration: 'underline',
															}}
															onClick={() => (window.location.href = '/inflow.html')}
														>
															{common?.user?.purchaseInfo2?.level >= 3 ? inflow.dataCounts.total : '-'}
														</Typography>
													)}
												</Grid>
											</Grid>

											<Grid
												container
												spacing={0.5}
												sx={{
													p: 2,
												}}
											>
												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'A077' && v.connected) ? (
														<img src='/resources/icon-smartstore.png' />
													) : (
														<img src='/resources/icon-smartstore-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{common?.user?.purchaseInfo2?.level >= 3 ? inflow.dataCounts.a077 : '-'}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'B378' && v.connected) ? (
														<img src='/resources/icon-coupang.png' />
													) : (
														<img src='/resources/icon-coupang-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{common?.user?.purchaseInfo2?.level >= 3 ? inflow.dataCounts.b378 : '-'}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'A112' && v.connected) ? (
														<img src='/resources/icon-street-global.png' />
													) : (
														<img src='/resources/icon-street-global-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{common?.user?.purchaseInfo2?.level >= 3 ? inflow.dataCounts.a112 : '-'}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'A113' && v.connected) ? (
														<img src='/resources/icon-street-normal.png' />
													) : (
														<img src='/resources/icon-street-normal-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{common?.user?.purchaseInfo2?.level >= 3 ? inflow.dataCounts.a113 : '-'}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v: any) => v.code === 'A006' && v.connected) ? (
														<img src='/resources/icon-gmarket.png' />
													) : (
														<img src='/resources/icon-gmarket-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{common?.user?.purchaseInfo2?.level >= 3 ? inflow.dataCounts.a006 : '-'}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'A001' && v.connected) ? (
														<img src='/resources/icon-auction.png' />
													) : (
														<img src='/resources/icon-auction-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{common?.user?.purchaseInfo2?.level >= 3 ? inflow.dataCounts.a001 : '-'}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'A027' && v.connected) ? (
														<img src='/resources/icon-interpark.png' />
													) : (
														<img src='/resources/icon-interpark-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{common?.user?.purchaseInfo2?.level >= 3 ? inflow.dataCounts.a027 : '-'}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'B719' && v.connected) ? (
														<img src='/resources/icon-wemakeprice.png' />
													) : (
														<img src='/resources/icon-wemakeprice-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{common?.user?.purchaseInfo2?.level >= 3 ? inflow.dataCounts.b719 : '-'}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'A524' && v.connected) ? (
														<img src='/resources/icon-lotteon-global.png' />
													) : (
														<img src='/resources/icon-lotteon-global-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{common?.user?.purchaseInfo2?.level >= 3 ? inflow.dataCounts.a524 : '-'}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'A525' && v.connected) ? (
														<img src='/resources/icon-lotteon-normal.png' />
													) : (
														<img src='/resources/icon-lotteon-normal-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{common?.user?.purchaseInfo2?.level >= 3 ? inflow.dataCounts.a525 : '-'}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'B956' && v.connected) ? (
														<img src='/resources/icon-tmon.png' />
													) : (
														<img src='/resources/icon-tmon-gray.png' />
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{common?.user?.purchaseInfo2?.level >= 3 ? inflow.dataCounts.b956 : '-'}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={4}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												></Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'A523' && v.connected) ? (
														<Tooltip title='ESM2.0'>
															<img src='/resources/icon-gmarket.png' />
														</Tooltip>
													) : (
														<Tooltip title='ESM2.0'>
															<img src='/resources/icon-gmarket-gray.png' />
														</Tooltip>
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{common?.user?.purchaseInfo2?.level >= 3 ? inflow.dataCounts.a523 : '-'}
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													{common.uploadInfo.markets.find((v) => v.code === 'A522' && v.connected) ? (
														<Tooltip title='ESM2.0'>
															<img src='/resources/icon-auction.png' />
														</Tooltip>
													) : (
														<Tooltip title='ESM2.0'>
															<img src='/resources/icon-auction-gray.png' />
														</Tooltip>
													)}
												</Grid>

												<Grid
													item
													xs={6}
													md={2}
													sx={{
														m: 'auto',
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 18,
															fontWeight: 'bold',
														}}
													>
														{common?.user?.purchaseInfo2?.level >= 3 ? inflow.dataCounts.a522 : '-'}
													</Typography>
												</Grid>
											</Grid>
										</Box>
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											height: 280,
										}}
									>
										<Box
											sx={{
												height: '100%',
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<Grid
												container
												spacing={2}
												sx={{
													p: 2,
												}}
											>
												<Grid
													item
													xs={6}
													md={12}
													sx={{
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 16,
															fontWeight: 'bold',
														}}
													>
														특정 키워드를 금지하거나 치환할 수 있나요?
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={12}
													sx={{
														textAlign: 'center',
													}}
												>
													<Button
														disableElevation
														variant='contained'
														color='info'
														sx={{
															width: '100%',
														}}
														onClick={() => {
															window.location.href = '/banwords.html';
														}}
													>
														금지어/치환어설정 바로가기
													</Button>
												</Grid>
											</Grid>
										</Box>
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											height: 280,
										}}
									>
										<Box
											sx={{
												height: '100%',
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<Grid
												container
												spacing={2}
												sx={{
													p: 2,
												}}
											>
												<Grid
													item
													xs={6}
													md={12}
													sx={{
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 16,
															fontWeight: 'bold',
														}}
													>
														어떤 키워드를 선택해야할 지 궁금하신가요?
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={12}
													sx={{
														textAlign: 'center',
													}}
												>
													<Button
														disableElevation
														variant='contained'
														color='info'
														sx={{
															width: '100%',
														}}
														onClick={() => (window.location.href = '/keyword/analysis.html')}
													>
														키워드분석 바로가기
													</Button>
												</Grid>
											</Grid>
										</Box>
									</Paper>
								</Grid>

								<Grid item xs={6} md={4}>
									<Paper
										variant='outlined'
										sx={{
											height: 280,
										}}
									>
										<Box
											sx={{
												height: '100%',
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<Grid
												container
												spacing={2}
												sx={{
													p: 2,
												}}
											>
												<Grid
													item
													xs={6}
													md={12}
													sx={{
														textAlign: 'center',
													}}
												>
													<Typography
														noWrap
														sx={{
															fontSize: 16,
															fontWeight: 'bold',
														}}
													>
														판매중인 다른 상품들의 정보가 궁금하신가요?
													</Typography>
												</Grid>

												<Grid
													item
													xs={6}
													md={12}
													sx={{
														textAlign: 'center',
													}}
												>
													<Button
														disableElevation
														variant='contained'
														color='info'
														sx={{
															width: '100%',
														}}
														onClick={() => (window.location.href = '/sourcing.html')}
													>
														소싱기 바로가기
													</Button>
												</Grid>
											</Grid>
										</Box>
									</Paper>
								</Grid>
							</Grid>
						</Grid>

						<Grid item xs={6} md={3}>
							<Paper
								variant='outlined'
								sx={{
									height: 190,
									opacity: 0, //영역은 차지하지만 보이진 않게 일단 처리
								}}
							>
								<Box
									sx={{
										height: '100%',
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'space-between',
									}}
								>
									<Grid
										container
										spacing={2}
										sx={{
											p: 2,
										}}
									>
										<Grid item xs={6} md={7}>
											<Typography
												noWrap
												sx={{
													fontSize: 18,
													fontWeight: 'bold',
												}}
											>
												광고베너
											</Typography>
										</Grid>
									</Grid>

									<Grid
										container
										spacing={2}
										sx={{
											p: 2,
										}}
									></Grid>
								</Box>
							</Paper>

							<Paper
								variant='outlined'
								sx={{
									height: 570,
									marginTop: 1,
								}}
							>
								<Grid
									container
									spacing={2.3}
									sx={{
										p: 2,
									}}
								>
									{dashboard.notices.map((v: any) => (
										<>
											<Grid item xs={6} md={7}>
												<Typography
													noWrap
													sx={{
														cursor: 'pointer',
														fontSize: 16,
														fontWeight: 'bold',
													}}
													onClick={() => {
														dashboard.setCurrentNotice(v);
														dashboard.toggleNoticeModal(true);
													}}
												>
													{v.title}
												</Typography>
											</Grid>

											<Grid
												item
												xs={6}
												md={5}
												sx={{
													textAlign: 'right',
												}}
											>
												<Typography
													noWrap
													sx={{
														fontSize: 16,
														fontWeight: 'bold',
													}}
												>
													{format(new Date(v.createdAt), 'yyyy-MM-dd')}
												</Typography>
											</Grid>
										</>
									))}
								</Grid>
							</Paper>
						</Grid>
					</Grid>
				</Container>

				<NoticeModal />
			</Frame>
		</ThemeProvider>
	);
});
