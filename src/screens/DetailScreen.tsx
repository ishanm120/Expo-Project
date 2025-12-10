import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, Image, KeyboardAvoidingView, Platform, useColorScheme, Keyboard } from "react-native";
import { z } from "zod";
import FormInput from "../components/FormInput";
import axios from "axios";
import CustomButton from "../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Color from "../constraints/Color";

const userSchema = z.object({
  firstName: z.string()
    .min(3, "First Name must be at least 3 characters")
    .regex(/^\S+$/, "First Name cannot contain spaces"),

  lastName: z.string()
    .trim()
    .optional(),

  email: z.string()
    .email("Enter a valid email address"),

  phone: z.string()
    .regex(/^[0-9]{10}$/, "Phone Number must be 10 digits"),
});



type UserForm = z.infer<typeof userSchema>;

const DetailScreen = (probs) => {
  const { image, aspectRatio } = useMemo(() => probs.route.params, [])

  const colorScheme = useColorScheme();
  const ColorsBasedOnThem = useMemo(() => colorScheme === 'dark' ? Color.Dark : Color.Light, [colorScheme]);

  const [disableButton, setDisableButton] = useState(false)

  interface FormData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  }
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserForm, string>>>({});

  const handleChange = useCallback((value: string, field: keyof UserForm) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    try {
      userSchema.pick({ [field]: true }).parse({ [field]: value ?? "" });
      setErrors(prev => ({ ...prev, [field]: "" }));
    } catch (err: any) {
      const message = err?.errors?.[0]?.message ?? "";
      setErrors(prev => ({ ...prev, [field]: message }));
    }
  }, []);



  const handleSubmit = useCallback(async () => {
    try {
      Keyboard.dismiss()
      setDisableButton(true)

      let res = checkValidation(formData);
      if (!res) {
        setDisableButton(false);
        return;
      }

      const URL = "https://dev3.xicomtechnologies.com/xttest/savedata.php";

      const formDataToSend = new FormData();
      formDataToSend.append("first_name", res.firstName);
      formDataToSend.append("last_name", res.lastName);
      formDataToSend.append("email", res.email);
      formDataToSend.append("phone", res.phone);

      if (image && image.xt_image) {
        formDataToSend.append("user_image", {
          uri: image.xt_image,
          name: image?.fileName || "profile.jpg",
          type: image?.type || "image/jpeg",
        });
      }
      await axios.post(URL, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "*/*",
        },
      });
      Alert.alert("Success", "Form submitted successfully!");
      setErrors({});
      clearState()
    } catch (error: any) {
      Alert.alert("Error", "Upload failed!");
    } finally {
      setDisableButton(false)
    }
  }, [formData, errors]);

  const clearState = useCallback(() => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      phone: ""
    })
  }, [])


  const checkValidation = useCallback((body: UserForm): UserForm | null => {
    const result = userSchema.safeParse(body);
    if (!result.success) {
      const errorMessages = result.error.issues
        .map((e) => e.message)
        .join("\n");

      const formattedErrors: Record<string, string> = {};

      result.error.issues.forEach((err) => {
        const fieldName = err.path[0];
        formattedErrors[fieldName] = err.message;
      });

      setErrors(formattedErrors);
      Alert.alert("Validation Error", errorMessages);
      return null;
    }

    setErrors({});
    return result.data;
  }, [errors]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ColorsBasedOnThem.Page_Background_Color }} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: ColorsBasedOnThem.Page_Background_Color }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.contentContainer, { backgroundColor: ColorsBasedOnThem.Page_Background_Color }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.title, { color: ColorsBasedOnThem.Modal_label_Text_Color }]}>User Details</Text>

          {/* ---- Display Image ---- */}
          {image ? (
            <Image
              source={{ uri: image.xt_image }}
              style={[styles.image, { aspectRatio }]}
            />
          ) : (
            <Text style={{ color: "red", marginBottom: 10 }}>No Image Found</Text>
          )}

          <FormInput
            label="First Name"
            required
            value={formData.firstName}
            error={errors.firstName}
            onChangeText={(text) => handleChange(text, "firstName")}
          />

          <FormInput
            label="Last Name"
            value={formData.lastName}
            error={errors.lastName}
            onChangeText={(text) => handleChange(text, "lastName")}
          />

          <FormInput
            label="Email"
            required
            keyboardType="email-address"
            value={formData.email}
            error={errors.email}
            onChangeText={(text) => handleChange(text, "email")}
          />

          <FormInput
            label="Phone Number"
            required
            keyboardType="number-pad"
            value={formData.phone}
            error={errors.phone}
            onChangeText={(text) => handleChange(text, "phone")}
          />



          <View style={styles.buttonContainer}>
            <CustomButton title={"Submit"} onPress={handleSubmit} disabled={disableButton} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
};

export default memo(DetailScreen);



const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: 'center'
  },
  image: {
    width: "100%",
    resizeMode: "contain",
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
});