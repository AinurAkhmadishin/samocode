import type { Client, Deal, Document, Profile, Reminder, ServiceTemplate } from "@prisma/client";

export type AppUser = {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  profileCompleted: boolean;
};

export type DashboardStats = {
  clientsCount: number;
  activeDeals: number;
  awaitingPayment: number;
  monthRevenue: number;
};

export type DealWithRelations = Deal & {
  client: Client;
  serviceTemplate: ServiceTemplate | null;
  documents: Document[];
  reminders: Reminder[];
};

export type UserProfileBundle = {
  profile: Profile | null;
  businessDetails: {
    id: string;
    legalStatus: string;
    displayName: string | null;
    signerName: string | null;
    emailForDocs: string | null;
    paymentPhone: string | null;
    paymentBank: string | null;
    paymentCardMask: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};
