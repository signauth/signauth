const {execSync} = require('child_process')

let changes

let gitDiff = execSync('git diff --name-only').toString().split('\n')

if (gitDiff.length > 0 && gitDiff[0]) {
  console.error('The repo is not committed.')
  // eslint-disable-next-line no-process-exit
  process.exit(1)
}

function checkAndPublish(dir) {
  const pkg = dir === 'signauth' ? '' : '@signauth/'
  console.info(`Checking  ${pkg}${dir}`)
  const version = require(`../packages/${dir}/package.json`).version
  const currVersion = execSync(`npm view ${pkg}${dir} | grep latest`).toString().split('\n')[0].split(' ')[1]
  if (version !== currVersion) {
    console.info(`Publishing  ${pkg}${dir} v${version}`)
    console.info(execSync(`cd packages/${dir} && pnpm publish ${/beta/.test(version) ? '--tag beta' : ''}`) .toString())
    changes = true
  }
}

checkAndPublish('utils', '@signauth')
checkAndPublish('helpers', '@signauth')
checkAndPublish('core', '@signauth')
checkAndPublish('signauth')

if (!changes) {
  console.info('No upgrade needed.')
}
