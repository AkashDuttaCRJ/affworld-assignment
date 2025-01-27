import { useGetAllPosts } from "@/api/post";
import { CreateFeedPostDialog } from "@/components/create-post-dialog";
import { FeedPost } from "@/components/feed-post";
import { useVerifyToken } from "@/hooks/use-verify-token";

export default function Feed() {
  useVerifyToken();
  const { data, refetch } = useGetAllPosts();

  return (
    <div className="p-8 space-y-5 min-h-screen">
      <CreateFeedPostDialog
        onCreatePostCallback={() => {
          refetch();
        }}
      />
      {data?.data?.map((post) => {
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
              avatar: post._user.profile,
              name: post._user.name.full,
              username: post._user.username,
            }}
          />
        );
      })}
    </div>
  );
}
