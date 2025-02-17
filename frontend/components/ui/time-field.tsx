import { Input } from "@/components/ui/input";
import * as React from "react";

interface TimeFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  value: Date;
  onChange: (date: Date) => void;
}

export function TimeField({ value, onChange, ...props }: TimeFieldProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = event.target.value.split(":").map(Number);
    const newDate = new Date(value);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    onChange(newDate);
  };

  return (
    <Input
      type="time"
      value={`${value.getHours().toString().padStart(2, "0")}:${value
        .getMinutes()
        .toString()
        .padStart(2, "0")}`}
      onChange={handleChange}
      {...props}
    />
  );
}
