export function createDefaultError(msg: string) {
  return {
    success: false,
    message: msg || "Something went wrong. Please try again",
  };
}

export const mapAuthError = (error: any): string => {
  const code = error?.code;

  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/weak-password":
      return "Password must be at least 6 characters.";

    case "auth/user-not-found":
      return "No account found with this email.";

    case "auth/invalid-credential":
      return "Incorrect email or password.";

    case "auth/network-request-failed":
      return "Network error. Check your internet connection.";

    default:
      return "Something went wrong. Please try again later.";
  }
};
