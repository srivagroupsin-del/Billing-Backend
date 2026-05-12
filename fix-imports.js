const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir(path.join(__dirname, 'src'), (filePath) => {
  if (filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix self import in response.ts
    if (filePath.endsWith('response.ts')) {
       content = content.replace(/import \{ successResponse \} from "\.\/\/response";\n?/g, '');
    }

    let lines = content.split('\n');
    let seenImports = new Set();
    let newLines = [];
    
    for (let i = 0; i < lines.length; i++) {
       let line = lines[i];
       if (line.startsWith('import ')) {
           if (seenImports.has(line.trim())) {
               // skip duplicate
               continue;
           }
           seenImports.add(line.trim());
       }
       newLines.push(line);
    }
    
    let newContent = newLines.join('\n');
    if (newContent !== content) {
       fs.writeFileSync(filePath, newContent, 'utf8');
       console.log('Fixed imports in', filePath);
    }
  }
});
