/**
 * 🚀 EJECUCIÓN DE ANÁLISIS COMPLETO DEL SISTEMA AI MEDICAL AGENT
 * Workflow automatizado para evaluación integral
 */

import { aiSystemAnalyzer } from './AISystemAnalyzer';

async function runCompleteSystemAnalysis() {
  console.log('🔍 INICIANDO ANÁLISIS COMPLETO DEL AI MEDICAL AGENT SYSTEM\n');
  
  try {
    const analysisResult = await aiSystemAnalyzer.analyzeCompleteSystem();
    
    if (analysisResult.success && analysisResult.data) {
      const report = aiSystemAnalyzer.generateComprehensiveReport(analysisResult.data);
      console.log(report);
      
      // Métricas adicionales
      console.log('\n📊 MÉTRICAS DE ANÁLISIS:');
      console.log(`⏱️  Tiempo de análisis: ${analysisResult.metadata?.processingTime}ms`);
      console.log(`🎯 Confianza del análisis: ${analysisResult.metadata?.confidence}%`);
      console.log(`📈 Nivel de evidencia: ${analysisResult.metadata?.evidenceLevel}`);
      
    } else {
      console.error('❌ Error en el análisis:', analysisResult.error?.message);
    }
    
  } catch (error) {
    console.error('💥 Error crítico durante el análisis:', error);
  }
}

// Ejecutar análisis
runCompleteSystemAnalysis();
