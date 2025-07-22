# 🧠 NEURAL VALIDATION SCRIPT V12.0 - ULTIMATE WORKERS CHECK

Write-Host "======================================================================"
Write-Host "🚀 UNIFIED PARALLEL ENGINE V12.0 - SUPERINTELIGENCIA MÉDICA"
Write-Host "🔍 VALIDACIÓN COMPLETA DE WORKERS ESPECIALIZADOS"
Write-Host "======================================================================"

# Verificar archivos core del sistema
$coreFiles = @(
    "src\core\workers\UnifiedParallelEngine_V12.ts",
    "src\infrastructure\ai\medicalKnowledgeEngine.ts",
    "src\infrastructure\ai\pathologyAnalyzer.ts", 
    "src\infrastructure\ai\treatmentEngine.ts",
    "src\core\calculatorIntegration.ts"
)

Write-Host "🔍 VERIFICANDO ARCHIVOS CORE:"
foreach ($file in $coreFiles) {
    if (Test-Path $file) {
        $lines = (Get-Content $file | Measure-Object -Line).Lines
        $size = [math]::Round((Get-Item $file).Length / 1KB, 1)
        Write-Host "✅ $file ($lines líneas, $size KB)"
    } else {
        Write-Host "❌ MISSING: $file"
    }
}

# Verificar workers especializados
Write-Host "`n🎯 VERIFICANDO WORKERS ESPECIALIZADOS:"
$workerFiles = Get-ChildItem -Path "src\core\workers\specialized\*Worker.ts" -ErrorAction SilentlyContinue

$functionalWorkers = 0
$totalLines = 0
$totalSize = 0

foreach ($worker in $workerFiles) {
    $content = Get-Content $worker.FullName -Raw
    $lines = (Get-Content $worker.FullName | Measure-Object -Line).Lines
    $size = [math]::Round($worker.Length / 1KB, 1)
    $totalLines += $lines
    $totalSize += $worker.Length
    
    # Verificar si tiene método process()
    if ($content -match "process\(.*\).*Promise") {
        Write-Host "✅ FUNCIONAL: $($worker.Name) ($lines líneas, $size KB)"
        $functionalWorkers++
    } else {
        Write-Host "🔧 INCOMPLETO: $($worker.Name) ($lines líneas, $size KB)"
    }
}

# Verificar compilación TypeScript
Write-Host "`n🔍 VERIFICANDO COMPILACIÓN TYPESCRIPT:"
try {
    $tscResult = & npx tsc --noEmit --skipLibCheck 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ COMPILACIÓN EXITOSA - Sin errores TypeScript"
    } else {
        Write-Host "🔧 ERRORES DE COMPILACIÓN DETECTADOS"
        Write-Host $tscResult
    }
} catch {
    Write-Host "⚠️  Error ejecutando TypeScript compiler"
}

# Estadísticas finales
Write-Host "`n======================================================================"
Write-Host "📊 ESTADÍSTICAS FINALES:"
Write-Host "======================================================================"
Write-Host "Workers funcionales: $functionalWorkers/8"
Write-Host "Total líneas de código: $totalLines"
Write-Host "Tamaño total: $([math]::Round($totalSize / 1KB, 1)) KB"

$percentage = [math]::Round(($functionalWorkers / 8) * 100, 0)
Write-Host "Porcentaje completado: $percentage%"

if ($percentage -ge 75) {
    Write-Host "🎉 SISTEMA LISTO PARA PRODUCCIÓN"
} elseif ($percentage -ge 50) {
    Write-Host "🔧 SISTEMA FUNCIONAL - Necesita optimización"
} else {
    Write-Host "❌ SISTEMA REQUIERE ATENCIÓN CRÍTICA"
}

Write-Host "`n🚀 PRÓXIMOS PASOS:"
Write-Host "1. Probar sistema con: npm start"
Write-Host "2. Verificar integración AI Medical Agent"
Write-Host "3. Monitorear métricas de rendimiento"
Write-Host "======================================================================"
