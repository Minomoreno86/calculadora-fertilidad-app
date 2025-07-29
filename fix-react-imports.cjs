#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

console.log('🌌 QUANTUM CONSCIOUSNESS REACT IMPORTS FIXER V14.0');

async function fixReactImports() {
  // Encontrar todos los archivos TSX/TS
  const files = await glob('src/**/*.{ts,tsx}', { cwd: process.cwd() });
  
  let fixedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(process.cwd(), file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Patrón para React imports que necesitan corrección
    const badImportPattern = /import React, \{ ([^}]+) \} from ['"]react['"];/;
    const destructureOnlyPattern = /import \{ ([^}]+) \} from ['"]react['"];/;
    
    let newContent = content;
    let changed = false;
    
    // Caso 1: import React, { hooks } from 'react';
    if (badImportPattern.test(content)) {
      newContent = newContent.replace(badImportPattern, (match, hooks) => {
        changed = true;
        return `import React from 'react';\nimport { ${hooks} } from 'react';`;
      });
    }
    
    // Caso 2: import { hooks } from 'react';
    else if (destructureOnlyPattern.test(content) && content.includes('React.')) {
      newContent = `import React from 'react';\n${newContent}`;
      changed = true;
    }
    
    // Caso 3: Solo destructuring sin React namespace
    else if (destructureOnlyPattern.test(content) && !content.includes('import React from')) {
      newContent = newContent.replace(destructureOnlyPattern, (match, hooks) => {
        changed = true;
        return `import React, { ${hooks} } from 'react';`;
      });
    }
    
    if (changed) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Fixed: ${file}`);
      fixedCount++;
    }
  }
  
  console.log(`🎯 Fixed ${fixedCount} React import files`);
}

// Función para arreglar string literals en estilos
async function fixStyleLiterals() {
  const files = await glob('src/**/*.{ts,tsx}', { cwd: process.cwd() });
  
  let fixedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(process.cwd(), file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    let newContent = content;
    let changed = false;
    
    // Fix textAlign
    const textAlignFixes = [
      [/textAlign:\s*['"]center['"]/, "textAlign: 'center' as const"],
      [/textAlign:\s*['"]left['"]/, "textAlign: 'left' as const"],
      [/textAlign:\s*['"]right['"]/, "textAlign: 'right' as const"],
      [/textAlign:\s*['"]justify['"]/, "textAlign: 'justify' as const"],
      [/textAlign:\s*'([^']*)'(?!\s*as\s+const)/, "textAlign: '$1' as const"]
    ];
    
    // Fix fontWeight
    const fontWeightFixes = [
      [/fontWeight:\s*['"]bold['"]/, "fontWeight: 'bold' as const"],
      [/fontWeight:\s*['"]normal['"]/, "fontWeight: 'normal' as const"],
      [/fontWeight:\s*['"](\d{3})['"]/, "fontWeight: '$1' as const"],
      [/fontWeight:\s*'([^']*)'(?!\s*as\s+const)/, "fontWeight: '$1' as const"]
    ];
    
    // Fix fontStyle
    const fontStyleFixes = [
      [/fontStyle:\s*['"]italic['"]/, "fontStyle: 'italic' as const"],
      [/fontStyle:\s*['"]normal['"]/, "fontStyle: 'normal' as const"],
      [/fontStyle:\s*'([^']*)'(?!\s*as\s+const)/, "fontStyle: '$1' as const"]
    ];
    
    // Apply all fixes
    const allFixes = [...textAlignFixes, ...fontWeightFixes, ...fontStyleFixes];
    
    for (const [pattern, replacement] of allFixes) {
      if (pattern.test(newContent)) {
        newContent = newContent.replace(pattern, replacement);
        changed = true;
      }
    }
    
    if (changed) {
      fs.writeFileSync(filePath, newContent);
      console.log(`🎨 Fixed styles: ${file}`);
      fixedCount++;
    }
  }
  
  console.log(`🎯 Fixed ${fixedCount} style files`);
}

async function main() {
  try {
    await fixReactImports();
    await fixStyleLiterals();
    console.log('🌌 QUANTUM CONSCIOUSNESS FIXES COMPLETE ✅');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
