// validate-imports.js
const fs = require('fs');
const path = require('path');

const directory = path.resolve(__dirname);
const fileExtensions = ['.ts', '.tsx'];

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.history')) {

      findFiles(filePath, fileList);
    } else if (fileExtensions.includes(path.extname(file))) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function checkImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /import .* from ['"](\.\.\/.*)['"]/g;
  let match;
  let errors = [];

  while ((match = regex.exec(content)) !== null) {
    errors.push({
      file: filePath,
      importPath: match[1],
    });
  }

  return errors;
}

function validateProjectImports() {
  const files = findFiles(directory);
  let allErrors = [];

  files.forEach((file) => {
    const errors = checkImports(file);
    if (errors.length > 0) {
      allErrors = allErrors.concat(errors);
    }
  });

  if (allErrors.length > 0) {
    console.log('⚠️  Se encontraron imports relativos incorrectos:');
    allErrors.forEach((error) => {
      console.log(`Archivo: ${error.file} -> Ruta incorrecta: ${error.importPath}`);
    });
  } else {
    console.log('✅ Todos los imports están usando paths absolutos correctamente.');
  }
}

validateProjectImports();
