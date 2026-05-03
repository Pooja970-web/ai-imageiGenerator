import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate-image", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
      { inputs: req.body.prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(response.data, "binary").toString("base64");

    res.json({
      image: `data:image/png;base64,${base64Image}`,
    });

  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);

    res.json({
      image: null,
      error: "Image generation failed",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});