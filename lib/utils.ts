import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------------------

type DurationPart = {
  suffix: "d" | "h" | "m" | "s";
  value: number;
};

export const convertMillisecondsToTimeString = (totalMilliseconds: number): string => {
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.length > 0 ? parts.join(" ") : "0s";
};

function getDurationParts(milliseconds: number): DurationPart[] {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));

  const day = Math.floor(totalSeconds / 86400);
  const hour = Math.floor((totalSeconds % 86400) / 3600);
  const min = Math.floor((totalSeconds % 3600) / 60);
  const sec = totalSeconds % 60;

  return [
    { suffix: "d", value: day },
    { suffix: "h", value: hour },
    { suffix: "m", value: min },
    { suffix: "s", value: sec },
  ];
}

export function formatTimeLabel(milliseconds: number): string {
  const nonZeroParts = getDurationParts(milliseconds).filter((part) => part.value > 0);

  if (nonZeroParts.length === 0) return "0s";
  if (nonZeroParts.length === 1) return `${nonZeroParts[0].value}${nonZeroParts[0].suffix}`;

  return nonZeroParts
    .slice(0, 2)
    .map((part) => `${part.value}${part.suffix}`)
    .join(" ");
}

// ---------------------------------------------------------------------------------------

type AnyObject = Record<string, any>;

function isValid(value: any) {
  if (!value) return false;

  if (Array.isArray(value) && value.length === 0) return false;

  if (typeof value === "object" && !Array.isArray(value)) {
    return Object.keys(value).length > 0;
  }

  return true;
}

export function removeFalsy<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => removeFalsy(item)).filter((item) => Boolean(item)) as unknown as T;
  }

  if (obj !== null && typeof obj === "object") {
    const result: AnyObject = {};

    for (const [key, value] of Object.entries(obj)) {
      const cleaned = removeFalsy(value);

      if (isValid(cleaned)) {
        result[key] = cleaned;
      }
    }

    return result as T;
  }

  return obj;
}
