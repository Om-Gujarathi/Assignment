document.addEventListener("DOMContentLoaded", function () {
  const authToken = localStorage.getItem("authToken");
  const customerList = document.getElementById("customerList");
  var myButton = document.getElementById("custom-button");

  myButton.addEventListener("click", function () {
    window.location.href = "create_customer.html";
  });

  var logoutButton = document.getElementById("logout-button");

  logoutButton.addEventListener("click", function () {
      localStorage.setItem("authToken", null);
      window.location.href = "index.html";
    });

  // Function to fetch and display customer data
  function fetchAndDisplayCustomers() {
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
        // Clear existing data
        customerList.innerHTML = "";

        // Iterate through customer data and create table rows
        data.forEach((customer) => {
          const row = document.createElement("tr");
          row.innerHTML = `
          <td>${customer.first_name}</td>
          <td>${customer.last_name}</td>
          <td>${customer.street}</td>
          <td>${customer.address}</td>
          <td>${customer.city}</td>
          <td>${customer.state}</td>
          <td>${customer.email}</td>
          <td>${customer.phone}</td>
          <td>
            <button class="edit-button" data-customer-id="${customer.uuid}">Edit</button>
            <button class="delete-button" data-customer-id="${customer.uuid}">Delete</button>
          </td>
        `;

          customerList.appendChild(row);
        });

        // Add event listeners for delete buttons
        const deleteButtons = document.querySelectorAll(".delete-button");
        deleteButtons.forEach((button) => {
          button.addEventListener("click", function () {
            const customerId = this.getAttribute("data-customer-id");

            if (confirm("Are you sure you want to delete this customer?")) {
              deleteCustomer(customerId);
            }
          });
        });

        // Add event listeners for edit buttons
        const editButtons = document.querySelectorAll(".edit-button");
        editButtons.forEach((button) => {
          button.addEventListener("click", function () {
            const customerId = this.getAttribute("data-customer-id");
            // Navigate to the edit_customer.html page with the customer's UUID as a query parameter
            window.location.href = `edit_customer.html?uuid=${customerId}`;
          });
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Function to delete a customer
  function deleteCustomer(customerId) {
    fetch(
      "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=delete&uuid=" +
        customerId,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + authToken,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          // Customer deleted successfully
          alert("Customer deleted successfully");
          fetchAndDisplayCustomers(); // Refresh the customer list
        } else if (response.status === 500) {
          alert("Error: Customer not deleted (Status: 500)");
        } else if (response.status === 400) {
          alert("Error: UUID not found (Status: 400)");
        } else {
          alert("Unexpected Error: " + response.status);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  // Fetch and display customers on page load
  fetchAndDisplayCustomers();
});
