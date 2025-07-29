#!/usr/bin/env node

/**
 * 🧹 CLEANUP OBSOLETE ENGINES V1.0 - APP STORE CONSOLIDATION
 * 
 * Script para eliminar motores de cálculo obsoletos y consolidar arquitectura.
 * OBJETIVO: Preparar código limpio para App Store.
 */

const fs = require('fs');
const path = require('path');

// Archivos a mover a carpeta de backup antes de eliminar
const OBSOLETE_ENGINES = [
  'src/core/domain/services/simpleFertilityEngine.ts',
  'src/core/domain/services/calculationEngineUnified.ts', 
  'src/core/domain/services/smartFertilityEngine.ts'
];

// Carpeta de backup
const BACKUP_DIR = 'src/core/deprecated-engines-backup';

console.log('🧹 INICIANDO LIMPIEZA ARQUITECTURAL PARA APP STORE...\n');

// Crear carpeta de backup
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log(`✅ Creada carpeta de backup: ${BACKUP_DIR}`);
}

// Mover archivos obsoletos a backup
OBSOLETE_ENGINES.forEach(enginePath => {
  const fullPath = path.resolve(enginePath);
  
  if (fs.existsSync(fullPath)) {
    const fileName = path.basename(enginePath);
    const backupPath = path.join(BACKUP_DIR, fileName);
    
    try {
      // Leer contenido del archivo
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Escribir en backup con comentario de deprecación
      const deprecatedContent = `/**
 * ⚠️ DEPRECATED ENGINE - MOVED TO BACKUP
 * 
 * Este archivo ha sido movido a backup como parte de la consolidación
 * arquitectural para App Store. Ya no se usa en producción.
 * 
 * Motor de reemplazo: ModularFertilityEngine
 * Fecha de deprecación: ${new Date().toISOString()}
 */

${content}`;
      
      fs.writeFileSync(backupPath, deprecatedContent);
      
      // Eliminar archivo original
      fs.unlinkSync(fullPath);
      
      console.log(`✅ Movido a backup: ${enginePath} → ${backupPath}`);
    } catch (error) {
      console.error(`❌ Error procesando ${enginePath}:`, error.message);
    }
  } else {
    console.log(`⚠️ No encontrado: ${enginePath}`);
  }
});

// Crear archivo README en backup
const readmeContent = `# 🗄️ DEPRECATED ENGINES BACKUP

Esta carpeta contiene motores de cálculo obsoletos que fueron removidos
durante la consolidación arquitectural para App Store.

## Motores Consolidados

Todos los cálculos ahora usan **ModularFertilityEngine** que proporciona:

- ✅ Arquitectura modular limpia
- ✅ Cache inteligente unificado  
- ✅ Performance optimizado
- ✅ Mantenimiento simplificado
- ✅ API consistente

## Archivos en Backup

${OBSOLETE_ENGINES.map(engine => `- ${path.basename(engine)}`).join('\n')}

## Migración Completada

Fecha: ${new Date().toISOString()}
Motivo: Preparación para App Store
Sistema de reemplazo: ModularFertilityEngine
`;

fs.writeFileSync(path.join(BACKUP_DIR, 'README.md'), readmeContent);

console.log(`\n✅ LIMPIEZA COMPLETADA EXITOSAMENTE!`);
console.log(`📁 Archivos respaldados en: ${BACKUP_DIR}`);
console.log(`🎯 Arquitectura consolidada para App Store`);
console.log(`⚡ Ahora solo usa ModularFertilityEngine`);
