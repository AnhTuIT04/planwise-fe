"use client";

import { useEffect, useRef } from "react";
import { RemoteTrack, RemoteParticipant, Participant } from "livekit-client";

interface VideoTrackProps {
  track: MediaStreamTrack | RemoteTrack;
  participant?: Participant | RemoteParticipant;
  isLocal?: boolean;
  fill?: boolean;
}

export function VideoTrack({ track, participant, isLocal = false, fill = false }: VideoTrackProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (track instanceof MediaStreamTrack) {
        const stream = new MediaStream([track]);
        videoRef.current.srcObject = stream;
      } else {
        track.attach(videoRef.current);
      }
    }

    return () => {
      if (videoRef.current && track instanceof MediaStreamTrack) {
        videoRef.current.srcObject = null;
      }
    };
  }, [track]);

  const sizing = fill ? "h-full w-full" : "aspect-video w-full";
  const objectFit = fill ? "object-contain" : "object-cover";

  return (
    <div className={`relative ${sizing} overflow-hidden rounded-lg bg-gray-900`}>
      <video ref={videoRef} autoPlay playsInline muted={isLocal} className={`h-full w-full ${objectFit}`} />
      {participant && (
        <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-sm text-white">
          {participant.identity} {isLocal && "(You)"}
        </div>
      )}
    </div>
  );
}
