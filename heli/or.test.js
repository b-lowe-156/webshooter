
const articleDef = [
  { name: 'id', type: 'pk' },
  { name: 'version', type: 'version' },
  { name: 'name', type: 'text' },
  { name: 'lastname', type: 'text' },
]

const article = {
  id: 5,
  version: 3,
  name: 'dudu',
  lastname: 'rar',
}

const insertArticeStatement = article => {
  const columsToInsert = articleDef.filter(n => n.type !== 'pk' && n.type !== 'version')
  const query = `insert into article (${
    columsToInsert.map(n => n.name)
    .join(', ')
  }) VALUES (${
    columsToInsert.map((n, i) => '$' + (i + 1))
    .join(', ')
  })`
  const params = [article.name, article.lastname]
  return { query, params }
}

test('', () => {
  const data = insertArticeStatement(article)
  expect(data.query)
  .toBe('insert into article (name, lastname) VALUES ($1, $2)')
})

test('', () => {
  const data = insertArticeStatement(article)
  expect(data.params.length)
  .toBe(2)
})

test('', () => {
  expect('update article set name = $2, lastname = $3 where id = $1')
  .toBe('update article set name = $2, lastname = $3 where id = $1')
})
