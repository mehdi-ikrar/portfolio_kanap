// Récupération dans la variable produitLocalStorage de product
let produitLocalStorage = JSON.parse(localStorage.getItem("product"));
console.log(produitLocalStorage);
const productId = [];
let produit;
const canapArray = [];

// Fonction pour vérifier le local storage et implémenter les articles retournés
if (produitLocalStorage == null) {
    //message si le panier est vide
    panierVide = document.getElementById('cartAndFormContainer').children[0].innerHTML = 'Votre Panier est vide';
} else {
    // Fonction fetchApi qui recupere les donné de l'api en focntion de l'id se trouvant sur local storage
    async function fetchApi() {
      //recuperation du local storage
        const basketClassFull = JSON.parse(localStorage.getItem("product")) || [];
        
        //boucle for pour recuperer la couleur et la quantité
        for (let g = 0; g < basketClassFull.length; g++) {
            try {
                const response = await fetch(
                  //recuperation dans l'api avec l'id du local storage
                    "http://localhost:3000/api/products/" + basketClassFull[g].id
                );
                const canap = await response.json();
                //declaration d'un tableau pour recuperer la couleur et la quantité dans le local et le reste dans l'api en fonction de l'id ciblé
                const article = {
                    _id: canap._id,
                    name: canap.name,
                    price: canap.price,
                    color: basketClassFull[g].color,
                    quantity: basketClassFull[g].quantity,
                    alt: canap.altTxt,
                    img: canap.imageUrl,
                };
                //je push le tableau pour pouvoir le reutiliser 
                canapArray.push(article);
                console.log(canapArray);
            } catch (err) {
                console.log(err);
            }
        }

        return canapArray;
    }
    //declaration de la fonction pour afficher les articles 
    async function showBasket() {
        const responseFetch = await fetchApi(); // Appel de la fonction FETCH et attente de sa réponse
        //boucle pour afficher les produit en fonction du nombre d'artcile present 
        responseFetch.forEach((produit) => {
          console.log(produit);
          //creation de la base dans le dom 
          let productArticle = document.createElement("article");
          document.querySelector("#cart__items").appendChild(productArticle);
          productArticle.className = "cart__item";
          productArticle.setAttribute('data-id', produit.id);
          
          //creation de la div image
          let productDivImg = document.createElement("div");
          productArticle.appendChild(productDivImg);
          productDivImg.className = "cart__item__img";
          
          //Insertion de l'image
          let productImg = document.createElement("img");
          productDivImg.appendChild(productImg);
          productImg.src = produit.img;
          productImg.alt = produit.altTxt;
          
          // creation de la div cart item content
          let productItemContent = document.createElement("div");
          productArticle.appendChild(productItemContent);
          productItemContent.className = "cart__item__content";
          
          // creation de la div cart item content
          let productItemContentTitlePrice = document.createElement("div");
          productItemContent.appendChild(productItemContentTitlePrice);
          productItemContentTitlePrice.className = "cart__item__content__titlePrice";
          
          // Insertion du nom
          let productTitle = document.createElement("h2");
          productItemContentTitlePrice.appendChild(productTitle);
          productTitle.innerHTML = produit.name;
          
          // Insertion de la couleur
          let productColor = document.createElement("p");
          productItemContentTitlePrice.appendChild(productColor);
          productColor.textContent =  produit.color;

          
          // insertion du prix
          let productPrice = document.createElement("p");
          productItemContentTitlePrice.appendChild(productPrice);
          productPrice.innerHTML = produit.price + " €";
          
          
          // creation de la div cart__item__content__settings 
          let productItemContentSettings = document.createElement("div");
          productItemContent.appendChild(productItemContentSettings);
          productItemContentSettings.className = "cart__item__content__settings";
          
          // creation de la div cart__item__content__settings_quantity
          let productItemContentSettingsQuantity = document.createElement("div");
          productItemContentSettings.appendChild(productItemContentSettingsQuantity);
          productItemContentSettingsQuantity.className = "cart__item__content__settings__quantity";
          
          // Insertion de la quantité
          let productQte = document.createElement("p");
          productItemContentSettingsQuantity.appendChild(productQte);
          productQte.innerHTML = "Qté : ";

          // recuperation de la quantité 
          let productQuantity = document.createElement("input");
          productItemContentSettingsQuantity.appendChild(productQuantity);
          productQuantity.value = produit.quantity;
          productQuantity.className = "itemQuantity";
          productQuantity.setAttribute("type", "number");
          productQuantity.setAttribute("min", "1");
          productQuantity.setAttribute("max", "100");
          productQuantity.setAttribute("name", "itemQuantity");

          modifyQtt();

          

          // creation de la div cart__item__content__settings_delete
          let productItemContentSettingsDelete = document.createElement("div");
          productItemContentSettings.appendChild(productItemContentSettingsDelete);
          productItemContentSettingsDelete.className = "cart__item__content__settings__delete";

          // je recupere et je change le bouton en supprimer
          let productSupprimer = document.createElement("p");
          productItemContentSettingsDelete.appendChild(productSupprimer);
          productSupprimer.className = "deleteItem";
          productSupprimer.innerHTML = "Supprimer";
          

          


        });
        deleteProduct();
        

    let total = 0; // Déclaration et initialisation du total à l'extérieur de la boucle

    responseFetch.forEach((produit) => {

        total += produit.price * produit.quantity;
    });
    document.getElementById('totalPrice').innerHTML = total;

    console.log(total); // Affichage du total

    // Afficher ou mettre à jour le total dans votre interface utilisateur
}

showBasket();
    
}



// fonction pour supprimer un produit
function deleteProduct() {
    let btn_supprimer = document.querySelectorAll(".deleteItem");

    // Boucle pour recupérer le produit selectionné et le supprimé du local storage
    for (let i = 0; i < btn_supprimer.length; i++){
        btn_supprimer[i].addEventListener("click" , (event) => {
            event.preventDefault();

            let idDelete = produitLocalStorage[i].id;
            let colorDelete = produitLocalStorage[i].color;


            // fonction pour verifier si il y as bien un element correspondant id et couleur
            produitLocalStorage = produitLocalStorage.filter( el => el.id !== idDelete || el.color !== colorDelete );
            
            localStorage.setItem("product", JSON.stringify(produitLocalStorage));

            alert("Ce produit a bien été supprimé du panier");
            location.reload();

        })
    }
}





// fonction pour modifier la quantité d'un element 
function modifyQtt() {
  let qttModif = document.querySelectorAll(".itemQuantity");
  // Boucle pour recupérer le produit selectionné et moidifié un produit du local storage
  for (let k = 0; k < qttModif.length; k++){
      //utilisation l'ecoute avec change 
      qttModif[k].addEventListener("change" , (event) => {
          event.preventDefault();
          // recherche du produit correspondant
          let index = produitLocalStorage.findIndex((el) => el.id === produitLocalStorage[k].id && el.color === produitLocalStorage[k].color);
          
          produitLocalStorage[index].quantity = qttModif[k].valueAsNumber;
          //changement et rechargement du local storage 
          localStorage.setItem("product", JSON.stringify(produitLocalStorage))
          location.reload();
          
      })
  }
}


function postForm() {
  //Recupération du bouton commander "order" et ecoute du click
  const order = document.getElementById('order');
  order.addEventListener('click', (event) => {
    event.preventDefault();
    //annulation du comportement par défaut et creation d'un objet 
    const contact = {
      firstName: document.getElementById('firstName').value,//recuperation du prénom
      lastName: document.getElementById('lastName').value,//recuperation du nom
      address: document.getElementById('address').value,//recuperation de l'adresse
      city: document.getElementById('city').value,//recuperation de la ville 
      email: document.getElementById('email').value,//recuperation de l'email
    };
    console.log(contact);

  // contrôle du prénom
  function controlFirstName() {
    const validFirstName = contact.firstName;
    const firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
    firstNameErrorMsg.innerText = '';// code pour effacer un message apparu precedement
    if (/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{3,20}$/.test(validFirstName)) {
      return true;
    } else {
      // message d'erreur si la validation regex echoue
      firstNameErrorMsg.innerText = "Merci de vérifier le prénom, 3 caractères minimum";
      return false;
    }
  }

  // contrôle du nom
  function controlName() {
    const validName = contact.lastName;
    const lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
    lastNameErrorMsg.innerText = '';// code pour effacer un message apparu precedement
    // structure if esle pour verifier le code avec un regex 
    if (/^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{3,20}$/.test(validName)) {
      return true;
    } else {
      // message d'erreur si la validation regex echoue
      lastNameErrorMsg.innerText = "Merci de vérifier le nom, 3 caractères minimum, avec des lettres uniquement";
      return false;
    }
  }

  // contrôle d l'adresse
  function controlAddress() {
    const validAddress = contact.address.toLowerCase();
    const addressErrorMsg = document.getElementById('addressErrorMsg');
    addressErrorMsg.innerText = ''; // code pour effacer un message apparu precedement
    // structure if esle pour verifier le code avec un regex 
    if (/^[a-zA-Z0-9\s,'-\/.#&À-ÖØ-öø-ÿ]*$/.test(validAddress)) {
      return true;
    } else {
      // message d'erreur si la validation regex echoue
      addressErrorMsg.innerText = "Merci de vérifier l'adresse, alphanumérique et sans caractères spéciaux";
      return false;
    }
  }

  // contrôle de la ville
  function controlCity() {
    const validCity = contact.city;
    const cityErrorMsg = document.getElementById('cityErrorMsg');
    cityErrorMsg.innerText = ''; // code pour effacer un message apparu precedement
    // structure if esle pour verifier le code avec un regex 
    if (/^[^0-9_!¡?÷?¿\/\\+=@#$%ˆ&*(){}|~<>;:[\]]{3,50}$/.test(validCity)) {
      return true;
    } else {
      // message d'erreur si la validation regex echoue
      cityErrorMsg.innerText = "Merci de vérifier le nom de la ville, 3 caractères minimum, avec des lettres uniquement";
      return false;
    }
  }

  // contrôle d l'email
  function controlEmail() {
    const validEmail = contact.email;
    const emailErrorMsg = document.getElementById('emailErrorMsg');
    emailErrorMsg.innerText = ''; // code pour effacer un message apparu precedement
    // structure if esle pour verifier le code avec un regex 
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validEmail)) {
      return true;
    } else {
      // message d'erreur si la validation regex echoue
      emailErrorMsg.innerText = "Erreur ! Email non valide";
      return false;
    }
  }
  let products = []
  let produitLocalStorage = JSON.parse(localStorage.getItem("product"));
  // initiation d'une fonction qui lance les fonction de verification du formulaire et son code regex
  function validControl() {
    if (controlFirstName() && controlName() && controlAddress() && controlCity() && controlEmail()) {
      sendToServer(contact); // Passer les données de contact à la fonction sendToServer

      alert('Votre commande est validée !');
      function sendToServer(contact) {



        if (produitLocalStorage) {
          let products = produitLocalStorage.map((produit) => produit.id);
          console.log(products);
        }

        const orderData = { contact, products};

        
        const orderId = fetch("http://localhost:3000/api/products/order", {
          method: "POST",
          body: JSON.stringify(orderData),
          headers: {
            "Content-type": "application/json",
          },
        });
        orderId.then(async function (response) {
          // réponse de l'API //
          const retour = await response.json();
          //renvoi vers la page de confirmation avec l'ID de commande 
          window.location.href = `confirmation.html?orderId=${retour.orderId}`;
        }) 
          
    
      }
      

      // apres validation de l'alerte redirection vers la page de confirmation
      
      
      return true;
    } else {
      //message d'alerte si le formulaire est mauvais
      alert('Merci de revérifier les données du formulaire');
      return false;
    }
  }
  validControl();
  }) 
} 
postForm();
