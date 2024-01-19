import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from '../../../../containers/AppContext';
import {
	styled,
	Box,
	Checkbox,
	CircularProgress,
	Divider,
	Grid,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Typography,
} from '@mui/material';
import { List, AutoSizer } from 'react-virtualized';
import { MyButton } from '../../Common/UI';
import { OrderSummary } from './';

import '../../Common/Styles.css';

const StyledTableCell = styled(TableCell)({
	borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
	textAlign: 'center',
	padding: 0,
	fontSize: 14,
});

export const OrderTables = observer(() => {
	const { common, order } = React.useContext(AppContext);

	const tableRef = React.useRef();

	const rowRenderer = (props) => {
		const item = order.orderInfo.orders[props.index];

		return (
			<div key={props.key} style={props.style}>
				<Box>
					<Table>
						<OrderSummary item={item} index={props.index} />
					</Table>
				</Box>
			</div>
		);
	};

	return (
		<>
			<Table stickyHeader size='small'>
				<TableHead>
					<TableRow>
						<StyledTableCell width={50}>
							<Checkbox
								size='small'
								checked={order.orderInfo.checkedAll}
								onChange={(e) => order.toggleItemCheckedAll(e.target.checked)}
							/>
						</StyledTableCell>

						<StyledTableCell colSpan={2}>
							<Box
								sx={{
									alignItems: 'center',
									display: 'flex',
									justifyContent: 'space-between',
									px: 1,
									minHeight: 50,
								}}
							>
								<Box
									sx={{
										alignItems: 'center',
										display: 'flex',
										justifyContent: 'left',
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
											order.loadOrder(common);
										}}
									>
										주문조회
									</MyButton>
								</Box>

								<Box
									sx={{
										alignItems: 'center',
										display: 'flex',
										justifyContent: 'right',
									}}
								>
									<Typography fontSize={13}>일괄설정</Typography>

									<Divider sx={{ height: 28, mr: 1, ml: 1 }} orientation='vertical' />

									<MyButton
										disableElevation
										variant='contained'
										color='secondary'
										sx={{
											ml: 0.5,
											minWidth: 60,
										}}
										onClick={() => {
											alert('준비 중입니다.');

											// order.productPrepared(common, "");
										}}
									>
										일괄발주
									</MyButton>

									<MyButton
										disableElevation
										variant='contained'
										color='error'
										sx={{
											ml: 0.5,
											minWidth: 60,
										}}
										onClick={() => {
											alert('준비 중입니다.');

											// order.deleteOrder(common, -1);
										}}
									>
										일괄삭제
									</MyButton>
								</Box>
							</Box>
						</StyledTableCell>
					</TableRow>

					<TableRow>
						<StyledTableCell width={50}></StyledTableCell>

						<StyledTableCell colSpan={2}>
							<Grid container spacing={0.5}>
								<Grid
									item
									xs={6}
									md={3}
									sx={{
										margin: 'auto',
									}}
								>
									<Box
										sx={{
											fontSize: 11,
										}}
									>
										주문정보(상품명/옵션명)
									</Box>
								</Grid>

								<Grid
									item
									xs={6}
									md={0.6}
									sx={{
										margin: 'auto',
									}}
								>
									<Box
										sx={{
											fontSize: 11,
										}}
									>
										발주처
									</Box>
								</Grid>

								<Grid
									item
									xs={6}
									md={1.8}
									sx={{
										margin: 'auto',
									}}
								>
									<Grid container spacing={0.5}>
										<Grid
											item
											xs={6}
											md={6}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													fontSize: 11,
												}}
											>
												구매자
											</Box>
										</Grid>

										<Grid
											item
											xs={6}
											md={6}
											sx={{
												margin: 'auto',
											}}
										>
											<Box
												sx={{
													fontSize: 11,
												}}
											>
												수취인
											</Box>
										</Grid>
									</Grid>
								</Grid>

								<Grid
									item
									xs={6}
									md={2.4}
									sx={{
										margin: 'auto',
									}}
								>
									<Box
										sx={{
											fontSize: 11,
										}}
									>
										배송정보(우편번호/배송지/배송메시지)
									</Box>
								</Grid>

								<Grid
									item
									xs={6}
									md={1.4}
									sx={{
										margin: 'auto',
									}}
								></Grid>

								<Grid
									item
									xs={6}
									md={0.6}
									sx={{
										margin: 'auto',
									}}
								>
									<Box
										sx={{
											fontSize: 11,
										}}
									>
										수량
									</Box>
								</Grid>

								<Grid
									item
									xs={6}
									md={0.6}
									sx={{
										margin: 'auto',
									}}
								>
									<Box
										sx={{
											fontSize: 11,
										}}
									>
										주문금액
									</Box>
								</Grid>

								<Grid
									item
									xs={6}
									md={0.6}
									sx={{
										margin: 'auto',
									}}
								>
									<Box
										sx={{
											fontSize: 11,
										}}
									>
										배송비
									</Box>
								</Grid>

								<Grid
									item
									xs={6}
									md={1}
									sx={{
										margin: 'auto',
									}}
								></Grid>
							</Grid>
						</StyledTableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					<TableRow>
						<StyledTableCell colSpan={3}>
							<div
								style={{
									height: common.innerSize.height - 192,
								}}
							>
								{order.orderInfo.loading ? (
									<>
										<Box
											sx={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												p: 3,
											}}
										>
											<CircularProgress disableShrink size='1.5rem' />

											<Typography
												sx={{
													ml: 1,
												}}
												fontSize={16}
											>
												주문정보를 가져오는 중입니다...
											</Typography>
										</Box>
									</>
								) : (
									<>
										{order.orderInfo.orders.length > 0 ? (
											<AutoSizer>
												{({ height, width }) => (
													<List
														width={width}
														height={height}
														rowCount={order.orderInfo.orders.length}
														rowRenderer={rowRenderer}
														rowHeight={42}
														ref={tableRef}
													/>
												)}
											</AutoSizer>
										) : (
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
													p: 3,
												}}
											>
												<Typography fontSize={16}>주문이 존재하지 않습니다.</Typography>
											</Box>
										)}
									</>
								)}
							</div>
						</StyledTableCell>
					</TableRow>
				</TableBody>
			</Table>
		</>
	);
});
