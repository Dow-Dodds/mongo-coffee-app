console.log("hello");
const go = document.getElementById("add-coffee");

//declare all our inputs 
const priceInput = document.getElementById("price-input");
const nameInput = document.getElementById("name-input");
const imageURLInput = document.getElementById("image-input");

//setting up our coffee data 
// const longBlack = {
//     name: "Long Black",
//     price: 3.50,
//     image_url: "https://www.breville.com/content/dam/coffeehub/language-masters/en/recipes/recipe-hero-stills/Recipes_Banner12_1200x1200_LongBlack.jpeg"
// }

let showAllCoffee = () => {
    $.ajax({
        type: 'GET', 
        url: "http://localhost:3100/allCoffee",
        //your success function contains an object which can be names anything 
        success: (coffees) => {
            console.log(coffees)
            renderCoffees(coffees);
        },
        error: (error) => {
            console.log(error);
        }
    })
}

go.onclick = () => {
    console.log("clicked");
    $.ajax({
        url: `http://localhost:3100/addCoffee`,
        //use the post type to create data somewhere 
        type: 'POST',
        //we can send object to the backend using the data argument 
        data: {
            //the first property called name has to be spelt exactly the same as it has been in the Coffee Schema 
            name: nameInput.value,
            price: priceInput.value,
            image_url: imageURLInput.value
        },
        success: () => {
            console.log("A new coffee was added")
            showAllCoffee();
        },
        error: () => {
            console.log("No workey")
        }
    })
}

let deleteCoffee = (coffeeId) => {
    //use ajax and go to the delete route 
    console.log("is this ajax working???? ")
    $.ajax({
        //lets go to our route 
        url: `http://localhost:3100/deleteCoffee/${coffeeId}`,
        type: 'DELETE',
        success: () => {
           // console.log(data);
            console.log("Success - coffee was deleted")
            showAllCoffee();
        },
        error: () => {
            console.log("cannot call API");
        }
    })
}

//this function will handle all our deletes 
let collectDeleteButtons = () => {
    // this will return an Array, but it's a slightly different one
    // it returns HTML "nodes" instead
    // Well have to use a regular loop over these 
    let deleteButtonsArray = document.getElementsByClassName("delete-button");
    //this will loop over every delete button 
    for (let i = 0; i < deleteButtonsArray.length; i++) {
        deleteButtonsArray[i].onclick = () => {
            console.log(deleteButtonsArray[i].id);
            let currentId = deleteButtonsArray[i].id;
            //delet coffee based on the id 
            deleteCoffee(currentId);
            showAllCoffee();
        }
    }
}


// show all the coffees using the data from the backend

let renderCoffees = (coffees) => {
    console.log("The render coffee function us working")
     result.innerHTML = "";
    coffees.forEach((item) =>{
     
        result.innerHTML += `
        <div id="product-wrapper">
            <img src="${item.image_url}" alt "${item.name}">
            <h3>${item.name}</h3>
            <p>$${item.price}</p>
            
            <i id="${item._id}" class="fa-solid fa-trash-can delete-button"></i>
            <i id="${item._id}" class="fa-solid fa-pen-to-square" data-bs-toggle="modal" data-bs-target="#exampleModal"></i>

        </div>
        `
        collectDeleteButtons();
    })
    //all coffees should be rendered now and we can collect the delete buttons 
}

//=====================
//     START APP
//=====================
showAllCoffee();

//=========================
//      EDIT PRODUCT
//=========================
$('#updateProduct').click(function(){
    event.preventDefault();
    var productId = document.getElementById('productID').value;
    var productName = document.getElementById('productName').value;
    var productPrice = document.getElementById('productPrice').value;
    var imageurl = document.getElementById('imageUrl').value;
    
    console.log(productId, productName, productPrice, imageurl);


    $.ajax({
        url: `http://localhost:3100/updateProduct/${productId}`,
        type: 'PATCH',
        data: {
            name: productName,
            price: productPrice,
            image_url: imageurl,
        },
        success: (data) => {
            console.log(data);
            console.log("Success - coffee was updated")
            showAllCoffee();
        },
        error: () => {
            console.log("You are mistaken friend no update!");
        }
    })
});