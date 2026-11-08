"use client";

import { useEffect, useState } from "react";
import type { Book } from "@/data/books";

export function BookCover({ book, large = false }: { book: Book; large?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  useEffect(() => {
    setImageFailed(false);
    setFallbackFailed(false);
  }, [book.id, book.coverImage, book.isbn]);

  const fallbackCover = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`
    : undefined;
  const imageSrc = imageFailed ? fallbackCover : book.coverImage;

  if (!imageSrc || fallbackFailed) return null;

  return (
    <div className={`book-cover${large ? " book-cover-large" : ""} book-cover-image`}>
      <img
        src={imageSrc}
        alt={`جلد کتاب ${book.title}`}
        loading="lazy"
        onError={() => {
          if (!imageFailed && fallbackCover) setImageFailed(true);
          else setFallbackFailed(true);
        }}
      />
    </div>
  );
}
