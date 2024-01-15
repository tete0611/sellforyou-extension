import React from 'react';

import { render } from 'react-dom';
import Collected from './Collected';

import './index.css';

render(
	<Collected />,

	window.document.querySelector('#app-container'),
);
