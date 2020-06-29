// API

ConAPI = () =>{
	return new Promise((resolve) =>{
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if(this.readyState == XMLHttpRequest.DONE && this.status == 200) 
			{
				resolve(JSON.parse(this.responseText));
			}
		}
		request.open("GET", "http://localhost:3000/api/teddies");
		request.send();
	});
};



/* Mise en page */

	/*Cration fonction pour la mise en page des produits*/
	async function ToutLesProduits(){
		const produits = await ConAPI();

		//Création de la section accueillant la liste des produits
		var listProduct = document.createElement("section")
		//Création de la class de cette section
		listProduct.setAttribute("class", "list-product");
		//Ajout de la section dans le HTML
		var main = document.getElementById("main");
		main.appendChild(listProduct);

		//Pour chaque produit de l'API on créé l'encadré HTML du produit
		produits.forEach((produit) =>
		{ 
      	//création des balises html
      	var produitBlock = document.createElement("article");
      	var produitImage = document.createElement("img");
      	var produitNom = document.createElement("h2");
      	var produitPrix = document.createElement("p");
      	var produitLink = document.createElement("a");

      	//Ajout des attributs aux balises
      	produitBlock.setAttribute("class", "list-product_block");
      	produitImage.setAttribute("src", produit.imageUrl);
      	produitImage.setAttribute("alt", "image du produit"); 
      	produitLink.setAttribute("href", "product.html?id=" + produit._id);

     	//placement des nouvelle balise
     	listProduct.appendChild(produitBlock);
     	produitBlock.appendChild(produitImage);
     	produitBlock.appendChild(produitNom);
     	produitBlock.appendChild(produitPrix);
     	produitBlock.appendChild(produitLink);

      	//Contenu des balise
      	produitNom.textContent = produit.name;
      	produitPrix.textContent = produit.price + ' €';
      	produitLink.textContent = "Détail";
      });
	};