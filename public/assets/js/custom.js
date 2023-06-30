function addToCart (productToBeAdded) {
    const productQuantity = document.getElementById("productQuantity").value
    localStorage.setItem("cart", JSON.stringify([productToBeAdded]))
    alert(productQuantity)
}