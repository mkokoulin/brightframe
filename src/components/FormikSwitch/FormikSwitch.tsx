"use client";

import React from "react";
import { useField } from "formik";
import { Switch } from "../Switch";
import type { SwitchProps } from "../Switch";

export type FormikSwitchProps = {
  name: string;
} & Omit<SwitchProps, "checked" | "onChange">;

export function FormikSwitch({ name, ...rest }: FormikSwitchProps) {
  const [field, , helpers] = useField<boolean>(name);

  return (
    <Switch
      {...rest}
      name={field.name}
      checked={!!field.value}
      onChange={helpers.setValue}
      onBlur={() => helpers.setTouched(true)}
    />
  );
}
