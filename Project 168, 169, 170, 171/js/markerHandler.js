AFRAME.registerComponent("marker-handler", {
  init: async function () {

    //get the toys collection from firestore database
    var toys = await this.getToys();

    //markerFound event
    this.el.addEventListener("markerFound", () => {
      var markerId = this.el.id;      
      this.handleMarkerFound(toys, markerId);
    });

    //markerLost event
    this.el.addEventListener("markerLost", () => {
      this.handleMarkerLost();
    });

  },
  askUserId: function() {
    var iconUrl = "https://www.shutterstock.com/image-vector/shop-vintage-toys-vector-260nw-346323368.jpg";
     swal({
      title:"AR Toy Store",
      icon:iconUrl,
      content:{
        element:"input",
        attributes:{
          placeholder:"Type your UserID here",
          type:"number",
          min:1
        },
      },
      closeOnClickOutside:false,
     }).then(inputValue=>{
      uid=inputValue
     });
  },
  handleMarkerFound: function (toys, markerId) {
    // Changing button div visibility
    var toy=toys.filter(toy=>toy.id===markerId)[0]
    if (toy.is_out_of_stock) {
      swal({
        icon: "warning",
        title: toy.toy_name.toUpperCase(),
        text: "This toy is not available today!!!",
        timer: 2500,
        buttons: false
      });
    } else {
       // Changing Model scale to initial scale
      var model = document.querySelector(`#model-${toy.id}`);
      model.setAttribute("position", toy.model_geometry.position);
      model.setAttribute("rotation", toy.model_geometry.rotation);
      model.setAttribute("scale", toy.model_geometry.scale);

      //Update UI conent VISIBILITY of AR scene(MODEL , INGREDIENTS & PRICE)
      var model = document.querySelector(`#model-${toy.id}`);
      model.setAttribute("visible",true)
      var mainPlane = document.querySelector(`#main-plane-${toy.id}`)
      mainPlane.setAttribute("visible",true)
      var pricePlane=document.querySelector(`#price-plane-${toy.id}`)
      pricePlane.setAttribute("visible",true)
      
      var buttonDiv = document.getElementById("button-div"); 
      buttonDiv.style.display = "flex"; 
      var orderButtton = document.getElementById("order-button"); 
      var orderSummaryButtton = document.getElementById("order-summary-button");
      
      // Changing button div visibility
      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "flex";


      var ratingButton = document.getElementById("rating-button");
      var orderButtton = document.getElementById("order-button");

      // Handling Click Events
      ratingButton.addEventListener("click", function() {
        swal({
          icon: "warning",
          title: "Rate Dish",
          text: "Work In Progress"
        });
      });

      orderButtton.addEventListener("click", () => {
        uid=uid.toUpperCase()
        this.handleOrder(uid,toy)        

        swal({
          icon: "https://i.imgur.com/4NZ6uLY.jpg",
          title: "Thanks For Order !",
          text: "Your order will be delivered to you soon!",
          timer: 2000,
          buttons: false
        });
      });
    }    
    // Handling Click Events
    ratingButton.addEventListener("click", function () {
      swal({
        icon: "warning",
        title: "Rate Toy",
        text: "Work In Progress"
      });
    });

    orderSummaryButtton.addEventListener("click", () => {
      swal({
        icon: "https://i.imgur.com/4NZ6uLY.jpg",
        title: "Thanks For Order !",
        text: "Your order will be delivered soon!"
      });
    });

    // Changing Model scale to initial scale
    var toy = toys.filter(toy => toy.id === markerId)[0];

    var model = document.querySelector(`#model-${toy.id}`);
    model.setAttribute("position", toy.model_geometry.position);
    model.setAttribute("rotation", toy.model_geometry.rotation);
    model.setAttribute("scale", toy.model_geometry.scale);
  },
  handleOrder: function(uid,toy){
    firebase 
    .firestore() 
    .collection("users") 
    .doc(uid) 
    .get() 
    .then(doc => { 
      var details = doc.data();
      if (details["current_orders"][toy.id]) { 
         details["current_orders"][toy.id]["quantity"] += 1; 
         var currentQuantity = details["current_orders"][toy.id]["quantity"]; 
         details["current_orders"][toy.id]["subtotal"] = currentQuantity * toy.price; 
      } 
      else { 
        details["current_orders"][toy.id] = { item: toy.toy_name, price: toy.price, quantity: 1, subtotal: toy.price * 1 }; 
      } 
      details.total_bill += toy.price;
      firebase 
      .firestore() 
      .collection("users") 
      .doc(doc.id) 
      .update(details);
    });
  },
  handleMarkerLost: function () {
    // Changing button div visibility
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  },
  //get the toys collection from firestore database
  getToys: async function () {
    return await firebase
      .firestore()
      .collection("toys")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data());
      });
  }
});

  