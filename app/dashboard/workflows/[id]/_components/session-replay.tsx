"use client"

import React, { useEffect, useRef, useState } from "react"
import Hls from "hls.js"
import { cn } from "@/lib/utils"

interface SessionReplayProps {
  sessionId: string
}

export function SessionReplay({ sessionId }: SessionReplayProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<"polling" | "ready" | "error">("polling")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    let pollInterval: NodeJS.Timeout

    const checkReplayStatus = async () => {
      try {
        const res = await fetch(`/api/replays/${sessionId}`)
        const data = await res.json()

        if (!isMounted) return

        if (data.ready) {
          setPlaylistUrl(data.url)
          setStatus("ready")
          clearInterval(pollInterval)
        } else if (data.error) {
          setStatus("error")
          setErrorMessage(data.error)
          clearInterval(pollInterval)
        }
      } catch (err) {
        if (isMounted) {
          setStatus("error")
          setErrorMessage("Failed to connect to replay server")
          clearInterval(pollInterval)
        }
      }
    }

    // Initial check
    checkReplayStatus()

    // Poll every 5 seconds until ready or error
    pollInterval = setInterval(checkReplayStatus, 5000)

    return () => {
      isMounted = false
      clearInterval(pollInterval)
    }
  }, [sessionId])

  useEffect(() => {
    if (!playlistUrl || !videoRef.current) return

    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(playlistUrl)
      hls.attachMedia(videoRef.current)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current?.play().catch(() => {
          // Autoplay might be blocked, user will have to click play
          console.log("Autoplay blocked")
        })
      })

      return () => {
        hls.destroy()
      }
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari which supports HLS natively
      videoRef.current.src = playlistUrl
    }
  }, [playlistUrl])

  if (status === "error") {
    return (
      <div className="flex items-center justify-center p-4 text-red-500 bg-red-50 rounded-lg border border-red-200">
        <span>{errorMessage || "An error occurred while loading the replay"}</span>
      </div>
    )
  }

  if (status === "polling") {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center gap-2 bg-muted/30 rounded-lg border border-border">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        <p className="text-sm text-muted-foreground">
          Waiting for recording to process...
        </p>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-border">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        playsInline
      />
    </div>
  )
}
