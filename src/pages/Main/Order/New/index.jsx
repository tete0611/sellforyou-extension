import React from 'react';

import { render } from 'react-dom';
import { New } from './New';

import './index.css';

render(
  <New />,

  window.document.querySelector('#app-container')
);

