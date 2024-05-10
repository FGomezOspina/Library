import { ModelBot } from "@models/model-bots/model-bot.model";
import { Room } from "@models/chat/room.model";
import { SafeResourceUrl } from "@angular/platform-browser";
import { User } from "@models/account/user.model";

export interface YoutubeVideo {
  id: string;
  url: string;
  parentEntity?: ModelBot | Room;
  parentEntityType?: string;
  iframeUrl: string | SafeResourceUrl;
  transcription: string;
  language: string;
  editing?: boolean; //Transcription
  user: User;
  createdAt: string;
}
