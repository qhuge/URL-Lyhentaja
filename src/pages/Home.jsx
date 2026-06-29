import { useState, useEffect, useRef } from "react";
import UrlInput from "../components/UrlInput";
import { createShortUrl } from "../utils/CreateShortUrl.js";
import loginIcon from "../assets/login.svg";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [url, setUrl] = useState("");
    const [shortUrl, setShortUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasCopied, setHasCopied] = useState(false);

    const [invalidToken, setInvalidToken] = useState(false);

    const turnstileTokenRef = useRef("");
    const lastSubmittedUrl = useRef("");
    const turnstileRef = useRef(null);

    const isValidUrl = (string) => {
        try {
            new URL(string)
            return true
        } catch (err) {
            return false
        }
    }

    //load the turnstile
    useEffect(() => {
        function renderWidget() {
            if (!window.turnstile || !turnstileRef.current) return;

            window.turnstile.render(turnstileRef.current, {
                sitekey: "0x4AAAAAADs4VGqprbiR8Pnl",
                theme: "dark",
                appearance: "interaction-only",
                callback: (token) => {
                    turnstileTokenRef.current = token;
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
    }, []);

    const navigate = useNavigate();

    async function handleSubmit() {
        if (url === lastSubmittedUrl.current || !isValidUrl(url)) return;

        if (turnstileTokenRef.current == "") {
            setInvalidToken(true);
            return;
        }

        try {
            setLoading(true);

            lastSubmittedUrl.current = url;

            //Get new url
            let short = await createShortUrl(url, turnstileTokenRef.current);

            if (short !== undefined) {
                setShortUrl("https://link.palmumedia.tk/" + short);
            }
        } finally {
            setLoading(false);
        }

    }
    return (
        <div>
            <div className="flex items-center justify-center py-6 px-6 sm:py-12 sm:px-12">
                <div className="w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-800 shadow-[0_0_40px_rgba(139,92,246,0.15)] p-4 sm:p-12">

                    <h1 className="text-5xl font-bold text-white">
                        URL Lyhentäjä
                    </h1>

                    <p className="mt-4 text-slate-400 text-lg">
                        Lyhennä linkkisi salamannopeasti.
                    </p>

                    <UrlInput value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onSubmit={handleSubmit}
                        loading={loading}
                    />

                    <div
                        ref={turnstileRef}
                        className="mt-6"
                    ></div>

                    {invalidToken && (
                        <div className="text-red-500 ml-2 opacity-80">Complete the challenge</div>
                    )}


                    {shortUrl && (
                        <div className="mt-6 p-4 rounded-xl bg-slate-800 border border-slate-700 text-white">
                            Lyhennetty URL: <a
                                href={shortUrl}
                                className="text-blue-400 underline"
                                target="_blank"
                            >
                                {shortUrl}
                            </a>
                            &nbsp;&nbsp;
                            <button className="inline text-gray-400 hover:underline cursor-pointer" onClick={() => {
                                navigator.clipboard.writeText(shortUrl).then(
                                    () => {
                                        setHasCopied(true);

                                        //Set the state back to not copied after a while
                                        setTimeout(() => {
                                            setHasCopied(false);
                                        }, 1500);
                                    },
                                    () => {
                                        console.error("Couldnt copy url");
                                    },
                                )
                            }
                            }>
                                {hasCopied ? "(Kopioitu)" : "(Kopioi)"}
                            </button>
                        </div>
                    )}

                </div>

            </div>


            <button className="absolute left-1 top-1.5 sm:left-5 sm:top-5" onClick={() => { navigate("/login"); }}>
                <img className="w-4 h-4 sm:w-6 sm:h-6 opacity-0 transition-opacity duration-300 hover:scale-110 hover:opacity-100 cursor-pointer" src={loginIcon} alt="Kirjaudu sisään" onLoad={(e) => e.currentTarget.classList.add("opacity-70")} />
            </button>
        </div>
    );
}