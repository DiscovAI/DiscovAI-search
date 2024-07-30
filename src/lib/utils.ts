import { ChatResponseEvent } from "@/schema/chat";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function nFormatter(num: number, digits?: number) {
  if (!num) return "0";
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
    : "0";
}

export const genStream = (o: ChatResponseEvent) => {
  const encoder = new TextEncoder();
  return encoder.encode(`data: ${JSON.stringify(o)}\n\n`);
};

export function containsChinese(str: string) {
  const chineseRegex = /[\u4e00-\u9fa5]/;
  return chineseRegex.test(str);
}

function addQueryParams(url, params) {
  const urlObj = new URL(url);
  Object.keys(params).forEach((key) =>
    urlObj.searchParams.append(key, params[key])
  );
  return urlObj.toString();
}

const params = {
  ref: "discovai-io",
  utm_source: "discovai-io",
  utm_medium: "referral",
};
export function addRefToUrl(url) {
  return addQueryParams(url, params);
}

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
