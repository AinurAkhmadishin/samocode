import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(226,211,186,0.4),_transparent_45%),_linear-gradient(180deg,_#fbf7f1_0%,_#f4ede3_100%)] px-4">
      <div className="flex min-w-[240px] items-center gap-4 rounded-[28px] border border-white/80 bg-white/90 px-6 py-5 shadow-[0_18px_60px_rgba(94,72,40,0.12)] backdrop-blur">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
          <Spinner className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Загружаем кабинет</p>
          <p className="text-sm text-muted-foreground">Проверяем данные и готовим экран.</p>
        </div>
      </div>
    </div>
  );
}