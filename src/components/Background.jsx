function Background({children}) {
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-violet-950">
            <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

            {children}

        </div >
    );
    
}

export default Background;