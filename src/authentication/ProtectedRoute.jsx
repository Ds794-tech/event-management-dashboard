import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, Route } from "react-router-dom";
import { protectedRouteList, publicRouteList } from "./RouteList";
import DefaultLayout from "../layout";

export const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" />;
    }
    return children 
}


export const PublicRoute = ({children}) => {
    const { user } = useAuth();
    if (user) {
        return <Navigate to="/" />;
    }
    return children;
};
