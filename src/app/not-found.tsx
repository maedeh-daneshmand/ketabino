import Link from "next/link";
import { BookOpen } from "lucide-react";
export default function NotFound() { return <section className="container inner-page"><div className="empty-state not-found"><span><BookOpen /></span><h1>این صفحه بین قفسه‌ها پیدا نشد!</h1><p>ممکن است آدرس اشتباه باشد یا این کتاب دیگر اینجا نباشد.</p><Link href="/" className="button button-dark">بازگشت به خانه</Link></div></section>; }
