import { appConfig } from "@/config/app";

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <section>
        <p className="text-sm font-medium tracking-[0.2em] text-stone-500 uppercase">
          Digital invitations
        </p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-stone-900 sm:text-6xl">
          {appConfig.name}
        </h1>
        <p className="mt-5 text-lg text-stone-600">قريبًا — أنشئ دعواتٍ جميلة لكل مناسبة.</p>
      </section>
    </main>
  );
}
