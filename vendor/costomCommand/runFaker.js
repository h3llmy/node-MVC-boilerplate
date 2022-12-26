import glob from 'glob'
import { spawn } from 'child_process'

try {
  let scripts = ""
  if (process.argv[2]) {
    if (process.argv[2].includes('Faker')) {
      scripts = glob.sync(`faker/${process.argv[2]}.js`);
    } else {
      scripts = glob.sync(`faker/${process.argv[2]}Faker.js`);
    }
  } else {
    scripts = glob.sync('faker/**.js');
  }
  if (scripts.length <= 0) {
    throw `command ${process.argv[2]} not found`
  }
  
  console.log('\x1b[34m%s\x1b[0m', "faker is running...\n");
  scripts.forEach(script => {
    const child = spawn('node', [script]);
  
    child.stdout.on('data', data => {
      console.log('\x1b[32m%s\x1b[0m', `${data}`);
    });
  }); 
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', error);
}