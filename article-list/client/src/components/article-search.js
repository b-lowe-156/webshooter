import React, { Component } from 'react';
import Client from '../Client';

const MATCHING_ITEM_LIMIT = 25;
export default class ArticleSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      matchingFoods: [],
      showRemoveIcon: false,
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchCancel = this.handleSearchCancel.bind(this);
  }
  handleSearchChange() {
    const query = this.refs.search.value;

    if (query === '') {
      this.setState({
        matchingFoods: [],
        showRemoveIcon: false,
      });
    } else {
      Client.search(query).then((foods) => (
        this.setState({
          matchingFoods: foods.slice(0, MATCHING_ITEM_LIMIT),
          showRemoveIcon: true,
        })
      ));
    }
  }
  handleSearchCancel() {
    this.setState({
      matchingFoods: [],
      showRemoveIcon: false,
    });
    this.refs.search.value = '';
  }
  render() {
    const removeIconStyle = (
      this.state.showRemoveIcon ? {} : { display: 'none' }
    );
    return (
      <div id='food-search'>
        <table className='ui selectable structured table'>
          <thead>
            <tr>
              <th colSpan='5'>
                <div className='ui fluid search'>
                  <div className='ui icon input'>
                    <input
                      className='prompt'
                      type='text'
                      placeholder='Search foods...'
                      ref='search'
                      onChange={this.handleSearchChange}
                    />
                    <i className='search icon' />
                  </div>

                  <i
                    className='remove icon'
                    style={removeIconStyle}
                    onClick={this.handleSearchCancel}
                  />
                </div>
              </th>
            </tr>
            <tr>
              <th className='eight wide'>Description</th>
              <th>Kcal</th>
              <th>Protein (g)</th>
              <th>Fat (g)</th>
              <th>Carbs (g)</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.matchingFoods.map((food, idx) => (
                <tr key={idx} onClick={() => this.props.onArticleSelect(food)}>
                  <td>{food.description}</td>
                  <td className='right aligned'>{food.kcal}</td>
                  <td className='right aligned'>{food.sugar_g}</td>
                  <td className='right aligned'>{food.carbohydrate_g}</td>
                  <td className='right aligned'>{food.protein_g}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}
