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