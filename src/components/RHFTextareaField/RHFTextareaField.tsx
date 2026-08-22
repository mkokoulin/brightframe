"use client";

import React from "react";
import { useController, useFormContext } from "react-hook-form";
import type { Control, FieldPath, FieldValues, RegisterOptions } from "react-hook-form";
import { TextareaField } from "../TextareaField";
import type { TextareaFieldProps } from "../TextareaField";

export type RHFTextareaFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  control?: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
} & Omit<TextareaFieldProps, "value" | "onChange" | "onBlur" | "error">;

export function RHFTextareaField<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  ...rest
}: RHFTextareaFieldProps<TFieldValues>) {
  const formContext = useFormContext<TFieldValues>();
  const { field, fieldState } = useController({
    name,
    control: control ?? formContext?.control,
    rules,
  });

  return (
    <TextareaField
      {...rest}
      name={field.name}
      value={field.value ?? ""}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  );
}
