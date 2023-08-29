import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { Box, Grid, MenuItem, Modal, Paper, Select, TextField, Typography } from '@mui/material';
import { MyButton } from '../Common/UI';

// 판매가격 일괄설정 모달 뷰
export const ManyPriceModal = observer(() => {
	// MobX 스토리지 로드
	const { common, product } = React.useContext(AppContext);

	// 사용자 정보 로드
	React.useEffect(() => {
		if (!common.loaded) {
			return;
		}

		// 기본설정 값을 토대로 초기값 설정
		product.setManyPriceInfo({
			cnyRate: common.user.userInfo.cnyRate,
			marginRate: common.user.userInfo.marginRate,
			marginUnitType: common.user.userInfo.marginUnitType,
			localShippingFee: common.user.userInfo.defaultShippingFee,
			shippingFee: common.user.userInfo.extraShippingFee,
		});
	}, [common.loaded]);

	return (
		<Modal open={product.modalInfo.price} onClose={() => product.toggleManyPriceModal(false)}>
			{common.user.userInfo ? (
				<Paper
					className='uploadModal'
					sx={{
						width: 350,
					}}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							mb: 3,
						}}
					>
						<Typography fontSize={16}>판매가격 일괄설정</Typography>

						<Box>
							<MyButton
								color='info'
								sx={{
									minWidth: 60,
								}}
								onClick={() => {
									product.updateManyPrice(common);
								}}
							>
								적용
							</MyButton>
							&nbsp;
							<MyButton
								color='error'
								sx={{
									minWidth: 60,
								}}
								onClick={() => {
									product.toggleManyPriceModal(false);
								}}
							>
								취소
							</MyButton>
						</Box>
					</Box>

					<Paper variant='outlined'>
						<Box
							sx={{
								p: 1,
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
									<Typography fontSize={14}>환율</Typography>
								</Grid>

								<Grid
									item
									xs={6}
									md={8}
									sx={{
										m: 'auto',
										textAlign: 'right',
									}}
								>
									<TextField
										id={`modal_many_price_cnyRate`}
										variant='outlined'
										sx={{
											width: '100%',
										}}
										inputProps={{
											style: {
												fontSize: 14,
												padding: 5,
												textAlign: 'right',
											},
										}}
										defaultValue={product.manyPriceInfo.cnyRate}
										onBlur={(e) => {
											product.setManyPriceInfo({
												...product.manyPriceInfo,

												cnyRate: parseFloat(e.target.value),
											});
										}}
									/>
								</Grid>

								<Grid
									item
									xs={6}
									md={4}
									sx={{
										m: 'auto',
									}}
								>
									<Typography fontSize={14}>마진율</Typography>
								</Grid>

								<Grid
									item
									xs={6}
									md={4}
									sx={{
										m: 'auto',
										textAlign: 'right',
									}}
								>
									<TextField
										id={`modal_many_price_marginRate`}
										variant='outlined'
										sx={{
											width: '100%',
										}}
										inputProps={{
											style: {
												fontSize: 14,
												padding: 5,
												textAlign: 'right',
											},
										}}
										defaultValue={product.manyPriceInfo.marginRate}
										onBlur={(e) => {
											product.setManyPriceInfo({
												...product.manyPriceInfo,

												marginRate: parseFloat(e.target.value),
											});
										}}
									/>
								</Grid>

								<Grid
									item
									xs={6}
									md={4}
									sx={{
										m: 'auto',
										textAlign: 'right',
									}}
								>
									<Select
										sx={{
											width: '100%',
											height: 30,
											fontSize: 14,
										}}
										defaultValue={product.manyPriceInfo.marginUnitType}
										onChange={(e) => {
											product.setManyPriceInfo({
												...product.manyPriceInfo,

												marginUnitType: e.target.value,
											});
										}}
									>
										<MenuItem value={'PERCENT'}>%</MenuItem>
										<MenuItem value={'WON'}>원</MenuItem>
									</Select>
								</Grid>

								<Grid
									item
									xs={6}
									md={4}
									sx={{
										m: 'auto',
									}}
								>
									<Typography fontSize={14}>해외배송비</Typography>
								</Grid>

								<Grid
									item
									xs={6}
									md={8}
									sx={{
										m: 'auto',
										textAlign: 'right',
									}}
								>
									<TextField
										id={`modal_many_price_localShippingFee`}
										variant='outlined'
										sx={{
											width: '100%',
										}}
										inputProps={{
											style: {
												fontSize: 14,
												padding: 5,
												textAlign: 'right',
											},
										}}
										defaultValue={product.manyPriceInfo.localShippingFee}
										onBlur={(e) => {
											product.setManyPriceInfo({
												...product.manyPriceInfo,

												localShippingFee: parseInt(e.target.value),
											});
										}}
									/>
								</Grid>

								<Grid
									item
									xs={6}
									md={4}
									sx={{
										m: 'auto',
									}}
								>
									<Typography fontSize={14}>유료배송비</Typography>
								</Grid>

								<Grid
									item
									xs={6}
									md={8}
									sx={{
										m: 'auto',
										textAlign: 'right',
									}}
								>
									<TextField
										id={`modal_many_price_shippingFee`}
										variant='outlined'
										sx={{
											width: '100%',
										}}
										inputProps={{
											style: {
												fontSize: 14,
												padding: 5,
												textAlign: 'right',
											},
										}}
										defaultValue={product.manyPriceInfo.shippingFee}
										onBlur={(e) => {
											product.setManyPriceInfo({
												...product.manyPriceInfo,

												shippingFee: parseInt(e.target.value),
											});
										}}
									/>
								</Grid>
							</Grid>
						</Box>

						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								p: 1,
							}}
						>
							<Typography color='error' fontSize={12}>
								알리익스프레스의 경우 환율과 해외배송비 설정이 무시됩니다.
							</Typography>
						</Box>
					</Paper>
				</Paper>
			) : (
				<></>
			)}
		</Modal>
	);
});
