const glob = require('glob');
const { spawn } = require('child_process');

// Find all scripts with the word "faker" in the name
const scripts = glob.sync('**/faker*.js');

scripts.forEach(script => {
  // Run each script
  const child = spawn('node', [script]);

  child.stdout.on('data', data => {
    console.log(`${script}: ${data}`);
  });

  child.stderr.on('data', data => {
    console.error(`${script}: ${data}`);
  });

  child.on('close', code => {
    console.log(`${script} exited with code ${code}`);
  });
});
