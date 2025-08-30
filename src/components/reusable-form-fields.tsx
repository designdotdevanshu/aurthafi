"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FieldWrapperProps = {
  control: any;
  name: string;
  label?: string;
  render: (field: any) => React.ReactNode;
};

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  control: any;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

type SelectFieldProps = {
  id?: string;
  control: any;
  name: string;
  label: string;
  options: { value: string; label: string }[];
  children?: React.ReactNode;
};

const FieldWrapper: React.FC<FieldWrapperProps> = ({
  control,
  name,
  label,
  render,
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        {label && <FormLabel>{label}</FormLabel>}
        {render(field)}
        <FormMessage />
      </FormItem>
    )}
  />
);

const InputField: React.FC<InputFieldProps> = ({
  control,
  name,
  label,
  type = "text",
  placeholder = "",
  ...props
}) => (
  <FieldWrapper
    control={control}
    name={name}
    label={label}
    render={(field) => (
      <FormControl>
        <Input
          type={type}
          placeholder={placeholder}
          {...field}
          {...props}
          value={field.value || ""}
        />
      </FormControl>
    )}
  />
);

const SelectField: React.FC<SelectFieldProps> = ({
  control,
  id,
  name,
  label,
  options,
  children,
}) => (
  <FieldWrapper
    control={control}
    name={name}
    label={label}
    render={(field) => (
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
          {children}
        </SelectContent>
      </Select>
    )}
  />
);

export { FieldWrapper, InputField, SelectField };
