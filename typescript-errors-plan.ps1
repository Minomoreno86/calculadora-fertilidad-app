# 🛠️ PLAN DE CORRECCIÓN DE ERRORES TYPESCRIPT
# Basado en análisis de 172 errores detectados

Write-Host "🛠️ PLAN DE CORRECCIÓN DE ERRORES TYPESCRIPT" -ForegroundColor Yellow
Write-Host "📊 172 errores detectados - Priorizando correcciones" -ForegroundColor Cyan

# === PRIORIDAD 1: TIPOS DE FORMULARIO ===
Write-Host "`n🎯 PRIORIDAD 1: TIPOS DE FORMULARIO" -ForegroundColor Green

$formularioErrors = @(
    "FormState vs tipos generados automáticamente",
    "Propiedades opcionales vs requeridas",
    "Incompatibilidades en useWatch",
    "Tipos no compatibles en validaciones"
)

foreach ($error in $formularioErrors) {
    Write-Host "   - $error" -ForegroundColor Yellow
}

Write-Host "`n📋 ARCHIVOS A CORREGIR:" -ForegroundColor Cyan
Write-Host "   1. src/presentation/features/calculator/types/calculator.types.ts" -ForegroundColor White
Write-Host "   2. src/presentation/features/calculator/useCalculatorForm.ts" -ForegroundColor White
Write-Host "   3. src/presentation/features/calculator/hooks/useStableWatchedFields.ts" -ForegroundColor White
Write-Host "   4. src/presentation/features/calculator/hooks/useStableFormValidation.ts" -ForegroundColor White

# === PRIORIDAD 2: HOOKS ESPECIALIZADOS ===
Write-Host "`n🎯 PRIORIDAD 2: HOOKS ESPECIALIZADOS" -ForegroundColor Green

$hooksErrors = @(
    "useParallelValidation.ts - 4 errores",
    "useFormState.ts - 2 errores",
    "useStableFormValidation.ts - 2 errores",
    "useStableWatchedFields.ts - 3 errores"
)

foreach ($error in $hooksErrors) {
    Write-Host "   - $error" -ForegroundColor Yellow
}

# === PRIORIDAD 3: COMPONENTES UI ===
Write-Host "`n🎯 PRIORIDAD 3: COMPONENTES UI" -ForegroundColor Green

$componentErrors = @(
    "EnhancedCalculatorScreen.tsx - 11 errores",
    "PerformanceMonitorAdvanced.tsx - 4 errores",
    "PredictiveInsights.tsx - 3 errores",
    "EnhancedTextInput.tsx - 1 error"
)

foreach ($error in $componentErrors) {
    Write-Host "   - $error" -ForegroundColor Yellow
}

# === PRIORIDAD 4: MÓDULOS EXTERNOS ===
Write-Host "`n🎯 PRIORIDAD 4: MÓDULOS EXTERNOS (OPCIONAL)" -ForegroundColor Green

$externalErrors = @(
    "context-ai/ - 46 errores",
    "presentation/ - 19 errores", 
    "autoinmune/ - 4 errores",
    "sistemapsicologico/ - 1 error"
)

foreach ($error in $externalErrors) {
    Write-Host "   - $error" -ForegroundColor Yellow
}

# === ESTRATEGIA DE CORRECCIÓN ===
Write-Host "`n🔧 ESTRATEGIA DE CORRECCIÓN:" -ForegroundColor Cyan

Write-Host "📝 FASE 1: TIPOS BASE (30 min)" -ForegroundColor White
Write-Host "   - Unificar FormState con tipos generados"
Write-Host "   - Corregir propiedades opcionales"
Write-Host "   - Actualizar interfaces de validación"

Write-Host "📝 FASE 2: HOOKS CORE (45 min)" -ForegroundColor White
Write-Host "   - Corregir tipos en useCalculatorForm"
Write-Host "   - Armonizar hooks especializados"
Write-Host "   - Verificar compatibilidad APIs"

Write-Host "📝 FASE 3: COMPONENTES (30 min)" -ForegroundColor White
Write-Host "   - Corregir EnhancedCalculatorScreen"
Write-Host "   - Armonizar componentes de performance"
Write-Host "   - Validar componentes de UI"

Write-Host "📝 FASE 4: VERIFICACIÓN (15 min)" -ForegroundColor White
Write-Host "   - npm run typecheck"
Write-Host "   - npm run lint"
Write-Host "   - Verificar funcionamiento"

# === ESTIMACIÓN DE TIEMPO ===
Write-Host "`n⏱️ ESTIMACIÓN DE TIEMPO:" -ForegroundColor Green
Write-Host "   - Errores Core (Prioridad 1-2): 1.5 horas" -ForegroundColor Yellow
Write-Host "   - Errores UI (Prioridad 3): 30 minutos" -ForegroundColor Yellow
Write-Host "   - Módulos Externos (Opcional): 2 horas" -ForegroundColor Yellow
Write-Host "   - Total: 2-4 horas dependiendo del alcance" -ForegroundColor Green

# === PRÓXIMOS PASOS ===
Write-Host "`n🚀 PRÓXIMOS PASOS INMEDIATOS:" -ForegroundColor Cyan
Write-Host "1. Corregir tipos de FormState" -ForegroundColor White
Write-Host "2. Unificar interfaces de validación" -ForegroundColor White
Write-Host "3. Actualizar hooks especializados" -ForegroundColor White
Write-Host "4. Verificar compilación" -ForegroundColor White

Write-Host "`n📋 RECOMENDACIÓN:" -ForegroundColor Green
Write-Host "Enfocar en Prioridad 1-2 (errores core) para tener" -ForegroundColor White
Write-Host "la aplicación funcional según PLANNING.md" -ForegroundColor White
