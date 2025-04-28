
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TimeSelectorProps {
  onSelectTime: (time: number) => void;
  onSelectFormat: (format: "text" | "audio") => void;
  onSubmit: () => void;
  disabled: boolean;
}

const TimeSelector = ({ onSelectTime, onSelectFormat, onSubmit, disabled }: TimeSelectorProps) => {
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<"text" | "audio">("text");
  
  const handleTimeSelect = (time: number) => {
    setSelectedTime(time);
    onSelectTime(time);
  };
  
  const handleFormatSelect = (format: "text" | "audio") => {
    setSelectedFormat(format);
    onSelectFormat(format);
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">How much time do you have?</h3>
          <div className="flex flex-wrap gap-2">
            {[1, 3, 5].map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className="flex-1"
                onClick={() => handleTimeSelect(time)}
                disabled={disabled}
              >
                {time} min
              </Button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Choose format</h3>
          <div className="flex gap-2">
            <Button
              variant={selectedFormat === "text" ? "default" : "outline"}
              className="flex-1"
              onClick={() => handleFormatSelect("text")}
              disabled={disabled}
            >
              Text
            </Button>
            <Button
              variant={selectedFormat === "audio" ? "default" : "outline"}
              className="flex-1"
              onClick={() => handleFormatSelect("audio")}
              disabled
            >
              Audio (coming soon)
            </Button>
          </div>
        </div>
        
        <Button
          className="w-full"
          disabled={!selectedTime || disabled}
          onClick={onSubmit}
        >
          {disabled ? "Generating..." : "Generate Summary"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TimeSelector;
