"use client";

import { useRouter } from "next/navigation";

let router: ReturnType<typeof useRouter> | null = null;

export const setRouter = (r: ReturnType<typeof useRouter>) => {
  router = r;
};

export const navigate = (path: string) => {
  if (router) {
    router.push(path);
  } else {
    console.warn("Router is not set. Falling back to window.location");
    window.location.href = path;
  }
};

export const replace = (path: string) => {
  if (router) {
    router.replace(path);
  } else {
    console.warn("Router is not set. Falling back to window.location");
    window.location.replace(path);
  }
};

export const back = () => {
  if (router) {
    router.back();
  } else {
    console.warn("Router is not set. Falling back to window.history");
    window.history.back();
  }
};
