const API_KEY = 'aa9207e0-e928-4988-878f-a6ef9e404c47';

export const getMovies = async (url) => {
    const resp = await fetch(url, {
        method: 'GET',
        headers: {
            'X-API-KEY': API_KEY,
            'Content-Type': 'application/json',
        }
    });

    return await resp.json();
};