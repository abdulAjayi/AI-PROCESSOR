const ErrorPage = () => {
    return ( 
        <main className="flex justify-center items-center h-screen">
            <div className="text-center">
                <h2 className="md:text-2xl text-base mb-5">chrome API is not available on you browswer</h2>
                <p>Navigate to <span className="bg-slate-500 p-1 rounded-sm">chrome://flags</span> and enable the AI API flag</p>
            </div>
        </main>
     );
}

export default ErrorPage;