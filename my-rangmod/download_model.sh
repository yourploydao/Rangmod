#!/bin/bash
MODEL_DIR="./models/qwen-merged"
MODEL_FILE="qwen-merged.zip"
FILE_ID="1l5jHuk_mVnd3u70UB8q4thgLn10p2KEp"

echo "📦 Downloading model to $MODEL_DIR..."
mkdir -p "$MODEL_DIR"
cd "$MODEL_DIR"

# Install gdown if needed
if ! command -v gdown &> /dev/null; then
  echo "gdown not found. Installing..."
  pip install gdown
fi

gdown --id "$FILE_ID" -O "$MODEL_FILE"

echo "📂 Unzipping model..."
unzip -o "$MODEL_FILE"
rm "$MODEL_FILE"

echo "✅ Model download complete!"

# pip install -r requirements.txt
# ./download_model.sh
# uvicorn src.app.api.main:app --reload
# npm run dev
# ใส่ .envf ด้วย
# ollama serve