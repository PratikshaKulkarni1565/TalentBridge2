import React, { useState, useCallback, lazy, Suspense } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PageTransition from "./components/PageTransition";
import CommandPalette from "./components/CommandPalette";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";
import SkeletonCard from "./components/SkeletonCard";

// Lazy-loaded pages for code splitting
const Landing      = lazy(() => import("./pages/Landing/Landing"));
const Login        = lazy(() => import("./pages/Login/Login"));
const Signup       = lazy(() => import("./pages/Signup/Signup"));
const Home         = lazy(() => import("./pages/Home/Home"));
const Profile      = lazy(() => import("./pages/Profile/Profile"));
const Search       = lazy(() => import("./pages/Search/Search"));
const Connections  = lazy(() => import("./pages/Connections/Connections"));
const Jobs         = lazy(() => import("./pages/Jobs/Jobs"));
const Messages     = lazy(() => import("./pages/Messages/Messages"));
const Notifications= lazy(() => import("./pages/Notifications/Notifications"));
const Settings     = lazy(() => import("./pages/Settings/Settings"));
const MyApplications = lazy(() => import("./pages/MyApplications/MyApplications"));
const EmployerDashboard = lazy(() => import("./pages/EmployerDashboard/EmployerDashboard"));

const PageLoader = () => (
  <div className="page-container">
    {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [newPostSignal, setNewPostSignal] = useState(0);

  const openCmd  = useCallback(() => setCmdOpen(true), []);
  const closeCmd = useCallback(() => setCmdOpen(false), []);

  const goSearch  = useCallback(() => navigate("/search"), [navigate]);
  const triggerNewPost = useCallback(() => setNewPostSignal((n) => n + 1), []);

  useKeyboardShortcuts({
    onCommandPalette: openCmd,
    onEsc: closeCmd,
    onSearch: goSearch,
    onNewPost: triggerNewPost,
  });

  const isLanding = location.pathname === "/landing";

  return (
    <>
      {!isLanding && <Navbar />}
      {!isLanding && <CommandPalette open={cmdOpen} onClose={closeCmd} onNewPost={triggerNewPost} />}

      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/landing" element={<PageTransition><Landing /></PageTransition>} />
            <Route path="/login"   element={<PageTransition><Login /></PageTransition>} />
            <Route path="/signup"  element={<PageTransition><Signup /></PageTransition>} />
            <Route path="/" element={
              <ProtectedRoute>
                <PageTransition>
                  <Home newPostSignal={newPostSignal} />
                </PageTransition>
              </ProtectedRoute>
            } />
            <Route path="/profile/:id" element={
              <ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute><PageTransition><Search /></PageTransition></ProtectedRoute>
            } />
            <Route path="/connections" element={
              <ProtectedRoute><PageTransition><Connections /></PageTransition></ProtectedRoute>
            } />
            <Route path="/jobs" element={
              <ProtectedRoute><PageTransition><Jobs /></PageTransition></ProtectedRoute>
            } />
            <Route path="/my-applications" element={
              <ProtectedRoute><PageTransition><MyApplications /></PageTransition></ProtectedRoute>
            } />
            <Route path="/employer-dashboard" element={
              <ProtectedRoute><PageTransition><EmployerDashboard /></PageTransition></ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute><PageTransition><Messages /></PageTransition></ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute><PageTransition><Notifications /></PageTransition></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><PageTransition><Settings /></PageTransition></ProtectedRoute>
            } />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  );
}

export default App;
