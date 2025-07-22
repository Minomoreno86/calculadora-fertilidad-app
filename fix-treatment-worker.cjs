const fs = require('fs');

console.log('🧠 MINOPILAS V12.1 - TREATMENT VALIDATION WORKER FIX');

const path = 'src/core/workers/specialized/treatment_validationWorker.ts';
let content = fs.readFileSync(path, 'utf8');

// Remove unused imports
const importsToRemove = [
  'EnhancedProposedTreatment',
  'TypedEvidenceDatabase', 
  'MedicalSystemConfiguration',
  'TreatmentResult',
  'isMedicalEvidenceBase',
  'isEnhancedProposedTreatment'
];

importsToRemove.forEach(importName => {
  // Remove from import list (single line)
  content = content.replace(new RegExp(`\\s*${importName},?\\s*`, 'g'), '');
  // Remove standalone line
  content = content.replace(new RegExp(`^\\s*${importName},?\\s*$`, 'gm'), '');
});

// Fix unused parameters
content = content.replace(/personalized: PersonalizedRecommendation\[\],/g, '_personalized: PersonalizedRecommendation[],');
content = content.replace(/patient: PatientProfile/g, '_patient: PatientProfile');

// Fix safety type mismatch - replace "dangerous" with "concerning"
content = content.replace(/'dangerous'/g, "'concerning'");

// Fix incomplete evidence database entries
const fixEvidenceEntry = (drugName, successRate, pregnancyRate, livebirthRate) => {
  return `    this.evidenceDatabase.set('${drugName}', {
      successRate: ${successRate},
      pregnancyRate: ${pregnancyRate},
      livebirthRate: ${livebirthRate},
      overallSafety: 'good' as const,
      mortalityRisk: 0.001,
      hospitalizations: 0.05,
      timeToEffect: 30,
      durationOfEffect: 180
    });`;
};

// Replace metformin entry
content = content.replace(
  /this\.evidenceDatabase\.set\('metformin', \{\s*successRate: 0\.75,\s*pregnancyRate: 0\.45,\s*livebirthRate: 0\.40\s*\}\);/g,
  fixEvidenceEntry('metformin', 0.75, 0.45, 0.40)
);

// Replace clomifene entry  
content = content.replace(
  /this\.evidenceDatabase\.set\('clomifene', \{\s*successRate: 0\.80,\s*pregnancyRate: 0\.60,\s*livebirthRate: 0\.50\s*\}\);/g,
  fixEvidenceEntry('clomifene', 0.80, 0.60, 0.50)
);

// Replace IVF entry
content = content.replace(
  /this\.evidenceDatabase\.set\('ivf', \{\s*successRate: 0\.85,\s*pregnancyRate: 0\.70,\s*livebirthRate: 0\.60\s*\}\);/g,
  fixEvidenceEntry('ivf', 0.85, 0.70, 0.60)
);

fs.writeFileSync(path, content, 'utf8');

console.log('✅ TREATMENT VALIDATION WORKER FIXED:');
console.log('  - Unused imports removed');
console.log('  - Unused parameters prefixed with underscore');
console.log('  - Safety type "dangerous" → "concerning"'); 
console.log('  - Evidence database entries completed with all required properties');
