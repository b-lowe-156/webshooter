import React from 'react';

var cols = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' }
];
var data = [
    { id: 1, firstName: 'John', lastName: 'Doe' },
    { id: 2, firstName: 'Clark', lastName: 'Kent' },
    { id: 3, firstName: 'Jonny', lastName: 'Balboa' },
    { id: 4, firstName: 'Threlgor', lastName: 'Beltor' }
];
class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRow: -1,
            cols: cols,
            data: data
        };
    }
    render() {
        var headerComponents = this.generateHeaders();
        var rowComponents = this.generateRows();
        return (
            <table className="ui celled table">
                <thead> {headerComponents} </thead>
                <tbody> {rowComponents} </tbody>
            </table>
        );
    }
    generateHeaders() {
        var cols = this.state.cols;
        return cols.map(function(colData) {
            return <th key={colData.key}> {colData.label} </th>;
        });
    }
    generateRows() {
        var that = this;
        var cols = this.state.cols;
        var data = this.state.data;
        return data.map(function(item) {
            var boundClick = that.handleClick.bind(that, item.id);
            var cells = cols.map(function(colData) {
                return <td> {item[colData.key]} </td>;
            });
            return <tr key={item.id} onClick={boundClick} className={that.state.selectedRow === item.id ? 'active' : ''}> {cells} </tr>;
        });
    }
    handleClick(key) {
       this.setState({
            selectedRow : key
       });
    }
}

export default Table;
