import * as Yup from "yup";

// ---------------------------------------------------------
//
//                     Common Schemas
//
// ---------------------------------------------------------

export const nameSchema = ({ fieldName }: { fieldName: string }) =>
  Yup.string()
    .required(`${fieldName} is required`)
    .min(3, `${fieldName} must contain at least 3 characters`)
    .max(35, `${fieldName} cannot exceed 35 characters`)
    .notOnlySpacesRule(`${fieldName} cannot contain only empty spaces`)
    .notOnlySpecialCharsRule(`${fieldName} cannot contain only special characters`);

export const emailSchema = () =>
  Yup.string()
    .required("Email is required")
    .isValidEmail("Email should be valid")
    .notOnlySpacesRule("Email cannot contain only empty spaces")
    .notOnlySpecialCharsRule("Email cannot contain only special characters");

export const phoneSchema = () =>
  Yup.string()
    .required("Phone number is required")
    .isValidPhoneNumber("Phone number should be valid");
