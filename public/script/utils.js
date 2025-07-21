import { getCoverByID } from "./queries.js";

export async function getCoverFilenameByManga(mangaData) {
    const relations = mangaData.relationships;
    const coverRel = relations.find(rel => rel.type === 'cover_art');
    const cover = await getCoverByID(coverRel['id']);
    const fileName = cover.data.attributes['fileName'];
    return fileName;
}

export async function hideLoader() {
    document.querySelector("#loader").style.display = 'none';
    document.querySelector("#loader-text").style.display = 'none';
    document.body.style.overflow = 'auto';
}