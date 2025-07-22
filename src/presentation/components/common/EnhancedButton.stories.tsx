/**
 * 📚 STORYBOOK STORIES - ENHANCED BUTTON MEDICAL VARIANTS
 * AI Medical Agent V2.0 - Component Documentation & Testing
 * 
 * @author Smart Migration Orchestrator V2.0
 * @version 2.0 - Post-Migration Enhancement
 */

import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedButton } from './EnhancedButton';
import { View } from 'react-native';

const meta: Meta<typeof EnhancedButton> = {
  title: 'Components/Common/EnhancedButton',
  component: EnhancedButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# EnhancedButton - Componente Médico Especializado

Botón avanzado con variantes médicas especializadas y funcionalidades de rendimiento optimizadas.

## Características

- 🏥 **Variantes Médicas**: medical, clinical, fertility
- ⚡ **Performance Optimizada**: Memoización y animaciones
- 🎨 **Diseño Profesional**: Sistema de colores médicos
- 📱 **Responsive**: Adaptado para dispositivos móviles
- 🔧 **Configurables**: Loading, disabled, iconos

## Casos de Uso Médicos

- **medical**: Acciones generales médicas (guardar, enviar)
- **clinical**: Decisiones clínicas críticas (diagnosticar, prescribir)  
- **fertility**: Acciones específicas de fertilidad (calcular, predecir)
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'text', 'medical', 'clinical', 'fertility'],
      description: 'Variante visual del botón',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'clinical'],
      description: 'Tamaño del botón',
    },
    enhanced: {
      control: { type: 'boolean' },
      description: 'Activar animaciones y efectos especiales',
    },
    completionPercentage: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Porcentaje de progreso (solo para enhanced=true)',
    },
    loading: {
      control: { type: 'boolean' },
      description: 'Estado de carga',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Estado deshabilitado',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Ancho completo',
    },
    iconName: {
      control: { type: 'text' },
      description: 'Nombre del icono (emoji key)',
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['left', 'right'],
      description: 'Posición del icono',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 🎨 STORY: Variantes Básicas
export const BasicVariants: Story = {
  render: () => (
    <View style={{ gap: 16, padding: 20 }}>
      <EnhancedButton title="Primary Button" onPress={() => {}} variant="primary" />
      <EnhancedButton title="Secondary Button" onPress={() => {}} variant="secondary" />
      <EnhancedButton title="Outline Button" onPress={() => {}} variant="outline" />
      <EnhancedButton title="Text Button" onPress={() => {}} variant="text" />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Variantes básicas del botón para uso general.',
      },
    },
  },
};

// 🏥 STORY: Variantes Médicas
export const MedicalVariants: Story = {
  render: () => (
    <View style={{ gap: 16, padding: 20 }}>
      <EnhancedButton 
        title="Guardar Historial" 
        onPress={() => {}} 
        variant="medical" 
        iconName="medical"
        iconPosition="left"
      />
      <EnhancedButton 
        title="Realizar Diagnóstico" 
        onPress={() => {}} 
        variant="clinical" 
        size="clinical"
        iconName="stethoscope"
      />
      <EnhancedButton 
        title="Calcular Fertilidad" 
        onPress={() => {}} 
        variant="fertility" 
        enhanced={true}
        iconName="fertility"
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Variantes especializadas para aplicaciones médicas con iconografía apropiada.',
      },
    },
  },
};

// ⚡ STORY: Enhanced con Animaciones
export const EnhancedAnimations: Story = {
  render: () => (
    <View style={{ gap: 16, padding: 20 }}>
      <EnhancedButton 
        title="Progreso 25%" 
        onPress={() => {}} 
        enhanced={true}
        completionPercentage={25}
        variant="primary"
      />
      <EnhancedButton 
        title="Progreso 60%" 
        onPress={() => {}} 
        enhanced={true}
        completionPercentage={60}
        variant="medical"
      />
      <EnhancedButton 
        title="Completado 100%" 
        onPress={() => {}} 
        enhanced={true}
        completionPercentage={100}
        variant="clinical"
        iconName="check"
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Botones con animaciones y barras de progreso dinámicas.',
      },
    },
  },
};

// 🔧 STORY: Estados y Tamaños
export const StatesAndSizes: Story = {
  render: () => (
    <View style={{ gap: 16, padding: 20 }}>
      <EnhancedButton title="Small" onPress={() => {}} size="small" variant="medical" />
      <EnhancedButton title="Medium (Default)" onPress={() => {}} size="medium" variant="clinical" />
      <EnhancedButton title="Large" onPress={() => {}} size="large" variant="fertility" />
      <EnhancedButton title="Clinical Size" onPress={() => {}} size="clinical" variant="clinical" />
      
      <View style={{ marginTop: 20 }}>
        <EnhancedButton title="Loading..." onPress={() => {}} loading={true} variant="medical" />
        <EnhancedButton title="Disabled" onPress={() => {}} disabled={true} variant="clinical" />
        <EnhancedButton title="Full Width" onPress={() => {}} fullWidth={true} variant="fertility" />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes tamaños y estados del botón (loading, disabled, full width).',
      },
    },
  },
};

// 🎯 STORY: Casos de Uso Médicos Reales
export const MedicalUseCases: Story = {
  render: () => (
    <View style={{ gap: 12, padding: 20 }}>
      {/* Calculadora de Fertilidad */}
      <EnhancedButton 
        title="Calcular Probabilidades" 
        onPress={() => console.log('Calculating fertility...')} 
        variant="fertility" 
        enhanced={true}
        iconName="calculator"
        size="large"
      />
      
      {/* Diagnóstico Clínico */}
      <EnhancedButton 
        title="Confirmar Diagnóstico" 
        onPress={() => console.log('Confirming diagnosis...')} 
        variant="clinical" 
        size="clinical"
        iconName="check"
      />
      
      {/* Guardar Datos Médicos */}
      <EnhancedButton 
        title="Guardar en Historial" 
        onPress={() => console.log('Saving to medical history...')} 
        variant="medical" 
        iconName="save"
        iconPosition="right"
      />
      
      {/* Enviar Reporte */}
      <EnhancedButton 
        title="Enviar Reporte a Especialista" 
        onPress={() => console.log('Sending report...')} 
        variant="primary" 
        fullWidth={true}
        iconName="send"
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Ejemplos de casos de uso reales en aplicaciones médicas de fertilidad.',
      },
    },
  },
};

// 📱 STORY: Playground Interactivo
export const Playground: Story = {
  args: {
    title: 'Botón Médico',
    variant: 'medical',
    size: 'medium',
    enhanced: true,
    completionPercentage: 50,
    loading: false,
    disabled: false,
    fullWidth: false,
    iconName: 'medical',
    iconPosition: 'left',
  },
  parameters: {
    docs: {
      description: {
        story: 'Playground interactivo para probar todas las configuraciones disponibles.',
      },
    },
  },
};
