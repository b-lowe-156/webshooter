import React, { Component } from 'react';

export default class SelectedArticle extends Component {
  render() {
     return (
        <table className='ui selectable structured table'>
            <thead>
            <tr>
                <th className='eight wide'>Description</th>
                <th>Kcal</th>
                <th>Protein (g)</th>
                <th>Fat (g)</th>
                <th>Carbs (g)</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{this.props.article.description}</td>
                <td className='right aligned'>{this.props.article.kcal}</td>
                <td className='right aligned'>{this.props.article.sugar_g}</td>
                <td className='right aligned'>{this.props.article.carbohydrate_g}</td>
                <td className='right aligned'>{this.props.article.protein_g}</td>
            </tr>
            </tbody>
        </table>
    );
  }
}