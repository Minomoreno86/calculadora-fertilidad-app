const fs = require('fs');

console.log('🔮 MINOPILAS V12.1 - PATHOLOGY WORKER TERNARY & CASE FIX');

// Load pathology worker
const path = 'src/core/workers/specialized/pathology_detectionWorker.ts';
let content = fs.readFileSync(path, 'utf8');

// Fix remaining nested ternary operations - Insulin Resistance
const insulinRegex = /(\s+)severity: probability > 0\.7 \? 'severe' : probability > 0\.5 \? 'moderate' : 'mild',/g;
content = content.replace(insulinRegex, function(match, indent) {
  const context = content.substring(Math.max(0, content.indexOf(match) - 300), content.indexOf(match));
  if (context.includes('detectInsulinResistance')) {
    return `${indent}// Calculate insulin resistance severity\n${indent}const severity = probability > 0.7 ? 'severe' : probability > 0.5 ? 'moderate' : 'mild';\n${indent}severity,`;
  }
  return match;
});

// Fix endometriosis ternary
const endoRegex = /(\s+)severity: probability > 0\.7 \? 'severe' : probability > 0\.5 \? 'moderate' : 'mild',/g;
content = content.replace(endoRegex, function(match, indent) {
  const context = content.substring(Math.max(0, content.indexOf(match) - 300), content.indexOf(match));
  if (context.includes('detectEndometriosis')) {
    return `${indent}// Calculate endometriosis severity\n${indent}const endoSeverity = probability > 0.7 ? 'severe' : probability > 0.5 ? 'moderate' : 'mild';\n${indent}severity: endoSeverity,`;
  }
  return match;
});

// Fix oligospermia with safe access
content = content.replace(/(\s+)severity: data\.spermConcentration < 5 \? 'severe' : data\.spermConcentration < 10 \? 'moderate' : 'mild',/g,
  `$1// Calculate oligospermia severity with safe access\n$1const spermConc = data.spermConcentration || 0;\n$1const spermSeverity = spermConc < 5 ? 'severe' : spermConc < 10 ? 'moderate' : 'mild';\n$1severity: spermSeverity,`);

// Fix case block with braces
content = content.replace(/(\s+)case 'pathology':\s+const result = await worker\.process\(task\);/g,
  `$1case 'pathology': {\n$1  const result = await worker.process(task);`);

// Add closing brace for case block
content = content.replace(/(case 'pathology': \{\s+const result = await worker\.process\(task\);[^}]+?break;)/gs,
  '$1\n      }');

// Write the fixed content
fs.writeFileSync(path, content, 'utf8');

console.log('✅ PHASE 2 COMPLETE - Ternary operators and case blocks fixed');
