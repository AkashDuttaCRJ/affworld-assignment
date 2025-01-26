import { User } from "./user";

type Post = {
  _id: string;
  imageUrls: string[];
  caption: string;
  _user: User;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
};

export type PostResponse = {
  data: {
    total: number;
    page: number;
    limit: number;
    posts: Post[];
  };
};
