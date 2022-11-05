import React from 'react';

import { render } from 'react-dom';
import { Settings } from './Settings';

import './index.css';

render(
  <Settings />,

  window.document.querySelector('#app-container')
);

