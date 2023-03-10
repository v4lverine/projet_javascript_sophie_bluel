function trashIconDelete (iconDelete) {  //fonction pour permettre d'effacer les images via les icônes
  fetch("http://localhost:5678/api/works/" + iconDelete.dataset.delete, //va effacer de l'API
  {
      method: "DELETE",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userConnected,
      },
  })
  .then((res) => {
    if (res.ok == false) {
      throw new Error("échec de suppression");
    }
  })
  .then(function(){
    const emptyDOM = document.querySelectorAll("figure[data-id='" + iconDelete.dataset.delete + "']");
    emptyDOM.forEach((figure) => {
      figure.remove();
    })
  })
  .catch(function (err) {
    console.log("J'ai eu une erreur !");
  })
}

function addFigures(photos, modalAdds) { //fonction pour ajouter les images
  const newFigure = document.createElement("figure"); //créé les figures dans le DOM
  newFigure.setAttribute("data-category", photos.categoryId);
  newFigure.setAttribute("data-id", photos.id);

  const imageFigure = document.createElement("img");
  imageFigure.src = photos.imageUrl;
  imageFigure.alt = photos.title;
  imageFigure.crossOrigin = "anonymous"; //afin de voir les images sur le site 

  const captionFigure = document.createElement("figcaption"); //création dans HTML

  const iconDelete = document.createElement("img");
  iconDelete.src = "assets/icons/trash-icon.png";
  iconDelete.className = "trashbin-icon";
  iconDelete.setAttribute("data-delete", photos.id);
  iconDelete.addEventListener("click", (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    trashIconDelete(iconDelete)
  });

  if (modalAdds == true){
    captionFigure.innerText = "éditer";
    newFigure.className = "pictures-adjustments";
    newFigure.appendChild(iconDelete);
  } else { captionFigure.innerText = photos.title; }

  newFigure.appendChild(imageFigure); //ajout d'un élément à newFigure
  newFigure.appendChild(captionFigure);

  return newFigure; //sans ça, la fonction ne renvoit rien
}

let websitePictures = document.getElementById("photographs");
const modalPictures = document.getElementById("photographs-modal"); //pour ajouter les photos à la modale

fetch("http://localhost:5678/api/works") //appelle aux travaux présents dans l'API
  .then(function (res) {
    if (res.ok) {
      return res.json(); //récupère le json ici
    }
  })
  .then(function (listPictures) {
    websitePictures.innerHTML = ""; //vide le div avec les figures

    let websiteCategories = document.getElementById("categories");

    const setCategories = new Set(); //permet d'enlever les doublons d'une liste
    setCategories.add(JSON.stringify({id: 0, name: "Tous"})); //ajoute la catégorie de tags "Tous" au DOM

    for (let photos of listPictures) {
      websitePictures.appendChild(addFigures(photos, false));
      setCategories.add(JSON.stringify({id: photos.categoryId, name: photos.category.name}));
      modalPictures.appendChild(addFigures(photos, true));
    }

    for (let category of setCategories) {
      const newCategory = document.createElement("li");
      const newTag = document.createElement("a");
      newTag.innerText = JSON.parse(category).name;

      newCategory.appendChild(newTag);

      websiteCategories.appendChild(newCategory);

      newCategory.addEventListener("click", () => {
        document
          .querySelectorAll("figure[data-category]")
          .forEach((figure) => {
            const hasNotCategory = !figure.dataset.category.includes(JSON.parse(category).id);
            figure.className = "";

            if (JSON.parse(category).name !== "Tous" && hasNotCategory) {
              figure.className = "hide";
            }
          });
      });
    }
  })
  .catch(function (err) {
    console.log("J'ai eu une erreur !");
  });

const logInHidden = document.getElementsByClassName("linklogin");
const userConnected = localStorage.getItem("userConnected");
const modalOptions = document.getElementById("modal-userconnected"); //pour faire apparaître le menu de gestion de la modale
const modificationsInPage = document.getElementsByClassName("add-modifications");

if (userConnected !== null) {
  logInHidden[0].innerText = "logout";
  modalOptions.style.display = "flex"; //l'option de la modale apparaît seulement quand l'utilisateur est connecté
  for (modifs of modificationsInPage){   //pour que les boutons "modifier" n'apparaissent qu'une fois connecté
    modifs.style.display = "flex";
  }
}

logInHidden[0].addEventListener("click", () => {
  localStorage.removeItem("userConnected");
});

//gestion de la modale

let modal = null;

const openModal = function (e) { //déclaration de fonction pour ouvrir la modale
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  modal.addEventListener("click", closeModal);
  modal.querySelector(".close-modal").addEventListener("click", closeModal);
  modal.querySelector(".close-modal2").addEventListener("click", closeModal);
  modal.querySelector(".modal-stop").addEventListener("click", stopPropagation);
  modal.querySelector(".modal-add").addEventListener("click", stopPropagation);
};

const closeModal = function (e) { //fonction pour fermer la modale
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".close-modal").removeEventListener("click", closeModal);
  modal.querySelector(".close-modal2").removeEventListener("click", closeModal);
  modal.querySelector(".modal-stop").removeEventListener("click", stopPropagation);
  modal.querySelector(".modal-add").removeEventListener("click", stopPropagation);
  modal = null;
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

const linkToModal = document.getElementById("changings"); //lien qui mène à la modale
linkToModal.addEventListener("click", openModal);

window.addEventListener("keydown", function (e) { //permettra de fermer la modale avec la touche "Échap"
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e)
  }
});

const buttonToSecondModal = document.getElementById("add-pictures");
const firstModal = document.getElementById("modal-list-pics"); //première page modale dans DOM
const secondModal = document.getElementById("modal-add-pics"); //deuxième page modale dans DOM
const buttonBackModal = document.getElementsByClassName("back-modal")[0];

buttonToSecondModal.addEventListener("click", () =>{
  firstModal.style.display = "none";
  secondModal.style.display = "flex";
});


buttonBackModal.addEventListener("click", () => {
  firstModal.style.display = "flex";
  secondModal.style.display = "none";
});

let imageUploadTool = document.getElementById("file-input");
let imageUploaded = document.getElementById("image-uploaded");
let hideBlockUpload = document.getElementsByClassName("hide-modal");

imageUploadTool.onchange = evt => { 
  const [file] = imageUploadTool.files
  if (file) {
    imageUploaded.src = URL.createObjectURL(file);
    imageUploaded.style.display = "flex";
    for (elements of hideBlockUpload){
      elements.style.display = "none";
    }
  }
}

//récupération de forms pour la deuxième page modale d'ajout d'images
modalAddForm = document.forms[0];
const buttonUploadImg = document.getElementById("button-form-add");

buttonUploadImg.addEventListener("click", (evt) => { //au clic, ajout d'images au backend
  evt.preventDefault();
  evt.stopPropagation();
  let formDataModalAdd = new FormData();
  formDataModalAdd.append("image", imageUploadTool.files[0]);
  formDataModalAdd.append("title", modalAddForm.elements.title.value);
  formDataModalAdd.append("category", modalAddForm.elements.category.value);

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: formDataModalAdd,
    headers: {
    'Authorization': 'Bearer ' + userConnected,
    }}
  )
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
  })
  .then((res) => {
    alert("L'image est bien chargée")
    modalAddForm.elements.title.value = ""; //recharge le bloc d'upload d'images de la modale quand l'image a été envoyée
    modalAddForm.elements.category.value = "";
    imageUploaded.style.display = "none";
    for (elements of hideBlockUpload){
      elements.style.display = "";
    }
    websitePictures.appendChild(addFigures(res, false));
    modalPictures.appendChild(addFigures(res, true));
  })
  .catch((e) => {
    console.log("Erreur")
  })
})

modalAddForm.addEventListener("change", () => { //bouton "Valider" passe au vert quand tout est bien rempli
  if (imageUploadTool.files[0] != null && modalAddForm.elements.title.value != "" && modalAddForm.elements.category.value != "0"){
    buttonUploadImg.style.backgroundColor = "#1d6154";
    buttonUploadImg.disabled = false;
  } else {
    buttonUploadImg.disabled = true;
  }
})

