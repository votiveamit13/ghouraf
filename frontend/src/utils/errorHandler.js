import { firebaseErrors } from "./errorMessages";

export const getErrorMessage = (err) => {

  if (err.code && firebaseErrors[err.code]) {
    return firebaseErrors[err.code];
  }

  return err.message || "Something went wrong. Please try again.";
};
