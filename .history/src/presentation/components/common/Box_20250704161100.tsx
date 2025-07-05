// src/presentation/components/common/Box.tsx
import { View, ViewProps } from 'react-native';
import { theme } from '@/config/theme';

// Este componente simple nos permitirá aplicar estilos del tema rápidamente.
// Lo expandiremos según sea necesario.
const Box = (props: ViewProps) => {
  return <View {...props} />;
};

export default Box;