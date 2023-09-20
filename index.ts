import data from './.env.json'

async function get_count(): Promise<number | null> {
    const path = 'https://youtube.googleapis.com/youtube/v3/channels'
    const query = `part=statistics&id=${data.id}&access_token=${data.token}`
    const url = `${path}?${query}`
    const response = await fetch(url)
    if (!response.ok) return null
    const json = await response.json()
    let result = Number(json?.items[0]?.statistics?.subscriberCount)

    return Number.isNaN(result) ? null : result
}

let count: number = await get_count() ?? 0;

Bun.serve({
    async fetch(req) {
        const new_count = await get_count() ?? count
        count = new_count
        const url = new URL(req.url);
        if (url.pathname === "/") return new Response(Bun.file('./index.html'));
        if (url.pathname === "/style.css") return new Response(Bun.file('./style.css'));
        return new Response(`${count}`);
    },
});
