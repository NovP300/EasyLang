import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

import CoursePage from "./pages/CoursePage";
import LessonPage from "./pages/LessonPage";
import GamePage from "./pages/ExercisePage";
import MainPage from "./pages/MainPage";
import ProgressPage from "./pages/ProgressPage";
import ReviewsPage from "./pages/ReviewsPage";
import LoginModal from "./modals/LoginModal";
import RegisterModal from "./modals/RegisterModal";
import ReviewModal from "./modals/ReviewModal";
import Layout from "./components/Layout";

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="languages/:Name" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
          <Route path="lessons/:slug" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
          <Route path="lessons/:slug/exercises" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
        </Route>
      </Routes>


      {/* Модалки поверх background */}
      {background && (
        <Routes>
          <Route path="/login" element={<LoginModal />} />
          <Route path="/register" element={<RegisterModal />} />
          <Route path="/review" element={<ReviewModal />} />
        </Routes>
      )}

    </>
  );
}

export default App;
