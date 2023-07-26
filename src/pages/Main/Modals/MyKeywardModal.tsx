import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { Box, Grid, Modal, Paper, TextField, Typography } from '@mui/material';
import { MyButton } from '../Common/UI';

// 상품속성 일괄설정 모달 뷰
export const MyKeywardModal = observer(() => {
	// MobX 스토리지 로드
	const { common, product } = React.useContext(AppContext);

	// 사용자 정보를 불러온 뒤
	React.useEffect(() => {
		if (!common.loaded) {
			return;
		}

		// 기본설정에 저장된 값을 토대로 초기값 설정
		product.setManyPriceInfo({
			cnyRate: common.user.userInfo.cnyRate,
			marginRate: common.user.userInfo.marginRate,
			marginUnitType: common.user.userInfo.marginUnitType,
			localShippingFee: common.user.userInfo.defaultShippingFee,
			shippingFee: common.user.userInfo.extraShippingFee,
		});
	}, [common.loaded]);

	return (
		<Modal open={product.modalInfo.myKeywarded} onClose={() => product.toggleManyMyKeywardModal(false)}>
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
						<Typography fontSize={16}>개인분류 일괄설정</Typography>

						<Box>
							<MyButton
								color='info'
								sx={{
									minWidth: 60,
								}}
								onClick={() => {
									product.updateManyMyKeyward(common);
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
									product.toggleManyMyKeywardModal(false);
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
									<Typography fontSize={14}>개인분류</Typography>
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
										id={`modal_many_keyward`}
										variant='outlined'
										sx={{
											width: '100%',
										}}
										inputProps={{
											style: {
												fontSize: 14,
												padding: 5,
											},
										}}
										defaultValue={product.ManymyKeyward.myKeyward}
										onBlur={(e) => {
											product.setManyKeyward({
												...product.ManymyKeyward,

												myKeyward: e.target.value,
											});
										}}
									/>
								</Grid>
							</Grid>
						</Box>
					</Paper>
				</Paper>
			) : (
				<></>
			)}
		</Modal>
	);
});
