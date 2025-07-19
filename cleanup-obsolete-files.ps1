# 🧹 SCRIPT DE LIMPIEZA MASIVA - ARCHIVOS OBSOLETOS
# Basado en PLANNING.    "MIGRACION_OPTIMIZED_COMPLETADA.md",d y análisis de arquitectura

Write-Host "🧹 INICIANDO LIMPIEZA MASIVA DE ARCHIVOS OBSOLETOS..." -ForegroundColor Yellow
Write-Host "⚠️  RESPALDANDO ARCHIVOS CRÍTICOS ANTES DE ELIMINAR..." -ForegroundColor Red

# Verificar que estamos en el directorio correcto
if (!(Test-Path "package.json")) {
    Write-Host "❌ ERROR: Este script debe ejecutarse desde la raíz del proyecto" -ForegroundColor Red
    exit 1
}

# Crear directorio de respaldo
$backupDir = "BACKUP_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

# Lista de archivos obsoletos para eliminar
$obsoleteFiles = @(
    # Análisis temporales
    "ANALISIS_ARCHIVOS_VALIDACION.md",
    "ANALISIS_CALCULATIONENGINEPREMIUM_UTILIDAD.md",
    "ANALISIS_CLINICAL_CONTENT_LIBRARY_PREMIUM.md",
    "ANALISIS_FACTOR_EVALUATORS_COMPARATIVO.md",
    "ANALISIS_HOOKS_COMPLETO.md",
    "ANALISIS_INDEX_CORREGIDO_FINAL.md",
    "ANALISIS_MOTOR_PRINCIPAL_RESULTADOS.md",
    "ANALISIS_TREATMENT_SUGGESTERS.md",
    
    # Estados anteriores completados
    "ARMONIA_COMPLETA_LOGRADA.md",
    "BOTON-CONFUSO-ELIMINADO.md",
    "BOTON-UNIFICADO-COMPLETADO.md",
    "CALCULADORA_COMPLETA_CORREGIDA.md",
    "CALCULADORA_PREMIUM_ELIMINADA.md",
    "CALCULATORPERFORMANCEMONITOR-CORREGIDO.md",
    "COMPLETITUD-REAL-IMPLEMENTADA.md",
    
    # Migraciones y caches completados
    "CACHE_SYSTEM_MIGRATION_COMPLETED.md",
    "CACHE_UPGRADE_SUMMARY.md",
    "CONSOLIDACION_CLINICAL_CONTENT_LIBRARY_COMPLETADA.md",
    "CONSOLIDACION_MEDICA_COMPLETADA.md",
    "CONSOLIDACION_TREATMENT_SUGGESTER_COMPLETADA.md",
    
    # Correcciones completadas
    "CORRECCIONES_LOOP_INFINITO_FINAL.md",
    "CORRECCIONES_TYPESCRIPT_COMPLETADAS.md",
    "CORRECCIONES-PARALLEL-VALIDATION-ENGINE.md",
    "DEMOGRAPHICSFORM_CONSOLIDADO.md",
    "DUAL_ENGINE_INTELIGENTE_IMPLEMENTADO.md",
    "ERRORES-CORREGIDOS-FACTOR-EVALUATORS.md",
    
    # Fases completadas
    "FASE_2_COMPLETADA.md",
    "FASE_2_PARALELA_COMPLETADA.md",
    "FASE_2A_LOOP_INFINITO_CORREGIDO.md",
    "FASE_2A_PERFORMANCE_COMPLETADA.md",
    "FASE_2B_INTEGRACION_COMPLETADA.md",
    "FASE_3B_PREDICCION_IA_IMPLEMENTADO.md",
    "FASE_4A_OPTIMIZACION_AVANZADA_COMPLETADA.md",
    
    # Formularios consolidados
    "FORMULARIOS_CONSOLIDADOS.md",
    "HOOKS_REDUNDANTES_ELIMINADOS.md",
    "ICONOS_MODERNOS_COMPLETADO.md",
    "IMPLEMENTATION-SUMMARY.md",
    "INTERFAZ-CONSOLIDADA.md",
    "LAZYCOMPONENT_CORRECCIONES_COMPLETADAS.md",
    "LOOP_INFINITO_CORREGIDO.md",
    
    # Mejoras implementadas
    "MEJORAS-UX-IMPLEMENTADAS.md",
    "MEJORA_INCREMENTAL_FACTOR_EVALUATORS_COMPLETADA.md",
    "MIGRACION_USECALCULATORFORM_COMPLETADA.md",
    "MIGRACIÓN_OPTIMIZED_COMPLETADA.md",
    "MONITOR-PERFORMANCE-IMPLEMENTADO.md",
    "MOTOR_PARALELO_ACTIVADO_COMPLETAMENTE.md",
    "MOTOR_PARALELO_ACTIVO_COMPLETADO.md",
    "MOTOR_PRINCIPAL_OPTIMIZADO_COMPLETADO.md",
    
    # Validaciones completadas
    "PARALLEL_VALIDATION_CLEANUP_COMPLETED.md",
    "PERFORMANCE_MONITORS_CONSOLIDADOS.md",
    "PERSONALIZACION_VISUAL_COMPLETADA.md",
    "PLAN_ENHANCEDPROGRESS_IMPLEMENTADO.md",
    "PREDICTIVE_ENGINE_OPTIMIZADO.md",
    "PRODUCTION_PROFILING_COMPLETADO.md",
    "PRP_FASE_3_COMPLETADA_ARMONIZADA.md",
    "PRP_LIMPIEZA_TESTS_PLAN.md",
    "PRP_MOTOR_MODULAR_RESTAURACION.md",
    
    # Pruebas y validaciones
    "PRUEBA_VALIDACION_PARALELA.md",
    "REPORTE_FINAL_ESTADO_APLICACION.md",
    "ROADMAP_OPTIMIZACIONES_COMPLETO.md",
    "SIMPLE_FILES_CLEANUP_COMPLETED.md",
    "SOLUCION_TRABADO_TECLADO_COMPLETADA.md",
    "TEMA_FERTILIDAD_REFINADO_IMPLEMENTADO.md",
    "TEST-CALCULADORA-FLEXIBLE.md",
    "THEME_MEDICO_IMPLEMENTADO.md",
    "USECOMPONENTPERFORMANCE_ANALISIS_Y_CORRECCIONES.md",
    "USERANGEVALIDATION_LOOP_CORREGIDO.md",
    "UX_IMPROVEMENTS.md",
    "VALIDACION_INTELIGENTE_LOOP_CORREGIDO.md",
    "VALIDATIONSTREAMINGENGINE_CORREGIDO.md",
    "VALIDATIONWORKER_CORREGIDO.md",
    "VARIABLES_FERTILIDAD_COMPLETAS.md",
    "WATCH_REACT_HOOK_FORM_LOOP_CORREGIDO.md",
    
    # Diagnósticos temporales
    "DIAGNÓSTICO_VALIDACIÓN_PARALELA_INACTIVA.md",
    "ESTADO-ACTUAL-Y-PENDIENTES.md",
    
    # Archivos de configuración temporal
    "CONFIGURACION_FINAL.ts",
    "GUIA_ARCHIVOS.ts",
    "INSTRUCCIONES_ACTIVAR_COLORES.ts",
    
    # Scripts de prueba temporales
    "test-cache-upgrade.sh",
    "test-complete-flow.js",
    "test_bmi.js",
    "test_motor_paralelo_activo.js",
    "test_motor_unificado_rapido.js",
    "test_parallel_engine_active.js",
    "test_parallel_integration.js",
    "test_parallel_integration_simple.js",
    "test_parallel_validation_fixed.js",
    "test_validation.js",
    "test_validation_worker.js",
    "validate-imports.js",
    "validate-phase2.js",
    "validate_unified_engine.js",
    "verify-migration.js",
    "fix-errors-script.ps1",
    "estructura.txt"
)

# Archivos duplicados/backup
$backupFiles = @(
    "src\presentation\features\calculator\useCalculatorForm_BACKUP.ts",
    "src\presentation\features\calculator\useCalculatorForm_FIXED.ts",
    "src\presentation\components\features\validation\IntelligentValidationIntegrator_clean.tsx",
    "src\presentation\components\features\validation\SimpleValidationIntegratorFixed.tsx",
    "src\presentation\features\calculator\components\DemographicsFormFixed.tsx",
    "temp_integrator_fix.tsx"
)

Write-Host "📋 LISTA DE ARCHIVOS A ELIMINAR:" -ForegroundColor Cyan
Write-Host "   - $($obsoleteFiles.Count) archivos de documentación obsoleta" -ForegroundColor White
Write-Host "   - $($backupFiles.Count) archivos backup/duplicados" -ForegroundColor White

# Respaldar archivos críticos antes de eliminar
$criticalFiles = @("PLANNING.md", "TASK.md", "package.json", "README.md")
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Copy-Item $file "$backupDir\$file"
        Write-Host "✅ Respaldado: $file" -ForegroundColor Green
    }
}

# Eliminar archivos obsoletos
$deletedCount = 0
foreach ($file in $obsoleteFiles) {
    if (Test-Path $file) {
        # Respaldar antes de eliminar
        Copy-Item $file "$backupDir\$file" -ErrorAction SilentlyContinue
        Remove-Item $file -Force
        Write-Host "🗑️  Eliminado: $file" -ForegroundColor Yellow
        $deletedCount++
    }
}

# Eliminar archivos backup/duplicados
foreach ($file in $backupFiles) {
    if (Test-Path $file) {
        # Respaldar antes de eliminar
        $backupPath = "$backupDir\$($file.Replace('\', '_'))"
        Copy-Item $file $backupPath -ErrorAction SilentlyContinue
        Remove-Item $file -Force
        Write-Host "🗑️  Eliminado duplicado: $file" -ForegroundColor Yellow
        $deletedCount++
    }
}

Write-Host "`n🎉 LIMPIEZA COMPLETADA!" -ForegroundColor Green
Write-Host "   - $deletedCount archivos eliminados" -ForegroundColor White
Write-Host "   - Respaldo creado en: $backupDir" -ForegroundColor White
Write-Host "   - Espacio liberado: Calculando..." -ForegroundColor White

# Calcular espacio liberado
$backupSize = (Get-ChildItem $backupDir -Recurse | Measure-Object -Property Length -Sum).Sum
$sizeInMB = [math]::Round($backupSize / 1MB, 2)
Write-Host "   - Espacio liberado: $sizeInMB MB" -ForegroundColor Green

Write-Host "`n🔄 PRÓXIMOS PASOS SUGERIDOS:" -ForegroundColor Cyan
Write-Host "1. Ejecutar: npm run typecheck" -ForegroundColor White
Write-Host "2. Ejecutar: npm run lint" -ForegroundColor White
Write-Host "3. Verificar compilación: npm run build" -ForegroundColor White
Write-Host "4. Ejecutar tests: npm test" -ForegroundColor White
