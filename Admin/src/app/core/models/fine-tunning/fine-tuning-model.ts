import { FineTuningTask } from "./fine-tunning-task-model";
import { FineTuningMetrics } from "./fine-tuning-metrics-model";
import { FineTuningTesting } from "./fine-tuning-testing-model";
import { subCategory } from "./sub-category-model";
export interface FineTuning {
    id:  string;
    model: string;
    urlDataset: string;
    urlImages: string;
    trainingParameters: string;
    progress: number;
    updatedAt: string;
    createdAt: string;
    timeAgo: string;
    description: string;
    task: FineTuningTask;
    metrics: FineTuningMetrics[];
    lastMetrics: FineTuningMetrics;
    subCategory:subCategory;
    testings: FineTuningTesting[];
}

