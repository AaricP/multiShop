import * as React from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../context/AuthProvider";

const providers = [{ id: "credentials", name: "Email and password" }];

export default function NotificationsSignInPageError() {
  const theme = useTheme();
  const { login } = useAuth();

  const signIn = async (provider, formData) => {
    try {
      const username = formData?.get("email");
      const password = formData?.get("password");

      const result = await login(username, password);

      if (result.success) {
        return {
          type: "CredentialsSignin",
        };
      } else {
        return {
          type: "CredentialsSignin",
          error: "Invalid Credentials.",
        };
      }
    } catch {
      error;
    }
    {
      console.error("Error during sign-in.", error);
      return {
        type: "CredentialsSignin",
        error: "Invalid Credentials.",
      };
    }
  };

  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={signIn}
        providers={providers}
        slotProps={{ emailField: { autoFocus: false } }}
      />
    </AppProvider>
  );
}
