import { User } from "./user";

interface Task {
  _id: string;
  name: string;
  description: string;
  columnId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Column {
  _id: string;
  name: string;
  _user: Pick<User, "_id">;
  tasks: Task[];
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface BoardData {
  data: Column[];
}
