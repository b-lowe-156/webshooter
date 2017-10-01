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

const currentVersions = Promise.resolve({
  WildFly: 230,
  PM2: 230,
  Client: 230
})

const localVersions = Promise.resolve(['230','229', '276'])

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

const printStatus = () => {
  const table = new Table({
    head: ['Deployments' ,'Hudson'],
    colWidths: [50, 50]
  })
  const curentState = ['EAR: 230']
  const localVersion = ['230']
  const hudsonVersion = ['233']
  
  table.push(
    ['230', '233'],
    ['230', '230']
  )
  console.log(table.toString());
}

const mainScreen = () => {
  console.log('\n')
  //printStatus()
  currentVersions
  .then(v => console.log(`Versionen WildFly: ${v.WildFly} | PM2: ${v.PM2} | Client: ${v.Client}`))
  .then(() => localVersions)
  .then(v => console.log(`Deployments: ${v.join(', ')}\n`))
  .then(() =>
    inquirer.prompt({
      type: 'list',
      name: 'theme',
      message: 'Was willst du machen?',
      choices: [
        { value: 'load', name: 'Lade Deployment vom Hudson' },
        { value: 'stop', name:'Stoppe dienste (Wildfly und PM2)' },
        { value: 'version', name:'Version aktivieren (EAR, server.js und Client)' },
        { value: 'start', name:'Starte dienste (Wildfly und PM2)' },
        { value: 'hotpatch', name:'Zero downtime JavaScript deploy' },
        { value: 'delete', name:'Loesche ungenutze Deployments' },
        new inquirer.Separator(),
        { value: 'end', name:'Beenden' },
        new inquirer.Separator(),
      ]
    })
  )
	.then(answer => {
		// console.log(JSON.stringify(answer.theme, null, '  '))
		
		switch(answer.theme) {
			case 'load':
				hudsonVersions
				.then(v => console.log(v))
				.then(() => mainScreen())
			break
			case 'end':
        console.log('stop')
      break
    }
	})
}

mainScreen()