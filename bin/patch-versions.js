const path = require('path')
const fs = require('fs')
const {execSync} = require('child_process')

let packages = {}
execSync('git diff main --name-only').toString().split('\n').map(e => {
  let m = e.split('/')
  if (m[0] === 'packages' && (m[2] === 'src' || m[2] === 'package.json')) {
    packages[m[1]] = true
  }
  return e
})

let packagesFolder = fs.readdirSync(path.resolve(__dirname, '../packages'))

let packagesJson = {}

for (let pkg of packagesFolder) {
  let pjsonPath = path.resolve(__dirname, '../packages', pkg, 'package.json')
  if (fs.existsSync(pjsonPath)) {
    packagesJson[pkg] = require(path.resolve(__dirname, '../packages', pkg, 'package.json'))
  }
}

function getExistingVersion(pkg) {
  return execSync(`npm view ${pkg} | grep latest`).toString().split('\n')[0].split(' ')[1]
}

function updateOtherPackages(pkg, name, newVersion) {
  console.info('Patching '+pkg+' to version '+ newVersion)
  for (let p in packagesJson) {
    if (p === pkg) {
      continue
    }
    let json = packagesJson[p]
    let yes = false
    if (json.dependencies[name]) {
      json.dependencies[name] = 'workspace:~'+ newVersion
      yes = true
    }
    if (json.devDependencies[name]) {
      json.devDependencies[name] = 'workspace:~'+ newVersion
      yes = true
    }
    if (yes) {
      console.info('Updating dependencies in', p)
    }
  }
}

for (let p in packages) {
  let json = packagesJson[p]
  let {version, name} = json
  if(version === getExistingVersion(name)) {
    let v = version.split('.')
    v[2] = parseInt(v[2]) + 1
    v = v.join('.')
    json.version = v
    updateOtherPackages(p, name, v)
  }

}

for (let p in packagesJson) {
  fs.writeFileSync(path.resolve(__dirname, '../packages', p, 'package.json'), JSON.stringify(packagesJson[p], null, 2) + '\n')
}

console.info('Done')
