"use client";

import { useEffect, useState } from "react";
import { useNotionIntegration } from "@/hooks/useNotion";
import { Loader2, User, Calendar as CalendarIcon, CheckCircle2, Type } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface NotionTaskPropertiesProps {
  pageId: string;
}

export function NotionTaskProperties({ pageId }: NotionTaskPropertiesProps) {
  const { getPageDetails, updatePageProperty } = useNotionIntegration();
  const [page, setPage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = await getPageDetails(pageId);
        setPage(details);
      } catch (error) {
        console.error("Failed to fetch Notion page details", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [pageId, getPageDetails]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 mt-6">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!page) return null;

  const handleUpdate = async (propertyId: string, value: any, type: string) => {
    try {
      await updatePageProperty({ pageId, payload: { propertyId, value, type } });
      // Update local state for immediate feedback
      setPage((prev: any) => {
        const newProps = { ...prev.properties };
        const currentProp = newProps[propertyId];
        const options = currentProp?.status?.options || currentProp?.select?.options || currentProp?.multi_select?.options || [];

        if (type === 'date') newProps[propertyId] = { ...newProps[propertyId], date: { start: value } };
        else if (type === 'select') newProps[propertyId] = { ...newProps[propertyId], select: options.find((o: any) => o.name === value) || { name: value } };
        else if (type === 'status') newProps[propertyId] = { ...newProps[propertyId], status: options.find((o: any) => o.name === value) || { name: value } };
        else if (type === 'multi_select') newProps[propertyId] = { ...newProps[propertyId], multi_select: value.map((v: string) => options.find((o: any) => o.name === v) || { name: v }) };
        else if (type === 'rich_text') newProps[propertyId] = { ...newProps[propertyId], rich_text: [{ plain_text: value }] };
        return { ...prev, properties: newProps };
      });
    } catch (e) { }
  };

  const renderProperty = (name: string, prop: any) => {
    if (prop.type === "title") return null;

    const iconClass = "w-3.5 h-3.5 text-gray-400";

    switch (prop.type) {
      case "status":
      case "select":
        const options = prop.status?.options || prop.select?.options || [];
        const current = prop.status?.name || prop.select?.name || "";
        const color = prop.status?.color || prop.select?.color || "default";

        return (
          <div key={name} className="flex items-center gap-4 py-1.5 px-2 hover:bg-gray-50 rounded-md transition group">
            <div className="flex items-center gap-2 w-32 shrink-0">
              <CheckCircle2 className={iconClass} />
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-tight">{name}</span>
            </div>
            <Select value={current} onValueChange={(val) => handleUpdate(name, val, prop.type)}>
              <SelectTrigger className="h-7 border-none bg-transparent hover:bg-gray-200/50 px-2 py-0 text-xs w-auto min-w-[120px] focus:ring-0">
                <div className="flex items-center gap-2">
                  {current ? (
                    <>
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color === 'default' ? '#e5e7eb' : color }} />
                      <SelectValue>{current}</SelectValue>
                    </>
                  ) : <span className="text-gray-400 italic">Empty</span>}
                </div>
              </SelectTrigger>
              <SelectContent>
                {options.map((opt: any) => (
                  <SelectItem key={opt.id} value={opt.name}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.color === 'default' ? '#e5e7eb' : opt.color }}></div>
                      {opt.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "multi_select":
        const multiOptions = prop.multi_select?.options || [];
        const selected = prop.multi_select || [];
        const selectedNames = selected.map((s: any) => (typeof s === 'string' ? s : s.name));

        const toggleOption = (optName: string) => {
          const newSelected = selectedNames.includes(optName)
            ? selectedNames.filter((n: string) => n !== optName)
            : [...selectedNames, optName];
          handleUpdate(name, newSelected, "multi_select");
        };

        return (
          <div key={name} className="flex items-center gap-4 py-1.5 px-2 hover:bg-gray-50 rounded-md transition group">
            <div className="flex items-center gap-2 w-32 shrink-0">
              <CheckCircle2 className={iconClass} />
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-tight">{name}</span>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex flex-wrap gap-1 cursor-pointer min-h-[28px] items-center hover:bg-gray-200/50 px-2 py-0.5 rounded transition min-w-[120px]">
                  {selected.length > 0 ? selected.map((val: any, i: number) => (
                    <div
                      key={i}
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-1"
                      style={{
                        backgroundColor: (val.color === 'default' || !val.color) ? '#f3f4f6' : val.color + '33',
                        color: (val.color === 'default' || !val.color) ? '#374151' : val.color
                      }}
                    >
                      {val.name}
                    </div>
                  )) : <span className="text-xs text-gray-400 italic">Empty</span>}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-1" align="start">
                <div className="flex flex-col gap-0.5">
                  <div className="px-2 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-tight">Select options</div>
                  {multiOptions.length > 0 ? multiOptions.map((opt: any) => (
                    <button
                      key={opt.id}
                      onClick={() => toggleOption(opt.name)}
                      className="flex items-center justify-between px-2 py-1.5 text-xs hover:bg-gray-100 rounded transition text-left"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.color === 'default' ? '#e5e7eb' : opt.color }}></div>
                        {opt.name}
                      </div>
                      {selectedNames.includes(opt.name) && <CheckCircle2 className="w-3 h-3 text-sky-500" />}
                    </button>
                  )) : <div className="px-2 py-3 text-xs text-gray-400 italic text-center">No options available</div>}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );

      case "date":
        const dateValue = prop.date?.start;
        return (
          <div key={name} className="flex items-center gap-4 py-1.5 px-2 hover:bg-gray-50 rounded-md transition">
            <div className="flex items-center gap-2 w-32 shrink-0">
              <CalendarIcon className={iconClass} />
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-tight">{name}</span>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-xs text-gray-700 hover:bg-gray-200/50 px-2 py-1 rounded transition truncate text-left min-w-[120px]">
                  {dateValue ? format(new Date(dateValue), "MMM d, yyyy") : <span className="text-gray-400 italic">Empty</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateValue ? new Date(dateValue) : undefined}
                  onSelect={(date) => date && handleUpdate(name, date.toISOString(), "date")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case "people":
        const people = prop.people || [];
        return (
          <div key={name} className="flex items-center gap-4 py-1.5 px-2 hover:bg-gray-50 rounded-md transition">
            <div className="flex items-center gap-2 w-32 shrink-0">
              <User className={iconClass} />
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-tight">{name}</span>
            </div>
            <div className="flex -space-x-1 ml-2">
              {people.length > 0 ? people.map((p: any) => (
                <div key={p.id} title={p.name} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-gray-100 ring-1 ring-gray-100">
                  {p.avatar_url ? <img src={p.avatar_url} alt={p.name} /> : <div className="text-[8px] flex items-center justify-center h-full font-bold bg-blue-100 text-blue-600 uppercase">{p.name?.[0]}</div>}
                </div>
              )) : <span className="text-xs text-gray-400 italic">Empty</span>}
            </div>
          </div>
        );

      case "rich_text":
        const textValue = prop.rich_text?.map((t: any) => t.plain_text).join("") || "";
        return (
          <div key={name} className="flex items-center gap-4 py-1.5 px-2 hover:bg-gray-50 rounded-md transition">
            <div className="flex items-center gap-2 w-32 shrink-0">
              <Type className={iconClass} />
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-tight">{name}</span>
            </div>
            <Input
              defaultValue={textValue}
              onBlur={(e) => textValue !== e.target.value && handleUpdate(name, e.target.value, "rich_text")}
              className="h-7 border-none bg-transparent hover:bg-gray-200/50 px-2 py-0 text-xs focus-visible:ring-0 w-full"
              placeholder="Empty"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const titleKey = Object.keys(page.properties).find(k => page.properties[k].type === 'title') || 'Name';
  const displayTitle = page.properties[titleKey].title?.[0]?.plain_text || "Notion Page";

  return (
    <div className="mt-8 flex flex-col gap-1 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 border border-gray-100/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-100">
            <Image src="/notion-logo.svg" width={18} height={18} alt="Notion" />
          </div>
          <h3 className="text-base font-bold text-gray-900 truncate max-w-[300px]">{displayTitle}</h3>
        </div>
        <button
          className="px-3.5 py-1.5 text-[11px] font-bold bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition border border-sky-100 flex items-center gap-1.5 shadow-sm shadow-sky-100"
          onClick={() => window.open(`https://www.notion.so/${pageId.replace(/-/g, "")}`, "_blank")}
        >
          Open in Notion
        </button>
      </div>

      <div className="space-y-0.5">
        {Object.entries(page.properties).map(([name, prop]) => renderProperty(name, prop))}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
        <span className="text-[10px] text-gray-400 font-medium">Synced with Notion • Last edited {format(new Date(page.last_edited_time), "MMM d, HH:mm")}</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">Connected</span>
        </div>
      </div>
    </div>
  );
}
