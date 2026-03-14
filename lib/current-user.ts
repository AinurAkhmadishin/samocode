import { cache } from "react";
import { getCurrentUserRecord } from "@/lib/auth";

export const getCurrentUser = cache(getCurrentUserRecord);
