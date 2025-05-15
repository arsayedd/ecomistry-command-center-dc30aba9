
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Entity {
  id: string;
  name?: string;
  full_name?: string;
}

interface EntitySelectProps {
  value: string;
  onChange: (value: string) => void;
  entities: Entity[];
  placeholder: string;
  emptyLabel: string;
}

export function EntitySelect({
  value,
  onChange,
  entities,
  placeholder,
  emptyLabel
}: EntitySelectProps) {
  return (
    <div className="w-full md:w-auto">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">{emptyLabel}</SelectItem>
          {entities.map((entity) => (
            <SelectItem key={entity.id} value={entity.id}>
              {entity.name || entity.full_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
