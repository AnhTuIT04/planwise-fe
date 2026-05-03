import { IBasicUser } from "./user.type";

export interface IChannel {
  id: string;
  name: string;
  type: "TEXT" | "VOICE" | "VIDEO";
}

export interface IMessage {
  id: string;
  content: string;
  contentType: "TEXT" | "IMAGE" | "VIDEO" | "FILE";
  sender: IBasicUser;
  createdAt: string;
}
