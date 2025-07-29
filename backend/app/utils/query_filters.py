import re
from typing import Dict, Optional
from rapidfuzz import process, fuzz

def extract_filters(query: str) -> Dict[str, Optional[str]]:
    """
    Extracts filters like price, mileage, year, color, transmission, fuel_type, and feature from the user query.
    Uses fuzzy matching for color, transmission, fuel_type, and features to handle typos.
    Returns a dict with possible filter values.
    """
    filters = {}
    # Price: 'under', 'below', 'less than' + number
    price_match = re.search(r'(?:under|below|less than)\s*\$?([\d,]+)', query, re.IGNORECASE)
    if price_match:
        filters['price'] = float(price_match.group(1).replace(',', ''))
    # Mileage: 'under', 'below', 'less than' + number + (miles|mileage)
    mileage_match = re.search(r'(?:under|below|less than)\s*([\d,]+)\s*(?:miles|mileage)?', query, re.IGNORECASE)
    if mileage_match:
        filters['mileage'] = float(mileage_match.group(1).replace(',', ''))
    # Year: 'after', 'from', 'since' + year
    year_match = re.search(r'(?:after|from|since)\s*(\d{4})', query, re.IGNORECASE)
    if year_match:
        filters['year'] = int(year_match.group(1))
    # Fuzzy match for color
    colors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'silver', 'grey', 'gray', 'orange', 'brown', 'gold', 'beige', 'purple', 'pink']
    color_match, score, _ = process.extractOne(query, colors, scorer=fuzz.partial_ratio)
    if score > 80:
        filters['color'] = color_match
    # Fuzzy match for transmission
    transmissions = ['automatic', 'manual']
    trans_match, score, _ = process.extractOne(query, transmissions, scorer=fuzz.partial_ratio)
    if score > 80:
        filters['transmission'] = trans_match
    # Fuzzy match for fuel type
    fuels = ['petrol', 'diesel', 'electric', 'hybrid', 'other']
    fuel_match, score, _ = process.extractOne(query, fuels, scorer=fuzz.partial_ratio)
    if score > 80:
        filters['fuel_type'] = fuel_match
    # Fuzzy match for features
    features_list = [
        'sunroof', 'navigation', 'leather seats', 'bluetooth', 'backup camera', 'heated seats', 'apple carplay', 'android auto',
        'remote start', 'blind spot monitor', 'adaptive cruise control', 'lane keep assist', 'parking sensors', 'third row seating',
        'all wheel drive', 'four wheel drive', 'keyless entry', 'push button start', 'premium sound', 'automatic climate control',
        'power liftgate', 'wireless charging', 'head-up display', '360 camera', 'fog lights', 'memory seats', 'panoramic roof',
        'rear entertainment', 'tow package', 'sport package', 'navigation system', 'premium wheels', 'power seats', 'ventilated seats',
        'collision warning', 'adaptive headlights', 'rain sensing wipers', 'auto high beam', 'ambient lighting', 'hands-free liftgate',
        'rear cross traffic alert', 'front camera', 'rear camera', 'side airbags', 'usb ports', 'wifi hotspot', 'digital dashboard',
        'power folding mirrors', 'heated steering wheel', 'remote trunk release', 'power sliding doors', 'roof rails', 'skylight',
        'split folding rear seat', 'third brake light', 'tire pressure monitor', 'trailer hitch', 'wood trim', 'xenon headlights'
    ]
    feature_match, score, _ = process.extractOne(query, features_list, scorer=fuzz.partial_ratio)
    if score > 80:
        filters['feature'] = feature_match
    return filters 