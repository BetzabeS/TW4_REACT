import React from "react";

class DinnerModel {
  constructor(guests = 2, dishes = []) {
    this.numberOfGuests = guests;
    this.dishes = dishes;
    this.subscribers = []; // want the model to have more subscribers,
  }

  setNumberOfGuests(x) {
    if (x > 0) {
      this.numberOfGuests = x;
      this.notifyObservers({ guests: x }); //passing a function parameter with details
    }
  }

  getNumberOfGuests() {
    return this.numberOfGuests;
    debugger;
  }

  addObserver(callback) {
    this.subscribers.push(callback);
  }

  notifyObservers(whatHappened) {
    for (let i = 0; i < this.subscribers.length; i++) {
      let callback = this.subscribers[i];
      callback(whatHappened); // TODO call the callback with the whatHappened payload
    }
  }

  searchDishes(dishType, freeText) {
    return this.response(
      `recipes/search/?type=${dishType}&query=${freeText}`
    ).then(data => data.results);
  }

  getDishDetails(id) {
    return this.response(`recipes/${id}/information`);
  }

  response(details) {
    return fetch(ENDPOINT + details, {
      method: "GET",
      headers: {
        "X-Mashape-Key": API_KEY
      }
    })
      .then(response => response.json()) // from headers to response data
      .then(data => data);
  }

  inMenu(dish) {
    return this.dishes.some(d => d.id === dish.id);
  }

  addToMenu(dish) {
    if (this.dishes.filter(d => d.id == dish.id).length == 0) {
      //filter returns an array of objects with a defined property: d.id==dish.id

      this.amount = dish.extendedIngredients;

      var price = this.amount.map(priceDish => priceDish.amount);

      const sum = price.reduce(function(a, b) {
        return a + b;
      }, 0);

      dish.price = sum;

      this.dishes = [...this.dishes, dish]; // this.dishes = [dishes[0], dishes[1], ... , dish]
      // this.dishes.push(dish)

      this.notifyObservers({ add_dish: dish });
    } else {
      console.error("Dish is already in the menu");
    }
  }

  getMenu() {
    return [...this.dishes];
  }

  getMenuPrice() {
    const sum = model.getMenu().reduce(function(acc, dish) {
      return acc + parseInt(dish.price);
    }, 0);

    return sum;
  }

  getPrice(dish) {
    var price = 0;

    dish.extendedIngredients.forEach(sum => (price += sum.amount));

    return price;
  }

  getIngredients() {
    var ingredients = [];

    this.getMenu().map(dish =>
      dish.extendedIngredients.forEach(ing => {
        if (ingredients.some(i => i.name === ing.name)) {
          var ingredientToUpdate = ingredients.filter(
            i => i.name === ing.name
          )[0];
          ingredientToUpdate.amount += ing.amount;
        } else {
          ingredients.push(ing);
        }
      })
    );

    return ingredients;
    // console.log(ingredients);
  }

  removeMenuFromList(dish) {
    this.dishes = [...this.getMenu().filter(i => i.id !== dish.id)];

    this.notifyObservers({ delete_dish: dish.id });

    return;
  }
}
