import { createContext } from "react"; 

export const AppContext = createContext()

export const AppProvider = ({props}) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const user = {
        name: 'Yaman Sharma',
        email: 'yaman@example.com'
    }
    
    return (
        <AppContext.Provider value={{user}}>
            {props.children}
        </AppContext.Provider>
    )
}   
