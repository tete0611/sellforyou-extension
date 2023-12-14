import React from 'react';
import { Error as ErrorIcon, Warning as WarningIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { observer } from 'mobx-react';
import { AppContext } from '../../../../containers/AppContext';
import { styled, Box, Chip, Grid, IconButton, TableCell, TableRow, Typography, Checkbox } from '@mui/material';
import { Image, Input, MyButton, Search } from '../../Common/UI';
import { getStoreUrl } from '../../../Tools/Common';

const StyledTableCell = styled(TableCell)({
	textAlign: 'center',
	borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
	padding: 0,
	fontSize: 13,
});

export const DeliverySummary = observer((props: any) => {
	const { common, delivery, product } = React.useContext(AppContext);

	return (
		<>
			<TableRow hover>
				<StyledTableCell width={50}>
					<Checkbox
						size='small'
						checked={props.item.checked}
						onChange={(e) => {
							delivery.toggleItemChecked(props.index, e.target.checked);
						}}
					/>
				</StyledTableCell>

				<StyledTableCell width={41}>
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
							src={props.item.imageUrl}
							width={41}
							height={41}
							style={{
								// border: "1px solid lightgray",
								background: 'black',
								objectFit: 'contain',
							}}
							onClick={(e) => {
								product.setImagePopOver({
									element: e.target,
									data: { src: props.item.imageUrl },
									open: true,
								});
							}}
						/>
					</Box>
				</StyledTableCell>

				<StyledTableCell>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								width: '100%',
								height: 40,
							}}
						>
							<Grid container spacing={0.5}>
								<Grid
									item
									xs={6}
									md={1.8}
									sx={{
										margin: 'auto',
									}}
								>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
										}}
									>
										<IconButton
											sx={{
												ml: 0.5,
											}}
											onClick={() => {
												window.open(props.item.url);
											}}
										>
											{props.item.shopName === 'taobao' ? (
												<img src='/resources/icon-taobao.png' />
											) : props.item.shopName === 'tmall' ? (
												<img src='/resources/icon-tmall.png' />
											) : props.item.shopName === 'express' ? (
												<img src='/resources/icon-express.png' />
											) : props.item.shopName === 'alibaba' ? (
												<img src='/resources/icon-1688.png' />
											) : props.item.shopName === 'vvic' ? (
												<img src='/resources/icon-vvic.png' />
											) : null}
										</IconButton>

										<Typography
											noWrap
											fontSize={13}
											sx={{
												color: '#1565c0',
											}}
										>
											{props.item.productName}
										</Typography>
									</Box>
								</Grid>

								<Grid
									item
									xs={6}
									md={1.2}
									sx={{
										m: 'auto',
										textAlign: 'left',
									}}
								>
									<Input readOnly value={props.item.optionInfo} />
								</Grid>

								{props.item.connected ? (
									<>
										<Grid
											item
											xs={6}
											md={1.8}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
												}}
											>
												<IconButton
													sx={{
														ml: 0.5,
													}}
													onClick={() => {
														const url = getStoreUrl(
															common,
															props.item.connected.marketCode,
															props.item.connected.productId,
														);

														window.open(url);
													}}
												>
													{props.item.connected.marketCode === 'A077' ? (
														<img src='/resources/icon-smartstore.png' />
													) : props.item.connected.marketCode === 'B378' ? (
														<img src='/resources/icon-coupang.png' />
													) : props.item.connected.marketCode === 'A112' ? (
														<img src='/resources/icon-street-global.png' />
													) : props.item.connected.marketCode === 'A113' ? (
														<img src='/resources/icon-street-normal.png' />
													) : props.item.connected.marketCode === 'A006' ? (
														<img src='/resources/icon-gmarket.png' />
													) : props.item.connected.marketCode === 'A001' ? (
														<img src='/resources/icon-auction.png' />
													) : props.item.connected.marketCode === 'A027' ? (
														<img src='/resources/icon-interpark.png' />
													) : props.item.connected.marketCode === 'B719' ? (
														<img src='/resources/icon-wemakeprice.png' />
													) : props.item.connected.marketCode === 'A524' ? (
														<img src='/resources/icon-lotteon-global.png' />
													) : props.item.connected.marketCode === 'A525' ? (
														<img src='/resources/icon-lotteon-normal.png' />
													) : props.item.connected.marketCode === 'B956' ? (
														<img src='/resources/icon-tmon.png' />
													) : null}
												</IconButton>

												<Typography
													noWrap
													fontSize={13}
													sx={{
														color: '#1565c0',
													}}
												>
													{props.item.connected.productName}
												</Typography>
											</Box>
										</Grid>

										<Grid
											item
											xs={6}
											md={1.2}
											sx={{
												m: 'auto',
												textAlign: 'left',
											}}
										>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
												}}
											>
												<Input readOnly value={props.item.connected.productOptionContents} />
											</Box>
										</Grid>
									</>
								) : (
									<>
										<Grid
											item
											xs={6}
											md={3}
											sx={{
												margin: 'auto',
												textAlign: 'left',
											}}
										></Grid>
									</>
								)}

								<Grid
									item
									xs={6}
									md={1.6}
									sx={{
										m: 'auto',
										textAlign: 'left',
									}}
								>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
										}}
									>
										{props.item.error ? (
											<>
												<ErrorIcon
													color='error'
													sx={{
														mx: 1,
														fontSize: 19,
													}}
												/>

												<Typography
													noWrap
													fontSize={13}
													sx={{
														color: '#d32f2f',
													}}
												>
													{props.item.error}
												</Typography>
											</>
										) : props.item.icucResult ? (
											<>
												{props.item.icucResult?.code === 0 ? (
													<>
														<ErrorIcon
															color='error'
															sx={{
																mx: 1,
																fontSize: 19,
															}}
														/>

														<Typography
															noWrap
															fontSize={13}
															sx={{
																color: '#d32f2f',
															}}
														>
															{props.item.icucResult?.message}
														</Typography>
													</>
												) : props.item.icucResult?.code === 1 ? (
													<>
														<CheckCircleIcon
															color='success'
															sx={{
																mx: 1,
																fontSize: 19,
															}}
														/>

														<Typography
															noWrap
															fontSize={13}
															sx={{
																color: '#2e7d32',
															}}
														>
															{props.item.icucResult?.message}
														</Typography>
													</>
												) : props.item.icucResult?.code === 2 ? (
													<>
														<WarningIcon
															color='warning'
															sx={{
																mx: 1,
																fontSize: 19,
															}}
														/>

														<Typography
															noWrap
															fontSize={13}
															sx={{
																color: '#ed6c02',
															}}
														>
															{props.item.icucResult?.message}
														</Typography>
													</>
												) : null}
											</>
										) : null}
									</Box>
								</Grid>

								<Grid
									item
									xs={6}
									md={0.6}
									sx={{
										m: 'auto',
										textAlign: 'right',
									}}
								>
									<Typography
										noWrap
										fontSize={13}
										sx={{
											color: '#d32f2f',
										}}
									>
										{props.item.unitPrice}
									</Typography>
								</Grid>

								<Grid
									item
									xs={6}
									md={0.6}
									sx={{
										m: 'auto',
										textAlign: 'right',
									}}
								>
									<Chip
										label={
											<Typography
												sx={{
													fontSize: 11,
												}}
											>
												X{props.item.quantity}
											</Typography>
										}
										size='small'
										color={props.item.quantity > 1 ? 'error' : 'default'}
									/>
								</Grid>

								<Grid
									item
									xs={6}
									md={0.6}
									sx={{
										m: 'auto',
										textAlign: 'right',
									}}
								>
									<Typography
										noWrap
										fontSize={13}
										sx={{
											color: '#1565c0',
										}}
									>
										{props.item.actualPrice}
									</Typography>
								</Grid>

								<Grid
									item
									xs={6}
									md={1.6}
									sx={{
										m: 'auto',
									}}
								>
									<Box
										sx={{
											ml: 1,
											display: 'flex',
											alignItems: 'center',
										}}
									>
										{props.item.deliveryInfo ? (
											<Search
												disabled={
													!delivery.deliveryList.find(
														(v) => v.name === common.user.userInfo.orderToDeliveryName && v.hscode,
													)
												}
												value={props.item.deliveryInfo.category}
												onChange={(e: any, value: any) => {
													delivery.updateDeliveryInfo(
														{
															...props.item.deliveryInfo,

															category: value,
														},
														props.index,
													);
												}}
												onInputChange={(e, value, reason) => {
													if (reason !== 'input') {
														return;
													}

													delivery.updateDeliveryInfo(
														{
															...props.item.deliveryInfo,

															input: value,
														},
														props.index,
													);
												}}
												options={
													props.item.deliveryInfo.input
														? delivery.deliveryData.find(
																(v: any) => v.company === common.user.userInfo?.orderToDeliveryName,
														  ).category
														: [props.item.deliveryInfo.category]
												}
												getOptionLabel={(option: any) => option.name ?? ''}
												isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
												onClose={() => {
													delivery.updateDeliveryInfo(
														{
															...props.item.deliveryInfo,

															input: '',
														},
														props.index,
													);
												}}
											/>
										) : null}
									</Box>
								</Grid>

								<Grid
									item
									xs={6}
									md={1}
									sx={{
										m: 'auto',
									}}
								>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'right',
											mr: 1,
										}}
									>
										<MyButton
											disableElevation
											variant='contained'
											color='info'
											sx={{
												minWidth: 60,
											}}
											onClick={() => {
												delivery.toggleDeliveryDetailModal(true, props.index);
											}}
										>
											상세정보
										</MyButton>
									</Box>
								</Grid>
							</Grid>
						</Box>
					</Box>
				</StyledTableCell>
			</TableRow>
		</>
	);
});
