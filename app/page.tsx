import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { isProfileComplete } from "@/lib/auth";
import { AboutService } from "@/components/landing/about-service";
import { Benefits } from "@/components/landing/benefits";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { FullDescription } from "@/components/landing/full-description";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";

export const metadata: Metadata = {
  title: "SamoDoc - клиенты, сделки и документы в одном кабинете",
  description:
    "Добавьте клиента, оформите сделку и соберите базовые документы в одном кабинете. Первый результат уже за 10 минут.",
};

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user && isProfileComplete(user)) {
    redirect("/dashboard");
  }

  if (user) {
    redirect("/onboarding");
  }

  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-[radial-gradient(circle_at_top_left,rgba(213,170,118,0.22),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(32,83,116,0.14),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(249,246,240,0.65))]"
      />
      <Header />
      <Hero />
      <AboutService />
      <Benefits />
      <FullDescription />
      <HowItWorks />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}
