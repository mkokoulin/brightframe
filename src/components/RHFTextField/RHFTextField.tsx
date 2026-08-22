"use client";

import React from "react";
import { useController, useFormContext } from "react-hook-form";
import type { Control, FieldPath, FieldValues, RegisterOptions } from "react-hook-form";
import { LabeledField } from "../LabeledField";
import type { LabeledFieldProps } from "../LabeledField";

export type RHFTextFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  control?: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
} & Omit<LabeledFieldProps, "value" | "onChange" | "onBlur" | "error">;

export function RHFTextField<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  ...rest
}: RHFTextFieldProps<TFieldValues>) {
  const formContext = useFormContext<TFieldValues>();
  const { field, fieldState } = useController({
    name,
    control: control ?? formContext?.control,
    rules,
  });

  return (
    <LabeledField
      {...rest}
      name={field.name}
      value={field.value ?? ""}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  );
}
