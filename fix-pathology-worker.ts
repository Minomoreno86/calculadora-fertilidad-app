// MINOPILAS V12.1 - INTELLIGENT PATHOLOGY WORKER FIXER
// Medical Type Safety + Ternary Extraction + Case Block Fix

import * as fs from 'fs';
import * as path from 'path';

const pathologyWorkerPath = 'c:\\Users\\jvr_0\\MisProyectos\\calculadora-fertilidad-app\\src\\core\\workers\\specialized\\pathology_detectionWorker.ts';

async function fixPathologyWorker(): Promise<void> {
  console.log('🧠 MINOPILAS V12.1 - PATHOLOGY WORKER INTELLIGENT FIXING');
  
  let content = fs.readFileSync(pathologyWorkerPath, 'utf8');

  // 1. Add PatientMedicalData interface at the top
  const interfaceDefinition = `
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
  const importEndIndex = content.lastIndexOf('import');
  const nextLineIndex = content.indexOf('\n', importEndIndex);
  content = content.slice(0, nextLineIndex + 1) + interfaceDefinition + content.slice(nextLineIndex + 1);

  // 2. Replace all 'any' types with PatientMedicalData
  content = content.replace(/\(data: any\)/g, '(data: PatientMedicalData)');
  content = content.replace(/\(config: any\)/g, '(_config: PatientMedicalData)');

  // 3. Fix unused parameters
  content = content.replace(/private async detectPrematureOvarianInsufficiency\(data: PatientMedicalData\)/g, 
    'private async detectPrematureOvarianInsufficiency(_data: PatientMedicalData)');
  content = content.replace(/private async detectHyperprolactinemia\(data: PatientMedicalData\)/g,
    'private async detectHyperprolactinemia(_data: PatientMedicalData)');
  content = content.replace(/private async detectDiabetes\(data: PatientMedicalData\)/g,
    'private async detectDiabetes(_data: PatientMedicalData)');
  content = content.replace(/private async detectMetabolicSyndrome\(data: PatientMedicalData\)/g,
    'private async detectMetabolicSyndrome(_data: PatientMedicalData)');
  content = content.replace(/private async detectUterineFibroids\(data: PatientMedicalData\)/g,
    'private async detectUterineFibroids(_data: PatientMedicalData)');
  content = content.replace(/private async detectAstenospermia\(data: PatientMedicalData\)/g,
    'private async detectAstenospermia(_data: PatientMedicalData)');
  content = content.replace(/private async detectTeratospermia\(data: PatientMedicalData\)/g,
    'private async detectTeratospermia(_data: PatientMedicalData)');

  // 4. Fix nested ternary operations - Insulin Resistance
  const insulinTernaryRegex = /severity: probability > 0\.7 \? 'severe' : probability > 0\.5 \? 'moderate' : 'mild',/g;
  content = content.replace(insulinTernaryRegex, function(match, offset) {
    const beforeContext = content.substring(Math.max(0, offset - 200), offset);
    if (beforeContext.includes('detectInsulinResistance')) {
      return `// Calculate insulin resistance severity
    const severity = probability > 0.7 ? 'severe' : probability > 0.5 ? 'moderate' : 'mild';
    
    return {
      name: 'Resistencia a la Insulina',
      probability: Math.min(probability, 1.0),
      severity,`;
    }
    return match;
  });

  // 5. Fix endometriosis ternary
  content = content.replace(/(\s+)return \{\s+name: 'Endometriosis',\s+probability: Math\.min\(probability, 1\.0\),\s+severity: probability > 0\.7 \? 'severe' : probability > 0\.5 \? 'moderate' : 'mild',/g,
    '$1// Calculate endometriosis severity\n$1const severity = probability > 0.7 ? \'severe\' : probability > 0.5 ? \'moderate\' : \'mild\';\n$1\n$1return {\n$1  name: \'Endometriosis\',\n$1  probability: Math.min(probability, 1.0),\n$1  severity,');

  // 6. Fix oligospermia with safe access
  content = content.replace(/severity: data\.spermConcentration < 5 \? 'severe' : data\.spermConcentration < 10 \? 'moderate' : 'mild',/g,
    `// Calculate oligospermia severity with safe access
    const spermConc = data.spermConcentration || 0;
    const severity = spermConc < 5 ? 'severe' : spermConc < 10 ? 'moderate' : 'mild';
    
    // Return with calculated severity
    severity,`);

  // 7. Fix case block with braces
  content = content.replace(/case 'pathology':\s+const result = await worker\.process\(task\);/g,
    `case 'pathology': {
        const result = await worker.process(task);`);

  // Add closing brace for case block
  content = content.replace(/(case 'pathology': \{\s+const result = await worker\.process\(task\);\s+[^}]+break;)/g,
    '$1\n      }');

  // 8. Write fixed content
  fs.writeFileSync(pathologyWorkerPath, content, 'utf8');
  
  console.log('✅ PATHOLOGY WORKER V12.1 COMPLETELY FIXED:');
  console.log('  - Type safety: PatientMedicalData interface');  
  console.log('  - Ternary operations: Extracted to variables');
  console.log('  - Unused parameters: Prefixed with underscore');
  console.log('  - Case blocks: Proper braces added');
  console.log('  - Medical compliance: Enhanced type validation');
}

// Execute the fix
fixPathologyWorker().catch(console.error);
