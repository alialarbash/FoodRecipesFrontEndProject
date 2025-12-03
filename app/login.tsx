import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../contexts/AuthContext";
import { GlassView } from "../src/components/glass/GlassView";
import { colors } from "../src/theme/colors";
import { typography } from "../src/theme/styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  authService,
  LoginCredentials,
  SignUpCredentials,
} from "../src/services/auth";

export default function LoginScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({});
  const { setIsAuthenticated } = useContext(AuthContext);

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission needed",
            "Sorry, we need camera roll permissions to upload your profile picture!"
          );
        }
      }
    })();
  }, []);

  // Reset form when switching between login/signup
  useEffect(() => {
    setEmail("");
    setPassword("");
    setName("");
    setImage(null);
    setErrors({});
  }, [isSignUp]);

  // Validate form
  useEffect(() => {
    const newErrors: typeof errors = {};

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (isSignUp && name && name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    setErrors(newErrors);
  }, [email, password, name, isSignUp]);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        Alert.alert("Error", data.message || "Login failed");
      }
    },
    onError: (error) => {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("Login error:", error);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (credentials: SignUpCredentials) =>
      authService.signUp(credentials),
    onSuccess: (data) => {
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        Alert.alert("Error", data.message || "Sign up failed");
      }
    },
    onError: (error) => {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("Sign up error:", error);
    },
  });

  const handleSubmit = () => {
    // Clear previous errors
    setErrors({});

    // Validate required fields
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (isSignUp && !name) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    // Check for validation errors
    if (Object.keys(errors).length > 0) {
      Alert.alert("Error", "Please fix the errors in the form");
      return;
    }

    if (isSignUp) {
      signUpMutation.mutate({ name, email, password, image: image || undefined });
    } else {
      loginMutation.mutate({ email, password });
    }
  };

  const isLoading = loginMutation.isPending || signUpMutation.isPending;

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      console.error("Image picker error:", error);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Sorry, we need camera permissions to take a photo!"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
      console.error("Camera error:", error);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      "Select Profile Picture",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: takePhoto,
        },
        {
          text: "Photo Library",
          onPress: pickImage,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              {isSignUp ? "Create Account" : "Welcome Back"}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp
                ? "Sign up to discover amazing recipes"
                : "Sign in to continue"}
            </Text>
          </View>

          <GlassView variant="card" style={styles.formContainer}>
            <View style={styles.form}>
              {isSignUp && (
                <>
                  <View style={styles.imageContainer}>
                    <TouchableOpacity
                      style={styles.imagePicker}
                      onPress={showImagePickerOptions}
                      disabled={isLoading}
                      activeOpacity={0.8}
                    >
                      {image ? (
                        <Image source={{ uri: image }} style={styles.profileImage} />
                      ) : (
                        <View style={styles.placeholderImage}>
                          <MaterialIcons
                            name="add-a-photo"
                            size={32}
                            color={colors.light.textSecondary}
                          />
                        </View>
                      )}
                      <View style={styles.editIcon}>
                        <MaterialIcons
                          name="edit"
                          size={16}
                          color="#FFFFFF"
                        />
                      </View>
                    </TouchableOpacity>
                    <Text style={styles.imageLabel}>Profile Picture</Text>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Full Name</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      errors.name && styles.inputWrapperError,
                    ]}
                  >
                    <MaterialIcons
                      name="person"
                      size={20}
                      color={colors.light.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your name"
                      placeholderTextColor={colors.light.textSecondary}
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      editable={!isLoading}
                    />
                  </View>
                  {errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                  </View>
                </>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.email && styles.inputWrapperError,
                  ]}
                >
                  <MaterialIcons
                    name="email"
                    size={20}
                    color={colors.light.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.light.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!isLoading}
                  />
                </View>
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    errors.password && styles.inputWrapperError,
                  ]}
                >
                  <MaterialIcons
                    name="lock"
                    size={20}
                    color={colors.light.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.light.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete={isSignUp ? "password-new" : "password"}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                    disabled={isLoading}
                  >
                    <MaterialIcons
                      name={showPassword ? "visibility" : "visibility-off"}
                      size={20}
                      color={colors.light.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isLoading && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {isSignUp ? "Sign Up" : "Sign In"}
                  </Text>
                )}
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                <MaterialIcons
                  name="account-circle"
                  size={20}
                  color={colors.light.text}
                />
                <Text style={styles.socialButtonText}>
                  Continue with Google
                </Text>
              </TouchableOpacity>
            </View>
          </GlassView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isSignUp
                ? "Already have an account? "
                : "Don't have an account? "}
            </Text>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.footerLink}>
                {isSignUp ? "Sign In" : "Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    ...typography.h1,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    ...typography.subtitle,
    textAlign: "center",
  },
  formContainer: {
    padding: 24,
    marginBottom: 24,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    ...typography.body,
    fontWeight: "600",
    marginBottom: 8,
    color: colors.light.text,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.light.text,
    padding: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  submitButton: {
    backgroundColor: colors.mint,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: colors.mint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    ...typography.h3,
    color: "#FFFFFF",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.light.border,
  },
  dividerText: {
    ...typography.caption,
    marginHorizontal: 16,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
    paddingVertical: 14,
    gap: 8,
  },
  socialButtonText: {
    ...typography.body,
    fontWeight: "600",
    color: colors.light.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    ...typography.body,
    color: colors.light.textSecondary,
  },
  footerLink: {
    ...typography.body,
    fontWeight: "600",
    color: colors.mint,
  },
  inputWrapperError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  imagePicker: {
    position: "relative",
    marginBottom: 8,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.light.border,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 2,
    borderColor: colors.light.border,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.mint,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  imageLabel: {
    ...typography.caption,
    color: colors.light.textSecondary,
  },
});
