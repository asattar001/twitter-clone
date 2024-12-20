/* Posts Page JavaScript */

"use strict";


const logoutBtn = document.querySelector("#logout");
logoutBtn.addEventListener("click", (event) => {
  logout();
});

// Get all Posts
function getAllPosts() {
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

  return fetch(apiBaseURL + "/api/posts", options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

// Gets all Posts and loops through it
async function loadAllPosts() {
  const user = await getUserInfo();

  const allPosts = document.querySelector("#allPosts");
  const template = document.querySelector("#template");
  let posts = await getAllPosts();

  let postArr = posts
    .filter((post) => post.username == user.username)
    .map((post) => {
      let newPost = template.content.cloneNode("true");

      newPost.querySelector("#userAvatar").textContent = post.username[0].toUpperCase();
      newPost.querySelector("#userPost").textContent = user.fullName[0].toUpperCase() + user.fullName.slice(1);
      newPost.querySelector("#userHandle").textContent = "@" + user.username;
      newPost.querySelector("#userText").textContent = post.text;
      newPost.querySelector("#userLikes").textContent = post.likes.length
        ? post.likes.length
        : Math.floor(Math.random() * 1000) + 1;

      const date = new Date(post.createdAt);
      const postDate = date
        .toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })
        .split(",");

      newPost.querySelector("#userPostMonth").textContent = postDate[0];
      newPost.querySelector("#userPostTime").textContent = postDate[1];
      console.log(post);
      newPost.querySelector("#li-del").querySelector("button").id = post._id;
      return newPost;
    });

  allPosts.append(...postArr);
}

loadAllPosts();

// Updates the profile with the current users Fullname and username
async function updateUserInfo() {
  const user = await getUserInfo();
  document.querySelector("#currentUsername").textContent = user.fullName[0].toUpperCase() + user.fullName.slice(1);
  document.querySelector("#currentUserHandle").textContent = "@" + user.username;
  document.querySelector("#profileUsername").textContent = user.fullName[0].toUpperCase() + user.fullName.slice(1);
  document.querySelector("#profileHandle").textContent = "@" + user.username;
  const currentUserAvatar = document.querySelectorAll(".currentUserAvatar");
  currentUserAvatar.forEach((avatar) => {
    avatar.textContent = user.username[0].toUpperCase();
  });
}

updateUserInfo();

// Post a message // calls add post and add card
const modalPostBtn = document.querySelector("#modalPostBtn");
modalPostBtn.setAttribute("data-bs-dismiss", "modal");
modalPostBtn.addEventListener("click", (event) => {
  const text = document.querySelector("#modalPost");
  if (text.value) {
    console.log(text.value, "POSTING");
    addPost(text.value);
    addCard(text.value);
  }

  text.value = "";
});

// closing the modal
document.querySelector("#dismissBtn").addEventListener("click", () => {
  document.querySelector("#modalPost").value = "";
});

// Add Post to Server

function addPost(text) {
  const loginData = getLoginData();

  const textToPost = text;

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
      text = ""; // Clear input after successful post
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

// Add Post to Web

async function addCard(text) {
  const allPosts = document.querySelector("#allPosts");
  const template = document.querySelector("#template");
  const user = await getUserInfo();
  const posts = await getAllPosts();

  const currentPost = posts[0];
  let newPost = template.content.cloneNode("true");
  newPost.querySelector("#userAvatar").textContent = currentPost.username[0].toUpperCase();
  newPost.querySelector("#userPost").textContent = user.fullName[0].toUpperCase() + user.fullName.slice(1);
  newPost.querySelector("#userHandle").textContent = "@" + user.username;
  newPost.querySelector("#userText").textContent = currentPost.text;
  newPost.querySelector("#userLikes").textContent = currentPost.likes.length
    ? currentPost.likes.length
    : Math.floor(Math.random() * 1000) + 1;

  const date = new Date(currentPost.createdAt);
  const postDate = date
    .toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
    .split(",");

  newPost.querySelector("#userPostMonth").textContent = postDate[0];
  newPost.querySelector("#userPostTime").textContent = postDate[1];
  newPost.querySelector("#li-del").querySelector("button").id = currentPost._id;

  console.log(newPost);
  allPosts.prepend(newPost);
}

function getUserInfo() {
  const user = getLoginData();

  const options = {
    method: "Get",
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  return fetch(apiBaseURL + "/api/users/" + user.username, options)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

// Delete Post on Server and Web

function deletePost(event) {
  const allPosts = document.querySelector("#allPosts");
  const delPost = event.target.closest(".postExample");
  const loginData = getLoginData();

  const options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${loginData.token}`,
    },
  };

  fetch(apiBaseURL + "/api/posts/" + event.target.id, options)
    .then(() => {
      allPosts.removeChild(delPost);
    }).then(() => console.log(event.target.id + " deleted successfully"))
}

