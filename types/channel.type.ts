import { IBasicUser } from "./user.type";

export interface IChannel {
  id: string;
  name: string;
  type: "TEXT" | "VOICE" | "VIDEO";
}

export type IMessage = {
  id: string;
  sender: IBasicUser;
  createdAt: string;
} & (
  | {
      content: string;
      contentType: "IMAGE" | "VIDEO" | "FILE";
    }
  | {
      content: string;
      contentType: "TEXT";
    }
);
