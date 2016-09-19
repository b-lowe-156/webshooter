import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';

import ArticleList from './article-list';
import './index.css';
import './semantic-ui/semantic.min.css';

class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/' component={ArticleList} />
      </Router>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
