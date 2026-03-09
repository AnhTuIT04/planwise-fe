"use client";

import { useEffect, useState, useCallback } from "react";
import { Room, RoomEvent, Track, RemoteParticipant, createLocalTracks } from "livekit-client";

interface UseLiveKitProps {
  roomName: string;
  userName: string;
  enabled: boolean;
  audio?: boolean;
  video?: boolean;
}

export function useLiveKit({ roomName, userName, enabled, audio = true, video = false }: UseLiveKitProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [trackSubscriptions, setTrackSubscriptions] = useState(0); // Track subscriptions to trigger re-renders

  // Get LiveKit token from API
  const getToken = async () => {
    try {
      const response = await fetch(`/api/livekit-token?room=${roomName}&user=${userName}`);
      if (!response.ok) {
        throw new Error("Failed to get token");
      }
      return await response.text();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get token");
      return null;
    }
  };

  // Connect to room
  const connect = useCallback(async () => {
    if (!enabled || isConnected || isConnecting) return;

    setIsConnecting(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        setIsConnecting(false);
        return;
      }

      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      // Set up event listeners
      newRoom
        .on(RoomEvent.Connected, () => {
          setIsConnected(true);
          setIsConnecting(false);

          // Get existing participants already in the room
          const existingParticipants = Array.from(newRoom.remoteParticipants.values());
          setParticipants(existingParticipants);
        })
        .on(RoomEvent.Disconnected, () => {
          setIsConnected(false);
          setParticipants([]);
        })
        .on(RoomEvent.ParticipantConnected, (participant) => {
          setParticipants((prev) => [...prev, participant as RemoteParticipant]);
        })
        .on(RoomEvent.ParticipantDisconnected, (participant) => {
          setParticipants((prev) => prev.filter((p) => p.identity !== participant.identity));
        })
        .on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
          console.log("Track subscribed:", track.kind, "from", participant.identity);
          if (track.kind === Track.Kind.Video) {
            track.attach();
          } else if (track.kind === Track.Kind.Audio) {
            track.attach();
          }
          // Trigger re-render to display new tracks
          setTrackSubscriptions((prev) => prev + 1);
        })
        .on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
          console.log("Track unsubscribed:", track.kind, "from", participant.identity);
          // Trigger re-render to remove tracks
          setTrackSubscriptions((prev) => prev + 1);
        });

      // Get LiveKit server URL from environment variable
      const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "ws://localhost:7880";

      await newRoom.connect(wsUrl, token);

      // Create and publish local tracks
      // Try video first, fallback to audio only if camera is in use
      let tracks = [];
      try {
        tracks = await createLocalTracks({
          audio,
          video,
        });
      } catch (videoError) {
        console.warn("Failed to create video track, trying audio only:", videoError);
        // If video fails (camera in use), try audio only
        if (video && audio) {
          try {
            tracks = await createLocalTracks({
              audio: true,
              video: false,
            });
            setError("Camera is being used by another application. Joined with audio only.");
          } catch (audioError) {
            console.error("Failed to create audio track:", audioError);
            setError("Failed to access microphone and camera");
            throw audioError;
          }
        } else {
          throw videoError;
        }
      }

      for (const track of tracks) {
        await newRoom.localParticipant.publishTrack(track);

        if (track.kind === Track.Kind.Video) {
          setLocalVideoTrack(track.mediaStreamTrack);
        } else if (track.kind === Track.Kind.Audio) {
          setLocalAudioTrack(track.mediaStreamTrack);
        }
      }

      setRoom(newRoom);
    } catch (err) {
      console.error("Failed to connect to room:", err);
      setError(err instanceof Error ? err.message : "Failed to connect");
      setIsConnecting(false);
    }
  }, [enabled, roomName, userName, audio, video, isConnected, isConnecting]);

  // Disconnect from room
  const disconnect = useCallback(async () => {
    if (room) {
      await room.disconnect();
      setRoom(null);
      setIsConnected(false);
      setParticipants([]);
      setLocalVideoTrack(null);
      setLocalAudioTrack(null);
    }
  }, [room]);

  // Toggle microphone
  const toggleMicrophone = useCallback(async () => {
    if (room) {
      const enabled = room.localParticipant.isMicrophoneEnabled;
      await room.localParticipant.setMicrophoneEnabled(!enabled);
      return !enabled;
    }
    return false;
  }, [room]);

  // Toggle camera
  const toggleCamera = useCallback(async () => {
    if (room) {
      try {
        const enabled = room.localParticipant.isCameraEnabled;
        await room.localParticipant.setCameraEnabled(!enabled);

        // Update local video track state
        if (!enabled) {
          const videoTrack = room.localParticipant.getTrackPublication(Track.Source.Camera);
          if (videoTrack?.track) {
            setLocalVideoTrack(videoTrack.track.mediaStreamTrack);
          }
        } else {
          setLocalVideoTrack(null);
        }

        // Clear error if camera works now
        if (!enabled) {
          setError(null);
        }

        return !enabled;
      } catch (err) {
        console.error("Failed to toggle camera:", err);
        setError("Could not access camera. It may be in use by another application.");
        return false;
      }
    }
    return false;
  }, [room]);

  // Connect when enabled
  useEffect(() => {
    if (enabled && !isConnected && !isConnecting) {
      connect();
    }
  }, [enabled, connect, isConnected, isConnecting]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

  return {
    room,
    isConnected,
    isConnecting,
    participants,
    error,
    localVideoTrack,
    localAudioTrack,
    connect,
    disconnect,
    toggleMicrophone,
    toggleCamera,
    isMicrophoneEnabled: room?.localParticipant.isMicrophoneEnabled ?? false,
    isCameraEnabled: room?.localParticipant.isCameraEnabled ?? false,
  };
}
