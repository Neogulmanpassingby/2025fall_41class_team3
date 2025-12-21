const { spawn } = require('child_process');
const path = require('path');

const pythonExecutable = path.resolve(__dirname, '..', 'venv/bin/python');

exports.runPython = (scriptName, args = [], stdInData = null) => {
  return new Promise((resolve, reject) => {
    const py = spawn(pythonExecutable, [scriptName, ...args], {
      cwd: path.resolve(__dirname, ".."),
      env: process.env
    });

    if (stdInData) {
      py.stdin.write(stdInData);
      py.stdin.end();
    }

    let result = "";
    let error = "";

    py.stdout.on("data", (chunk) => (result += chunk.toString()));
    py.stderr.on("data", (err) => (error += err.toString()));

    py.on("close", (code) => {
      if (code !== 0) return reject(new Error(error || `Python exit code ${code}`));
      resolve(result);
    });
  });
};