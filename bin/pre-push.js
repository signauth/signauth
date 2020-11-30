const {execSync} = require('child_process')

let changes

function checkAndGetCoverage(dir) {
  const org = dir === 'signauth' ? '' : '@signauth/'
  const pkg = `${org}${dir}`
  console.info(`Checking  ${pkg}`)
  const version = require(`../packages/${dir}/package.json`).version
  const currVersion = execSync(`npm view ${pkg} | grep latest`).toString().split('\n')[0].split(' ')[1]
  if (version !== currVersion) {
    console.info(`Getting coverage for ${pkg}`)
    console.info(execSync(`bin/get-coverage.sh ${dir} ${pkg}`).toString())
    changes = true
  }
}

checkAndGetCoverage('utils')
checkAndGetCoverage('helpers')
checkAndGetCoverage('core')
checkAndGetCoverage('signauth')

if (!changes) {
  console.info('No upgrade needed.')
}
