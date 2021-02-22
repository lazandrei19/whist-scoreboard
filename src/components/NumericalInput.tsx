import React, { useState } from "react";

interface OwnProps {
  value: number | undefined;
  onChange: (val: number | undefined) => void;
  maxValue?: number;
}

const NumericalInput: React.FC<OwnProps> = ({ value, onChange, maxValue }) => {
  const [localValue, setLocalValue] = useState(value?.toString() ?? "");
  const localOnChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(ev.target.value);
    // debugger;
    if (isNaN(num)) {
      onChange(undefined);
      setLocalValue("");
    } else if (maxValue === undefined || num <= maxValue) {
      onChange(num);
      setLocalValue(num.toString());
    } else {
      onChange(undefined);
    }
  };

  return (
    <input
      value={localValue}
      onChange={localOnChange}
      style={{
        width: "10px",
      }}
    />
  );
};

export default NumericalInput;
