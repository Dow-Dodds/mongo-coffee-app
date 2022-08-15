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
//this function will handle all our deletes 
let collectDeleteButtons = () => {

    let deleteButtonsArray = document.getElementsByClassName("delete-button");
    console.log(deleteButtonsArray);
}


// show all the coffees using the data from the backend

let renderCoffees = (coffees) => {
    console.log("The render coffee function us working")
     result.innerHTML = "";
    coffees.forEach((item) =>{
     
        result.innerHTML += `
        <div id="${item._id}">
            <img src="${item.image_url}" alt "${item.name}">
            <h3>${item.name}</h3>
            <p>$${item.price}</p>
            <button class="delete-button">Delete</button>
        </div>
        `
        collectDeleteButtons();
    })
    //all coffees should be rendered now and we can collect the delete buttons 
}
showAllCoffee();

// $.ajax({
//     type: 'GET', 
//     url: "http://localhost:3100/allCoffee",
//     //your success function contains an object which can be names anything 
//     success: (coffees) => {
//         console.log(coffees)
//         renderCoffees(coffees);
//     },
//     error: (error) => {
//         console.log(error);
//     }
// })