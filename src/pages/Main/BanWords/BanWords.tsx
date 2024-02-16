import React, { useContext, useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import {
	styled,
	Box,
	Button,
	Container,
	Checkbox,
	Grid,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Paper,
	TextField,
	Typography,
} from '@mui/material';
import { readFileDataURL } from '../../../../common/function';
import { Title } from '../Common/UI';
import { REG_EXP } from '../../../../common/regex';

// 커스텀 테이블 컬럼 생성
const StyledTableCell = styled(TableCell)({
	textAlign: 'center',
	borderBottom: '1px solid ghostwhite',
	padding: 0,
	fontSize: 14,
});

// 금지어/치환어 뷰
const BanWords = observer(() => {
	// MobX 스토리지 로드
	const { common, restrict } = useContext(AppContext);
	const {
		restrictWordInfo,
		getRestrictWords,
		deleteWordTable,
		toggleBanCheckedAll,
		toggleBanChecked,
		setRestrictWordInfo,
		addWordTable,
		uploadExcel,
		toggleReplaceCheckedAll,
		toggleReplaceChecked,
	} = restrict;
	const [banWordToggle, setBanWordToggle] = useState(true); // 금지어 등록버튼 disable 용도
	const [replaceWordToggle, setReplaceWordToggle] = useState(true); // 치환어 등록버튼 disable 용도
	const banwordRef = useRef<HTMLInputElement>();
	const findwordRef = useRef<HTMLInputElement>();
	const replacewordRef = useRef<HTMLInputElement>();

	/** 금지어/치환어 등록후 작동함수 */
	const onCreateSuccess = ({ type }: { type: 'banWord' | 'restrictWord' }) => {
		if (type === 'banWord') {
			setRestrictWordInfo({
				...restrictWordInfo,
				banWordInput: '',
			});
			banwordRef.current!.value = '';
			setBanWordToggle(true);
		} else {
			setRestrictWordInfo({
				...restrictWordInfo,
				findWordInput: '',
				replaceWordInput: '',
			});
			findwordRef.current!.value = '';
			replacewordRef.current!.value = '';
			setReplaceWordToggle(true);
		}
		getRestrictWords();
	};

	// 금지어/치환어 불러오기
	useEffect(() => {
		getRestrictWords();
	}, []);

	// 다크모드 지원 설정
	// const theme = useMemo(
	// 	() =>
	// 		createTheme({
	// 			palette: {
	// 				mode: common.darkTheme ? 'dark' : 'light',
	// 			},
	// 		}),
	// 	[common.darkTheme],
	// );

	return (
		<>
			{restrictWordInfo.loading ? (
				<>
					<Container maxWidth={'lg'}>
						<Grid
							container
							spacing={1}
							sx={{
								p: 0,
							}}
						>
							<Grid
								item
								xs={6}
								md={6}
								sx={{
									margin: 'auto',
								}}
							>
								<Paper variant='outlined'>
									<Title dark={common.darkTheme}>
										금지어 목록
										<Button
											disableElevation
											color='error'
											variant='contained'
											sx={{
												width: 100,
												height: 30,
											}}
											onClick={async () => {
												const result = await deleteWordTable({ type: 'banWord' });
												if (result) getRestrictWords();
											}}
										>
											삭제
										</Button>
									</Title>

									<Box
										sx={{
											p: 0,
											height: common.innerSize.height - 257,
											overflowY: 'auto',
										}}
									>
										<Table size='small' stickyHeader>
											<TableHead>
												<TableRow>
													<StyledTableCell
														width={100}
														style={{
															background: common.darkTheme ? '#303030' : '#ebebeb',
														}}
													>
														<Checkbox onChange={(e) => toggleBanCheckedAll(e.target.checked)} />
													</StyledTableCell>

													<StyledTableCell
														style={{
															background: common.darkTheme ? '#303030' : '#ebebeb',
														}}
													>
														금지어명
													</StyledTableCell>
												</TableRow>
											</TableHead>

											<TableBody>
												{restrictWordInfo.banList?.map((v, index) => (
													<TableRow hover>
														<StyledTableCell>
															<Checkbox
																checked={restrictWordInfo.banChecked[index]}
																onChange={(e) => toggleBanChecked(e.target.checked, index)}
															/>
														</StyledTableCell>

														<StyledTableCell>
															<Typography fontSize={14} fontFamily={'nanumGothicR !important'}>
																{v.findWord}
															</Typography>
														</StyledTableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</Box>

									<Box
										sx={{
											p: 1,
										}}
									>
										<Grid
											container
											spacing={1}
											sx={{
												p: 0,
											}}
										>
											<Grid
												item
												xs={6}
												md={8}
												sx={{
													margin: 'auto',
												}}
											>
												<TextField
													inputRef={banwordRef}
													placeholder='금지어를 입력하세요'
													id='banWords_banWordInput'
													variant='outlined'
													size='small'
													style={{
														width: '100%',
													}}
													inputProps={{
														style: {
															fontSize: 14,
														},
													}}
													// setState 이벤트 딜레이가 심해서 최소한의 setState작동으로 코드 작성함
													onChange={(e) => {
														if (REG_EXP.onlyWhiteSpaces.test(e.currentTarget.value) && !banWordToggle)
															setBanWordToggle(true);
														else if (!REG_EXP.onlyWhiteSpaces.test(e.currentTarget.value) && banWordToggle)
															setBanWordToggle(false);
													}}
													onKeyDown={async (e) => {
														if (e.key === 'Enter' && !banWordToggle) {
															const result = await addWordTable({
																//@ts-ignore
																findWord: e.target.value,
																replaceWord: null,
															});
															if (result) onCreateSuccess({ type: 'banWord' });
														}
													}}
													onBlur={(e) =>
														setRestrictWordInfo({
															...restrictWordInfo,

															banWordInput: e.target.value,
														})
													}
												/>
											</Grid>

											<Grid
												item
												xs={6}
												md={4}
												sx={{
													margin: 'auto',
												}}
											>
												<Button
													disableElevation
													disabled={banWordToggle}
													variant='contained'
													color='info'
													sx={{
														width: '100%',
													}}
													onClick={async () => {
														const result = await addWordTable({
															findWord: restrictWordInfo.banWordInput,
															replaceWord: null,
														});
														if (result) onCreateSuccess({ type: 'banWord' });
													}}
												>
													등록
												</Button>
											</Grid>

											<Grid
												item
												xs={6}
												md={12}
												sx={{
													margin: 'auto',
												}}
											>
												<Button
													disableElevation
													variant='contained'
													component='label'
													color='info'
													sx={{
														width: '100%',
													}}
												>
													금지어 대량등록
													<input
														hidden
														accept='application/*'
														multiple
														type='file'
														onChange={async (e) => {
															const fileList = e.target.files ?? [];

															await readFileDataURL(fileList[0]);

															await uploadExcel({
																data: fileList[0],
																isReplace: false,
															});

															getRestrictWords();
														}}
													/>
												</Button>
											</Grid>

											<Grid
												item
												xs={6}
												md={12}
												sx={{
													margin: 'auto',
												}}
											>
												<Button
													disableElevation
													variant='contained'
													color='info'
													sx={{
														width: '100%',
													}}
													onClick={() =>
														window.open(`${process.env.SELLFORYOU_MINIO_HTTPS}/data/셀포유 금지어 양식.xlsx`)
													}
												>
													금지어 대량등록 양식 다운로드
												</Button>
											</Grid>
										</Grid>
									</Box>
								</Paper>
							</Grid>

							<Grid
								item
								xs={6}
								md={6}
								sx={{
									margin: 'auto',
								}}
							>
								<Paper variant='outlined'>
									<Title dark={common.darkTheme}>
										치환어 목록
										<Button
											disableElevation
											color='error'
											variant='contained'
											sx={{
												width: 100,
												height: 30,
											}}
											onClick={async () => {
												const result = await deleteWordTable({ type: 'replaceWord' });

												if (result) getRestrictWords();
											}}
										>
											삭제
										</Button>
									</Title>

									<Box
										sx={{
											p: 0,
											height: common.innerSize.height - 257,
											overflowY: 'auto',
										}}
									>
										<Table size='small' stickyHeader>
											<TableHead>
												<TableRow>
													<StyledTableCell
														width={100}
														style={{
															background: common.darkTheme ? '#303030' : '#ebebeb',
														}}
													>
														<Checkbox onChange={(e) => toggleReplaceCheckedAll(e.target.checked)} />
													</StyledTableCell>

													<StyledTableCell
														style={{
															background: common.darkTheme ? '#303030' : '#ebebeb',
														}}
													>
														검색어명
													</StyledTableCell>

													<StyledTableCell
														style={{
															background: common.darkTheme ? '#303030' : '#ebebeb',
														}}
													>
														치환어명
													</StyledTableCell>
												</TableRow>
											</TableHead>

											<TableBody>
												{restrictWordInfo.replaceList?.map((v, index) => (
													<TableRow hover>
														<StyledTableCell>
															<Checkbox
																checked={restrictWordInfo.replaceChecked[index]}
																onChange={(e) => toggleReplaceChecked(e.target.checked, index)}
															/>
														</StyledTableCell>

														<StyledTableCell>
															<Typography fontSize={14} fontFamily={'nanumGothicR !important'}>
																{v.findWord}
															</Typography>
														</StyledTableCell>

														<StyledTableCell>
															<Typography fontSize={14} fontFamily={'nanumGothicR !important'}>
																{v.replaceWord}
															</Typography>
														</StyledTableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</Box>

									<Box
										sx={{
											p: 1,
										}}
									>
										<Grid
											container
											spacing={1}
											sx={{
												p: 0,
											}}
										>
											<Grid
												item
												xs={6}
												md={4}
												sx={{
													margin: 'auto',
												}}
											>
												<TextField
													inputRef={findwordRef}
													placeholder='검색어를 입력하세요'
													id='banWords_findWordInput'
													variant='outlined'
													size='small'
													style={{
														width: '100%',
													}}
													inputProps={{
														style: {
															fontSize: 14,
														},
													}}
													onChange={(e) => {
														if (REG_EXP.onlyWhiteSpaces.test(e.currentTarget.value) && !replaceWordToggle)
															setReplaceWordToggle(true);
														else if (!REG_EXP.onlyWhiteSpaces.test(e.currentTarget.value) && replaceWordToggle)
															setReplaceWordToggle(false);
													}}
													onKeyDown={async (e) => {
														if (e.key === 'Enter' && !replaceWordToggle) {
															const result = await addWordTable({
																//@ts-ignore
																findWord: e.target.value,
																replaceWord: restrictWordInfo.replaceWordInput,
															});
															if (result) onCreateSuccess({ type: 'restrictWord' });
														}
													}}
													onBlur={(e) =>
														setRestrictWordInfo({
															...restrictWordInfo,

															findWordInput: e.target.value,
														})
													}
												/>
											</Grid>

											<Grid
												item
												xs={6}
												md={4}
												sx={{
													margin: 'auto',
												}}
											>
												<TextField
													inputRef={replacewordRef}
													onKeyDown={async (e) => {
														if (e.key === 'Enter' && !replaceWordToggle) {
															const result = await addWordTable({
																findWord: restrictWordInfo.findWordInput,
																//@ts-ignore
																replaceWord: e.target.value ?? '',
															});
															if (result) onCreateSuccess({ type: 'restrictWord' });
														}
													}}
													placeholder='치환어를 입력하세요'
													id='banWords_replaceWordInput'
													variant='outlined'
													size='small'
													style={{
														width: '100%',
													}}
													inputProps={{
														style: {
															fontSize: 14,
														},
													}}
													onBlur={(e) =>
														setRestrictWordInfo({
															...restrictWordInfo,

															replaceWordInput: e.target.value ?? '',
														})
													}
												/>
											</Grid>

											<Grid
												item
												xs={6}
												md={4}
												sx={{
													margin: 'auto',
												}}
											>
												<Button
													disableElevation
													disabled={replaceWordToggle}
													variant='contained'
													color='info'
													sx={{
														width: '100%',
													}}
													onClick={async () => {
														const result = await addWordTable({
															findWord: restrictWordInfo.findWordInput,
															replaceWord: restrictWordInfo.replaceWordInput,
														});
														if (result) onCreateSuccess({ type: 'restrictWord' });
													}}
												>
													등록
												</Button>
											</Grid>

											<Grid
												item
												xs={6}
												md={12}
												sx={{
													margin: 'auto',
												}}
											>
												<Button
													disableElevation
													variant='contained'
													component='label'
													color='info'
													sx={{
														width: '100%',
													}}
												>
													치환어 대량등록
													<input
														hidden
														accept='application/*'
														multiple
														type='file'
														onChange={async (e) => {
															const fileList = e.target.files ?? [];

															await readFileDataURL(fileList[0]);

															await uploadExcel({
																data: fileList[0],
																isReplace: true,
															});

															getRestrictWords();
														}}
													/>
												</Button>
											</Grid>

											<Grid
												item
												xs={6}
												md={12}
												sx={{
													margin: 'auto',
												}}
											>
												<Button
													disableElevation
													variant='contained'
													color='info'
													sx={{
														width: '100%',
													}}
													onClick={() =>
														window.open(`${process.env.SELLFORYOU_MINIO_HTTPS}/data/셀포유 치환 양식.xlsx`)
													}
												>
													치환어 대량등록 양식 다운로드
												</Button>
											</Grid>
										</Grid>
									</Box>
								</Paper>
							</Grid>
						</Grid>
					</Container>
				</>
			) : null}
		</>
	);
});
export default BanWords;
