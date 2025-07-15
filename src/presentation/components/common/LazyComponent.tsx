/**
 * 🚀 FASE 2A: LAZY LOADING INTELIGENTE
 * 
 * Sistema de carga perezosa para optimizar performance
 * y mejorar tiempo de carga inicial de la aplicación
 */

import React, { Suspense, lazy, ComponentType, useCallback, useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import Text from './Text';
import { useDynamicTheme } from '@/hooks/useDynamicTheme';

// 🎭 Tipos para el sistema de lazy loading (CORREGIDOS)
interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  delay?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

interface LazyLoadState {
  isLoading: boolean;
  hasError: boolean;
  error?: Error;
}

// 🎨 Componente de loading por defecto
const DefaultLoadingFallback: React.FC = () => {
  const theme = useDynamicTheme();
  
  return (
    <View style={{
      padding: theme.spacing.m,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 100
    }}>
      <ActivityIndicator 
        size="large" 
        color={theme.colors.primary} 
      />
      <Text 
        variant="caption" 
        style={{ 
          marginTop: theme.spacing.s,
          color: theme.colors.textSecondary 
        }}
      >
        Cargando componente...
      </Text>
    </View>
  );
};

// 🚨 Componente de error por defecto
const DefaultErrorFallback: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => {
  const theme = useDynamicTheme();
  
  return (
    <View style={{
      padding: theme.spacing.m,
      alignItems: 'center',
      backgroundColor: theme.colors.error + '10',
      borderRadius: theme.spacing.s,
      margin: theme.spacing.s
    }}>
      <Text variant="bodyBold" style={{ color: theme.colors.error, marginBottom: theme.spacing.s }}>
        Error al cargar componente
      </Text>
      <Text variant="caption" style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.m }}>
        {error.message}
      </Text>
      <Text
        variant="caption"
        style={{ 
          color: theme.colors.primary,
          textDecorationLine: 'underline'
        }}
        onPress={retry}
      >
        Reintentar
      </Text>
    </View>
  );
};

// 🎯 Error Boundary para capturar errores de lazy loading (CORREGIDO)
interface ErrorBoundaryProps {
  children: React.ReactNode; 
  errorFallback: React.ComponentType<{ error: Error; retry: () => void }>;
  onRetry: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean; 
  error?: Error;
}

class LazyComponentErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Lazy Component Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const ErrorComponent = this.props.errorFallback;
      return (
        <ErrorComponent 
          error={this.state.error} 
          retry={() => {
            this.setState({ hasError: false, error: undefined });
            this.props.onRetry();
          }} 
        />
      );
    }

    return this.props.children;
  }
}

// 🚀 Hook para gestionar el estado de lazy loading
const useLazyComponent = (delay: number = 0) => {
  const [state, setState] = useState<LazyLoadState>({
    isLoading: true,
    hasError: false
  });

  const [retryKey, setRetryKey] = useState(0);

  const retry = useCallback(() => {
    setState({ isLoading: true, hasError: false });
    setRetryKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, isLoading: false }));
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [delay, retryKey]);

  return { ...state, retry };
};

// 🎭 Componente principal de Lazy Loading (CORREGIDO)
export const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback: CustomFallback,
  errorFallback: CustomErrorFallback,
  delay = 0,
  style,
  ...props
}) => {
  const { isLoading, retry } = useLazyComponent(delay);
  
  const FallbackComponent = CustomFallback || DefaultLoadingFallback;
  const ErrorComponent = CustomErrorFallback || DefaultErrorFallback;

  if (isLoading) {
    return <FallbackComponent />;
  }

  return (
    <LazyComponentErrorBoundary 
      errorFallback={ErrorComponent}
      onRetry={retry}
    >
      <Suspense fallback={<FallbackComponent />}>
        <View style={style} {...props}>
          {children}
        </View>
      </Suspense>
    </LazyComponentErrorBoundary>
  );
};

// 🏭 Función helper para crear componentes lazy (CORREGIDA)
export const createLazyComponent = <P extends object>(
  componentImport: () => Promise<{ default: ComponentType<P> }>,
  options: {
    fallback?: React.ComponentType;
    errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
    delay?: number;
  } = {}
) => {
  const LazyLoadedComponent = lazy(componentImport);
  
  return React.forwardRef<View, P>((props, ref) => (
    <LazyComponent {...options}>
      <LazyLoadedComponent {...props} ref={ref} />
    </LazyComponent>
  ));
};

// � Componente de fallback para secciones de formulario (EXTRAÍDO)
const FormSectionFallback: React.FC<{ sectionName: string }> = ({ sectionName }) => {
  const theme = useDynamicTheme();
  
  return (
    <View style={{ 
      padding: theme.spacing.m,
      minHeight: 50,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
        Cargando {sectionName}...
      </Text>
    </View>
  );
};

// 🎯 Componente especializado para formularios grandes (CORREGIDO)
export const LazyFormSection: React.FC<{
  isVisible: boolean;
  children: React.ReactNode;
  sectionName: string;
}> = ({ isVisible, children, sectionName }) => {
  // Memoizar el componente fallback para evitar recreación
  const fallbackComponent = useCallback(() => (
    <FormSectionFallback sectionName={sectionName} />
  ), [sectionName]);

  if (!isVisible) {
    return null;
  }

  return (
    <LazyComponent 
      delay={100}
      fallback={fallbackComponent}
    >
      {children}
    </LazyComponent>
  );
};

export default LazyComponent;
