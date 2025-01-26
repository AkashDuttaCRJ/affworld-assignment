import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import parse from "html-react-parser";
import { Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import { useState } from "react";
import sanitizeHtml from "sanitize-html";
import DynamicGrid from "./dynamic-grid";
import { PostImage } from "./post-image";

interface FeedPostProps {
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  post: {
    caption: string;
    images: string[];
    postedAt: Date;
    likes: number;
    comments: number;
  };
}

export function FeedPost({ user, post }: FeedPostProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Report</DropdownMenuItem>
            <DropdownMenuItem>Unfollow</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4">
        <DynamicGrid>
          {post.images.map((image) => (
            <PostImage key={image} image={image} />
          ))}
        </DynamicGrid>
        <div>
          <p className="text-sm [&_[data-hashtag=true]]:text-blue-500">
            {parse(sanitizeHtml(post.caption))}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {formatDistanceToNow(post.postedAt, { addSuffix: true })}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center space-x-1 ${
              isLiked ? "text-red-500" : ""
            }`}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{likeCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
