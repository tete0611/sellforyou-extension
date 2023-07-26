import React from 'react';

import { render } from 'react-dom';
import { LostAndFound } from './LostAndFound';

import './index.css';

render(
	<LostAndFound />,

	window.document.querySelector('#app-container'),
);
