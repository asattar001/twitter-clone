"use strict";

const newAccForm = document.querySelector("#newAccForm");

newAccForm.onsubmit = function (event) {
  // Prevent the form from refreshing the page,
  // as it will do by default when the Submit event is triggered:
  event.preventDefault();

  // We can use LogIn.username (for example) to access
  // the input element in the form which has the ID of "username".
  const userData = {
    username: newAccForm.newAccUsername.value,
    fullName: newAccForm.newAccFullName.value,
    password: newAccForm.newAccPassword.value,
  };

  // Time to actually process the login using the function from auth.js!
  signUp(userData)
};
