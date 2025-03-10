import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { document } from "postcss";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);
  const [signInError, setSignInError] = useState(null);
  const [signUpError, setSignUpError] = useState(null);
  const [signUpSuccess, setSignUpSuccess] = useState(null); // New state for successful sign-up message

  async function handleRegisterUser(event) {
    event.preventDefault();
    setSignUpError(null); // Reset any previous error
    setSignUpSuccess(null); // Reset any previous success message

    try {
      const data = await registerService(signUpFormData);
      console.log("cls"+data);
      if (!data.success && data.message === "User name or user email already exists") {
        setSignUpError("Email is already registered. Please try logging in.");
        document.alert("Email is already registered. Please try logging in");
      } else if (!data.success) {
        setSignUpError("Registration failed. Please try again.");
        document.alert("Registration failed. Please try again.");
      } else {
        setSignUpSuccess("Registration successful! You can now log in.");
        document.alert("Registration successful! You can now log in.");
      }
    } catch (error) {
        setSignUpError("Email is already registered. Please try logging in.");
        document.alert("Email is already registered. Please try logging in");
        
      console.log(error);
    }
  }

  async function handleLoginUser(event) {
    event.preventDefault();
    setSignInError(null); // Reset any previous error

    try {
      const data = await loginService(signInFormData);
      if (data.success) {
        sessionStorage.setItem("accessToken", JSON.stringify(data.data.accessToken));
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else if (data.errorCode === "INVALID_CREDENTIALS") {
        setSignInError("Invalid email or password. Please try again.");
        document.alert("Invalid email or password. Please try again.");
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
        setSignInError("Login failed. Please try again.");
        document.alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setSignInError("Invalid Email_id or Password");
      document.alert("Invalid Email_id or Password");
    }
  }

  // Check auth user
  async function checkAuthUser() {
    try {
      const data = await checkAuthService();
      if (data.success) {
        setAuth({
          authenticate: true,
          user: data.data.user,
        });
      } else {
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    } catch (error) {
      console.log(error);
      setAuth({
        authenticate: false,
        user: null,
      });
    } finally {
      setLoading(false);
    }
  }

  function resetCredentials() {
    setAuth({
      authenticate: false,
      user: null,
    });
  }

  useEffect(() => {
    checkAuthUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
        handleRegisterUser,
        handleLoginUser,
        auth,
        signInError, // Exporting the sign-in error
        signUpError, // Exporting the sign-up error
        signUpSuccess, // Exporting the sign-up success message
        resetCredentials,
      }}
    >
      {loading ? <Skeleton /> : children}
    </AuthContext.Provider>
  );
}
