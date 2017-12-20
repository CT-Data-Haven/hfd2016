import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import { loadData } from './components/DataLoader';

loadData((data) => {
	ReactDOM.render(<App {...data} />, document.getElementById('root'));
});

registerServiceWorker();
