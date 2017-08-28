
const insertStatement = definition => entity => {
  const columsToInsert = definition.columns.filter(c => c.type !== 'pk' && c.type !== 'version')
  const query = `insert into ${
    definition.tableName
  } (version, ${
    columsToInsert.map(n => n.name)
    .join(', ')
  }) VALUES ($1, ${
    columsToInsert.map((n, i) => '$' + (i + 2))
    .join(', ')
  })`
  const params = [1].concat(columsToInsert.map(n => entity[n.name]))
  return {
    query,
    params,
  }
}

const selectQuery = definition => `select ${
  definition.columns.map(n => n.name)
  .join(', ')
} from ${ definition.tableName }`

const articleDef = {
  tableName: 'article',
  columns: [
    { name: 'id', type: 'pk' },
    { name: 'version', type: 'version' },
    { name: 'name', type: 'text' },
    { name: 'lastname', type: 'text' },
  ],
}

const article = {
  id: 5,
  version: 3,
  name: 'dudu',
  lastname: 'rar',
}

const insertArticeStatement = insertStatement(articleDef)

test('select statement', () => {
  expect(selectQuery(articleDef))
  .toBe('select id, version, name, lastname from article')
})

test('insert statement', () => {
  const data = insertArticeStatement(article)
  expect(data.query)
  .toBe('insert into article (version, name, lastname) VALUES ($1, $2, $3)')
})

test('insert params', () => {
  const data = insertArticeStatement(article)
  expect(data.params.length).toBe(3)
  expect(data.params[0]).toBe(1)
  expect(data.params[1]).toBe('dudu')
  expect(data.params[2]).toBe('rar')
})

test('update statement', () => {
  expect('update article set name = $2, lastname = $3 where id = $1')
  .toBe('update article set name = $2, lastname = $3 where id = $1')
})
