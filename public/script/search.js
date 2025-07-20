import { getCoverByID, searchMangaByTitle } from "./queries.js";
import { createItem } from "./mangaItem.js";

const grid = document.querySelector("#search-result");
const searchNavBarTop = document.querySelector("#search-nav-bar-top");
const searchNavBarBot = document.querySelector("#search-nav-bar-bottom");

let searchTerm = new URLSearchParams(window.location.search).get('name');
let currentPage = new URLSearchParams(window.location.search).get('page');
currentPage = parseInt(currentPage) - 1;
let mangaData;

async function createMangas() {
    if (searchTerm) {
        if (currentPage + 1 <= 0) {
            document.querySelector("#loader").style.display = 'none';
            document.querySelector("#loader-text").style.display = 'none';
            document.body.style.overflow = 'auto';
            return; 
        }
        mangaData = await searchMangaByTitle(searchTerm, currentPage);
    }
    if (mangaData.data) {
        const total = mangaData.total;
        for (let x of mangaData.data) {
            const relations = x.relationships;
            const coverRel = relations.find(rel => rel.type === 'cover_art');
            const cover = await getCoverByID(coverRel['id']);
            const fileName = cover.data.attributes['fileName'];
            createItem(grid, x.attributes.title['en'], x.id, fileName);
        }
        createPagesButtons(total);
        document.querySelector("#loader").style.display = 'none';
        document.querySelector("#loader-text").style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function createPagesButtons(total) {
    let n = Math.ceil(total/24);
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

function clickSearchNavButton(pageNumber) {
    window.location.href = 
        `/search?name=${encodeURIComponent(searchTerm)}&page=${pageNumber}`;
}

function createPageButton(pageNumber) {
    let btn = document.createElement("button");
    btn.textContent = pageNumber;
    btn.classList.add("search-nav-button");
    if (pageNumber - 1 == currentPage) {
        btn.setAttribute("style", "background-color: rgba(255, 255, 255, 0.08);");
    }
    const clone = btn.cloneNode(true);
    btn.addEventListener("click", () => {
        clickSearchNavButton(pageNumber);
    });

    clone.addEventListener("click", () => {
        clickSearchNavButton(pageNumber);
    });

    searchNavBarTop.appendChild(btn);
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