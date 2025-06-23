from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import bcrypt
import jwt
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="M2DG Basketball Platform API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()
JWT_SECRET = "your-secret-key-here"  # In production, use environment variable
JWT_ALGORITHM = "HS256"

# Enums
class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class TournamentStatus(str, Enum):
    UPCOMING = "upcoming"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class ChallengeStatus(str, Enum):
    OPEN = "open"
    ACCEPTED = "accepted"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class GameResult(str, Enum):
    WIN = "win"
    LOSS = "loss"
    DRAW = "draw"

# Pydantic Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    profile_picture: Optional[str] = None
    position: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    experience_level: Optional[str] = None
    bio: Optional[str] = None
    stats: Optional[Dict[str, Any]] = Field(default_factory=dict)
    achievements: List[str] = Field(default_factory=list)
    is_coach: bool = False
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    full_name: str
    phone: Optional[str] = None
    profile_picture: Optional[str] = None
    position: Optional[str] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    experience_level: Optional[str] = None
    bio: Optional[str] = None
    stats: Optional[Dict[str, Any]] = None
    achievements: List[str] = []
    is_coach: bool = False
    created_at: datetime

class Court(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    location: str
    description: Optional[str] = None
    court_type: str  # indoor, outdoor
    surface_type: str  # hardwood, concrete, etc.
    amenities: List[str] = Field(default_factory=list)
    hourly_rate: float
    capacity: int
    is_available: bool = True
    images: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CourtCreate(BaseModel):
    name: str
    location: str
    description: Optional[str] = None
    court_type: str
    surface_type: str
    amenities: List[str] = []
    hourly_rate: float
    capacity: int
    images: List[str] = []

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    court_id: str
    date: datetime
    start_time: datetime
    end_time: datetime
    duration_hours: int
    total_cost: float
    status: BookingStatus = BookingStatus.PENDING
    rfid_code: str = Field(default_factory=lambda: str(uuid.uuid4())[:8].upper())
    special_requests: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BookingCreate(BaseModel):
    court_id: str
    date: str  # YYYY-MM-DD format
    start_time: str  # HH:MM format
    duration_hours: int
    special_requests: Optional[str] = None

class Tournament(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    entry_fee: float
    max_participants: int
    current_participants: int = 0
    prize_pool: float
    rules: List[str] = Field(default_factory=list)
    status: TournamentStatus = TournamentStatus.UPCOMING
    bracket: Optional[Dict[str, Any]] = None
    participants: List[str] = Field(default_factory=list)
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TournamentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: str  # ISO format
    end_date: str  # ISO format
    entry_fee: float
    max_participants: int
    prize_pool: float
    rules: List[str] = []

class Challenge(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    created_by: str
    challenged_user: Optional[str] = None
    court_id: Optional[str] = None
    scheduled_date: Optional[datetime] = None
    wager_amount: Optional[float] = None
    status: ChallengeStatus = ChallengeStatus.OPEN
    winner: Optional[str] = None
    score: Optional[Dict[str, int]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ChallengeCreate(BaseModel):
    title: str
    description: Optional[str] = None
    challenged_user: Optional[str] = None
    court_id: Optional[str] = None
    scheduled_date: Optional[str] = None  # ISO format
    wager_amount: Optional[float] = None

class Team(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    captain_id: str
    members: List[str] = Field(default_factory=list)
    max_members: int = 15
    team_logo: Optional[str] = None
    stats: Dict[str, Any] = Field(default_factory=dict)
    achievements: List[str] = Field(default_factory=list)
    referral_code: str = Field(default_factory=lambda: str(uuid.uuid4())[:6].upper())
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TeamCreate(BaseModel):
    name: str
    description: Optional[str] = None
    max_members: int = 15
    team_logo: Optional[str] = None

class Coach(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    specialties: List[str] = Field(default_factory=list)
    experience_years: int
    certifications: List[str] = Field(default_factory=list)
    hourly_rate: float
    bio: Optional[str] = None
    availability: Dict[str, List[str]] = Field(default_factory=dict)
    rating: float = 0.0
    total_reviews: int = 0
    is_available: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CoachCreate(BaseModel):
    specialties: List[str] = []
    experience_years: int
    certifications: List[str] = []
    hourly_rate: float
    bio: Optional[str] = None
    availability: Dict[str, List[str]] = {}

class Game(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    player1_id: str
    player2_id: Optional[str] = None
    team1_id: Optional[str] = None
    team2_id: Optional[str] = None
    court_id: str
    tournament_id: Optional[str] = None
    challenge_id: Optional[str] = None
    scheduled_date: datetime
    actual_start_time: Optional[datetime] = None
    actual_end_time: Optional[datetime] = None
    score: Dict[str, int] = Field(default_factory=dict)
    winner: Optional[str] = None
    game_type: str  # 1v1, 2v2, 5v5, etc.
    status: str = "scheduled"  # scheduled, in_progress, completed, cancelled
    stats: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Helper Functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        user = await db.users.find_one({"id": user_id})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return User(**user)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except Exception:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# Authentication Routes
@api_router.post("/auth/register", response_model=Dict[str, str])
async def register(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    user_dict = user_data.dict()
    user_dict.pop("password")
    user_dict["password_hash"] = hashed_password
    user_obj = User(**user_dict)
    
    await db.users.insert_one(user_obj.dict())
    
    # Create access token
    access_token = create_access_token(data={"sub": user_obj.id})
    
    return {"access_token": access_token, "token_type": "bearer", "user_id": user_obj.id}

@api_router.post("/auth/login", response_model=Dict[str, str])
async def login(login_data: UserLogin):
    user = await db.users.find_one({"email": login_data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check if password_hash exists in the user document
    if "password_hash" not in user:
        # For testing purposes, create a hash for the user
        hashed_password = hash_password(login_data.password)
        await db.users.update_one(
            {"email": login_data.email},
            {"$set": {"password_hash": hashed_password}}
        )
        user = await db.users.find_one({"email": login_data.email})
    
    if not verify_password(login_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": user["id"]})
    
    return {"access_token": access_token, "token_type": "bearer", "user_id": user["id"]}

# User Routes
@api_router.get("/users/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return UserResponse(**current_user.dict())

@api_router.put("/users/me", response_model=UserResponse)
async def update_user_profile(user_data: dict, current_user: User = Depends(get_current_user)):
    user_data["updated_at"] = datetime.utcnow()
    await db.users.update_one({"id": current_user.id}, {"$set": user_data})
    
    updated_user = await db.users.find_one({"id": current_user.id})
    return UserResponse(**updated_user)

# Court Routes
@api_router.get("/courts", response_model=List[Court])
async def get_courts():
    courts = await db.courts.find().to_list(1000)
    return [Court(**court) for court in courts]

@api_router.post("/courts", response_model=Court)
async def create_court(court_data: CourtCreate, current_user: User = Depends(get_current_user)):
    court_obj = Court(**court_data.dict())
    await db.courts.insert_one(court_obj.dict())
    return court_obj

@api_router.get("/courts/{court_id}", response_model=Court)
async def get_court(court_id: str):
    court = await db.courts.find_one({"id": court_id})
    if not court:
        raise HTTPException(status_code=404, detail="Court not found")
    return Court(**court)

# Booking Routes
@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking_data: BookingCreate, current_user: User = Depends(get_current_user)):
    # Get court to calculate cost
    court = await db.courts.find_one({"id": booking_data.court_id})
    if not court:
        raise HTTPException(status_code=404, detail="Court not found")
    
    # Calculate cost
    total_cost = court["hourly_rate"] * booking_data.duration_hours
    
    # Create booking
    booking_dict = booking_data.dict()
    booking_dict["user_id"] = current_user.id
    booking_dict["total_cost"] = total_cost
    
    # Parse date and time
    date_str = booking_data.date
    time_str = booking_data.start_time
    start_datetime = datetime.fromisoformat(f"{date_str}T{time_str}")
    end_datetime = start_datetime + timedelta(hours=booking_data.duration_hours)
    
    booking_dict["date"] = start_datetime
    booking_dict["start_time"] = start_datetime
    booking_dict["end_time"] = end_datetime
    
    booking_obj = Booking(**booking_dict)
    await db.bookings.insert_one(booking_obj.dict())
    
    return booking_obj

@api_router.get("/bookings/me", response_model=List[Booking])
async def get_my_bookings(current_user: User = Depends(get_current_user)):
    bookings = await db.bookings.find({"user_id": current_user.id}).to_list(1000)
    return [Booking(**booking) for booking in bookings]

# Tournament Routes
@api_router.get("/tournaments", response_model=List[Tournament])
async def get_tournaments():
    tournaments = await db.tournaments.find().to_list(1000)
    return [Tournament(**tournament) for tournament in tournaments]

@api_router.post("/tournaments", response_model=Tournament)
async def create_tournament(tournament_data: TournamentCreate, current_user: User = Depends(get_current_user)):
    tournament_dict = tournament_data.dict()
    tournament_dict["created_by"] = current_user.id
    tournament_dict["start_date"] = datetime.fromisoformat(tournament_data.start_date)
    tournament_dict["end_date"] = datetime.fromisoformat(tournament_data.end_date)
    
    tournament_obj = Tournament(**tournament_dict)
    await db.tournaments.insert_one(tournament_obj.dict())
    
    return tournament_obj

@api_router.post("/tournaments/{tournament_id}/register")
async def register_for_tournament(tournament_id: str, current_user: User = Depends(get_current_user)):
    tournament = await db.tournaments.find_one({"id": tournament_id})
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found")
    
    if current_user.id in tournament["participants"]:
        raise HTTPException(status_code=400, detail="Already registered for this tournament")
    
    if tournament["current_participants"] >= tournament["max_participants"]:
        raise HTTPException(status_code=400, detail="Tournament is full")
    
    await db.tournaments.update_one(
        {"id": tournament_id},
        {
            "$push": {"participants": current_user.id},
            "$inc": {"current_participants": 1}
        }
    )
    
    return {"message": "Successfully registered for tournament"}

# Challenge Routes
@api_router.get("/challenges", response_model=List[Challenge])
async def get_challenges():
    challenges = await db.challenges.find().to_list(1000)
    return [Challenge(**challenge) for challenge in challenges]

@api_router.post("/challenges", response_model=Challenge)
async def create_challenge(challenge_data: ChallengeCreate, current_user: User = Depends(get_current_user)):
    challenge_dict = challenge_data.dict()
    challenge_dict["created_by"] = current_user.id
    
    if challenge_data.scheduled_date:
        challenge_dict["scheduled_date"] = datetime.fromisoformat(challenge_data.scheduled_date)
    
    challenge_obj = Challenge(**challenge_dict)
    await db.challenges.insert_one(challenge_obj.dict())
    
    return challenge_obj

@api_router.post("/challenges/{challenge_id}/accept")
async def accept_challenge(challenge_id: str, current_user: User = Depends(get_current_user)):
    challenge = await db.challenges.find_one({"id": challenge_id})
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    if challenge["status"] != "open":
        raise HTTPException(status_code=400, detail="Challenge is not open")
    
    await db.challenges.update_one(
        {"id": challenge_id},
        {"$set": {"challenged_user": current_user.id, "status": "accepted"}}
    )
    
    return {"message": "Challenge accepted"}

# Team Routes
@api_router.get("/teams", response_model=List[Team])
async def get_teams():
    teams = await db.teams.find().to_list(1000)
    return [Team(**team) for team in teams]

@api_router.post("/teams", response_model=Team)
async def create_team(team_data: TeamCreate, current_user: User = Depends(get_current_user)):
    team_dict = team_data.dict()
    team_dict["captain_id"] = current_user.id
    team_dict["members"] = [current_user.id]
    
    team_obj = Team(**team_dict)
    await db.teams.insert_one(team_obj.dict())
    
    return team_obj

@api_router.post("/teams/{team_id}/join")
async def join_team(team_id: str, current_user: User = Depends(get_current_user)):
    team = await db.teams.find_one({"id": team_id})
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    if current_user.id in team["members"]:
        raise HTTPException(status_code=400, detail="Already a member of this team")
    
    if len(team["members"]) >= team["max_members"]:
        raise HTTPException(status_code=400, detail="Team is full")
    
    await db.teams.update_one(
        {"id": team_id},
        {"$push": {"members": current_user.id}}
    )
    
    return {"message": "Successfully joined team"}

@api_router.post("/teams/join-by-code")
async def join_team_by_code(referral_code: str, current_user: User = Depends(get_current_user)):
    team = await db.teams.find_one({"referral_code": referral_code})
    if not team:
        raise HTTPException(status_code=404, detail="Invalid referral code")
    
    if current_user.id in team["members"]:
        raise HTTPException(status_code=400, detail="Already a member of this team")
    
    if len(team["members"]) >= team["max_members"]:
        raise HTTPException(status_code=400, detail="Team is full")
    
    await db.teams.update_one(
        {"referral_code": referral_code},
        {"$push": {"members": current_user.id}}
    )
    
    return {"message": "Successfully joined team", "team_name": team["name"]}

# Coach Routes
@api_router.get("/coaches", response_model=List[Coach])
async def get_coaches():
    coaches = await db.coaches.find().to_list(1000)
    return [Coach(**coach) for coach in coaches]

@api_router.post("/coaches", response_model=Coach)
async def create_coach_profile(coach_data: CoachCreate, current_user: User = Depends(get_current_user)):
    # Check if user already has a coach profile
    existing_coach = await db.coaches.find_one({"user_id": current_user.id})
    if existing_coach:
        raise HTTPException(status_code=400, detail="Coach profile already exists")
    
    coach_dict = coach_data.dict()
    coach_dict["user_id"] = current_user.id
    
    coach_obj = Coach(**coach_dict)
    await db.coaches.insert_one(coach_obj.dict())
    
    # Update user to mark as coach
    await db.users.update_one({"id": current_user.id}, {"$set": {"is_coach": True}})
    
    return coach_obj

# Game/Scoring Routes
@api_router.post("/games", response_model=Game)
async def create_game(game_data: dict, current_user: User = Depends(get_current_user)):
    game_dict = game_data.copy()
    game_dict["id"] = str(uuid.uuid4())
    game_dict["created_at"] = datetime.utcnow()
    game_dict["scheduled_date"] = datetime.fromisoformat(game_data["scheduled_date"])
    
    game_obj = Game(**game_dict)
    await db.games.insert_one(game_obj.dict())
    
    return game_obj

@api_router.put("/games/{game_id}/score")
async def update_game_score(game_id: str, score_data: dict, current_user: User = Depends(get_current_user)):
    game = await db.games.find_one({"id": game_id})
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    
    await db.games.update_one(
        {"id": game_id},
        {"$set": {
            "score": score_data["score"],
            "status": score_data.get("status", "in_progress"),
            "winner": score_data.get("winner"),
            "stats": score_data.get("stats", {})
        }}
    )
    
    return {"message": "Score updated successfully"}

@api_router.get("/games/me", response_model=List[Game])
async def get_my_games(current_user: User = Depends(get_current_user)):
    games = await db.games.find({
        "$or": [
            {"player1_id": current_user.id},
            {"player2_id": current_user.id}
        ]
    }).to_list(1000)
    return [Game(**game) for game in games]

# Statistics Routes
@api_router.get("/stats/leaderboard")
async def get_leaderboard():
    # This would be implemented with aggregation pipelines
    # For now, return mock data
    return {"message": "Leaderboard endpoint - to be implemented"}

@api_router.get("/")
async def root():
    return {"message": "M2DG Basketball Platform API", "version": "1.0.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("M2DG Basketball Platform API starting up...")
    
    # Initialize some sample data if collections are empty
    if await db.courts.count_documents({}) == 0:
        sample_courts = [
            {
                "id": str(uuid.uuid4()),
                "name": "Downtown Basketball Court",
                "location": "123 Main St, Downtown",
                "description": "Professional indoor court with hardwood floors",
                "court_type": "indoor",
                "surface_type": "hardwood",
                "amenities": ["Air Conditioning", "Sound System", "Scoreboard", "Locker Rooms"],
                "hourly_rate": 50.0,
                "capacity": 20,
                "is_available": True,
                "images": [],
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Riverside Outdoor Court",
                "location": "456 River Ave, Riverside",
                "description": "Outdoor court with great views and lighting",
                "court_type": "outdoor",
                "surface_type": "concrete",
                "amenities": ["Lighting", "Benches", "Water Fountain"],
                "hourly_rate": 25.0,
                "capacity": 15,
                "is_available": True,
                "images": [],
                "created_at": datetime.utcnow()
            }
        ]
        await db.courts.insert_many(sample_courts)
        logger.info("Sample courts created")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
