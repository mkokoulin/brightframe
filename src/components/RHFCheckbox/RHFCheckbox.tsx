"use client";

import React from "react";
import { useController, useFormContext } from "react-hook-form";
import type { Control, FieldPath, FieldValues, RegisterOptions } from "react-hook-form";
import { Checkbox } from "../Checkbox";
import type { CheckboxProps } from "../Checkbox";

export type RHFCheckboxProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  control?: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
} & Omit<CheckboxProps, "checked" | "onChange" | "error">;

export function RHFCheckbox<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  ...rest
}: RHFCheckboxProps<TFieldValues>) {
  const formContext = useFormContext<TFieldValues>();
  const { field, fieldState } = useController({
    name,
    control: control ?? formContext?.control,
    rules,
  });

  return (
    <Checkbox
      {...rest}
      name={field.name}
      checked={!!field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  );
}
