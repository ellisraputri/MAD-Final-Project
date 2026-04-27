export function createDefaultError(msg: string) {
  return {
    success: false,
    message: msg || "Something went wrong. Please try again",
  };
}
