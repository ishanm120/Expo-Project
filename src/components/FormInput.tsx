import React, { memo, useCallback, useMemo } from "react";
import { Text, TextInput, View, StyleSheet, TextInputProps, useColorScheme } from "react-native";
import Color from "../constraints/Color";

interface FormInputProps {
  label: string;
  value: string;
  keyboardType?: TextInputProps["keyboardType"];
  error?: string;
  onChangeText: (value: string) => void;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  keyboardType = "default",
  error,
  onChangeText,
  required = false,
}) => {
  const colorScheme = useColorScheme();
  const ColorsBasedOnThem = useMemo(() => colorScheme === 'dark' ? Color.Dark : Color.Light, [colorScheme]);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[styles.label, { color: ColorsBasedOnThem.Lable_Font_Color }]}>
        {label} {required && <Text style={{ color: "red" }}>*</Text>}
      </Text>

      <TextInput
        style={[styles.input, { color: ColorsBasedOnThem.Input_Fild_Text_Color }, error ? styles.inputError : null]}
        value={value}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
      />

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠ {error}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default memo(FormInput);

const styles = StyleSheet.create({
  label: { fontSize: 15, fontWeight: "500", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#c6c6c6",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: "red",
  },
  errorContainer: {
    marginTop: 4,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});
