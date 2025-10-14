import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  description?: string;
  unit?: string;
}

export const NumberInput = ({
  value,
  onChange,
  min = 1,
  max = 100,
  step = 1,
  label,
  description,
  unit = "px",
}: NumberInputProps) => {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const numValue = parseFloat(newValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue) || numValue < min || numValue > max) {
      setInputValue(value.toString());
    }
  };

  const increment = () => {
    const newValue = Math.min(value + step, max);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const decrement = () => {
    const newValue = Math.max(value - step, min);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleSliderChange = (newValue: number[]) => {
    onChange(newValue[0]);
    setInputValue(newValue[0].toString());
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-all shadow-none">
      <div className="flex items-center justify-between gap-4 shadow-none">
        <div className="flex-1">
          {label && (
            <label className="text-sm font-semibold text-foreground">
              {label}
            </label>
          )}
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={decrement}
            disabled={value <= min}
            className="h-8 w-8 shrink-0 rounded-lg transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <div className="relative">
            <Input
              disabled={true}
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              min={min}
              max={max}
              step={step}
              className="h-8 w-24 rounded-lg border-2 text-center font-semibold tabular-nums transition-all focus:scale-105 focus:border-primary cursor-pointer"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              {unit}
            </span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={increment}
            disabled={value >= max}
            className="h-8 w-8 shrink-0 rounded-lg transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative pt-4">
        <Slider
          value={[value]}
          onValueChange={handleSliderChange}
          max={max}
          min={min}
          step={step}
          className="w-full cursor-pointer"
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>
            {min}
            {unit}
          </span>
          <span>
            {max}
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
};
