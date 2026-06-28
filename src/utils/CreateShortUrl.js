export async function createShortUrl(originalUrl) {

    const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "url": originalUrl
        })
    });

    const data = await response.json();

    return data.shortCode
}