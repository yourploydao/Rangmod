import openai
import numpy as np
import os
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_embedding(text: str):
    response = openai.Embedding.create(
        model="text-embedding-ada-002",
        input=text
    )
    return np.array(response['data'][0]['embedding'])
