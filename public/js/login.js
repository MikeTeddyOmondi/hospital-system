document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const authMsg = document.getElementById("auth-msg");
  const formInput = document.querySelector("input");
  
  formInput.addEventListener("change", () => {
    authMsg.textContent = '';
  })

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Collect form data
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const data = {
      email,
      password,
    };

    try {
      // Send POST request
      const response = await fetch(
        "/api/v1/users/login",
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
      // console.log({ result })

      // localStorage.setItem("userEmail", result.email)
      // TODO: use JWT and set localstorage
      // localStorage.setItem("sessionId", document.cookie)

      if (response.ok && result.success) {
        // Redirect 
        window.location.href = "/dashboard";
      } else {
        // Show error message
        authMsg.textContent =
          "Login failed. Please check your credentials and try again.";
        authMsg.style.color = "red";
      }
    } catch (error) {
      // Handle network or server errors
      console.error({ error })
      authMsg.textContent = "An error occurred. Please try again.";
      authMsg.style.color = "red";
    }
  });
});
