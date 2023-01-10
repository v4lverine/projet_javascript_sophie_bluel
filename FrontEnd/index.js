console.log("Hello world !");

fetch("http://localhost:5678/api/categories")
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


fetch("http://localhost:5678/api/works")
.then(function(res){
    if (res.ok) {
        return res.json();
    }
})

.then(function(value){
    console.log(value);
    let photosDuSite = document.getElementById("photographs");
    photosDuSite.innerHTML = "";
    for (let photos of value) {//va parcourir value et va le mettre dans photos et exécutera les lignes mis dans la boucle
        photosDuSite.innerHTML += "<figure><img src=\"" + photos["imageUrl"] + "\" alt=\"" + photos["title"] + "\" ><figcaption>" + photos["title"] + "</figcaption></figure>";
    }
})

.catch(function(err){
    console.log("J'ai eu une erreur !");
});