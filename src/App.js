import './App.css';

// import AuthContext from './contexts/AuthProvider';
import AuthContext from './contexts/AuthProvider';


import React, { Component, useEffect } from 'react'
import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login/Login';
import UserList from './pages/users/UserList';
import UserCreate from './pages/users/UserCreate';
import { HomeLayout, AdminLayout } from './layouts'
import BeneficiaryProfile from './pages/beneficiaries/BeneficiaryProfile';
import PsCaseShow from './pages/PsCases/PsCaseShow/PsCaseShow';
import PsCaseList from './pages/PsCases/PsCaseList/PsCaseList';
import PsIntakeCreate from './pages/PsCases/PsIntakeCreate';
import RequireAuth from './components/RequireAuth';
import Unauthorized from './pages/Unauthorized';
import Page404 from './pages/Page404';
import BeneficiaryCreate from './pages/beneficiaries/BeneficiaryCreate';
import BeneficiaryList from './pages/beneficiaries/BeneficiaryList';
import Dashboard from './pages/Dashboard/Dashboard';
import PersistLogin from './components/PersistLogin';
import CurrentUserProfile from './pages/CurrentUserProfile/CurrentUserProfile';
// import Profile from './pages/profile/Profile'

const App = () => {
// const {dispatch, token, isLoggedIn} = useContext(AuthContext);

// get access token
// useEffect(()=> {
//   const _appSigning = localStorage.getItem("_appSigning")
//   if(_appSigning) {
//     const getToken = async () => {
//       const res = await api.post("/auth/access")
//       dispatch({type: "GET_TOKEN", payload: res.data.ac_token})

//       // // set token for upcoming axios calls
//       // api.interceptors.request.use(request => {
//       //   request.headers.common.Authorization = `Bearer ${token}`;
//       //   return request;
//       // });
//     }
//     getToken();
//   }
// }, [dispatch, isLoggedIn])

// useEffect(() => {
//   if (token) {
//     const getUser = async () => {
//       dispatch({ type: "SIGNING" });
//       const res = await api.get("/api/auth/user");
//       dispatch({ type: "GET_USER", payload: res.data });
//     };
//     getUser();
//   }
// }, [dispatch, token]);

const {isLoggedIn} = useContext(AuthContext);

  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login />} />
        
        
        {/* <Route path='/' element={isLoggedIn ? <HomeLayout /> : <Login />} /> */}
        
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />} >
            <Route path='/' element={<HomeLayout />}>
              <Route path='profile' element={<CurrentUserProfile />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="beneficiaries" element={<BeneficiaryList />} />
              <Route path="beneficiaries/:beneficiaryId" element={<BeneficiaryProfile />} />
              <Route path="beneficiaries/create" element={<BeneficiaryCreate />} />
              
              <Route index path="ps-cases" element={<PsCaseList />} />
              <Route path="ps-cases/:psCaseId/*" element={<PsCaseShow />} />
              <Route path="ps-cases/create/" element={<PsIntakeCreate />} />
              <Route path="*" element={<Page404 />} />
            </Route>

            <Route path='/admin' element={<AdminLayout />}>
              <Route path="users" element={<UserList />} />
              
              <Route path='users/edit/:userId' element={<UserCreate />} />
              <Route path='users/create' element={<UserCreate />} />
              <Route path="*" element={<Page404 />} />
            </Route>

          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* <Route path='/profile' element={<Profile />} />  */}
        {/* <Route path='/admin' element={<Admin />} /> */}

        {/* Catch all */}
        <Route path="*" element={<Page404 />} />

      </Routes>
    </div>
  )
}

export default App