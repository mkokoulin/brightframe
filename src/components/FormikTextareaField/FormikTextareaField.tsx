"use client";

import React from "react";
import { useField } from "formik";
import { TextareaField } from "../TextareaField";
import type { TextareaFieldProps } from "../TextareaField";

export type FormikTextareaFieldProps = {
  name: string;
} & Omit<TextareaFieldProps, "value" | "onChange" | "onBlur" | "error">;

export function FormikTextareaField({ name, ...rest }: FormikTextareaFieldProps) {
  const [field, meta, helpers] = useField<string>(name);

  return (
    <TextareaField
      {...rest}
      name={field.name}
      value={field.value ?? ""}
      onChange={helpers.setValue}
      onBlur={() => helpers.setTouched(true)}
      error={meta.touched ? meta.error : undefined}
    />
  );
}
