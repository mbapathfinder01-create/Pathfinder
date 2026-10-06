import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { RequireAdmin, RequireAuth } from './components/layout/RouteGuards';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home';

// Everything beyond the landing page is code-split; charts and PDF code only load when needed.
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Assessment = lazy(() => import('./pages/Assessment'));
const Recommendation = lazy(() => import('./pages/Recommendation'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));
const Specializations = lazy(() => import('./pages/Specializations'));
const Careers = lazy(() => import('./pages/Careers'));
const Opportunities = lazy(() => import('./pages/Opportunities'));

export default function App() {
  return (
    <AppProvider>
      {/* Synchronous route updates, so "navigate home, then sign out" can't be overtaken by a route guard. */}
      <BrowserRouter useTransitions={false}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/specializations" element={<Specializations />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/register" element={<RequireAuth><Register /></RequireAuth>} />
            <Route path="/assessment" element={<RequireAuth><Assessment /></RequireAuth>} />
            <Route path="/recommendation" element={<RequireAuth><Recommendation /></RequireAuth>} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
