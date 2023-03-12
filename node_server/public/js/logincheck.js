function checkFormValidity() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const submitButton = document.getElementById("submitButton");
    if (username !== "" && password !== "") {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  }