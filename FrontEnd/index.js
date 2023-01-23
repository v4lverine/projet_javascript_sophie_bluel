function addFigures(photos) {
  //Définition et déclaration de la fonction addFigures, une fonction permet de condenser du code
  const newFigure = document.createElement("figure"); //affectera le DOM
  newFigure.setAttribute("data-category", photos.category.name);
  console.log(newFigure);

  const imageFigure = document.createElement("img");
  imageFigure.src = photos.imageUrl; //enlever les crochets voir ligne 44
  imageFigure.alt = photos.title;
  imageFigure.crossOrigin = "anonymous"; //afin de voir les images car l'origin n'était pas la même source

  const captionFigure = document.createElement("figcaption"); //création de HTML qui va impacter sur le CSS existant
  captionFigure.innerText = photos.title;

  newFigure.appendChild(imageFigure); //appendChild ajoute l'élément à newFigure, met à la suite l'élément
  newFigure.appendChild(captionFigure);

  return newFigure; //la fonction donne une valeur en réponse, sans ça, la fonction ne renvoit rien
}

fetch("http://localhost:5678/api/works") //fetch = appel à une fonction, ce fetch appelle aux travaux dans l'API, utilisation d'une fonction
  .then(function (res) {
    if (res.ok) {
      return res.json(); //récupère le json ici
    }
  })
  .then(function (listPictures) {
    //va traiter les données
    console.log(listPictures);
    let websitePictures = document.getElementById("photographs");
    websitePictures.innerHTML = ""; //vide le div avec les figures

    let websiteCategories = document.getElementById("categories");

    const setCategories = new Set(); //set pour les catégories (tags) = un set permet d'enlever les doublons d'une liste
    setCategories.add("Tous"); //ajoute la catégorie de tags "Tous" à mon DOM

    for (let photos of listPictures) {
      //va parcourir listPictures et va le mettre dans photos et exécutera les lignes mises dans la boucle

      websitePictures.appendChild(addFigures(photos)); //appel à la fonction qui comprend tout ce qui est dans la définition de la fonction, va exécuter ce qu'il y a dedans
      setCategories.add(photos.category.name); //permet de faire un tri des doublons (je crois), on retrouvera que les catégories uniques
    }

    for (let category of setCategories) {
      //dans une boucle, on recrée toujours une variable car elle n'existe que dans celle-ci
      const newCategory = document.createElement("li");
      const newTag = document.createElement("a");
      newTag.innerText = category;

      newCategory.appendChild(newTag); //il faut maintenant ajouter le filtrage des données des id provenant de l'API

      websiteCategories.appendChild(newCategory);

      newCategory.addEventListener("click", () => {
        document
          .querySelectorAll("figure[data-category]") //quand on appelle un querySelector ou autre, parle toujours du DOM qui comprend les éléments HTML
          .forEach((figure) => {
            const hasNotCategory = !figure.dataset.category.includes(category); //qui ne vaut pas la valeur de category qui est un élément du set "setCategories"
            figure.className = "";

            if (category !== "Tous" && hasNotCategory) {
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

if (userConnected !== null) {
  // quand l'utilisateur est connecté
  logInHidden[0].innerText = "logout";
  modalOptions.style.display = "flex"; //l'option de la modale apparaît seulement quand l'utilisateur est connecté
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
  modal.querySelector(".modal-stop").addEventListener("click", stopPropagation)
};

const closeModal = function (e) { //fonction pour fermer la modale
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".close-modal").removeEventListener("click", closeModal);
  modal.querySelector(".modal-stop").removeEventListener("click", stopPropagation);
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
}) 
