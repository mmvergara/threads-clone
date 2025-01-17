import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export const elapsedTime = (unixTimestamp: number) => {
  const now = new Date();
  const date = new Date(unixTimestamp * 1000);
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  return seconds < 60
    ? "just now"
    : days > 0
    ? `${days}d`
    : hours > 0
    ? `${hours}h`
    : minutes > 0
    ? `${minutes}m`
    : `${seconds}s`;
};

export const truncateTextEllipses = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
