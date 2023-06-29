import React from 'react';

import { render } from 'react-dom';
import { BanWords } from './BanWords';

import './index.css';

render(
  <BanWords />,

  window.document.querySelector('#app-container')
);
