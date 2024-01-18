import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { render } from 'react-dom';
import { Settings } from './Settings/Settings';
import { client } from './GraphQL/Client';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Dashboard } from './Dashboard/Dashboard';
import App from './App'

import './index.css';

const router = createMemoryRouter([
	{
		path: '/',
		element: <App />,
	},
]);

render(
	<ApolloProvider client={client}>
		<RouterProvider router={router} />
	</ApolloProvider>,

	window.document.querySelector('#app-container'),
);
