"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/debounce.hook";
import { useUrlParams } from "@/hooks/url-state.hook";

export function SearchInput({ placeholder }: { placeholder: string }) {
  const { searchParams, setParams } = useUrlParams();
  const urlValue = searchParams.get("q") ?? "";
  const [text, setText] = useState(urlValue);
  const debounced = useDebounce(text, 400);

  useEffect(() => {
    setText(urlValue);
  }, [urlValue]);

  useEffect(() => {
    if (debounced !== urlValue) setParams({ q: debounced || undefined });
  }, [debounced]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 pl-8"
      />
    </div>
  );
}
