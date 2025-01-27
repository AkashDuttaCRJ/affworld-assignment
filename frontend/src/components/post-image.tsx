import { useState } from "react";

export function PostImage({
  image,
  className = "",
}: {
  image?: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {!loaded && (
        <img
          src="/placeholder.svg"
          alt="Placeholder"
          className="w-full h-full absolute top-0 left-0 object-cover"
        />
      )}
      <img
        src={error ? "/placeholder.svg" : image || "/placeholder.svg"}
        alt="Post image"
        width={500}
        height={500}
        className={`w-full h-full transition-opacity duration-300 object-cover ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}
