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

const main = () => {
  console.log('\n')
  hudsonVersions
  .then(v => console.log(v))
  .then(() => {
    inquirer.prompt({
      type: 'list',
      name: 'theme',
      message: 'What do you want to do?',
      choices: [
        { value: 'load', name: 'Lade Deployment vom Hudson' },
        { value: 'stop', name:'Stoppe dienste (Wildfly und PM2)' },
        { value: 'version', name:'Version aktivieren (EAR, server.js und Client)' },
        { value: 'start', name:'Starte dienste (Wildfly und PM2)' },
        { value: 'hotpatch', name:'Starte dienste (Wildfly und PM2)' },
        { value: 'delete', name:'Loesche ungenutze Deployments' },
        new inquirer.Separator(),
        { value: 'end', name:'Beenden' },
        new inquirer.Separator(),
      ]
    })
    .then(answer => {
      console.log(JSON.stringify(answer.theme, null, '  '))
      
      if (answer.theme !== 'end') {
        main()
      }
    })
    
  })

  console.log('\n')
  
  return undefined
}

main()