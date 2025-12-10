import React, { memo, useMemo } from "react";
import { TouchableOpacity, Text, StyleSheet, useColorScheme } from "react-native";
import Color from "../constraints/Color";


interface CustomButtonProps {
    title: string | JSX.Element;
    onPress: () => void;
    disabled?: boolean;
    bgColor?: string;
    textColor?: string;
    width?: number;
    type?: "APPROVE" | "REJECT" | "CANCEL" | "SUBMIT" | "";
}

const CustomButton = ({ title, onPress, disabled, bgColor, textColor, width, type = "" }: CustomButtonProps) => {


    const colorScheme = useColorScheme();
    const ColorsBasedOnThem = useMemo(() => colorScheme === 'dark' ? Color.Dark : Color.Light, [colorScheme]);

    let backgroundColor = "";
    switch (type) {
        case "APPROVE":
            backgroundColor = "green";
            break;
        case "REJECT":
            backgroundColor = "red";
            break;
        case "CANCEL":
            backgroundColor = "orange";
            break;
        case "SUBMIT":
            backgroundColor = "blue";
            break;
    }

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: backgroundColor || ColorsBasedOnThem.Button_Background_Color,
                    borderColor: ColorsBasedOnThem.Button_Border_Color,
                },
                disabled && { backgroundColor: ColorsBasedOnThem.Disable_Button_Background_Color },
                bgColor && { backgroundColor: bgColor },
                width ? { width: width } : {}]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[styles.buttonText, { color: textColor || ColorsBasedOnThem.Button_Text_Color }]}>{title}</Text>
        </TouchableOpacity>
    );
};

export default memo(CustomButton);

const styles = StyleSheet.create({
    button: {
        paddingVertical: 6,
        paddingHorizontal: 15,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 5,
    },
    buttonText: {
        fontWeight: "bold",
        fontSize: 16,
    },
});