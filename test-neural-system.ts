/**
 * 🧪 NEURAL MEDICAL AI SYSTEM TEST
 * Test simple para validar funcionamiento del sistema neural
 */

import { NeuralMedicalAISystem } from '../ai-medical-agent/core/neural-engines/NeuralMedicalAISystem';

// Datos de prueba
const testFactors = {
  age: 35,
  pcos: 0.3,  // PCOS severo
  male: 0.4,  // Factor masculino moderado
  amh: 0.5,   // Reserva ovárica comprometida
  bmi: 0.6,   // Sobrepeso
  homa: 0.4,  // Resistencia insulínica
  tsh: 0.8,   // Normal
  cycle: 0.3, // Ciclos irregulares
  endometriosis: 0.9, // Normal
  myoma: 0.9, // Normal
  hsg: 0.8    // Normal
};

async function testNeuralMedicalSystem() {
  console.log('🧪 Iniciando test del Sistema Neural Médico...');
  
  try {
    // Crear sistema neural
    const neuralSystem = new NeuralMedicalAISystem({
      enablePatternRecognition: true,
      enableBayesianDecisions: true,
      enableNeuralConversation: true,
      enableEmergentInsights: true,
      enablePredictiveModeling: true,
      conversationPersonality: 'empathetic',
      analysisDepth: 'superintelligent'
    });
    
    console.log('✅ Sistema neural inicializado');
    
    // Test análisis superinteligente
    console.log('🔬 Ejecutando análisis superinteligente...');
    const analysis = await neuralSystem.performSuperintellignentAnalysis(testFactors);
    
    console.log('📊 Resultados del análisis:');
    console.log('- Patrones detectados:', analysis.neuralPatternAnalysis.primaryPatterns.length);
    console.log('- Insights emergentes:', analysis.emergentInsights.hiddenConnections.length);
    console.log('- Recomendación principal:', analysis.integralRecommendation.primaryTreatment);
    console.log('- Confianza general:', Math.round(analysis.systemMetrics.overallConfidence * 100) + '%');
    
    // Test conversación neural
    console.log('💬 Probando conversación neural...');
    const conversation = await neuralSystem.neuralConversation(
      "Tengo PCOS y mi pareja tiene problemas con el espermatograma. ¿Cuáles son nuestras opciones?",
      testFactors
    );
    
    console.log('💬 Respuesta neural:', conversation.response.mainMessage.substring(0, 150) + '...');
    console.log('💬 Insights personalizados:', conversation.response.personalizedInsights.length);
    
    // Estadísticas del sistema
    const stats = neuralSystem.getSystemStatistics();
    console.log('📈 Estadísticas del sistema:', stats);
    
    // Validar capacidades
    const capabilities = neuralSystem.validateSystemCapabilities();
    console.log('🛠️ Capacidades del sistema:', capabilities);
    
    console.log('✅ Test completado exitosamente');
    return true;
    
  } catch (error) {
    console.error('❌ Error en test:', error);
    return false;
  }
}

// Ejecutar test si es llamado directamente
if (require.main === module) {
  testNeuralMedicalSystem()
    .then(success => {
      console.log(success ? '🎉 Test exitoso' : '💥 Test fallido');
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Error fatal en test:', error);
      process.exit(1);
    });
}

export { testNeuralMedicalSystem };