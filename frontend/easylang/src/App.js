import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";

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
import MyCourses from "./pages/MyCourses"
import TestPage from "./pages/TestPage";
import Layout from "./components/Layout";
import ModerateReviewsPage from "./pages/ModerateReviewsPage";
import ModerateFeedbacksPage from "./pages/ModerateFeedBacksPage";
import AboutTheCoursePage from './pages/AboutTheCoursePage';
import PaymentPage from "./pages/PaymentPage";
import PromoModal from "./modals/PromoModal";
import { getProfile } from "./api/profile";
import ScrollToTop from "./components/ScrollToTop";


import { useState, useEffect } from "react";

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));
  useEffect(() => {
        const fetchUser = async () => {
          if (!isAuthenticated) return;
          const data = await getProfile(); 
          if (data) setUser(data);
          setLoadingUser(false);
        };
  
        fetchUser();
      }, [isAuthenticated]);
  const isModerator = user?.role === "CM";

  return (
    <>
      <ScrollToTop />
      <Routes location={background || location}>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />

          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="languages/:Name" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
          <Route path="lessons/:slug" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
          <Route path="lessons/:slug/exercises" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
          <Route path="/test" element={<TestPage />} />
          <Route path="test/:slug/exercises" element={<GamePage />} />
          <Route path="/courses" element={<MyCourses />} />

          <Route path="/moderate/reviews" element={isModerator ? <ModerateReviewsPage /> : <Navigate to="/" />}/>
          <Route path="/moderate/feedbacks" element={isModerator ? <ModerateFeedbacksPage /> : <Navigate to="/" />}/>

          <Route path="/" element={<MainPage />} />
          <Route path="/about-the-course/:language" element={<AboutTheCoursePage />} />
          <Route path="/payment" element={<PaymentPage/>}> </Route>
          
        </Route>
      </Routes>
      {/* Модалки поверх background */}
      {background && (
        <Routes>
          <Route path="/login" element={<LoginModal />} />
          <Route path="/register" element={<RegisterModal />} />
          <Route path="/review" element={<ReviewModal />} />
          <Route path="/promo" element={<PromoModal />} />
        </Routes>
      )}

    </>
  );
}

export default App;
