import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [invalidToken, setInvalidToken] = useState(false);
    const turnstileToken = useRef("");
    const turnstileRef = useRef(null);
    const widgetId = useRef(null);

    useEffect(() => {
        async function initialize() {
            const token = localStorage.getItem("token");

            if (token) {
                setIsLoggingIn(true);

                const response = await fetch("/api/verify", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (data.valid) {
                    navigate("/admin", { replace: true });
                    return; // dont load turnstile
                }

                localStorage.removeItem("token");
                setIsLoggingIn(false);
            }

            // No valid session -> load Turnstile
            function renderWidget() {
                if (!window.turnstile || !turnstileRef.current) return;

                widgetId.current = window.turnstile.render(turnstileRef.current, {
                    sitekey: "0x4AAAAAADs4VGqprbiR8Pnl",
                    theme: "dark",
                    callback: (token) => {
                        turnstileToken.current = token;
                        setInvalidToken(false);
                    },
                });
            }

            if (window.turnstile) {
                renderWidget();
                return;
            }

            const script = document.createElement("script");
            script.src =
                "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
            script.async = true;
            script.defer = true;
            script.onload = renderWidget;

            document.body.appendChild(script);
        }

        initialize();
    }, [navigate]);

    async function handleLogin() {
        if (isLoggingIn) return;

        if (turnstileToken.current == "") {
            setInvalidToken(true);
            return;
        }


        setIsLoggingIn(true);

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password,
                    "turnstileToken": turnstileToken.current,
                })
            });

            const data = await response.json();

            if (!response.ok) {
                //request new turnstile token
                turnstileToken.current = "";
                window.turnstile.reset(widgetId.current);

                throw new Error(data.error);
            }

            if (data.success) {
                localStorage.setItem("token", data.token);

                navigate("/admin", { replace: true });
            }

            console.log(data)
        } finally {
            setIsLoggingIn(false);
        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md mx-auto ">
                <button
                    onClick={() => navigate("/")}
                    className="absolute left-4 top-4 text-slate-400 hover:text-white transition text-sm"
                >
                    ← Takaisin
                </button>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-8 shadow-[0_0_40px_rgba(139,92,246,0.15)]">

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-white mb-6 text-center">
                        Kirjaudu sisään
                    </h1>

                    {/* Username */}
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Käyttäjänimi"
                        className="w-full mb-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
                    />

                    {/* Password */}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Salasana"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition"
                    />

                    <div
                        ref={turnstileRef}
                        className="mt-6 min-w-75 min-h-16.25"//min width 300px, height 65px
                    ></div>

                    {invalidToken && (
                        <div className="text-red-500 opacity-80">Complete the challenge</div>
                    )}

                    {/* Button */}
                    <button
                        onClick={() => { handleLogin() }}
                        disabled={isLoggingIn}
                        className="disabled:opacity-50 disabled:cursor-not-allowed w-full rounded-xl bg-violet-600 py-3 mt-6 text-white font-semibold hover:bg-violet-500 transition active:scale-[0.98] mb-2"
                    >
                        {isLoggingIn ? "Kirjaudutaan..." : "Kirjaudu"}
                    </button>

                </div>
            </div>
        </div>

    );
}