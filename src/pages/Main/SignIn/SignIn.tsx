import React from 'react';
import MUTATIONS from '../GraphQL/Mutations';
import gql from '../GraphQL/Requests';
import LoadingButton from '@mui/lab/LoadingButton';
import { getLocalStorage, queryWindow, setLocalStorage } from '../../Tools/ChromeAsync';
import { Box, Button, Checkbox, Container, FormControlLabel, Link, TextField, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Frame, SignPaper } from '../Common/UI';
import { AppInfo } from '../../../type/type';
import QUERIES from '../GraphQL/Queries';

// 로그인 뷰
export const SignIn = () => {
	const initAppInfo: AppInfo = {
		id: '',
		password: '',
		accessToken: '',
		refreshToken: '',
		loading: false,
		autoFill: false,
		autoLogin: false,
		pageSize: 10,
		gridView: false,
		darkTheme: false,
	};

	// 회원정보 상태관리
	const [appInfo, setAppInfo] = React.useState<AppInfo>(initAppInfo);

	// 컴포넌트 초기화
	React.useEffect(() => {
		// PC에 저장된 회원정보를 가져오고, 자동로그인 또는 자동입력 등의 기능 수행
		getLocalStorage<AppInfo>('appInfo').then((info) => {
			if (!info) return;

			setAppInfo({
				...info,
				id: info.autoFill ? info.id : '',
				password: info.autoFill ? info.password : '',
				darkTheme: info.darkTheme,
			});

			if (info.autoFill && info.autoLogin) signIn(info);
		});
	}, []);

	// 엔터 키를 누르면 로그인 동작 수행
	const keyHandler = (e) => e.key === 'Enter' && signIn(appInfo);
	// 열려있는 셀포유 탭 새로고침 (로그인 정보가 변경되었으므로 갱신 필요)
	const initTabs = async () => {
		const windows = await queryWindow({ populate: true });

		windows.map((v) =>
			v.tabs
				?.filter((w) => w.url?.includes(chrome.runtime.getURL('/')))
				.map((w) => {
					if (v.focused && w.active) return;
					if (w.id) chrome.tabs.reload(w.id);
				}),
		);

		window.location.href = '/app.html';
	};

	// 로그인 버튼을 클릭했을 때
	const signIn = async (info: any) => {
		setAppInfo({ ...appInfo, loading: true });

		// 백엔드 사용자 인증 여부 확인
		const response = await gql(
			MUTATIONS.SIGN_IN_USER_BY_EVERYONE,
			{
				id: info.id,
				pw: info.password,
			},
			false,
		);

		if (response.errors) {
			alert(response.errors[0].message);
			setAppInfo({ ...appInfo, loading: false });
			return;
		}
		// 파파고 API 키 받아오기
		const ppgKey = await gql(QUERIES.SELECT_PAPAGO_API_KEY_BY_EVERYONE, {}, false);
		const resultKey = ppgKey.data.selectPapagoApiKeyByEveryone as string;

		// 회원정보 설정 후 PC 저장
		setAppInfo((state) => {
			const result: AppInfo = {
				...state,
				id: info.id,
				password: info.password,
				autoFill: info.autoFill,
				autoLogin: info.autoLogin,
				accessToken: response.data.signInUserByEveryone.accessToken,
				refreshToken: response.data.signInUserByEveryone.refreshToken,
				loading: false,
			};

			setLocalStorage({ appInfo: result, ppgKey: resultKey || '' }).then(initTabs);

			return result;
		});
	};

	// 회원가입 페이지 이동
	const signUp = () => (window.location.href = '/signup.html');
	// 다크모드 지원 설정
	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: appInfo.darkTheme ? 'dark' : 'light',
				},
			}),
		[appInfo.darkTheme],
	);

	return (
		<ThemeProvider theme={theme}>
			<Frame dark={appInfo.darkTheme}>
				<Container maxWidth='xs'>
					<SignPaper variant='outlined'>
						<h1
							style={{
								marginBottom: 50,
							}}
						>
							로그인
						</h1>

						<TextField
							id='appId'
							variant='outlined'
							size='small'
							style={{
								width: '100%',
								marginBottom: 10,
							}}
							label='아이디'
							value={appInfo.id}
							onChange={(e) => setAppInfo({ ...appInfo, id: e.target.value })}
							onKeyDown={keyHandler}
						/>

						<TextField
							id='appPassword'
							type='password'
							variant='outlined'
							size='small'
							style={{
								width: '100%',
								marginBottom: 30,
							}}
							label='비밀번호'
							value={appInfo.password}
							onChange={(e) => setAppInfo({ ...appInfo, password: e.target.value })}
							onKeyDown={keyHandler}
						/>

						<LoadingButton
							color='info'
							disableElevation
							loading={appInfo.loading}
							variant='contained'
							size='large'
							style={{
								width: '100%',
								marginBottom: 30,
							}}
							onClick={() => signIn(appInfo)}
						>
							로그인
						</LoadingButton>

						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								mb: '30px',
							}}
						>
							<FormControlLabel
								control={
									<Checkbox
										checked={appInfo.autoFill}
										onChange={(e) => {
											setAppInfo((state) => {
												const result: AppInfo = {
													...state,
													autoFill: e.target.checked,
												};

												setLocalStorage({ appInfo: result });

												return result;
											});
										}}
									/>
								}
								label={<Typography fontSize={14}>아이디저장</Typography>}
							/>

							<FormControlLabel
								control={
									<Checkbox
										checked={appInfo.autoLogin}
										onChange={(e) => {
											setAppInfo((state) => {
												const result: AppInfo = {
													...state,
													autoLogin: e.target.checked,
												};

												setLocalStorage({ appInfo: result });

												return result;
											});
										}}
									/>
								}
								label={<Typography fontSize={14}>자동로그인</Typography>}
							/>
						</Box>

						<div
							style={{
								marginBottom: 30,
							}}
						>
							<span
								style={{
									marginRight: 10,
								}}
							>
								아직 셀포유 회원이 아니신가요?
							</span>

							<Button
								variant='outlined'
								size='small'
								style={{
									width: 100,
									// marginBottom: 50
								}}
								onClick={signUp}
							>
								회원가입
							</Button>
						</div>

						<Link href='/lostandfound.html'>계정정보가 기억나지 않으신가요?</Link>
					</SignPaper>
				</Container>
			</Frame>
		</ThemeProvider>
	);
};
