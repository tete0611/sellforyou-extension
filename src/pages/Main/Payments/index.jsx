import React from 'react';

import { render } from 'react-dom';
import { Payments } from './Payments';

import './index.css';

render(
	<Payments />,

	window.document.querySelector('#app-container'),
);
