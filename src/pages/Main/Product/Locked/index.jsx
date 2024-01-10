import React from 'react';

import { render } from 'react-dom';
import Locked from './Locked';

import './index.css';

render(
	<Locked />,

	window.document.querySelector('#app-container'),
);
