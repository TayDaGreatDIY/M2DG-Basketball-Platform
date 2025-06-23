#!/usr/bin/env python3
import requests
import json
import time
import os
from datetime import datetime, timedelta

# Get the backend URL from the frontend .env file
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BACKEND_URL = line.strip().split('=')[1].strip('"\'')
            break

# Ensure the URL doesn't have quotes
BACKEND_URL = BACKEND_URL.strip('"\'')
API_URL = f"{BACKEND_URL}/api"

print(f"Using API URL: {API_URL}")

# Test data
test_user = {
    "username": f"testuser_{int(time.time())}",
    "email": f"testuser_{int(time.time())}@example.com",
    "password": "Password123!",
    "full_name": "Test User",
    "phone": "555-123-4567"
}

# Store tokens and IDs
access_token = None
user_id = None
court_id = None
booking_id = None
tournament_id = None
challenge_id = None
team_id = None
coach_id = None
game_id = None
referral_code = None

# Test results
test_results = {}

def run_test(test_name, endpoint, method="GET", data=None, auth=False, expected_status=200, test_description=""):
    """Run a test against the API and record the result"""
    url = f"{API_URL}{endpoint}"
    headers = {}
    
    if auth and access_token:
        headers["Authorization"] = f"Bearer {access_token}"
    
    if data:
        headers["Content-Type"] = "application/json"
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers)
        elif method == "PUT":
            response = requests.put(url, json=data, headers=headers)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers)
        
        success = response.status_code == expected_status
        
        result = {
            "success": success,
            "status_code": response.status_code,
            "expected_status": expected_status,
            "description": test_description,
            "response": response.json() if success else response.text[:200]
        }
        
        test_results[test_name] = result
        
        print(f"Test: {test_name}")
        print(f"  Endpoint: {method} {url}")
        print(f"  Status: {'✅ PASS' if success else '❌ FAIL'} (got {response.status_code}, expected {expected_status})")
        
        if not success:
            print(f"  Response: {response.text[:200]}")
        else:
            print(f"  Response: {json.dumps(response.json(), indent=2)[:200]}...")
        
        return response.json() if success else None
    
    except Exception as e:
        test_results[test_name] = {
            "success": False,
            "status_code": None,
            "expected_status": expected_status,
            "description": test_description,
            "error": str(e)
        }
        
        print(f"Test: {test_name}")
        print(f"  Endpoint: {method} {url}")
        print(f"  Status: ❌ FAIL (Exception: {str(e)})")
        
        return None

def test_health_check():
    """Test the health check endpoint"""
    return run_test(
        "Health Check",
        "/",
        method="GET",
        expected_status=200,
        test_description="Test the API health check endpoint"
    )

def test_register():
    """Test user registration"""
    global access_token, user_id
    
    response = run_test(
        "User Registration",
        "/auth/register",
        method="POST",
        data=test_user,
        expected_status=200,
        test_description="Register a new user"
    )
    
    if response:
        access_token = response.get("access_token")
        user_id = response.get("user_id")
        return True
    return False

def test_login():
    """Test user login"""
    global access_token, user_id
    
    login_data = {
        "email": test_user["email"],
        "password": test_user["password"]
    }
    
    response = run_test(
        "User Login",
        "/auth/login",
        method="POST",
        data=login_data,
        expected_status=200,
        test_description="Login with registered user"
    )
    
    if response:
        access_token = response.get("access_token")
        user_id = response.get("user_id")
        return True
    return False

def test_get_current_user():
    """Test getting current user profile"""
    return run_test(
        "Get Current User",
        "/users/me",
        method="GET",
        auth=True,
        expected_status=200,
        test_description="Get the current user's profile"
    )

def test_update_user_profile():
    """Test updating user profile"""
    update_data = {
        "bio": "I love basketball!",
        "position": "Point Guard",
        "height": "6'2\"",
        "weight": "185 lbs",
        "experience_level": "Intermediate"
    }
    
    return run_test(
        "Update User Profile",
        "/users/me",
        method="PUT",
        data=update_data,
        auth=True,
        expected_status=200,
        test_description="Update the current user's profile"
    )

def test_get_courts():
    """Test getting all courts"""
    global court_id
    
    response = run_test(
        "Get Courts",
        "/courts",
        method="GET",
        expected_status=200,
        test_description="Get all available basketball courts"
    )
    
    if response and len(response) > 0:
        court_id = response[0]["id"]
        return True
    return False

def test_create_court():
    """Test creating a new court"""
    global court_id
    
    court_data = {
        "name": "Test Court",
        "location": "123 Test St, Test City",
        "description": "A test basketball court",
        "court_type": "indoor",
        "surface_type": "hardwood",
        "amenities": ["Lighting", "Scoreboard"],
        "hourly_rate": 35.0,
        "capacity": 10,
        "images": []
    }
    
    response = run_test(
        "Create Court",
        "/courts",
        method="POST",
        data=court_data,
        auth=True,
        expected_status=200,
        test_description="Create a new basketball court"
    )
    
    if response:
        court_id = response.get("id")
        return True
    return False

def test_get_court_details():
    """Test getting court details"""
    if not court_id:
        print("Skipping court details test - no court_id available")
        return False
    
    return run_test(
        "Get Court Details",
        f"/courts/{court_id}",
        method="GET",
        expected_status=200,
        test_description="Get details for a specific court"
    )

def test_create_booking():
    """Test creating a booking"""
    global booking_id
    
    if not court_id:
        print("Skipping booking test - no court_id available")
        return False
    
    # Create a booking for tomorrow
    tomorrow = datetime.now() + timedelta(days=1)
    date_str = tomorrow.strftime("%Y-%m-%d")
    time_str = "14:00"  # 2 PM
    
    booking_data = {
        "court_id": court_id,
        "date": date_str,
        "start_time": time_str,
        "duration_hours": 2,
        "special_requests": "Need extra basketballs"
    }
    
    response = run_test(
        "Create Booking",
        "/bookings",
        method="POST",
        data=booking_data,
        auth=True,
        expected_status=200,
        test_description="Create a new court booking"
    )
    
    if response:
        booking_id = response.get("id")
        return True
    return False

def test_get_user_bookings():
    """Test getting user bookings"""
    return run_test(
        "Get User Bookings",
        "/bookings/me",
        method="GET",
        auth=True,
        expected_status=200,
        test_description="Get the current user's bookings"
    )

def test_create_tournament():
    """Test creating a tournament"""
    global tournament_id
    
    # Create a tournament for next month
    start_date = datetime.now() + timedelta(days=30)
    end_date = start_date + timedelta(days=2)
    
    tournament_data = {
        "name": "Test Tournament",
        "description": "A test basketball tournament",
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "entry_fee": 50.0,
        "max_participants": 16,
        "prize_pool": 500.0,
        "rules": ["Single elimination", "20 minute games"]
    }
    
    response = run_test(
        "Create Tournament",
        "/tournaments",
        method="POST",
        data=tournament_data,
        auth=True,
        expected_status=200,
        test_description="Create a new tournament"
    )
    
    if response:
        tournament_id = response.get("id")
        return True
    return False

def test_get_tournaments():
    """Test getting all tournaments"""
    return run_test(
        "Get Tournaments",
        "/tournaments",
        method="GET",
        expected_status=200,
        test_description="Get all tournaments"
    )

def test_register_for_tournament():
    """Test registering for a tournament"""
    if not tournament_id:
        print("Skipping tournament registration test - no tournament_id available")
        return False
    
    return run_test(
        "Register for Tournament",
        f"/tournaments/{tournament_id}/register",
        method="POST",
        auth=True,
        expected_status=200,
        test_description="Register for a tournament"
    )

def test_create_challenge():
    """Test creating a challenge"""
    global challenge_id
    
    # Create a challenge for next week
    next_week = datetime.now() + timedelta(days=7)
    
    challenge_data = {
        "title": "Test Challenge",
        "description": "A test basketball challenge",
        "scheduled_date": next_week.isoformat(),
        "wager_amount": 20.0
    }
    
    response = run_test(
        "Create Challenge",
        "/challenges",
        method="POST",
        data=challenge_data,
        auth=True,
        expected_status=200,
        test_description="Create a new challenge"
    )
    
    if response:
        challenge_id = response.get("id")
        return True
    return False

def test_get_challenges():
    """Test getting all challenges"""
    return run_test(
        "Get Challenges",
        "/challenges",
        method="GET",
        expected_status=200,
        test_description="Get all challenges"
    )

def test_accept_challenge():
    """Test accepting a challenge"""
    if not challenge_id:
        print("Skipping challenge acceptance test - no challenge_id available")
        return False
    
    return run_test(
        "Accept Challenge",
        f"/challenges/{challenge_id}/accept",
        method="POST",
        auth=True,
        expected_status=200,
        test_description="Accept a challenge"
    )

def test_create_team():
    """Test creating a team"""
    global team_id, referral_code
    
    team_data = {
        "name": "Test Team",
        "description": "A test basketball team",
        "max_members": 10,
        "team_logo": None
    }
    
    response = run_test(
        "Create Team",
        "/teams",
        method="POST",
        data=team_data,
        auth=True,
        expected_status=200,
        test_description="Create a new team"
    )
    
    if response:
        team_id = response.get("id")
        referral_code = response.get("referral_code")
        return True
    return False

def test_get_teams():
    """Test getting all teams"""
    return run_test(
        "Get Teams",
        "/teams",
        method="GET",
        expected_status=200,
        test_description="Get all teams"
    )

def test_join_team():
    """Test joining a team"""
    if not team_id:
        print("Skipping team join test - no team_id available")
        return False
    
    # Note: In a real test, we would need a second user to join the team
    # For this test, we'll just verify the endpoint works
    return run_test(
        "Join Team",
        f"/teams/{team_id}/join",
        method="POST",
        auth=True,
        expected_status=400,  # Expect 400 because user is already in the team
        test_description="Join a team (should fail as user is already in team)"
    )

def test_join_team_by_code():
    """Test joining a team by referral code"""
    if not referral_code:
        print("Skipping team join by code test - no referral_code available")
        return False
    
    # Note: In a real test, we would need a second user to join the team
    # For this test, we'll just verify the endpoint works
    return run_test(
        "Join Team by Code",
        f"/teams/join-by-code?referral_code={referral_code}",
        method="POST",
        auth=True,
        expected_status=400,  # Expect 400 because user is already in the team
        test_description="Join a team by referral code (should fail as user is already in team)"
    )

def test_create_coach_profile():
    """Test creating a coach profile"""
    global coach_id
    
    coach_data = {
        "specialties": ["Shooting", "Defense"],
        "experience_years": 5,
        "certifications": ["FIBA Level 1"],
        "hourly_rate": 50.0,
        "bio": "Experienced basketball coach",
        "availability": {
            "Monday": ["18:00-20:00"],
            "Wednesday": ["18:00-20:00"],
            "Saturday": ["10:00-14:00"]
        }
    }
    
    response = run_test(
        "Create Coach Profile",
        "/coaches",
        method="POST",
        data=coach_data,
        auth=True,
        expected_status=200,
        test_description="Create a new coach profile"
    )
    
    if response:
        coach_id = response.get("id")
        return True
    return False

def test_get_coaches():
    """Test getting all coaches"""
    return run_test(
        "Get Coaches",
        "/coaches",
        method="GET",
        expected_status=200,
        test_description="Get all coaches"
    )

def test_create_game():
    """Test creating a game"""
    global game_id
    
    if not court_id:
        print("Skipping game creation test - no court_id available")
        return False
    
    # Create a game for next week
    next_week = datetime.now() + timedelta(days=7)
    
    game_data = {
        "player1_id": user_id,
        "court_id": court_id,
        "scheduled_date": next_week.isoformat(),
        "game_type": "1v1"
    }
    
    response = run_test(
        "Create Game",
        "/games",
        method="POST",
        data=game_data,
        auth=True,
        expected_status=200,
        test_description="Create a new game"
    )
    
    if response:
        game_id = response.get("id")
        return True
    return False

def test_update_game_score():
    """Test updating a game score"""
    if not game_id:
        print("Skipping game score update test - no game_id available")
        return False
    
    score_data = {
        "score": {
            "player1": 21,
            "player2": 15
        },
        "status": "completed",
        "winner": user_id
    }
    
    return run_test(
        "Update Game Score",
        f"/games/{game_id}/score",
        method="PUT",
        data=score_data,
        auth=True,
        expected_status=200,
        test_description="Update a game score"
    )

def test_get_user_games():
    """Test getting user games"""
    return run_test(
        "Get User Games",
        "/games/me",
        method="GET",
        auth=True,
        expected_status=200,
        test_description="Get the current user's games"
    )

def test_unauthorized_access():
    """Test unauthorized access to protected endpoints"""
    return run_test(
        "Unauthorized Access",
        "/users/me",
        method="GET",
        auth=False,
        expected_status=401,
        test_description="Try to access a protected endpoint without authentication"
    )

def run_all_tests():
    """Run all tests in sequence"""
    print("\n=== Starting API Tests ===\n")
    
    # Basic endpoint
    test_health_check()
    
    # Authentication
    test_register()
    test_login()
    test_get_current_user()
    test_update_user_profile()
    
    # Courts
    test_get_courts()
    test_create_court()
    test_get_court_details()
    
    # Bookings
    test_create_booking()
    test_get_user_bookings()
    
    # Tournaments
    test_create_tournament()
    test_get_tournaments()
    test_register_for_tournament()
    
    # Challenges
    test_create_challenge()
    test_get_challenges()
    test_accept_challenge()
    
    # Teams
    test_create_team()
    test_get_teams()
    test_join_team()
    test_join_team_by_code()
    
    # Coaches
    test_create_coach_profile()
    test_get_coaches()
    
    # Games
    test_create_game()
    test_update_game_score()
    test_get_user_games()
    
    # Security
    test_unauthorized_access()
    
    # Print summary
    print("\n=== Test Summary ===\n")
    
    total_tests = len(test_results)
    passed_tests = sum(1 for result in test_results.values() if result["success"])
    
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests}")
    print(f"Failed: {total_tests - passed_tests}")
    print(f"Success Rate: {passed_tests / total_tests * 100:.2f}%\n")
    
    print("=== Detailed Results ===\n")
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result["success"] else "❌ FAIL"
        print(f"{status} - {test_name}: {result['description']}")
        if not result["success"]:
            if "error" in result:
                print(f"  Error: {result['error']}")
            else:
                print(f"  Expected status: {result['expected_status']}, got: {result['status_code']}")
    
    return passed_tests, total_tests

if __name__ == "__main__":
    run_all_tests()