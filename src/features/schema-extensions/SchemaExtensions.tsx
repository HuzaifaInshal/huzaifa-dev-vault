"use client";
import * as Yup from "yup";
import {
  notOnlySpaces,
  notOnlySpecialChars,
  validEmailPattern,
  validLinkPattern,
} from "./schema-regex";
import parsePhoneNumberFromString from "libphonenumber-js";

// ---------------------------------------------------------
//
//                     Yup Extensions
//
// ---------------------------------------------------------

// Extend Yup StringSchema to add chainable methods
declare module "yup" {
  interface StringSchema {
    notOnlySpacesRule(message: string): this;
    notOnlySpecialCharsRule(message: string): this;
    isValidLink(message: string): this;
    isValidPhoneNumber(message: string): this;
    isValidEmail(message: string): this;
  }
}

const YupSchemaExtensions = () => {
  // Add the methods to Yup StringSchema prototype
  Yup.addMethod(Yup.string, "notOnlySpacesRule", function (message: string) {
    return this.matches(notOnlySpaces, message);
  });

  Yup.addMethod(Yup.string, "isValidEmail", function (message: string) {
    return this.email(message).matches(validEmailPattern, message);
  });

  Yup.addMethod(
    Yup.string,
    "notOnlySpecialCharsRule",
    function (message: string) {
      return this.matches(notOnlySpecialChars, message);
    },
  );

  Yup.addMethod(Yup.string, "isValidLink", function (message: string) {
    return this.matches(validLinkPattern, message);
  });

  Yup.addMethod(Yup.string, "isValidPhoneNumber", function (message: string) {
    return this.test("is-valid-phone", message, (value) => {
      if (
        !value ||
        value.length === 0 ||
        value.replaceAll("+", "").length === 0
      )
        return true;
      try {
        const phoneNumber = parsePhoneNumberFromString(
          `+${value.replaceAll("+", "")}`,
        );
        return phoneNumber ? phoneNumber.isValid() : false;
      } catch {
        return false;
      }
    });
  });

  return null;
};

export default YupSchemaExtensions;
