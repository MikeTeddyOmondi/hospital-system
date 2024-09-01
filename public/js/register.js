document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");
  const authMsg = document.getElementById("auth-msg");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Collect form data
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      authMsg.textContent = "Passwords do not match.";
      authMsg.style.color = "red";
      return;
    }

    const data = {
      email,
      username,
      password,
    };

    try {
      // Send POST request
      const response = await fetch(
        "/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      // Parse response
      const result = await response.json();

      if (response.ok && result.success) {
        // Redirect to login page
        // window.location.href = "/dashboard";
      } else {
        // Show error message
        authMsg.textContent = `${result.error}`;
        authMsg.style.color = "red";
      }
    } catch (error) {
      // Handle network or server errors
      authMsg.textContent = "An error occurred. Please try again.";
      authMsg.style.color = "red";
    }
  });
});
