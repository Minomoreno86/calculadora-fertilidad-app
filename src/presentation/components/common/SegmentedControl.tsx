import { View, Pressable, StyleSheet } from 'react-native';
import Text from './Text';
import { theme } from '../../../config/theme';

type Props = {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
};

export const SegmentedControl = ({ options, selectedValue, onSelect }: Props) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <Pressable
          key={option}
          style={[
            styles.segment,
            selectedValue === option && styles.segmentActive,
          ]}
          onPress={() => onSelect(option)}
        >
          <Text
            style={[
              styles.segmentText,
              selectedValue === option && styles.segmentTextActive,
            ]}
          >
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginBottom: 16,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: theme.colors.primary,
  },
  segmentText: {
    color: theme.colors.primary,
    textTransform: 'capitalize',
  },
  segmentTextActive: {
    color: theme.colors.buttonText,
    fontWeight: 'bold',
  },
});