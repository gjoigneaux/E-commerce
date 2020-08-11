/**
 * Initialisation de l'id du produit
 */
let productId = "";

/**
 * Initialisation du panier
 */
if (localStorage.getItem("userPanier") == undefined) {
  let panierInit = [];
  localStorage.setItem("userPanier", JSON.stringify(panierInit));
}

/**
 * Initialisation de la variable userPanier
 */
let userPanier = JSON.parse(localStorage.getItem("userPanier"));

/**
 * API
 */
async function getProduits() {
  let req = await fetch(template.host + productId);
  const data = await req.json();
  return data;
}

/**
 * Page de tous les produit
 */
// eslint-disable-next-line no-unused-vars
async function allProducts() {
  const produits = await getProduits();
  produits.forEach(produit => {
    const main = document.querySelector("main");
    const article = document.createElement("article");
    const id = produit._id;
    article.innerHTML = template.tousLesProduits(produit);
    main.appendChild(article);
    document.getElementById(id).addEventListener("click", () => {
      localStorage.setItem("id", id);
    });
  });
}

/**
 * Page du produit sélectionné
 */
// eslint-disable-next-line no-unused-vars
async function zoomProduct() {
  /**
  * Recherche de l'ID du produit sélectionné
  */
  productId = localStorage.getItem("id");
  const zoomProduit = await getProduits();
  const main = document.querySelector("main");
  main.innerHTML = template.unProduit(zoomProduit);
  /**
  * Ajouter au panier lors du clique
  */
  document.querySelector("#addToPanier").addEventListener("click", async function() {
    addToPanier(zoomProduit);
  });
}

const addToPanier = (zoomProduit) => {
  const select = document.querySelector("select");
  const produits = {
    name: zoomProduit.name,
    id: zoomProduit._id,
    description: zoomProduit.description,
    prix: zoomProduit.price,
    color: select.options[select.selectedIndex].value,
    img: zoomProduit.imageUrl
  };
  userPanier.push(produits);
  localStorage.setItem("userPanier", JSON.stringify(userPanier));
  alert("Vous avez ajouté ce produit dans votre panier");
};

/**
 * Page panier
 */
// eslint-disable-next-line no-unused-vars
const panier = () => {
  /**
  * Initilisation des variable
  */
  let total = 0;
  let lignes = "";
  JSON.parse(localStorage.getItem("userPanier")).forEach((produit) => {
    /**
    * Création des colonne produit du panier
    */
    lignes += template.lignePanier(produit);
    /**
    * Calcul du prix total
    */
    total += produit.prix;
  });

  /**
  * Création de la page Panier.HTML
  */
  const main = document.querySelector("main");
  main.innerHTML = template.panier(lignes, total);

  /**
  * Fonction supprimer un produit
  * @param {number} i Correspond au forEach de document.querySelectorAll("i") ligne.116
  */
  const supprimerProduit = (i) => {
    userPanier.splice(i, 1);
    localStorage.clear();
    localStorage.setItem("userPanier", JSON.stringify(userPanier));
    window.location.reload();
  };

  const removeProduit = document.querySelectorAll("i");
  removeProduit.forEach((i) => {
    i.addEventListener("click", () => supprimerProduit(i));
  });
};

/**
 * Recuperation des ID des produits présent dans le panier
 */
const panierSubmit = localStorage.getItem("userPanier");
let produitIdSubmit = [];
let x = 0;
JSON.parse(localStorage.getItem("userPanier")).forEach(() => {
  let produitSubmit = JSON.parse(panierSubmit);
  produitIdSubmit.push(produitSubmit[x].id);
  x++;
});

/**
 * Envoi de la commande et confirmation
 */
// eslint-disable-next-line no-unused-vars
async function envoiFormulaire() {
  const domTarget = document.querySelector("main");    const firstNameValue = document.querySelector("#nom").value;
  const lastNameValue = document.querySelector("#prenom").value;
  const adressValue = document.querySelector("#adresse").value;
  const cityValue = document.querySelector("#ville").value;
  const emailValue = document.querySelector("#email").value;
  const checkEmail = /^[a-z\d_-]+(.[a-z\d-]+)*@[a-z\d-]+(\.[a-z\d]+)+$/;
  if (firstNameValue.length < 3) {
    alert("Veuillez saisir un nom correct");
  } else if (lastNameValue.length < 3) {
    alert("Veuillez saisir un prénom correct");
  } else if (adressValue.length < 5) {
    alert("Veuillez saisir une adresse correct");
  } else if (cityValue.length < 3) {
    alert("Veuillez saisir une ville correct");
  } else if (!checkEmail.test(emailValue)) {
    alert("Veuillez saisir un email correct");
  } else {
    const form = {
      contact: {
        firstName: firstNameValue,
        lastName: lastNameValue,
        address: adressValue,
        city: cityValue,
        email: emailValue
      },
      products: produitIdSubmit
    };
    if (produitIdSubmit.length == 0) {
      domTarget.innerHTML = template.aucunProduit;
    } else {
      domTarget.innerHTML = template.envoiEnCours;
      try {
        let response = await fetch(template.host + "order", {
          method: "post",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        });
        if (response.status < 300) {
          response = await response.json();
          domTarget.innerHTML = template.orderConfirm(response);
          localStorage.clear();
          return;
        }
        errorMsg("request status : " + response.status);
      } catch (e) { errorMsg(e); }
    }
  }
}

const errorMsg = (err) => {
  document.querySelector("main").innerHTML = template.problemeTech;
  console.error(err);
};



/**
 * VARIABLES VISUELS
 */

const template = {
  host: "http://localhost:3000/api/teddies/",
  tousLesProduits: function(produit) {
    return `
        <img src="${produit.imageUrl}" alt="Ours en peluche">
        <h2>${produit.name}</h2>
        <p>${produit.price} €</p>
        <a href="product.html?id=${produit._id}" id="${produit._id}">En savoir plus</a>
        `;
  },
  unProduit: function(zoomProduit) {
    const optionsColors = zoomProduit.colors.map((color) => `<option> ${color} </option>`);
    return `
        <article>
            <img src="${zoomProduit.imageUrl}" alt="Ours en peluche">
            <h2>${zoomProduit.name}</h2>
            <p>${zoomProduit.description}</p>
            <p>${zoomProduit.price} €</p>
            <select>${optionsColors}</select>
            <br>
            <button id="addToPanier">Ajouter au panier</button>
        </article>
        `;
  },
  lignePanier: function(produit) {
    return `
            <tr>
		        <td>${produit.name}</td>
		        <td>${produit.color}</td>
		        <td>${produit.prix} €</td>
		        <td><i class="fas fa-trash-alt" aria-hidden="true"></i></td>
	        </tr>
        `;
  },
  panier: function(lignes, total) {
    return `
        <table>
            <tr>
                <th>Nom du produit</th>
                <th>Couleur du produit</th>
                <th>Prix du produit</th>
            </tr>
            ${lignes}
            <tr>
                <th>Total à payer</th>
                <td></td>
                <td id="sommeTotal">${total} €</td>
	        </tr>
        </table>
        <form>
            <fieldset>
                <label for="nom">Votre nom</label>
                <input type="text" id="nom" required>
                <label for="prenom">Votre prénom</label>
                <input type="text" id="prenom" required>
                <label for="adresse">Votre adresse</label>
                <input type="text" id="adresse" required>
                <label for="ville">Votre ville</label>
                <input type="text" id="ville" required>
                <label for="email">Votre email</label>
                <input type="email" id="email" required>
                <button onclick="envoiFormulaire()">Envoyer</button>
            </fieldset>
        </form>
         `;
  },
  envoiEnCours: "<p id='confirmOrder'>Envoi en cours.<br><span id='merci'>Merci de bien vouloir patienter.</span></p>",
  aucunProduit: "<p id='confirmOrder'>Aucun produit dans le panier.<br><span id='merci'>Merci de bien vouloir ajouter un produit au panier.</span></p>",
  orderConfirm: function(response) {
    return `
        <p id="confirmOrder">La commande numéro 
        <br> 
        <span id=numOrder>${response.orderId}</span>
        <br> 
        a bien été prise en compte.<br><br> <span id="merci">Merci de votre fidélité.</span></p>
        `;
  },
  problemeTech: "<p id='confirmOrder'>Nous avons rencontré un problème technique.<br><span id='merci'>Merci de bien vouloir réessayer.</span></p>"
};