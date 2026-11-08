// Pulls the <script> out of ../index.html into app.js so harness.js can run it.
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*)<\/script>/);
if(!m) { console.error('No <script> block found in index.html'); process.exit(1); }
fs.writeFileSync(path.join(__dirname, 'app.js'), m[1]);
console.log('Wrote tests/app.js');
