import React from 'react';

import { render } from 'react-dom';
import { SignIn } from './SignIn';

import './index.css';

render(
  <SignIn />,

  window.document.querySelector('#app-container')
);

