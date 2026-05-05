import * as Yup from "yup";

export const passwordSchema = () =>
  Yup.string()
    .required("Password is required")
    .min(
      8,
      "Password should contain at least 8 characters and must contain at least one uppercase letter, one lowercase letter, and one special character",
    )
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password should contain at least 8 characters and must contain at least one uppercase letter, one lowercase letter, and one special character",
    );

export const confirmPasswordSchema = () =>
  Yup.string()
    .required("Confirm your password")
    .oneOf(
      [Yup.ref("password")],
      "Confirm Password should be same as the original Password",
    );
