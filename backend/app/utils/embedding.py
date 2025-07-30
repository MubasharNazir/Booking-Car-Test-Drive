from typing import List
import numpy as np

# Simple embedding function that doesn't require heavy ML libraries
def generate_embedding(text: str) -> List[float]:
    """
    Generate a simple embedding for the given text.
    This is a placeholder implementation that returns a fixed-size vector.
    In production, you might want to use a proper embedding service.
    """
    # Simple hash-based embedding (384 dimensions to match the original)
    import hashlib
    
    # Create a hash of the text
    text_hash = hashlib.md5(text.encode()).hexdigest()
    
    # Convert hash to a list of floats
    embedding = []
    for i in range(0, len(text_hash), 2):
        if len(embedding) >= 384:
            break
        # Convert hex to float between -1 and 1
        val = int(text_hash[i:i+2], 16) / 255.0 * 2 - 1
        embedding.append(val)
    
    # Pad or truncate to exactly 384 dimensions
    while len(embedding) < 384:
        embedding.append(0.0)
    
    return embedding[:384]

# For compatibility with existing code
def generate_embeddings(texts: List[str]) -> List[List[float]]:
    """Generate embeddings for a list of texts."""
    return [generate_embedding(text) for text in texts] 