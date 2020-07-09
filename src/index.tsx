import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import AppJs from './AppJs';
import './global.css';

ReactDOM.render(<App name={process.env.PAGE_TITLE || 'test'} />, document.getElementById('app'));
// eslint-disable-next-line max-len
// ReactDOM.render(<AppJs name={process.env.PAGE_TITLE || 'test'} />, document.getElementById('app'));
