// @flow

const technicals = ({ type }) => type !== 'pk' && type !== 'version'

const insertStatement = ({ columns, tableName }) => entity => ({
  query: `insert into ${tableName} (version, ${
    columns
    .map(n => n.name)
    .join(', ')
  }) VALUES ($1, ${
    columns
    .map((n, i) => '$' + (i + 2))
    .join(', ')
  })`,
  params: [1].concat(
    columns
    .map(n => entity[n.name])
  ),
})

const updateStatement = ({ columns, tableName }) => entity => ({
  query: `update ${ tableName } set ${
    columns
    .map((n, i) => n.name + ' = $' + (i + 3))
    .join(', ')
  } where id = $1 and version = $2`,
  params: columns.map(n => entity[n.name]),
})

const selectQuery = ({ columns, tableName }) =>
  `select ${
    columns
    .map(n => n.name)
    .join(', ')
  } from ${ tableName }`

const tecCol = [
  { name: 'id', type: 'pk' },
  { name: 'version', type: 'version' },
]

const articleDef = {
  tableName: 'article',
  columns: [
//    { name: 'id', type: 'pk' },
//    { name: 'version', type: 'version' },
    { name: 'name', type: 'text' },
    { name: 'lastname', type: 'text' },
  ],
}

const articleCol = [
  { name: 'name', type: 'text' },
  { name: 'lastname', type: 'text' },
]

const article = {
  id: 5,
  version: 3,
  name: 'dudu',
  lastname: 'rar',
}

const insertArticeStatement = insertStatement(articleDef)
const updateArticeStatement = updateStatement(articleDef)

test('select statement', () => {
  expect(selectQuery({
    columns: tecCol.concat(articleCol),
    tableName: 'article',
  }))
  .toBe('select id, version, name, lastname from article')
})

test('insert statement', () => {
  const { query } = insertArticeStatement(article)
  expect(query)
  .toBe('INSERT INTO article (version, name, lastname) VALUES ($1, $2, $3)')
})

test('insert params', () => {
  const { params } = insertArticeStatement(article)
  expect(params.length).toBe(3)
  expect(params[0]).toBe(1)
  expect(params[1]).toBe('dudu')
  expect(params[2]).toBe('rar')
})

test('update statement', () => {
  const { query } = updateArticeStatement(article)
  expect(query)
  .toBe('update article set name = $3, lastname = $4 where id = $1 and version = $2')
})

test('update statement params', () => {
  const { params } = updateArticeStatement(article)
  expect(params.length).toBe(4)
  expect(params[0]).toBe(5)
  expect(params[1]).toBe(3)
  expect(params[2]).toBe('dudu')
  expect(params[3]).toBe('rar')
})
