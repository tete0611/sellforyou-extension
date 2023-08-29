import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { Box, Button, Grid, Modal, Paper, Typography } from '@mui/material';
import { Search } from '../Common/UI';

// 품목코드 일괄설정 모달 뷰
export const ManyDeliveryInfoModal = observer(() => {
	// MobX 스토리지 로드
	const { common, delivery } = React.useContext(AppContext);

	// 사용자 정보 로드
	React.useEffect(() => {
		if (!common.loaded) {
			return;
		}

		// 초기값 설정
		delivery.setManyDeliveryInfo({
			category: {
				name: '',
				code: '',
			},

			input: '',
			membership: '',
			method: '',
			name: '',
		});
	}, [common.loaded]);

	return (
		<Modal open={delivery.modalInfo.manyDeliveryInfo} onClose={() => delivery.toggleManyDeliveryInfoModal(false)}>
			{common.user.userInfo ? (
				<Paper
					className='uploadModal'
					sx={{
						width: 350,
					}}
				>
					<Typography
						fontSize={16}
						sx={{
							mb: 3,
						}}
					>
						품목분류 일괄설정
					</Typography>

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
									<Typography fontSize={14}>품목분류명</Typography>
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
									<Search
										disabled={
											!delivery.deliveryList.find(
												(v) => v.name === common.user.userInfo.orderToDeliveryName && v.hscode,
											)
										}
										value={delivery.manyDeliveryInfo.category}
										onChange={(e: any, value: any) => {
											delivery.setManyDeliveryInfo({
												...delivery.manyDeliveryInfo,

												category: value,
											});
										}}
										onInputChange={(e, value, reason) => {
											if (reason !== 'input') {
												return;
											}

											delivery.setManyDeliveryInfo({
												...delivery.manyDeliveryInfo,

												input: value,
											});
										}}
										options={
											delivery.manyDeliveryInfo.input
												? delivery.deliveryData.find((v: any) => v.company === common.user.userInfo.orderToDeliveryName)
														.category
												: [delivery.manyDeliveryInfo.category]
										}
										getOptionLabel={(option: any) => option.name ?? ''}
										isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
										onClose={() => {
											delivery.setManyDeliveryInfo({
												...delivery.manyDeliveryInfo,

												input: '',
											});
										}}
									/>
								</Grid>
							</Grid>
						</Box>
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
							disableElevation
							variant='contained'
							color='info'
							sx={{
								width: '50%',
								mx: 0.5,
							}}
							onClick={() => {
								delivery.setManyOrderToDelivery();
							}}
						>
							적용
						</Button>

						<Button
							disableElevation
							variant='contained'
							color='inherit'
							sx={{
								width: '50%',
								mx: 0.5,
							}}
							onClick={() => {
								delivery.toggleManyDeliveryInfoModal(false);
							}}
						>
							취소
						</Button>
					</Box>
				</Paper>
			) : (
				<></>
			)}
		</Modal>
	);
});
