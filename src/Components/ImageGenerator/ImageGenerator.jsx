import React, { useRef, useState } from "react";
import "./ImageGenerator.css";
import default_image from "../../assets/default_image.svg";

const ImageGenerator = () => {

  const [image_url, setImage_url] = useState(default_image);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  const imageGenerator = async () => {
    const prompt = inputRef.current?.value?.trim();
    if (!prompt) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "Image API error");
      }

      setImage_url(json.imageUrl);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Could not generate image.");
      setImage_url(default_image);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-image-generator">

      <div className="header">
        AI Image <span>Generator</span>
      </div>

      <div className="img-loading">

        <div className="image">
          <img
            src={image_url}
            alt="generated"
            onError={() => {
              if (image_url !== default_image) {
                setError("Could not load AI image; showing placeholder.");
                setImage_url(default_image);
              }
              setLoading(false);
            }}
          />
          {error && <div className="error-text">{error}</div>}
        </div>

        <div className="loading">

          <div className={loading ? "loading-bar-full" : "loading-bar"}></div>

          <div className={loading ? "loading-text" : "display-none"}>
            Loading...
          </div>

        </div>

      </div>

      <div className="search-box">

        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe what you want"
        />

        <div
          className="generate-btn"
          onClick={imageGenerator}
        >
          {loading ? "Generating..." : "Generate"}
        </div>

      </div>

    </div>
  );
};

export default ImageGenerator;