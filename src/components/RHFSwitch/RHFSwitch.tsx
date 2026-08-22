"use client";

import React from "react";
import { useController, useFormContext } from "react-hook-form";
import type { Control, FieldPath, FieldValues, RegisterOptions } from "react-hook-form";
import { Switch } from "../Switch";
import type { SwitchProps } from "../Switch";

export type RHFSwitchProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  control?: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
} & Omit<SwitchProps, "checked" | "onChange">;

export function RHFSwitch<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  rules,
  ...rest
}: RHFSwitchProps<TFieldValues>) {
  const formContext = useFormContext<TFieldValues>();
  const { field } = useController({
    name,
    control: control ?? formContext?.control,
    rules,
  });

  return <Switch {...rest} name={field.name} checked={!!field.value} onChange={field.onChange} onBlur={field.onBlur} />;
}
