const navSearch = document.querySelector("#nav-search");
const navSearchBtn = document.querySelector("#nav-search-btn");
const navLogo = document.querySelector("#nav-logo");
let lastScrollY = window.scrollY;

function clickSearch() {
    let searchTerm = navSearch.value.trim();
    if (searchTerm != ''){
        window.location.href = `/search?name=${encodeURIComponent(searchTerm)}&page=1`;
    }
}

navSearchBtn.addEventListener("click", clickSearch);
navSearch.addEventListener("keypress", (e)=> {
    if (e.key === 'Enter') {
        clickSearch();
    } 
});

navLogo.addEventListener("click", () => {
    window.location.href = '/';
});

window.addEventListener("scroll", () => {
    const header = document.getElementById("header");
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
        header.style.transform = "translateY(-100%)";
    } else {
        header.style.transform = "translateY(0)";
    }

    lastScrollY = currentScrollY;
});