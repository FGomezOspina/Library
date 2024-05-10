import { ModelBot } from '@models/model-bots/model-bot.model';
import { Room } from '@models/chat/room.model';

export interface DataSet {
  id: string;
  name: string;
  parentEntity?: ModelBot | Room;
  parentEntityType?: string;
  url: string;
  forbiddenUrls: string; //json
  deepLevel: number;
}
