import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { axios } from "@/lib/axios";
import { ImagePlus, LoaderCircle, Smile, X } from "lucide-react";
import { useRef, useState } from "react";

interface CreateFeedPostDialogProps {
  onCreatePost?: () => void;
}

export function CreateFeedPostDialog({
  onCreatePost,
}: CreateFeedPostDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [images, setImages] = useState<{ image: File; aspectRatio: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //   const handleEmojiClick = (emojiObject: any) => {
  //     setCaption((prevCaption) => prevCaption + emojiObject.emoji)
  //     setShowEmojiPicker(false)
  //   }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files as FileList);

      // Limit the number of images (existing + new should not exceed 4)
      if (images.length + filesArray.length > 4) {
        alert("You can only upload a maximum of 4 images.");
        return;
      }

      const imageObjects = filesArray.map((file) => {
        const img = new Image();
        const imageURL = URL.createObjectURL(file);

        img.src = imageURL;

        return new Promise<{ image: File; aspectRatio: string }>((resolve) => {
          img.onload = () => {
            const aspectRatio = `${img.width} / ${img.height}`;
            resolve({ image: file, aspectRatio });
          };
        });
      });

      Promise.all(imageObjects).then((newImages) => {
        setImages((prevImages) => [...prevImages, ...newImages]);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cloudinaryURL = `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLD_CLOUD_NAME
      }/image/upload`;
      const uploadPreset = import.meta.env.VITE_CLD_UNSIGNED_UPLOAD_PRESET;

      const uploadPromises = images.map(async (imgObj) => {
        const formData = new FormData();
        formData.append("file", imgObj.image);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(cloudinaryURL, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Image upload failed");
        }

        return response.json(); // Returns the uploaded image URL and details
      });

      const uploadedImages = await Promise.all(uploadPromises);
      const imageUrls = uploadedImages.map((img) => img.secure_url);

      const res = await axios.post("/post", {
        imageUrls,
        caption,
      });

      if (!res.data.success) {
        // alert
      }

      onCreatePost?.();
      setCaption("");
      setImages([]);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              {/* <Textarea
                id="caption"
                placeholder="What's on your mind?"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="pr-10"
              /> */}
              <textarea
                placeholder="What's on your mind?"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full resize-none"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            {/* {showEmojiPicker && (
              <div className="absolute z-10">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )} */}
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image.image) || "/placeholder.svg"}
                    alt={`Uploaded image ${index + 1}`}
                    style={{
                      aspectRatio: image.aspectRatio,
                    }}
                    className="w-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="default"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {/* <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="h-4 w-4" />
              </Button> */}
            </div>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              max={4}
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>
          <div className="flex items-center justify-between">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={images.length >= 4}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {images.length >= 4
                      ? "Maximum Upload Limit Reached"
                      : "Add Image"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                "Create Post"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
