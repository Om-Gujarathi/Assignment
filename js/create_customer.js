document.addEventListener("DOMContentLoaded", function () {
  const customerForm = document.getElementById("customerForm");
  const resultMessage = document.getElementById("resultMessage");

  customerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const authToken = localStorage.getItem("authToken"); // Retrieve the authentication token from local storage

    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const street = document.getElementById("street").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    // Check if mandatory fields are filled
    if (!first_name || !last_name) {
      resultMessage.textContent = "Please provide First Name and Last Name.";
      return;
    }

    const cmdParameter = "create"; // Added the 'cmd' parameter to query parameters

    const queryString = `?cmd=${cmdParameter}`;

    const requestData = {
      first_name: first_name,
      last_name: last_name,
      street: street,
      address: address,
      city: city,
      state: state,
      email: email,
      phone: phone,
    };

    fetch(
      "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp" +
        queryString,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    )
      .then((response) => {
        if (response.status === 201) {
          resultMessage.textContent =
            "Customer created successfully (Status: 201)";
          window.location.href = "home.html";
        } else if (response.status === 400) {
          resultMessage.textContent =
            "Bad Request: First Name or Last Name is missing (Status: 400)";
        } else {
          resultMessage.textContent = "Unexpected Error: " + response.status;
        }
      })
      .catch((error) => {
        resultMessage.textContent = "An error occurred: " + error;
      });
  });
});
