import React from "react";
import { useField } from "formik";
import { SelectField } from "../SelectField";
import type { SelectFieldProps } from "../SelectField";

export type FormikSelectFieldProps = {
  name: string;
} & Omit<SelectFieldProps, "value" | "onChange" | "error">;

export function FormikSelectField({ name, ...rest }: FormikSelectFieldProps) {
  const [field, meta, helpers] = useField<string>(name);

  return (
    <SelectField
      {...rest}
      value={field.value ?? ""}
      onChange={helpers.setValue}
      error={meta.touched ? meta.error : undefined}
    />
  );
}
