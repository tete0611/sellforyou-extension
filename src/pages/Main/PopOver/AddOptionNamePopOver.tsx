import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from '../../../containers/AppContext';
import { Box, Button, Grid, MenuItem, Popover, Select, TextField, Typography } from '@mui/material';
import { ComboBox, MyButton } from '../Common/UI';

// 옵션명 키워드 추가 팝업
export const AddOptionNamePopOver = observer(() => {
	// MobX 스토리지 로드
	const { common, product } = React.useContext(AppContext);

	// 팝업이 닫힐 때 데이터 초기화
	const onClose = () => {
		product.setAddOptionNamePopOver({
			...product.popOverInfo.addOptionName,

			index: -1,
			element: null,
			open: false,

			data: {
				index: -1,
				head: '',
				tail: '',
			},
		});
	};

	return (
		<Popover
			open={product.popOverInfo.addOptionName.open}
			anchorEl={product.popOverInfo.addOptionName.element}
			onClose={onClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
		>
			<Box
				sx={{
					p: 3,
					width: 300,
				}}
			>
				<Box>
					<Grid container spacing={1}>
						<Grid
							item
							xs={6}
							md={6}
							sx={{
								m: 'auto',
							}}
						>
							<Typography fontSize={14}>적용할 옵션명</Typography>
						</Grid>

						<Grid
							item
							xs={6}
							md={6}
							sx={{
								m: 'auto',
							}}
						>
							<ComboBox
								sx={{
									width: '100%',
								}}
								value={product.popOverInfo.addOptionName.data.index}
								variant='outlined'
								size='small'
								onChange={(e) => {
									product.setAddOptionNamePopOver({
										...product.popOverInfo.addOptionName,

										data: {
											...product.popOverInfo.addOptionName.data,

											index: e.target.value,
										},
									});
								}}
							>
								<MenuItem value={-1}>{'<모든 옵션명>'}</MenuItem>

								{product.popOverInfo.addOptionName.index > -1
									? product.itemInfo.items[product.popOverInfo.addOptionName.index].productOptionName.map(
											(v: any, i: number) => <MenuItem value={i}>{v.name}</MenuItem>,
									  )
									: null}
							</ComboBox>
						</Grid>

						<Grid
							item
							xs={6}
							md={6}
							sx={{
								m: 'auto',
							}}
						>
							<Typography fontSize={14}>키워드추가(앞)</Typography>
						</Grid>

						<Grid
							item
							xs={6}
							md={6}
							sx={{
								m: 'auto',
							}}
						>
							<TextField
								id={'add_option_name_head'}
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
								onBlur={(e) => {
									product.setAddOptionNamePopOver({
										...product.popOverInfo.addOptionName,

										data: {
											...product.popOverInfo.addOptionName.data,

											head: e.target.value,
										},
									});
								}}
							/>
						</Grid>

						<Grid
							item
							xs={6}
							md={6}
							sx={{
								m: 'auto',
							}}
						>
							<Typography fontSize={14}>키워드추가(뒤)</Typography>
						</Grid>

						<Grid
							item
							xs={6}
							md={6}
							sx={{
								m: 'auto',
							}}
						>
							<TextField
								id={'add_option_name_tail'}
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
								onBlur={(e) => {
									product.setAddOptionNamePopOver({
										...product.popOverInfo.addOptionName,

										data: {
											...product.popOverInfo.addOptionName.data,

											tail: e.target.value,
										},
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
						justifyContent: 'center',
						mt: 3,
					}}
				>
					<MyButton
						color='info'
						sx={{
							width: 100,
						}}
						onClick={async () => {
							const index = product.popOverInfo.addOptionName.index;
							const head = product.popOverInfo.addOptionName.data.head
								? product.popOverInfo.addOptionName.data.head + ' '
								: '';
							const tail = product.popOverInfo.addOptionName.data.tail
								? ' ' + product.popOverInfo.addOptionName.data.tail
								: '';

							const productOptionName = product.itemInfo.items[index].productOptionName;

							for (let i = 0; i < productOptionName.length; i++) {
								if (
									product.popOverInfo.addOptionName.data.index !== -1 &&
									product.popOverInfo.addOptionName.data.index !== i
								) {
									continue;
								}

								await product.setProductOptionValue(
									productOptionName[i].productOptionValue.map((v: any) => {
										return {
											...v,
											name: head + v.name + tail,
										};
									}),
									index,
									i,
									null,
								);

								await product.updateProductOptionValue(
									common,
									index,
									i,
									productOptionName[i].productOptionValue.map((v: any) => v.id),
								);
							}

							onClose();
						}}
					>
						적용
					</MyButton>
					&nbsp;
					<MyButton
						color='error'
						sx={{
							width: 100,
						}}
						onClick={onClose}
					>
						취소
					</MyButton>
				</Box>
			</Box>
		</Popover>
	);
});
