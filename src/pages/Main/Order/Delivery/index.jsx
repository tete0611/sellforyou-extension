import React from 'react';

import { render } from 'react-dom';
import { Delivery } from './Delivery';

import './index.css';

render(
  <Delivery />,

  window.document.querySelector('#app-container')
);
