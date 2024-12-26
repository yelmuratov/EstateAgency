"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight} from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface Media {
  media_type: string
  url: string
  id: number
}

interface ImageSliderProps {
  isOpen: boolean
  onClose: () => void
  media: Media[]
  initialIndex: number
}

export function ImprovedImageSlider({ isOpen, onClose, media, initialIndex }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex)

  const handleSliderChange = (value: number[]) => {
    setCurrentIndex(value[0])
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length)
  }

  const previousSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length)
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl w-full h-[80vh] flex flex-col p-0">
      <DialogTitle className="sr-only">Image Slider</DialogTitle>
      <div className="relative flex-1 bg-black">
        {/* Close button */}

        {/* Navigation buttons */}
        <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
        onClick={previousSlide}
        >
        <ChevronLeft className="h-12 w-12" />
        </Button>
        <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
        onClick={nextSlide}
        >
        <ChevronRight className="h-12 w-12" />
        </Button>

        {/* Main image */}
        <div className="relative w-full h-full">
        {media[currentIndex].media_type === "video" ? (
          <video
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${media[currentIndex].url}`}
          className="absolute inset-0 w-full h-full object-contain"
          controls
          autoPlay
          muted
          playsInline
          />
        ) : (
          <Image
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${media[currentIndex].url}`}
          alt="Property image"
          fill
          className="object-contain"
          priority
          />
        )}
        </div>
      </div>

      {/* Slider control */}
      <div className="p-4 bg-white dark:bg-gray-950">
        <Slider
        value={[currentIndex]}
        max={media.length - 1}
        step={1}
        onValueChange={handleSliderChange}
        className="w-full"
        />
        <div className="text-center mt-2 text-sm text-muted-foreground">
        {currentIndex + 1} / {media.length}
        </div>
      </div>
      </DialogContent>
    </Dialog>
  )
}
