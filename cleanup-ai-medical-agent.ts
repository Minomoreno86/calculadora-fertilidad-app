/**
 * 🧹 SCRIPT DE LIMPIEZA AI-MEDICAL-AGENT
 * Elimina archivos obsoletos y duplicados identificados en el análisis
 */

import { promises as fs } from 'fs';
import path from 'path';

const BASE_PATH = './ai-medical-agent';

// 🗑️ ARCHIVOS A ELIMINAR (obsoletos/duplicados)
const FILES_TO_DELETE = [
  // Engines duplicados/obsoletos
  'core/reasoning-engine/clinicalReasoningEngine.ts',
  'core/reasoning-engine/AdvancedClinicalReasoningEngine.ts',
  'core/conversation-engine/conversationEngine.ts', 
  'core/prediction-engine/SuccessRateCalculator.ts',
  
  // Conversation engine duplicado
  'core/conversation-engine/IntelligentMedicalConversation.ts',
  
  // Test simple obsoleto
  'test-simple.js',
  
  // Index obsoleto (será reemplazado)
  'index.ts'
];

// 📁 DIRECTORIOS A ELIMINAR (vacíos después de limpieza)
const DIRS_TO_DELETE = [
  'core/reasoning-engine',
  'core/conversation-engine', 
  'core/prediction-engine'
];

async function cleanupAIMedicalAgent() {
  console.log('🧹 Iniciando limpieza AI-Medical-Agent...');
  
  let deletedFiles = 0;
  let deletedDirs = 0;
  let errors = 0;
  
  // Eliminar archivos obsoletos
  for (const file of FILES_TO_DELETE) {
    const fullPath = path.join(BASE_PATH, file);
    try {
      await fs.access(fullPath);
      await fs.unlink(fullPath);
      console.log(`✅ Eliminado: ${file}`);
      deletedFiles++;
    } catch (error) {
      if ((error as any).code !== 'ENOENT') {
        console.log(`⚠️  Error eliminando ${file}: ${error}`);
        errors++;
      } else {
        console.log(`ℹ️  Ya eliminado: ${file}`);
      }
    }
  }
  
  // Eliminar directorios vacíos
  for (const dir of DIRS_TO_DELETE) {
    const fullPath = path.join(BASE_PATH, dir);
    try {
      const contents = await fs.readdir(fullPath);
      if (contents.length === 0) {
        await fs.rmdir(fullPath);
        console.log(`✅ Directorio eliminado: ${dir}`);
        deletedDirs++;
      } else {
        console.log(`⚠️  Directorio no vacío, omitido: ${dir}`);
      }
    } catch (error) {
      if ((error as any).code !== 'ENOENT') {
        console.log(`⚠️  Error con directorio ${dir}: ${error}`);
        errors++;
      }
    }
  }
  
  console.log('\n📊 RESUMEN DE LIMPIEZA:');
  console.log(`✅ Archivos eliminados: ${deletedFiles}`);
  console.log(`✅ Directorios eliminados: ${deletedDirs}`);
  console.log(`❌ Errores: ${errors}`);
  
  if (errors === 0) {
    console.log('\n🎉 Limpieza completada exitosamente!');
  } else {
    console.log('\n⚠️  Limpieza completada con algunos errores');
  }
}

// Ejecutar limpieza
cleanupAIMedicalAgent().catch(console.error);
