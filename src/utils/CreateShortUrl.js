export async function createShortUrl(originalUrl, tkn) {

    const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "url": originalUrl,
            "turnstileToken": tkn,
        })
    });

    const data = await response.json();

    return data.shortCode
}