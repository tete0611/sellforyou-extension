import React from 'react';
import {
	Lock as LockIcon,
	Warning as WarningIcon,
	Store as StoreIcon,
	Logout as LogoutIcon,
	Settings as SettingsIcon,
	Payment as PaymentIcon,
	Inventory as InventoryIcon,
	Dashboard as DashboardIcon,
	ExpandMore as ExpandMoreIcon,
	DarkMode as DarkModeIcon,
	LightMode as LightModeIcon,
	BarChart as BarChartIcon,
	ShoppingCart as ShoppingCartIcon,
	Sell as SellIcon,
	AccountCircle as AccountCircleIcon,
	Menu as MenuIcon,
	PublishedWithChanges as PublishedWithChangesIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { getLocalStorage, setLocalStorage } from '../../Tools/ChromeAsync';
import { PayHistoryModal } from '../Modals';
import { NotionRenderer } from 'react-notion';
import {
	AppBar,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Box,
	Button,
	Chip,
	CircularProgress,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Paper,
	Popover,
	Stack,
	Switch,
	Tooltip,
	Toolbar,
	Typography,
} from '@mui/material';

import './Styles.css';
import { MyButton } from './UI';
import { AppInfo } from '../../../type/type';
import { SHOPCODE } from '../../../type/variable';

// 헤더 뷰
export const Header = observer(() => {
	// MobX 스토리지 로드
	const { common } = React.useContext(AppContext);
	const {
		uploadInfo,
		setNotionPage,
		setBanner01Url,
		setBanner01Image,
		addToStack,
		user,
		darkTheme,
		toggleSideBar,
		chips,
		deleteFromStack,
		innerSize,
		banner01Url,
		toggleTheme,
		setPopOverAnchor,
		popOver,
		popOverAnchor,
		togglePayHistoryModal,
		testUserInfo,
		setUserInfo,
		notionPage,
		sideBar,
	} = common;
	const { markets } = uploadInfo;
	const { purchaseInfo2, userInfo, productCount, email, credit, id } = user;
	const {
		AUCTION_1,
		COUPANG,
		TMON,
		G_MARKET_1,
		INTER_PARK,
		LOTTE_ON_GLOBAL,
		LOTTE_ON_NORMAL,
		SMART_STORE,
		STREET11_GLOBAL,
		STREET11_NORMAL,
		WE_MAKE_PRICE,
	} = SHOPCODE;

	React.useEffect(() => {
		// 브라우저 창 크기가 바뀔때마다 갱신해서 반응형으로 동작하도록 구현
		window.addEventListener('resize', () => {
			common.setInnerSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		});

		// 노션 카카오톡 비밀번호 부분 , 베너광고 들
		const notionPageList = [
			'e530d2af14e2463a8cdfc71564f7ba11',
			'url-bacb5130d12641d588fb599b71192eaf',
			'01-url-56daded2fc8044f9ac969b87afc9c296',
		];

		// 노션 데이터 상태 관리
		Promise.all(
			notionPageList.map(async (v, i) => {
				const response = await getNotionPage(v);
				if (i === 0) setNotionPage(response);
				if (i === 1)
					for (let key in response) {
						if (response[key]?.value?.properties?.title[0][0]?.includes('http'))
							setBanner01Url(response[key].value.properties.title[0][0]);
					}
				if (i === 2)
					for (let key in response) {
						if (response[key]?.value?.properties?.title[0][0]?.includes('http'))
							setBanner01Image(response[key].value.properties.title[0][0]);
					}
			}),
		);
	}, []);

	// 노션 페이지 API 요청
	const getNotionPage = async (id) => {
		const pageResp = await fetch(`https://notion-api.splitbee.io/v1/page/${id}`);
		const pageJson = await pageResp.json();

		return pageJson;
	};

	// 로그아웃 눌렀을 때
	const signOut = async () => {
		if (!confirm('로그아웃하시겠습니까?')) return;

		let appInfo = await getLocalStorage<AppInfo>('appInfo');
		appInfo = {
			...appInfo,
			accessToken: '',
			refreshToken: '',
			loading: false,
			autoLogin: false,
		};

		await setLocalStorage({ appInfo });

		window.location.href = '/signin.html';
	};

	// 결제하기 눌렀을 때
	const payment = () => (window.location.href = '/payments.html');

	// window.open("https://www.sellforyou.co.kr/user/payment");

	// 비밀번호 변경 눌렀을 때
	const changePassword = () => (window.location.href = '/changepassword.html');

	// 좌측 삼지창 메뉴아이콘 클릭 시 나타나는 레이아웃
	const menuList = () => (
		<Box
			sx={{
				width: 250,
			}}
		>
			<List>
				{['대시보드'].map((text) => (
					<ListItem key={text} disablePadding>
						<ListItemButton
							onClick={() =>
								addToStack({
									name: '대시보드',
									url: '/dashboard.html',
								})
							}
						>
							<ListItemIcon>
								<DashboardIcon />
							</ListItemIcon>

							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>

			<Divider />

			<List>
				{['수집상품관리'].map((text) => (
					<ListItem key={text} disablePadding>
						<ListItemButton
							onClick={() =>
								addToStack({
									name: '수집상품관리',
									url: '/product/collected.html',
								})
							}
						>
							<ListItemIcon>
								<InventoryIcon />
							</ListItemIcon>

							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}

				{['등록상품관리'].map((text) => (
					<ListItem key={text} disablePadding>
						<ListItemButton
							onClick={() =>
								addToStack({
									name: '등록상품관리',
									url: '/product/registered.html',
								})
							}
						>
							<ListItemIcon>
								<SellIcon />
							</ListItemIcon>

							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}

				{['잠금상품관리'].map((text) => (
					<ListItem key={text} disablePadding>
						<ListItemButton
							onClick={() =>
								purchaseInfo2.level < 3
									? alert('[프로] 등급부터 사용 가능한 기능입니다.')
									: addToStack({
											name: '잠금상품관리',
											url: '/product/locked.html',
									  })
							}
						>
							<ListItemIcon>
								<LockIcon />
							</ListItemIcon>

							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}

				{['상품강제삭제'].map((text) => (
					<ListItem key={text} disablePadding>
						<ListItemButton
							onClick={() =>
								confirm(
									'마켓에 업로드된 상태와 관계없이 셀포유에서 상품정보를 모두 삭제 또는 해제하는 기능입니다.\n삭제 전 마켓에 업로드 유무를 꼭 확인해주세요.\n진입하시겠습니까?',
								) &&
								addToStack({
									name: '상품강제삭제',
									url: '/product/errored.html',
								})
							}
						>
							<ListItemIcon>
								<WarningIcon />
							</ListItemIcon>

							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>

			<Divider />

			<List>
				{['신규주문관리'].map((text) => (
					<ListItem key={text} disablePadding>
						<ListItemButton
							onClick={() =>
								addToStack({
									name: '신규주문관리',
									url: '/order/new.html',
								})
							}
						>
							<ListItemIcon>
								<ShoppingCartIcon />
							</ListItemIcon>

							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}

				{/* {["주문발송관리"].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() =>
                addToStack({
                  name: "주문발송관리",
                  url: "/order/delivery.html",
                })
              }
            >
              <ListItemIcon>
                <LocalShippingIcon />
              </ListItemIcon>

              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))} */}

				{/* {["세무자료관리"].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() =>
                addToStack({
                  name: "세무자료관리",
                  url: "/order/tax.html",
                })
              }
            >
              <ListItemIcon>
                <ReceiptIcon />
              </ListItemIcon>

              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))} */}
			</List>

			<Divider />

			<List>
				{['유입수분석'].map((text) => (
					<ListItem key={text} disablePadding>
						<ListItemButton
							onClick={() =>
								addToStack({
									name: '유입수분석',
									url: '/inflow.html',
								})
							}
						>
							<ListItemIcon>
								<BarChartIcon />
							</ListItemIcon>

							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}

				{['키워드분석'].map((text) => (
					<ListItem key={text} disablePadding>
						<ListItemButton
							onClick={() =>
								addToStack({
									name: '키워드분석',
									url: '/keyword/analysis.html',
								})
							}
						>
							<ListItemIcon>
								<BarChartIcon />
							</ListItemIcon>

							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}

				{/* {['키워드추천'].map((text) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={() => addToStack({
                            name: '키워드추천',
                            url: '/keyword/reference.html'
                        })}>
                            <ListItemIcon>
                                <BarChartIcon />
                            </ListItemIcon>

                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))} */}

				{['소싱기'].map((text) => (
					<ListItem key={text} disablePadding>
						<ListItemButton
							onClick={() =>
								addToStack({
									name: '소싱기',
									url: '/sourcing.html',
								})
							}
						>
							<ListItemIcon>
								<BarChartIcon />
							</ListItemIcon>

							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>

			<Divider />

			<List>
				{['기본설정'].map((text) => (
					<ListItem key={text} disablePadding>
						<ListItemButton
							onClick={() =>
								addToStack({
									name: '기본설정',
									url: '/settings.html',
								})
							}
						>
							<ListItemIcon>
								<SettingsIcon />
							</ListItemIcon>

							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}

				{['오픈마켓연동'].map((text) => (
					<ListItem key={text} disablePadding>
						<ListItemButton
							onClick={() =>
								addToStack({
									name: '오픈마켓연동',
									url: '/connects.html',
								})
							}
						>
							<ListItemIcon>
								<StoreIcon />
							</ListItemIcon>

							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}

				{['금지어/치환어설정'].map((text) => (
					<ListItem key={text} disablePadding>
						<ListItemButton
							onClick={() =>
								addToStack({
									name: '금지어/치환어설정',
									url: '/banwords.html',
								})
							}
						>
							<ListItemIcon>
								<PublishedWithChangesIcon />
							</ListItemIcon>

							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>

			<Divider />

			<List>
				{['결제하기'].map((text) => (
					<ListItem key={text} disablePadding>
						<ListItemButton onClick={payment}>
							<ListItemIcon>
								<PaymentIcon />
							</ListItemIcon>

							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}

				{['로그아웃'].map((text) => (
					<ListItem key={text} disablePadding>
						<ListItemButton onClick={signOut}>
							<ListItemIcon>
								<LogoutIcon />
							</ListItemIcon>

							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	return (
		<>
			<AppBar
				// position="fixed"
				elevation={0}
				style={{
					background: darkTheme ? '#303030' : '#ebebeb',
					color: darkTheme ? 'white' : 'black',
				}}
			>
				<Toolbar
					style={{
						minHeight: 50,
					}}
				>
					<IconButton
						size='large'
						color='inherit'
						edge='start'
						sx={{
							mr: 1,
						}}
						onClick={toggleSideBar}
					>
						<MenuIcon />
					</IconButton>

					<Box>
						<Stack direction='row' spacing={0}>
							{chips?.map((v: any, i: number) => (
								<>
									<Chip
										label={v.name}
										onClick={() => (window.location.href = v.url)}
										onDelete={() => deleteFromStack(i)}
										sx={{
											bgcolor: v.url.includes(window.location.pathname)
												? darkTheme
													? '#242424'
													: '#f5f5f5'
												: darkTheme
												? '#303030'
												: '#ebebeb',
											color: darkTheme ? 'white' : 'black',
											p: 1,
										}}
										style={{
											borderRadius: 0,
											height: 50,
											maxWidth: innerSize.width / 1.8 / chips.length,
										}}
									/>
								</>
							))}
						</Stack>
					</Box>

					<Box sx={{ flexGrow: 1 }} />

					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<MyButton
							color='info'
							sx={{
								minWidth: 80,
							}}
							onClick={() => window.open(`${banner01Url}`)}
						>
							무료수입대행
						</MyButton>
						<Divider sx={{ height: 28, mr: 1, ml: 1 }} orientation='vertical' />
						<Typography fontSize={13}>바로가기</Typography>
						<Divider sx={{ height: 28, mr: 1, ml: 1 }} orientation='vertical' />
						<MyButton
							color='info'
							sx={{
								minWidth: 80,
							}}
							onClick={() =>
								window.open('https://sellforyou.channel.io/lounge', '팝업', 'width=400px,height=700px,scrollbars=yes')
							}
						>
							실시간상담
						</MyButton>
						<MyButton
							color='info'
							sx={{
								ml: 0.5,
								minWidth: 80,
							}}
							onClick={() => window.open('https://open.kakao.com/o/gfCffF3e')}
						>
							오픈채팅방
						</MyButton>
						<MyButton
							color='info'
							sx={{
								ml: 0.5,
								minWidth: 80,
							}}
							onClick={() => window.open('https://cafe.naver.com/sellfor')}
						>
							네이버카페
						</MyButton>
						<MyButton
							color='info'
							sx={{
								ml: 0.5,
								minWidth: 80,
							}}
							onClick={() =>
								window.open('https://panoramic-butternut-291.notion.site/2619a31e8a93438fa308dcfaae76666a')
							}
						>
							이용가이드
						</MyButton>
						&nbsp; &nbsp;
						<Tooltip title={darkTheme ? '다크모드: 켜짐' : '다크모드: 꺼짐'}>
							<IconButton size='large' color='inherit' onClick={(e) => toggleTheme()}>
								{darkTheme ? <DarkModeIcon /> : <LightModeIcon />}
							</IconButton>
						</Tooltip>
						&nbsp;
						<Tooltip title='내 정보'>
							<IconButton size='large' color='inherit' onClick={(e) => setPopOverAnchor(e.currentTarget)}>
								<AccountCircleIcon />
							</IconButton>
						</Tooltip>
						<Popover
							open={popOver}
							anchorEl={popOverAnchor}
							onClose={() => setPopOverAnchor(null)}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
						>
							<Paper
								sx={{
									p: 3,

									width: 250,
								}}
							>
								{userInfo ? (
									<>
										<Box
											sx={{
												mb: 2,
											}}
										>
											<Accordion
												defaultExpanded
												sx={{
													width: '100%',
												}}
											>
												<AccordionSummary expandIcon={<ExpandMoreIcon />}>
													<Typography
														sx={{
															fontSize: 13,
														}}
													>
														내 정보
													</Typography>
												</AccordionSummary>
												<AccordionDetails>
													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
															mb: 1,
														}}
													>
														{purchaseInfo2?.level === 1 ? (
															<Chip size='small' label='체험판' color='warning' sx={{ width: 65 }} />
														) : purchaseInfo2?.level === 2 ? (
															<Chip size='small' label='베이직' color='info' sx={{ width: 65 }} />
														) : purchaseInfo2?.level === 3 ? (
															<Chip size='small' label='프로' color='secondary' sx={{ width: 65 }} />
														) : purchaseInfo2?.level === 4 ? (
															<Chip size='small' label='프리미엄' color='error' sx={{ width: 65 }} />
														) : (
															<Chip size='small' label='미설정' sx={{ width: 65 }} />
														)}

														<Typography
															sx={{
																fontSize: 13,
															}}
														>
															{email}
														</Typography>
													</Box>

													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
															mb: 1,
														}}
													>
														<Typography
															sx={{
																fontSize: 13,
															}}
														>
															관리상품수
														</Typography>

														<Typography
															sx={{
																color: '#1976d2',
																fontSize: 13,
															}}
														>
															{productCount} 개
														</Typography>
													</Box>

													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
															mb: 3,
														}}
													>
														<Typography
															sx={{
																fontSize: 13,
															}}
														>
															보유적립금
														</Typography>

														<Typography
															sx={{
																color: '#ed6c02',
																fontSize: 13,
															}}
														>
															{credit.toLocaleString('ko-KR')} P
														</Typography>
													</Box>

													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
															mb: 0.5,
														}}
													>
														<MyButton
															color='info'
															variant='outlined'
															sx={{
																width: '100%',
															}}
															onClick={() => togglePayHistoryModal(id, true)}
														>
															결제내역
														</MyButton>
														&nbsp;
														<MyButton
															color='info'
															variant='outlined'
															sx={{
																width: '100%',
															}}
															onClick={payment}
														>
															결제하기
														</MyButton>
													</Box>

													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
															mb: 0.5,
														}}
													>
														<MyButton
															color='info'
															sx={{
																width: '100%',
															}}
															onClick={changePassword}
														>
															비밀번호 변경
														</MyButton>
													</Box>

													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
														}}
													>
														<MyButton
															color='error'
															sx={{
																width: '100%',
															}}
															onClick={signOut}
														>
															로그아웃
														</MyButton>
													</Box>
												</AccordionDetails>
											</Accordion>

											<Accordion
												sx={{
													width: '100%',
												}}
											>
												<AccordionSummary expandIcon={<ExpandMoreIcon />}>
													<Typography
														sx={{
															fontSize: 13,
														}}
													>
														오픈마켓 사용설정
													</Typography>
												</AccordionSummary>
												<AccordionDetails
													sx={{
														height: 100,
														overflowY: 'auto',
													}}
												>
													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
															mb: 1,
														}}
													>
														{markets.find((v) => v.code === SMART_STORE && v.connected) ? (
															<img src='/resources/icon-smartstore.png' />
														) : (
															<img src='/resources/icon-smartstore-gray.png' />
														)}

														<Switch
															size='small'
															checked={userInfo?.naverUseType === 'Y' ? true : false}
															disabled={!markets.find((v) => v.code === SMART_STORE)?.connected}
															onChange={async (e) => {
																const naverUseType = e.target.checked ? 'Y' : 'N';

																await testUserInfo({ naverUseType });

																setUserInfo({
																	...userInfo,
																	naverUseType,
																});

																let tmp = markets.find((v) => v.code === SMART_STORE)!;

																tmp.disabled = !e.target.checked;
																tmp.upload = e.target.checked;
																tmp.video = e.target.checked;
															}}
														/>
													</Box>

													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
															mb: 1,
														}}
													>
														{markets.find((v) => v.code === COUPANG && v.connected) ? (
															<img src='/resources/icon-coupang.png' />
														) : (
															<img src='/resources/icon-coupang-gray.png' />
														)}

														<Switch
															size='small'
															checked={userInfo?.coupangUseType === 'Y' ? true : false}
															disabled={!markets.find((v) => v.code === COUPANG)?.connected}
															onChange={async (e) => {
																const coupangUseType = e.target.checked ? 'Y' : 'N';

																await testUserInfo({ coupangUseType });

																setUserInfo({
																	...userInfo,
																	coupangUseType,
																});

																let tmp = markets.find((v) => v.code === COUPANG)!;

																tmp.disabled = !e.target.checked;
																tmp.upload = e.target.checked;
																tmp.video = e.target.checked;
															}}
														/>
													</Box>

													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
															mb: 1,
														}}
													>
														{markets.find((v) => v.code === STREET11_GLOBAL && v.connected) ? (
															<img src='/resources/icon-street-global.png' />
														) : (
															<img src='/resources/icon-street-global-gray.png' />
														)}

														<Switch
															size='small'
															checked={userInfo?.streetUseType === 'Y' ? true : false}
															disabled={!markets.find((v) => v.code === STREET11_GLOBAL)?.connected}
															onChange={async (e) => {
																const streetUseType = e.target.checked ? 'Y' : 'N';

																await testUserInfo({ streetUseType });

																setUserInfo({
																	...userInfo,
																	streetUseType,
																});

																let tmp = markets.find((v) => v.code === STREET11_GLOBAL)!;

																tmp.disabled = !e.target.checked;
																tmp.upload = e.target.checked;
																tmp.video = e.target.checked;
															}}
														/>
													</Box>

													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
															mb: 1,
														}}
													>
														{markets.find((v) => v.code === STREET11_NORMAL && v.connected) ? (
															<img src='/resources/icon-street-normal.png' />
														) : (
															<img src='/resources/icon-street-normal-gray.png' />
														)}

														<Switch
															size='small'
															checked={userInfo?.streetNormalUseType === 'Y' ? true : false}
															disabled={!markets.find((v) => v.code === STREET11_NORMAL)?.connected}
															onChange={async (e) => {
																const streetNormalUseType = e.target.checked ? 'Y' : 'N';

																await testUserInfo({
																	streetNormalUseType,
																});

																setUserInfo({
																	...userInfo,
																	streetNormalUseType,
																});

																let tmp = markets.find((v) => v.code === STREET11_NORMAL)!;

																tmp.disabled = !e.target.checked;
																tmp.upload = e.target.checked;
																tmp.video = e.target.checked;
															}}
														/>
													</Box>

													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
															mb: 1,
														}}
													>
														{markets.find((v) => v.code === G_MARKET_1 && v.connected) ? (
															<img src='/resources/icon-gmarket.png' />
														) : (
															<img src='/resources/icon-gmarket-gray.png' />
														)}

														<Switch
															size='small'
															checked={userInfo?.gmarketUseType === 'Y' ? true : false}
															disabled={!markets.find((v) => v.code === G_MARKET_1)?.connected}
															onChange={async (e) => {
																const gmarketUseType = e.target.checked ? 'Y' : 'N';

																await testUserInfo({ gmarketUseType });

																setUserInfo({
																	...userInfo,
																	gmarketUseType,
																});

																let tmp = markets.find((v) => v.code === G_MARKET_1)!;

																tmp.disabled = !e.target.checked;
																tmp.upload = e.target.checked;
																tmp.video = e.target.checked;
															}}
														/>
													</Box>

													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
															mb: 1,
														}}
													>
														{markets.find((v) => v.code === AUCTION_1 && v.connected) ? (
															<img src='/resources/icon-auction.png' />
														) : (
															<img src='/resources/icon-auction-gray.png' />
														)}

														<Switch
															size='small'
															checked={userInfo?.auctionUseType === 'Y' ? true : false}
															disabled={!markets.find((v) => v.code === AUCTION_1)?.connected}
															onChange={async (e) => {
																const auctionUseType = e.target.checked ? 'Y' : 'N';

																await testUserInfo({ auctionUseType });

																setUserInfo({
																	...userInfo,
																	auctionUseType,
																});

																let tmp = markets.find((v) => v.code === AUCTION_1)!;

																tmp.disabled = !e.target.checked;
																tmp.upload = e.target.checked;
																tmp.video = e.target.checked;
															}}
														/>
													</Box>

													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
															mb: 1,
														}}
													>
														{markets.find((v) => v.code === INTER_PARK && v.connected) ? (
															<img src='/resources/icon-interpark.png' />
														) : (
															<img src='/resources/icon-interpark-gray.png' />
														)}

														<Switch
															size='small'
															checked={userInfo?.interparkUseType === 'Y' ? true : false}
															disabled={!markets.find((v) => v.code === INTER_PARK)?.connected}
															onChange={async (e) => {
																const interparkUseType = e.target.checked ? 'Y' : 'N';

																await testUserInfo({ interparkUseType });

																setUserInfo({
																	...userInfo,
																	interparkUseType,
																});

																let tmp = markets.find((v) => v.code === INTER_PARK)!;

																tmp.disabled = !e.target.checked;
																tmp.upload = e.target.checked;
																tmp.video = e.target.checked;
															}}
														/>
													</Box>

													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
															mb: 1,
														}}
													>
														{markets.find((v) => v.code === WE_MAKE_PRICE && v.connected) ? (
															<img src='/resources/icon-wemakeprice.png' />
														) : (
															<img src='/resources/icon-wemakeprice-gray.png' />
														)}

														<Switch
															size='small'
															checked={userInfo?.wemakepriceUseType === 'Y' ? true : false}
															disabled={!markets.find((v) => v.code === WE_MAKE_PRICE)?.connected}
															onChange={async (e) => {
																const wemakepriceUseType = e.target.checked ? 'Y' : 'N';

																await testUserInfo({
																	wemakepriceUseType,
																});

																setUserInfo({
																	...userInfo,
																	wemakepriceUseType,
																});

																let tmp = markets.find((v) => v.code === WE_MAKE_PRICE)!;

																tmp.disabled = !e.target.checked;
																tmp.upload = e.target.checked;
																tmp.video = e.target.checked;
															}}
														/>
													</Box>

													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
															mb: 1,
														}}
													>
														{markets.find((v) => v.code === LOTTE_ON_GLOBAL && v.connected) ? (
															<img src='/resources/icon-lotteon-global.png' />
														) : (
															<img src='/resources/icon-lotteon-global-gray.png' />
														)}

														<Switch
															size='small'
															checked={userInfo?.lotteonUseType === 'Y' ? true : false}
															disabled={
																!(
																	markets.find((v) => v.code === LOTTE_ON_GLOBAL)?.connected ||
																	markets.find((v) => v.code === LOTTE_ON_NORMAL)?.connected
																)
															}
															onChange={async (e) => {
																const lotteonUseType = e.target.checked ? 'Y' : 'N';

																await testUserInfo({ lotteonUseType });

																setUserInfo({
																	...userInfo,
																	lotteonUseType,
																});

																if (userInfo.lotteonSellerType === 'G') {
																	let tmp_1 = markets.find((v) => v.code === LOTTE_ON_GLOBAL)!;

																	tmp_1.disabled = !e.target.checked;
																	tmp_1.upload = e.target.checked;
																	tmp_1.video = e.target.checked;
																} else {
																	let tmp_2 = markets.find((v) => v.code === LOTTE_ON_NORMAL)!;

																	tmp_2.disabled = !e.target.checked;
																	tmp_2.upload = e.target.checked;
																	tmp_2.video = e.target.checked;
																}
															}}
														/>
													</Box>

													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
															mb: 1,
														}}
													>
														{markets.find((v) => v.code === LOTTE_ON_NORMAL && v.connected) ? (
															<img src='/resources/icon-lotteon-normal.png' />
														) : (
															<img src='/resources/icon-lotteon-normal-gray.png' />
														)}

														<Switch
															size='small'
															checked={userInfo?.lotteonUseType === 'Y' ? true : false}
															disabled={
																!(
																	markets.find((v) => v.code === LOTTE_ON_GLOBAL)?.connected ||
																	markets.find((v) => v.code === LOTTE_ON_NORMAL)?.connected
																)
															}
															onChange={async (e) => {
																const lotteonUseType = e.target.checked ? 'Y' : 'N';

																await testUserInfo({ lotteonUseType });

																setUserInfo({
																	...userInfo,
																	lotteonUseType,
																});

																if (userInfo.lotteonSellerType === 'G') {
																	let tmp_1 = markets.find((v) => v.code === LOTTE_ON_GLOBAL)!;

																	tmp_1.disabled = !e.target.checked;
																	tmp_1.upload = e.target.checked;
																	tmp_1.video = e.target.checked;
																} else {
																	let tmp_2 = markets.find((v) => v.code === LOTTE_ON_NORMAL)!;

																	tmp_2.disabled = !e.target.checked;
																	tmp_2.upload = e.target.checked;
																	tmp_2.video = e.target.checked;
																}
															}}
														/>
													</Box>

													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-between',
															mb: 1,
														}}
													>
														{markets.find((v) => v.code === TMON && v.connected) ? (
															<img src='/resources/icon-tmon.png' />
														) : (
															<img src='/resources/icon-tmon-gray.png' />
														)}

														<Switch
															size='small'
															checked={userInfo?.tmonUseType === 'Y' ? true : false}
															disabled={!markets.find((v) => v.code === TMON)?.connected}
															onChange={async (e) => {
																const tmonUseType = e.target.checked ? 'Y' : 'N';

																await testUserInfo({ tmonUseType });

																setUserInfo({
																	...userInfo,
																	tmonUseType,
																});

																let tmp = markets.find((v) => v.code === TMON)!;

																tmp.disabled = !e.target.checked;
																tmp.upload = e.target.checked;
																tmp.video = e.target.checked;
															}}
														/>
													</Box>
												</AccordionDetails>
											</Accordion>
										</Box>

										{purchaseInfo2?.level > 1 ? (
											<Paper
												variant='outlined'
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'space-between',
													mb: 2,
													p: 1,
												}}
											>
												{notionPage ? <NotionRenderer blockMap={notionPage} /> : null}
											</Paper>
										) : null}

										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between',
											}}
										>
											<Typography
												sx={{
													fontSize: 13,
												}}
											>
												셀포유 버전정보: {chrome.runtime.getManifest().version}
											</Typography>

											<Button
												disableElevation
												size='small'
												variant='outlined'
												color='info'
												onClick={() =>
													window.open(
														'https://chrome.google.com/webstore/detail/%EC%85%80%ED%8F%AC%EC%9C%A0/cdghhijdbghkgklajgahabkbbpijddlo?hl=ko',
													)
												}
											>
												최신버전 확인
											</Button>
										</Box>
									</>
								) : (
									<>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
											}}
										>
											<CircularProgress
												size='1rem'
												style={{
													marginRight: 15,
												}}
											/>

											<Typography
												sx={{
													fontSize: 13,
												}}
											>
												사용자 정보를 가져오는 중...
											</Typography>
										</Box>
									</>
								)}
							</Paper>
						</Popover>
					</Box>
				</Toolbar>
			</AppBar>

			<div
				style={{
					height: 48,
				}}
			/>

			<Drawer anchor={'left'} open={sideBar} onClose={toggleSideBar}>
				{menuList()}
			</Drawer>

			<PayHistoryModal />

			<div id='toastContainer' className='toast-container'></div>
		</>
	);
});
