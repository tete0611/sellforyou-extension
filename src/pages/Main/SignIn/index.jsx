import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { render } from 'react-dom';
import { SignIn } from './SignIn';
import { client } from '../GraphQL/Client';

import './index.css';

render(
	<ApolloProvider client={client}>
	<SignIn />,
	</ApolloProvider>,

	window.document.querySelector('#app-container'),
);
