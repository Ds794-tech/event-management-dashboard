import React from 'react';





export const publicRouteList = [
    {
        path: '/login',
        elemment: React.lazy(() => import('../components/LoginForm')),
        exact: true,
    },
    {
        path: '/signup',
        elemment: React.lazy(() => import('../components/SignupForm')),
        exact: true,
    },
]


export const protectedRouteList = [
    {
        path: '/',
        elemment: React.lazy(() => import('../components/EventList')),
        exact: true,
    }
]
