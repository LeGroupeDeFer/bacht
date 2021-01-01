import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from 'sharea/App';
import store from 'sharea/store';


const root = document.getElementById('root');
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  root
);

// ugly hack to send information to backend when a user force refresh on a page and therefore quits a Sharea view
window.onunload = (e) => {
  const path = window.location.pathname;
  const shareaRegex = /\/sharea\/(?<id>\d+)/;
  const match = path.match(shareaRegex);
  if (match !== null) {
    const id = match.groups.id;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/sharea/${id}/quit`, false);
    xhr.setRequestHeader('Authorization', `Bearer ${window.currentAccessToken}`);
    xhr.send();
  }
};
