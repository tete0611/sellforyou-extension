import React from 'react';

import { render } from 'react-dom';
import { Analysis } from './Analysis';

import './index.css';

render(
  <Analysis />,

  window.document.querySelector('#app-container')
);

