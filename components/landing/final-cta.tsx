import { AuthButtons } from "@/components/auth/auth-buttons";

export function FinalCta() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl rounded-[42px] border border-white/70 bg-[linear-gradient(145deg,rgba(20,58,79,0.98),rgba(34,88,118,0.92))] px-6 py-10 text-white shadow-[0_24px_80px_rgba(19,43,60,0.2)] sm:px-8 lg:px-12 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">Начать работу</p>
            <h2 className="mt-4 text-3xl text-balance font-semibold leading-tight sm:text-4xl">
              Начните работать с клиентами без хаоса
            </h2>
            <p className="mt-5 text-base leading-7 text-white/75 sm:text-lg">
              Создайте аккаунт, войдите по логину и паролю и соберите удобный рабочий кабинет для своих сделок.
            </p>
          </div>

          <div className="min-w-full lg:min-w-[360px]">
            <AuthButtons orientation="vertical" fullWidth />
          </div>
        </div>
      </div>
    </section>
  );
}
