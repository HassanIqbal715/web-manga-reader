export function createItem(target, mangaName, mangaID, fileName) {
    const baseURL = 'https://uploads.mangadex.org/covers/';

    let a = document.createElement("a");
    let item = document.createElement("div");
    let img = document.createElement("img");
    let title = document.createElement("div");
    let shadow = document.createElement("div");

    item.classList.add("item");
    img.classList.add("item-cover");
    shadow.classList.add("item-shadow");
    title.classList.add("item-text");
    
    img.src = `${baseURL}/${mangaID}/${fileName}.256.jpg`
    title.textContent = mangaName;
    
    a.href = `/manga/${mangaID}`;
    item.addEventListener("mouseenter", ()=> {
        if (window.innerWidth <= 600) {
            return;
        }   
        shadow.style.boxShadow = '0px -96px 24px rgba(0, 0, 0, 1) inset';
        title.style.transform = "translate(0px, 2px)";
        item.style.transform = "scale(1.2, 1.2)";
        item.style.zIndex = "5";
    });

    item.addEventListener("mouseleave", ()=> {
        if (window.innerWidth <= 600) {
            return;
        }
        shadow.style.boxShadow = '0px 0px 0px rgba(0, 0, 0, 1) inset';
        title.style.transform = "translate(0px, 96px)";
        item.style.transform = "scale(1, 1)";
        item.style.zIndex = "1";
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth <= 600) {
            item.style.transform = "";
            item.style.zIndex = "";
            title.style.transform = "";
            shadow.style.boxShadow = "";
        }
    });
    
    item.appendChild(img);
    item.appendChild(shadow);
    item.appendChild(title);
    a.appendChild(item);
    target.appendChild(a);
}