
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Navbar } from "../component/navbar";


export const Profile = () => {
    const { store, actions } = useContext(Context);
    

    useEffect(()=>{
        actions.getProfile()
    },[])

    return (
        <div className="text-center mt-0">
            <Navbar/>
            <h1 className="text-center mt-5">Profile</h1>
            <p className="p-3 mb-2 bg-info text-dark">Has iniciado sesión</p>
        </div>
    );
};
