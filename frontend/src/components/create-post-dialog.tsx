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
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ImagePlus, LoaderCircle, Plus, Smile, X } from "lucide-react";
import { Carousel } from "nuka-carousel";
import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";

interface CreateFeedPostDialogProps {
  onCreatePostCallback?: () => void;
}

export function CreateFeedPostDialog({
  onCreatePostCallback,
}: CreateFeedPostDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [images, setImages] = useState<{ image: File; aspectRatio: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createPost } = useMutation({
    mutationFn: (data: { imageUrls: string[]; caption: string }) => {
      return axios.post("/post", data);
    },
  });

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

      createPost(
        {
          imageUrls,
          caption,
        },
        {
          onSuccess: () => {
            toast.success("Post created successfully!");
            onCreatePostCallback?.();
            setCaption("");
            setImages([]);
            setIsOpen(false);
          },
          onError(error) {
            if (error instanceof AxiosError) {
              toast.error(error.response?.data.message);
            }
          },
        }
      );
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-5 md:bottom-10 right-5 md:right-10 w-16 h-16 rounded-full [&_svg]:size-6"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] rounded-lg sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex flex-col">
              <div className="relative">
                <TextareaAutosize
                  minRows={4}
                  maxRows={10}
                  maxLength={500}
                  placeholder="What's on your mind?"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full resize-none focus:outline-none"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 bottom-2"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <span className="self-end text-xs text-muted-foreground">
                {caption.length} / 500
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {images.length === 1 && (
                <div className="relative">
                  <img
                    src={
                      URL.createObjectURL(images[0].image) || "/placeholder.svg"
                    }
                    alt={`Uploaded image ${1}`}
                    style={{
                      aspectRatio: images[0].aspectRatio,
                    }}
                    className="w-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="default"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full shrink-0"
                    onClick={() => removeImage(0)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {images.length > 1 && (
                <Carousel scrollDistance={100}>
                  {images.map((image, index) => (
                    <div className="relative">
                      <img
                        src={
                          URL.createObjectURL(image.image) || "/placeholder.svg"
                        }
                        alt={`Uploaded image ${index + 1}`}
                        style={{
                          aspectRatio: image.aspectRatio,
                        }}
                        className="w-full object-cover rounded-lg shrink-0"
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
                </Carousel>
              )}
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
                <TooltipTrigger asChild>
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
