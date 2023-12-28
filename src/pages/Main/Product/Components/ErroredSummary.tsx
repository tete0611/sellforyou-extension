import React from 'react';
import { format } from 'date-fns';
import { observer } from 'mobx-react';
import { AppContext } from '../../../../containers/AppContext';
import {
	styled,
	Box,
	Chip,
	Grid,
	IconButton,
	TableCell,
	TableRow,
	Tooltip,
	Typography,
	Checkbox,
	CircularProgress,
} from '@mui/material';
import { Image, Input, MyButton, Search } from '../../Common/UI';
import { Item } from '../../../../type/type';
import { SHOPCODE } from '../../../../type/variable';

// 커스텀 테이블 컬럼 스타일
const StyledTableCell = styled(TableCell)({
	textAlign: 'center',
	padding: 0,
	border: 'none',
	fontSize: 14,
});

interface Props {
	item: Item;
	index: number;
	tableRef: any;
}

// 상품목록 테이블 행 뷰
export const ErroredSummary = observer((props: Props) => {
	// MobX 스토리지 로드
	const { common, product } = React.useContext(AppContext);
	const { SMART_STORE } = SHOPCODE;

	// 상품에 변화가 생기면
	const loading = (
		<div className='inform'>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<div className='loading' />
				&nbsp; 상품정보를 저장하는 중입니다...
			</div>
		</div>
	);

	return (
		<>
			{props.item.edited.summary === 2 ? loading : null}

			<TableRow hover>
				<StyledTableCell width={50}>
					<Checkbox
						size='small'
						checked={props.item.checked}
						onChange={(e) => product.toggleItemChecked(props.index, e.target.checked)}
					/>
				</StyledTableCell>

				<StyledTableCell width={90}>
					<Chip
						size='small'
						color='info'
						sx={{ fontSize: 12, width: 85, mb: 1 }}
						label={props.item.productCode}
						onClick={() => {
							navigator.clipboard.writeText(props.item.productCode).then(
								() => alert('클립보드에 복사되었습니다.'),
								() => alert('클립보드에 복사할 수 없습니다.'),
							);
						}}
					/>
					<Chip
						size='small'
						sx={{ fontSize: 13, width: 85 }}
						label={`${format(new Date(props.item.createdAt), 'yy-MM-dd')}`}
					/>
				</StyledTableCell>

				<StyledTableCell width={100}>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							p: 0,
							height: '100%',
							width: '100%',
						}}
					>
						<Image
							src={props.item.imageThumbnail[0]}
							width={82}
							height={82}
							style={{
								background: 'black',
								objectFit: 'contain',
							}}
							onClick={(e) =>
								product.setImagePopOver({
									element: e.target,
									data: { src: props.item.imageThumbnail[0] },
									open: true,
								})
							}
						/>
					</Box>
				</StyledTableCell>

				<StyledTableCell>
					<Grid container spacing={0.5}>
						<Grid item xs={6} md={4.5}>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									p: 0,
									height: '100%',
									width: '100%',
								}}
							>
								<Input
									color={props.item.edited.summary ? 'warning' : 'info'}
									id={`product_row_title_${props.index}`}
									value={props.item.name}
									onChange={(e: any) => product.setProductName(e.target.value, props.index)}
									onBlur={(e: any) => product.updateProductName(props.index)}
								/>
							</Box>
						</Grid>

						<Grid
							item
							xs={6}
							md={2.7}
							sx={{
								margin: 'auto',
							}}
						>
							<Grid container spacing={0.5}>
								<Grid
									item
									xs={6}
									md={12}
									sx={{
										margin: 'auto',
									}}
								>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
											p: '4.5px',
										}}
									></Box>
								</Grid>
							</Grid>
						</Grid>

						<Grid item xs={6} md={4.8}>
							<Box
								sx={{
									mr: 1,
								}}
							>
								<Search
									readOnly={true}
									value={props.item.categoryInfoA077}
									options={
										product.categoryInfo.markets.find((v) => v.code === SMART_STORE)!.input
											? product.categoryInfo.markets.find((v) => v.code === SMART_STORE)!.data
											: [props.item.categoryInfoA077]
									}
									getOptionLabel={(option: any) => option.name ?? ''}
									isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
									loading={product.categoryInfo.markets.find((v) => v.code === SMART_STORE)!.loading}
								/>
							</Box>
						</Grid>

						<Grid item xs={6} md={4.5}>
							<Box
								sx={{
									display: 'flex',
									marginTop: '6px',
									p: 0,
								}}
							>
								<Box
									sx={{
										display: 'flex',
									}}
								>
									<Tooltip title='소싱처링크'>
										<IconButton size='small' onClick={() => window.open(props.item.activeTaobaoProduct.url)}>
											{props.item.activeTaobaoProduct.shopName === 'taobao' ? (
												<img src='/resources/icon-taobao.png' />
											) : props.item.activeTaobaoProduct.shopName === 'tmall' ? (
												<img src='/resources/icon-tmall.png' />
											) : props.item.activeTaobaoProduct.shopName === 'express' ? (
												<img src='/resources/icon-express.png' />
											) : props.item.activeTaobaoProduct.shopName === 'alibaba' ? (
												<img src='/resources/icon-1688.png' />
											) : props.item.activeTaobaoProduct.shopName === 'vvic' ? (
												<img src='/resources/icon-vvic.png' />
											) : props.item.activeTaobaoProduct.shopName.includes('amazon') ? (
												<img src='/resources/icon-amazon.png' />
											) : null}
										</IconButton>
									</Tooltip>

									<Tooltip title='동영상링크'>
										<IconButton
											size='small'
											onClick={() =>
												props.item.activeTaobaoProduct.videoUrl && window.open(props.item.activeTaobaoProduct.videoUrl)
											}
										>
											{props.item.activeTaobaoProduct.videoUrl ? (
												<img src='/resources/icon-video.png' />
											) : (
												<img src='/resources/icon-video-gray.png' />
											)}
										</IconButton>
									</Tooltip>
								</Box>

								<Typography
									noWrap
									sx={{
										color: common.darkTheme ? 'info.light' : 'info.dark',
										fontSize: 13,
										maxWidth: 500,
										marginTop: '4px',
									}}
								>
									{props.item.activeTaobaoProduct.name}
								</Typography>
							</Box>
						</Grid>

						<Grid
							item
							xs={6}
							md={2.7}
							sx={{
								marginTop: '4px',
							}}
						></Grid>

						<Grid item xs={6} md={4.8}>
							<Box
								sx={{
									alignItems: 'center',
									display: 'flex',
									justifyContent: 'right',
								}}
							>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										mr: 1,
									}}
								>
									<MyButton
										disabled={props.item.delete}
										color='error'
										variant='outlined'
										sx={{
											minWidth: '100%',
										}}
										onClick={() => product.forceDeleteProduct(common, props.item.id)}
									>
										{props.item.delete ? (
											<>
												<CircularProgress size='1rem' />
											</>
										) : (
											'강제삭제'
										)}
									</MyButton>
								</Box>
							</Box>
						</Grid>
					</Grid>
				</StyledTableCell>
			</TableRow>
		</>
	);
});
