"use client";

import React from "react";
import { useController, useFormContext } from "react-hook-form";
import type { Control, FieldPath, FieldValues, RegisterOptions } from "react-hook-form";
import { Combobox } from "../Combobox";
import type { ComboboxProps } from "../Combobox";

export type RHFComboboxProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  control?: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
} & Omit<ComboboxProps, "value" | "onChange" | "error">;

export function RHFCombobox<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  ...rest
}: RHFComboboxProps<TFieldValues>) {
  const formContext = useFormContext<TFieldValues>();
  const { field, fieldState } = useController({
    name,
    control: control ?? formContext?.control,
    rules,
  });

  return (
    <Combobox
      {...rest}
      value={field.value ?? ""}
      onChange={field.onChange}
      error={fieldState.error?.message}
    />
  );
}
