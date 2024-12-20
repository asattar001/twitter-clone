/* Posts Page JavaScript */

"use strict";

const logoutBtn = document.querySelector("#logout");
logoutBtn.addEventListener("click", (event) => {
  logout();
});

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

async function loadAllPosts() {
  const allPosts = document.querySelector("#allPosts");
  const template = document.querySelector("#template");
  let posts = await getAllPosts();
  console.log(posts)
  let postArr = await Promise.all(posts.map(async (post) => {
    const user = await getUserInfo(post.username);
    let newPost = template.content.cloneNode("true");
    newPost.querySelector("#userAvatar").textContent = user.fullName[0].toUpperCase();
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

    return newPost
  }));

  allPosts.append(...postArr);
}

async function getUserInfo(user) {
  const currentUser = await getLoginData();
  user = user ? user : currentUser.username
  const options = {
    method: "Get",
    headers: {
      Authorization: `Bearer ${currentUser.token}`,
    },
  };
  return fetch(apiBaseURL + "/api/users/" + user, options)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}


loadAllPosts();

async function updateUserInfo() {
  const user = await getUserInfo();
  console.log("Current User",user);
  document.querySelector("#currentUsername").textContent = user.fullName[0].toUpperCase() + user.fullName.slice(1);
  document.querySelector("#currentUserHandle").textContent = "@" + user.username;
  const currentUserAvatar = document.querySelectorAll(".currentUserAvatar");
  currentUserAvatar.forEach((avatar) => {
    avatar.textContent = user.fullName[0].toUpperCase();
  });
}

updateUserInfo();

// POSTING

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

document.querySelector("#dismissBtn").addEventListener("click", () => {
  document.querySelector("#modalPost").value = "";
});

const PostBtn = document.querySelector("#postBtn");
PostBtn.addEventListener("click", () => {
  const text = document.querySelector("#mainPost");
  if (text.value) {
    console.log(text.value, "POSTING");
    addPost(text.value);
    addCard(text.value);
  }
  text.value = "";
});

// Adding Post to Server

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

// Adding Post on Web

async function addCard(text) {
  const allPosts = document.querySelector("#allPosts");
  const template = document.querySelector("#template");
  const user = await getUserInfo()
  const posts = await getAllPosts();
  const currentPost = posts[0];
  let newPost = template.content.cloneNode("true");
  newPost.querySelector("#userAvatar").textContent = user.fullName[0].toUpperCase();
  newPost.querySelector("#userPost").textContent =
    user.fullName[0].toUpperCase() + user.fullName.slice(1);
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
  console.log(newPost);
  allPosts.prepend(newPost);
}


