import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useContext, useMemo, lazy, Suspense } from 'react';
import { AppContext } from '../../containers/AppContext';
import { Frame } from './Common/UI';
import { Header } from './Common/Header';
import { useSearchParams } from 'react-router-dom';

const Dashboard = lazy(() => import('./Dashboard/Dashboard'));
const Collected = lazy(() => import('./Product/Collected/Collected'));
const Registered = lazy(() => import('./Product/Registered/Registered'));
const Rocked = lazy(() => import('./Product/Locked/Locked'));

const App = () => {
	const { common, restrict } = useContext(AppContext);
	const [searchParams] = useSearchParams();
	const currentComponent = searchParams.get('page');

	// 다크모드 지원 설정
	const theme = useMemo(
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
				<Suspense fallback={null}>
					{currentComponent === 'dashboard' && <Dashboard />}
					{currentComponent === 'collected' && <Collected />}
					{currentComponent === 'registered' && <Registered />}
					{currentComponent === 'rocked' && <Rocked />}
					{currentComponent === 'errored' && <Collected />}
					{currentComponent === 'newOrder' && <Collected />}
					{currentComponent === 'inflow' && <Collected />}
					{currentComponent === 'analysis' && <Collected />}
					{currentComponent === 'sourcing' && <Collected />}
					{currentComponent === 'settings' && <Collected />}
					{currentComponent === 'connects' && <Collected />}
					{currentComponent === 'banwords' && <Collected />}
					{!currentComponent && <Dashboard />}
				</Suspense>
			</Frame>
		</ThemeProvider>
	);
};

export default App;
