/**
 * 🚨 HERRAMIENTA DE DEBUGGING: DETECTOR DE RE-RENDERS INFINITOS
 * 
 * Componente de desarrollo para detectar y alertar sobre
 * loops de renderizado que pueden causar "Maximum update depth exceeded"
 */

import React, { useRef, useEffect } from 'react';
import { View, Text } from 'react-native';

// 🚀 FASE 2A: Declaración de __DEV__ para React Native
declare const __DEV__: boolean;

interface RenderLoopDetectorProps {
  componentName: string;
  threshold?: number;
  enabled?: boolean;
  children?: React.ReactNode;
}

// 🔍 Hook para detectar re-renders excesivos
const useRenderLoopDetection = (componentName: string, threshold: number = 50) => {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());
  const lastAlert = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    
    const now = Date.now();
    const timeSinceStart = now - startTime.current;
    
    // Si hemos renderizado más del threshold en menos de 5 segundos
    if (renderCount.current > threshold && timeSinceStart < 5000) {
      // Alertar solo una vez cada 10 segundos para evitar spam
      if (now - lastAlert.current > 10000) {
        console.error(`
🚨 LOOP INFINITO DETECTADO:
Component: ${componentName}
Renders: ${renderCount.current}
Time: ${timeSinceStart}ms
Rate: ${Math.round(renderCount.current / (timeSinceStart / 1000))} renders/sec

Posibles causas:
1. useEffect sin dependencias correctas
2. setState dentro de render
3. Funciones que se recrean en cada render
4. Objetos/arrays que se crean en cada render

Solucion típica:
- Usar useCallback para funciones
- Usar useMemo para objetos/arrays
- Revisar dependencias de useEffect
        `);
        lastAlert.current = now;
      }
    }
  });
  
  const resetCounter = () => {
    renderCount.current = 0;
    startTime.current = Date.now();
  };
  
  return { resetCounter };
};

// 🛡️ Componente de protección visual
export const RenderLoopDetector: React.FC<RenderLoopDetectorProps> = ({
  componentName,
  threshold = 50,
  enabled = __DEV__,
  children
}) => {
  const { resetCounter } = useRenderLoopDetection(componentName, threshold);
  const warningShown = useRef(false);
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    
    // Mostrar warning visual si hay demasiados renders
    if (renderCount.current > threshold && !warningShown.current && enabled) {
      warningShown.current = true;
    }
  });
  
  if (!enabled) {
    return <>{children}</>;
  }
  
  return (
    <View style={{ flex: 1 }}>
      {/* Warning visual (solo en desarrollo) */}
      {warningShown.current && (
        <View style={{
          position: 'absolute',
          top: 50,
          left: 10,
          right: 10,
          backgroundColor: '#ff4444',
          padding: 10,
          borderRadius: 5,
          zIndex: 9999
        }}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
            🚨 LOOP DETECTADO: {componentName}
          </Text>
          <Text style={{ color: 'white', fontSize: 10 }}>
            Renders: {renderCount.current} | Revisa console para detalles
          </Text>
          <Text 
            style={{ color: 'white', fontSize: 10, textDecorationLine: 'underline' }}
            onPress={resetCounter}
          >
            [ Reset Contador ]
          </Text>
        </View>
      )}
      {children}
    </View>
  );
};

// 🔧 Hook simplificado para componentes específicos
export const useRenderTracker = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());
  
  useEffect(() => {
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    renderCount.current += 1;
    
    // Log cada render en desarrollo
    if (__DEV__ && renderCount.current % 10 === 0) {
      console.log(`📊 ${componentName}: Render #${renderCount.current} (${timeSinceLastRender}ms since last)`);
    }
    
    lastRenderTime.current = now;
  });
  
  return {
    renderCount: renderCount.current,
    resetCount: () => { renderCount.current = 0; }
  };
};

// 🎯 HOC para agregar detección automática
export const withRenderLoopDetection = <P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) => {
  const displayName = componentName || Component.displayName || Component.name || 'UnknownComponent';
  
  const WrappedComponent: React.FC<P> = (props) => {
    useRenderTracker(displayName);
    
    return (
      <RenderLoopDetector componentName={displayName}>
        <Component {...props} />
      </RenderLoopDetector>
    );
  };
  
  WrappedComponent.displayName = `withRenderLoopDetection(${displayName})`;
  
  return WrappedComponent;
};

export default RenderLoopDetector;
