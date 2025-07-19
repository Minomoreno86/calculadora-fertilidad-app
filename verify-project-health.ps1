# 🔍 SCRIPT DE VERIFICACIÓN COMPLETA
# Basado en PLANNING.md - Verificar estado de producción

Write-Host "🔍 INICIANDO VERIFICACIÓN COMPLETA DEL PROYECTO..." -ForegroundColor Yellow
Write-Host "📋 Basado en PLANNING.md - Estado: Producción-ready" -ForegroundColor Cyan

# Verificar directorio
if (!(Test-Path "package.json")) {
    Write-Host "❌ ERROR: Este script debe ejecutarse desde la raíz del proyecto" -ForegroundColor Red
    exit 1
}

$errors = 0
$warnings = 0

Write-Host "`n🎯 FASE 1: VERIFICACIÓN TYPESCRIPT..." -ForegroundColor Cyan
try {
    $typecheckResult = npm run typecheck 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ TypeScript: Sin errores" -ForegroundColor Green
    } else {
        Write-Host "   ❌ TypeScript: Errores detectados" -ForegroundColor Red
        Write-Host $typecheckResult -ForegroundColor Red
        $errors++
    }
} catch {
    Write-Host "   ❌ Error ejecutando typecheck: $($_.Exception.Message)" -ForegroundColor Red
    $errors++
}

Write-Host "`n🎯 FASE 2: VERIFICACIÓN ESLINT..." -ForegroundColor Cyan
try {
    $lintResult = npm run lint 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ ESLint: Sin errores" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  ESLint: Warnings detectados" -ForegroundColor Yellow
        $warnings++
    }
} catch {
    Write-Host "   ❌ Error ejecutando lint: $($_.Exception.Message)" -ForegroundColor Red
    $errors++
}

Write-Host "`n🎯 FASE 3: VERIFICACIÓN DE ARQUITECTURA..." -ForegroundColor Cyan

# Verificar estructura según PLANNING.md
$coreDirectories = @(
    "src\components",
    "src\presentation",
    "app\(app)",
    "assets"
)

foreach ($dir in $coreDirectories) {
    if (Test-Path $dir) {
        Write-Host "   ✅ $dir" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $dir (FALTANTE)" -ForegroundColor Red
        $errors++
    }
}

# Verificar archivos críticos
$criticalFiles = @(
    "package.json",
    "app.json",
    "tsconfig.json",
    "babel.config.cjs",
    "PLANNING.md"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file (FALTANTE)" -ForegroundColor Red
        $errors++
    }
}

Write-Host "`n🎯 FASE 4: VERIFICACIÓN DE DEPENDENCIAS..." -ForegroundColor Cyan
try {
    $auditResult = npm audit --audit-level=moderate 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Dependencias: Sin vulnerabilidades críticas" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Dependencias: Vulnerabilidades detectadas" -ForegroundColor Yellow
        $warnings++
    }
} catch {
    Write-Host "   ❌ Error ejecutando audit: $($_.Exception.Message)" -ForegroundColor Red
    $errors++
}

Write-Host "`n🎯 FASE 5: VERIFICACIÓN DE TESTS..." -ForegroundColor Cyan
if (Test-Path "src\__tests__") {
    Write-Host "   ✅ Directorio de tests encontrado" -ForegroundColor Green
    
    # Contar archivos de test
    $testFiles = Get-ChildItem "src\__tests__" -Recurse -Include "*.test.ts", "*.test.tsx", "*.spec.ts", "*.spec.tsx"
    Write-Host "   📊 $($testFiles.Count) archivos de test encontrados" -ForegroundColor Cyan
    
    if ($testFiles.Count -eq 0) {
        Write-Host "   ⚠️  No hay archivos de test (pendiente según PLANNING.md)" -ForegroundColor Yellow
        $warnings++
    }
} else {
    Write-Host "   ⚠️  Directorio de tests no encontrado (pendiente según PLANNING.md)" -ForegroundColor Yellow
    $warnings++
}

Write-Host "`n🎯 FASE 6: VERIFICACIÓN DE COMPONENTES CLAVE..." -ForegroundColor Cyan

# Componentes según PLANNING.md
$keyComponents = @(
    "CalculatorForm",
    "CalculatorPerformanceMonitor", 
    "ValidationEngine",
    "CacheManager"
)

foreach ($component in $keyComponents) {
    $found = Get-ChildItem "src" -Recurse -Include "*.tsx", "*.ts" | Select-String -Pattern $component -Quiet
    if ($found) {
        Write-Host "   ✅ $component encontrado" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  $component no encontrado claramente" -ForegroundColor Yellow
        $warnings++
    }
}

Write-Host "`n🎯 RESUMEN FINAL:" -ForegroundColor Green
Write-Host "   - Errores: $errors" -ForegroundColor $(if ($errors -eq 0) { "Green" } else { "Red" })
Write-Host "   - Warnings: $warnings" -ForegroundColor $(if ($warnings -eq 0) { "Green" } else { "Yellow" })

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "`n🎉 PROYECTO EN PERFECTO ESTADO!" -ForegroundColor Green
    Write-Host "   ✅ Listo para producción según PLANNING.md" -ForegroundColor Green
} elseif ($errors -eq 0) {
    Write-Host "`n✅ PROYECTO FUNCIONAL" -ForegroundColor Green
    Write-Host "   ⚠️  $warnings warnings menores detectados" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ PROYECTO NECESITA CORRECCIONES" -ForegroundColor Red
    Write-Host "   🔧 $errors errores críticos deben corregirse" -ForegroundColor Red
}

Write-Host "`n🔄 PRÓXIMOS PASOS SEGÚN PLANNING.md:" -ForegroundColor Cyan
Write-Host "1. 📝 Implementar tests unitarios completos" -ForegroundColor White
Write-Host "2. 📚 Documentar API médica" -ForegroundColor White
Write-Host "3. ✅ Validar evidencia clínica final" -ForegroundColor White
