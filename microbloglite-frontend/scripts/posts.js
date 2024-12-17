/* Posts Page JavaScript */

"use strict";

const logoutBtn = document.querySelector("#logout");

logoutBtn.addEventListener("click", (event) => {
  logout();
});

function loadPosts() {
  const loginData = getLoginData();

  // GET /auth/logout
  const options = {
    method: "GET",
    headers: {
      // This header is how we authenticate our user with the
      // server for any API requests which require the user
      // to be logged-in in order to have access.
      // In the API docs, these endpoints display a lock icon.
      Authorization: `Bearer ${loginData.token}`,

    },
  };

  fetch(apiBaseURL + "/api/posts", options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("All posts:", data);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

loadPosts()