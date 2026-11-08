"use client";

import { useState } from "react";
import { BookOpen, Check, Sparkles, Star } from "lucide-react";

const plans = [
  { id: "monthly", name: "ماهانه", price: "۷۹", period: "ماهانه", description: "برای شروع یک عادت تازه", features: ["دسترسی به قفسه منتخب اشتراکی", "افزودن نامحدود به کتابخانه", "پیشنهادهای شخصی‌سازی‌شده"] },
  { id: "quarterly", name: "سه‌ماهه", price: "۱۹۹", period: "سه ماه", description: "برای کتاب‌خوان‌های پیوسته", featured: true, features: ["تمام امکانات پلن ماهانه", "دسترسی زودتر به تازه‌ها", "نشان ویژه همراه کتابینو", "پیشنهاد مسیر مطالعه"] },
  { id: "annual", name: "سالانه", price: "۶۹۹", period: "سالانه", description: "برای یک سال پر از کشف", features: ["تمام امکانات پلن سه‌ماهه", "دسترسی به مجموعه‌های منتخب", "گزارش مسیر مطالعه", "هدیه‌های مناسبتی کتابینو"] },
];

export default function MembershipPage() {
  const [selected, setSelected] = useState("");
  return <div className="container inner-page"><div className="page-overline">کتابینو / اشتراک</div><section className="membership-hero"><span className="eyebrow"><Sparkles size={14} /> باشگاه کتاب‌خوان‌ها</span><h1>بیشتر بخوان،<br /><em>بیشتر کشف کن.</em></h1><p>با اشتراک کتابینو، قفسه‌ای بزرگ‌تر از داستان‌ها و ایده‌ها پیش روی توست.</p><div className="membership-stamp"><Star size={20} /><b>READ<br />EVERY DAY</b></div></section><div className="plans-heading"><h2>پلن مناسب خودت را انتخاب کن</h2><p>یک همراهی تازه برای مسیر کتاب‌خوانی‌ات انتخاب کن.</p></div><div className="plans-grid">{plans.map((plan) => <article className={`plan-card${plan.featured ? " plan-featured" : ""}`} key={plan.name}>{plan.featured && <span className="plan-badge">پیشنهاد کتابینو</span>}<span className="plan-icon"><BookOpen /></span><h3>اشتراک {plan.name}</h3><p>{plan.description}</p><div className="plan-price"><strong>{plan.price}</strong><span>هزار تومان / {plan.period}</span></div><ul>{plan.features.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}</ul><button type="button" onClick={() => { setSelected(plan.id); localStorage.setItem("ketabino-membership-demo", plan.id); }} className={`button ${plan.featured ? "button-dark" : "button-outline"}`}>{selected === plan.id ? "این پلن انتخاب شد" : "انتخاب پلن"}</button></article>)}</div>{selected && <p className="inline-success membership-selected"><Check size={15} /> پلن {plans.find((plan) => plan.id === selected)?.name} انتخاب شد.</p>}</div>;
}
