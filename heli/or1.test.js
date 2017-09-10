// @flow

const selectQuery = ({ columns, tableName }) =>
  `SELECT ${ columns.join(', ') } FROM ${ tableName }`

const tecCols = ['id', 'version']

const articleCols = ['name', 'lastname']
const articleAllCols = tecCols.concat(articleCols)

const article = {
  id: 5,
  version: 3,
  name: 'dudu',
  lastname: 'rar',
}

test('select statement', () => {
  expect(selectQuery({ columns: articleAllCols, tableName: 'article' }))
  .toBe('SELECT id, version, name, lastname FROM article')
})
