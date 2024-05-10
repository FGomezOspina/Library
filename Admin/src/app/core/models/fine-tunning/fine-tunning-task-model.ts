import { ModelDataSet } from "./model-Data-set.model";
import { subCategory } from "./sub-category-model";
export interface FineTuningTask {
  id:  string;
  name: string;
  description: string;
  example: string;
  modelDataSets: ModelDataSet[];
  subCategories: subCategory[];
}
