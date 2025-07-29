import os
import google.generativeai as genai
import json

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY","AIzaSyCc2AAkHjmX7BdgWnamyG9iWPuYfGYgdqk")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

ENTITY_PROMPT = (
    """
    Extract the following entities from this car search query. Return a JSON object with these fields (use null if not present):
    - color (string)
    - year (integer)
    - year_min (integer)
    - year_max (integer)
    - price (float)
    - price_min (float)
    - price_max (float)
    - mileage (float)
    - mileage_min (float)
    - mileage_max (float)
    - transmission (string: automatic/manual)
    - fuel_type (string: petrol/diesel/electric/hybrid/other)
    - features (list of strings)
    - company_name (string)
    - model (string)
    - sort_by (string: price, mileage, year, model, color, company_name, random, featured)
    - sort_order (string: asc, desc)
    - limit (integer, max 20)
    Query: {query}
    JSON:
    """
)

def extract_entities_with_gemini(query: str) -> dict:
    prompt = ENTITY_PROMPT.format(query=query)
    response = model.generate_content(prompt)
    try:
        json_str = response.text
        json_start = json_str.find('{')
        json_end = json_str.rfind('}') + 1
        json_str = json_str[json_start:json_end]
        entities = json.loads(json_str)
        return entities
    except Exception:
        return {} 