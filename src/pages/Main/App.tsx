import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useContext, useMemo, lazy, Suspense, useState, useEffect } from 'react';
import { AppContext } from '../../containers/AppContext';
import { Frame } from './Common/UI';
import { Header } from './Common/Header';
import { useSearchParams } from 'react-router-dom';
import { getLocalStorage } from '../Tools/ChromeAsync';
import { AppInfo } from '../../type/type';

const Dashboard = lazy(() => import('./Dashboard/Dashboard'));
const Collected = lazy(() => import('./Product/Collected/Collected'));
const Registered = lazy(() => import('./Product/Registered/Registered'));
const Rocked = lazy(() => import('./Product/Locked/Locked'));
const Errored = lazy(() => import('./Product/Errored/Errored'));
const New = lazy(() => import('./Order/New/New'));
const Inflow = lazy(() => import('./Inflow/Inflow'));
const Analysis = lazy(() => import('./Keyword/Analysis/Analysis'));
const Sourcing = lazy(() => import('./Sourcing/Sourcing'));
const Settings = lazy(() => import('./Settings/Settings'));
const Connects = lazy(() => import('./Connects/Connects'));
const BanWords = lazy(() => import('./BanWords/BanWords'));

const App = () => {
	const { common } = useContext(AppContext);
	const [searchParams, setSearchParams] = useSearchParams();
	const currentComponent = searchParams.get('page');
	const [darkTheme, setDarkTheme] = useState(common.darkTheme);

	useEffect(() => {
		console.log({ location });

		getLocalStorage<AppInfo>('appInfo').then((v) => {
			setDarkTheme(v.darkTheme);
		});
		if (location.search && location.search !== '') {
			searchParams.set('page', location.search.replace('?', ''));
			setSearchParams(searchParams, { replace: true });
		}
	}, []);

	// 다크모드 지원 설정
	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode: darkTheme ? 'dark' : 'light',
				},
			}),
		[darkTheme],
	);

	return (
		<ThemeProvider theme={theme}>
			<Frame dark={darkTheme}>
				<Header setDarkTheme={setDarkTheme} />
				<Suspense fallback={null}>
					{currentComponent === 'dashboard' && <Dashboard />}
					{currentComponent === 'collected' && <Collected />}
					{currentComponent === 'registered' && <Registered />}
					{currentComponent === 'rocked' && <Rocked />}
					{currentComponent === 'errored' && <Errored />}
					{currentComponent === 'newOrder' && <New />}
					{currentComponent === 'inflow' && <Inflow />}
					{currentComponent === 'analysis' && <Analysis />}
					{currentComponent === 'sourcing' && <Sourcing />}
					{currentComponent === 'settings' && <Settings />}
					{currentComponent === 'connects' && <Connects />}
					{currentComponent === 'banwords' && <BanWords />}
					{!currentComponent && <Dashboard />}
				</Suspense>
			</Frame>
		</ThemeProvider>
	);
};

export default App;
