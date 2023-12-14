import React from 'react';

import { observer } from 'mobx-react';
import { AppContext } from '../../../../containers/AppContext';
import { Header } from '../../Common/Header';
import { Box, Chip, Container, MenuItem, Paper } from '@mui/material';
import { DeliveryTable } from '../Components/DeliveryTable';
import { ImagePopOver } from '../../PopOver';
import { DeliveryDetailModal, ManyDeliveryInfoModal } from '../../Modals';
import { ComboBox, Frame, Title } from '../../Common/UI';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export const Delivery = observer(() => {
	const { common, delivery } = React.useContext(AppContext);

	React.useEffect(() => {
		if (!common.loaded) {
			return;
		}

		if (common.user.purchaseInfo2.level < 4) {
			alert('[프리미엄] 등급부터 사용 가능한 기능입니다.');

			return;
		}

		delivery.getDeliveryInfo();
		delivery.getExternalOrders();

		delivery.setManyDeliveryInfo({
			...delivery.manyDeliveryInfo,

			membership: '',
			method: '',
			name: common.user.userInfo.orderToDeliveryName,
		});
	}, [common.loaded]);

	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: common.darkTheme ? 'dark' : 'light',
				},
			}),
		[common.darkTheme],
	);

	return (
		<ThemeProvider theme={theme}>
			<Frame dark={common.darkTheme}>
				<Header />

				<Container maxWidth={'xl'}>
					<Paper variant='outlined'>
						<Title dark={common.darkTheme}>
							<Box
								sx={{
									alignItems: 'center',
									display: 'flex',
								}}
							>
								주문발송관리 ({delivery.orderInfo.ordersFiltered.length}) &nbsp;
								<Chip
									size='small'
									label='현재 타오바오만 지원되며 1개월 전까지의 주문내역을 조회합니다.'
									color='info'
								/>
							</Box>

							<ComboBox
								sx={{
									minWidth: 100,
								}}
								value={delivery.orderInfo.searchType}
								onChange={(e: any) => {
									delivery.setSearchType(e.target.value);
								}}
							>
								<MenuItem value='ALL'>전체보기</MenuItem>

								<MenuItem value='ORDER_NOT_CONNECTED'>연동실패</MenuItem>

								<MenuItem value='ORDER_CONNECTED'>연동완료(신규)</MenuItem>

								<MenuItem value='ORDER_COMPLETED'>연동완료(출력됨)</MenuItem>
							</ComboBox>
						</Title>

						<DeliveryTable />
					</Paper>
				</Container>

				<ImagePopOver />

				<DeliveryDetailModal />

				<ManyDeliveryInfoModal />
			</Frame>
		</ThemeProvider>
	);
});
