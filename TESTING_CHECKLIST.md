# 🧪 CHECKLIST DE TESTING FUNCIONAL

## 📋 ESTADO: EJECUTAR MANUALMENTE

### 🧮 **1. CALCULADORA PRINCIPAL**

#### **A. Formulario Básico**
- [ ] **Edad**: Ingresar 25, 35, 42 años ✓
- [ ] **IMC**: Calcular automático con peso/altura ✓  
- [ ] **PCOS**: Seleccionar Sí/No ✓
- [ ] **Endometriosis**: Grados 1-4 ✓

#### **B. Formulario Avanzado**
- [ ] **AMH**: Ingresar 0.2, 1.5, 4.0 ✓
- [ ] **TSH**: Ingresar 0.5, 2.5, 8.0 ✓
- [ ] **Prolactina**: Ingresar 15, 35, 80 ✓
- [ ] **HOMA-IR**: Ingresar 1.0, 2.8, 6.0 ✓

#### **C. Historial Ginecológico**
- [ ] **OTB**: Seleccionar método (clips, cauterización) ✓
- [ ] **HSG**: Normal/Alterado ✓
- [ ] **Factor Masculino**: Concentración esperma ✓

#### **D. Validación**
- [ ] **Campos requeridos**: Edad mínima ✓
- [ ] **Rangos válidos**: AMH 0.1-15, TSH 0.1-50 ✓
- [ ] **Mensajes error**: Claros y útiles ✓

---

### 🤖 **2. DR. IA (CHAT MÉDICO)**

#### **A. Inicialización**
- [ ] **Carga datos**: Accede a evaluación calculadora ✓
- [ ] **Saludo personalizado**: Incluye probabilidad correcta ✓
- [ ] **Quick replies**: Botones funcionan ✓

#### **B. Análisis Neural**
- [ ] **AMH < 0.4**: Recomienda ovodonación ✓
- [ ] **TSH > 4.0**: Recomienda tratamiento tiroideo ✓
- [ ] **Prolactina > 25**: Análisis detallado ✓
- [ ] **HOMA-IR > 2.5**: Resistencia insulina ✓
- [ ] **Factor masculino**: Análisis completo ✓

#### **C. Conversación**
- [ ] **Contexto**: Recuerda información previa ✓
- [ ] **Variedad**: Respuestas no repetitivas ✓
- [ ] **Médico**: Recomendaciones basadas evidencia ✓

---

### 📊 **3. SIMULADOR (3 MODOS)**

#### **A. Simulador Básico**
- [ ] **Detección factores**: Identifica problemas ✓
- [ ] **Simulación individual**: Mejora realista ✓
- [ ] **Botón "Simular Todo"**: Funciona ✓
- [ ] **Límite 25%**: No excede probabilidad ✓

#### **B. Simulador Avanzado**
- [ ] **Métricas dashboard**: Actual vs Potencial ✓
- [ ] **Botón "Simular Todo"**: Agregado y funcional ✓
- [ ] **Motor Premium**: Usa para simulación global ✓
- [ ] **Tarjetas factores**: Muestran mejora correcta ✓

#### **C. Simulador Moderno**
- [ ] **UI moderna**: Gradientes, sombras ✓
- [ ] **Botón "Simular Todo"**: Estilo premium ✓
- [ ] **Análisis inteligente**: Priorización factores ✓
- [ ] **Métricas avanzadas**: Probabilidad éxito ✓

---

### 📄 **4. RESULTADOS DETALLADOS**

#### **A. Pronóstico Principal**
- [ ] **Probabilidad**: Entre 0.5% - 25% ✓
- [ ] **Categoría**: Muy bajo, Bajo, Promedio, Bueno ✓
- [ ] **Frase explicativa**: Clara y comprensible ✓

#### **B. Análisis Detallado**
- [ ] **Factores críticos**: Solo problemas reales ✓
- [ ] **AMH**: Aparece cuando < 1.0 ✓
- [ ] **TSH**: Aparece cuando alterado ✓
- [ ] **Distribución**: Cuenta correcta factores ✓

#### **C. Recomendaciones**
- [ ] **Personalizadas**: Basadas en perfil ✓
- [ ] **Prioritizadas**: Orden lógico ✓
- [ ] **Específicas**: Tratamientos concretos ✓

---

## 🎯 **CASOS DE PRUEBA ESPECÍFICOS**

### **Caso 1: Paciente Joven Saludable**
```
Edad: 25 años
IMC: 22
PCOS: No
AMH: 3.0
TSH: 2.0
Resultado esperado: >15% probabilidad
```

### **Caso 2: Paciente Reserva Baja**
```  
Edad: 38 años
AMH: 0.3
TSH: 4.5
Resultado esperado: <5%, recomendar ovodonación
```

### **Caso 3: Paciente PCOS**
```
Edad: 30 años
PCOS: Sí
HOMA-IR: 4.0
Resultado esperado: Análisis resistencia insulina
```

### **Caso 4: Factor Masculino Severo**
```
Concentración: <5 millones/ml
Resultado esperado: <2%, recomendar ICSI
```

---

## 🚀 **TESTING PERFORMANCE**

### **A. Tiempo de Respuesta**
- [ ] **Cálculo**: <3 segundos ✓
- [ ] **Dr. IA respuesta**: <2 segundos ✓
- [ ] **Simulación**: <1 segundo ✓

### **B. Memoria**
- [ ] **Sin memory leaks**: Usar DevTools ✓
- [ ] **Cache eficiente**: Reutiliza cálculos ✓

---

## 📱 **TESTING MÓVIL**

### **A. Responsive Design**
- [ ] **Teléfonos**: iPhone, Android ✓
- [ ] **Tablets**: iPad, Android tablet ✓
- [ ] **Orientación**: Portrait/Landscape ✓

### **B. Gestos Nativos**
- [ ] **Scroll**: Suave en todas pantallas ✓
- [ ] **Taps**: Botones responsivos ✓
- [ ] **Keyboard**: No overlap con inputs ✓

---

## ⚠️ **CASOS EXTREMOS**

### **A. Datos Límite**
- [ ] **Edad**: 18 años, 50 años ✓
- [ ] **AMH**: 0.01, 15.0 ✓
- [ ] **Sin datos**: Campos vacíos ✓

### **B. Errores**
- [ ] **Red lenta**: Timeouts apropiados ✓
- [ ] **Datos inválidos**: Validación robusta ✓
- [ ] **Memoria baja**: Degradación elegante ✓

---

## ✅ **CRITERIOS DE ACEPTACIÓN**

**CRÍTICOS (deben pasar):**
- ✅ Cálculo probabilidad correcto
- ✅ Dr. IA accede a datos
- ✅ Simulador detecta factores
- ✅ Sin crashes/errores fatales

**IMPORTANTES (deseables):**
- ✅ UI/UX fluida
- ✅ Performance rápido
- ✅ Responsive design
- ✅ Análisis detallado

---

**📝 INSTRUCCIONES:**
1. Ejecutar `npm start` 
2. Probar cada sección marcando ✓
3. Reportar cualquier error encontrado
4. Verificar en diferentes dispositivos

**🎯 OBJETIVO:** Confirmar que toda funcionalidad está operativa después de la limpieza de código.