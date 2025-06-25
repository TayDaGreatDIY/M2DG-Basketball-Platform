import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import GuestPage from "./pages/GuestPage";
import CourtsPage from "./pages/CourtsPage";
import CourtBookingPage from "./pages/CourtBookingPage";
import TournamentsPage from "./pages/TournamentsPage";
import ChallengesPage from "./pages/ChallengesPage";
import TeamsPage from "./pages/TeamsPage";
import ProfilePage from "./pages/ProfilePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import CoachesPage from "./pages/CoachesPage";
import ScoringPage from "./pages/ScoringPage";

// Phase 3 - Social Features
import LeaderboardsPage from "./pages/LeaderboardsPage";
import GameHistoryPage from "./pages/GameHistoryPage";
import SocialFeaturesPage from "./pages/SocialFeaturesPage";
import CommunityForumsPage from "./pages/CommunityForumsPage";

// Phase 4 - Advanced Analytics
import AdvancedAnalyticsPage from "./pages/AdvancedAnalyticsPage";
import ProgressTrackingPage from "./pages/ProgressTrackingPage";
import RecommendationEnginePage from "./pages/RecommendationEnginePage";
import AchievementSystemPage from "./pages/AchievementSystemPage";
import AdminDemoPage from "./pages/AdminDemoPage";
import PaymentPage from "./pages/PaymentPage";
import VideoAnalysisPage from "./pages/VideoAnalysisPage";
import MentalHealthPage from "./pages/MentalHealthPage";
import TherapistRegistrationPage from "./pages/TherapistRegistrationPage";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏀</div>
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/guest" element={<GuestPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* ADMIN DEMO - NO LOGIN REQUIRED */}
          <Route path="/admin-demo" element={<AdminDemoPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/video-analysis" element={<VideoAnalysisPage />} />
          <Route path="/mental-health" element={<MentalHealthPage />} />
          <Route path="/therapist-registration" element={<TherapistRegistrationPage />} />
          
          {/* Protected Routes - Core Features */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courts" 
            element={
              <ProtectedRoute>
                <CourtsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courts/:courtId/book" 
            element={
              <ProtectedRoute>
                <CourtBookingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tournaments" 
            element={
              <ProtectedRoute>
                <TournamentsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/challenges" 
            element={
              <ProtectedRoute>
                <ChallengesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/teams" 
            element={
              <ProtectedRoute>
                <TeamsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/coaches" 
            element={
              <ProtectedRoute>
                <CoachesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/scoring" 
            element={
              <ProtectedRoute>
                <ScoringPage />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes - Phase 3: Social Features */}
          <Route 
            path="/leaderboards" 
            element={
              <ProtectedRoute>
                <LeaderboardsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/game-history" 
            element={
              <ProtectedRoute>
                <GameHistoryPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/social" 
            element={
              <ProtectedRoute>
                <SocialFeaturesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forums" 
            element={
              <ProtectedRoute>
                <CommunityForumsPage />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes - Phase 4: Advanced Analytics */}
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <AdvancedAnalyticsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/progress" 
            element={
              <ProtectedRoute>
                <ProgressTrackingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recommendations" 
            element={
              <ProtectedRoute>
                <RecommendationEnginePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/achievements" 
            element={
              <ProtectedRoute>
                <AchievementSystemPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
