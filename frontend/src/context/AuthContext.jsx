import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import api from "../api";


export const AuthContext = createContext(false)

// eslint-disable-next-line react/prop-types
export function AuthProvider({children}){

    const [isAuthenticated, setIsAuthenticated] =useState(false)
    const [username, setUsername] = useState("")

    const handleAuth = () => {
        const token = localStorage.getItem("access")
        if(token){
            const decoded = jwtDecode(token)
            const expiry_date = decoded.exp
            const current_time = Date.now() / 1000
            if(expiry_date >= current_time){
                setIsAuthenticated(true)
            }
        }
    }

    function get_username(){
        api.get("get_username")
        .then(res => {
            setUsername(res.data.username)
        })

        .catch(err => {
            console.log(err.message)
        })
    }

    useEffect(function(){
        handleAuth()
        get_username()
    }, [])

    const authValue = {isAuthenticated, username, setIsAuthenticated, get_username}

    return <AuthContext.Provider value={authValue}>
        {children}
    </AuthContext.Provider>
}