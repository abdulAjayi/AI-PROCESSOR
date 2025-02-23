
import ProcessorPage from "./processorPage";
import { useState, useEffect } from "react";
import ErrorPage from "./error";

const App = () => {
    const [notAvailable, setNotAvailable] = useState(false)
    useEffect(() =>{
        if(!window.ai){
            setNotAvailable(true)
            return;
        }
    }, [])
    return(
    <div className="bg-deep1 px-4 py-8 min-h-screen text-white">
        
        {notAvailable ? <ErrorPage /> : <ProcessorPage />}
</div>
    )
    
};
export default App;
