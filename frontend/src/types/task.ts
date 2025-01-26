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
  _user: string;
  tasks: Task[];
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface BoardData {
  data: Column[];
}
