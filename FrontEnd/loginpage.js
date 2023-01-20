const userConnected = localStorage.getItem("userConnected");
if (!!userConnected) {
  window.location.href = "/";
} //test booléen pour savoir s'il ya qqch dans cette valeur

const loginForm = document.forms[0];
const submitButton = loginForm.querySelector("input[type=submit]");

const failAuthentification = document.getElementById("authentification-failed");

submitButton.addEventListener("click", (evt) => {
  evt.preventDefault(); //empêche l'événement (sur lequel il y a le listerner) par défaut du bouton
  evt.stopPropagation();

  const user = {
    email: loginForm.elements.email.value,
    password: loginForm.elements.password.value,
  };

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user), //stringify = transforme un json en chaîne de caractères
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("échec d'authentification");
      }
      return res.json();
    })
    .then(function (res) {
      localStorage.setItem("userConnected", res.token); //met le token dans une boîte afin de le récupérer après, facile à retrouver

      window.location.href = "/"; //renvoit à la page d'accueil, le token apparaît maintenant dans la console de la page index, / renvoit à la racine
    })
    .catch((e) => (failAuthentification.style.display = "block")); //va faire apparaître le message d'erreur sous le formulaire
});
