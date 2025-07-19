# 📋 PLANNING - Calculadora de Fertilidad App

## 🎯 **Objetivos del Proyecto**

### **Objetivo Principal**
Aplicación móvil React Native con Expo para evaluación de fertilidad con validación médica respaldada por evidencia científica.

### **Objetivos Específicos**
- ✅ Interfaz intuitiva para ingreso de datos médicos
- ✅ Validación paralela de alto rendimiento
- ✅ Cálculos basados en evidencia clínica (DOI/PMID)
- ✅ Persistencia local con AsyncStorage
- ✅ Performance optimizado con cache inteligente

## 🏗️ **Arquitectura del Proyecto**

### **Estructura Principal**
```
src/
├── components/           # Componentes reutilizables
├── screens/             # Pantallas principales
├── steps/               # Pasos del formulario
├── engines/             # Motores de cálculo
├── models/              # Tipos e interfaces
├── services/            # Servicios API/storage
├── utils/               # Utilidades generales
├── hooks/               # Hooks personalizados
└── __tests__/           # Tests unitarios
```

### **Componentes Clave**
- `CalculatorForm`: Formulario principal
- `CalculatorPerformanceMonitor`: Monitor de métricas
- `ValidationEngine`: Motor de validación paralela
- `CacheManager`: Sistema de cache LRU con TTL

## 🧬 **Convenciones Clínicas**

### **Evidencia Médica Obligatoria**
```typescript
/**
 * Calcula AMH según edad maternal
 * Evidence: DOI:10.1016/j.fertnstert.2023.xx.xxx
 * Source: ESHRE Guidelines 2023
 */
```

### **Umbrales Críticos**
- AMH: <1.1 ng/mL (baja reserva)
- Edad: >35 años (edad materna avanzada)
- HOMA-IR: >2.5 (resistencia insulínica)

### **Separación de Responsabilidades**
- `data/`: Datos crudos del usuario
- `rules/`: Lógica médica con respaldo
- `presentation/`: Mensajes y recomendaciones

## 🔧 **Configuración Técnica**

### **Stack Tecnológico**
- React Native 0.79.5
- Expo SDK 53
- TypeScript (strict mode)
- React Hook Form + Zod validation
- AsyncStorage para persistencia

### **Scripts Disponibles**
```bash
npm run start         # Inicia Expo dev server
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run typecheck     # TypeScript check
npm run test          # Jest tests
npm run test:coverage # Jest con coverage
```

### **Rutas Clave**
- `/app/(tabs)/index.tsx` - Pantalla principal
- `/src/hooks/useCalculatorWithParallelValidation.ts` - Hook principal
- `/src/components/CalculatorPerformanceMonitor.tsx` - Monitor performance
- `/src/engines/` - Motores de cálculo y validación

## 🎨 **Convenciones de UI/UX**

### **Temas Soportados**
- ✅ Modo claro
- ✅ Modo oscuro
- ✅ Adaptación automática al sistema

### **Componentes Base**
```typescript
// Colores consistentes
const colors = {
  primary: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#FFFFFF',
  backgroundDark: '#000000'
};
```

## 🚀 **Estado Actual**

### **✅ Completado (100%)**
- Sistema de validación paralela
- Monitor de performance
- Cache inteligente con LRU
- Interfaz consolidada
- Completitud dinámica real

### **🔄 En Proceso**
- Corrección de errores menores
- Optimizaciones de rendimiento

### **📝 Pendiente**
- Tests unitarios completos
- Documentación de API médica
- Validación final de evidencia clínica

## 🔗 **Referencias Médicas**

### **Guías Principales**
- ESHRE Guidelines 2023
- ASRM Practice Guidelines
- WHO Laboratory Manual 6th Edition

### **Fuentes de Evidencia**
- PubMed/MEDLINE
- Cochrane Reviews
- Reproductive endocrinology journals

---
**Última actualización**: 2025-01-18
**Versión**: 1.0.0
**Estado**: Producción-ready con optimizaciones menores pendientes
