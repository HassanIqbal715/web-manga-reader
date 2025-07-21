import { getCoverByID, searchMangaByTitle } from "./queries.js";
import { createItem } from "./mangaItem.js";
import { getCoverFilenameByManga, hideLoader } from "./utils.js";

const grid = document.querySelector("#search-result");
const searchResultText = document.querySelector("#search-result-text");
const searchNavBarTop = document.querySelector("#search-nav-bar-top");
const searchNavBarBot = document.querySelector("#search-nav-bar-bottom");

let searchTerm = new URLSearchParams(window.location.search).get('name');
let currentPage = new URLSearchParams(window.location.search).get('page');
currentPage = parseInt(currentPage) - 1;
let mangaData;

async function createMangas() {
    if (!searchTerm || currentPage + 1 <= 0) {
        hideLoader();
        return;
    }

    mangaData = await searchMangaByTitle(searchTerm, currentPage);

    if (!mangaData.data || mangaData.data.length == 0) {
        hideLoader();
        return;
    }

    searchResultText.innerHTML = '';
    const total = mangaData.total;

    for (let x of mangaData.data) {
        const fileName = await getCoverFilenameByManga(x);
        createItem(grid, x.attributes.title['en'], x.id, fileName);
    }

    createPagesButtons(total);
    hideLoader();
}

function createPagesButtons(total) {
    let n = Math.ceil(total/30);
    if (currentPage + 1 > n || currentPage + 1 < 1) {
        return;
    }

    createPageButton(1);
    if (currentPage + 1 != 1 && currentPage + 1 != 2) {
        createEllipses();
        createPageButton(currentPage);
    }
    if (currentPage + 1 != 1 && currentPage + 1 != n) {
        createPageButton(currentPage + 1);
    }
    if (currentPage + 1 != n && currentPage + 1 != n - 1) {
        createPageButton(currentPage + 2);
        createEllipses();
    }
    if (n != 1)
        createPageButton(n);
}

function createPageButton(pageNumber) {
    let a = document.createElement("a");
    let btn = document.createElement("button");
    btn.textContent = pageNumber;
    btn.classList.add("search-nav-button");
    if (pageNumber - 1 == currentPage) {
        btn.setAttribute(
            "style", "background-color: rgba(255, 255, 255, 0.08);"
        );
    }
    a.href = `
        /search?name=${encodeURIComponent(searchTerm)}&page=${pageNumber}
    `;
    a.appendChild(btn);
    
    const clone = a.cloneNode(true);

    searchNavBarTop.appendChild(a);
    searchNavBarBot.appendChild(clone);
}

function createEllipses() {
    let box = document.createElement("div");
    box.textContent = '. . .';
    box.classList.add("search-nav-ellipses");
    box.classList.add("prevent-select");
    const clone = box.cloneNode(true);
    searchNavBarTop.appendChild(box);
    searchNavBarBot.appendChild(clone);
}

createMangas();