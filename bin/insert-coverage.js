const path = require('path')
const fs = require('fs')
const {execSync} = require('child_process')

function decolorize(str) {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, '')
}

let coverage = execSync('npm run test').toString().split('\n')

//
// const org = dir === 'secrez' ? '' : '@secrez/'
// const pkg = `${org}${dir}`
// console.log(`Checking  ${pkg}`)
// const version = require(`../packages/${dir}/package.json`).version
// const currVersion = execSync(`npm view ${pkg} | grep latest`).toString().split('\n')[0].split(' ')[1]
// if (version !== currVersion) {
//   console.log(`Getting coverage for ${pkg}`)
//   console.log(execSync(`bin/get-coverage.sh ${dir} ${pkg}`).toString())
//   changes = true
// }
//
// let coverage = fs.readFileSync(path.resolve(__dirname, 'coverage.report'), 'utf8').split('\n')

let result = []
for (let row of coverage) {
  row = decolorize(row)

  if (/ {2}\d+ failing/.test(row)) {
    // eslint-disable-next-line no-process-exit
    process.exit(1)
  }

  if (result[0]) {
    if (result[2] && !row) {
      break
    }
    result.push(row)
  }
  if (/ {2}\d+ passing/.test(row)) {
    result.push(row)
  }

}

let text = '## Test coverage'

coverage = result.join('\n')

let p = path.resolve(__dirname, '../README.md')

let README = fs.readFileSync(p, 'utf8').split(text)

let coverageSection = README[1].split('```')

coverageSection[1] = `\n${coverage}\n`

let readme = `${README[0]}${text}${coverageSection.join('```')}`

fs.writeFileSync(p, readme)

