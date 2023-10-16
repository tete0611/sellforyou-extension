import React from 'react';
import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import {
	styled,
	Box,
	Button,
	Checkbox,
	CircularProgress,
	FormControlLabel,
	IconButton,
	Modal,
	Paper,
	Table,
	TableRow,
	TableCell,
	Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// 커스텀 테이블 열 스타일 설정
const StyledTableCell = styled(TableCell)({
	textAlign: 'center',
	borderBottom: '1px solid ghostwhite',
	padding: 0,
	fontSize: 12,
});

// 빙글빙글 돌아가는 로딩 아이콘 안에 퍼센테이지와 함께 표기되는 뷰
function CircularProgressWithLabel(props: any) {
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
}

// 상품 등록해제 모달 뷰
export const UploadDisabledModal = observer(() => {
	// MobX 스토리지 로드
	const { common, product } = React.useContext(AppContext);
	const {
		uploadInfo,
		setStopped,
		setUploadable,
		uploadDisabledInfo,
		toggleUploadDisabledInfoMarketAll,
		toggleUploadDisabledInfoMarket,
	} = common;

	const { markets } = uploadDisabledInfo;
	const { uploadable, stopped } = uploadInfo;

	return (
		<Modal open={product.modalInfo.uploadDisabled}>
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
						상품 등록해제
					</Typography>
					<IconButton
						size='small'
						onClick={() => {
							product.toggleUploadDisabledModal(-1, false, common);
						}}
					>
						<CloseIcon />
					</IconButton>
				</Box>
				<Paper variant='outlined'>
					<Box
						sx={{
							p: 1,
						}}
					>
						<Table>
							<TableRow>
								<StyledTableCell
									colSpan={2}
									sx={{
										textAlign: 'left',
									}}
								>
									<FormControlLabel
										control={
											<Checkbox size='small' onChange={(e) => toggleUploadDisabledInfoMarketAll(e.target.checked)} />
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
								<StyledTableCell colSpan={2}></StyledTableCell>
							</TableRow>
							<TableRow>
								<StyledTableCell
									width={'35%'}
									sx={{
										textAlign: 'left',
									}}
								>
									오픈마켓
								</StyledTableCell>
								<StyledTableCell width={'15%'}>상태</StyledTableCell>
								<StyledTableCell
									width={'35%'}
									sx={{
										textAlign: 'left',
									}}
								>
									오픈마켓
								</StyledTableCell>
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
												checked={markets.find((v) => v.code === 'A077')?.upload}
												onChange={(e) => toggleUploadDisabledInfoMarket('A077', e.target.checked)}
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
									{markets.find((v) => v.code === 'A077')?.progress ?? 0 > 0 ? (
										<CircularProgressWithLabel color='error' value={markets.find((v) => v.code === 'A077')?.progress} />
									) : markets.find((v) => v.code === 'A077')?.disabled ? (
										<Typography
											sx={{
												color: 'red',
												fontSize: 12,
											}}
										>
											삭제불가
										</Typography>
									) : (
										<Typography
											sx={{
												color: 'green',
												fontSize: 12,
											}}
										>
											삭제가능
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
												onChange={(e) => toggleUploadDisabledInfoMarket('B378', e.target.checked)}
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
								<StyledTableCell>
									{markets.find((v) => v.code === 'B378')?.progress ?? 0 > 0 ? (
										<CircularProgressWithLabel color='error' value={markets.find((v) => v.code === 'B378')?.progress} />
									) : markets.find((v) => v.code === 'B378')?.disabled ? (
										<Typography
											sx={{
												color: 'red',
												fontSize: 12,
											}}
										>
											삭제불가
										</Typography>
									) : (
										<Typography
											sx={{
												color: 'green',
												fontSize: 12,
											}}
										>
											삭제가능
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
												onChange={(e) => toggleUploadDisabledInfoMarket('A112', e.target.checked)}
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
									{markets.find((v) => v.code === 'A112')?.progress ?? 0 > 0 ? (
										<CircularProgressWithLabel color='error' value={markets.find((v) => v.code === 'A112')?.progress} />
									) : markets.find((v) => v.code === 'A112')?.disabled ? (
										<Typography
											sx={{
												color: 'red',
												fontSize: 12,
											}}
										>
											삭제불가
										</Typography>
									) : (
										<Typography
											sx={{
												color: 'green',
												fontSize: 12,
											}}
										>
											삭제가능
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
												onChange={(e) => toggleUploadDisabledInfoMarket('A113', e.target.checked)}
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
									{markets.find((v) => v.code === 'A113')?.progress ?? 0 > 0 ? (
										<CircularProgressWithLabel color='error' value={markets.find((v) => v.code === 'A113')?.progress} />
									) : markets.find((v) => v.code === 'A113')?.disabled ? (
										<Typography
											sx={{
												color: 'red',
												fontSize: 12,
											}}
										>
											삭제불가
										</Typography>
									) : (
										<Typography
											sx={{
												color: 'green',
												fontSize: 12,
											}}
										>
											삭제가능
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
												onChange={(e) => toggleUploadDisabledInfoMarket('A523', e.target.checked)}
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
												&nbsp; 지마켓2.0
											</Box>
										}
									/>
								</StyledTableCell>
								<StyledTableCell>
									{markets.find((v) => v.code === 'A523')?.progress ?? 0 > 0 ? (
										<CircularProgressWithLabel color='error' value={markets.find((v) => v.code === 'A523')?.progress} />
									) : markets.find((v) => v.code === 'A523')?.disabled ? (
										<Typography
											sx={{
												color: 'red',
												fontSize: 12,
											}}
										>
											삭제불가
										</Typography>
									) : (
										<Typography
											sx={{
												color: 'green',
												fontSize: 12,
											}}
										>
											삭제가능
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
												onChange={(e) => toggleUploadDisabledInfoMarket('A522', e.target.checked)}
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
												&nbsp; 옥션2.0
											</Box>
										}
									/>
								</StyledTableCell>
								<StyledTableCell>
									{markets.find((v) => v.code === 'A522')?.progress ?? 0 > 0 ? (
										<CircularProgressWithLabel color='error' value={markets.find((v) => v.code === 'A522')?.progress} />
									) : markets.find((v) => v.code === 'A522')?.disabled ? (
										<Typography
											sx={{
												color: 'red',
												fontSize: 12,
											}}
										>
											삭제불가
										</Typography>
									) : (
										<Typography
											sx={{
												color: 'green',
												fontSize: 12,
											}}
										>
											삭제가능
										</Typography>
									)}
								</StyledTableCell>
							</TableRow>
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
												onChange={(e) => 
													toggleUploadDisabledInfoMarket('A006', e.target.checked)
												}
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
									{markets.find((v) => v.code === 'A006')?.progress ?? 0 > 0 ? (
										<CircularProgressWithLabel color='error' value={markets.find((v) => v.code === 'A006')?.progress} />
									) : markets.find((v) => v.code === 'A006')?.disabled ? (
										<Typography
											sx={{
												color: 'red',
												fontSize: 12,
											}}
										>
											삭제불가
										</Typography>
									) : (
										<Typography
											sx={{
												color: 'green',
												fontSize: 12,
											}}
										>
											삭제가능
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
													toggleUploadDisabledInfoMarket('A001', e.target.checked);
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
									{markets.find((v) => v.code === 'A001')?.progress ?? 0 > 0 ? (
										<CircularProgressWithLabel color='error' value={markets.find((v) => v.code === 'A001')?.progress} />
									) : markets.find((v) => v.code === 'A001')?.disabled ? (
										<Typography
											sx={{
												color: 'red',
												fontSize: 12,
											}}
										>
											삭제불가
										</Typography>
									) : (
										<Typography
											sx={{
												color: 'green',
												fontSize: 12,
											}}
										>
											삭제가능
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
												onChange={(e) => toggleUploadDisabledInfoMarket('A027', e.target.checked)}
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
									{markets.find((v) => v.code === 'A027')?.progress ?? 0 > 0 ? (
										<CircularProgressWithLabel color='error' value={markets.find((v) => v.code === 'A027')?.progress} />
									) : markets.find((v) => v.code === 'A027')?.disabled ? (
										<Typography
											sx={{
												color: 'red',
												fontSize: 12,
											}}
										>
											삭제불가
										</Typography>
									) : (
										<Typography
											sx={{
												color: 'green',
												fontSize: 12,
											}}
										>
											삭제가능
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
												onChange={(e) => toggleUploadDisabledInfoMarket('B719', e.target.checked)}
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
								<StyledTableCell>
									{markets.find((v) => v.code === 'B719')?.progress ?? 0 > 0 ? (
										<CircularProgressWithLabel color='error' value={markets.find((v) => v.code === 'B719')?.progress} />
									) : markets.find((v) => v.code === 'B719')?.disabled ? (
										<Typography
											sx={{
												color: 'red',
												fontSize: 12,
											}}
										>
											삭제불가
										</Typography>
									) : (
										<Typography
											sx={{
												color: 'green',
												fontSize: 12,
											}}
										>
											삭제가능
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
												onChange={(e) => toggleUploadDisabledInfoMarket('A524', e.target.checked)}
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
								<StyledTableCell>
									{markets.find((v) => v.code === 'A524')?.progress ?? 0 > 0 ? (
										<CircularProgressWithLabel color='error' value={markets.find((v) => v.code === 'A524')?.progress} />
									) : markets.find((v) => v.code === 'A524')?.disabled ? (
										<Typography
											sx={{
												color: 'red',
												fontSize: 12,
											}}
										>
											삭제불가
										</Typography>
									) : (
										<Typography
											sx={{
												color: 'green',
												fontSize: 12,
											}}
										>
											삭제가능
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
												onChange={(e) => toggleUploadDisabledInfoMarket('A525', e.target.checked)}
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
								<StyledTableCell>
									{markets.find((v) => v.code === 'A525')?.progress ?? 0 > 0 ? (
										<CircularProgressWithLabel color='error' value={markets.find((v) => v.code === 'A525')?.progress} />
									) : markets.find((v) => v.code === 'A525')?.disabled ? (
										<Typography
											sx={{
												color: 'red',
												fontSize: 12,
											}}
										>
											삭제불가
										</Typography>
									) : (
										<Typography
											sx={{
												color: 'green',
												fontSize: 12,
											}}
										>
											삭제가능
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
												onChange={(e) => toggleUploadDisabledInfoMarket('B956', e.target.checked)}
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
								<StyledTableCell>
									{markets.find((v) => v.code === 'B956')?.progress ?? 0 > 0 ? (
										<CircularProgressWithLabel color='error' value={markets.find((v) => v.code === 'B956')?.progress} />
									) : markets.find((v) => v.code === 'B956')?.disabled ? (
										<Typography
											sx={{
												color: 'red',
												fontSize: 12,
											}}
										>
											삭제불가
										</Typography>
									) : (
										<Typography
											sx={{
												color: 'green',
												fontSize: 12,
											}}
										>
											삭제가능
										</Typography>
									)}
								</StyledTableCell>
								<StyledTableCell colSpan={2}></StyledTableCell>
							</TableRow>
						</Table>
					</Box>
				</Paper>

				<Paper
					variant='outlined'
					sx={{
						height: 100,
						overflowY: 'auto',
						mt: 1,
					}}
				>
					{product.uploadConsole?.map((v) => (
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
							await product.disableItems(common);
							await product.toggleUploadDisabledModal(-1, false, common);
						}}
					>
						{!uploadable && !stopped ? '등록해제 중...' : '등록해제'}
					</Button>
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
							confirm(
								'상품등록을 중단하시겠습니까?\n상품등록이 중단되더라도 이전에 등록된 상품은 삭제되지 않을 수 있습니다.',
							) && (await setStopped(true))
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
						onClick={() => product.toggleUploadDisabledModal(-1, false, common)}
					>
						닫기
					</Button>
				</Box>
			</Paper>
		</Modal>
	);
});
