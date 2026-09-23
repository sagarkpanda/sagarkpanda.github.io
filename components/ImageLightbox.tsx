"use client";

import React, {
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";

type ImageLightboxProps = {
  src: string;
  alt: string;
};

export default function ImageLightbox({
  src,
  alt,
}: ImageLightboxProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const originalHtmlOverflow =
      document.documentElement.style.overflow;
    const originalBodyOverflow =
      document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow =
        originalHtmlOverflow;

      document.body.style.overflow =
        originalBodyOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    window.history.pushState(
      { imageLightbox: true },
      "",
      window.location.href
    );

    const handlePopState = () => {
      setOpen(false);
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key === "Escape" ||
        event.key === "Backspace"
      ) {
        event.preventDefault();
        closeLightbox();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open]);

  function closeLightbox() {
    if (
      window.history.state?.imageLightbox
    ) {
      window.history.back();
    } else {
      setOpen(false);
    }
  }

  function handleOverlayClick(
    event: React.MouseEvent<HTMLDivElement>
  ) {
    if (
      event.target === event.currentTarget
    ) {
      closeLightbox();
    }
  }

  const lightbox =
    open && mounted
      ? createPortal(
          <div
            className="image-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={
              alt || "Image preview"
            }
            onClick={handleOverlayClick}
          >
            <button
              type="button"
              className="image-lightbox-close"
              onClick={closeLightbox}
              aria-label="Close image"
            >
              ×
            </button>

            <div className="image-lightbox-content">
              <img
                src={src}
                alt={alt}
                decoding="async"
              />
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        className="article-lightbox-trigger"
        onClick={() => setOpen(true)}
        aria-label={`Open image: ${
          alt || "image"
        }`}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
        />
      </button>

      {lightbox}
    </>
  );
}