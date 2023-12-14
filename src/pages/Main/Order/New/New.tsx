import React from 'react';
import OrderTables from '../Components/OrderTables';

import { observer } from 'mobx-react';
import { AppContext } from '../../../../containers/AppContext';
import { Header } from '../../Common/Header';
import { Box, Chip, Container, Paper } from '@mui/material';
import { OrderDetailModal } from '../../Modals';
import { ImagePopOver } from '../../PopOver';
import { Frame, Title } from '../../Common/UI';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export const New = observer(() => {
	const { common, order } = React.useContext(AppContext);

	React.useEffect(() => {
		if (!common.loaded) {
			return;
		}

		order.loadOrder(common);
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
								신규주문목록 ({order.count}) &nbsp;
								<Chip
									size='small'
									label='인터파크는 현재 주문조회가 지원되지 않습니다. / 위메프는 주문정보 일부가 별표(*)처리됩니다.'
									color='info'
								/>
							</Box>
						</Title>

						<OrderTables />
					</Paper>
				</Container>

				<ImagePopOver />

				<OrderDetailModal />
			</Frame>
		</ThemeProvider>
	);
});
