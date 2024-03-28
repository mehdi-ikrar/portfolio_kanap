// je contact l'api 
async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    data = response
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}


async function generateArticles() {
  
  // je cree la const products pour recupérer le resultat de la fonction recuProduct
  const products = await fetchProducts();
  const items = document.querySelector('#items');
  console.log(products);

  // une boucle foreach pour parcourir les resultat de l'api qui sont dans product 
  products.forEach((product) => {
    const link = document.createElement('a');
    link.href = `product.html?id=${product._id}`;
    items.appendChild(link);

    //recuperation de l'arcticle dans le dom
    const article = document.createElement('article');
    link.appendChild(article);

    // je recupere l'image dans le dom je lui donne l'image et la description de l'image correspondante puis je l'atttache a article
    const image = document.createElement('img');
    image.src = product.imageUrl;
    image.alt = product.altTxt;
    article.appendChild(image);

    // je recupere le h3  dans le dom pour le nom et je lui mets nom correspondant puis je l'atttache a article
    const name = document.createElement('h3');
    name.textContent = product.name;
    name.classList.add('productName');
    article.appendChild(name);

    // je creer la decription je lui passe la description correspondante puis je l'atttache a article
    const description = document.createElement('p');
    description.textContent = product.description;
    description.classList.add('productDescription');
    article.appendChild(description);
  });
}

generateArticles();