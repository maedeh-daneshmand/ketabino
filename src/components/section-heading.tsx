import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function SectionHeading({ eyebrow, title, description, href, linkLabel = "مشاهده همه" }: { eyebrow?: string; title: string; description?: string; href?: string; linkLabel?: string }) {
  return <div className="section-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{description && <p>{description}</p>}</div>{href && <Link href={href} className="text-link">{linkLabel}<ArrowLeft size={16} /></Link>}</div>;
}
