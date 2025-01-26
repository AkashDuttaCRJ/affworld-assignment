type User = {
  name: {
    first: string;
    last: string;
    full: string;
  };
  _id: string;
  username: string;
  email: string;
  password: string;
  profile: string;
  provider: string;
  googleProfileData: {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
};

type Post = {
  _id: string;
  imageUrls: string[];
  caption: string;
  _userId: User;
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
