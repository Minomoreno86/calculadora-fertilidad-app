#!/usr/bin/env powershell
# 🧹 LIMPIEZA INTELIGENTE AUTOMATIZADA - CALCULADORA FERTILIDAD V11.0
# Elimina archivos obsoletos manteniendo funcionalidad completa

Write-Host "🚀 INICIANDO LIMPIEZA INTELIGENTE..." -ForegroundColor Green

# Contador de archivos eliminados
$eliminados = 0
$espacioLiberado = 0

Write-Host "`n📋 ELIMINANDO DOCUMENTOS COMPLETADOS..." -ForegroundColor Yellow

# 1. DOCUMENTOS COMPLETADOS
$documentosCompletados = @(
    "TARJETA_HEADER_AGRANDADA_COMPLETADO.md",
    "CUADROS_METRICAS_AGRANDADOS_COMPLETADO.md",
    "LIMPIEZA_CALCULADORA_COMPLETADA.md", 
    "RESULTSDISPLAY_MEJORADO_COMPLETADO.md",
    "DISEÑO_HORIZONTAL_PROPORCIONAL_COMPLETADO.md",
    "HEADER_LIMPIO_TABS_SIMPLIFICADOS_COMPLETADO.md",
    "MEJORAS_ESPACIADO_CONTENIDO_COMPLETADAS.md",
    "MIGRACIÓN_OPTIMIZED_COMPLETADA.md",
    "DR_IA_SECTION_IMPLEMENTED.md",
    "SIMULADOR_DASHBOARD_IMPLEMENTADO.md",
    "AI_MEDICAL_AGENT_ANALYSIS_COMPLETE.md",
    "GITHUB_MCP_ACTIVATION_COMPLETE.md",
    "DEPLOYMENT_GUIDE_COMPLETE.md",
    "REPORTE_FINAL_ARMONIZACION.md",
    "INTELLIGENT_CONVERSATION_ENGINE_FIXED.md",
    "AI_MEDICAL_AGENT_STATUS_FINAL.md",
    "ANALISIS_MOTOR_PRINCIPAL.prp",
    "ANALISIS_PARALLELVALIDATION_COMPLETO.md",
    "ANALISIS_USECALCULATORFORM_COMPLETO.md",
    "ARCHIVOS_OBSOLETOS_IDENTIFICADOS.md",
    "CHATGPT_PRODUCTION_SETUP.md",
    "DIAGNÓSTICO_VALIDACIÓN_PARALELA_INACTIVA.md",
    "DOCKER_TROUBLESHOOTING_MCP.md",
    "DOCUMENTACION_API_COMPLETA.md",
    "ERRORES_CORREGIDOS_RESULTS_DISPLAY.md",
    "EVOLUCION_SUPERINTELIGENCIA_V11.md",
    "FASE_1_REFACTORIZACION_ARQUITECTURAL.prp",
    "GITHUB_MCP_INTEGRATION.md",
    "GITHUB_MCP_SETUP_COMPLETE.md",
    "GITHUB_MCP_SETUP_GUIDE.md",
    "GITHUB_NATIVE_SOLUTION.md",
    "IMPROVE_CURRENT_SYSTEM.md",
    "MEJORAS_DR_IA_DEMOSTRADAS.md",
    "MODULO_ENFERMEDADES_AUTOINMUNES.md",
    "MODULO_PSICOLOGO_FERTILIDAD.md",
    "OPENAI_INTEGRATION_PROPOSAL.md",
    "OPTIMIZATION_ROADMAP.md",
    "PLANNING.md",
    "PLAN_MEJORAS_PROFESIONALES.md",
    "PLAN_MEJORA_RESULTSDISPLAY.md",
    "PLAN_MEJORA_SIMULADOR_INTEGRAL.md",
    "PRP_MIGRATION_ADVANCED.prp",
    "PRP_MOTOR_PRINCIPAL_OPTIMIZATION.prp",
    "RAZONAMIENTO_MEDICO_IMPLEMENTADO.md",
    "RESULTS_DISPLAY_PREMIUM_TRANSFORMATION.md",
    "ACTIVACION_TOKEN_GITHUB_MCP.md",
    "UNIFIED_MEDICAL_AI_CORRECTED.md"
)

foreach ($doc in $documentosCompletados) {
    if (Test-Path $doc) {
        $size = (Get-Item $doc).Length
        Remove-Item $doc -Force
        $eliminados++
        $espacioLiberado += $size
        Write-Host "   ✅ $doc" -ForegroundColor Green
    }
}

Write-Host "`n🗂️ ELIMINANDO SCRIPTS DE LIMPIEZA EJECUTADOS..." -ForegroundColor Yellow

# 2. SCRIPTS COMPLETADOS
$scriptsCompletados = @(
    "cleanup-obsolete-files.ps1",
    "cleanup-obsolete-files-fixed.ps1", 
    "consolidate-hooks.ps1",
    "consolidate-hooks-fixed.ps1",
    "typescript-errors-plan.ps1",
    "verify-project-health.ps1",
    "cleanup-ai-medical-agent.ts"
)

foreach ($script in $scriptsCompletados) {
    if (Test-Path $script) {
        $size = (Get-Item $script).Length
        Remove-Item $script -Force
        $eliminados++
        $espacioLiberado += $size
        Write-Host "   ✅ $script" -ForegroundColor Green
    }
}

Write-Host "`n🗑️ ELIMINANDO ARCHIVOS BACKUP..." -ForegroundColor Yellow

# 3. ARCHIVOS BACKUP
if (Test-Path "src\presentation\features\results\components\ResultsDisplay.tsx.backup") {
    $size = (Get-Item "src\presentation\features\results\components\ResultsDisplay.tsx.backup").Length
    Remove-Item "src\presentation\features\results\components\ResultsDisplay.tsx.backup" -Force
    $eliminados++
    $espacioLiberado += $size
    Write-Host "   ✅ ResultsDisplay.tsx.backup" -ForegroundColor Green
}

Write-Host "`n📁 ELIMINANDO CARPETAS REDUNDANTES..." -ForegroundColor Yellow

# 4. CARPETAS REDUNDANTES
$carpetasRedundantes = @(
    "BACKUP_20250718_091945",
    ".history", 
    "context-ai",
    "proxy-server",
    "sistemapsicologico",
    "autoinmune",
    "presentation"
)

foreach ($carpeta in $carpetasRedundantes) {
    if (Test-Path $carpeta) {
        $size = (Get-ChildItem $carpeta -Recurse | Measure-Object -Property Length -Sum).Sum
        Remove-Item $carpeta -Recurse -Force
        $eliminados++
        $espacioLiberado += $size
        Write-Host "   ✅ $carpeta\" -ForegroundColor Green
    }
}

Write-Host "`n📊 RESULTADOS DE LA LIMPIEZA:" -ForegroundColor Cyan
Write-Host "   🗑️ Archivos/carpetas eliminados: $eliminados" -ForegroundColor White
Write-Host "   💾 Espacio liberado: $([math]::Round($espacioLiberado/1MB, 2)) MB" -ForegroundColor White
Write-Host "   ✅ Proyecto optimizado y limpio" -ForegroundColor Green

Write-Host "`n🎯 ARCHIVOS PRINCIPALES CONSERVADOS:" -ForegroundColor Cyan
Write-Host "   ✅ src/ (código principal)" -ForegroundColor White
Write-Host "   ✅ ai-medical-agent/ (IA médica V11.0)" -ForegroundColor White  
Write-Host "   ✅ app/ (configuración Expo)" -ForegroundColor White
Write-Host "   ✅ assets/ (recursos)" -ForegroundColor White
Write-Host "   ✅ package.json, tsconfig.json" -ForegroundColor White
Write-Host "   ✅ README.md, TASK.md" -ForegroundColor White

Write-Host "`n🚀 LIMPIEZA COMPLETADA EXITOSAMENTE!" -ForegroundColor Green
