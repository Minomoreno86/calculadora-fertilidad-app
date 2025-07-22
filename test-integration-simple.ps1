# SCRIPT DE PRUEBA - UNIFIED PARALLEL ENGINE V12.0
# Ejecuta validacion de la integracion del sistema

Write-Host "INICIANDO VALIDACION DE UNIFIED PARALLEL ENGINE V12.0" -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Gray

# Verificar que estamos en el directorio correcto
$projectRoot = "c:\Users\jvr_0\MisProyectos\calculadora-fertilidad-app"
if (!(Test-Path $projectRoot)) {
    Write-Host "Error: Directorio del proyecto no encontrado: $projectRoot" -ForegroundColor Red
    exit 1
}

Set-Location $projectRoot
Write-Host "Directorio de trabajo: $projectRoot" -ForegroundColor Blue

# Verificar archivos críticos del sistema
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
    "src\core\calculatorIntegration.ts"
)

Write-Host "VERIFICANDO ARCHIVOS CRITICOS:" -ForegroundColor Yellow
$filesFound = 0
$totalFiles = $criticalFiles.Count

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        $fileInfo = Get-Item $file
        $sizeKB = [math]::Round($fileInfo.Length / 1KB, 1)
        Write-Host "OK $file ($sizeKB KB)" -ForegroundColor Green
        $filesFound++
    } else {
        Write-Host "ERROR $file (NO ENCONTRADO)" -ForegroundColor Red
    }
}

Write-Host "ARCHIVOS ENCONTRADOS: $filesFound/$totalFiles" -ForegroundColor Cyan

# Verificar estructura de workers especializados
Write-Host "" 
Write-Host "ESTRUCTURA DE WORKERS:" -ForegroundColor Yellow
$workersDir = "src\core\workers\specialized"
if (Test-Path $workersDir) {
    $workerFiles = Get-ChildItem $workersDir -Filter "*.ts" | ForEach-Object { $_.Name }
    Write-Host "Directorio: $workersDir" -ForegroundColor Blue
    foreach ($worker in $workerFiles) {
        Write-Host "  WORKER: $worker" -ForegroundColor Cyan
    }
    Write-Host "Total de workers: $($workerFiles.Count)" -ForegroundColor Green
} else {
    Write-Host "ERROR: Directorio de workers no encontrado: $workersDir" -ForegroundColor Red
}

# Estadísticas de código
Write-Host ""
Write-Host "ESTADISTICAS DEL CODIGO:" -ForegroundColor Yellow
$tsFiles = Get-ChildItem -Path "src" -Filter "*.ts" -Recurse
$tsxFiles = Get-ChildItem -Path "src" -Filter "*.tsx" -Recurse

$totalLines = 0
$totalSize = 0

$coreFiles = Get-ChildItem -Path "src\core" -Filter "*.ts" -Recurse
foreach ($file in $coreFiles) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($content) {
        $lines = ($content -split "`n").Count
        $totalLines += $lines
        $totalSize += $file.Length
    }
}

Write-Host "Archivos TypeScript core: $($coreFiles.Count)" -ForegroundColor Cyan
Write-Host "Total lineas de codigo core: $totalLines" -ForegroundColor Green
Write-Host "Tamaño total core: $([math]::Round($totalSize / 1KB, 1)) KB" -ForegroundColor Green

# Análisis específico de workers
Write-Host ""
Write-Host "ANALISIS DE WORKERS ESPECIALIZADOS:" -ForegroundColor Yellow

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

$completeWorkers = 0
foreach ($worker in $workerFiles) {
    $filePath = "src\core\workers\specialized\$worker"
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw -ErrorAction SilentlyContinue
        if ($content) {
            $lines = ($content -split "`n").Count
            $size = (Get-Item $filePath).Length
            
            # Buscar patrones específicos de funcionalidad completa
            $hasProcessMethod = $content -match "async process\("
            $hasExports = $content -match "export (class|interface|type)"
            $hasTypeScript = $content -match ": Promise<"
            
            if ($hasProcessMethod -and $hasExports -and $hasTypeScript) {
                Write-Host "COMPLETO: $worker ($lines lineas, $([math]::Round($size / 1KB, 1)) KB)" -ForegroundColor Green
                $completeWorkers++
            } else {
                Write-Host "INCOMPLETO: $worker ($lines lineas)" -ForegroundColor Yellow
            }
        } else {
            Write-Host "ERROR: No se pudo leer $worker" -ForegroundColor Red
        }
    } else {
        Write-Host "FALTA: $worker - NO ENCONTRADO" -ForegroundColor Red
    }
}

# Resumen final
Write-Host ""
Write-Host "====================================================================" -ForegroundColor Gray
Write-Host "RESUMEN DE VALIDACION:" -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Gray

Write-Host "Workers completos: $completeWorkers/$($workerFiles.Count)" -ForegroundColor Green
Write-Host "Archivos criticos encontrados: $filesFound/$totalFiles" -ForegroundColor Green

if ($completeWorkers -eq $workerFiles.Count -and $filesFound -eq $totalFiles) {
    Write-Host "EXITO: UnifiedParallelEngine V12.0 esta completamente integrado!" -ForegroundColor Green
    Write-Host "El sistema esta listo para usar con 8 workers especializados" -ForegroundColor Green
} else {
    Write-Host "ATENCION: La integracion necesita completarse" -ForegroundColor Yellow
    if ($completeWorkers -lt $workerFiles.Count) {
        Write-Host "  - Faltan completar workers: $($workerFiles.Count - $completeWorkers)" -ForegroundColor Yellow
    }
    if ($filesFound -lt $totalFiles) {
        Write-Host "  - Faltan archivos criticos: $($totalFiles - $filesFound)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "PROXIMOS PASOS:" -ForegroundColor Green
Write-Host "1. Probar la aplicacion con: npm start" -ForegroundColor White
Write-Host "2. Verificar logs de la consola durante el uso" -ForegroundColor White
Write-Host "3. Monitorear metricas de rendimiento" -ForegroundColor White

Write-Host ""
Write-Host "VALIDACION COMPLETADA" -ForegroundColor Green
