// @flow

interface articleEntity {
  name: string,
  nachname: string,
}

const articleColumns = ['id', 'version', 'name', 'lastname']

const selectQuery = ({ columns, tableName }) =>
  `SELECT ${ columns.join(', ') } FROM ${ tableName }`

test('select statement', () => {
  expect(selectQuery({
    columns: articleColumns,
    tableName: 'article',
  }))
  .toBe('SELECT id, version, name, lastname FROM article')
})

const article:articleEntity = {
  name: 'Johannes',
  nachname: 'Oberhofer',
}

