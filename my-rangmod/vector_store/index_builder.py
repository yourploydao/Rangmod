from db.mongo import dorms
from vector_store.embedder import get_embedding
from vector_store.faiss_indexer import build_index
import numpy as np

def rebuild_index():
    embeddings, texts = [], []
    for d in dorms.find():
        text = f"{d['name']} | {d['location']} | {d.get('description', '')}"
        emb = get_embedding(text)
        embeddings.append(emb)
        texts.append(text)
    build_index(np.array(embeddings), texts)
    print("✅ Index built")

if __name__ == "__main__":
    rebuild_index()
