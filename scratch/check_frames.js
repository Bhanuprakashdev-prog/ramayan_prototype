const fs = require('fs');
const files = fs.readdirSync('assets/frame').filter(f => f.endsWith('.jpg'));
console.log('Total jpg frames:', files.length);
console.log('First 5:', files.slice(0, 5));
console.log('Last 5:', files.slice(-5));

const buf = fs.readFileSync('assets/frame/' + files[0]);
for (let i = 0; i < buf.length - 8; i++) {
  if (buf[i] === 0xFF && (buf[i+1] === 0xC0 || buf[i+1] === 0xC2)) {
    console.log('Frame 0 dimensions: Width =', buf.readUInt16BE(i+7), 'Height =', buf.readUInt16BE(i+5));
    break;
  }
}
