export interface Analytics {
  totalResponses: number;
  totalOthers: number;
  data: Record<string, unknown> | any;
  other: [];
  detail: Record<string, unknown> | any;
  type?: string;
}
