const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const restaurantClosed = document.getElementById("restaurant-closed")

let cart = [];

// Abrir Carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})


// Fechar Modal
closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})

cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal) {
        cartModal.style.display = "none"
    }
})


// ADD ITEM
menu.addEventListener("click", function(event) {
    // console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)

    }

})


//EMPTY CART
// checkoutBtn.addEventListener("click", function(event) {
//     if (cart.length === 0) {
//         Toastify({
//             text: `CARRINHO VAZIO!`,
//             duration: 3000,
//             gravity: "top",
//             position: "center",
//             backgroundColor: "#cc0000",
//             close: true,
//             style: {
//                 color: "#fff",
//                 fontSize: "16px",
//             },
//         })
//         .showToast();
//         event.preventDefault();
//     }
// });


// ADD TO CART
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if(existingItem) {
        existingItem.quantity += 1;
            
        
    }else{
    
        cart.push( {
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()

    Toastify({
        text: `${name} adicionado ao carrinho! Preço: R$${price.toFixed(2)}`,
        duration: 3000,
        gravity: "top",
        position: "left",
        backgroundColor: "#4CAF50",
        close: true,
        style: {
            color: "#fff",
            fontSize: "14px",
        },
    })
    .showToast();
}



//ATT CART
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;

        const cartItemsElement = document.createElement("div");
        cartItemsElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemsElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">· ${item.name}</p>
                    <p class="text-sm">Qtd: <spam class="font-bold">${item.quantity}</spam>. | Valor Un.: <span class="text-sm italic">R$ ${item.price.toFixed(2)}</span>.</p>
                    <p class="mt-1 mb-2">Valor Total: <spam class="font-bold">R$ ${itemTotal.toFixed(2)}</spam>.</p>
                </div>

           
                <button class="remove-from-cart-btn hover:font-bold text-red-500" data-name="${item.name}">
                    Remover
                </button>
            
            </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemsElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

}



//CART REMOVE
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        Toastify({
            text: `${name} removido do carrinho!`,
            duration: 2500,
            gravity: "top",
            position: "left",
            backgroundColor: "#D21404",
            close: true,
            style: {
                color: "#fff",
                fontSize: "14px",
            },
        })
        .showToast();

        removeItemCart(name);
    }


})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1) {
        const item = cart[index];
        
        if(item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}


//EMPTY ADDRESS ERROR
addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;

    if(inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")

        return;
    }
})



///
//CLOSED RESTAURANT
checkoutBtn.addEventListener("click", function(event) {

    const isOpen = checkRestaurantOpen();
    if(!isOpen) {

        Toastify({
            text: "Restaurante fechado!\n Horário de funcionamento:\nTer à Dom - 17:00 às 23:59",
            duration: 3500,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
            background: "#ef4444",
            },
        }).showToast();
        
        event.preventDefault();
        return;
}

if (cart.length === 0) {
    
    Toastify({
        text: "CARRINHO VAZIO!",
        duration: 2000,
        gravity: "top",
        position: "center",
        backgroundColor: "#cc0000",
        close: true,
        style: {
            color: "#fff",
            fontSize: "16px",
        },
    }).showToast();

    event.preventDefault();
}
   
//EMPTY ADDRESS RETURN
if(cart.length === 0) return;

if(addressInput.value === "") {
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
        
    addressInput = [];
        
}

//SEND WHATSAPP
const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
const cartItems = cart.map((item) => {
    const itemTotal = item.price * item.quantity;
    return ` · Qtd: *(${item.quantity}x)* ${item.name}. \nPreço: *R$${itemTotal.toFixed(2)}*.\n\n`;
}).join("");

const message = encodeURIComponent(
    `Olá, esse é o meu pedido:\n\n${cartItems}Endereço: _${addressInput.value}_ \n\nValor Total: *R$${total.toFixed(2)}*.`
);

const phone = "41997458063";

window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

cart = [];
updateCartModal();

});
///



//RESTAURANT OPENING HOURS
function checkRestaurantOpen() {
    const data = new Date();
    const hour = data.getHours();
    return hour >= 17 && hour < 24;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
    restaurantClosed.classList.add("hidden")
}
else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
    restaurantClosed.classList.remove("hidden")
}
