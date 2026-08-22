import React from "react";
import { useField } from "formik";
import { RadioGroup } from "../RadioGroup";
import type { RadioGroupProps } from "../RadioGroup";

export type FormikRadioGroupProps = {
  name: string;
} & Omit<RadioGroupProps, "value" | "onChange" | "error">;

export function FormikRadioGroup({ name, ...rest }: FormikRadioGroupProps) {
  const [field, meta, helpers] = useField<string>(name);

  return (
    <RadioGroup
      {...rest}
      value={field.value ?? ""}
      onChange={helpers.setValue}
      error={meta.touched ? meta.error : undefined}
    />
  );
}
