import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface MultiOption {
  value: string;
  label: string;
  group?: string;
}

interface MultiSelectProps {
  options: MultiOption[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
  allLabel: string;
  placeholder?: string;
  searchable?: boolean;
}

export function MultiSelect({
  options,
  selected,
  onToggle,
  onClear,
  allLabel,
  placeholder = "Search…",
  searchable = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const visible = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  const groups = [...new Set(visible.map((o) => o.group ?? ""))];

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between bg-card font-normal"
          >
            <span className="truncate">
              {selected.length === 0
                ? allLabel
                : selected.length === 1
                  ? (options.find((o) => o.value === selected[0])?.label ?? "1 selected")
                  : `${selected.length} selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          {searchable && (
            <div className="flex items-center gap-2 border-b px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="h-8 border-0 p-0 shadow-none focus-visible:ring-0"
              />
            </div>
          )}
          <ScrollArea className="max-h-64 overflow-y-auto">
            <button
              type="button"
              onClick={onClear}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-accent",
                selected.length === 0 && "font-semibold text-primary",
              )}
            >
              {allLabel}
              {selected.length === 0 && <Check className="h-4 w-4" />}
            </button>
            {groups.map((group) => (
              <div key={group}>
                {group && (
                  <div className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                    {group}
                  </div>
                )}
                {visible
                  .filter((o) => (o.group ?? "") === group)
                  .map((option) => {
                    const active = selected.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => onToggle(option.value)}
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-accent"
                      >
                        <span className={cn(active && "font-medium text-primary")}>
                          {option.label}
                        </span>
                        {active && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    );
                  })}
              </div>
            ))}
            {visible.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">No matches</p>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((value) => (
            <Badge
              key={value}
              variant="secondary"
              className="gap-1 rounded-md py-0.5 pr-1 pl-2 font-normal"
            >
              {options.find((o) => o.value === value)?.label ?? value}
              <button
                type="button"
                onClick={() => onToggle(value)}
                aria-label="Remove filter"
                className="rounded-sm p-0.5 hover:bg-background"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
