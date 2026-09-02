import { SignInForm } from "@/features/auth/sign-in-form";

type SignInPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { error } = await searchParams;
  const initialError = error ? "تعذر إكمال تسجيل الدخول. يرجى المحاولة مرة أخرى." : undefined;

  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 px-6">
      <SignInForm initialError={initialError} />
    </main>
  );
}
