# 📊 ANÁLISIS FACTOR EVALUATORS - BÁSICO VS PREMIUM

## 🔍 **COMPARACIÓN EXHAUSTIVA DE EVALUADORES**

**Fecha**: 15 de Julio, 2025  
**Archivos Analizados**: `factorEvaluators.ts` vs `factorEvaluatorsPremium.ts`

---

## 📋 **INVENTARIO FUNCIONAL**

### 🎯 **Cobertura de Funciones**

| Función | Básico | Premium | Estado |
|---------|--------|---------|---------|
| **evaluateAge** | ✅ `evaluateAgeBaseline` | ✅ `evaluateAgePremium` | **Ambos** |
| **evaluateBmi** | ✅ | ✅ | **Ambos** |
| **evaluateAmh** | ✅ | ✅ | **Ambos** |
| **evaluateCycle** | ✅ | ✅ | **Ambos** |
| **evaluatePcos** | ✅ | ✅ | **Ambos** |
| **evaluateEndometriosis** | ✅ | ✅ | **Ambos** |
| **evaluateMyomas** | ✅ | ✅ | **Ambos** |
| **evaluateAdenomyosis** | ✅ | ✅ | **Ambos** |
| **evaluatePolyps** | ✅ | ✅ | **Ambos** |
| **evaluateHsg** | ✅ | ✅ | **Ambos** |
| **evaluateOtb** | ✅ | ✅ | **Ambos** |
| **evaluateProlactin** | ✅ | ✅ | **Ambos** |
| **evaluateTsh** | ✅ | ✅ | **Ambos** |
| **evaluateHoma** | ✅ | ✅ | **Ambos** |
| **evaluateInfertilityDuration** | ✅ | ✅ | **Ambos** |
| **evaluatePelvicSurgeries** | ✅ | ✅ | **Ambos** |
| **evaluateMaleFactor** | ✅ | ✅ | **Ambos** |
| **evaluateTpoAb** | ❌ No | ✅ **Solo Premium** | **Premium Only** |

### 📊 **Resumen de Cobertura**:
- **Básico**: 17 funciones (447 líneas)
- **Premium**: 18 funciones (476 líneas) + **TPO Ab**
- **Diferencia**: Premium tiene **1 función adicional**

---

## 🆚 **ANÁLISIS COMPARATIVO DETALLADO**

### 🎯 **1. EVALUACIÓN DE EDAD**

#### **Básico (`evaluateAgeBaseline`)**:
```typescript
// Sistema de rangos con array dinámico
const ageRanges = [
  { max: 24, probability: 25.0, comment: 'Fertilidad máxima' },
  { max: 29, probability: 22.5, comment: 'Fertilidad excelente' },
  { max: 34, probability: 17.5, comment: 'Buena fertilidad' },
  { max: 39, probability: 10.0, comment: 'Fecundidad en descenso' },
  { max: 44, probability: 5.0, comment: 'Baja tasa de embarazo' },
  { max: 49, probability: 1.5, comment: 'Probabilidad muy baja' },
  { max: Infinity, probability: 0.5, comment: 'Edad extrema - considerar ovodonación' },
];

// ✅ Manejo especial de edades jóvenes (<15, <18)
// ✅ Loop dinámico escalable
```

#### **Premium (`evaluateAgePremium`)**:
```typescript
// Sistema de if/else estático
if (age < 30) {
  baseAgeProbability = 22.5;
  agePotential = 'Fertilidad óptima';
} else if (age <= 34) {
  baseAgeProbability = 17.5;
  agePotential = 'Buena fertilidad';
} else if (age <= 37) {
  baseAgeProbability = 12.5; // ✅ Rango 35-37 más específico
  agePotential = 'Fecundidad moderadamente reducida';
}
// ... más específico en rangos 37-42
```

#### **🏆 Ganador**: **BÁSICO**
- ✅ **Más escalable** (array dinámico vs if/else estático)
- ✅ **Manejo de casos extremos** (edades <15, <18)
- ✅ **Más rangos** (7 vs 6)
- ❌ **Menos específico** en rango 35-42

---

### 🎯 **2. EVALUACIÓN DE BMI**

#### **Básico**:
```typescript
const bmiRanges = [
  { max: 18.5, factor: 0.8, comment: 'Bajo peso' },
  { max: 24.9, factor: 1.0, comment: 'Peso normal' },
  { max: Infinity, factor: 0.85, comment: 'Sobrepeso/Obesidad' }, // ❌ Muy simple
];
```

#### **Premium**:
```typescript
if (bmi < 18.5) {
  return { factors: { bmi: 0.85 }, diagnostics: { bmiComment: 'Bajo peso' } };
} else if (bmi <= 24.9) {
  return { factors: { bmi: 1.0 }, diagnostics: { bmiComment: 'Peso normal' } };
} else if (bmi <= 29.9) {
  return { factors: { bmi: 0.9 }, diagnostics: { bmiComment: 'Sobrepeso' } }; // ✅ Específico
} else if (bmi <= 34.9) {
  return { factors: { bmi: 0.75 }, diagnostics: { bmiComment: 'Obesidad Clase I' } }; // ✅ Específico
} else if (bmi <= 39.9) {
  return { factors: { bmi: 0.6 }, diagnostics: { bmiComment: 'Obesidad Clase II' } }; // ✅ Específico
} else {
  return { factors: { bmi: 0.4 }, diagnostics: { bmiComment: 'Obesidad Clase III' } }; // ✅ Específico
}
```

#### **🏆 Ganador**: **PREMIUM**
- ✅ **6 categorías** vs 3 básicas
- ✅ **Clasificación médica OMS** (Clase I, II, III)
- ✅ **Factores específicos** por categoría
- ✅ **Validación mejorada** (bmi <= 0)

---

### 🎯 **3. EVALUACIÓN SOP (PCOS)**

#### **Básico**:
```typescript
export const evaluatePcos = (hasPcos: boolean, bmi: number | null, cycleDuration?: number): PartialEvaluation => {
  if (!hasPcos) return { factors: { pcos: 1.0 }, diagnostics: { pcosSeverity: 'No aplica' } };

  let severity = 'SOP presente';
  let factor = 0.85; // Factor base

  // ❌ Lógica muy simple
  // Solo considera BMI y duración del ciclo básicamente
```

#### **Premium**:
```typescript
export const evaluatePcosPremium = (
  hasPcos: boolean,
  amh?: number,      // ✅ Incluye AMH
  bmi?: number | null,
  homaIr?: number | null, // ✅ Incluye HOMA-IR
): PartialEvaluation => {
  if (!hasPcos) return { factors: { pcos: 1.0 }, diagnostics: { pcosSeverity: 'No aplica' } };

  let factor = 0.9; // Leve (ovulación preservada, AMH <6)
  let severity = 'SOP Leve (ovulación preservada, AMH <6 ng/mL)';

  // ✅ Evaluación avanzada con múltiples factores
  const isAnovulatory = (bmi !== undefined && bmi !== null && bmi >= 30) || 
                       (homaIr !== null && homaIr !== undefined && homaIr >= 3.5);
  const isHighAmh = amh && amh > 6;

  if (isAnovulatory && isHighAmh) {
    factor = 0.6; // Severo
    severity = 'SOP Severo (anovulación, IMC >30 o HOMA >3.5)';
  } else if (isAnovulatory || isHighAmh) {
    factor = 0.75; // Moderado
    severity = 'SOP Moderado (con anovulación o AMH >6 ng/mL)';
  }
```

#### **🏆 Ganador**: **PREMIUM**
- ✅ **4 parámetros** vs 3 básicos (incluye AMH, HOMA-IR)
- ✅ **3 severidades** específicas (Leve, Moderado, Severo)
- ✅ **Criterios clínicos** avanzados
- ✅ **Factores diferenciados** por severidad

---

### 🎯 **4. EVALUACIÓN OTB (LIGADURA DE TROMPAS)**

#### **Básico**:
```typescript
export const evaluateOtb = (
  hasOtb: boolean,
  age?: number,                           // ✅ Parámetros adicionales
  otbMethod?: OtbMethod,                  // ✅ Método específico
  remainingTubalLength?: number,          // ✅ Longitud remanente
  hasOtherInfertilityFactors?: boolean,   // ✅ Otros factores
  desireForMultiplePregnancies?: boolean, // ✅ Deseo embarazos múltiples
): PartialEvaluation => {
  // ✅ Lógica compleja con múltiples consideraciones
```

#### **Premium**:
```typescript
export const evaluateOtbPremium = (hasOtb: boolean): PartialEvaluation => {
  return { factors: { otb: hasOtb ? 0.0 : 1.0 } }; // ❌ Muy simple
};
```

#### **🏆 Ganador**: **BÁSICO**
- ✅ **6 parámetros** vs 1 simple
- ✅ **Evaluación compleja** del tipo de ligadura
- ✅ **Considera factores adicionales**
- ✅ **Más realista clínicamente**

---

### 🎯 **5. FACTOR MASCULINO**

#### **Básico**:
```typescript
export const evaluateMaleFactor = (input: UserInput): PartialEvaluation => {
  const { spermConcentration, spermProgressiveMotility, spermNormalMorphology } = input;
  
  // ✅ Lógica completa similar al Premium
  // ✅ Mismos umbrales OMS 2021
  // ✅ Manejo de anomalías múltiples
```

#### **Premium**:
```typescript
export const evaluateMaleFactorPremium = (input: UserInput): PartialEvaluation => {
  const { spermConcentration, spermProgressiveMotility, spermNormalMorphology } = input;
  
  // ✅ Lógica completa similar al Básico
  // ✅ Umbrales OMS 2021 idénticos
  // ✅ Manejo de datos faltantes mejorado
```

#### **🏆 Ganador**: **EMPATE**
- ✅ **Funcionalidad equivalente**
- ✅ **Mismos umbrales médicos**
- ✅ **Ambos completos**

---

## 📈 **ANÁLISIS DE CALIDAD MÉDICA**

### 🏥 **Precisión Clínica**

| Aspecto | Básico | Premium | Ganador |
|---------|--------|---------|---------|
| **BMI Categorización** | 3 rangos básicos | ✅ **6 categorías OMS** | **Premium** |
| **SOP Evaluación** | Simple | ✅ **3 severidades + AMH + HOMA** | **Premium** |
| **Edad Rangos** | ✅ **7 rangos + casos extremos** | 6 rangos estáticos | **Básico** |
| **OTB Evaluación** | ✅ **6 parámetros complejos** | 1 parámetro simple | **Básico** |
| **Factor Masculino** | Completo | Completo | **Empate** |
| **TPO Anticuerpos** | ❌ No existe | ✅ **Exclusivo Premium** | **Premium** |

### 🎯 **Robustez del Código**

| Aspecto | Básico | Premium | Ganador |
|---------|--------|---------|---------|
| **Escalabilidad** | ✅ **Arrays dinámicos** | If/else estáticos | **Básico** |
| **Mantenibilidad** | ✅ **Estructuras reutilizables** | Hardcoded | **Básico** |
| **Casos Extremos** | ✅ **Edades jóvenes** | Limitado | **Básico** |
| **Validación Datos** | Básica | ✅ **Mejorada** | **Premium** |

---

## 🏆 **ANÁLISIS DE DEPENDENCIAS**

### 📦 **Uso Actual del Sistema**

#### **calculationEngine.ts** usa **BÁSICO**:
```typescript
import * as factorEvaluators from '../logic/factorEvaluators';

// 17+ referencias directas al sistema básico
factorEvaluators.evaluateAgeBaseline,
factorEvaluators.evaluateBmi,
factorEvaluators.evaluateCycle,
// ... todas las funciones
```

#### **calculationEngine.test.ts** usa **BÁSICO**:
```typescript
import * as factorEvaluators from '@/core/domain/logic/factorEvaluators';
jest.mock('@/core/domain/logic/factorEvaluators', () => ({
  // 17+ mocks para testing
```

#### **¿Quién usa Premium?**:
- ❌ **Ningún archivo** importa `factorEvaluatorsPremium`
- ❌ **No hay referencias** al sistema Premium
- ❌ **No hay tests** para Premium

---

## 🎯 **RECOMENDACIÓN ESTRATÉGICA**

### 🚫 **NO CONSOLIDAR - MANTENER BÁSICO**

#### **🎯 Razones Decisivas**:

1. **✅ BÁSICO está EN USO ACTIVO**
   - calculationEngine.ts depende completamente del básico
   - Tests configurados para básico
   - Producción usa básico

2. **✅ BÁSICO tiene MEJOR ARQUITECTURA**
   - Arrays dinámicos vs if/else estáticos
   - Más escalable y mantenible
   - Mejor manejo de casos extremos

3. **✅ PREMIUM no agrega VALOR SUFICIENTE**
   - Solo 1 función adicional (TPO Ab)
   - Algunas mejoras menores (BMI, SOP)
   - Pérdidas importantes (OTB complejo)

4. **✅ RIESGO de CONSOLIDACIÓN ALTO**
   - Cambio masivo en calculationEngine
   - Actualización de 17+ tests
   - Posible ruptura de funcionalidad

---

## 🔧 **PLAN ALTERNATIVO RECOMENDADO**

### 🎯 **MEJORA INCREMENTAL DEL BÁSICO**

#### **Paso 1: Migrar mejoras específicas**
```typescript
// Mejorar BMI del básico con categorías Premium
const bmiRanges = [
  { max: 18.5, factor: 0.85, comment: 'Bajo peso' },
  { max: 24.9, factor: 1.0, comment: 'Peso normal' },
  { max: 29.9, factor: 0.9, comment: 'Sobrepeso' },        // ✅ De Premium
  { max: 34.9, factor: 0.75, comment: 'Obesidad Clase I' }, // ✅ De Premium
  { max: 39.9, factor: 0.6, comment: 'Obesidad Clase II' }, // ✅ De Premium
  { max: Infinity, factor: 0.4, comment: 'Obesidad Clase III' }, // ✅ De Premium
];
```

#### **Paso 2: Agregar función TPO Ab**
```typescript
// Agregar evaluateTpoAb al básico
export function evaluateTpoAb(tpoAbPositive: boolean): PartialEvaluation {
  return tpoAbPositive 
    ? { diagnostics: { tpoAbComment: 'Anticuerpos TPO Positivos' } }
    : { diagnostics: { tpoAbComment: 'Anticuerpos TPO Negativos' } };
}
```

#### **Paso 3: Mejorar SOP con parámetros Premium**
```typescript
// Mejorar evaluatePcos del básico
export const evaluatePcos = (
  hasPcos: boolean, 
  bmi: number | null, 
  cycleDuration?: number,
  amh?: number,        // ✅ Agregar de Premium
  homaIr?: number | null // ✅ Agregar de Premium
): PartialEvaluation => {
  // Combinar lógica básica + mejoras Premium
}
```

#### **Paso 4: Eliminar Premium**
```bash
# Después de migrar mejoras
rm factorEvaluatorsPremium.ts
```

---

## 🏅 **DECISIÓN FINAL**

### 🚫 **NO CONSOLIDAR AL PREMIUM**

**Razones**:
1. ✅ **Básico está en producción** y funcionando
2. ✅ **Básico tiene mejor arquitectura** (arrays dinámicos)
3. ✅ **Premium no justifica riesgo** de cambio masivo
4. ✅ **Mejor estrategia**: **Mejorar básico** con partes valiosas de Premium

### 🎯 **Acción Recomendada**:
**MEJORAR INCREMENTAL** del sistema básico agregando:
- ✅ **BMI con 6 categorías OMS** de Premium
- ✅ **Función TPO Ab** de Premium  
- ✅ **SOP con AMH + HOMA** de Premium
- ✅ **Mantener arquitectura escalable** del básico

**Resultado**: Sistema básico mejorado + eliminación de Premium redundante

**¿Proceder con mejora incremental en lugar de consolidación?**
