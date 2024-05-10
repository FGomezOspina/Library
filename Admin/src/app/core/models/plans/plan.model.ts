
export interface Plan {
  id: string;
  title: string;
  price: number;
  features: PlanFeature[];
}


export interface PlanFeature {
  id: string;
  name: string;
  quantity: number;
  label: string;
  key: string;
}
