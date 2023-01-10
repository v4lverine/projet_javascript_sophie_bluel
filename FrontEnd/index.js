console.log("Hello world !");

fetch("http://localhost:5678/api/categories")
.then(function(res){
    if (res.ok) {
        return res.json
    }
})

.then(function(value){
    console.log()
})

.catch(function(err){
    console.log("J'ai eu une erreur !")
});
