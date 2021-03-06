import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { string, func, shape } from 'prop-types';

export default function Button(props) {
  const { style, label, onPress } = props;
  return (
    <TouchableOpacity style={[styles.buttonContainer, style]} onPress={onPress}>
      <Text style={[styles.buttonLabel, style]}>{label}</Text>
    </TouchableOpacity>
  );
}

Button.propTypes = {
  style: shape(),
  label: string.isRequired,
  onPress: func,
};

Button.defaultProps = {
  style: null,
  onPress: null,
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#ce9eff',
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  buttonLabel: {
    fontSize: 16,
    lineHeight: 32,
    paddingVertical: 8,
    paddingHorizontal: 32,
    color: '#ffffff',
  },
});
