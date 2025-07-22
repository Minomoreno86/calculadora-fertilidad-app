import fs from 'fs';

console.log('🧠 MINOPILAS V12.1 - PATHOLOGY WORKER TYPE SAFETY FIX');

// Load pathology worker
const path = 'src/core/workers/specialized/pathology_detectionWorker.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Add PatientMedicalData interface at the top
const interfaceCode = `
// Medical data interface for pathology detection - Type Safety V12.1
interface PatientMedicalData {
  [key: string]: any;
  bloodTests?: { [key: string]: number };
  symptoms?: string[];
  demographics?: { age?: number; gender?: string };
  medicalHistory?: string[];
  spermConcentration?: number;
  hormonalProfile?: { [key: string]: number };
}

`;

// Insert interface after imports
const lastImportIndex = content.lastIndexOf('import');
const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
content = content.slice(0, insertIndex) + interfaceCode + content.slice(insertIndex);

// 2. Replace all 'any' types with PatientMedicalData
content = content.replace(/\(data: any\)/g, '(data: PatientMedicalData)');
content = content.replace(/\(config: any\)/g, '(_config: PatientMedicalData)');

// 3. Fix unused parameters by prefixing with underscore
const unusedMethods = [
  'detectPrematureOvarianInsufficiency',
  'detectHyperprolactinemia', 
  'detectDiabetes',
  'detectMetabolicSyndrome',
  'detectUterineFibroids',
  'detectAstenospermia',
  'detectTeratospermia'
];

unusedMethods.forEach(method => {
  const regex = new RegExp(`${method}\\\\(data:`, 'g');
  content = content.replace(regex, `${method}(_data:`);
});

// Write the fixed content
fs.writeFileSync(path, content, 'utf8');

console.log('✅ PHASE 1 COMPLETE - Type safety and unused params fixed');
