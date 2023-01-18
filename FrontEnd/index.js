console.log("Hello world !");

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

    const setCategories = new Set(); //set pour les catégories (tags)      setCategories.add("Tous"); //ajoute la catégorie de tags "Tous" à mon DOM
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
            const hasNotCategory = !figure.dataset.category.includes(category);
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

// fetch("http://localhost:5678/api/categories") //ce fetch appelle aux catégories dans l'API
// .then(function(res){
//     if (res.ok) {
//         return res.json();
//     }
// })

// .then(function(tags){ // récupère le json ici
//     console.log(tags);

//     for (let tag of tags){ //va passer sur chaque élément de tags et va les mettre dans tag et va exécuter les lignes entre les accolades pour chacun

//     }

//     for (let category of setCategories){  //dans une boucle, on recrée toujours une variable car elle n'existe que dans celle-ci
//         const newCategory = document.createElement("li");

//         const newTag = document.createElement("a");
//         newTag.id = category["id"];
//         newTag.innerText = category["name"];

//         newCategory.appendChild(newTag);
//     }
// })

// .catch(function(err){
//     console.log("J'ai eu une erreur !");
// });
