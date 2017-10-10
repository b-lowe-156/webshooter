'use strict'

const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const { execSync } = require('child_process')
const { prompt, Separator } = require('inquirer')

const currentVersions = Promise.resolve({
  WildFly: '229',
  PM2: '230',
  Client: '230'
})

const localVersions = () =>
  new Promise((resolve, reject) => 
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
  )

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

const mainMenue = {
  type: 'list',
  name: 'action',
  message: 'Was willst du machen?',
  pageSize: 10,
  choices: [
    { value: 'refresh', name: 'Aktualisiere ansicht' },
    { value: 'history', name:'Zeige Deploy History' },
    { value: 'load', name: '1. Lade Deployment vom Hudson' },
    { value: 'stop', name:'2. Stoppe Dienste (Wildfly und Node)' },
    { value: 'version', name:'3. Version aktivieren (EAR, server.js und Client)' },
    { value: 'start', name:'4. Starte Dienste (Wildfly und Node)' },
    { value: 'auto', name:'JavaScript zero downtime deploy' },  
    { value: 'delete', name:'Loesche ungenutze Deployments' },
    { value: 'end', name:'Beenden' },
  ]
}

const mainScreen = props => {
  console.log('\x1Bc')
  console.log('PIM-CI Tool\n')
  if(props && props.message) {
    console.log('\x1b[32m' + props.message + '\x1b[0m\n')
  }
  Promise.all([currentVersions, localVersions(), hudsonVersions])
  .spread((c, l, h) => {
    const used = [c.WildFly, c.PM2, c.Client]
    console.log(`Aktiv       | WildFly: ${c.WildFly}`)
    console.log(`            | PM2:     ${c.PM2}`)
    console.log(`            | Client:  ${c.Client}`)
    console.log('------------|------------------------------------------')
    console.log(`Lokal       | ${l.map(v => used.includes(v) ? `\x1b[35m${v}\x1b[0m` : v).join(', ')}`)
    console.log(`Hudson      | ${h.filter(v => (v.status === 'SUCCESSFUL') && !l.includes(v.number)).map(v => v.number).join(', ')}\n`)
    if (h[0] && h[0].status === 'RUNNING') {
      console.log('\x1b[32mDie Version ' + h[0].number + ' wird derzeit vom Hudson gebaut\x1b[0m')
    }
    if (c.WildFly !== c.PM2 || c.WildFly !== c.Client || c.PM2 !== c.Client ) {
      console.log('\x1b[31mVersionsmix Vorhanden!\x1b[0m')
    }
    console.log('')
  })
  .then(() => prompt(mainMenue))
	.then(answer => {
		switch(answer.action) {
      case 'refresh':
        mainScreen()
      break
      case 'history':
        showHistory()
      break
      case 'load':
        loadVersionFromHudson()
      break
			case 'stop':
        stopDeamons()
      break
      case 'version':
        activateVersion()
      break
			case 'start':
        startDeamons()
      break
      case 'delete':
        removeUnusedVersionsScreen()
      break
			case 'end':
        console.log('end')
      break
    }
	})
}

const loadVersionFromHudson = () => {
  console.log('\x1Bc')
  console.log('PIM-CI Tool | Loesche ungenutze Lokale verionsen \n')
  Promise.all([localVersions(), hudsonVersions])
  .spread((l, h) => h.filter(v => (v.status === 'SUCCESSFUL') && !l.includes(v.number)).map(v => v.number))
  .then(loadables => prompt({
    type: 'checkbox',
    name: 'toLoad',
    message: 'Welche sollen herunter geladen werden?',
    pageSize: 10,
    choices: loadables,
  }))
  .then(({ toLoad }) => {
    if (toLoad.length > 0) {
      // TODO load version
      // toLoad.forEach(dir => execSync(`rmdir .\\deployments\\${dir} /s /q`))
      mainScreen({message: `Versionen: (${toLoad.join(', ')}) wurde herunter geladen!`})
    } else {
      mainScreen()
    }
  })
 .catch(err => console.log(err))
}

const stopDeamons = () => {
  console.log('\x1Bc')
  console.log('PIM-CI Tool | Stoppe Wildfly und Node \n')
  prompt({
    type: 'confirm',
    name: 'stop',
    message: 'Sollen wirklich die Dienste Wildfly und Node gestoppt werden?',
  })
  .then(result => {
    if (result.stop) {
      // TODO stop deamons
      mainScreen({message: `Wildfly und Node wurden getoppt!`})
    } else {
      mainScreen()
    }
  })
}

const activateVersion = () => {
  console.log('\x1Bc')
  console.log('PIM-CI Tool | Version aktivieren (EAR, server.js und Client) \n')
  localVersions()
  .then(activatables => prompt({
    type: 'list',
    name: 'toActivate',
    message: 'Welche Version soll aktiviert werden?',
    pageSize: 10,
    choices: activatables.concat(['Abbrechen']),
  }))
  .then(answer => {
    if (answer.toActivate === 'Abbrechen') {
      mainScreen()
    } else {
      // TODO set symlinks
      mainScreen({message: `Versionen: (${answer.toActivate}) wurde aktiviert!`})
    }
  })
 .catch(err => console.log(err))
}

const startDeamons = () => {
  console.log('\x1Bc')
  console.log('PIM-CI Tool | Starte Wildfly und Node \n')
  prompt({
    type: 'confirm',
    name: 'stop',
    message: 'Sollen wirklich die Dienste Wildfly und Node gestartet werden?',
  })
  .then(result => {
    if (result.stop) {
      // TODO start deamons
      mainScreen({message: `Wildfly und Node wurden gestartet!`})
    } else {
      mainScreen()
    }
    console.log(result)
  })
}

const removeUnusedVersionsScreen = () => {
  console.log('\x1Bc')
  console.log('PIM-CI Tool | Loesche ungenutze Deployments\n')
  Promise.all([currentVersions, localVersions()])
  .spread((c, l) => {
    const used = [c.WildFly, c.PM2, c.Client]
    return l.filter(v => !used.includes(v))
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
}

function pad(width, string, padding) { 
  return (10 <= string.length) ? string : pad(10, padding + string, padding)
}

const showHistory = () => {
  console.log('\x1Bc')
  console.log('PIM-CI Tool | Deploy History \n\n')

  const history = JSON.parse(fs.readFileSync('./history.json'))

  console.log(` Client     | Api       | Wildfly   | Date       | User   `)
  console.log('------------|-----------|-----------|------------|--------------')
  console.log(`         23 |        23 |        23 | 11.08.2017 | oberhoferj `)
  history.forEach(h => {
    console.log(` ${pad(h.client)} |     ${pad(h.api)} | ${pad(h.wildfly)} | ${h.date} | ${h.user} `)
  })
  console.log(`\n`)

  prompt({
    type: 'list',
    name: 'history',
    message: 'Was willst du machen?',
    pageSize: 2,
    choices: [
      { value: 'back', name:'Zurueck' },
      { value: 'end', name:'Beenden' },
    ]
  })
	.then(answer => {
		switch(answer.history) {
			case 'back':
        mainScreen()
      break
    }
	})
}

mainScreen()