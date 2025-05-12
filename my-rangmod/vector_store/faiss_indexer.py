import faiss
import numpy as np
import json

INDEX_PATH = "vector_store/dorm.index"
TEXT_PATH = "vector_store/texts.json"

def build_index(embeddings, texts):
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)
    faiss.write_index(index, INDEX_PATH)
    with open(TEXT_PATH, "w", encoding="utf-8") as f:
        json.dump(texts, f, ensure_ascii=False)

def load_index():
    index = faiss.read_index(INDEX_PATH)
    with open(TEXT_PATH, "r", encoding="utf-8") as f:
        texts = json.load(f)
    return index, texts
