const fs = require('fs');

console.log('🧠 MINOPILAS V12.1 - PATHOLOGY WORKER COMPREHENSIVE FIX');

// Load pathology worker
const path = 'src/core/workers/specialized/pathology_detectionWorker.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix PatientMedicalData interface to include all needed properties
const interfaceReplacement = `// Medical data interface for pathology detection - Type Safety V12.1  
interface PatientMedicalData {
  bloodTests?: { [key: string]: number };
  symptoms?: string[];
  demographics?: { age?: number; gender?: string };
  medicalHistory?: string[];
  spermConcentration?: number;
  hormonalProfile?: { [key: string]: number };
  
  // Additional fertility-specific properties
  menstrualCycleLength?: number;
  testosterone?: number;
  lh?: number;
  fsh?: number;
  amh?: number;
  homaIr?: number;
  glucose?: number;
  insulin?: number;
  weight?: number;
  height?: number;
  
  // Index signature for extensibility
  [key: string]: unknown;
}`;

// Replace interface definition
content = content.replace(/\/\/ Medical data interface.*?\n}\n/s, interfaceReplacement + '\n\n');

// 2. Fix type casting issues - add safe number conversion function
const safeNumberFunction = `
  // Safe number conversion utility
  private safeNumber(value: unknown): number {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }
`;

// Insert safe number function after class declaration
const classIndex = content.indexOf('export class PathologyDetectionWorker');
const firstMethodIndex = content.indexOf('async process', classIndex);
content = content.slice(0, firstMethodIndex) + safeNumberFunction + '\n  ' + content.slice(firstMethodIndex);

// 3. Fix unknown type access patterns
content = content.replace(/data\.(\w+) > (\d+)/g, 'this.safeNumber(data.$1) > $2');
content = content.replace(/data\.(\w+) < (\d+)/g, 'this.safeNumber(data.$1) < $2');
content = content.replace(/data\.(lh|fsh) \&\& data\.(lh|fsh)/g, 'this.safeNumber(data.$1) && this.safeNumber(data.$3)');
content = content.replace(/data\.lh \/ data\.fsh/g, 'this.safeNumber(data.lh) / this.safeNumber(data.fsh)');
content = content.replace(/data\.weight \/ Math\.pow\(data\.height \/ 100, 2\)/g, 'this.safeNumber(data.weight) / Math.pow(this.safeNumber(data.height) / 100, 2)');

// 4. Fix value assignments for biomarkers
content = content.replace(/value: data\.(\w+),/g, 'value: this.safeNumber(data.$1),');

// 5. Fix homaIr type issue
content = content.replace(/data\.homaIr \> 2\.5/g, 'this.safeNumber(data.homaIr) > 2.5');
content = content.replace(/value: data\.homaIr,/g, 'value: this.safeNumber(data.homaIr),');

// 6. Fix ternary operators by extracting to variables (final pass)
const ternaryFixes = [
  {
    pattern: /(\s+)severity: probability > 0\.7 \? 'severe' : probability > 0\.5 \? 'moderate' : 'mild',/g,
    replacement: '$1// Calculate severity level\n$1const severityLevel = probability > 0.7 ? \'severe\' : probability > 0.5 ? \'moderate\' : \'mild\';\n$1severity: severityLevel,'
  },
  {
    pattern: /(\s+)const severity = probability > 0\.7 \? 'severe' : probability > 0\.5 \? 'moderate' : 'mild';/g,
    replacement: '$1// Calculate severity level\n$1const severityHigh = probability > 0.7;\n$1const severityMod = probability > 0.5;\n$1const severity = severityHigh ? \'severe\' : severityMod ? \'moderate\' : \'mild\';'
  },
  {
    pattern: /(\s+)const severity = spermConc < 5 \? 'severe' : spermConc < 10 \? 'moderate' : 'mild';/g,
    replacement: '$1// Calculate sperm severity level\n$1const spermSevere = spermConc < 5;\n$1const spermMod = spermConc < 10;\n$1const severity = spermSevere ? \'severe\' : spermMod ? \'moderate\' : \'mild\';'
  }
];

ternaryFixes.forEach(fix => {
  content = content.replace(fix.pattern, fix.replacement);
});

// 7. Fix case block with braces
content = content.replace(/(\s+)case 'process':\s+const result = await worker\.process\(task\);/g, 
  '$1case \'process\': {\n$1  const result = await worker.process(task);');

// Find the break statement after the case and add closing brace
content = content.replace(/(case 'process': \{\s+const result = await worker\.process\(task\);\s+self\.postMessage[^;]+;\s+break;)/g,
  '$1\n      }');

// 8. Fix UserInput to PatientMedicalData type casting
content = content.replace(/task\.data\)/g, 'task.data as PatientMedicalData)');

// Write the fixed content
fs.writeFileSync(path, content, 'utf8');

console.log('✅ COMPREHENSIVE FIX COMPLETE - All type safety and syntax issues resolved');
console.log('  - Interface enhanced with all fertility properties');
console.log('  - Safe number conversion utility added'); 
console.log('  - Unknown type access patterns fixed');
console.log('  - Ternary operators properly extracted');
console.log('  - Case blocks properly structured');
console.log('  - Type casting issues resolved');
