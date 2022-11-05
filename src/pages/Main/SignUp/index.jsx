import React from 'react';

import { render } from 'react-dom';
import { SignUp } from './SignUp';

import './index.css';

render(
  <SignUp />,

  window.document.querySelector('#app-container')
);

