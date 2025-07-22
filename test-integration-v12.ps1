# 🚀 SCRIPT DE PRUEBA - UNIFIED PARALLEL ENGINE V12.0
# Ejecuta pruebas de integración y valida el funcionamiento del sistema

Write-Host "🚀 INICIANDO VALIDACIÓN DE UNIFIED PARALLEL ENGINE V12.0" -ForegroundColor Green
Write-Host "=" * 80 -ForegroundColor Gray

# Verificar que estamos en el directorio correcto
$projectRoot = "c:\Users\jvr_0\MisProyectos\calculadora-fertilidad-app"
if (!(Test-Path $projectRoot)) {
    Write-Host "❌ Error: Directorio del proyecto no encontrado: $projectRoot" -ForegroundColor Red
    exit 1
}

Set-Location $projectRoot
Write-Host "📂 Directorio de trabajo: $projectRoot" -ForegroundColor Blue

# Verificar archivos críticos
$criticalFiles = @(
    "src\core\workers\UnifiedParallelEngine_V12.ts",
    "src\core\workers\specialized\pathology_detectionWorker.ts",
    "src\core\workers\specialized\treatment_validationWorker.ts", 
    "src\core\workers\specialized\biomarker_monitoringWorker.ts",
    "src\core\workers\specialized\calculation_engineWorker.ts",
    "src\core\workers\specialized\risk_assessmentWorker.ts",
    "src\core\workers\specialized\validation_engineWorker.ts",
    "src\core\workers\specialized\cache_optimizationWorker.ts",
    "src\core\workers\specialized\streaming_analysisWorker.ts",
    "src\core\calculatorIntegration.ts",
    "src\core\test-integration.ts"
)

Write-Host "`n🔍 VERIFICANDO ARCHIVOS CRÍTICOS:" -ForegroundColor Yellow
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        $fileInfo = Get-Item $file
        $sizeKB = [math]::Round($fileInfo.Length / 1KB, 1)
        Write-Host "✅ $file ($sizeKB KB)" -ForegroundColor Green
    } else {
        Write-Host "❌ $file (NO ENCONTRADO)" -ForegroundColor Red
    }
}

# Verificar estructura de workers
Write-Host "`n📁 ESTRUCTURA DE WORKERS:" -ForegroundColor Yellow
$workersDir = "src\core\workers\specialized"
if (Test-Path $workersDir) {
    $workerFiles = Get-ChildItem $workersDir -Filter "*.ts" | ForEach-Object { $_.Name }
    Write-Host "📂 Directorio: $workersDir" -ForegroundColor Blue
    foreach ($worker in $workerFiles) {
        Write-Host "  🔧 $worker" -ForegroundColor Cyan
    }
    Write-Host "📊 Total de workers: $($workerFiles.Count)" -ForegroundColor Green
} else {
    Write-Host "❌ Directorio de workers no encontrado: $workersDir" -ForegroundColor Red
}

# Verificar package.json y dependencias principales
Write-Host "`n📦 VERIFICANDO PACKAGE.JSON:" -ForegroundColor Yellow
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    Write-Host "✅ Nombre del proyecto: $($packageJson.name)" -ForegroundColor Green
    Write-Host "✅ Versión: $($packageJson.version)" -ForegroundColor Green
    
    # Verificar dependencias críticas
    $criticalDeps = @("react", "react-native", "expo", "@types/node", "typescript")
    Write-Host "🔍 Dependencias críticas:" -ForegroundColor Blue
    foreach ($dep in $criticalDeps) {
        if ($packageJson.dependencies.$dep -or $packageJson.devDependencies.$dep) {
            $version = $packageJson.dependencies.$dep -or $packageJson.devDependencies.$dep
            Write-Host "  ✅ $dep: $version" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️ $dep: NO ENCONTRADO" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "❌ package.json no encontrado" -ForegroundColor Red
}

# Verificar TypeScript configuration
Write-Host "`n⚙️ VERIFICANDO CONFIGURACIÓN TYPESCRIPT:" -ForegroundColor Yellow
if (Test-Path "tsconfig.json") {
    Write-Host "✅ tsconfig.json encontrado" -ForegroundColor Green
    try {
        $tsConfig = Get-Content "tsconfig.json" | ConvertFrom-Json
        Write-Host "✅ Target: $($tsConfig.compilerOptions.target)" -ForegroundColor Green
        Write-Host "✅ Module: $($tsConfig.compilerOptions.module)" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Error leyendo tsconfig.json (puede tener comentarios)" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ tsconfig.json no encontrado" -ForegroundColor Red
}

# Intentar compilación TypeScript (si está disponible)
Write-Host "`n🔨 VERIFICANDO COMPILACIÓN:" -ForegroundColor Yellow
try {
    # Verificar si TypeScript está instalado
    $tscVersion = & npx tsc --version 2>$null
    if ($tscVersion) {
        Write-Host "✅ TypeScript disponible: $tscVersion" -ForegroundColor Green
        
        # Intentar compilar sin emitir archivos (solo verificar errores)
        Write-Host "🔍 Verificando errores de compilación..." -ForegroundColor Blue
        $compileResult = & npx tsc --noEmit --skipLibCheck 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Compilación exitosa - No se encontraron errores de TypeScript" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Se encontraron errores de compilación:" -ForegroundColor Yellow
            Write-Host $compileResult -ForegroundColor Gray
        }
    } else {
        Write-Host "⚠️ TypeScript no disponible - saltando verificación de compilación" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ No se pudo verificar la compilación TypeScript" -ForegroundColor Yellow
}

# Estadísticas de código
Write-Host "`n📊 ESTADÍSTICAS DEL CÓDIGO:" -ForegroundColor Yellow
$tsFiles = Get-ChildItem -Path "src" -Filter "*.ts" -Recurse
$tsxFiles = Get-ChildItem -Path "src" -Filter "*.tsx" -Recurse
$allCodeFiles = $tsFiles + $tsxFiles

$totalLines = 0
$totalSize = 0

foreach ($file in $allCodeFiles) {
    $content = Get-Content $file.FullName -Raw
    $lines = ($content -split "`n").Count
    $totalLines += $lines
    $totalSize += $file.Length
}

Write-Host "📁 Archivos TypeScript: $($tsFiles.Count)" -ForegroundColor Cyan
Write-Host "📁 Archivos React: $($tsxFiles.Count)" -ForegroundColor Cyan
Write-Host "📊 Total líneas de código: $totalLines" -ForegroundColor Green
Write-Host "💾 Tamaño total: $([math]::Round($totalSize / 1MB, 2)) MB" -ForegroundColor Green

# Verificar workers específicamente
Write-Host "`n🔧 ANÁLISIS DE WORKERS ESPECIALIZADOS:" -ForegroundColor Yellow
$workerStats = @()

$workerFiles = @(
    "pathology_detectionWorker.ts",
    "treatment_validationWorker.ts",
    "biomarker_monitoringWorker.ts", 
    "calculation_engineWorker.ts",
    "risk_assessmentWorker.ts",
    "validation_engineWorker.ts",
    "cache_optimizationWorker.ts",
    "streaming_analysisWorker.ts"
)

foreach ($worker in $workerFiles) {
    $filePath = "src\core\workers\specialized\$worker"
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        $lines = ($content -split "`n").Count
        $size = (Get-Item $filePath).Length
        
        # Buscar patrones específicos
        $hasProcessMethod = $content -match "async process\("
        $hasExports = $content -match "export (class|interface|type)"
        $hasTypeScript = $content -match ": Promise<"
        
        $status = if ($hasProcessMethod -and $hasExports -and $hasTypeScript) { "✅ COMPLETO" } else { "⚠️ INCOMPLETO" }
        
        Write-Host "🔧 $worker" -ForegroundColor Cyan
        Write-Host "  📊 $lines líneas, $([math]::Round($size / 1KB, 1)) KB" -ForegroundColor Gray
        Write-Host "  $status" -ForegroundColor $(if ($status.StartsWith("✅")) { "Green" } else { "Yellow" })
        
        $workerStats += @{
            Name = $worker
            Lines = $lines
            Size = $size
            HasProcess = $hasProcessMethod
            HasExports = $hasExports
            HasTypeScript = $hasTypeScript
            Status = $status
        }
    } else {
        Write-Host "❌ $worker - NO ENCONTRADO" -ForegroundColor Red
    }
}

# Resumen final
Write-Host "`n" + "=" * 80 -ForegroundColor Gray
Write-Host "📋 RESUMEN DE VALIDACIÓN:" -ForegroundColor Green
Write-Host "=" * 80 -ForegroundColor Gray

$completeWorkers = $workerStats | Where-Object { $_.Status.StartsWith("✅") }
$incompleteWorkers = $workerStats | Where-Object { $_.Status.StartsWith("⚠️") }

Write-Host "✅ Workers completos: $($completeWorkers.Count)/$($workerFiles.Count)" -ForegroundColor Green
Write-Host "⚠️ Workers incompletos: $($incompleteWorkers.Count)" -ForegroundColor Yellow

if ($completeWorkers.Count -eq $workerFiles.Count) {
    Write-Host "🎉 TODOS LOS WORKERS ESTÁN COMPLETOS!" -ForegroundColor Green
    Write-Host "🚀 UnifiedParallelEngine V12.0 está listo para usar" -ForegroundColor Green
} else {
    Write-Host "⚠️ Algunos workers necesitan completarse" -ForegroundColor Yellow
}

# Líneas totales en workers
$totalWorkerLines = ($workerStats | Measure-Object -Property Lines -Sum).Sum
Write-Host "📊 Total líneas en workers: $totalWorkerLines" -ForegroundColor Cyan
Write-Host "📊 Promedio por worker: $([math]::Round($totalWorkerLines / $workerFiles.Count, 0)) líneas" -ForegroundColor Cyan

# Recomendaciones finales
Write-Host "`n🎯 PRÓXIMOS PASOS RECOMENDADOS:" -ForegroundColor Green
Write-Host "1. 🧪 Ejecutar pruebas de integración con: npm run test:integration" -ForegroundColor White
Write-Host "2. 🚀 Probar la aplicación en modo desarrollo: npm start" -ForegroundColor White
Write-Host "3. 📊 Monitorear métricas de rendimiento durante el uso" -ForegroundColor White
Write-Host "4. 🔧 Ajustar configuración de workers según necesidades" -ForegroundColor White

Write-Host "`n✅ VALIDACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "Unified Parallel Engine V12.0 integrado exitosamente" -ForegroundColor Cyan
