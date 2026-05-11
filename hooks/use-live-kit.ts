"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  const [isMicEnabled, setIsMicEnabled] = useState(audio);
  const [isCamEnabled, setIsCamEnabled] = useState(video);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localScreenTrack, setLocalScreenTrack] = useState<MediaStreamTrack | null>(null);
  const [screenSharingUserId, setScreenSharingUserId] = useState<string | null>(null);
  const isDisconnectingRef = useRef(false);

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

      setRoom(newRoom);

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
            // Track screen share
            if (publication.source === Track.Source.ScreenShare) {
              setScreenSharingUserId(participant.identity);
            }
          } else if (track.kind === Track.Kind.Audio) {
            track.attach();
          }
          // Trigger re-render to display new tracks
          setTrackSubscriptions((prev) => prev + 1);
        })
        .on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
          console.log("Track unsubscribed:", track.kind, "from", participant.identity);
          // Stop tracking screen share if it was from this participant
          if (publication.source === Track.Source.ScreenShare && screenSharingUserId === participant.identity) {
            setScreenSharingUserId(null);
          }
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

      setIsMicEnabled(newRoom.localParticipant.isMicrophoneEnabled);
      setIsCamEnabled(newRoom.localParticipant.isCameraEnabled);
    } catch (err) {
      console.error("Failed to connect to room:", err);
      setError(err instanceof Error ? err.message : "Failed to connect");
      setIsConnecting(false);
      setRoom(null); // Clear room on failure
    }
  }, [enabled, roomName, userName, audio, video, isConnected, isConnecting]);

  // Disconnect from room
  const disconnect = useCallback(async () => {
    if (!room || isDisconnectingRef.current) return; // Prevent multiple disconnect calls

    isDisconnectingRef.current = true;
    try {
      await room.disconnect();
    } catch (err) {
      console.error("Failed to disconnect:", err);
    } finally {
      // Always reset state
      setRoom(null);
      setIsConnected(false);
      setIsConnecting(false);
      setParticipants([]);
      setLocalVideoTrack(null);
      setLocalAudioTrack(null);
      setIsMicEnabled(audio);
      setIsCamEnabled(video);
      isDisconnectingRef.current = false;
    }
  }, [room, audio, video]);

  // Toggle microphone
  const toggleMicrophone = useCallback(async () => {
    if (!room) return false;
    try {
      const wasEnabled = room.localParticipant.isMicrophoneEnabled;
      const nextState = !wasEnabled;
      console.log("[Mic Toggle] Current:", wasEnabled, "Next:", nextState);
      await room.localParticipant.setMicrophoneEnabled(nextState);
      console.log("[Mic Toggle] After API call - setting state to:", nextState);
      setIsMicEnabled(nextState);
      return nextState;
    } catch (err) {
      console.error("Failed to toggle microphone:", err);
      return room.localParticipant.isMicrophoneEnabled;
    }
  }, [room]);

  // Toggle camera
  const toggleCamera = useCallback(async () => {
    if (!room) return false;
    try {
      const wasEnabled = room.localParticipant.isCameraEnabled;
      const nextState = !wasEnabled;
      await room.localParticipant.setCameraEnabled(nextState);
      setIsCamEnabled(nextState);

      // Re-read the active camera track. setCameraEnabled may publish a fresh
      // MediaStreamTrack, so the previously-stored reference can be stale/stopped.
      const publication = room.localParticipant.getTrackPublication(Track.Source.Camera);
      if (nextState && publication?.track) {
        setLocalVideoTrack(publication.track.mediaStreamTrack);
        setError(null);
      } else {
        setLocalVideoTrack(null);
      }

      return nextState;
    } catch (err) {
      console.error("Failed to toggle camera:", err);
      setError("Could not access camera. It may be in use by another application.");
      return room.localParticipant.isCameraEnabled;
    }
  }, [room]);

  // Toggle screen sharing
  const toggleScreenShare = useCallback(async () => {
    if (!room) return false;

    // If already sharing, stop sharing
    if (isScreenSharing) {
      try {
        // Unpublish screen track
        const screenPublication = room.localParticipant.getTrackPublication(Track.Source.ScreenShare);
        if (screenPublication) {
          await room.localParticipant.unpublishTrack(screenPublication.track!);
        }
        setIsScreenSharing(false);
        setLocalScreenTrack(null);
        setScreenSharingUserId(null);
        return false;
      } catch (err) {
        console.error("Failed to stop screen sharing:", err);
        return true;
      }
    }

    // Check if someone else is already sharing
    if (screenSharingUserId && screenSharingUserId !== room.localParticipant.identity) {
      setError("Another user is already sharing their screen. Only one screen can be shared at a time.");
      return false;
    }

    // Start screen sharing
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always",
        },
        audio: false,
      } as DisplayMediaStreamOptions);

      const screenTrack = screenStream.getVideoTracks()[0];
      if (!screenTrack) {
        throw new Error("No screen track available");
      }

      // Handle screen share stop (when user closes the browser's screen share dialog)
      screenTrack.onended = async () => {
        const screenPublication = room.localParticipant.getTrackPublication(Track.Source.ScreenShare);
        if (screenPublication) {
          await room.localParticipant.unpublishTrack(screenPublication.track!);
        }
        setIsScreenSharing(false);
        setLocalScreenTrack(null);
        setScreenSharingUserId(null);
      };

      // Publish screen track
      await room.localParticipant.publishTrack(screenTrack, {
        source: Track.Source.ScreenShare,
      });

      setLocalScreenTrack(screenTrack);
      setScreenSharingUserId(room.localParticipant.identity);
      setIsScreenSharing(true);
      setError(null);
      return true;
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        console.log("User cancelled screen share");
      } else {
        console.error("Failed to start screen sharing:", err);
        setError("Failed to share screen. Please try again.");
      }
      return false;
    }
  }, [room, isScreenSharing, screenSharingUserId]);

  // Connect when enabled
  useEffect(() => {
    if (enabled && !isConnected && !isConnecting) {
      connect();
    }
  }, [enabled, connect, isConnected, isConnecting]);

  // Sync mic/camera state from room.localParticipant
  useEffect(() => {
    if (!room || !isConnected) return;

    const syncState = () => {
      setIsMicEnabled(room.localParticipant.isMicrophoneEnabled);
      setIsCamEnabled(room.localParticipant.isCameraEnabled);
    };

    // Sync immediately on connection or manual toggle
    syncState();

    // Also sync on room events
    const handleTrackMuted = (publication: any) => {
      if (publication.source === Track.Source.Microphone) {
        setIsMicEnabled(false);
      } else if (publication.source === Track.Source.Camera) {
        setIsCamEnabled(false);
      }
    };

    const handleTrackUnmuted = (publication: any) => {
      if (publication.source === Track.Source.Microphone) {
        setIsMicEnabled(true);
      } else if (publication.source === Track.Source.Camera) {
        setIsCamEnabled(true);
      }
    };

    room.on(RoomEvent.TrackMuted, handleTrackMuted);
    room.on(RoomEvent.TrackUnmuted, handleTrackUnmuted);

    return () => {
      room.off(RoomEvent.TrackMuted, handleTrackMuted);
      room.off(RoomEvent.TrackUnmuted, handleTrackUnmuted);
    };
  }, [room, isConnected]);

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
    toggleScreenShare,
    isMicrophoneEnabled: isMicEnabled,
    isCameraEnabled: isCamEnabled,
    isScreenSharing,
    localScreenTrack,
    screenSharingUserId,
  };
}
