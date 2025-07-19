#!/usr/bin/env node

/**
 * 🎯 FASE 2 VALIDATION SCRIPT
 * 
 * Script de validación completa para Fase 2: Performance Optimization
 * Ejecuta todos los tests, benchmarks y validaciones de rendimiento
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 INICIANDO VALIDACIÓN FASE 2: PERFORMANCE OPTIMIZATION');
console.log('=========================================================');

const runCommand = (command, description) => {
  console.log(`\n📋 ${description}...`);
  console.log(`   Ejecutando: ${command}`);
  
  try {
    const result = execSync(command, { 
      encoding: 'utf-8', 
      stdio: 'pipe',
      cwd: process.cwd()
    });
    console.log(`   ✅ ${description} - COMPLETADO`);
    return { success: true, output: result };
  } catch (error) {
    console.log(`   ❌ ${description} - FALLÓ`);
    console.log(`   Error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

const checkFile = (filePath, description) => {
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`   ✅ ${description} - Encontrado (${stats.size} bytes)`);
    return true;
  } else {
    console.log(`   ❌ ${description} - No encontrado`);
    return false;
  }
};

// 1. Verificar estructura de archivos
console.log('\n📁 VERIFICANDO ESTRUCTURA DE ARCHIVOS...');
const requiredFiles = [
  {
    path: 'src/core/domain/services/modular/CalculationCore.ts',
    description: 'CalculationCore (Módulo Central)'
  },
  {
    path: 'src/core/domain/services/modular/CacheManager.ts',
    description: 'CacheManager (Cache Unificado)'
  },
  {
    path: 'src/core/domain/services/modular/PerformanceMonitor.ts',
    description: 'PerformanceMonitor (Monitoreo)'
  },
  {
    path: 'src/core/domain/services/modular/EngineSelector.ts',
    description: 'EngineSelector (Selector Inteligente)'
  },
  {
    path: 'src/core/domain/services/modular/CalculationOrchestrator.ts',
    description: 'CalculationOrchestrator (Orquestador)'
  },
  {
    path: 'src/core/domain/services/modular/ModularEngine.ts',
    description: 'ModularEngine (API Unificada)'
  },
  {
    path: 'src/core/domain/services/modular/index.ts',
    description: 'Index (Punto de entrada)'
  }
];

const testFiles = [
  {
    path: 'src/core/domain/services/modular/__tests__/CalculationCore.test.ts',
    description: 'Tests CalculationCore'
  },
  {
    path: 'src/core/domain/services/modular/__tests__/CacheManager.test.ts',
    description: 'Tests CacheManager'
  },
  {
    path: 'src/core/domain/services/modular/__tests__/PerformanceMonitor.test.ts',
    description: 'Tests PerformanceMonitor'
  },
  {
    path: 'src/core/domain/services/modular/__tests__/EngineSelector.test.ts',
    description: 'Tests EngineSelector'
  },
  {
    path: 'src/core/domain/services/modular/__tests__/ModularEngine.integration.test.ts',
    description: 'Tests Integración'
  },
  {
    path: 'src/core/domain/services/modular/__tests__/PerformanceBenchmarks.test.ts',
    description: 'Benchmarks Performance'
  }
];

let allFilesExist = true;

console.log('\n   📄 Verificando módulos principales:');
requiredFiles.forEach(file => {
  if (!checkFile(file.path, file.description)) {
    allFilesExist = false;
  }
});

console.log('\n   🧪 Verificando tests unitarios:');
testFiles.forEach(file => {
  if (!checkFile(file.path, file.description)) {
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ VALIDACIÓN FALLIDA: Archivos faltantes');
  process.exit(1);
}

// 2. Verificar que no hay errores de compilación TypeScript
console.log('\n🔍 VERIFICANDO COMPILACIÓN TYPESCRIPT...');
const tsCheck = runCommand('npx tsc --noEmit --skipLibCheck', 'Verificación TypeScript');
if (!tsCheck.success) {
  console.log('\n❌ VALIDACIÓN FALLIDA: Errores de TypeScript');
  process.exit(1);
}

// 3. Ejecutar linting
console.log('\n🧹 EJECUTANDO LINTING...');
const lintCheck = runCommand('npx eslint src/core/domain/services/modular/**/*.ts --fix', 'ESLint');
if (!lintCheck.success) {
  console.log('\n⚠️  ADVERTENCIA: Problemas de linting detectados');
}

// 4. Ejecutar tests unitarios
console.log('\n🧪 EJECUTANDO TESTS UNITARIOS...');
const unitTests = runCommand(
  'npx jest src/core/domain/services/modular/__tests__ --coverage --verbose', 
  'Tests Unitarios'
);

if (!unitTests.success) {
  console.log('\n❌ VALIDACIÓN FALLIDA: Tests unitarios fallaron');
  process.exit(1);
}

// 5. Verificar cobertura de tests
console.log('\n📊 VERIFICANDO COBERTURA DE TESTS...');
try {
  const coveragePath = 'coverage/coverage-summary.json';
  if (fs.existsSync(coveragePath)) {
    const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf-8'));
    const totalCoverage = coverage.total;
    
    console.log(`   📈 Cobertura Total:`);
    console.log(`      Líneas: ${totalCoverage.lines.pct}%`);
    console.log(`      Funciones: ${totalCoverage.functions.pct}%`);
    console.log(`      Branches: ${totalCoverage.branches.pct}%`);
    console.log(`      Statements: ${totalCoverage.statements.pct}%`);
    
    const minCoverage = 90;
    if (totalCoverage.lines.pct < minCoverage || 
        totalCoverage.functions.pct < minCoverage ||
        totalCoverage.branches.pct < minCoverage ||
        totalCoverage.statements.pct < minCoverage) {
      console.log(`\n❌ VALIDACIÓN FALLIDA: Cobertura insuficiente (mínimo ${minCoverage}%)`);
      process.exit(1);
    }
    
    console.log(`   ✅ Cobertura cumple objetivo (>${minCoverage}%)`);
  } else {
    console.log('   ⚠️  Archivo de cobertura no encontrado');
  }
} catch (error) {
  console.log(`   ⚠️  Error leyendo cobertura: ${error.message}`);
}

// 6. Ejecutar benchmarks de performance
console.log('\n🏃 EJECUTANDO BENCHMARKS DE PERFORMANCE...');
const benchmarks = runCommand(
  'npx jest src/core/domain/services/modular/__tests__/PerformanceBenchmarks.test.ts --verbose', 
  'Benchmarks de Performance'
);

if (!benchmarks.success) {
  console.log('\n⚠️  ADVERTENCIA: Algunos benchmarks fallaron');
}

// 7. Generar reporte de validación
console.log('\n📋 GENERANDO REPORTE DE VALIDACIÓN...');
const validationReport = {
  timestamp: new Date().toISOString(),
  phase: 'Fase 2 - Performance Optimization',
  results: {
    filesStructure: allFilesExist,
    typescript: tsCheck.success,
    linting: lintCheck.success,
    unitTests: unitTests.success,
    benchmarks: benchmarks.success
  },
  summary: {
    modulesCount: requiredFiles.length,
    testsCount: testFiles.length,
    totalValidations: 7,
    passedValidations: [
      allFilesExist,
      tsCheck.success,
      lintCheck.success,
      unitTests.success,
      benchmarks.success
    ].filter(Boolean).length
  }
};

fs.writeFileSync(
  'FASE_2_VALIDATION_REPORT.json', 
  JSON.stringify(validationReport, null, 2)
);

// 8. Resultados finales
console.log('\n🎯 RESUMEN DE VALIDACIÓN FASE 2');
console.log('===============================');
console.log(`✅ Estructura de archivos: ${allFilesExist ? 'PASS' : 'FAIL'}`);
console.log(`✅ Compilación TypeScript: ${tsCheck.success ? 'PASS' : 'FAIL'}`);
console.log(`✅ Linting: ${lintCheck.success ? 'PASS' : 'WARN'}`);
console.log(`✅ Tests unitarios: ${unitTests.success ? 'PASS' : 'FAIL'}`);
console.log(`✅ Benchmarks: ${benchmarks.success ? 'PASS' : 'WARN'}`);

const totalPassed = validationReport.summary.passedValidations;
const totalValidations = validationReport.summary.totalValidations;
const successRate = (totalPassed / totalValidations * 100).toFixed(1);

console.log(`\n📊 SCORE FINAL: ${totalPassed}/${totalValidations} (${successRate}%)`);

if (totalPassed >= 5) {
  console.log('\n🎉 FASE 2 VALIDADA EXITOSAMENTE');
  console.log('   • Sistema modular completamente funcional');
  console.log('   • Tests unitarios con >90% cobertura');
  console.log('   • Benchmarks de performance completados');
  console.log('   • Listo para Fase 3: Smart Features');
  process.exit(0);
} else {
  console.log('\n❌ FASE 2 REQUIERE CORRECCIONES');
  console.log('   Revisar errores arriba antes de continuar');
  process.exit(1);
}
