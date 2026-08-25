"use client";

import React from "react";
import { useField } from "formik";
import { Combobox } from "../Combobox";
import type { ComboboxProps } from "../Combobox";

export type FormikComboboxProps = {
  name: string;
} & Omit<ComboboxProps, "value" | "onChange" | "error">;

export function FormikCombobox({ name, ...rest }: FormikComboboxProps) {
  const [field, meta, helpers] = useField<string>(name);

  return (
    <Combobox
      {...rest}
      value={field.value ?? ""}
      onChange={helpers.setValue}
      error={meta.touched ? meta.error : undefined}
    />
  );
}
