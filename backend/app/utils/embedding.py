from langchain_community.embeddings import HuggingFaceEmbeddings
from typing import List

# Initialize the embedding model once
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def get_car_embedding(text: str) -> List[float]:
    """
    Generate a 384-dim embedding for the given text using sentence-transformers via LangChain.
    """
    return embedding_model.embed_query(text) 