import { getChapterByID, getChapterFeedByID } from "./queries.js";
import { hideLoader } from "./utils.js";

const chapterID = window.location.href.split('/', -1)[6];
const mangaID = window.location.href.split('/', -1)[4];
const chapterPage = document.querySelector("#chapter-page");
const leftMove = document.querySelector("#left-box");
const rightMove = document.querySelector("#right-box");
const moveBox = document.querySelector("#box-container");
const pageNumbers = document.querySelector("#page-number");

let chapters = [];
let loadedChapters = [];
let currentPage = 0;
let latestPage = 5;

async function loadChapters() {
    if (chapterID.trim() == '') {
        hideLoader();
        return false;
    }

    const chapterData = await getChapterByID(chapterID);
    console.log(chapterData);
    if (chapterData.error || chapterData.chapter.data.length == 0) {
        hideLoader();
        return false;
    }


    const baseURL = chapterData.baseUrl;
    const hash = chapterData.chapter['hash'];

    for (let x of chapterData.chapter.data) {
        const chapterLink = `${baseURL}/data/${hash}/${x}`;
        chapters.push(chapterLink);
    }

    return true;
}

async function createChapters() {
    if (await loadChapters()) {
        chapterPage.innerHTML = '';
        pageNumbers.textContent = `1 / ${chapters.length - 1}`;
        hideLoader();
    }
    else {
        moveBox.innerHTML = '';
        return;
    }

    let n = 5;
    if (chapters.length < n) {
        n = chapters.length;
    }

    for (let i = 0; i < n; i++) {
        createChapter(i);
    }

    updateMoveBox();
}

async function createChapter(index) {
    const img = document.createElement("img");
    if (index != currentPage) {
        img.style.display = 'none';
    }
    img.src = chapters[index];

    loadedChapters.push(img);
    chapterPage.appendChild(img);
}

function updateCurrentChapter() {
    loadedChapters[currentPage].style.display = 'block';
    pageNumbers.textContent = `${currentPage + 1} / ${chapters.length - 1}`;
    updateMoveBox();
    window.scrollTo(0, 0);
}

function updateMoveBox() {
    moveBox.style.height = '100%';
    leftMove.style.height = '100%';
    rightMove.style.height = '100%';
}

function nextPage() {
    if (chapters.length > currentPage + 2) {
        loadedChapters[currentPage].style.display = 'none';
        currentPage++;
        updateCurrentChapter();
    }

    if (chapters.length > loadedChapters.length) {
        latestPage++;
        createChapter(latestPage);
    }
}

function previousPage() {
    if (currentPage != 0) {
        loadedChapters[currentPage].style.display = 'none';
        currentPage--;
        updateCurrentChapter();
    }
}

leftMove.addEventListener("click", () => {
    if (currentPage == 0) {
        window.location.href = `/manga/${mangaID}`;
        return;
    }
    previousPage();
});

rightMove.addEventListener("click", () => {
    console.log(currentPage);
    console.log(chapters.length - 2);
    if (currentPage == chapters.length - 2) {
        window.location.href = `/manga/${mangaID}`;
        return;
    }
    nextPage();
});

document.addEventListener("keydown", (e) => {
    if (document.activeElement == document.querySelector("#nav-search")) {
        return;
    }
    if (e.key == 'a' || e.key == 'ArrowLeft') {
        previousPage();
    }
    else if (e.key == 'd' || e.key == 'ArrowRight') {
        nextPage();
    }
});

createChapters();