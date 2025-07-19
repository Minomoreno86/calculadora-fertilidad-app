# 🔧 SCRIPT DE CONSOLIDACIÓN DE HOOKS
# Basado en PLANNING.md - Eliminar hooks redundantes y consolidar

Write-Host "🔧 INICIANDO CONSOLIDACIÓN DE HOOKS..." -ForegroundColor Yellow
Write-Host "📋 Basado en PLANNING.md - Arquitectura ya implementada" -ForegroundColor Cyan

# Verificar directorio
if (!(Test-Path "package.json")) {
    Write-Host "❌ ERROR: Este script debe ejecutarse desde la raíz del proyecto" -ForegroundColor Red
    exit 1
}

# Hooks redundantes identificados para eliminar
$redundantHooks = @(
    "src\presentation\features\calculator\hooks\useCalculatorWithParallelValidation.ts",
    "src\presentation\features\calculator\hooks\useParallelValidationSimple.ts"
)

Write-Host "🗑️  ELIMINANDO HOOKS REDUNDANTES..." -ForegroundColor Yellow

$deletedHooks = 0
foreach ($hook in $redundantHooks) {
    if (Test-Path $hook) {
        Remove-Item $hook -Force
        Write-Host "   ✅ Eliminado: $hook" -ForegroundColor Green
        $deletedHooks++
    } else {
        Write-Host "   ⚠️  No encontrado: $hook" -ForegroundColor Yellow
    }
}

# Verificar archivos que importan hooks obsoletos
$filesToCheck = @(
    "app\(app)\index.tsx",
    "app\(app)\index_with_ux_enhancements.tsx",
    "src\presentation\components\features\validation\ParallelValidationMonitor.tsx"
)

Write-Host "`n🔍 VERIFICANDO IMPORTS OBSOLETOS..." -ForegroundColor Cyan

foreach ($file in $filesToCheck) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Buscar imports obsoletos
        $hasObsoleteImports = $false
        
        if ($content -match "useCalculatorWithParallelValidation") {
            Write-Host "   ⚠️  $file contiene import obsoleto: useCalculatorWithParallelValidation" -ForegroundColor Yellow
            $hasObsoleteImports = $true
        }
        
        if ($content -match "useParallelValidationSimple") {
            Write-Host "   ⚠️  $file contiene import obsoleto: useParallelValidationSimple" -ForegroundColor Yellow
            $hasObsoleteImports = $true
        }
        
        if (!$hasObsoleteImports) {
            Write-Host "   ✅ $file - Sin imports obsoletos" -ForegroundColor Green
        }
    }
}

# Verificar estructura de hooks según PLANNING.md
$expectedHooks = @(
    "src\presentation\features\calculator\hooks\useFormState.ts",
    "src\presentation\features\calculator\hooks\useFormValidation.ts",
    "src\presentation\features\calculator\hooks\useCalculations.ts",
    "src\presentation\features\calculator\hooks\useFormProgress.ts",
    "src\presentation\features\calculator\hooks\useFormCache.ts",
    "src\presentation\features\calculator\hooks\useParallelValidation.ts",
    "src\presentation\features\calculator\hooks\useBenchmark.ts",
    "src\presentation\features\calculator\hooks\useUXEnhancements.ts"
)

Write-Host "`n📋 VERIFICANDO ARQUITECTURA DE HOOKS..." -ForegroundColor Cyan

$existingHooks = 0
foreach ($hook in $expectedHooks) {
    if (Test-Path $hook) {
        Write-Host "   ✅ $hook" -ForegroundColor Green
        $existingHooks++
    } else {
        Write-Host "   ❌ $hook (FALTANTE)" -ForegroundColor Red
    }
}

Write-Host "`n🎯 RESUMEN DE CONSOLIDACIÓN:" -ForegroundColor Green
Write-Host "   - $deletedHooks hooks redundantes eliminados" -ForegroundColor White
Write-Host "   - $existingHooks/$($expectedHooks.Count) hooks esperados encontrados" -ForegroundColor White

# Verificar hook principal unificado
$mainHook = "src\presentation\features\calculator\useCalculatorForm.ts"
if (Test-Path $mainHook) {
    Write-Host "   ✅ Hook principal unificado: $mainHook" -ForegroundColor Green
} else {
    Write-Host "   ❌ Hook principal NO encontrado: $mainHook" -ForegroundColor Red
}

Write-Host "`n🔄 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "1. Verificar compilación: npm run typecheck" -ForegroundColor White
Write-Host "2. Actualizar imports obsoletos en archivos detectados" -ForegroundColor White
Write-Host "3. Ejecutar tests: npm test" -ForegroundColor White
