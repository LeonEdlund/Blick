let wList;

function init() {
    wList = document.querySelector("#wishlist-items");
    showWishList();
}
window.addEventListener("load", init);

// Jesper - Shows the wishlist
function showWishList() {
    wList.innerHTML = "";
    let wishlist = JSON.parse(localStorage.getItem("wishlist"));

    if(wishlist.length == 0) {
        wList.innerHTML = "<p>Du har inget sparat.</p>"
        return;
    }

    wishlist.forEach(item => {
        const itemElem = document.createElement("li");
        itemElem.innerHTML = `
        <a href="result.html?id=${item.id}">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
        </a>
        <button onclick='remove("${item.id}")'><img src="temporary-img/trash.svg" alt="trash"></button>`;
        wList.appendChild(itemElem);
    });
}

// Jesper - Seraches and removes element
function remove(itemId) {
    index = -1;
    let wishlist = JSON.parse(localStorage.getItem("wishlist"));

    for (let i = 0; i < wishlist.length; i++) {
        if (wishlist[i].id == itemId) {
            index = i;
            break;
        }
    }

    if (index !== -1) {
        wishlist.splice(index, 1);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        showWishList();
    } else {
        console.log("fel");
    }

}

