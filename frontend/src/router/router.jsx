import{ Route, Routes, Navigate } from 'react-router-dom'
import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import Settings from '../pages/Settings';
import CreatePlaylist from '../pages/CreatePlaylist';
import UploadSongs from '../pages/UploadSongs';
import MoodDetector from '../pages/MoodDetector';
import SongPlayer from '../pages/SongPlayer';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, id }) => {
    if (!id) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const PublicRoute = ({ children, id }) => {
    if (id) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const AppRouter = () => {
    const id = useSelector((state) => state.auth.data?.id); 

    console.log("User ID in Router:", id);
    
    return (
        <Routes>
            {/* Protected Routes */}
            <Route 
                path='/' 
                element={
                    <ProtectedRoute id={id}>
                        <Home />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path='/settings' 
                element={
                    <ProtectedRoute id={id}>
                        <Settings />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path='/create-playlist' 
                element={
                    <ProtectedRoute id={id}>
                        <CreatePlaylist />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path='/uploadsongs' 
                element={
                    <ProtectedRoute id={id}>
                        <UploadSongs />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path='/mooddetector' 
                element={
                    <ProtectedRoute id={id}>
                        <MoodDetector />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path='/song/:id' 
                element={
                    <ProtectedRoute id={id}>
                        <SongPlayer />
                    </ProtectedRoute>
                } 
            />

            {/* Public Routes (redirect to home if logged in) */}
            <Route 
                path='/login' 
                element={
                    <PublicRoute id={id}>
                        <Login />
                    </PublicRoute>
                } 
            />
            <Route 
                path='/register' 
                element={
                    <PublicRoute id={id}>
                        <Register />
                    </PublicRoute>
                } 
            />

            {/* Catch all - redirect to login if not authenticated, home if authenticated */}
            <Route 
                path='*' 
                element={<Navigate to={id ? "/" : "/login"} replace />} 
            />
        </Routes>
    );
};

export default AppRouter;