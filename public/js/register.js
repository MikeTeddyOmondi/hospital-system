document.addEventListener('DOMContentLoaded', () => {
  let form = document.getElementById('signup-form')
  let authMsg = document.getElementById('auth-msg')
  let formInput = document.getElementsByName('input')
  // let formSubmitBtn = document.getElementById('formSubmitBtn')

  // formSubmitBtn.addEventListener("click", () => {
  // })

  form.addEventListener('submit', async event => {
    event.preventDefault()

    // Collect form data
    const email = document.getElementById('email').value
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirmPassword').value

    if (!email || !username || !password) {
      authMsg.classList.add('auth-msg-show')
      authMsg.textContent = 'Please enter all the fields!'
      authMsg.style.color = 'red'
      return
    }

    if (password !== confirmPassword) {
      authMsg.classList.add('auth-msg-show')
      authMsg.textContent = 'Passwords do not match!'
      authMsg.style.color = 'red'
      return
    }

    const data = {
      email,
      username,
      password,
    }

    try {
      // Send POST request
      const response = await fetch('/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      // Parse response
      const result = await response.json()

      if (response.ok && result.success) {
        // Redirect to login page
        window.location.href = '/dashboard'
      } else {
        // Show error message
        authMsg.classList.toggle('auth-msg-show')
        authMsg.textContent = `${result.error}`
        authMsg.style.color = 'red'
      }
    } catch (error) {
      // Handle network or server errors
      authMsg.classList.toggle('auth-msg-show')
      authMsg.textContent = 'An error occurred. Please try again.'
      authMsg.style.color = 'red'
    }
  })
})

const removeAuthMsg = function () {
  let authMsg = document.getElementById('auth-msg')
  authMsg.classList.remove('auth-msg-show')
}
