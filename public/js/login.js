document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const authMsg = document.getElementById("auth-msg");

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
                "/api/user/login",
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

            localStorage.setItem("userEmail", result.email)
            // TODO: use JWT and set localstorage
            // localStorage.setItem("sessionId", document.cookie)
            
            if (response.ok && result.message === "Login successful") {
              // Redirect to home page
              // window.location.href = '../html/expenses-updated.html'; // Redirect to expenses page
              window.location.href = "/";
            } else {
                // Show error message
                authMsg.textContent =
                    "Login failed. Please check your credentials and try again.";
                authMsg.style.color = "red";
            }
        } catch (error) {
            // Handle network or server errors
            authMsg.textContent = "An error occurred. Please try again.";
            authMsg.style.color = "red";
        }
    });
});