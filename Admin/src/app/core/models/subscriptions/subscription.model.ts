import { Plan } from "@models/plans/plan.model";

export interface Subscription {
  id: string;
  plan: Plan;
  createdAt: string;
  endsAt: string;
}

