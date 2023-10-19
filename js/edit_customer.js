document.addEventListener("DOMContentLoaded", function () {
  const authToken = localStorage.getItem("authToken");

  // Get the UUID from the query parameter
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const customerId = urlParams.get("uuid");

  // Get the HTML elements
  const first_name = document.getElementById("first_name");
  const last_name = document.getElementById("last_name");
  const street = document.getElementById("street");
  const address = document.getElementById("address");
  const city = document.getElementById("city");
  const state = document.getElementById("state");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");

  fetch(
    "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
      },
    }
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Failed to fetch customer data");
      }
    })
    .then((data) => {
      // Filter the data by UUID
      const customer = data.find((customer) => customer.uuid === customerId);

      if (customer) {
        // Fill the HTML elements with customer data
        first_name.value = customer.first_name;
        last_name.value = customer.last_name;
        street.value = customer.street;
        address.value = customer.address;
        city.value = customer.city;
        state.value = customer.state;
        email.value = customer.email;
        phone.value = customer.phone;
      } else {
        console.error("Customer not found.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  const customerForm = document.getElementById("customerForm");
  const resultMessage = document.getElementById("resultMessage");

  customerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Create the request data for updating the customer
    const requestData = {
      first_name: first_name.value,
      last_name: last_name.value,
      street: street.value,
      address: address.value,
      city: city.value,
      state: state.value,
      email: email.value,
      phone: phone.value,
    };
      
      console.log(requestData);

    fetch(
      "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=update&uuid=" +
        customerId,
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
        if (response.status === 200) {
          resultMessage.textContent =
            "Customer updated successfully (Status: 200)";
          window.location.href = "home.html";
        } else if (response.status === 500) {
          resultMessage.textContent =
            "Error: Customer not updated (Status: 500)";
        } else if (response.status === 400) {
          resultMessage.textContent = "Error: Bad Request (Status: 400)";
        } else {
          resultMessage.textContent = "Unexpected Error: " + response.status;
        }
      })
      .catch((error) => {
        resultMessage.textContent = "An error occurred: " + error;
      });
  });
});
