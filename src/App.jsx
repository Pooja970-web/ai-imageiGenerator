import { useState, useRef } from "react";
import "./App.css";

const SUGGESTIONS = [
  "A neon-lit cyberpunk city at night",
  "White tiger in the zoo",
  "Astronaut floating in deep space",
  "Enchanted forest with glowing mushrooms",
  "Futuristic Tokyo street scene",
  "Dragon made of storm clouds",
  "Crystal cave with bioluminescent creatures",
  "Viking warrior at sunset",
];

const POLLINATIONS_URL = "https://image.pollinations.ai/prompt/";

function ParticleBackground() {
  return (
    <div className="particles">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            background:
              i % 3 === 0 ? "#ff2d78" : i % 3 === 1 ? "#a855f7" : "#06b6d4",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.6 + 0.1,
            animationDuration: `${Math.random() * 8 + 6}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("generate");
  const [error, setError] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const progressRef = useRef(null);

  const startProgress = () => {
    setProgress(0);
    let val = 0;
    progressRef.current = setInterval(() => {
      val += Math.random() * 8;
      if (val >= 90) val = 90;
      setProgress(Math.round(val));
    }, 300);
  };

  const stopProgress = () => {
    clearInterval(progressRef.current);
    setProgress(100);
    setTimeout(() => setProgress(0), 600);
  };

  const generate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setImgLoaded(false);
    startProgress();

    const encoded = encodeURIComponent(prompt.trim());
    const seed = Math.floor(Math.random() * 999999);
    const url = `${POLLINATIONS_URL}${encoded}?width=512&height=512&seed=${seed}&nologo=true`;

    setImageUrl(null);
    setTimeout(() => setImageUrl(url), 500);
  };

  const handleImageLoad = () => {
    stopProgress();
    setLoading(false);
    setImgLoaded(true);
    setHistory((prev) => [{ url: imageUrl, prompt }, ...prev.slice(0, 7)]);
  };

  const handleImageError = () => {
    stopProgress();
    setLoading(false);
    setError("Failed to generate image. Please try again.");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") generate();
  };

  const handleClear = () => {
    setPrompt("");
    setImageUrl(null);
    setImgLoaded(false);
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `ai-image-${Date.now()}.jpg`;
    a.target = "_blank";
    a.click();
  };

  return (
    <div className="app">
      <ParticleBackground />
      <div className="glow-blob glow-blob--purple" />
      <div className="glow-blob glow-blob--pink" />

      <div className="content">

        {/* Header */}
        <div className="header">
          <div className="badge">
            <span className="badge__dot" />
            <span className="badge__text">Powered by AI</span>
          </div>
          <h1 className="title">
            AI image <span className="title__accent">generator</span>
          </h1>
          <p className="subtitle">
            Transform your imagination into stunning visuals with one click
          </p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "generate" ? "active" : ""}`}
            onClick={() => setActiveTab("generate")}
          >
            ✦ Generate
          </button>
          <button
            className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            ⊡ History ({history.length})
          </button>
        </div>

        {/* Generate Tab */}
        {activeTab === "generate" && (
          <>
            {/* Input Row */}
            <div className="input-row">
              <input
                className="prompt-input"
                type="text"
                placeholder="Describe your dream image..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button
                className="generate-btn"
                onClick={generate}
                disabled={loading || !prompt.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Creating...
                  </>
                ) : (
                  "Generate"
                )}
              </button>
            </div>

            {/* Suggestion Chips */}
            <div className="chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="chip" onClick={() => setPrompt(s)}>
                  {s}
                </button>
              ))}
            </div>

            {/* Image Display */}
            <div className="image-card">
              {!imageUrl && !loading && !error && (
                <div className="image-card__placeholder">
                  <div className="image-card__placeholder-icon">✦</div>
                  <p className="image-card__placeholder-text">
                    Your generated image will appear here
                  </p>
                </div>
              )}

              {error && (
                <div className="image-card__error">
                  <div className="image-card__error-icon">⚠️</div>
                  <p className="image-card__error-text">{error}</p>
                </div>
              )}

              {imageUrl && (
                <>
                  <img
                    src={imageUrl}
                    alt={prompt}
                    className="generated-image"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{ opacity: imgLoaded ? 1 : 0 }}
                    referrerPolicy="no-referrer"
                  />
                  {loading && (
                    <div className="loading-overlay">
                      <div className="spinner spinner--large" />
                      <p className="loading-overlay__text">
                        Crafting your image...
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Progress Bar */}
              {loading && progress > 0 && (
                <div className="progress-bar">
                  <div
                    className="progress-bar__fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {imgLoaded && imageUrl && (
              <div className="action-row">
                <button className="action-btn" onClick={handleDownload}>
                  ↓ Download
                </button>
                <button className="action-btn" onClick={handleClear}>
                  ✕ Clear
                </button>
              </div>
            )}
          </>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div>
            {history.length === 0 ? (
              <div className="history-empty">
                <div className="history-empty__icon">⊡</div>
                <p className="history-empty__text">No images generated yet</p>
              </div>
            ) : (
              <div className="history-grid">
                {history.map((item, i) => (
                  <div
                    key={i}
                    className="history-card"
                    onClick={() => {
                      setPrompt(item.prompt);
                      setImageUrl(item.url);
                      setImgLoaded(true);
                      setActiveTab("generate");
                    }}
                  >
                    <img
                      src={item.url}
                      alt={item.prompt}
                      className="history-card__image"
                      referrerPolicy="no-referrer"
                    />
                    <div className="history-card__label">
                      {item.prompt.slice(0, 50)}
                      {item.prompt.length > 50 ? "…" : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="footer">
          Powered by Pollinations AI · Images generated in real-time
        </div>
      </div>
    </div>
  );
}
