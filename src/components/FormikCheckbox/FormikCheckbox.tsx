"use client";

import React from "react";
import { useField } from "formik";
import { Checkbox } from "../Checkbox";
import type { CheckboxProps } from "../Checkbox";

export type FormikCheckboxProps = {
  name: string;
} & Omit<CheckboxProps, "checked" | "onChange" | "error">;

export function FormikCheckbox({ name, ...rest }: FormikCheckboxProps) {
  const [field, meta, helpers] = useField<boolean>(name);

  return (
    <Checkbox
      {...rest}
      name={field.name}
      checked={!!field.value}
      onChange={helpers.setValue}
      onBlur={() => helpers.setTouched(true)}
      error={meta.touched ? meta.error : undefined}
    />
  );
}
