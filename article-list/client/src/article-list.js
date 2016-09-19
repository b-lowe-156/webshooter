import React, { Component } from 'react';
import ArticleSearch from './components/article-search';
import SelectedArticle from './components/selected-article';
import { browserHistory } from 'react-router';

export default class ArticleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedArticle: null,
    };
  }
  render() {
    var selectedArticleTag;
    if (this.state.selectedArticle !== null) {
      selectedArticleTag = (<SelectedArticle article={this.state.selectedArticle} />)
    }
    return (
      <div className='App'>
        <div className='ui text container'>
          {selectedArticleTag}
          <ArticleSearch
            onArticleSelect={
              (article) => this.selectedArticleChanged(article)
            }
          />
        </div>
      </div>
    );
  }
  selectedArticleChanged(article) {
    this.setState({
      selectedArticle: article,
    })
    browserHistory.push('/article/' + article.NDB_No)
  }
}
