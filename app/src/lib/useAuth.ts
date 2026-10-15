import { useContext } from "react";
import { AuthContext, type AuthState } from "./authContext";

/** Read the shared auth state. Must be used within <AuthProvider>. */
export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
