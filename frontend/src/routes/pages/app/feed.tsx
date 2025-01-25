import { CreateFeedPostDialog } from "@/components/create-post-dialog";
import { FeedPost } from "@/components/feed-post";
import { useEffect } from "react";

export default function Feed() {
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8080/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="p-8">
      <CreateFeedPostDialog />
      <FeedPost
        user={{
          name: "Jane Doe",
          username: "janedoe",
          avatar: "https://i.pravatar.cc/150?img=1",
        }}
        post={{
          caption: `<p>Reflections of the Mind: A Crystalline Portrait</p>
            <br />
            <p>
              <span data-hashtag="true">#ContemporaryArt</span> 
              <span data-hashtag="true">#GlassSculpture</span> 
              <span data-hashtag="true">#MindArt</span> 
              <span data-hashtag="true">#ArtisticExpression</span> 
              <span data-hashtag="true">#ConceptualArt</span>
            </p>`,
          image: "https://images.unsplash.com/photo-1737071371043-761e02b1ef95",
          postedAt: new Date("2024-09-01T12:00:00Z"),
          likes: 10,
          comments: 5,
        }}
      />
    </div>
  );
}
