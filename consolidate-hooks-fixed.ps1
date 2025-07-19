# Script de Consolidacion de Hooks
# Basado en PLANNING.md - Eliminar hooks redundantes y consolidar

Write-Host "Iniciando consolidacion de hooks..." -ForegroundColor Yellow
Write-Host "Basado en PLANNING.md - Arquitectura ya implementada" -ForegroundColor Cyan

# Verificar directorio
if (!(Test-Path "package.json")) {
    Write-Host "ERROR: Este script debe ejecutarse desde la raiz del proyecto" -ForegroundColor Red
    exit 1
}

# Hooks redundantes identificados para eliminar
$redundantHooks = @(
    "src\presentation\features\calculator\hooks\useCalculatorWithParallelValidation.ts",
    "src\presentation\features\calculator\hooks\useParallelValidationSimple.ts"
)

Write-Host "Eliminando hooks redundantes..." -ForegroundColor Yellow

$deletedHooks = 0
foreach ($hook in $redundantHooks) {
    if (Test-Path $hook) {
        # Verificar si esta vacio
        $content = Get-Content $hook -Raw -ErrorAction SilentlyContinue
        if ([string]::IsNullOrWhiteSpace($content)) {
            Remove-Item $hook -Force
            Write-Host "   Eliminado hook vacio: $hook" -ForegroundColor Green
            $deletedHooks++
        } else {
            Write-Host "   Hook contiene codigo: $hook (no eliminado)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   No encontrado: $hook" -ForegroundColor Yellow
    }
}

# Verificar archivos que importan hooks obsoletos
$filesToCheck = @(
    "app\(app)\index.tsx",
    "app\(app)\index_with_ux_enhancements.tsx",
    "src\presentation\components\features\validation\ParallelValidationMonitor.tsx"
)

Write-Host "`nVerificando imports obsoletos..." -ForegroundColor Cyan

foreach ($file in $filesToCheck) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw -ErrorAction SilentlyContinue
        
        # Buscar imports obsoletos
        $hasObsoleteImports = $false
        
        if ($content -match "useCalculatorWithParallelValidation") {
            Write-Host "   Encontrado import obsoleto en $file: useCalculatorWithParallelValidation" -ForegroundColor Yellow
            $hasObsoleteImports = $true
        }
        
        if ($content -match "useParallelValidationSimple") {
            Write-Host "   Encontrado import obsoleto en $file: useParallelValidationSimple" -ForegroundColor Yellow
            $hasObsoleteImports = $true
        }
        
        if (!$hasObsoleteImports) {
            Write-Host "   Sin imports obsoletos: $file" -ForegroundColor Green
        }
    } else {
        Write-Host "   Archivo no encontrado: $file" -ForegroundColor Yellow
    }
}

# Verificar estructura de hooks segun PLANNING.md
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

Write-Host "`nVerificando arquitectura de hooks..." -ForegroundColor Cyan

$existingHooks = 0
foreach ($hook in $expectedHooks) {
    if (Test-Path $hook) {
        Write-Host "   Encontrado: $hook" -ForegroundColor Green
        $existingHooks++
    } else {
        Write-Host "   Faltante: $hook" -ForegroundColor Red
    }
}

Write-Host "`nResumen de consolidacion:" -ForegroundColor Green
Write-Host "   - $deletedHooks hooks redundantes eliminados" -ForegroundColor White
Write-Host "   - $existingHooks/$($expectedHooks.Count) hooks esperados encontrados" -ForegroundColor White

# Verificar hook principal unificado
$mainHook = "src\presentation\features\calculator\useCalculatorForm.ts"
if (Test-Path $mainHook) {
    Write-Host "   Hook principal unificado encontrado: $mainHook" -ForegroundColor Green
} else {
    Write-Host "   Hook principal NO encontrado: $mainHook" -ForegroundColor Red
}

Write-Host "`nProximos pasos:" -ForegroundColor Cyan
Write-Host "1. Verificar compilacion: npm run typecheck" -ForegroundColor White
Write-Host "2. Actualizar imports obsoletos en archivos detectados" -ForegroundColor White
Write-Host "3. Ejecutar tests: npm test" -ForegroundColor White
