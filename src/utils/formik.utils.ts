import { FormikProps } from "formik";

export function extractFormikTouchAndError<T extends object>(
  formik: FormikProps<T>,
  key: keyof T,
): string | undefined {
  const touched = formik.touched[key];
  const error = formik.errors[key];

  if (touched && error) {
    return error as string;
  }

  return undefined;
}
