const { execSync } = require('child_process')
const inquirer = require('inquirer')

/*
try {
	const result = execSync('dir', {stdio:[0,1,2]})
	console.log(result)
} catch (e) {
	console.log('breche aktion ab')
}
*/

const hudsonVersions = Promise.resolve([{
    number: 233,
    status: 'RUNNING'
  }, {
    number: 232,
    status: 'SUCCESSFUL'
  }, {
    number: 231,
    status: 'FAILED'
  }, {
    number: 230,
    status: 'SUCCESSFUL'
  },
])

const loadHandler = () => {
  console.log('Wähle version aus zum herunter laden')




  inquirer.prompt({
    type: 'list',
    name: 'theme',
    message: 'What do you want to do?',
    choices: [
      { value: 'load', name: 'Lade Version vom Hudson' },
      { value: 'stop', name:'Stoppe dienste' },
      { value: 'version', name:'Version aktivieren' },
      { value: 'start', name:'Starte dienste' },
      new inquirer.Separator(),
      { value: 'end', name:'Beenden' },
    ]
  })
  .then(answer => {
    console.log(JSON.stringify(answer.theme, null, '  '))
    if (answer.theme === 'load') {
      loadHandler()
    } else if (answer.theme !== 'end') {
      main()
    }
  })




  hudsonVersions.then(versions => {
    console.log(versions)
  })
}

const main = () => {
  console.log('\n')
  inquirer.prompt({
    type: 'list',
    name: 'theme',
    message: 'What do you want to do?',
    choices: [
      { value: 'load', name: 'Lade Version vom Hudson' },
      { value: 'stop', name:'Stoppe dienste' },
      { value: 'version', name:'Version aktivieren' },
      { value: 'start', name:'Starte dienste' },
      new inquirer.Separator(),
      { value: 'end', name:'Beenden' },
    ]
  })
  .then(answer => {
    console.log(JSON.stringify(answer.theme, null, '  '))
    if (answer.theme === 'load') {
      loadHandler()
    } else if (answer.theme !== 'end') {
      main()
    }
  })
  return undefined
}

main()