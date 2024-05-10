export interface FineTuningTesting {
  id: 'string',
  urlDataset: 'string',
  urlImages: 'string',
  progress: 0,
  evalAccuracy: number;
  evalF1: number;
  evalPrecision: number;
  evalRecall: number;
  loss:number;
  urlFineTuningResult:'string'

}
