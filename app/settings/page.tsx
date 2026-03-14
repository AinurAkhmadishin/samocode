import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { BusinessDetailsForm } from "@/components/forms/business-details-form";
import { ProfileForm } from "@/components/forms/profile-form";
import { isProfileComplete } from "@/lib/auth";
import { getCurrentUser } from "@/lib/current-user";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AppShell
      user={{
        id: user.id,
        email: user.email,
        name: user.name ?? "Исполнитель",
        image: user.avatarUrl,
        profileCompleted: isProfileComplete(user),
      }}
      title="Настройки профиля"
      description="Редактируйте данные исполнителя и реквизиты, которые используются в документах и оплатах."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <ProfileForm
          initialValues={{
            profession: user.profile?.profession ?? "",
            fullName: user.profile?.fullName ?? "",
            phone: user.profile?.phone ?? "",
            inn: user.profile?.inn ?? "",
            city: user.profile?.city ?? "",
            telegram: user.profile?.telegram ?? "",
            website: user.profile?.website ?? "",
            about: user.profile?.about ?? "",
          }}
        />
        <BusinessDetailsForm
          initialValues={{
            legalStatus: user.businessDetails?.legalStatus ?? "self_employed",
            displayName: user.businessDetails?.displayName ?? "",
            signerName: user.businessDetails?.signerName ?? "",
            emailForDocs: user.businessDetails?.emailForDocs ?? "",
            paymentPhone: user.businessDetails?.paymentPhone ?? "",
            paymentBank: user.businessDetails?.paymentBank ?? "",
            paymentCardMask: user.businessDetails?.paymentCardMask ?? "",
          }}
        />
      </div>
    </AppShell>
  );
}
