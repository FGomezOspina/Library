import { BotResponse } from "./response.model";
import { DataSet } from "@models/data-sets/data-set.model";
import { Media } from "@models/media/media.model";
import { ModelBot } from "@models/model-bots/model-bot.model";
import { User } from "@models/account/user.model";
import { YoutubeVideo } from "@models/media/youtube-video.model";

export interface Room {
  id: string;
  name?: string;
  user?: User;
  modelBot?: ModelBot;
  responsesCount?: number;
  createdAt: string;
  lastMessage: BotResponse;
  lastMessageDate?: string;
  mode: string;
  lastMedia: Media[];
  lastDataSets: DataSet[];
  lastYoutubeVideos: YoutubeVideo[];

  mediaCount: number;
  dataSetsCount: number;
  youtubeVideosCount: number;

  positiveValorations?: number;
  negativeValorations?: number;
}
