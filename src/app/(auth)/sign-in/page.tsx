import Link from "next/link";
import { SignInForm } from "@/features/auth/sign-in-form";

type SignInPageProps = { searchParams: Promise<{ error?: string }> };
export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { error } = await searchParams;
  return <main className="lm-shell grid min-h-screen place-items-center px-4 py-8"><div className="w-full max-w-5xl"><header className="mb-10 flex justify-between"><Link className="lm-brand" href="/">Lamma</Link><Link className="lm-link" href="/">الرئيسية</Link></header><div className="grid items-center gap-12 lg:grid-cols-2"><div className="hidden lg:block"><p className="lm-kicker">كل مناسباتك، في مكان واحد</p><h2 className="lm-title mt-4 text-5xl">دعوات تبدأ الإحساس قبل اليوم الكبير.</h2></div><SignInForm initialError={error ? "تعذر إكمال تسجيل الدخول. حاول مرة أخرى." : undefined} /></div></div></main>;
}
