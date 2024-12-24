"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Media {
  id: number
  url: string
  media_type: string
}

interface ImageSliderProps {
  isOpen: boolean
  onClose: () => void
  media: Media[]
  initialIndex?: number
}

export function ImageSlider({ isOpen, onClose, media, initialIndex = 0 }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex)

  React.useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  const handlePrevious = React.useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1))
  }, [media.length])

  const handleNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1))
  }, [media.length])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowLeft":
          handlePrevious()
          break
        case "ArrowRight":
          handleNext()
          break
        case "Escape":
          onClose()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  },[isOpen, onClose, handlePrevious, handleNext])

  if (!isOpen || !media.length) return null

  const currentMedia = media[currentIndex]

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 z-50"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        {media.length > 1 && (
          <>
            <Button
              variant="ghost"
              className="absolute left-4 text-white bg-black/50 hover:bg-black/70 h-28 w-28 md:h-28 md:w-28 rounded-full"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-28 w-28" />
            </Button>

            <Button
              variant="ghost"
              className="absolute right-4 text-white bg-black/50 hover:bg-black/70 h-28 w-28 md:h-28 md:w-28 rounded-full"
              onClick={handleNext}
            >
              <ChevronRight className="h-28 w-28" />
            </Button>
          </>
        )}

        <div className="relative w-full h-full flex items-center justify-center">
          {currentMedia.media_type === "video" ? (
            <video
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${currentMedia.url}`}
              className="max-w-full max-h-[90vh] rounded-lg"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${currentMedia.url}`}
                alt="Media preview"
                width={1200}
                height={800}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                priority
              />
            </div>
          )}
        </div>

        {media.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {media.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  index === currentIndex
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/75"
                )}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
