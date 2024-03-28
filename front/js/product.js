// je recupere dans des variable le suivi avec la page précédente je recupere l'id de l'artcile et je l'ajoute a l'adresse de l'api
var str = window.location.href;
var url = new URL(str);
var idProduct = url.searchParams.get("id");
let apiProduct = ("http://localhost:3000/api/products/" + idProduct)

// fonction pour contacter l'api
async function getProduct(){
    var productRecup = await fetch(apiProduct)
   
    return await productRecup.json();   
    
}

// fonction qui va recuperer le resultat de l'api et afficher un seul article complet 
async function getProductCard (){
    let data = await getProduct()
    
    
    //je vais chercher les element dans le dom et je leur integre les resultat correspondant 
    document.getElementById('title').textContent = data.name
    document.getElementById('price').textContent = data.price

    //creation de l'element img que j'attache a la classe item__img puis je lui passe les donné correspondante 
    let img = document.createElement("img");
    document.querySelector(".item__img").appendChild(img);
    img.src = data.imageUrl;
    img.alt = data.altTxt;



    // je recupere l'element colors dans le dom et je creer un boucle foreach pour pour parcourir les couleur disponible dans l'api pour ensuite les integrer au dom 
    let colorOptions = document.getElementById("colors");
    data.colors.forEach(color => {
        colorOptions.innerHTML += `<option value="${color}">${color}</option>`;
    });

    //recuperation du boutton "ajouter au panier", ecoute du bouton pour declencher la fonction  
    let cartButton = document.getElementById('addToCart')
    cartButton.addEventListener('click',function(event){
    // je recupere dans le dom la quantité et la couleur et j'y integre la quantité et la couleur que le client auras choisi
    let quantity = document.getElementById('quantity')
    let qtyValue = quantity.value
    let color = document.getElementById('colors')
    let colorValue = color.value;

        // un objet pour recupé l'id, la couleur, la quantité, le nom, le prix, l'image et la description de l'image que le client auras choisis
        let product = {
            id: idProduct,
            color: colorValue,
            quantity: qtyValue,

        }

        // instruction conditionnellequi va verifié que la couleur et la valeur on été choisi 
        if (qtyValue <= 0 || qtyValue > 100 || colorValue == "") {
            alert('Veuillez renseigner une quantité et une couleur')
        
        }else {
            //si la couleur et la quantité ont bien eté choisis la variable local auras comme parametre le local storage           
            let local = JSON.parse(localStorage.getItem("product")) || [];
            
            // je verifie si l'id avec la meme couleur n'es pas deja presente 
            const resultFind = local.find((el) => el.id === idProduct && el.color === colorValue);
            
            // si il n'y as pas de doublon je le push dans le local storage sous le nom product
            if(resultFind == null){
                local.push(product);
            }else{
                // sinon je l'incrémente au produit deja existant
                let newQuantite = parseInt(product.quantity) + parseInt(resultFind.quantity);
                resultFind.quantity = newQuantite;
            }
            //push et converstion en json dans le local storage
            localStorage.setItem("product", JSON.stringify(local));
            
            //Une aletre qui detail le canapé la coueleur la quantité choisis et la page nous r'envoie directement vers la page panier 
            event = alert("Votre canapé " + data.name + " de couleur " + colorValue +  " a été ajouté en " + qtyValue +" exemplaires à votre panier ")
            document.location.href="cart.html";
        }  
    })
}
getProductCard();