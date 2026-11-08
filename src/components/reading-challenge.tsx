"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Check, Flame, Sparkles } from "lucide-react";

const STORAGE_KEY = "ketabino-reading-challenge";
type ReadingState = { days: string[]; minutes: number };

function todayKey() { const date = new Date(); return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; }

export function ReadingChallenge() {
  const [state, setState] = useState<ReadingState>({ days: [], minutes: 0 });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); setState({ days: Array.isArray(saved.days) ? saved.days : [], minutes: Number(saved.minutes) || 0 }); }
    catch { setState({ days: [], minutes: 0 }); }
    setReady(true);
  }, []);
  const checkedToday = state.days.includes(todayKey());
  const checkIn = () => {
    const next = { days: [...new Set([...state.days, todayKey()])].slice(-30), minutes: state.minutes + 15 };
    setState(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };
  const lastSeven = Array.from({ length: 7 }, (_, index) => { const date = new Date(); date.setDate(date.getDate() - (6 - index)); return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; });
  return <section className="container reading-challenge"><div className="challenge-copy"><span className="eyebrow"><Sparkles size={14} /> عادت‌های کوچک، نتیجه‌های بزرگ</span><h2>هر روز، فقط ۱۵ دقیقه برای خودت.</h2><p>یک قرار کوچک با کتاب‌ها بگذار و مسیر مطالعه‌ات را همین‌جا دنبال کن.</p><div className="challenge-stats"><span><Flame size={17} /> {state.days.length.toLocaleString("fa-IR")} روز مطالعه ثبت‌شده</span><span><BookOpen size={17} /> {state.minutes.toLocaleString("fa-IR")} دقیقه مطالعه</span></div><button className="button button-dark" onClick={checkIn} disabled={!ready || checkedToday}>{checkedToday ? <><Check size={16} /> مطالعه امروز ثبت شد</> : "۱۵ دقیقه مطالعه کردم"}</button><small>اطلاعات فقط در همین مرورگر ذخیره می‌شود.</small></div><div className="challenge-calendar"><div><b>مسیر مطالعه تو</b><span>۷ روز اخیر</span></div><div className="challenge-days">{lastSeven.map((day, index) => <span key={day} className={state.days.includes(day) ? "day-done" : ""}><i>{["ش", "ی", "د", "س", "چ", "پ", "ج"][index]}</i><b>{state.days.includes(day) ? <Check size={15} /> : "·"}</b></span>)}</div><Link href="/library" className="text-link">رفتن به کتابخانه <ArrowLeft size={15} /></Link></div></section>;
}
