"use client"

import { Image as MedusaImage } from "@medusajs/medusa"
import { ArrowRightMini, Heart } from "@medusajs/icons"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import { useEffect, useState } from "react"

type ImageGalleryProps = {
  images: MedusaImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeImage, setActiveImage] = useState(images[0])

  const handleArrowClick = (direction: "left" | "right") => {
    const currentIndex = images.findIndex(
      (image) => image.id === activeImage.id
    )

    if (direction === "left") {
      if (currentIndex === 0) {
        setActiveImage(images[images.length - 1])
      } else {
        setActiveImage(images[currentIndex - 1])
      }
    } else {
      if (currentIndex === images.length - 1) {
        setActiveImage(images[0])
      } else {
        setActiveImage(images[currentIndex + 1])
      }
    }
  }

  useEffect(() => {
    //scroll to active image
    const activeImageElement = document.querySelector(
      `[data-image-id="${activeImage.id}"]`
    )

    if (activeImageElement) {
      activeImageElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      })
    }
  }, [activeImage])

  return (
    <div className="flex items-start relative max-w-full">
      <div className="flex flex-col flex-1 gap-y-4 max-w-full">
        <Container
          key={activeImage.id}
          className="relative aspect-[9/8] w-full overflow-hidden bg-ui-bg-subtle"
          id={activeImage.id}
        >
          <Image
            src={activeImage.url}
            priority
            className="absolute inset-0 rounded-2xl"
            alt="Active product image"
            fill
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
            style={{
              objectFit: "cover",
            }}
          />
          <div className="absolute rounded-full bg-white p-4">
            <Heart className="text-red-400" />
          </div>
        </Container>
        <div className="flex gap-4 items-center w-full">
          <ArrowRightMini
            className="rotate-180 cursor-pointer"
            color="var(--fg-interactive)"
            onClick={(e) => handleArrowClick("left")}
          />
          <div className="flex gap-4 w-full max-w-full overflow-x-scroll no-scrollbar">
            {images.map((image, index) => {
              const isActive = image.id === activeImage.id

              return (
                <Container
                  key={image.id}
                  data-image-id={image.id}
                  className={`${
                    isActive ? "border-grey-80" : "border-transparent"
                  }
                    border-2
                    relative
                    h-24
                    flex-shrink-0
                    w-1/4
                    overflow-hidden
                    bg-ui-bg-subtle
                    cursor-pointer
                  `}
                  id={image.id}
                  onClick={() => setActiveImage(image)}
                >
                  <Image
                    src={image.url}
                    priority
                    className="absolute inset-0 rounded-rounded"
                    alt={`Product image ${index}`}
                    fill
                    sizes="280px"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </Container>
              )
            })}
          </div>
          <ArrowRightMini
            color="var(--fg-interactive)"
            className="cursor-pointer"
            onClick={(e) => handleArrowClick("right")}
          />
        </div>
      </div>
    </div>
  )
}

export default ImageGallery
