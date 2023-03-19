import glob from 'glob'
import { spawn } from 'child_process'

try {
  if (process.env.NODE_ENV !== 'development') {
    throw 'on production mode'
  }
  let scripts
  if (process.argv[2]) {
    if (process.argv[2].includes('Faker')) {
      scripts = glob.sync(`faker/${process.argv[2]}.js`)
    } else {
      scripts = glob.sync(`faker/${process.argv[2]}Faker.js`)
    }
  } else {
    scripts = glob.sync('faker/**Faker.js')
  }
  if (scripts.length <= 0) {
    throw `file ${process.argv[2]} not found`
  }

  console.log(
    '\x1b[34m%s\x1b[0m',
    `faker ${scripts.map((fileNames) => fileNames.split('/')[1]).join(', ')} is running...`
  )
  scripts.forEach((script) => {
    const child = spawn('node', [script])

    child.stdout.on('data', (data) => {
      console.log('\x1b[32m%s\x1b[0m', `${data}`)
    })
  })
} catch (error) {
  console.log('\x1b[31m%s\x1b[0m', error)
}
