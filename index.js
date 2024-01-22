// récupérer les données de l'API
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
      createImageElement(image);
    }
  });
}

// créer un élément d'image dans la galerie
function createImageElement(image) {
  const gallery = document.querySelector(".gallery");
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");

  img.src = image.imageUrl;
  img.alt = image.title;
  figcaption.textContent = image.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
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
    const filterButtons = document.querySelectorAll(".projectButton");
    filterButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        handleFilterButtonClick(event, data);
      });
    });
  });
}

// chargement du script
init();
