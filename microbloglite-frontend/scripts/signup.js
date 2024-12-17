const loginForm = document.querySelector("#login");

loginForm.onsubmit = function (event) {
    // Prevent the form from refreshing the page,
    // as it will do by default when the Submit event is triggered:
    event.preventDefault();

    // We can use loginForm.username (for example) to access
    // the input element in the form which has the ID of "username".
    const userData = {
        username: loginForm.username.value,
        fullName: loginForm.fullName.value,
        password: loginForm.password.value,
    }

    // Disables the button after the form has been submitted already:
    // loginForm.loginButton.disabled = true;

    // Time to actually process the login using the function from auth.js!
    signup(userData);
};

function signup (userData) {
    // First, create the user by making a POST request to /api/users
    const createUserOptions = { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    };

    return fetch(apiBaseURL + "/api/users", createUserOptions)
        .then(response => response.json())
        .then(createdUser => {
            if (createdUser.error) {
                console.error("Error creating user:", createdUser);
                // Handle user creation error, e.g., show an error message
                return null;
            }

            // Now login the user after successful creation
            const loginData = { username: userData.username, password: userData.password }; // Assuming the login data is passed here
            login(loginData)
        })
        .catch(error => {
            console.error("Error during user creation or login:", error);
            // Handle any other errors
            return null;
        });
}