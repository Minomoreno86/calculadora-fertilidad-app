# Copilot Instructions - Sistema Psicológico Fertilidad

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## 🎯 Contexto del Proyecto

Este es un módulo especializado en **psicología de la fertilidad** que forma parte de una calculadora integral de fertilidad. El proyecto implementa evaluaciones psicológicas basadas en evidencia científica para mejorar los resultados reproductivos.

## 🧠 Componentes Principales

### Variables Psicológicas Implementadas:
1. **PSS-10** - Escala de Estrés Percibido adaptada fertilidad
2. **FertiQoL** - Calidad de Vida en Fertilidad
3. **PHQ-9F** - Depresión adaptada contexto reproductivo
4. **DAS-7** - Calidad relación pareja
5. **MSPSS-F** - Soporte social percibido
6. **Brief-COPE-F** - Estrategias de afrontamiento

### Arquitectura Técnica:
- **Frontend**: React + TypeScript + Vite
- **UI/UX**: Componentes especializados evaluación psicológica
- **Algoritmos**: Integración psico-clínica basada evidencia
- **Datos**: Manejo seguro información sensible psicológica

## 🔬 Directrices de Desarrollo

### Estándares Médicos:
- Todas las evaluaciones deben basarse en instrumentos validados científicamente
- Referencias obligatorias: ESHRE, ASRM, APA Guidelines 2024
- Cumplimiento HIPAA para datos psicológicos sensibles
- Algoritmos de derivación automática en casos de riesgo alto

### Mejores Prácticas UI/UX:
- Diseño empático y no estigmatizante
- Formularios adaptativos según perfil de riesgo
- Feedback inmediato y constructivo
- Recursos de apoyo contextuales
- Accesibilidad completa (WCAG 2.1 AA)

### Seguridad de Datos:
- Encriptación end-to-end para datos psicológicos
- Almacenamiento local seguro (nunca en servidores externos)
- Anonimización de datos para analytics
- Consentimiento informado específico

### Integración Clínica:
- Los algoritmos psicológicos deben integrarse con variables médicas existentes
- Recomendaciones combinadas psico-clínicas
- Protocolo de derivación a profesionales cuando sea necesario
- Dashboard unificado médico-psicológico

## 🎨 Componentes UI Específicos

Cuando generes código, considera estos componentes especializados:

### Evaluaciones Psicológicas:
- `PsychologicalAssessment` - Contenedor principal evaluaciones
- `PSS10Component` - Escala estrés percibido
- `FertiQoLComponent` - Calidad vida fertilidad
- `EmotionalDashboard` - Monitor estado emocional tiempo real
- `WellnessToolkit` - Herramientas bienestar (mindfulness, respiración)

### Análisis y Resultados:
- `PsychoMetrics` - Visualización resultados psicométricos
- `RiskAssessment` - Evaluación niveles riesgo psicológico
- `InterventionRecommendations` - Sugerencias terapéuticas personalizadas
- `ProgressTracking` - Seguimiento evolución psicológica

### Recursos de Apoyo:
- `SupportResources` - Biblioteca recursos psicoeducacionales
- `CrisisProtocol` - Protocolo emergencia psicológica
- `ProfessionalReferral` - Sistema derivación especialistas

## 🤖 Prompts Específicos Recomendados

Al solicitar código a Copilot, usa estos contextos:

**Para evaluaciones:** "Crear componente evaluación psicológica siguiendo estándares ESHRE 2024 con validación científica"

**Para algoritmos:** "Implementar algoritmo decisión psico-clínica basado en evidencia con derivación automática casos riesgo"

**Para UI:** "Diseñar interfaz empática evaluación psicológica con feedback constructivo y recursos apoyo contextual"

**Para datos:** "Implementar manejo seguro datos psicológicos con encriptación y cumplimiento HIPAA"

## 📚 Referencias Técnicas Clave

- ESHRE Psychology and Counselling Guideline (2024)
- ASRM Mental Health Professional Group Guidelines (2024) 
- APA Clinical Practice Guidelines for Reproductive Mental Health (2024)
- Validated psychological instruments: PSS-10, FertiQoL, PHQ-9, DAS-7, MSPSS, Brief-COPE

## ⚠️ Consideraciones Críticas

1. **Nunca sugerir diagnósticos psiquiátricos** - solo screening y derivación
2. **Validar siempre instrumentos** - usar versiones científicamente validadas
3. **Protocolo crisis obligatorio** - derivación inmediata en casos de riesgo suicida
4. **Consentimiento informado** - explicar propósito y limitaciones evaluaciones
5. **Integración no sustitución** - complementar, no reemplazar atención profesional

---

*Este módulo forma parte del ecosistema AEC-D (Arquitecto Experto Clínico-Digital) que integra expertise técnico, UX, clínico y psicológico para optimizar resultados reproductivos.*
