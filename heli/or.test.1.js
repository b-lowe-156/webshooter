// @flow

interface articleType {
  name: string,
  nachname: string,
}

const article: articleType = {
  name: 'Johannes',
  nachname: 'Oberhofer',
}

const selectQuery = ({ columns, tableName }) =>
  `select ${
    columns
    .map(n => n.name)
    .join(', ')
  } from ${ tableName }`


test('select statement', () => {
  expect(selectQuery({
    columns: tecCol.concat(articleCol),
    tableName: 'article',
  }))
  .toBe('select id, version, name, lastname from article')
})
