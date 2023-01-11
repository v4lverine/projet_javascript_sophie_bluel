console.log("Hello world !");


function addFigures(photos){ //Définition de la fonction addFigures, une fonction permet de condenser du code
    const newFigure = document.createElement("figure");

    const imageFigure = document.createElement("img");
    imageFigure.src = photos["imageUrl"];
    imageFigure.alt = photos["title"];
    imageFigure.crossOrigin = "anonymous"; //afin de voir les images car l'origin n'était pas la même source
    console.log(imageFigure);

    const captionFigure = document.createElement("figcaption"); //création de HTML qui va impacter sur le CSS existant
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
    }
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

.then(function(tags){
    console.log(tags);
})

.catch(function(err){
    console.log("J'ai eu une erreur !");
});

