import React, { useRef, useState } from "react";
import "./ImageGenerator.css";
import default_image from "../../Assets/default_image.svg";

const ImageGenerator = () => {

  const [image_url, setImage_url] = useState("/");
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const imageGenerator = async () => {
    if (!inputRef.current.value) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: inputRef.current.value,
        }),
      });

      const data = await response.json();

      if (data.image) {
        setImage_url(data.image);
      } else {
        alert("API failed ❌");
        console.log(data.error);
      }

    } catch (error) {
      console.error(error);
      alert("Backend not connected ❌");
    }

    setLoading(false);
  };

  return (
    <div className="ai-image-generator">

      <div className="header">
        AI Image <span>generator</span>
      </div>

      <div className="img-loading">
        <div className="image">
          <img
            src={image_url === "/" ? default_image : image_url}
            alt=""
          />
          <div className="loading">
            <div className={loading ? "loading-bar-full" : "loading-bar"}>
              <div className={loading ? "loading-text" : "display-none"}>
                Loading...
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Describe what you want to generate"
        />

        <div className="generate-btn" onClick={imageGenerator}>
          Generate
        </div>
      </div>

    </div>
  );
};

export default ImageGenerator;