document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("login-button");
  const errorMessage = document.getElementById("error-message");

  loginButton.addEventListener("click", function () {
    const loginId = document.getElementById("login_id").value;
    const password = document.getElementById("password").value;

    // Make an API request to the given URL using the Fetch API
    fetch(
      "https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_id: loginId, // test@sunbasedata.com
          password: password, // Test@123
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          // API call successful, store the token and perform further actions
          const token = data.access_token;
          localStorage.setItem("authToken", token);
          // Example: Redirect to another page or perform other actions with the token
          window.location.href = "home.html";
        } else {
          errorMessage.textContent =
            "Login failed. Please check your credentials.";
        }
      })
      .catch((error) => {
        errorMessage.textContent = "An error occurred while logging in.";
        console.error("API Error:", error);
      });
  });
});
