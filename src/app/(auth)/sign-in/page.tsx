import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/events/data";
import { SignInForm } from "@/features/auth/sign-in-form";

type SignInPageProps = {
  searchParams: Promise<{ error?: string; next?: string; continuation?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { error, next, continuation } = await searchParams;
  const isClaimContinuation = continuation === "claim-draft";
  const effectiveNext = isClaimContinuation
    ? "/create?claim=true"
    : next && next.startsWith("/") && !next.startsWith("//")
    ? next
    : "/dashboard";

  const user = await getCurrentUser();
  if (user) {
    redirect(effectiveNext);
  }

  return (
    <main className="lm-shell grid min-h-screen place-items-center px-4 py-8">
      <div className="w-full max-w-5xl">
        <header className="mb-10 flex justify-between">
          <Link className="lm-brand" href="/">Lamma</Link>
          <Link className="lm-link" href={isClaimContinuation ? "/create" : "/"}>
            {isClaimContinuation ? "العودة للمسودة" : "الرئيسية"}
          </Link>
        </header>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="hidden lg:block">
            <p className="lm-kicker">
              {isClaimContinuation ? "حفظ دعوتك في حسابك" : "كل مناسباتك، في مكان واحد"}
            </p>
            <h2 className="lm-title mt-4 text-5xl">
              {isClaimContinuation
                ? "سجّل دخولك لحفظ دعوتك وصورك واستكمال إدارتها."
                : "دعوات تبدأ الإحساس قبل اليوم الكبير."}
            </h2>
          </div>
          <SignInForm
            initialError={error ? "تعذر إكمال تسجيل الدخول. حاول مرة أخرى." : undefined}
            nextUrl={effectiveNext}
            skipHref={isClaimContinuation ? "/create" : undefined}
          />
        </div>
      </div>
    </main>
  );
}
