"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readList, writeList } from "@/lib/storage";
import { readBooks, writeBooks } from "@/lib/storage";
import type { Book } from "@/data/books";

type StoreContextValue = {
  favorites: string[]; library: string[]; cart: string[];
  externalBooks: Book[]; cacheBook: (book: Book) => void;
  toggleFavorite: (id: string) => void; addToLibrary: (id: string) => void;
  addToCart: (id: string) => void; removeFromCart: (id: string) => void;
  clearCart: () => void;
  buyBook: (id: string) => void;
  isReady: boolean;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [library, setLibrary] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [externalBooks, setExternalBooks] = useState<Book[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setFavorites(readList("ketabino-favorites"));
    setLibrary(readList("ketabino-library"));
    setCart(readList("ketabino-cart"));
    setExternalBooks(readBooks<Book>("ketabino-external-books"));
    setIsReady(true);
  }, []);
  useEffect(() => { if (isReady) writeList("ketabino-favorites", favorites); }, [favorites, isReady]);
  useEffect(() => { if (isReady) writeList("ketabino-library", library); }, [library, isReady]);
  useEffect(() => { if (isReady) writeList("ketabino-cart", cart); }, [cart, isReady]);

  const cacheBook = useCallback((book: Book) => setExternalBooks((old) => {
    const next = [book, ...old.filter((item) => item.id !== book.id)].slice(0, 100);
    writeBooks("ketabino-external-books", next);
    return next;
  }), []);

  const toggleFavorite = useCallback((id: string) => setFavorites((old) => old.includes(id) ? old.filter((x) => x !== id) : [...old, id]), []);
  const addToLibrary = useCallback((id: string) => setLibrary((old) => old.includes(id) ? old : [...old, id]), []);
  const addToCart = useCallback((id: string) => setCart((old) => old.includes(id) ? old : [...old, id]), []);
  const removeFromCart = useCallback((id: string) => setCart((old) => old.filter((x) => x !== id)), []);
  const clearCart = useCallback(() => setCart([]), []);
  const buyBook = useCallback((id: string) => { setLibrary((old) => old.includes(id) ? old : [...old, id]); setCart((old) => old.filter((item) => item !== id)); }, []);
  const value = useMemo(() => ({ favorites, library, cart, externalBooks, cacheBook, toggleFavorite, addToLibrary, addToCart, removeFromCart, clearCart, buyBook, isReady }), [favorites, library, cart, externalBooks, cacheBook, toggleFavorite, addToLibrary, addToCart, removeFromCart, clearCart, buyBook, isReady]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
