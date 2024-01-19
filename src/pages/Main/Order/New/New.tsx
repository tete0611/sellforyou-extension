import React from 'react';
import { OrderTables } from '../Components';
import { observer } from 'mobx-react';
import { AppContext } from '../../../../containers/AppContext';
import { Box, Chip, Container, Paper } from '@mui/material';
import { OrderDetailModal } from '../../Modals';
import { ImagePopOver } from '../../PopOver';
import { Title } from '../../Common/UI';
import { createTheme } from '@mui/material/styles';

const New = observer(() => {
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
		// <ThemeProvider theme={theme}>
		// 	<Frame dark={common.darkTheme}>
		// 		<Header />
		<>
			<Container maxWidth={'xl'} style={{ backgroundColor: common.darkTheme ? '#242424' : '#f5f5f5' }}>
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
		</>
		// 	</Frame>
		// </ThemeProvider>
	);
});
export default New;
