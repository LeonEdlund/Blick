import { chooseImg, changeExploreBtn } from "/js/utils.js"

let wList;

function init() {
    wList = document.querySelector("#wishlist-items");
    showWishList();
    changeExploreBtn();
}
window.addEventListener("load", init);

// Jesper - Shows the wishlist
function showWishList() {
    if (localStorage.getItem("wishlist")) {
        wList.innerHTML = "";
        let wishlist = JSON.parse(localStorage.getItem("wishlist"));

        if (wishlist.length == 0) {
            wList.innerHTML = "<p>Du har inget sparat.</p>"
            return;
        }

        wishlist.forEach(item => {
            const desImg = chooseImg(item.description);
            const itemElem = document.createElement("li");
            const link = document.createElement("a");
            link.href = `result.html?id=${item.id}`;
            link.innerHTML = `
                <img class="des-img" src="${desImg}" alt="kategori">
                <div>
                <h2>${item.name}</h2>
                <p>${item.description}</p>
                <p>Pris: ${item.price_range}kr</p>
                </div>`;

            const removeButton = document.createElement("button");
            const img = document.createElement("img");
            img.src = "/img/icons/trash.svg";
            img.alt = "trash";
            img.classList.add("trash-icon");
            removeButton.appendChild(img);

            removeButton.addEventListener("click", function () {
                remove(item.id);
            });

            itemElem.appendChild(link);
            itemElem.appendChild(removeButton);
            itemElem.addEventListener("click", () => sessionStorage.setItem("wishlistLinkClicked", true));
            wList.appendChild(itemElem);
        });

    } else {
        wList.innerHTML = "<p>Du har inget sparat.</p>"
    }
}

// Jesper - Seraches and removes element
function remove(itemId) {
    let index = -1;
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

