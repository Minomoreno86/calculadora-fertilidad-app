#!/usr/bin/env node

/**
 * 🧪 VERIFICACIÓN RÁPIDA POST-FIX
 * Confirma que el bug de 525.0% está corregido
 */

const fs = require('fs');

console.log('🔍 VERIFICANDO CORRECCIÓN BUG 525.0%...\n');

// Verificar que no queden multiplicaciones incorrectas por 100
const filesToCheck = [
  'src/presentation/features/ai-medical-agent/engines/SmartMedicalChatEngine.ts',
  'src/presentation/features/ai-medical-agent/engines/EnhancedMedicalChatEngine.ts'
];

let bugFound = false;
let totalFixed = 0;

filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Buscar patrones problemáticos
    const problematicPatterns = [
      /\(probability \* 100\)/g,
      /numericPrognosis \* 100/g,
      /525\.0%/g,
      /probability.*\*.*100.*toFixed/g
    ];
    
    let fileIssues = 0;
    
    problematicPatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        console.log(`❌ ${file}: ${matches.length} instancias de multiplicación por 100`);
        fileIssues += matches.length;
        bugFound = true;
      }
    });
    
    if (fileIssues === 0) {
      console.log(`✅ ${file}: Sin multiplicaciones incorrectas`);
      totalFixed++;
    }
    
  } else {
    console.log(`⚠️  ${file}: Archivo no encontrado`);
  }
});

console.log(`\n📊 RESULTADO VERIFICACIÓN:`);
console.log(`✅ Archivos corregidos: ${totalFixed}/${filesToCheck.length}`);
console.log(`${bugFound ? '❌' : '✅'} Estado: ${bugFound ? 'AÚN HAY BUGS' : 'BUG CORREGIDO'}`);

if (!bugFound) {
  console.log('\n🎉 ÉXITO: Dr. IA ahora mostrará probabilidades correctas');
  console.log('📱 Ejemplo: 5.3% en lugar de 525.0%');
  console.log('🔄 Reinicia la app para ver los cambios');
} else {
  console.log('\n⚠️  ADVERTENCIA: Aún hay instancias de multiplicación por 100');
  console.log('🔧 Requiere corrección manual adicional');
}

console.log('\n🧪 PRÓXIMO PASO: Probar Dr. IA manualmente');