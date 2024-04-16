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

function getDataFromApiCategories() {
  return fetch("http://localhost:5678/api/categories")
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

// Suppimer l'image
function suppr(image) {
  const id = image.id;
  let token = localStorage.getItem("authToken");

  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`,
      cache: 'reload'
    }
  })
    .then((json) => {
      const deletedImage = document.querySelectorAll(`img[src="${image.imageUrl}"]`).forEach((a) => {
        if (a){        
        a.closest('figure').remove();
      }});
    })
    .catch((err) => console.log(err));
}

// Ensemble pour la modal
function modalPicture(data) {
  const pictureContainer = document.querySelector(".pictureContainer");
  pictureContainer.innerHTML = ""
  data.forEach((image) => {
        createImageElement(image, pictureContainer);
  });
    const uploadForm = document.getElementById("uploadForm");
    uploadForm.addEventListener("submit", handleImageUpload);
}

// Upload de l'image
function resetImageUploadForm() {
    const formPictureContainers = document.querySelectorAll('.formPicture');
    formPictureContainers.forEach(container => {
        container.style.display = "flex";
    });

    const imagePreviews = document.querySelectorAll('.formPicture.showOn');
    imagePreviews.forEach(preview => {
        preview.style.display = "none";
        preview.querySelector('img').src = ''; // Réinitialiser l'attribut src de l'image
    });

    // Réinitialiser le champ de sélection de fichier
    const fileInput = document.getElementById('image');
    fileInput.value = '';
}

// Envoie d'image
function handleImageUpload(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const authToken = localStorage.getItem("authToken");

    //en cas de problème
    if (!authToken) {
        console.error("Token d'autorisation manquant.");
        return;
    }
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Bon", data);
        // Réinitialiser le formulaire d'envoi d'image
        resetImageUploadForm();
        const pictureContainer = document.querySelector(".pictureContainer");
        createImageElement(data, pictureContainer);
        const galleryImport = document.querySelector(".gallery");
        createImageElement(data, galleryImport);
        // Recharger les images après l'envoi réussi
        // getDataFromApi()
        // .then((newData) => {
        //     showImagesByCategory("all", newData);
            
        //     modalPicture(newData);
        // });
    })
    .catch((error) => {
        console.error("Error uploading image:", error);
    });
}
// gérer le clic sur les boutons de filtre
function handleFilterButtonClick(event, data) {
  const categoryId = event.target.dataset.id;
  showImagesByCategory(categoryId, data);
}

// récupérer les données et initialiser les événements
function init() {
  getDataFromApiCategories().then((data)=>{
    
    data.forEach((item) => {
      const bouton = document.createElement('button');
      bouton.textContent = item.name;
      bouton.classList.add('projectButton');
      bouton.setAttribute('data-id', item.id);
      document.querySelector ('#filter').appendChild(bouton)
      })
    
  }
)
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

// Ouverture de la modal
const openmodal = function (e) { 
  document.querySelectorAll(".modal").forEach((a) => {
  a.style.display='none'  
  });//Le fermer au debut permet la transition des 2 modals
  e.preventDefault();
  e.stopPropagation();
  let target = document.querySelector(e.target.getAttribute("href"));
    if(e.target.getAttribute("href")==null){
      target = document.querySelector(e.target.parentElement.getAttribute("href"))
    }
    
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop")
       .addEventListener("click", stopPropagation);
};

// fermeture de la modal
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

// Pour le backdrop et éviter des erreurs
const stopPropagation = function (e) {
  e.stopPropagation();
};
document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openmodal);
});

// Gestion pour l'image de l'utilisateur
document.getElementById('image').addEventListener('change', function() {
  const reader = new FileReader();
  const input = this;

  if (input.files && input.files[0]) {
    console.log(input.files[0].name)
    const fileSize = input.files[0].size; // Taille en octets
    const maxSize = 4 * 1024 * 1024; // 4 Mo en octets

    if (fileSize > maxSize) {
      alert("La taille de l'image ne doit pas dépasser 4 Mo.");
      input.value = ''; // Effacer le fichier sélectionné
    } else {
      reader.onload = function(e) {
        document.querySelectorAll(".formPicture").forEach((item)=>{
          item.style.display="none";
          if(item.className=="formPicture showOn"){
            item.style.display="flex";
            item.firstElementChild.src = e.target.result;
          }
        });
      };

      reader.readAsDataURL(input.files[0]);
    }
  }
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
function logoutUser() {
  // Supprimer le jeton d'authentification du localStorage
  localStorage.removeItem('authToken');
  // Recharger la page pour appliquer les changements
  window.location.reload();
}

// Déconnexion
document.addEventListener("DOMContentLoaded", function() {
  const logoutButtons = document.querySelectorAll('.logoutButton');
  logoutButtons.forEach(button => {
      button.addEventListener('click', logoutUser);
  });
});

// Détecter si la page actuelle est la page d'index
if (window.location.pathname === '/index.html') {
  // Ajouter la classe index-footer au footer 
  document.querySelector('footer').classList.remove('index-footer');
} else {
  // Supprimer la classe index-footer du footer
  document.querySelector('footer').classList.add('index-footer');
}

// Récupérer les éléments du formulaire
const titreInput = document.getElementById('nom');
const imageInput = document.getElementById('image');
const validerButton = document.getElementById('submitPicture');

// Fonction pour vérifier les critères de validation
function verifierValidation() {
  if (titreInput.value !== '' && imageInput.value !== '') {
      validerButton.removeAttribute('disabled');
      validerButton.style.backgroundColor = 'rgba(29, 97, 84, 1)';
  } else {
      validerButton.setAttribute('disabled', 'true');
      validerButton.style.backgroundColor = 'gray';
  }
}

// Écouter les changements dans les champs du formulaire
titreInput.addEventListener('input', verifierValidation);
imageInput.addEventListener('change', verifierValidation);

// Appeler la fonction au chargement de la page
verifierValidation();

// chargement du script
init();
 // disabled pour la modal