'use strict'

const Promise = require("bluebird")
const fs = Promise.promisifyAll(require("fs"))

//const fs = require('fs')
const { execSync } = require('child_process')
const { prompt, Separator } = require('inquirer')

/*
try {
	const result = execSync('dir', {stdio:[0,1,2]})
	console.log(result)
} catch (e) {
	console.log('breche aktion ab')
}
*/

const currentVersions = Promise.resolve({
  WildFly: '229',
  PM2: '230',
  Client: '230'
})

const localVersions = new Promise((resolve, reject) => {
  fs
  .readdirAsync('./deployments/')
  .then(directories => {
    Promise.all(directories.map(dir => fs.statAsync(`./deployments/${dir}`)))
    .then(stats => {
      resolve(
        directories
        .filter((d, i) => stats[i].isDirectory())
        .filter(d => d !== '.' && d !== '..')
        .sort()
        .reverse()
      )
    })
  })
  .catch(err => reject(err))
})

const hudsonVersions = Promise.resolve([{
    number: '233',
    status: 'RUNNING'
  }, {
    number: '232',
    status: 'SUCCESSFUL'
  }, {
    number: '231',
    status: 'FAILED'
  }, {
    number: '230',
    status: 'SUCCESSFUL'
  },
])

const removeUnusedVersionsScreen = () => {
  console.log('\x1Bc')
  console.log('PIM-CI Tool | Loesche ungenutze Deployments\n')
  Promise.all([currentVersions, localVersions])
  .spread((c, l) => {
    const used = [c.WildFly, c.PM2, c.Client]
    const deletables = l.filter(v => !used.includes(v))
    console.log(`Deployments     | ${deletables.join(', ')}`)
    return deletables
  })
  .then(deletables => prompt({
    type: 'checkbox',
    name: 'toDelete',
    message: 'Welche sollen geloescht werden?',
    pageSize: 10,
    choices: deletables,
  }))
  .then(({ toDelete }) => {
    if (toDelete.length > 0) {
      toDelete.forEach(dir => execSync(`rmdir .\\deployments\\${dir} /s /q`))
      mainScreen({message: `Version (${toDelete.join(', ')}) wurde geloescht!`})
    } else {
      mainScreen()
    }
  })
 .catch(err => console.log(err))
//  mainScreen({message: 'Version 230 wurde geloescht!'})
}

const mainMenue = {
  type: 'list',
  name: 'action',
  message: 'Was willst du machen?',
  pageSize: 10,
  choices: [
    { value: 'refresh', name: 'Aktualisiere' },
    { value: 'load', name: 'Lade Deployment vom Hudson' },
    { value: 'stop', name:'Stoppe dienste (Wildfly und PM2)' },
    { value: 'version', name:'Version aktivieren (EAR, server.js und Client)' },
    { value: 'start', name:'Starte dienste (Wildfly und PM2)' },
    { value: 'hotpatch', name:'Zero downtime JavaScript deploy' },
    { value: 'delete', name:'Loesche ungenutze Deployments' },
    new Separator(),
    { value: 'end', name:'Beenden' },
  ]
}

const mainScreen = props => {
  console.log('\x1Bc')
  console.log('PIM-CI Tool\n')
  if(props && props.message) {
    console.log('\x1b[32m' + props.message + '\x1b[0m\n')
  }
  Promise.all([currentVersions, localVersions, hudsonVersions])
  .spread((c, l, h) => {
    const used = [c.WildFly, c.PM2, c.Client]
    console.log(`Aktive version  | WildFly: ${c.WildFly}`)
    console.log(`                | PM2:     ${c.PM2}`)
    console.log(`                | Client:  ${c.Client}`)
    console.log('----------------|----------------------------------')
    console.log(`Deployments     | ${l.map(v => used.includes(v) ? `\x1b[35m${v}\x1b[0m` : v).join(', ')}`)
    console.log(`Hudsonversionen | ${h.filter(v => (v.status === 'SUCCESSFUL') && !used.includes(v.number)).map(v => v.number).join(', ')}\n`)
    if (h[0] && h[0].status === 'RUNNING') {
      console.log('\x1b[32mDie Version ' + h[0].number + ' wird derzeit vom Hudson gebaut\x1b[0m')
    }
    if (c.WildFly !== c.PM2 || c.WildFly !== c.Client || c.PM2 !== c.Client ) {
      console.log('\x1b[31mEs werden verschiedene Versionen eingesetzt!\x1b[0m')
    }
    console.log('')
  })
  .then(() => prompt(mainMenue))
	.then(answer => {
		// console.log(JSON.stringify(answer.action, null, '  '))
		
		switch(answer.action) {
      case 'refresh':
        mainScreen()
      break
			case 'load':
        mainScreen({message: 'Version 230 wurde herunter geladen!'})
			break
      case 'delete':
        removeUnusedVersionsScreen()
        break
			case 'end':
        console.log('stop')
      break
    }
	})
}

mainScreen()