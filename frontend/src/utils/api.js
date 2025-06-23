import axios from 'axios';

const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

// Set up axios defaults
axios.defaults.baseURL = API_BASE;

// Add token to requests if available
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// API endpoints
export const api = {
  // Auth
  login: (data) => axios.post('/auth/login', data),
  register: (data) => axios.post('/auth/register', data),
  
  // User
  getCurrentUser: () => axios.get('/users/me'),
  updateProfile: (data) => axios.put('/users/me', data),
  
  // Courts
  getCourts: () => axios.get('/courts'),
  getCourt: (id) => axios.get(`/courts/${id}`),
  createCourt: (data) => axios.post('/courts', data),
  
  // Bookings
  createBooking: (data) => axios.post('/bookings', data),
  getMyBookings: () => axios.get('/bookings/me'),
  
  // Tournaments
  getTournaments: () => axios.get('/tournaments'),
  createTournament: (data) => axios.post('/tournaments', data),
  registerForTournament: (id) => axios.post(`/tournaments/${id}/register`),
  
  // Challenges
  getChallenges: () => axios.get('/challenges'),
  createChallenge: (data) => axios.post('/challenges', data),
  acceptChallenge: (id) => axios.post(`/challenges/${id}/accept`),
  
  // Teams
  getTeams: () => axios.get('/teams'),
  createTeam: (data) => axios.post('/teams', data),
  joinTeam: (id) => axios.post(`/teams/${id}/join`),
  joinTeamByCode: (code) => axios.post('/teams/join-by-code', null, { params: { referral_code: code } }),
  
  // Coaches
  getCoaches: () => axios.get('/coaches'),
  createCoachProfile: (data) => axios.post('/coaches', data),
  
  // Games
  createGame: (data) => axios.post('/games', data),
  updateGameScore: (id, data) => axios.put(`/games/${id}/score`, data),
  getMyGames: () => axios.get('/games/me'),
  
  // Stats
  getLeaderboard: () => axios.get('/stats/leaderboard')
};

export default api;