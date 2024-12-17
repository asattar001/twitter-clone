"use strict";

// Global variables
const postInput = document.querySelector("#postInput");
const postButton = document.querySelector("#postButton");
const responseMessage = document.querySelector("#responseMessage");
const logoutBtn = document.querySelector("#logout");

// Logout functionality
logoutBtn.addEventListener("click", (event) => {
  logout(); // Assumes logout() is defined in auth.js
  window.location.replace("index.html");
});

// Post creation functionality
postButton.addEventListener("click", (event) => {
  const loginData = getLoginData();

  const textToPost = postInput.value

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loginData.token}`,
    },
    body: JSON.stringify({ text: textToPost }),
  };

  fetch(apiBaseURL + "/api/posts", options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Post created:", data);
      responseMessage.textContent = "Post successful!";
      responseMessage.style.color = "green";
      postInput.value = ""; // Clear input after successful post
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      responseMessage.textContent = "Failed to post. Please try again.";
      responseMessage.style.color = "red";
    });
});
