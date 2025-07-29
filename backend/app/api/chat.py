from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func
from app.db.session import get_db
from app.db.models import Car
from app.utils.embedding import get_car_embedding
from app.schemas.car import Car as CarSchema
from typing import List, Union
from pydantic import BaseModel, Field
from app.utils.gemini_entities import extract_entities_with_gemini
import random
import re
print("DEBUG: THIS IS THE REAL chat.py BEING EXECUTED")
router = APIRouter(prefix="/api/chat", tags=["Chat"])

class ChatQuery(BaseModel):
    query: str = Field(..., example="Show me top 5 lowest price red electric cars from 2020 to 2023 with sunroof")

def is_greeting(query: str) -> bool:
    """Check if the query is a greeting or general conversation."""
    greeting_patterns = [
        r'\b(hi|hello|hey|good morning|good afternoon|good evening)\b',
        r'\b(assalamualaikum|salam|salaam)\b',
        r'\b(how are you|how do you do)\b',
        r'\b(thanks|thank you|thx)\b',
        r'\b(bye|goodbye|see you)\b',
        r'^\s*[!?]*\s*$',  # Just punctuation or empty
    ]
    
    query_lower = query.lower().strip()
    
    for pattern in greeting_patterns:
        if re.search(pattern, query_lower, re.IGNORECASE):
            return True
    
    return False

def get_greeting_response(query: str) -> str:
    """Return appropriate response for greetings."""
    query_lower = query.lower().strip()
    
    if re.search(r'\b(assalamualaikum|salam|salaam)\b', query_lower, re.IGNORECASE):
        return "Wa'alaikumussalam! I'm your car search assistant. What type of vehicle are you looking for today? 🚗"
    elif re.search(r'\b(hi|hello|hey)\b', query_lower, re.IGNORECASE):
        return "Hello 👋! I'm here to help you find cars. What make, model, or type of vehicle interests you? 🚗"
    elif re.search(r'\b(thanks|thank you|thx)\b', query_lower, re.IGNORECASE):
        return "You're welcome! Need help finding another car or have questions about our vehicles? 🚗"
    elif re.search(r'\b(bye|goodbye|see you)\b', query_lower, re.IGNORECASE):
        return "Goodbye! Feel free to return when you need help finding your next car. 🚗"
    else:
        return "Hi! I'm your car search assistant. Tell me what kind of car you're looking for - make, model, price range, or features you need. 🚗"

@router.post("/", response_model=Union[List[CarSchema], dict])
async def chat_search(payload: ChatQuery, db: AsyncSession = Depends(get_db)):
    print(f"DEBUG: chat_search called with query: '{payload.query}'")  # Debug print
    
    # Check if this is a greeting
    if is_greeting(payload.query):
        print(f"DEBUG: Query is a greeting, returning greeting response")  # Debug print
        return JSONResponse(
            status_code=200,
            content={"message": get_greeting_response(payload.query)}
        )
    
    print(f"DEBUG: Query is not a greeting, proceeding with search")  # Debug print
    
    # Check if there are any cars in the database
    total_cars_stmt = select(Car)
    total_cars_result = await db.execute(total_cars_stmt)
    total_cars = total_cars_result.scalars().all()
    
    if not total_cars:
        print(f"DEBUG: No cars in database")  # Debug print
        return JSONResponse(
            status_code=200,
            content={"message": "No cars available in the database. Please contact the administrator."}
        )
    
    print(f"Total cars in database: {len(total_cars)}")  # Debug print
    
    query_embedding = get_car_embedding(payload.query)
    entities = extract_entities_with_gemini(payload.query)
    print(f"DEBUG: Entities extracted: {entities}")  # Debug print
    conditions = []
    
    # Range filters
    if entities.get('price_min') is not None:
        conditions.append(Car.price >= entities['price_min'])
    if entities.get('price_max') is not None:
        conditions.append(Car.price <= entities['price_max'])
    if entities.get('mileage_min') is not None:
        conditions.append(Car.mileage >= entities['mileage_min'])
    if entities.get('mileage_max') is not None:
        conditions.append(Car.mileage <= entities['mileage_max'])
    if entities.get('year_min') is not None:
        conditions.append(Car.year >= entities['year_min'])
    if entities.get('year_max') is not None:
        conditions.append(Car.year <= entities['year_max'])
    
    # Exact filters
    if entities.get('price') is not None:
        conditions.append(Car.price == entities['price'])
    if entities.get('mileage') is not None:
        conditions.append(Car.mileage == entities['mileage'])
    if entities.get('year') is not None:
        conditions.append(Car.year == entities['year'])
    if entities.get('color'):
        conditions.append(Car.color.ilike(f"%{entities['color']}%"))
    if entities.get('transmission'):
        conditions.append(Car.transmission == entities['transmission'])
    if entities.get('fuel_type'):
        conditions.append(Car.fuel_type == entities['fuel_type'])
    if entities.get('company_name'):
        conditions.append(Car.company_name.ilike(f"%{entities['company_name']}%"))
    if entities.get('model'):
        conditions.append(Car.model.ilike(f"%{entities['model']}%"))
    if entities.get('features'):
        print(f"DEBUG: Features found in entities: {entities['features']}")  # Debug print
        # Get all unique features from the database for robust matching
        result = await db.execute(select(Car.features))
        all_features = set()
        for features_list in result.scalars().all():
            if features_list:
                all_features.update(features_list)
        
        # Use robust matching for entity features
        query_lower = payload.query.lower()
        query_words = set(query_lower.split())
        
        found_features = []
        for entity_feature in entities['features']:
            # Try to match the entity feature to actual DB features
            for db_feature in all_features:
                feature_words = set(db_feature.lower().split())
                if feature_words.issubset(query_words):
                    found_features.append(db_feature)
                    break  # Found a match for this entity feature
        
        print(f"DEBUG: Robust matched features: {found_features}")  # Debug print
        
        # Use the robust matched features in the query
        for feature in found_features:
            conditions.append(Car.features.contains([feature]))
    
    # If no specific entities found, try to handle intent-based queries
    if not conditions:
        print(f"DEBUG: No conditions found, entering intent-based logic")  # Debug print
        query_lower = payload.query.lower()
        
        # Extract number from "top N" queries
        top_match = re.search(r'top\s*(\d+)', query_lower)
        limit = 10  # default limit
        
        if top_match:
            limit = min(int(top_match.group(1)), 20)  # max 20 cars
        
        # Handle different intent-based queries
        if any(word in query_lower for word in ['top', 'latest', 'new', 'recent', 'model', 'car', 'brand', 'show', 'find', 'get', 'with']):
            print(f"DEBUG: Intent-based query detected")  # Debug print
            stmt = select(Car)
            
            # Get all unique features from the database (cache this in production)
            result = await db.execute(select(Car.features))
            all_features = set()
            for features_list in result.scalars().all():
                if features_list:
                    all_features.update(features_list)

            # Lowercase and split the user query into words
            query_words = set(query_lower.split())

            found_features = []
            for db_feature in all_features:
                feature_words = set(db_feature.lower().split())
                if feature_words.issubset(query_words):
                    found_features.append(db_feature)

            print(f"DEBUG: Query: '{payload.query}'")  # Debug print
            print(f"DEBUG: Query lower: '{query_lower}'")  # Debug print
            print(f"DEBUG: Query words: {query_words}")  # Debug print
            print(f"DEBUG: Found features (from DB, robust match): {found_features}")  # Debug print

            # If features are found, try to filter by them
            if found_features:
                print(f"DEBUG: Using these features in query: {found_features}")  # Debug print
                # Try exact feature matching first
                for feature in found_features:
                    print(f"DEBUG: Adding filter for feature: {feature}")  # Debug print
                    stmt = stmt.where(Car.features.contains([feature]))
                print(f"DEBUG: Executing query with feature filters")  # Debug print
                # Do NOT order by embedding if features are found - just get cars with the feature
                stmt = stmt.limit(limit)
                print(f"DEBUG: Final SQL for feature query: {str(stmt)}")  # Debug print
                result = await db.execute(stmt)
                cars = result.scalars().all()
                print(f"DEBUG: Cars found with features: {len(cars)}")  # Debug print
                if cars:
                    print(f"DEBUG: Returning cars with features")  # Debug print
                    return cars
                else:
                    print(f"DEBUG: No cars found with features, trying fallback")  # Debug print
                    # If no cars found with exact feature, return some cars
                    stmt = select(Car).order_by(Car.year.desc(), Car.id.desc()).limit(limit)
                    result = await db.execute(stmt)
                    cars = result.scalars().all()
                    print(f"DEBUG: Total cars in database: {len(cars)}")  # Debug print
                    if cars:
                        print(f"DEBUG: Returning fallback cars")  # Debug print
                        return cars
                    else:
                        print(f"DEBUG: No cars in database at all")  # Debug print
                        # If still no cars, return help message
                        return JSONResponse(
                            status_code=200,
                            content={"message": "Hi! Please search about cars, for example: Show me top 10 cars."}
                        )
            
            # If no features found, proceed with regular intent-based search
            print(f"DEBUG: No features found, proceeding with regular search")  # Debug print
            # Determine sorting based on query intent
            if any(word in query_lower for word in ['latest', 'new', 'recent']):
                # Latest/new cars - sort by year descending
                stmt = stmt.order_by(Car.year.desc(), Car.id.desc())
            elif any(word in query_lower for word in ['expensive', 'luxury', 'high', 'premium']):
                # Expensive cars - sort by price descending
                stmt = stmt.order_by(Car.price.desc())
            elif any(word in query_lower for word in ['cheap', 'low', 'budget', 'affordable']):
                # Cheap cars - sort by price ascending
                stmt = stmt.order_by(Car.price.asc())
            elif any(word in query_lower for word in ['old', 'vintage', 'classic']):
                # Old cars - sort by year ascending
                stmt = stmt.order_by(Car.year.asc())
            else:
                # Default: latest cars
                stmt = stmt.order_by(Car.year.desc(), Car.id.desc())
            
            print(f"DEBUG: Executing regular search query")  # Debug print
            stmt = stmt.limit(limit)
            result = await db.execute(stmt)
            cars = result.scalars().all()
            
            print(f"DEBUG: Cars found in regular search: {len(cars)}")  # Debug print
            if cars:
                print(f"DEBUG: Returning cars from regular search")  # Debug print
                return cars
        
        # If still no results, return help message
        print(f"DEBUG: No results found, returning help message")  # Debug print
        return JSONResponse(
            status_code=200,
            content={"message": "Hi! Please search about cars, for example: Show me top 10 cars."}
        )
    
    # Build the query for specific filters
    stmt = select(Car)
    if conditions:
        stmt = stmt.where(and_(*conditions))
    
    # Sorting
    sort_by = entities.get('sort_by')
    sort_order = entities.get('sort_order', 'asc')
    limit = int(entities.get('limit') or 10)
    limit = min(limit, 20)
    
    if sort_by == 'price':
        stmt = stmt.order_by(Car.price.asc() if sort_order == 'asc' else Car.price.desc())
    elif sort_by == 'mileage':
        stmt = stmt.order_by(Car.mileage.asc() if sort_order == 'asc' else Car.mileage.desc())
    elif sort_by == 'year':
        stmt = stmt.order_by(Car.year.asc() if sort_order == 'asc' else Car.year.desc())
    elif sort_by == 'model':
        stmt = stmt.order_by(Car.model.asc() if sort_order == 'asc' else Car.model.desc())
    elif sort_by == 'color':
        stmt = stmt.order_by(Car.color.asc() if sort_order == 'asc' else Car.color.desc())
    elif sort_by == 'company_name':
        stmt = stmt.order_by(Car.company_name.asc() if sort_order == 'asc' else Car.company_name.desc())
    elif sort_by == 'random':
        stmt = stmt.order_by(func.random())
    elif sort_by == 'featured':
        stmt = stmt.order_by(Car.id.desc())  # Example: newest cars as featured
    else:
        stmt = stmt.order_by(Car.embedding.l2_distance(query_embedding))
    
    stmt = stmt.limit(limit)
    result = await db.execute(stmt)
    cars = result.scalars().all()
    
    if not cars:
        return JSONResponse(
            status_code=200,
            content={"message": "Sorry, no cars match your search. Please try a different query! 🚗😊"}
        )
    return cars 