"use client";

import React from "react";
import { useField } from "formik";
import { LabeledField } from "../LabeledField";
import type { LabeledFieldProps } from "../LabeledField";

export type FormikTextFieldProps = {
  name: string;
} & Omit<LabeledFieldProps, "value" | "onChange" | "onBlur" | "error">;

export function FormikTextField({ name, ...rest }: FormikTextFieldProps) {
  const [field, meta, helpers] = useField<string>(name);

  return (
    <LabeledField
      {...rest}
      name={field.name}
      value={field.value ?? ""}
      onChange={helpers.setValue}
      onBlur={() => helpers.setTouched(true)}
      error={meta.touched ? meta.error : undefined}
    />
  );
}
