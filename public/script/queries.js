export async function searchMangaByTitle(title, page) {
    if (page >= 416)
        page = 415;
    const response = await fetch(`/api/mangas/${title}?page=${page}`);
    const data = await response.json();
    return data;
}

export async function getCoverByID(ID) {
    const response = await fetch(`/api/manga/cover/${ID}`);
    const data = await response.json();
    return data;
}

export async function getChapterFeedByIDandOffset(ID, offset) {
    const response = await fetch(`/api/manga/${ID}/feed/${offset}`);
    const data = await response.json();
    return data;
}

export async function getChapterFeedByID(ID) {
    const response = await fetch(`/api/manga/${ID}/feed`);
    const data = await response.json();
    return data;
}

export async function getMangaByID(ID) {
    const response = await fetch(`/api/manga/${ID}`);
    const data = await response.json();
    return data;
}

export async function getChapterByID(ID) {
    const response = await fetch(`/api/chapter/${ID}`);
    const data = await response.json();
    return data;
}