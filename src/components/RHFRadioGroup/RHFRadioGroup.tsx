"use client";

import React from "react";
import { useController, useFormContext } from "react-hook-form";
import type { Control, FieldPath, FieldValues, RegisterOptions } from "react-hook-form";
import { RadioGroup } from "../RadioGroup";
import type { RadioGroupProps } from "../RadioGroup";

export type RHFRadioGroupProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  control?: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
} & Omit<RadioGroupProps, "value" | "onChange" | "error">;

export function RHFRadioGroup<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  ...rest
}: RHFRadioGroupProps<TFieldValues>) {
  const formContext = useFormContext<TFieldValues>();
  const { field, fieldState } = useController({
    name,
    control: control ?? formContext?.control,
    rules,
  });

  return (
    <RadioGroup
      {...rest}
      value={field.value ?? ""}
      onChange={field.onChange}
      error={fieldState.error?.message}
    />
  );
}
