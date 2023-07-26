import React from 'react';
import MUTATIONS from '../GraphQL/Mutations';
import gql from '../GraphQL/Requests';
import LoadingButton from '@mui/lab/LoadingButton';

import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { Button, Container, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Frame, SignPaper } from '../Common/UI';

type SignInfo = {
	email: string;
	password: string;
	passwordConfirm: string;

	phone: string;

	verifyCode: string;

	infoType: string;

	loading: boolean | undefined;
};

type VerifyInfo = {
	process: number;

	timer: number;
};

// 아이디 찾기/비밀번호 변경 뷰
export const LostAndFound = observer(() => {
	// MobX 스토리지 로드
	const { common } = React.useContext(AppContext);

	// 입력정보 초기화
	const initSignInfo: SignInfo = {
		email: '',
		password: '',
		passwordConfirm: '',

		phone: '',

		verifyCode: '',

		infoType: 'USER_ID',

		loading: false,
	};

	// 인증정보 초기화
	const initVerifyInfo: VerifyInfo = {
		process: 0,

		timer: 59,
	};

	const [signInfo, setSignInfo] = React.useState<SignInfo>(initSignInfo);
	const [verifyInfo, setVerifyInfo] = React.useState<VerifyInfo>(initVerifyInfo);

	// 엔터 키를 누르면 아이디 찾기/비밀번호 변경
	const keyHandler = (e: any) => {
		if (e.key === 'Enter') {
			signInfo.infoType === 'USER_ID' ? findEmail() : changePassword();
		}
	};

	// 휴대폰 인증번호 발송
	const phoneVerify = async () => {
		let response: any = null;

		if (signInfo.infoType === 'USER_ID') {
			response = await gql(
				MUTATIONS.FIND_EMAIL_CREATE_VERIFICATION,
				{
					phoneNumber: signInfo.phone,
				},
				false,
			);
		} else {
			response = await gql(
				MUTATIONS.EDIT_PASSWORD_CREATE_VERIFICATION,
				{
					email: signInfo.email,
					phoneNumber: signInfo.phone,
				},
				false,
			);
		}

		if (!response) {
			return;
		}

		if (response.errors) {
			alert(response.errors[0].message);

			return;
		}

		alert('인증번호가 발송되었습니다.');

		setVerifyInfo({ ...verifyInfo, process: 1 });

		let interval = setInterval(() => {
			setVerifyInfo((state) => {
				if (state.process > 1) {
					clearInterval(interval);
				}

				if (state.timer === 0) {
					// alert("입력 시간이 초과되었습니다.");
					setVerifyInfo(initVerifyInfo);

					clearInterval(interval);
				}

				const result: VerifyInfo = {
					...state,

					timer: state.timer - 1,
				};

				return result;
			});
		}, 1000);
	};

	// 인증번호 기반 이메일 찾기
	const findEmail = async () => {
		if (!signInfo.phone) {
			alert('연락처를 입력해주세요.');

			return;
		}

		if (!signInfo.verifyCode) {
			alert('인증번호를 입력해주세요.');

			return;
		}

		setSignInfo({ ...signInfo, loading: true });

		const response = await gql(
			MUTATIONS.FIND_EMAIL,
			{
				phone: signInfo.phone,
				verificationNumber: signInfo.verifyCode,
			},
			false,
		);

		if (response.errors) {
			alert(response.errors[0].message);

			setSignInfo({ ...signInfo, loading: false });

			return;
		}

		setSignInfo(initSignInfo);

		const test = JSON.parse(response.data.findEmail);

		alert(`해당 번호로 가입된 아이디 목록입니다.\n\n${test.join('\n')}`);
	};

	// 인증번호 기반 비밀번호 변경
	const changePassword = async () => {
		if (!signInfo.email) {
			alert('이메일 주소를 입력해주세요.');

			return;
		}

		if (!signInfo.phone) {
			alert('연락처를 입력해주세요.');

			return;
		}

		if (!signInfo.verifyCode) {
			alert('인증번호를 입력해주세요.');

			return;
		}

		if (!signInfo.password) {
			alert('비밀번호를 입력해주세요.');

			return;
		}

		if (signInfo.password !== signInfo.passwordConfirm) {
			alert('비밀번호가 일치하지 않습니다.');

			return;
		}

		setSignInfo({ ...signInfo, loading: true });

		const response = await gql(
			MUTATIONS.EDIT_PASSWORD,
			{
				email: signInfo.email,
				verificationNumber: signInfo.verifyCode,
				newPassword: signInfo.password,
				checkNewPassword: signInfo.passwordConfirm,
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
				<Container maxWidth='xs'>
					<SignPaper>
						<h1
							style={{
								marginBottom: 50,
							}}
						>
							아이디/비밀번호찾기
						</h1>

						<RadioGroup
							row
							aria-labelledby='demo-row-radio-buttons-group-label'
							name='row-radio-buttons-group'
							style={{
								marginBottom: 30,
							}}
							onChange={(e) => {
								setSignInfo({ ...signInfo, infoType: e.target.value });
							}}
							value={signInfo.infoType}
						>
							<FormControlLabel
								value='USER_ID'
								control={<Radio size='small' />}
								label={<Typography fontSize={14}>아이디찾기</Typography>}
							/>
							<FormControlLabel
								value='USER_PASSWORD'
								control={<Radio size='small' />}
								label={<Typography fontSize={14}>비밀번호변경</Typography>}
							/>
						</RadioGroup>

						<Grid
							container
							spacing={1}
							style={{
								marginBottom: 30,
							}}
						>
							{signInfo.infoType === 'USER_ID' ? null : (
								<>
									<Grid
										item
										xs={6}
										md={12}
										sx={{
											margin: 'auto',
										}}
									>
										<TextField
											id='appId'
											variant='outlined'
											size='small'
											style={{
												width: '100%',
											}}
											label='아이디'
											value={signInfo.email}
											onChange={(e) => setSignInfo({ ...signInfo, email: e.target.value })}
											onKeyDown={keyHandler}
										/>
									</Grid>
								</>
							)}

							<Grid
								item
								xs={6}
								md={7}
								sx={{
									margin: 'auto',
								}}
							>
								<TextField
									id='appPhone'
									variant='outlined'
									size='small'
									style={{
										width: '100%',
									}}
									label='연락처'
									value={signInfo.phone}
									onChange={(e) => setSignInfo({ ...signInfo, phone: e.target.value })}
									onKeyDown={keyHandler}
								/>
							</Grid>

							<Grid
								item
								xs={6}
								md={5}
								sx={{
									textAlign: 'center',
									margin: 'auto',
								}}
							>
								<LoadingButton
									color='info'
									disableElevation
									loading={verifyInfo.process > 0 ? true : false}
									loadingIndicator={
										verifyInfo.process > 1 ? `인증완료` : `00:${verifyInfo.timer.toString().padStart(2, '0')}`
									}
									variant='contained'
									size='large'
									style={{
										width: '100%',
									}}
									onClick={phoneVerify}
								>
									인증
								</LoadingButton>
							</Grid>
						</Grid>

						{signInfo.infoType === 'USER_ID' ? (
							<>
								<TextField
									id='appPhone'
									variant='outlined'
									size='small'
									style={{
										width: '100%',
										marginBottom: 10,
									}}
									label='인증번호'
									value={signInfo.verifyCode}
									onChange={(e) => setSignInfo({ ...signInfo, verifyCode: e.target.value })}
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
									onClick={findEmail}
								>
									아이디 찾기
								</LoadingButton>
							</>
						) : (
							<>
								<TextField
									id='appPhone'
									variant='outlined'
									size='small'
									style={{
										width: '100%',
										marginBottom: 10,
									}}
									label='인증번호'
									value={signInfo.verifyCode}
									onChange={(e) => setSignInfo({ ...signInfo, verifyCode: e.target.value })}
									onKeyDown={keyHandler}
								/>

								<TextField
									id='appPassword'
									type='password'
									variant='outlined'
									size='small'
									style={{
										width: '100%',
										marginBottom: 10,
									}}
									label='새 비밀번호'
									value={signInfo.password}
									onChange={(e) => setSignInfo({ ...signInfo, password: e.target.value })}
									onKeyDown={keyHandler}
								/>

								<TextField
									id='appPasswordConfirm'
									type='password'
									variant='outlined'
									size='small'
									style={{
										width: '100%',
										marginBottom: 30,
									}}
									label='새 비밀번호 확인'
									value={signInfo.passwordConfirm}
									onChange={(e) =>
										setSignInfo({
											...signInfo,
											passwordConfirm: e.target.value,
										})
									}
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
							</>
						)}

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
					</SignPaper>
				</Container>
			</Frame>
		</ThemeProvider>
	);
});
