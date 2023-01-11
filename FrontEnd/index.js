console.log("Hello world !");


function addFigures(photos){ //Définition de la fonction addFigures, une fonction permet de condenser du code
    const newFigure = document.createElement("figure");

    const imageFigure = document.createElement("img"); // problème de chargement des images à cause de SAMEORIGIN
    imageFigure.src = photos["imageUrl"];
    imageFigure.alt = photos["title"];
    console.log(imageFigure);

    const captionFigure = document.createElement("figcaption");
    captionFigure.innerText = photos["title"];

    newFigure.appendChild(imageFigure);//appendChild met à la suite l'élément
    newFigure.appendChild(captionFigure);

    return newFigure; //la fonction donne une valeur en réponse, sans ça, la fonction ne renvoit rien
}


fetch("http://localhost:5678/api/works") //fetch = appel à une fonction, ce fetch appelle aux travaux dans l'API
.then(function(res){
    if (res.ok) {
        return res.json();
    }
})

.then(function(listPictures){
    console.log(listPictures);
    let websitePictures = document.getElementById("photographs");
    websitePictures.innerHTML = ""; //vide le div avec les figures
    for (let photos of listPictures) {//va parcourir value et va le mettre dans photos et exécutera les lignes mis dans la boucle

        websitePictures.appendChild(addFigures(photos)); //appel à la fonction qui comprend tout ce qui est dans la définition de la fonction, va exécuter ce qu'il y a dedans
    } //pas sur le même serveur (5500 au lieu de 5678) à cause du truc SAMEORIGIN qui empêche d'afficher sur le même domaine.
})

.catch(function(err){
    console.log("J'ai eu une erreur !");
});




fetch("http://localhost:5678/api/categories") //ce fetch appelle aux catégories dans l'API
.then(function(res){
    if (res.ok) {
        return res.json();
    }
})

.then(function(value){
    console.log(value);
})

.catch(function(err){
    console.log("J'ai eu une erreur !");
});

