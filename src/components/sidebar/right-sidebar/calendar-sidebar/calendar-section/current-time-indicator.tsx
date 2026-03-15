"use client";

import { useEffect, useState } from "react";

export function CurrentTimeIndicator() {
  const [minutes, setMinutes] = useState(getMinutesNow());

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutes(getMinutesNow());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const top = minutes;

  return (
    <div
      className="absolute left-0 right-0 z-10 flex items-center"
      style={{ top }}
    >
      <div className="h-2 w-2 rounded-full bg-red-500" />
      <div className="h-0.5 flex-1 bg-red-500" />
    </div>
  );
}

function getMinutesNow() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}