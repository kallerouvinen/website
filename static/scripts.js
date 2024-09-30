const contactForm = document.getElementById("contact-form");
const submitButton = document.getElementById("submit");
const errorText = document.getElementById("error-text");

const submitLabelReady = document.getElementById("submit-label-ready");
const submitLabelLoading = document.getElementById("submit-label-loading");
const submitLabelSuccess = document.getElementById("submit-label-success");
const submitLabelError = document.getElementById("submit-label-error");

const style = getComputedStyle(document.body);
const readyColor = style.getPropertyValue("--color-4");
const successColor = style.getPropertyValue("--color-submit-success");
const errorColor = style.getPropertyValue("--color-submit-error");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const object = Object.fromEntries(formData);

  try {
    setSubmitButtonState("Loading");
    errorText.innerHTML = "";

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(object),
    });

    if (response.status !== 200) {
      throw new Error("Something went wrong");
    }

    setSubmitButtonState("Success");
    contactForm.reset();
  } catch (error) {
    setSubmitButtonState("Error");
    errorText.innerHTML =
      "Something went wrong. Please try again or contact me via social media";
  } finally {
    setTimeout(() => {
      setSubmitButtonState("Ready");
    }, 2000);
  }
});

function setSubmitButtonState(state) {
  if (state === "Ready") {
    submitButton.ariaLabel = "Send";
    submitButton.disabled = false;
    submitButton.removeAttribute("style");
    submitLabelReady.style.transform = "translateY(0px)";
    submitLabelLoading.style.transform = "translateY(50px)";
    submitLabelSuccess.style.transform = "translateY(50px)";
    submitLabelError.style.transform = "translateY(50px)";
  } else if (state === "Loading") {
    submitButton.ariaLabel = "Sending...";
    submitButton.disabled = true;
    submitButton.style.backgroundColor = readyColor;
    submitLabelReady.style.transform = "translateY(-50px)";
    submitLabelLoading.style.transform = "translateY(0px)";
    submitLabelSuccess.style.transform = "translateY(50px)";
    submitLabelError.style.transform = "translateY(50px)";
  } else if (state === "Success") {
    submitButton.ariaLabel = "Done";
    submitButton.style.backgroundColor = successColor;
    submitLabelReady.style.transform = "translateY(-50px)";
    submitLabelLoading.style.transform = "translateY(-50px)";
    submitLabelSuccess.style.transform = "translateY(0px)";
    submitLabelError.style.transform = "translateY(50px)";
  } else if (state === "Error") {
    submitButton.ariaLabel = "Failed";
    submitButton.style.animation = "0.4s shake linear 0.35s";
    submitButton.style.backgroundColor = errorColor;
    submitLabelReady.style.transform = "translateY(-50px)";
    submitLabelLoading.style.transform = "translateY(-50px)";
    submitLabelSuccess.style.transform = "translateY(50px)";
    submitLabelError.style.transform = "translateY(0px)";
  }
}
