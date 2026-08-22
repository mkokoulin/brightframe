"use client";

import React from "react";
import { useController, useFormContext } from "react-hook-form";
import type { Control, FieldPath, FieldValues, RegisterOptions } from "react-hook-form";
import { SelectField } from "../SelectField";
import type { SelectFieldProps } from "../SelectField";

export type RHFSelectFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  control?: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
} & Omit<SelectFieldProps, "value" | "onChange" | "error">;

export function RHFSelectField<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  ...rest
}: RHFSelectFieldProps<TFieldValues>) {
  const formContext = useFormContext<TFieldValues>();
  const { field, fieldState } = useController({
    name,
    control: control ?? formContext?.control,
    rules,
  });

  return (
    <SelectField
      {...rest}
      value={field.value ?? ""}
      onChange={field.onChange}
      error={fieldState.error?.message}
    />
  );
}
