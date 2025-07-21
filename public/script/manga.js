import { getChapterFeedByIDandOffset, getMangaByID } from "./queries.js";
import { getCoverFilenameByManga, hideLoader } from "./utils.js";

const chapterContainer = document.querySelector("#bottom-container");
const coverImg = document.querySelector("#cover");
const titleElement = document.querySelector("#title");
const descText = document.querySelector("#description-text");
const descToggle = document.querySelector("#description-toggle");
const shadowOverlay = document.querySelector("#shadow-overlay");
const mangaID = window.location.href.split('/', -1)[4];

async function init() {
    if (mangaID.trim() == '') 
        return;

    const mangaData = await getMangaByID(mangaID);
    // Cover image
    const baseURL = 'https://uploads.mangadex.org/covers/';
    const fileName = await getCoverFilenameByManga(mangaData.data);
    coverImg.src = `${baseURL}/${mangaID}/${fileName}.512.jpg`;

    // Title
    titleElement.textContent = mangaData.data.attributes.title['en'];

    // Description
    if (mangaData.data.attributes.description['en']) {
        descToggle.textContent = 'Expand';
        descText.textContent = mangaData.data.attributes.description['en'].slice(0, 580);
        let clicked = false;
        descToggle.addEventListener("click", () => {
            if (!clicked) {
                descText.textContent = mangaData.data.attributes.description['en'];
                descToggle.textContent = 'Collapse';
                shadowOverlay.style.boxShadow = '0px 0px 0px rgba(25, 25, 25, 1) inset';
                clicked = true;
            }
            else {
                descText.textContent = mangaData.data.attributes.description['en'].slice(0, 580);
                descToggle.textContent = 'Expand';
                shadowOverlay.style.boxShadow = '0px -32px 8px rgba(25, 25, 25, 1) inset';
                clicked = false;
            }
        });
    }
    // Chapters
    await createChapterList();

    // Hide loader
    hideLoader();
}

async function createChapterList() {
    let limit = 100;
    let offset = 0;
    let cleared = false;
    while (limit == 100) {
        const data = await getChapterFeedByIDandOffset(mangaID, offset);
        if (data.data.length == 0) {
            return;
        }
        if (!cleared) {
            chapterContainer.innerHTML = '';
            cleared = true;
        }
        for (let x of data.data) {
            createChapter(x);
        }
        limit = data.data.length;
        offset += limit;
    }
}

function createChapter(data) {
    let anchor = document.createElement("a");
    let box = document.createElement("div");

    const volume = data.attributes['volume'];
    const chapter = data.attributes['chapter'];
    const title = data.attributes['title'];
    
    if (volume) {
        box.textContent = `Volume ${volume} - `
    }
    if (chapter) {
        box.textContent += `Chapter ${chapter} `;
    }
    else {
        box.textContent += `Chapter `;
    }
    if (title) {
        box.textContent += `- ${title}`;
    }
    box.classList.add('chapter');

    anchor.href = `/manga/${mangaID}/chapter/${data.id}`;

    anchor.appendChild(box);
    chapterContainer.appendChild(anchor);
}

init();