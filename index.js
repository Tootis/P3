// récupérer la data depuis l'API
function getDataFromApi() {
  return fetch("http://localhost:5678/api/works")
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      return data;
    });
}

// filtrer et afficher les images en fonction de la catégorie
function showImagesByCategory(categoryId, data) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  data.forEach((image) => {
    if (categoryId === "all" || image.categoryId === parseInt(categoryId)) {
      const galleryImport = document.querySelector(".gallery");
      createImageElement(image, galleryImport);
    }
  });
}

// créer un élément d'image dans la galerie supprimer type et gallery en paramettre
function createImageElement(image,route) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = image.imageUrl;
  img.alt = image.title;
  if (route.className == "gallery") {
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = image.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    route.appendChild(figure);
  } else {
    figure.appendChild(img);
    figure.classList.add('picture');
    const supprButton = document.createElement("button");
    supprButton.setAttribute("type","button")
    supprButton.classList.add("fa-solid", "fa-trash-can","supprButton");
    supprButton.addEventListener("click", function (e) {
      e.preventDefault();
      suppr(image)
    });
    figure.appendChild(supprButton);
    route.appendChild(figure);
  }
}

function suppr (image) {
  const id = image.id;
      let token = localStorage.getItem("authToken");
      console.log(id)

      fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",// vérifier avec le jeton du local storage pour donner l'autorisation
        headers: { 'Authorization': `Bearer ${token}`,
        cache: 'reload'
    }})
        .then((response) => response.json()) // en direct et non par F5
        .then ((json)=>console.log(json))
        .catch((err) => console.log(err));
}

function modalPicture(data) {
  data.forEach((image) => {
    const pictureContainer = document.querySelector(".pictureContainer");
    createImageElement(image, pictureContainer);
  });
}
// gérer le clic sur les boutons de filtre
function handleFilterButtonClick(event, data) {
  const categoryId = event.target.dataset.id;
  showImagesByCategory(categoryId, data);
}

// récupérer les données et initialiser les événements
function init() {
  getDataFromApi().then((data) => {
    showImagesByCategory("all", data);
    modalPicture(data);

    const filterButtons = document.querySelectorAll(".projectButton");
    filterButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        handleFilterButtonClick(event, data);
      });
    });
  });
}

// modal
let modal = null;

const openmodal = function (e) {
  e.preventDefault();
  console.log(e)
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  modal = null;
};

const stopPropagation = function (e) {
  e.stopPropagation();
};
document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openmodal);
});

// Login
function changementLogin() {
  let token = localStorage.getItem("authToken");
  let hideElement = document.querySelectorAll(".hideWhenLog"); // Changer la déconnexion
  let displayElement = document.querySelectorAll(".displayWhenLog");
  if (token !== null) {
    hideElement.forEach((Element) => {
      Element.style.display = "none";
    });
    displayElement.forEach((Element) => {
      Element.style.display = "flex";
    });
  }
}
changementLogin();
// chargement du script
init();
