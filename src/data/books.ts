export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  price: number;
  color: string;
  accent: string;
  coverTitle: string;
  coverSubtitle: string;
  year?: number;
  publisher?: string;
  language: string;
  tag?: string;
  sample: string[];
  external?: boolean;
  coverImage?: string;
  isbn?: string;
  pageCount?: number;
  publishedDate?: string;
  previewLink?: string;
  previewAvailable?: boolean;
  previewEmbeddable?: boolean;
  previewViewability?: string;
  infoLink?: string;
  subjects?: string[];
  subtitle?: string;
  mainCategory?: string;
  averageRating?: number;
  ratingsCount?: number;
  printType?: string;
  dimensions?: { height?: string; width?: string; thickness?: string };
  maturityRating?: string;
  sourcePrice?: number;
  sourceCurrency?: string;
};

export const books: Book[] = [
  { id: "quiet-mind", title: "هنر آرام زیستن", author: "مریم رضایی", category: "self-help", description: "راهنمایی برای کم‌کردن شلوغی ذهن، ساختن عادت‌های کوچک و پیدا کردن آرامش در روزمرگی. این کتاب با تمرین‌های کوتاه کمک می‌کند رابطه روشن‌تری با زمان و توجه خود بسازید.", price: 89000, color: "#dcebe1", accent: "#315e4d", coverTitle: "هنر\nآرام زیستن", coverSubtitle: "تمرین‌هایی برای زندگی آگاهانه", year: 1403, publisher: "نشر مسیر", language: "فارسی", tag: "انتخاب کتابینو", sample: ["گاهی برای تغییر زندگی لازم نیست تصمیم بزرگی بگیریم. کافی است چند لحظه مکث کنیم و ببینیم توجه ما در طول روز کجا خرج می‌شود.", "آرامش یک مقصد دوردست نیست؛ مهارتی است که در انتخاب‌های کوچک روزانه شکل می‌گیرد. از یک نفس عمیق، یک صفحه مطالعه و یک نه گفتن به شلوغی اضافه شروع می‌شود."] },
  { id: "letters-to-sea", title: "نامه‌هایی به دریا", author: "نرگس محمدی", category: "fiction", description: "روایتی لطیف درباره خاطره، دوستی و شجاعت شروع دوباره؛ داستان آدم‌هایی که در میان رفتن و ماندن، معنای خانه را پیدا می‌کنند.", price: 112000, color: "#d9e8e9", accent: "#275a62", coverTitle: "نامه‌هایی\nبه دریا", coverSubtitle: "روایتی از دوری و بازگشت", year: 1402, publisher: "چشمه‌سار", language: "فارسی", tag: "تازه‌رسیده", sample: ["دریا همیشه چیزی را به ساحل برمی‌گرداند؛ گاهی صدفی کوچک و گاهی خاطره‌ای که خیال می‌کردیم برای همیشه از یاد برده‌ایم.", "نامه را تا کردم و کنار پنجره گذاشتم. هنوز نمی‌دانستم باید آن را بفرستم یا بگذارم باد، خودش راهش را پیدا کند."] },
  { id: "small-steps", title: "قدرت قدم‌های کوچک", author: "آرمان نیک‌پی", category: "self-help", description: "چطور با قدم‌های کوچک، پیوسته و قابل تکرار مسیر رسیدن به هدف‌ها را هموار کنیم. مجموعه‌ای از ایده‌ها برای ساختن سیستم‌های شخصی بهتر.", price: 97000, color: "#eee1c9", accent: "#8b6035", coverTitle: "قدرت\nقدم‌های کوچک", coverSubtitle: "تغییرهای کوچک، نتیجه‌های ماندگار", year: 1404, publisher: "راه نو", language: "فارسی", sample: ["پیشرفت همیشه شبیه جهش نیست. بیشتر وقت‌ها شبیه قدمی است که آن‌قدر کوچک به نظر می‌رسد که ممکن است جدی‌اش نگیریم.", "وقتی رفتار مطلوب را ساده و در دسترس می‌کنیم، احتمال تکرارش بیشتر می‌شود. هدف، ساختن روزی بی‌نقص نیست؛ ساختن روزی است که بتوانیم دوباره از آن شروع کنیم."] },
  { id: "creative-work", title: "کار خلاق", author: "جولیا کامرون", category: "business", description: "نگاهی کاربردی به پرورش خلاقیت، عبور از تعلل و ایجاد فضایی برای ایده‌پردازی در زندگی و کار.", price: 125000, color: "#e8d9d0", accent: "#854f45", coverTitle: "کار\nخلاق", coverSubtitle: "راهی برای باز کردن مسیر ایده‌ها", language: "فارسی", tag: "محبوب", sample: ["خلاقیت با اجازه دادن به خودمان برای تجربه کردن آغاز می‌شود. لازم نیست نخستین تلاش، بهترین نتیجه باشد.", "هر ایده برای رشد به کمی فضا نیاز دارد؛ فضایی دور از قضاوت زودهنگام و مقایسه بی‌پایان."] },
  { id: "deep-work", title: "کار عمیق", author: "کال نیوپورت", category: "business", description: "چگونه در دنیایی پر از حواس‌پرتی، تمرکز طولانی و کار ارزشمند را دوباره به بخشی از زندگی حرفه‌ای خود تبدیل کنیم.", price: 138000, color: "#d8e1d9", accent: "#263f36", coverTitle: "کار\nعمیق", coverSubtitle: "قانون‌هایی برای تمرکز در جهان شلوغ", year: 1401, publisher: "آموخته", language: "فارسی", sample: ["توانایی انجام کار عمیق کمیاب‌تر شده و هم‌زمان ارزش آن بیشتر از همیشه است.", "تمرکز یک منبع نامحدود نیست. باید برای آن زمان مشخص، محیط مناسب و مرزهای روشن در نظر گرفت."] },
  { id: "blue-hour", title: "ساعت آبی", author: "الهام سادات", category: "fiction", description: "داستانی معاصر درباره انتخاب‌های دشوار، خانواده و لحظه‌هایی که مسیر زندگی را آرام و بی‌صدا تغییر می‌دهند.", price: 105000, color: "#d9deed", accent: "#46577d", coverTitle: "ساعت\nآبی", coverSubtitle: "داستانی درباره انتخاب و امید", language: "فارسی", sample: ["آن ساعت از روز که آسمان میان روشنایی و تاریکی معلق می‌ماند، شهر شکل دیگری پیدا می‌کند.", "بعضی تصمیم‌ها درست در همان لحظه‌های کوتاه گرفته می‌شوند؛ وقتی هنوز هیچ‌چیز قطعی نیست."] },
  { id: "letters-from-stoic", title: "نامه‌هایی از یک رواقی", author: "سنکا", category: "history", description: "گزیده‌ای خواندنی از اندیشه‌های سنکا درباره زمان، خویشتن‌داری، دوستی و شیوه مواجهه با دشواری‌های زندگی.", price: 119000, color: "#e6dfd0", accent: "#6c6048", coverTitle: "نامه‌هایی\nاز یک رواقی", coverSubtitle: "تأملاتی درباره زندگی", language: "فارسی", sample: ["بخش بزرگی از زندگی در انتظار می‌گذرد؛ در انتظار آینده‌ای که شاید هرگز به شکل تصورشده از راه نرسد.", "زمان را نمی‌توان ذخیره کرد، اما می‌توان آگاهانه‌تر آن را به کار گرفت."] },
  { id: "little-prince", title: "شازده کوچولو", author: "آنتوان دو سنت‌اگزوپری", category: "children", description: "سفری خیال‌انگیز درباره دوستی، مسئولیت و دیدن جهان با چشم‌هایی تازه. این معرفی و نمونه‌خوانی، محتوای اختصاصی و کوتاه برای تجربه کتابینو است.", price: 76000, color: "#e9e3c9", accent: "#7b7047", coverTitle: "شازده\nکوچولو", coverSubtitle: "قصه‌ای برای همه سن‌ها", language: "فارسی", sample: ["در سیاره‌ای کوچک، پسری هر روز غروب به تماشای غروب خورشید می‌نشست و از جهان سؤال‌های تازه می‌پرسید.", "او کم‌کم فهمید چیزهایی که ارزشمندند، همیشه با چشم دیده نمی‌شوند."] },
  { id: "the-alchemist", title: "The Alchemist", author: "Paulo Coelho", category: "fiction", description: "A reflective journey about listening to your heart, following a personal dream, and discovering meaning along the way.", price: 149000, color: "#ead8b8", accent: "#875c2f", coverTitle: "THE\nALCHEMIST", coverSubtitle: "A fable about following your dream", language: "انگلیسی", sample: ["The desert was quiet, and the stars seemed close enough to touch. He began to understand that every journey changes the person who takes it.", "It is the possibility of having a dream come true that makes life interesting."] },
  { id: "designing-life", title: "طراحی زندگی", author: "بیل برنت و دیو ایوانز", category: "self-help", description: "تمرین‌هایی برای طراحی مسیر شخصی و حرفه‌ای، آزمودن انتخاب‌ها و ساختن چند تصویر ممکن از آینده.", price: 131000, color: "#d8e8e2", accent: "#34665b", coverTitle: "طراحی\nزندگی", coverSubtitle: "با کنجکاوی مسیرت را بساز", language: "فارسی", sample: ["قرار نیست پاسخ تمام پرسش‌های آینده را همین امروز بدانیم. می‌توانیم به‌جای حدس زدن، نمونه‌های کوچک بسازیم و تجربه کنیم.", "زندگی خوب طراحی می‌شود؛ با پرسیدن، آزمودن و یاد گرفتن از مسیر."] },
];

export const getBook = (id: string) => books.find((book) => book.id === id);
