export interface FineTuningMetrics {
  id: string;
  path: string;
  progress: number;
  loss: number;
  learningRate: number;
  epoch: number;
  step: number;
  evalLoss: number;
  evalAccuracy: number;
  evalF1: number;
  evalPrecision: number;
  evalRecall: number;
  fineTuningId: number;
  updatedAt: Date;
  createdAt: Date;
}
