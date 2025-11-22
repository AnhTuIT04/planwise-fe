"use client";

import { REDIRECT_IF_NOT_AUTH } from "@/lib/router";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundaryPage({ error, reset }: ErrorProps) {
  const router = useRouter();

  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const currentMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateEyePosition = (event: MouseEvent) => {
      currentMousePos.current = { x: event.pageX, y: event.pageY };
      const eyes = [leftEyeRef.current, rightEyeRef.current];

      eyes.forEach((eye) => {
        if (eye) {
          const rect = eye.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          const rad = Math.atan2(event.pageX - x, event.pageY - y);
          const rot = rad * (180 / Math.PI) * -1 + 180;

          eye.style.transform = `rotate(${rot}deg)`;
        }
      });
    };

    const initializeEyePosition = () => {
      const syntheticEvent = {
        pageX: currentMousePos.current.x,
        pageY: currentMousePos.current.y,
      } as MouseEvent;

      updateEyePosition(syntheticEvent);
    };

    if (currentMousePos.current.x === 0 && currentMousePos.current.y === 0) {
      currentMousePos.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
    }

    initializeEyePosition();
    document.body.addEventListener("mousemove", updateEyePosition);

    return () => {
      document.body.removeEventListener("mousemove", updateEyePosition);
    };
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const handleTryAgain = () => {
    reset();
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-700 text-center font-black text-white">
      <div>
        <span className="text-9xl">5</span>
        <div
          ref={leftEyeRef}
          className="relative mx-2 inline-block h-25 w-25 rounded-full bg-white after:absolute after:right-8 after:bottom-14 after:h-8 after:w-8 after:rounded-full after:bg-black after:content-['']"
        ></div>
        <div
          ref={rightEyeRef}
          className="relative mx-2 inline-block h-25 w-25 rounded-full bg-white after:absolute after:right-8 after:bottom-14 after:h-8 after:w-8 after:rounded-full after:bg-black after:content-['']"
        ></div>
        <p className="mb-16">
          Oh eyeballs! Something went wrong. We&apos;re <em>looking</em> to see what happened.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={handleTryAgain}
            className="cursor-pointer rounded-md bg-white px-8 py-3 font-bold tracking-wide text-gray-800 uppercase shadow-md transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] active:scale-95"
          >
            Try Again
          </button>

          <button
            onClick={handleGoBack}
            className="cursor-pointer rounded-md border-2 border-white px-8 py-3 font-bold tracking-wide text-white uppercase transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] active:scale-95"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
