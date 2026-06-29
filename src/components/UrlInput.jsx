function UrlInput({ value, onChange, onSubmit, loading }) {
    return (
        <div className="mt-8 w-full flex flex-col sm:flex-row">
            <input
                type="text"
                placeholder="Liitä URL osoitteesi tähän..."
                value={value}
                onChange={onChange}
                className="
                    w-full
                    basis-4/5
                    px-5
                    mr-0
                    sm:mr-3
                    py-4
                    rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition
                "
            />

            <button
                onClick={onSubmit}
                disabled={loading}
                className="
                    w-full
                    basis-1/5
                    rounded-xl
                    border border-slate-700
                    bg-slate-800
                    px-5
                    ml-0
                    mt-3
                    sm:mt-0
                    sm:ml-3
                    py-4
                    text-white
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    transition

                    hover:border-violet-500
                    hover:ring-2
                    hover:ring-violet-500/20

                    active:scale-[0.98]
                "
            >
                {loading ? "Lyhennetään..." : "Lyhennä"}
            </button>
        </div>
    );
}

export default UrlInput;