import React from 'react';

import { render } from 'react-dom';
import Registered from './Registered';

import './index.css';

render(
	<Registered />,

	window.document.querySelector('#app-container'),
);
