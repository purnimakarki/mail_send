$(document).ready(function () {
  const API_URL = "http://localhost:5001/api";

  // Check authentication status
  function checkAuth() {
    const token = localStorage.getItem('userToken');
    if (token) {
        $('#loginSection').hide();
        $('#dashboardSection').show();
        loadUsers();
    } else {
        $('#loginSection').show();
        $('#dashboardSection').hide();
    }
}
  // Load users
  function loadUsers() {
      const token = localStorage.getItem('userToken');
      axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
      }).then((response) => {
          const users = response.data;
          const tbody = $("#usersTable tbody");
          tbody.empty();

          users.forEach((user) => {
              tbody.append(`
                  <tr data-id="${user._id}">
                      <td>${user.name}</td>
                      <td>${user.email}</td>
                      <td>
                          <button class="btn btn-info btn-sm view-user">View</button>
                      </td>
                  </tr>
              `);
          });
      });
  }

  // Register user
  $("#registrationForm").on("submit", function (e) {
      e.preventDefault();
      const userData = {
          name: $("#name").val(),
          email: $("#email").val(),
          password: $("#password").val(),
      };

      axios.post(`${API_URL}/register`, userData)
          .then(() => {
              alert("Registration successful! Please login.");
              this.reset();
              $('#registrationModal').modal('hide');
          })
          .catch((err) => alert(err.response.data.message));
  });

  // Login user
  $("#loginForm").on("submit", function (e) {
      e.preventDefault();
      const loginData = {
          email: $("#loginEmail").val(),
          password: $("#loginPassword").val()
      };

      axios.post(`${API_URL}/login`, loginData)
          .then((response) => {
              localStorage.setItem('userToken', response.data.token);
              $('#userName').text(response.data.name);
              this.reset();
              checkAuth();
          })
          .catch(err => alert(err.response.data.message));
  });

  // Change password
  $("#changePasswordForm").on("submit", function(e) {
    e.preventDefault();

    const token = localStorage.getItem("userToken");
    if (!token) {
        alert("User is not authenticated. Please log in again.");
        return;
    }

    const passwordData = {
        currentPassword: $("#currentPassword").val(),
        newPassword: $("#newPasswordChange").val(),
    };

    // Log the password data to check its structure (remove in production)
    console.log("Password Data:", passwordData);

    axios
        .post(`${API_URL}/change-password`, passwordData, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
            console.log("Response:", response);
            alert(response.data.message);
            this.reset();
            $("#changePasswordModal").modal("hide");
        })
        .catch((error) => {
            console.error("Error response:", error.response);
            alert(error.response?.data?.message || "Error changing password");
        });
});



  // Logout handler
  $("#logoutBtn").on("click", function() {
      localStorage.removeItem('userToken');
      checkAuth();
  });

  // View user details
  $("#usersTable").on("click", ".view-user", function () {
      const userId = $(this).closest("tr").data("id");
      const token = localStorage.getItem('userToken');
      
      axios.get(`${API_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
      }).then((response) => {
          const user = response.data;
          $("#modalUserDetails").html(`
              <p><strong>Name:</strong> ${user.name}</p>
              <p><strong>Email:</strong> ${user.email}</p>
          `);
          new bootstrap.Modal($("#userModal")).show();
      });
  });

 
  

  // Initial auth check
  checkAuth();
});
