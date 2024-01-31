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
      createImageElement(image,galleryImport);
    }
  });
}

// créer un élément d'image dans la galerie
function createImageElement(image, route) {
  console.log(route)
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");

  img.src = image.imageUrl;
  img.alt = image.title;
  figcaption.textContent = image.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  route.appendChild(figure);
}
function test (data) {
  data.forEach((image) => {
    const pictureContainer = document.querySelector(".pictureContainer")
    createImageElement(image,pictureContainer)

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
    console.log(data)
    showImagesByCategory("all", data);
    test(data)
    
    const filterButtons = document.querySelectorAll(".projectButton");
    filterButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        handleFilterButtonClick(event, data);
      });
    });
  });
}

// modal
let modal = null

const openmodal = function (e) {
  e.preventDefault()
  const target= document.querySelector(e.target.getAttribute('href'))
  target.style.display = null
  target.removeAttribute('aria-hidden')
  target.setAttribute('aria-modal', 'true')
  modal = target
  modal.addEventListener('click' , closeModal)
  modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

const closeModal = function (e) {
  if (modal === null) return
  e.preventDefault()
  modal.style.display = 'none'
  modal.setAttribute('aria-hidden', 'true')
  modal.removeAttribute('aria-modal') 
  modal.removeEventListener('click' , closeModal)
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
  modal = null
}

const stopPropagation = function (e) {
  e.stopPropagation()
}
document.querySelectorAll ('.js-modal').forEach(a =>{
a.addEventListener('click',openmodal)
})



// Login
function changementLogin ( ) {
  let token =localStorage.getItem('authToken')
  let hideElement = document.querySelectorAll ('.hideWhenLog')  // Changer la déconnexion
  let displayElement = document.querySelectorAll('.displayWhenLog')
    if (token !== null) {
      hideElement.forEach(Element=> {
      Element.style.display = 'none';
    })
      displayElement.forEach(Element=> {
        Element.style.display = 'flex'
      })
  }
}
changementLogin() 
// chargement du script
init();