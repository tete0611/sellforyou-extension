import React from 'react';
import MUTATIONS from '../GraphQL/Mutations';
import gql from '../GraphQL/Requests';
import LoadingButton from '@mui/lab/LoadingButton';

import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { Box, Button, Container, Paper, TextField } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Frame } from '../Common/UI';

type SignInfo = {
	password: string;

	newPassword: string;
	newPasswordConfirm: string;

	loading: boolean | undefined;
};

// 비밀번호 변경 뷰
export const ChangePassword = observer(() => {
	// MobX 스토리지 로드
	const { common } = React.useContext(AppContext);

	// 상태 초기화
	const initSignInfo: SignInfo = {
		password: '',

		newPassword: '',
		newPasswordConfirm: '',

		loading: false,
	};

	const [signInfo, setSignInfo] = React.useState<SignInfo>(initSignInfo);

	// 엔터 누를경우 비밀번호 변경 기능이 수행됨
	const keyHandler = (e: any) => {
		if (e.key === 'Enter') {
			changePassword();
		}
	};

	// 비밀번호 변경 로직
	const changePassword = async () => {
		if (!signInfo.password) {
			alert('기존 비밀번호를 입력해주세요.');

			return;
		}

		if (!signInfo.newPassword) {
			alert('새 비밀번호를 입력해주세요.');

			return;
		}

		if (signInfo.newPassword !== signInfo.newPasswordConfirm) {
			alert('새 비밀번호가 일치하지 않습니다.');

			return;
		}

		setSignInfo({ ...signInfo, loading: true });

		const response = await gql(
			MUTATIONS.CHANGE_PASSWORD_BY_USER,
			{
				currentPassword: signInfo.password,
				newPassword: signInfo.newPassword,
			},
			false,
		);

		if (response.errors) {
			alert(response.errors[0].message);

			setSignInfo({ ...signInfo, loading: false });

			return;
		}

		setSignInfo(initSignInfo);

		alert('비밀번호 변경이 완료되었습니다.\n변경하신 비밀번호로 다시 로그인해주시기 바랍니다.');

		window.location.href = '/signin.html';
	};

	// 로그인 페이지로 이동
	const signIn = () => {
		window.location.href = '/signin.html';
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
				<Container maxWidth='sm'>
					<Box
						sx={{
							ml: 10,
							mr: 10,
							mt: 25,
							mb: 25,
						}}
					>
						<Paper
							variant='outlined'
							sx={{
								p: 4,
								textAlign: 'center',
							}}
						>
							<h1
								style={{
									marginBottom: 50,
								}}
							>
								비밀번호변경하기
							</h1>

							<TextField
								id='appPassword'
								type='password'
								variant='outlined'
								size='small'
								style={{
									width: '100%',
									marginBottom: 10,
								}}
								label='기존 비밀번호'
								value={signInfo.password}
								onChange={(e) => setSignInfo({ ...signInfo, password: e.target.value })}
								onKeyDown={keyHandler}
							/>

							<TextField
								id='appNewPassword'
								type='password'
								variant='outlined'
								size='small'
								style={{
									width: '100%',
									marginBottom: 10,
								}}
								label='새 비밀번호'
								value={signInfo.newPassword}
								onChange={(e) => setSignInfo({ ...signInfo, newPassword: e.target.value })}
								onKeyDown={keyHandler}
							/>

							<TextField
								id='appNewPasswordConfirm'
								type='password'
								variant='outlined'
								size='small'
								style={{
									width: '100%',
									marginBottom: 30,
								}}
								label='새 비밀번호 확인'
								value={signInfo.newPasswordConfirm}
								onChange={(e) => setSignInfo({ ...signInfo, newPasswordConfirm: e.target.value })}
								onKeyDown={keyHandler}
							/>

							<LoadingButton
								color='info'
								disableElevation
								loading={signInfo.loading}
								variant='contained'
								size='large'
								style={{
									width: '100%',
									marginBottom: 10,
								}}
								onClick={changePassword}
							>
								비밀번호 변경하기
							</LoadingButton>

							<Button
								variant='outlined'
								size='large'
								style={{
									width: '100%',
								}}
								onClick={signIn}
							>
								로그인으로 돌아가기
							</Button>
						</Paper>
					</Box>
				</Container>
			</Frame>
		</ThemeProvider>
	);
});
