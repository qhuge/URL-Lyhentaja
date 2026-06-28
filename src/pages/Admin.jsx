import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Admin() {
    const [urls, setUrls] = useState([]);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const [editingId, setEditingId] = useState(null);
    const [tempCode, setTempCode] = useState("");
    const [submittingEdit, setSubmittingEdit] = useState(false);

    // auth check
    useEffect(() => {
        if (!token) navigate("/", { replace: true });
    }, []);

    // fetch urls
    useEffect(() => {
        fetch("/api/getlinks", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Unauthorized");
                return res.json();
            })
            .then(setUrls)
            .catch(() => navigate("/", { replace: true }));
    }, []);


    function logout() {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    }

    async function deleteUrl(id) {
        if (submittingEdit) return;

        await fetch("/api/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ id })
        });

        setUrls(urls.filter(u => u.id !== id));
    }

    async function updateCode(id, newCode) {
        if (submittingEdit) return;

        setSubmittingEdit(true);
        await fetch("/api/modify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ id, newCode })
        });

        setUrls(
            urls.map(u =>
                u.id === id ? { ...u, shortCode: newCode } : u
            )
        );

        setEditingId(null);
        setSubmittingEdit(false);
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-10">

            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => {console.log("back"); navigate("/")}}
                    className="bg-slate-800 border border-slate-700 px-4 py-2 rounded hover:border-violet-500 transition cursor-pointer"
                >
                    ← Back
                </button>

                <h1 className="text-3xl font-bold">Admin Dashboard</h1>

                <button
                    onClick={logout}
                    className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition cursor-pointer"
                >
                    Logout
                </button>
            </div>

            <div className="space-y-4">
                {urls.map(url => (
                    <div
                        key={url.id}
                        className="bg-slate-900 p-4 rounded-xl flex items-center justify-between"
                    >
                        <div>
                            <p className="text-lg">
                                {editingId === url.id ? (
                                    <>
                                        /{" "}
                                        <input
                                            value={tempCode}
                                            onChange={(e) => setTempCode(e.target.value)}
                                            className="bg-slate-800 px-2 py-1 rounded ml-1"
                                        />
                                    </>
                                ) : (
                                    `/${url.shortCode} → ${url.originalUrl}`
                                )}
                            </p>

                            <p className="text-sm text-gray-400">
                                clicks: {url.clicks}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            {/* EDIT / SAVE BUTTON */}
                            {editingId === url.id ? (
                                <>
                                    <button
                                        onClick={() => updateCode(url.id, tempCode)}
                                        disabled={submittingEdit}
                                        className="bg-green-600 px-3 py-1 rounded cursor-pointer disabled:bg-green-900"
                                    >
                                        Save
                                    </button>

                                    <button
                                        onClick={() => {
                                            setEditingId(null);
                                            setTempCode("");
                                        }}
                                        className="bg-gray-600 px-3 py-1 rounded cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        setEditingId(url.id);
                                        setTempCode(url.shortCode);
                                    }}
                                    className="bg-blue-600 px-3 py-1 rounded cursor-pointer"
                                >
                                    Edit
                                </button>
                            )}

                            {/* DELETE */}
                            <button
                                onClick={() => deleteUrl(url.id)}
                                className="bg-red-600 px-3 py-1 rounded cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}