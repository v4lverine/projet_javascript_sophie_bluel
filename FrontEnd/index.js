function trashIconDelete (iconDelete) {  //fonction pour permettre d'effacer les images via les icônes
  // fetch("http://localhost:5678/api/works/" + iconDelete.dataset.delete, //va effacer de l'API
  // {
  //     method: "DELETE",
  //     headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': 'Bearer ' + userConnected,
  //     },
  //     body: null
  // })
  // .then((res) => {
  //   if (res.ok == false) {
  //     throw new Error("échec de suppression"); //ça recharge la page entière, ce qui ne devrait pas être le cas
  //   }
  // })
  // .then(function(){
  //   const emptyDOM = document.querySelectorAll("figure[data-id='" + iconDelete.dataset.delete + "']");
  //   emptyDOM.forEach((figure) => {
  //     figure.remove();
  //   })
  // })
  // .catch(function (err) {
  //   console.log("J'ai eu une erreur !");
  // })
  const emptyDOM = document.querySelectorAll("figure[data-id='" + iconDelete.dataset.delete + "']");
  emptyDOM.forEach((figure) => {
    figure.remove();
  })
}

function addFigures(photos, modalAdds) {
  //Définition et déclaration de la fonction addFigures, une fonction permet de condenser du code
  const newFigure = document.createElement("figure"); //affectera le DOM
  newFigure.setAttribute("data-category", photos.category.name);
  newFigure.setAttribute("data-id", photos.id);

  const imageFigure = document.createElement("img");
  imageFigure.src = photos.imageUrl; //enlever les crochets voir ligne 44
  imageFigure.alt = photos.title;
  imageFigure.crossOrigin = "anonymous"; //afin de voir les images car l'origin n'était pas la même source

  const captionFigure = document.createElement("figcaption"); //création de HTML qui va impacter sur le CSS existant

  const iconDelete = document.createElement("img");
  iconDelete.src = "assets/icons/trash-icon.png";
  iconDelete.className = "trashbin-icon";
  iconDelete.setAttribute("data-delete", photos.id);
  iconDelete.addEventListener("click", () => trashIconDelete(iconDelete));

  if (modalAdds == true){
    captionFigure.innerText = "éditer";
    newFigure.className = "pictures-adjustments";
    newFigure.appendChild(iconDelete);
  } else { captionFigure.innerText = photos.title; }

  newFigure.appendChild(imageFigure); //appendChild ajoute l'élément à newFigure, met à la suite l'élément
  newFigure.appendChild(captionFigure);

  return newFigure; //la fonction donne une valeur en réponse, sans ça, la fonction ne renvoit rien
}

// console.log(localStorage.getItem("userConnected"));
fetch("http://localhost:5678/api/works") //fetch = appel à une fonction, ce fetch appelle aux travaux dans l'API, utilisation d'une fonction
  .then(function (res) {
    if (res.ok) {
      return res.json(); //récupère le json ici
    }
  })
  .then(function (listPictures) {
    //va traiter les données
    let websitePictures = document.getElementById("photographs");
    websitePictures.innerHTML = ""; //vide le div avec les figures

    let websiteCategories = document.getElementById("categories");

    const setCategories = new Set(); //set pour les catégories (tags) = un set permet d'enlever les doublons d'une liste
    setCategories.add("Tous"); //ajoute la catégorie de tags "Tous" à mon DOM

    const modalPictures = document.getElementById("photographs-modal"); //pour ajouter les photos à la modale

    for (let photos of listPictures) {
      //va parcourir listPictures et va le mettre dans photos et exécutera les lignes mises dans la boucle

      websitePictures.appendChild(addFigures(photos, false)); //appel à la fonction qui comprend tout ce qui est dans la définition de la fonction, va exécuter ce qu'il y a dedans
      setCategories.add(photos.category.name); //permet de faire un tri des doublons (je crois), on retrouvera que les catégories uniques
      modalPictures.appendChild(addFigures(photos, true));
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
const modificationsInPage = document.getElementsByClassName("add-modifications");

if (userConnected !== null) {
  // quand l'utilisateur est connecté
  logInHidden[0].innerText = "logout";
  modalOptions.style.display = "flex"; //l'option de la modale apparaît seulement quand l'utilisateur est connecté
  for (modifs of modificationsInPage){   // pour que les boutons "modifier" n'apparaissent qu'une fois connecté, use boucle for pour liste
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

window.addEventListener("keydown", function (e) { //permettra de fermer la modale avec la touche "Échap" (facultatif, mais pratique)
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

//récupération de forms pour la deuxième page modale d'ajout d'images
// document.getElementById("file-input").addEventListener("change", (e) {
// let formDataModalAdd = new FormData();
// const image = e.target.files[0];
// formDataModalAdd.append("image", 'imageUrl');
// formDataModalAdd.append("title", 'title');
// formDataModalAdd.append("category", 'categoryId');

// fetch("http://localhost:5678/api/works", {
//   method: "POST",
//   body: formDataModalAdd
//   }
//   headers: {
//    'Authorization': 'Bearer ' + userConnected,
//   })
//   .then((res) => {
//      if (res.ok) {
//        return res.json();
//     }
// )}
//   .then(() { 
// })
//   .catch((e) => ());
// });
// })

