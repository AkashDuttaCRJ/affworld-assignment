import { useGetAllPosts } from "@/api/post";
import { CreateFeedPostDialog } from "@/components/create-post-dialog";
import { FeedPost } from "@/components/feed-post";

export default function Feed() {
  const { data, refetch } = useGetAllPosts();

  return (
    <div className="p-8 space-y-5">
      <CreateFeedPostDialog
        onCreatePostCallback={() => {
          refetch();
        }}
      />
      {data?.data?.posts.map((post) => {
        return (
          <FeedPost
            key={post._id}
            post={{
              caption: post.caption,
              comments: 0,
              images: post.imageUrls,
              likes: 0,
              postedAt: new Date(post.createdAt),
            }}
            user={{
              avatar: post._userId.profile,
              name: post._userId.name.full,
              username: post._userId.username,
            }}
          />
        );
      })}
    </div>
  );
}
