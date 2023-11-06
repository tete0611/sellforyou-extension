import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import {
	styled,
	Box,
	Button,
	Checkbox,
	CircularProgress,
	FormControlLabel,
	FormControl,
	FormHelperText,
	Grid,
	IconButton,
	MenuItem,
	Modal,
	Paper,
	Tab,
	Tabs,
	Table,
	TableRow,
	TableCell,
	Typography,
} from '@mui/material';
import { request } from '../../Tools/Common';
import { useTheme } from '@mui/material/styles';
import { ComboBox, Image } from '../Common/UI';

// 커스텀 테이블 열 스타일 설정
const StyledTableCell = styled(TableCell)({
	textAlign: 'center',
	borderBottom: '1px solid ghostwhite',
	padding: 0,
	fontSize: 12,
});

interface TabPanelProps {
	children?: React.ReactNode;
	dir?: string;
	index: number;
	value: number;
}

// 탭 뷰 (등록완료 / 등록실패 / 등록중으로 구분)
const TabPanel = (props: TabPanelProps) => {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box
					sx={{
						p: 0.5,
					}}
				>
					{children}
				</Box>
			)}
		</div>
	);
};

// 탭 엘리먼트 속성 동적 처리
const tabProps = (index: number) => {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`,
	};
};

// 빙글빙글 돌아가는 로딩 아이콘 안에 퍼센테이지와 함께 표기되는 뷰
const CircularProgressWithLabel = (props: any) => {
	return (
		<Box
			sx={{
				position: 'relative',
				display: 'inline-flex',
				alignItems: 'center',
			}}
		>
			<CircularProgress variant='determinate' {...props} size='2rem' />

			{props.value > 0 ? (
				<Box
					sx={{
						top: 0,
						left: 0,
						bottom: 0,
						right: 0,
						position: 'absolute',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Typography variant='caption' component='div' fontSize={10} fontWeight='bold'>
						{`${Math.round(props.value)}`}
					</Typography>
				</Box>
			) : null}
		</Box>
	);
};

// 상품등록 모달 뷰
export const UploadModal = observer(() => {
	// MobX 스토리지 로드
	const { common, product } = React.useContext(AppContext);
	const {
		modalInfo,
		registeredInfo,
		setImagePopOver,
		uploadItems,
		uploadConsole,
		toggleUploadModal,
		switchUploadTabs,
	} = product;
	const { uploadTabIndex, upload } = modalInfo;
	const {
		uploadInfo,
		toggleUploadInfoMarket,
		toggleUploadInfoVideo,
		toggleUploadInfoMarketAll,
		toggleUploadInfoVideoAll,
		setStopped,
		deliveryPolicy,
		setPolicyInfo,
		setDeliveryPolicy,
		setUploadable,
		user,
	} = common;
	const { markets, editable, stopped, uploadable } = uploadInfo;

	const theme = useTheme();

	return (
		<Modal open={upload}>
			<Paper
				className='uploadModal'
				sx={{
					width: 600,
				}}
			>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						mb: 3,
					}}
				>
					<Typography fontSize={16} sx={{}}>
						{editable ? '상품 수정등록' : '상품 신규등록'}
					</Typography>

					<IconButton size='small' onClick={() => toggleUploadModal(-1, false)}>
						<CloseIcon />
					</IconButton>
				</Box>

				<Paper variant='outlined'>
					<Tabs
						style={{
							borderBottom: '1px solid #0000001f',
						}}
						value={uploadTabIndex}
						onChange={(e, value) => switchUploadTabs(value)}
					>
						<Tab
							label={
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<Typography fontSize={12} sx={{}}>
										{editable ? '수정대기' : '등록대기'}
									</Typography>
								</Box>
							}
							{...tabProps(0)}
						/>

						<Tab
							label={
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<img src={chrome.runtime.getURL('/resources/icon-success.png')} width={16} height={16} />

									<Typography
										fontSize={12}
										sx={{
											ml: 1,
										}}
									>
										{editable ? '수정완료' : '등록완료'} ({registeredInfo.success.length})
									</Typography>
								</Box>
							}
							{...tabProps(2)}
						/>

						<Tab
							label={
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<img src={chrome.runtime.getURL('/resources/icon-failed.png')} width={16} height={16} />

									<Typography
										fontSize={12}
										sx={{
											ml: 1,
										}}
									>
										{editable ? '수정실패' : '등록실패'} ({registeredInfo.failed.length})
									</Typography>
								</Box>
							}
							{...tabProps(3)}
						/>

						{registeredInfo.wait.length > 0 ? (
							<Tab
								label={
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
										}}
									>
										<CircularProgress size='1rem' />

										<Typography
											fontSize={12}
											sx={{
												ml: 1,
											}}
										>
											{editable ? '수정중' : '등록중'} ({registeredInfo.wait.length})
										</Typography>
									</Box>
								}
								{...tabProps(1)}
							/>
						) : null}
					</Tabs>

					<TabPanel value={uploadTabIndex} index={0} dir={theme.direction}>
						<>
							<Paper variant='outlined'>
								<Box
									sx={{
										p: 1,
									}}
								>
									<Table>
										<TableRow>
											<StyledTableCell
												colSpan={3}
												sx={{
													textAlign: 'left',
												}}
											>
												<FormControlLabel
													control={
														<Checkbox size='small' onChange={(e) => toggleUploadInfoMarketAll(e.target.checked)} />
													}
													label={
														<Box
															sx={{
																display: 'flex',
																fontSize: 12,
																alignItems: 'center',
															}}
														>
															오픈마켓 전체선택
														</Box>
													}
												/>
											</StyledTableCell>

											<StyledTableCell
												colSpan={3}
												sx={{
													textAlign: 'left',
												}}
											>
												<FormControlLabel
													control={
														<Checkbox size='small' onChange={(e) => toggleUploadInfoVideoAll(e.target.checked)} />
													}
													label={
														<Box
															sx={{
																display: 'flex',
																fontSize: 12,
																alignItems: 'center',
															}}
														>
															동영상 전체선택
														</Box>
													}
												/>
											</StyledTableCell>
										</TableRow>

										<TableRow>
											<StyledTableCell
												width={'30%'}
												sx={{
													textAlign: 'left',
												}}
											>
												오픈마켓
											</StyledTableCell>

											<StyledTableCell width={'5%'}>동영상</StyledTableCell>

											<StyledTableCell width={'15%'}>상태</StyledTableCell>

											<StyledTableCell
												width={'30%'}
												sx={{
													textAlign: 'left',
												}}
											>
												오픈마켓
											</StyledTableCell>

											<StyledTableCell width={'5%'}>동영상</StyledTableCell>

											<StyledTableCell width={'15%'}>상태</StyledTableCell>
										</TableRow>

										<TableRow>
											<StyledTableCell
												sx={{
													textAlign: 'left',
												}}
											>
												<FormControlLabel
													control={
														<Checkbox
															size='small'
															disabled={markets.find((v) => v.code === 'A077')?.disabled}
															checked={common?.uploadInfo?.markets?.find((v) => v.code === 'A077')?.upload}
															onChange={(e) => toggleUploadInfoMarket('A077', e.target.checked)}
														/>
													}
													label={
														<Box
															sx={{
																display: 'flex',
																fontSize: 12,
																alignItems: 'center',
															}}
														>
															<img src='/resources/icon-smartstore.png' />
															&nbsp; 스마트스토어
														</Box>
													}
												/>
											</StyledTableCell>

											<StyledTableCell>
												<Checkbox
													size='small'
													disabled={markets?.find((v) => v.code === 'A077')?.disabled}
													checked={markets?.find((v) => v.code === 'A077')?.video}
													onChange={(e) => toggleUploadInfoVideo('A077', e.target.checked)}
												/>
											</StyledTableCell>

											<StyledTableCell>
												{markets?.find((v) => v.code === 'A077')?.progress ?? 0 > 0 ? (
													<CircularProgressWithLabel value={markets?.find((v) => v.code === 'A077')?.progress} />
												) : markets?.find((v) => v.code === 'A077')?.disabled ? (
													<Typography
														sx={{
															color: 'error.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정불가' : '등록불가'}
													</Typography>
												) : (
													<Typography
														sx={{
															color: 'success.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정가능' : '등록가능'}
													</Typography>
												)}
											</StyledTableCell>

											<StyledTableCell
												sx={{
													textAlign: 'left',
												}}
											>
												<FormControlLabel
													control={
														<Checkbox
															size='small'
															disabled={markets.find((v) => v.code === 'B378')?.disabled}
															checked={markets.find((v) => v.code === 'B378')?.upload}
															onChange={(e) => toggleUploadInfoMarket('B378', e.target.checked)}
														/>
													}
													label={
														<Box
															sx={{
																display: 'flex',
																fontSize: 12,
																alignItems: 'center',
															}}
														>
															<img src='/resources/icon-coupang.png' />
															&nbsp; 쿠팡
														</Box>
													}
												/>
											</StyledTableCell>

											<StyledTableCell></StyledTableCell>

											<StyledTableCell>
												{markets.find((v) => v.code === 'B378')?.progress ?? 0 > 0 ? (
													<CircularProgressWithLabel value={markets.find((v) => v.code === 'B378')?.progress} />
												) : markets.find((v) => v.code === 'B378')?.disabled ? (
													<Typography
														sx={{
															color: 'error.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정불가' : '등록불가'}
													</Typography>
												) : (
													<Typography
														sx={{
															color: 'success.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정가능' : '등록가능'}
													</Typography>
												)}
											</StyledTableCell>
										</TableRow>

										<TableRow>
											<StyledTableCell
												sx={{
													textAlign: 'left',
												}}
											>
												<FormControlLabel
													control={
														<Checkbox
															size='small'
															disabled={markets.find((v) => v.code === 'A112')?.disabled}
															checked={markets.find((v) => v.code === 'A112')?.upload}
															onChange={(e) => toggleUploadInfoMarket('A112', e.target.checked)}
														/>
													}
													label={
														<Box
															sx={{
																display: 'flex',
																fontSize: 12,
																alignItems: 'center',
															}}
														>
															<img src='/resources/icon-street-global.png' />
															&nbsp; 11번가(글로벌)
														</Box>
													}
												/>
											</StyledTableCell>

											<StyledTableCell>
												<Checkbox
													size='small'
													disabled={markets.find((v) => v.code === 'A112')?.disabled}
													checked={markets.find((v) => v.code === 'A112')?.video}
													onChange={(e) => {
														toggleUploadInfoVideo('A112', e.target.checked);
													}}
												/>
											</StyledTableCell>

											<StyledTableCell>
												{markets.find((v) => v.code === 'A112')?.progress ?? 0 > 0 ? (
													<CircularProgressWithLabel value={markets.find((v) => v.code === 'A112')?.progress} />
												) : markets.find((v) => v.code === 'A112')?.disabled ? (
													<Typography
														sx={{
															color: 'error.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정불가' : '등록불가'}
													</Typography>
												) : (
													<Typography
														sx={{
															color: 'success.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정가능' : '등록가능'}
													</Typography>
												)}
											</StyledTableCell>

											<StyledTableCell
												sx={{
													textAlign: 'left',
												}}
											>
												<FormControlLabel
													control={
														<Checkbox
															size='small'
															disabled={markets.find((v) => v.code === 'A113')?.disabled}
															checked={markets.find((v) => v.code === 'A113')?.upload}
															onChange={(e) => toggleUploadInfoMarket('A113', e.target.checked)}
														/>
													}
													label={
														<Box
															sx={{
																display: 'flex',
																fontSize: 12,
																alignItems: 'center',
															}}
														>
															<img src='/resources/icon-street-normal.png' />
															&nbsp; 11번가(일반)
														</Box>
													}
												/>
											</StyledTableCell>

											<StyledTableCell>
												<Checkbox
													size='small'
													disabled={markets.find((v) => v.code === 'A113')?.disabled}
													checked={markets.find((v) => v.code === 'A113')?.video}
													onChange={(e) => toggleUploadInfoVideo('A113', e.target.checked)}
												/>
											</StyledTableCell>

											<StyledTableCell>
												{markets.find((v) => v.code === 'A113')?.progress ?? 0 > 0 ? (
													<CircularProgressWithLabel value={markets.find((v) => v.code === 'A113')?.progress} />
												) : markets.find((v) => v.code === 'A113')?.disabled ? (
													<Typography
														sx={{
															color: 'error.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정불가' : '등록불가'}
													</Typography>
												) : (
													<Typography
														sx={{
															color: 'success.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정가능' : '등록가능'}
													</Typography>
												)}
											</StyledTableCell>
										</TableRow>

										<TableRow>
											<StyledTableCell
												sx={{
													textAlign: 'left',
												}}
											>
												<FormControlLabel
													control={
														<Checkbox
															size='small'
															disabled={markets.find((v) => v.code === 'A523')?.disabled}
															checked={markets.find((v) => v.code === 'A523')?.upload}
															onChange={(e) => {
																toggleUploadInfoMarket('A523', e.target.checked);
																if (markets.find((v) => v.code === 'A006')?.upload)
																	toggleUploadInfoMarket('A006', false);
															}}
														/>
													}
													label={
														<Box
															sx={{
																display: 'flex',
																fontSize: 12,
																alignItems: 'center',
															}}
														>
															<img src='/resources/icon-gmarket.png' />
															&nbsp; 지마켓 2.0
														</Box>
													}
												/>
											</StyledTableCell>

											<StyledTableCell>
												<Checkbox
													size='small'
													disabled={markets.find((v) => v.code === 'A523')?.disabled}
													checked={markets.find((v) => v.code === 'A523')?.video}
													onChange={(e) => toggleUploadInfoVideo('A523', e.target.checked)}
												/>
											</StyledTableCell>

											<StyledTableCell>
												{markets.find((v) => v.code === 'A523')?.progress ?? 0 > 0 ? (
													<CircularProgressWithLabel value={markets.find((v) => v.code === 'A523')?.progress} />
												) : markets.find((v) => v.code === 'A523')?.disabled ? (
													<Typography
														sx={{
															color: 'error.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정불가' : '등록불가'}
													</Typography>
												) : (
													<Typography
														sx={{
															color: 'success.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정가능' : '등록가능'}
													</Typography>
												)}
											</StyledTableCell>

											<StyledTableCell
												sx={{
													textAlign: 'left',
												}}
											>
												<FormControlLabel
													control={
														<Checkbox
															size='small'
															disabled={markets.find((v) => v.code === 'A522')?.disabled}
															checked={markets.find((v) => v.code === 'A522')?.upload}
															onChange={(e) => {
																toggleUploadInfoMarket('A522', e.target.checked);
																if (markets.find((v) => v.code === 'A001')?.upload)
																	toggleUploadInfoMarket('A001', false);
															}}
														/>
													}
													label={
														<Box
															sx={{
																display: 'flex',
																fontSize: 12,
																alignItems: 'center',
															}}
														>
															<img src='/resources/icon-auction.png' />
															&nbsp; 옥션 2.0
														</Box>
													}
												/>
											</StyledTableCell>

											<StyledTableCell>
												<Checkbox
													size='small'
													disabled={markets.find((v) => v.code === 'A522')?.disabled}
													checked={markets.find((v) => v.code === 'A522')?.video}
													onChange={(e) => toggleUploadInfoVideo('A522', e.target.checked)}
												/>
											</StyledTableCell>

											<StyledTableCell>
												{markets.find((v) => v.code === 'A522')?.progress ?? 0 > 0 ? (
													<CircularProgressWithLabel value={markets.find((v) => v.code === 'A522')?.progress} />
												) : markets.find((v) => v.code === 'A522')?.disabled ? (
													<Typography
														sx={{
															color: 'error.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정불가' : '등록불가'}
													</Typography>
												) : (
													<Typography
														sx={{
															color: 'success.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정가능' : '등록가능'}
													</Typography>
												)}
											</StyledTableCell>
										</TableRow>

										{/* ESM통합으로 인한 1.0미사용 */}
										{/* <TableRow>
											<StyledTableCell
												sx={{
													textAlign: 'left',
												}}
											>
												<FormControlLabel
													control={
														<Checkbox
															size='small'
															disabled={markets.find((v) => v.code === 'A006')?.disabled}
															checked={markets.find((v) => v.code === 'A006')?.upload}
															onChange={(e) => {
																toggleUploadInfoMarket('A006', e.target.checked);
																if (markets.find((v) => v.code === 'A523')?.upload)
																	toggleUploadInfoMarket('A523', false);
															}}
														/>
													}
													label={
														<Box
															sx={{
																display: 'flex',
																fontSize: 12,
																alignItems: 'center',
															}}
														>
															<img src='/resources/icon-gmarket.png' />
															&nbsp; 지마켓 1.0
														</Box>
													}
												/>
											</StyledTableCell>

											<StyledTableCell>
												<Checkbox
													size='small'
													disabled={markets.find((v) => v.code === 'A006')?.disabled}
													checked={markets.find((v) => v.code === 'A006')?.video}
													onChange={(e) => toggleUploadInfoVideo('A006', e.target.checked)}
												/>
											</StyledTableCell>

											<StyledTableCell>
												{markets.find((v) => v.code === 'A006')?.progress ?? 0 > 0 ? (
													<CircularProgressWithLabel value={markets.find((v) => v.code === 'A006')?.progress} />
												) : markets.find((v) => v.code === 'A006')?.disabled ? (
													<Typography
														sx={{
															color: 'error.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정불가' : '등록불가'}
													</Typography>
												) : (
													<Typography
														sx={{
															color: 'success.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정가능' : '등록가능'}
													</Typography>
												)}
											</StyledTableCell>

											<StyledTableCell
												sx={{
													textAlign: 'left',
												}}
											>
												<FormControlLabel
													control={
														<Checkbox
															size='small'
															disabled={markets.find((v) => v.code === 'A001')?.disabled}
															checked={markets.find((v) => v.code === 'A001')?.upload}
															onChange={(e) => {
																toggleUploadInfoMarket('A001', e.target.checked);
																if (markets.find((v) => v.code === 'A522')?.upload)
																	toggleUploadInfoMarket('A522', false);
															}}
														/>
													}
													label={
														<Box
															sx={{
																display: 'flex',
																fontSize: 12,
																alignItems: 'center',
															}}
														>
															<img src='/resources/icon-auction.png' />
															&nbsp; 옥션 1.0
														</Box>
													}
												/>
											</StyledTableCell>

											<StyledTableCell>
												<Checkbox
													size='small'
													disabled={markets.find((v) => v.code === 'A001')?.disabled}
													checked={markets.find((v) => v.code === 'A001')?.video}
													onChange={(e) => toggleUploadInfoVideo('A001', e.target.checked)}
												/>
											</StyledTableCell>

											<StyledTableCell>
												{markets.find((v) => v.code === 'A001')?.progress ?? 0 > 0 ? (
													<CircularProgressWithLabel value={markets.find((v) => v.code === 'A001')?.progress} />
												) : markets.find((v) => v.code === 'A001')?.disabled ? (
													<Typography
														sx={{
															color: 'error.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정불가' : '등록불가'}
													</Typography>
												) : (
													<Typography
														sx={{
															color: 'success.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정가능' : '등록가능'}
													</Typography>
												)}
											</StyledTableCell>
										</TableRow> */}

										<TableRow>
											<StyledTableCell
												sx={{
													textAlign: 'left',
												}}
											>
												<FormControlLabel
													control={
														<Checkbox
															size='small'
															disabled={markets.find((v) => v.code === 'A027')?.disabled}
															checked={markets.find((v) => v.code === 'A027')?.upload}
															onChange={(e) => toggleUploadInfoMarket('A027', e.target.checked)}
														/>
													}
													label={
														<Box
															sx={{
																display: 'flex',
																fontSize: 12,
																alignItems: 'center',
															}}
														>
															<img src='/resources/icon-interpark.png' />
															&nbsp; 인터파크
														</Box>
													}
												/>
											</StyledTableCell>

											<StyledTableCell>
												<Checkbox
													size='small'
													disabled={markets.find((v) => v.code === 'A027')?.disabled}
													checked={markets.find((v) => v.code === 'A027')?.video}
													onChange={(e) => toggleUploadInfoVideo('A027', e.target.checked)}
												/>
											</StyledTableCell>

											<StyledTableCell>
												{markets.find((v) => v.code === 'A027')?.progress ?? 0 > 0 ? (
													<CircularProgressWithLabel value={markets.find((v) => v.code === 'A027')?.progress} />
												) : markets.find((v) => v.code === 'A027')?.disabled ? (
													<Typography
														sx={{
															color: 'error.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정불가' : '등록불가'}
													</Typography>
												) : (
													<Typography
														sx={{
															color: 'success.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정가능' : '등록가능'}
													</Typography>
												)}
											</StyledTableCell>

											<StyledTableCell
												sx={{
													textAlign: 'left',
												}}
											>
												<FormControlLabel
													control={
														<Checkbox
															size='small'
															disabled={markets.find((v) => v.code === 'B719')?.disabled}
															checked={markets.find((v) => v.code === 'B719')?.upload}
															onChange={(e) => toggleUploadInfoMarket('B719', e.target.checked)}
														/>
													}
													label={
														<Box
															sx={{
																display: 'flex',
																fontSize: 12,
																alignItems: 'center',
															}}
														>
															<img src='/resources/icon-wemakeprice.png' />
															&nbsp; 위메프
														</Box>
													}
												/>
											</StyledTableCell>

											<StyledTableCell></StyledTableCell>

											<StyledTableCell>
												{markets.find((v) => v.code === 'B719')?.progress ?? 0 > 0 ? (
													<CircularProgressWithLabel value={markets.find((v) => v.code === 'B719')?.progress} />
												) : markets.find((v) => v.code === 'B719')?.disabled ? (
													<Typography
														sx={{
															color: 'error.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정불가' : '등록불가'}
													</Typography>
												) : (
													<Typography
														sx={{
															color: 'success.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정가능' : '등록가능'}
													</Typography>
												)}
											</StyledTableCell>
										</TableRow>

										<TableRow>
											<StyledTableCell
												sx={{
													textAlign: 'left',
												}}
											>
												<FormControlLabel
													control={
														<Checkbox
															size='small'
															disabled={markets.find((v) => v.code === 'A524')?.disabled}
															checked={markets.find((v) => v.code === 'A524')?.upload}
															onChange={(e) => toggleUploadInfoMarket('A524', e.target.checked)}
														/>
													}
													label={
														<Box
															sx={{
																display: 'flex',
																fontSize: 12,
																alignItems: 'center',
															}}
														>
															<img src='/resources/icon-lotteon-global.png' />
															&nbsp; 롯데온(글로벌)
														</Box>
													}
												/>
											</StyledTableCell>

											<StyledTableCell></StyledTableCell>

											<StyledTableCell>
												{markets.find((v) => v.code === 'A524')?.progress ?? 0 > 0 ? (
													<CircularProgressWithLabel value={markets.find((v) => v.code === 'A524')?.progress} />
												) : markets.find((v) => v.code === 'A524')?.disabled ? (
													<Typography
														sx={{
															color: 'error.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정불가' : '등록불가'}
													</Typography>
												) : (
													<Typography
														sx={{
															color: 'success.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정가능' : '등록가능'}
													</Typography>
												)}
											</StyledTableCell>

											<StyledTableCell
												sx={{
													textAlign: 'left',
												}}
											>
												<FormControlLabel
													control={
														<Checkbox
															size='small'
															disabled={markets.find((v) => v.code === 'A525')?.disabled}
															checked={markets.find((v) => v.code === 'A525')?.upload}
															onChange={(e) => toggleUploadInfoMarket('A525', e.target.checked)}
														/>
													}
													label={
														<Box
															sx={{
																display: 'flex',
																fontSize: 12,
																alignItems: 'center',
															}}
														>
															<img src='/resources/icon-lotteon-normal.png' />
															&nbsp; 롯데온(일반)
														</Box>
													}
												/>
											</StyledTableCell>

											<StyledTableCell></StyledTableCell>

											<StyledTableCell>
												{markets.find((v) => v.code === 'A525')?.progress ?? 0 > 0 ? (
													<CircularProgressWithLabel value={markets.find((v) => v.code === 'A525')?.progress} />
												) : markets.find((v) => v.code === 'A525')?.disabled ? (
													<Typography
														sx={{
															color: 'error.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정불가' : '등록불가'}
													</Typography>
												) : (
													<Typography
														sx={{
															color: 'success.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정가능' : '등록가능'}
													</Typography>
												)}
											</StyledTableCell>
										</TableRow>

										<TableRow>
											<StyledTableCell
												sx={{
													textAlign: 'left',
												}}
											>
												<FormControlLabel
													control={
														<Checkbox
															size='small'
															disabled={markets.find((v) => v.code === 'B956')?.disabled}
															checked={markets.find((v) => v.code === 'B956')?.upload}
															onChange={(e) => toggleUploadInfoMarket('B956', e.target.checked)}
														/>
													}
													label={
														<Box
															sx={{
																display: 'flex',
																fontSize: 12,
																alignItems: 'center',
															}}
														>
															<img src='/resources/icon-tmon.png' />
															&nbsp; 티몬
														</Box>
													}
												/>
											</StyledTableCell>

											<StyledTableCell></StyledTableCell>

											<StyledTableCell>
												{markets.find((v) => v.code === 'B956')?.progress ?? 0 > 0 ? (
													<CircularProgressWithLabel value={markets.find((v) => v.code === 'B956')?.progress} />
												) : markets.find((v) => v.code === 'B956')?.disabled ? (
													<Typography
														sx={{
															color: 'error.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정불가' : '등록불가'}
													</Typography>
												) : (
													<Typography
														sx={{
															color: 'success.main',
															fontSize: 12,
														}}
													>
														{editable ? '수정가능' : '등록가능'}
													</Typography>
												)}
											</StyledTableCell>

											<StyledTableCell colSpan={3}></StyledTableCell>
										</TableRow>
									</Table>
								</Box>
							</Paper>

							{markets.find((v) => v.code === 'B719')?.upload ? (
								<Paper
									variant='outlined'
									sx={{
										mt: 0.5,
										p: 1,
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									위메프 발송정책
									<FormControl sx={{ width: 250 }} error={!markets.find((v) => v.code === 'B719')?.policyInfo}>
										<ComboBox
											sx={{
												width: '100%',
											}}
											value={markets.find((v) => v.code === 'B719')?.policyInfo}
											onOpen={async () => {
												if (deliveryPolicy.wemakepricePolicyList.length > 0) return;

												const policyResp = await fetch(
													'https://wpartner.wemakeprice.com/partner/sellerShip/getSellerShipList.json',
												);
												const policyJson = await policyResp.json();

												if (!policyJson.sellerShipList) return alert('위메프 로그인 후 이용해주세요.');

												setDeliveryPolicy({
													...deliveryPolicy,

													wemakepricePolicyList: policyJson.sellerShipList,
												});
											}}
											onChange={(e) => setPolicyInfo('B719', e.target.value)}
										>
											{deliveryPolicy.wemakepricePolicyList.map((v: any) => (
												<MenuItem value={v.shipPolicyNo}>
													배송비: {v.shipFee ? `${v.shipFee.toLocaleString('ko-KR')}원` : `무료`} / 반품비:{' '}
													{v.claimShipFee.toLocaleString('ko-KR')}원
												</MenuItem>
											))}
										</ComboBox>

										{!markets.find((v) => v.code === 'B719')?.policyInfo ? (
											<FormHelperText>발송정책을 설정해주세요.</FormHelperText>
										) : null}
									</FormControl>
								</Paper>
							) : null}

							{markets.find((v) => v.code === 'A524')?.upload ? (
								<Paper
									variant='outlined'
									sx={{
										mt: 0.5,
										p: 1,
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									롯데온 발송정책
									<FormControl sx={{ width: 250 }} error={!markets.find((v) => v.code === 'A524')?.policyInfo}>
										<ComboBox
											sx={{
												width: '100%',
											}}
											value={markets.find((v) => v.code === 'A524')?.policyInfo}
											onOpen={async () => {
												if (deliveryPolicy.lotteonPolicyList.length > 0) return;

												const policyResp = await fetch(
													`https://openapi.lotteon.com/v1/openapi/contract/v1/dvl/getDvCstListSr`,
													{
														headers: {
															Authorization: `Bearer ${user.userInfo.lotteonApiKey}`,
															Accept: 'application/json',
															'Accept-Language': 'ko',
															'X-Timezone': 'GMT+09:00',
															'Content-Type': 'application/json',
														},

														method: 'POST',

														body: JSON.stringify({
															afflTrCd: user.userInfo.lotteonVendorId,
														}),
													},
												);

												const policyJson = await policyResp.json();

												setDeliveryPolicy({
													...deliveryPolicy,

													lotteonPolicyList: policyJson.data.filter((v: any) => v.dvCstTypCd === 'DV_CST'),
												});
											}}
											onChange={(e) => {
												setPolicyInfo('A524', e.target.value);
												setPolicyInfo('A525', e.target.value);
											}}
										>
											{deliveryPolicy.lotteonPolicyList.map((v: any) => (
												<MenuItem value={v.dvCstPolNo}>
													배송비: {parseInt(v.dvCst).toLocaleString('ko-KR')}원 / 반품비:{' '}
													{parseInt(v.rcst).toLocaleString('ko-KR')}원
												</MenuItem>
											))}
										</ComboBox>

										{!markets.find((v) => v.code === 'A524')?.policyInfo ? (
											<FormHelperText>발송정책을 설정해주세요.</FormHelperText>
										) : null}
									</FormControl>
								</Paper>
							) : null}

							{markets.find((v) => v.code === 'A525')?.upload ? (
								<Paper
									variant='outlined'
									sx={{
										mt: 0.5,
										p: 1,
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									롯데온 발송정책
									<FormControl sx={{ width: 250 }} error={!markets.find((v) => v.code === 'A525')?.policyInfo}>
										<ComboBox
											sx={{
												width: '100%',
											}}
											value={markets.find((v) => v.code === 'A525')?.policyInfo}
											onOpen={async () => {
												if (deliveryPolicy.lotteonPolicyList.length > 0) return;

												const policyResp = await fetch(
													`https://openapi.lotteon.com/v1/openapi/contract/v1/dvl/getDvCstListSr`,
													{
														headers: {
															Authorization: `Bearer ${user.userInfo.lotteonApiKey}`,
															Accept: 'application/json',
															'Accept-Language': 'ko',
															'X-Timezone': 'GMT+09:00',
															'Content-Type': 'application/json',
														},

														method: 'POST',

														body: JSON.stringify({
															afflTrCd: user.userInfo.lotteonVendorId,
														}),
													},
												);

												const policyJson = await policyResp.json();

												setDeliveryPolicy({
													...deliveryPolicy,

													lotteonPolicyList: policyJson.data.filter((v: any) => v.dvCstTypCd === 'DV_CST'),
												});
											}}
											onChange={(e) => {
												setPolicyInfo('A524', e.target.value);
												setPolicyInfo('A525', e.target.value);
											}}
										>
											{deliveryPolicy.lotteonPolicyList.map((v: any) => (
												<MenuItem value={v.dvCstPolNo}>
													배송비: {parseInt(v.dvCst).toLocaleString('ko-KR')}원 / 반품비:{' '}
													{parseInt(v.rcst).toLocaleString('ko-KR')}원
												</MenuItem>
											))}
										</ComboBox>

										{!markets.find((v) => v.code === 'A525')?.policyInfo ? (
											<FormHelperText>발송정책을 설정해주세요.</FormHelperText>
										) : null}
									</FormControl>
								</Paper>
							) : null}

							{markets.find((v) => v.code === 'B956')?.upload ? (
								<Paper
									variant='outlined'
									sx={{
										mt: 0.5,
										p: 1,
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									티몬 발송정책
									<FormControl sx={{ width: 250 }} error={!markets.find((v) => v.code === 'B956')?.policyInfo}>
										<ComboBox
											sx={{
												width: '100%',
											}}
											value={markets.find((v) => v.code === 'B956')?.policyInfo}
											onOpen={async () => {
												if (deliveryPolicy.tmonPolicyList.length > 0) return;

												const deliveryResp: any = await request(
													`https://spc-om.tmon.co.kr/api/delivery/template?productType=DP03&deliverySpot=DIRECT&scCatYn=N&partnerNo=${user.userInfo.tmonId}&detail=true`,
													{ method: 'GET' },
												);

												let deliveryJson: any = null;

												try {
													deliveryJson = JSON.parse(deliveryResp);
												} catch (e) {
													//
												}

												if (!deliveryJson) return alert('티몬 로그인 후 이용해주세요.');

												setDeliveryPolicy({
													...deliveryPolicy,

													tmonPolicyList: deliveryJson.data.list,
												});
											}}
											onChange={(e) => setPolicyInfo('B956', e.target.value)}
										>
											{deliveryPolicy.tmonPolicyList.map((v: any) => (
												<MenuItem value={v.deliveryFeeSrl}>
													배송비: {parseInt(v.detail.deliveryFeeInfo.deliveryAmount).toLocaleString('ko-KR')}원 /
													반품비: {(parseInt(v.detail.deliveryFeeInfo.deliveryAmount) * 2).toLocaleString('ko-KR')}원
												</MenuItem>
											))}
										</ComboBox>

										{!markets.find((v) => v.code === 'B956')?.policyInfo ? (
											<FormHelperText>발송정책을 설정해주세요.</FormHelperText>
										) : null}
									</FormControl>
								</Paper>
							) : null}
						</>
					</TabPanel>

					<TabPanel value={uploadTabIndex} index={1} dir={theme.direction}>
						<Box
							sx={{
								p: 1,
								height: 449,
								overflowY: 'scroll',
							}}
						>
							{registeredInfo.success.map((v: any) => (
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										p: 0,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={6}
											md={4}
											sx={{
												m: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
												}}
											>
												<IconButton
													size='small'
													sx={{
														mr: 1,
													}}
													onClick={() => {
														switch (v.site_code) {
															case 'A077': {
																window.open(`${user.userInfo.naverStoreUrl}/products/${v.error}`);
																break;
															}

															case 'B378': {
																break;
															}

															case 'A112': {
																window.open(`https://www.11st.co.kr/products/${v.error}`);
																break;
															}

															case 'A113': {
																window.open(`https://www.11st.co.kr/products/${v.error}`);
																break;
															}

															case 'A006': {
																window.open(`http://item.gmarket.co.kr/Item?goodscode=${v.error}`);
																break;
															}

															case 'A001': {
																window.open(`http://itempage3.auction.co.kr/DetailView.aspx?ItemNo=${v.error}&frm3=V2`);
																break;
															}

															case 'A027': {
																window.open(`https://shopping.interpark.com/product/productInfo.do?prdNo=${v.error}`);
																break;
															}

															case 'B719': {
																window.open(`https://front.wemakeprice.com/product/${v.error}`);
																break;
															}
															case 'A522': {
																window.open(`http://itempage3.auction.co.kr/DetailView.aspx?ItemNo=${v.error}&frm3=V2`);
																break;
															}
															case 'A523': {
																window.open(`http://item.gmarket.co.kr/Item?goodscode=${v.error}`);
																break;
															}

															case 'A524': {
																window.open(`https://www.lotteon.com/p/product/${v.error}`);
																break;
															}

															case 'A525': {
																window.open(`https://www.lotteon.com/p/product/${v.error}`);
																break;
															}

															case 'B956': {
																window.open(`https://www.tmon.co.kr/deal/${v.error}`);
																break;
															}

															default:
																break;
														}
													}}
												>
													{v.site_code === 'A077' ? (
														<img src='/resources/icon-smartstore.png' />
													) : v.site_code === 'B378' ? (
														<img src='/resources/icon-coupang.png' />
													) : v.site_code === 'A112' ? (
														<img src='/resources/icon-street-global.png' />
													) : v.site_code === 'A113' ? (
														<img src='/resources/icon-street-normal.png' />
													) : v.site_code === 'A006' ? (
														<img src='/resources/icon-gmarket.png' />
													) : v.site_code === 'A001' ? (
														<img src='/resources/icon-auction.png' />
													) : v.site_code === 'A027' ? (
														<img src='/resources/icon-interpark.png' />
													) : v.site_code === 'B719' ? (
														<img src='/resources/icon-wemakeprice.png' />
													) : v.site_code === 'A523' ? (
														<img src='/resources/icon-gmarket.png' />
													) : v.site_code === 'A522' ? (
														<img src='/resources/icon-auction.png' />
													) : v.site_code === 'A524' ? (
														<img src='/resources/icon-lotteon-global.png' />
													) : v.site_code === 'A525' ? (
														<img src='/resources/icon-lotteon-normal.png' />
													) : v.site_code === 'B956' ? (
														<img src='/resources/icon-tmon.png' />
													) : null}
												</IconButton>

												<Image
													src={v.img1}
													width={24}
													height={24}
													style={{
														// border: "1px solid lightgray",
														background: 'black',
														objectFit: 'contain',
													}}
													onClick={(e) =>
														setImagePopOver({
															element: e.target,
															data: { src: v.img1 },
															open: true,
														})
													}
												/>

												<Typography
													noWrap
													sx={{
														ml: 1,
														fontSize: 12,
													}}
												>
													{v.name3}
												</Typography>
											</Box>
										</Grid>

										<Grid
											item
											xs={6}
											md={2}
											sx={{
												m: 'auto',
											}}
										>
											<Typography
												noWrap
												sx={{
													ml: 1,
													fontSize: 12,
												}}
											>
												{v.code}
											</Typography>
										</Grid>

										<Grid
											item
											xs={6}
											md={6}
											sx={{
												m: 'auto',
												justifyContent: 'right',
											}}
										>
											<Typography
												sx={{
													ml: 1,
													fontSize: 12,
													textAlign: 'right',
												}}
											>
												상품이 정상 {editable ? '수정' : '등록'}
												되었습니다.
											</Typography>
										</Grid>
									</Grid>
								</Box>
							))}
						</Box>
					</TabPanel>

					<TabPanel value={uploadTabIndex} index={2} dir={theme.direction}>
						<Box
							sx={{
								p: 1,
								height: 449,
								overflowY: 'scroll',
							}}
						>
							{registeredInfo.failed.map((v: any) => (
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										p: 0,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={6}
											md={4}
											sx={{
												m: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
												}}
											>
												<IconButton
													size='small'
													sx={{
														mr: 1,
													}}
												>
													{v.site_code === 'A077' ? (
														<img src='/resources/icon-smartstore.png' />
													) : v.site_code === 'B378' ? (
														<img src='/resources/icon-coupang.png' />
													) : v.site_code === 'A112' ? (
														<img src='/resources/icon-street-global.png' />
													) : v.site_code === 'A113' ? (
														<img src='/resources/icon-street-normal.png' />
													) : v.site_code === 'A006' ? (
														<img src='/resources/icon-gmarket.png' />
													) : v.site_code === 'A001' ? (
														<img src='/resources/icon-auction.png' />
													) : v.site_code === 'A027' ? (
														<img src='/resources/icon-interpark.png' />
													) : v.site_code === 'B719' ? (
														<img src='/resources/icon-wemakeprice.png' />
													) : v.site_code === 'A523' ? (
														<img src='/resources/icon-gmarket.png' />
													) : v.site_code === 'A522' ? (
														<img src='/resources/icon-auction.png' />
													) : v.site_code === 'A524' ? (
														<img src='/resources/icon-lotteon-global.png' />
													) : v.site_code === 'A525' ? (
														<img src='/resources/icon-lotteon-normal.png' />
													) : v.site_code === 'B956' ? (
														<img src='/resources/icon-tmon.png' />
													) : null}
												</IconButton>

												<Image
													src={v.img1}
													width={24}
													height={24}
													style={{
														// border: "1px solid lightgray",
														background: 'black',
														objectFit: 'contain',
													}}
													onClick={(e) =>
														setImagePopOver({
															element: e.target,
															data: { src: v.img1 },
															open: true,
														})
													}
												/>

												<Typography
													noWrap
													sx={{
														ml: 1,
														fontSize: 12,
													}}
												>
													{v.name3}
												</Typography>
											</Box>
										</Grid>

										<Grid
											item
											xs={6}
											md={2}
											sx={{
												m: 'auto',
											}}
										>
											<Typography
												noWrap
												sx={{
													ml: 1,
													fontSize: 12,
												}}
											>
												{v.code}
											</Typography>
										</Grid>

										<Grid
											item
											xs={6}
											md={6}
											sx={{
												m: 'auto',
												justifyContent: 'right',
											}}
										>
											<Typography
												sx={{
													ml: 1,
													textAlign: 'right',
													fontSize: 12,
												}}
											>
												{v.error}
											</Typography>
										</Grid>
									</Grid>
								</Box>
							))}
						</Box>
					</TabPanel>

					<TabPanel value={uploadTabIndex} index={3} dir={theme.direction}>
						<Box
							sx={{
								p: 1,
								height: 449,
								overflowY: 'scroll',
							}}
						>
							{registeredInfo.wait.map((v: any) => (
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										p: 0,
									}}
								>
									<Grid container spacing={1}>
										<Grid
											item
											xs={6}
											md={4}
											sx={{
												m: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
												}}
											>
												<IconButton
													size='small'
													sx={{
														mr: 1,
													}}
												>
													{v.site_code === 'A077' ? (
														<img src='/resources/icon-smartstore.png' />
													) : v.site_code === 'B378' ? (
														<img src='/resources/icon-coupang.png' />
													) : v.site_code === 'A112' ? (
														<img src='/resources/icon-street-global.png' />
													) : v.site_code === 'A113' ? (
														<img src='/resources/icon-street-normal.png' />
													) : v.site_code === 'A006' ? (
														<img src='/resources/icon-gmarket.png' />
													) : v.site_code === 'A001' ? (
														<img src='/resources/icon-auction.png' />
													) : v.site_code === 'A027' ? (
														<img src='/resources/icon-interpark.png' />
													) : v.site_code === 'B719' ? (
														<img src='/resources/icon-wemakeprice.png' />
													) : v.site_code === 'A523' ? (
														<img src='/resources/icon-gmarket.png' />
													) : v.site_code === 'A522' ? (
														<img src='/resources/icon-auction.png' />
													) : v.site_code === 'A524' ? (
														<img src='/resources/icon-lotteon-global.png' />
													) : v.site_code === 'A525' ? (
														<img src='/resources/icon-lotteon-normal.png' />
													) : v.site_code === 'B956' ? (
														<img src='/resources/icon-tmon.png' />
													) : null}
												</IconButton>

												<Image
													src={v.img1}
													width={24}
													height={24}
													style={{
														// border: "1px solid lightgray",
														background: 'black',
														objectFit: 'contain',
													}}
													onClick={(e) =>
														setImagePopOver({
															element: e.target,
															data: { src: v.img1 },
															open: true,
														})
													}
												/>

												<Typography
													noWrap
													sx={{
														ml: 1,
														fontSize: 12,
													}}
												>
													{v.name3}
												</Typography>
											</Box>
										</Grid>

										<Grid
											item
											xs={6}
											md={2}
											sx={{
												m: 'auto',
											}}
										>
											<Typography
												noWrap
												sx={{
													ml: 1,
													fontSize: 12,
												}}
											>
												{v.code}
											</Typography>
										</Grid>

										<Grid
											item
											xs={6}
											md={6}
											sx={{
												m: 'auto',
												justifyContent: 'right',
											}}
										>
											<Typography
												sx={{
													ml: 1,
													textAlign: 'right',
													fontSize: 12,
												}}
											>
												상품을 {editable ? '수정' : '등록'}
												하는 중...
											</Typography>
										</Grid>
									</Grid>
								</Box>
							))}
						</Box>
					</TabPanel>
				</Paper>

				<Paper
					variant='outlined'
					sx={{
						height: 50,
						overflowY: 'auto',
						mt: 1,
						p: 1,
					}}
				>
					{uploadConsole.map((v: any) => (
						<Typography
							sx={{
								fontSize: 12,
							}}
						>
							{v}
						</Typography>
					))}
				</Paper>

				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						mt: 3,
					}}
				>
					{editable ? (
						<Button
							disabled={!uploadable}
							disableElevation
							variant='contained'
							color='info'
							sx={{
								width: '33%',
								mx: 0.5,
							}}
							onClick={async () => {
								await setUploadable(false);

								await uploadItems(common, true);
							}}
						>
							{!uploadable && !stopped ? '수정 중...' : '수정'}
						</Button>
					) : (
						<Button
							disabled={!uploadable}
							disableElevation
							variant='contained'
							color='info'
							sx={{
								width: '33%',
								mx: 0.5,
							}}
							onClick={async () => {
								await setUploadable(false);

								await uploadItems(common, false);
							}}
						>
							{!uploadable && !stopped ? '등록 중...' : '등록'}
						</Button>
					)}

					<Button
						disabled={stopped}
						disableElevation
						variant='contained'
						color='error'
						sx={{
							width: '33%',
							mx: 0.5,
						}}
						onClick={async () =>
							confirm('상품등록/수정을 중단하시겠습니까? 중단 이전에 등록/수정된 상품은 삭제되지 않을 수 있습니다.') &&
							(await setStopped(true))
						}
					>
						{!uploadable && stopped ? '중단 중...' : '중단'}
					</Button>

					<Button
						disableElevation
						variant='contained'
						color='inherit'
						sx={{
							width: '33%',
							mx: 0.5,
						}}
						onClick={() => toggleUploadModal(-1, false)}
					>
						닫기
					</Button>
				</Box>
			</Paper>
		</Modal>
	);
});
