import { ModelBot } from "@models/model-bots/model-bot.model";
import { User } from "@models/account/user.model";

export interface CronJob {
  id: string;
  name: string;
  query: string;
  emails: string;
  urls: string;
  dateTime: string,
  weekDay?: string,
  monthDay?: string,
  user?: User;
  modelBot?: ModelBot;
  createdAt: string;
  systemPrompt: string;
  deepCrawl: boolean;
}
