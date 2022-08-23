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

fillEditInputs = (coffee, id) => {
    let productName = document.getElementById('productName');
    let productPrice = document.getElementById('productPrice');
    let imageurl = document.getElementById('imageUrl');
    let imagePreview = document.getElementById('image-preview');

    productName.value = coffee.name;
    productPrice.value = coffee.price;
    imageurl.value = coffee.image_url;
    imagePreview.innerHTML = `
    <img src="${coffee.image_url}" alt="${productName}">
    `;
    //console.log('the id is ${id}');
    //=================================
    //      EDIT CLICK LISTENER
    //=================================
    $('#updateProduct').click(function(){
        event.preventDefault();
        let productId = id;
        let productName = document.getElementById('productName').value;
        let productPrice = document.getElementById('productPrice').value;
        let imageurl = document.getElementById('imageUrl').value;
        
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
                $("#updateProduct").off('click');
                
            },
            error: () => {
                console.log("You are mistaken friend no update!");
            }
        })
    });


}

//this function will ask the backend for data relating to the coffee we clicked on to edit 
populateEditModal = (coffeeID) => {
    console.log(coffeeID)
    $.ajax({
        url: `http://localhost:3100/coffee/${coffeeID}`,
        type: 'GET',
        success: (coffeeData) => {
           // console.log("coffee was found!")
           console.log(coffeeData);
           fillEditInputs(coffeeData, coffeeID);

        },
        error: () => {
            console.log(error)
        }
    })
};

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
            let currentId = deleteButtonsArray[i].parentNode.id;
            //delet coffee based on the id 
            deleteCoffee(currentId);
            showAllCoffee();
        };
    }
};


//this function will handle all our edits and add a click listener 
//if we click on an edit button it will get the id from the parent node (the div around it)
let collectEditButtons = () => {
    // this will return an Array, but it's a slightly different one
    // it returns HTML "nodes" instead
    // Well have to use a regular loop over these 
    let editButtonsArray = document.getElementsByClassName("edit-button");
    //this will loop over every edit button 
    for (let i = 0; i < editButtonsArray.length; i++) {
        editButtonsArray[i].onclick = () => {
            console.log(editButtonsArray[i].id);
            let currentId = editButtonsArray[i].parentNode.id;
            //edit coffee based on the id 
            populateEditModal(currentId);
           // showAllCoffee();
        };
    }
};

// show all the coffees using the data from the backend

let renderCoffees = (coffees) => {
    console.log("The render coffee function us working")
     result.innerHTML = "";
    coffees.forEach((item) => {
        if (sessionStorage.userID) {
        result.innerHTML += `
        <div class="product-wrapper" id="${item._id}" >
            <img src="${item.image_url}" alt "${item.name}">
            <h3>${item.name}</h3>
            <p>$${item.price}</p>
            
            <i class="fa-solid fa-trash-can delete-button"></i>
            <i class="fa-solid fa-pen-to-square edit-button" data-bs-toggle="modal" data-bs-target="#editModal"></i>
            
            <h4>Reviews</h4>
            <ul class="reiew-box"></ul>
            <button class="btn btn-light" data-bs-toggle="modal" data-bs-target="#reviewModal">New Review</button>
            
        </div>
        `;
        //if the user isnt logged in
        } else {
            result.innerHTML += `
            <div class="product-wrapper" id="${item._id}" >
                <img src="${item.image_url}" alt "${item.name}">
                <h3>${item.name}</h3>
                <p>$${item.price}</p>

                <h4>Reviews</h4>
                <ul class="reiew-box"></ul>
            </div>
            `;
        }  
    });
    //all coffees should be rendered now and we can collect the delete buttons 
    collectDeleteButtons();
    //collect edit buttons 
    collectEditButtons();
};

//=====================
//     START APP
//=====================
showAllCoffee();



//=========================
//     LOGIN FUNCTION 
//=========================
// this function checks if the users logged in
// if they are, show the username and their profile image

let checkLogin = () => {
    let navContent;
    const userDetails = document.getElementById("user-details");
    if (sessionStorage.userID) {
        // console.log("youre logged in")
        // console.log(sessionStorage.userName)
        navContent = `
        <span id="username">${sessionStorage.userName}</span>
        <span id="dp" style="background-image: url('${sessionStorage.profileImg}')"></span>
        <a id="sign-out-btn" href="#">Sign Out</a>
       
        `
    } 
    // if theyre not logged in 
    else {
        navContent = `
        <a href="login.html">Login</a>
        <a href="signup.html">Signup</a>
        `
    }
    //render our logged in elements 
    userDetails.innerHTML = navContent;
};

checkLogin();

//Sign out button 
const signOutBtn = document.getElementById("sign-out-btn");

let logOut = () => {
    console.log("you've logged out")
    sessionStorage.clear();
    window.location.reload();
}
if (sessionStorage.userID) {
    signOutBtn.onclick = () => logOut();
};