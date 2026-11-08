"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Star } from "lucide-react";

type Review = { id: string; name: string; rating: number; text: string; date: string };

export function BookReviews({ bookId }: { bookId: string }) {
  const key = `ketabino-reviews-${bookId}`;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [name, setName] = useState("کتاب‌خوان کتابینو");
  useEffect(() => { try { setReviews(JSON.parse(localStorage.getItem(key) || "[]") as Review[]); } catch { setReviews([]); } }, [key]);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    const next = [{ id: `${Date.now()}`, name: name.trim() || "کتاب‌خوان کتابینو", rating, text: text.trim(), date: new Date().toLocaleDateString("fa-IR") }, ...reviews].slice(0, 30);
    setReviews(next); localStorage.setItem(key, JSON.stringify(next)); setText("");
  };
  return <section className="book-reviews"><div className="section-heading"><div><span className="eyebrow"><MessageCircle size={14} /> گفت‌وگوی کتاب‌خوان‌ها</span><h2>نظر و امتیاز خوانندگان</h2><p>تجربه‌ات از خواندن این کتاب را بنویس.</p></div><span className="saved-count">{reviews.length.toLocaleString("fa-IR")} نظر</span></div><form className="review-form" onSubmit={submit}><label>نام نمایشی<input value={name} onChange={(e) => setName(e.target.value)} maxLength={35} /></label><div className="review-rating"><span>امتیاز تو</span><div dir="ltr">{[1,2,3,4,5].map((n) => <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} ستاره`}><Star size={19} fill={n <= rating ? "currentColor" : "none"} /></button>)}</div></div><label className="review-text">نظرت درباره کتاب<textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="چه چیزی از این کتاب دوست داشتی؟" rows={3} maxLength={600} /></label><button className="button button-dark" type="submit" disabled={!text.trim()}>ثبت نظر</button></form>{reviews.length > 0 && <div className="review-list">{reviews.map((review) => <article key={review.id}><div><b>{review.name}</b><small>{review.date}</small><span dir="ltr" className="review-stars">{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</span></div><p>{review.text}</p></article>)}</div>}</section>;
}
