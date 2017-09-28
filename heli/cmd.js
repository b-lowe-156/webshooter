const { execSync } = require('child_process')
const inquirer = require('inquirer')

try {
	const result = execSync('dir', {stdio:[0,1,2]})
	console.log(result)
} catch (e) {
	console.log('breche aktion ab')
}

inquirer.prompt(
  {
    type: 'list',
    name: 'theme',
    message: 'What do you want to do?',
    choices: [
      'Vom Hudson eine Version Herunter laden',
			'Server Herunter fahren',
			'Version aktivieren',
      new inquirer.Separator(),
      'Abbrechen',
    ]
  })
.then(answers => {
  console.log(JSON.stringify(answers, null, '  '));
})