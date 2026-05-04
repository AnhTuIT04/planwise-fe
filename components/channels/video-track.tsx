"use client";

import { useEffect, useRef } from "react";
import { RemoteTrack, RemoteParticipant, Participant } from "livekit-client";

interface VideoTrackProps {
  track: MediaStreamTrack | RemoteTrack;
  participant?: Participant | RemoteParticipant;
  isLocal?: boolean;
}

export function VideoTrack({ track, participant, isLocal = false }: VideoTrackProps) {
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

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-900">
      <video ref={videoRef} autoPlay playsInline muted={isLocal} className="h-full w-full object-cover" />
      {participant && (
        <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-sm text-white">
          {participant.identity} {isLocal && "(You)"}
        </div>
      )}
    </div>
  );
}
