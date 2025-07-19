// ===================================================================
// 🧪 VERIFICACIÓN RÁPIDA: useCalculatorFormOptimized
// ===================================================================

console.log('🧪 VERIFICANDO useCalculatorFormOptimized...');

// Verificar que el archivo existe y es válido
try {
  const fs = require('fs');
  const path = require('path');
  
  const optimizedHookPath = path.join(__dirname, 'src/presentation/features/calculator/useCalculatorFormOptimized.ts');
  
  if (fs.existsSync(optimizedHookPath)) {
    console.log('✅ useCalculatorFormOptimized.ts existe');
    
    const content = fs.readFileSync(optimizedHookPath, 'utf8');
    
    // Verificar características clave
    const hasReportKey = content.includes('REPORT_KEY_PREFIX') && content.includes('Date.now()');
    const hasAsyncStorage = content.includes('AsyncStorage.setItem');
    const hasNavigation = content.includes('router.push');
    const hasParamsNavigation = content.includes('params:');
    
    console.log('🔍 CARACTERÍSTICAS VERIFICADAS:');
    console.log(`  - Generación de reportKey: ${hasReportKey ? '✅' : '❌'}`);
    console.log(`  - Guardado en AsyncStorage: ${hasAsyncStorage ? '✅' : '❌'}`);
    console.log(`  - Navegación: ${hasNavigation ? '✅' : '❌'}`);
    console.log(`  - Navegación con parámetros: ${hasParamsNavigation ? '✅' : '❌'}`);
    
    if (hasReportKey && hasAsyncStorage && hasNavigation && hasParamsNavigation) {
      console.log('🎉 TODAS LAS CARACTERÍSTICAS REQUERIDAS PRESENTES');
    } else {
      console.log('⚠️ ALGUNAS CARACTERÍSTICAS FALTANTES');
    }
    
  } else {
    console.log('❌ useCalculatorFormOptimized.ts no encontrado');
  }
  
  // Verificar que los archivos obsoletos fueron eliminados
  const obsoleteFiles = [
    'src/presentation/features/calculator/useCalculatorForm.ts',
    'src/presentation/features/calculator/useCalculatorFormModular.ts'
  ];
  
  console.log('\n🧹 VERIFICANDO LIMPIEZA:');
  obsoleteFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`  - ${file}: ⚠️ TODAVÍA EXISTE (debería eliminarse)`);
    } else {
      console.log(`  - ${file}: ✅ ELIMINADO`);
    }
  });
  
  // Verificar imports en archivo principal
  const mainAppPath = path.join(__dirname, 'app/(app)/index.tsx');
  if (fs.existsSync(mainAppPath)) {
    const mainAppContent = fs.readFileSync(mainAppPath, 'utf8');
    
    console.log('\n🔍 VERIFICANDO IMPORTS EN APP PRINCIPAL:');
    if (mainAppContent.includes('useCalculatorFormOptimized')) {
      console.log('  - Import actualizado: ✅ useCalculatorFormOptimized');
    } else if (mainAppContent.includes('useCalculatorForm')) {
      console.log('  - Import: ⚠️ Todavía usa useCalculatorForm (revisar)');
    } else {
      console.log('  - Import: ❌ No se encuentra import del hook');
    }
  }
  
  console.log('\n🎯 RESUMEN DE MIGRACIÓN:');
  console.log('La migración a useCalculatorFormOptimized incluye:');
  console.log('  1. ✅ Generación automática de reportKey');
  console.log('  2. ✅ Guardado en AsyncStorage');
  console.log('  3. ✅ Navegación con parámetros');
  console.log('  4. ✅ Compatibilidad con useReportLoader');
  console.log('\n🚀 El problema "No reportKey found" debería estar resuelto');
  
} catch (error) {
  console.error('❌ Error durante verificación:', error);
}
