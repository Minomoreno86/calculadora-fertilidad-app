declare module 'react' {
  import React from 'react';
  export = React;
  export as namespace React;
  
  export interface FC<P = {}> {
    (props: P): JSX.Element | null;
  }
  
  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prevState: S) => S)) => void];
  export function useMemo<T>(factory: () => T, deps: React.DependencyList | undefined): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: React.DependencyList): T;
  
  export interface DependencyList extends ReadonlyArray<any> {}
}

declare module 'react-native' {
  import React from 'react';
  
  export interface ViewStyle {
    flex?: number;
    flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    padding?: number;
    paddingHorizontal?: number;
    paddingVertical?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    margin?: number;
    marginHorizontal?: number;
    marginVertical?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    backgroundColor?: string;
    borderRadius?: number;
    borderWidth?: number;
    borderLeftWidth?: number;
    borderRightWidth?: number;
    borderTopWidth?: number;
    borderBottomWidth?: number;
    borderColor?: string;
    borderLeftColor?: string;
    borderRightColor?: string;
    borderTopColor?: string;
    borderBottomColor?: string;
    width?: number | string;
    height?: number | string;
    minWidth?: number | string;
    minHeight?: number | string;
    maxWidth?: number | string;
    maxHeight?: number | string;
    position?: 'absolute' | 'relative';
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    zIndex?: number;
    opacity?: number;
    overflow?: 'visible' | 'hidden' | 'scroll';
    shadowColor?: string;
    shadowOffset?: { width: number; height: number };
    shadowOpacity?: number;
    shadowRadius?: number;
    elevation?: number;
    transform?: Array<any>;
    [key: string]: any;
  }
  
  export interface TextStyle extends ViewStyle {
    fontSize?: number;
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    fontStyle?: 'normal' | 'italic';
    fontFamily?: string;
    color?: string;
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    lineHeight?: number;
    letterSpacing?: number;
    textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
    textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed';
    textDecorationColor?: string;
    textShadowColor?: string;
    textShadowOffset?: { width: number; height: number };
    textShadowRadius?: number;
    textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
    writingDirection?: 'auto' | 'ltr' | 'rtl';
    [key: string]: any;
  }
  
  export interface ImageStyle extends ViewStyle {
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
    tintColor?: string;
    overlayColor?: string;
    [key: string]: any;
  }
  
  export interface ViewProps {
    style?: ViewStyle | ViewStyle[];
    children?: React.ReactNode;
  }
  
  export interface TextProps {
    style?: TextStyle | TextStyle[];
    children?: React.ReactNode;
    numberOfLines?: number;
  }
  
  export interface ScrollViewProps extends ViewProps {
    showsVerticalScrollIndicator?: boolean;
  }
  
  export interface TouchableOpacityProps extends ViewProps {
    onPress?: () => void;
    disabled?: boolean;
  }
  
  export const View: React.FC<ViewProps>;
  export const Text: React.FC<TextProps>;
  export const ScrollView: React.FC<ScrollViewProps>;
  export const TouchableOpacity: React.FC<TouchableOpacityProps>;
  
  export const Platform: {
    OS: 'ios' | 'android' | 'windows' | 'macos' | 'web';
    Version: string | number;
    isPad?: boolean;
    isTVOS?: boolean;
    isTV?: boolean;
    select<T>(specifics: { ios?: T; android?: T; default?: T }): T;
  };
  
  export const StyleSheet: {
    create<T>(styles: T): T;
  };
}

declare module '@expo/vector-icons' {
  import React from 'react';
  
  export interface IoniconsProps {
    name: string;
    size?: number;
    color?: string;
  }
  
  export const Ionicons: React.FC<IoniconsProps>;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}
