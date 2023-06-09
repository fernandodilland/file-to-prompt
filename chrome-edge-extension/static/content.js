// Set the value of GlobalWorkerOptions.workerSrc property to the URL of the local pdf.worker.min.js file
if (typeof window !== "undefined" && "pdfjsLib" in window) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    chrome.runtime.getURL("static/pdf.worker.min.js");
}

// Load Mammoth.js library
const script = document.createElement("script");
script.src = chrome.runtime.getURL("static/mammoth.browser.min.js");
document.head.appendChild(script);

// Create the button
const button = document.createElement("button");
button.innerText = chrome.i18n.getMessage("uploadButtonText");
button.style.padding = "8px";
button.style.paddingLeft = "15px";
button.style.paddingRight = "15px";
button.style.border = "none";
button.style.borderRadius = "5px";
button.style.margin = "3px";

// Create the cancel button
const cancelButton = document.createElement("button");
cancelButton.innerText = chrome.i18n.getMessage("cancelButtonText");
cancelButton.style.padding = "8px";
cancelButton.style.paddingLeft = "15px";
cancelButton.style.paddingRight = "15px";
cancelButton.style.border = "none";
cancelButton.style.borderRadius = "5px";
cancelButton.style.margin = "3px";

// Create the button wrapper div
const buttonWrapper = document.createElement("div");
buttonWrapper.style.display = "flex";
buttonWrapper.style.alignSelf = "center";

// Create the chunk size input
const chunkSizeInput = document.createElement("input");
chunkSizeInput.type = "number";
chunkSizeInput.min = "1";
chunkSizeInput.value = "14000";
chunkSizeInput.style.margin = "3px";
chunkSizeInput.style.width = "80px"; // Set the width of the input element
chunkSizeInput.style.height = "28px"; // Set the width of the input element
chunkSizeInput.style.color = "black"; // Set the font color inside the input element
chunkSizeInput.style.fontSize = "14px"; // Set the font size inside the input element

// Create the chunk size label
const chunkSizeLabel = document.createElement("label");
chunkSizeLabel.innerText = chrome.i18n.getMessage("chunkSizeLabel");
chunkSizeLabel.style.alignSelf = "center";

// Add the buttons to the button wrapper div
buttonWrapper.appendChild(button);
buttonWrapper.appendChild(cancelButton);
chunkSizeLabel.appendChild(chunkSizeInput);

let cancelProgress = false; // Variable to track if the progress should be cancelled

// Function to handle cancellation
function cancelProgressHandler() {
  cancelProgress = true;
}

// Add click event listener to the cancel button
cancelButton.addEventListener("click", cancelProgressHandler);

// Create the progress bar container
const progressContainer = document.createElement("div");
progressContainer.style.width = "99%";
progressContainer.style.height = "5px";
progressContainer.style.margin = "3px";
progressContainer.style.borderRadius = "5px";

// Create the progress bar element
const progressBar = document.createElement("div");
progressBar.style.width = "0%";
progressBar.style.height = "100%";
progressBar.style.backgroundColor = "#b48700"; // Set the color of the progress bar
progressContainer.appendChild(progressBar);


// Add a click event listener to the button
button.addEventListener("click", async () => {
  // Create the input element
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".txt,.js,.py,.html,.css,.json,.csv,.pdf,.doc,.docx"; // Add .pdf to accepted file types

  // Add a change event listener to the input element
  input.addEventListener("change", async () => {
    // Reset progress bar once a new file is inserted
    progressBar.style.width = "0%";

    // Read the file as text or extract text from PDF/Word file
    const file = input.files[0];
    let text;
    if (file.type === "application/pdf") {
      text = await extractTextFromPdfFile(file);
    } else if (
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      text = await extractTextFromWordFile(file);
    } else {
      text = await file.text();
    }
    // Get the chunk size from the input element
    const chunkSize = parseInt(chunkSizeInput.value);

    // Split the text into chunks of the specified size
    const numChunks = Math.ceil(text.length / chunkSize);

    for (let i = 0; i < numChunks; i++) {
      if (cancelProgress) {
        break; // Exit the loop if cancel button is clicked
      }

      const chunk = text.slice(i * chunkSize, (i + 1) * chunkSize);

      // Submit the chunk to the conversation
      await submitConversation(chunk, i + 1, file.name);

      // Update the progress bar
      progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;

      // Wait for ChatGPT to be ready
      let chatgptReady = false;
      while (!chatgptReady) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        chatgptReady = !document.querySelector(".text-2xl > span:not(.invisible)");
      }
    }

    // Finish updating the progress bar
    progressBar.style.width = "100%";
  });

  // Click the input element to trigger the file selection dialog
  input.click();
});

// Define a function that extracts text from a PDF file using pdf.js library and window.pdfjsLib object reference
async function extractTextFromPdfFile(file) {
  const pdfDataUrl = URL.createObjectURL(file);
  const pdfDoc = await window.pdfjsLib.getDocument(pdfDataUrl).promise;
  let textContent = "";
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const pageTextContent = await page.getTextContent();
    textContent += pageTextContent.items.map((item) => item.str).join(" ");
  }
  return textContent;
}

// Define the extractTextFromWordFile function
async function extractTextFromWordFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const arrayBuffer = event.target.result;
      const options = { includeDefaultStyleMap: true }; // Customize options as needed
      window.mammoth
        .extractRawText({ arrayBuffer }, options)
        .then((result) => {
          const text = result.value;
          resolve(text);
        })
        .catch((error) => {
          reject(error);
        });
    };
    reader.onerror = function (event) {
      reject(new Error("Error occurred while reading the Word file."));
    };
    reader.readAsArrayBuffer(file);
  });
}

// Submit conversation function
const submitFilePartText = chrome.i18n.getMessage("submitFilePartText");
async function submitConversation(text, part, filename) {
  const textarea = document.querySelector("textarea[id='prompt-textarea']") || document.querySelector(".mat-mdc-input-element");
  await wait(500);
  textarea.value = submitFilePartText
    .replace("{part}", part)
    .replace("{filename}", filename)
    .replace("{text}", text);

  // Trigger the input event on the textarea
  const inputEvent = new InputEvent("input", {
    bubbles: true,
    cancelable: true,
  });
  textarea.dispatchEvent(inputEvent);

  // Trigger the enter keydown event on the textarea
  const enterKeyEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  textarea.dispatchEvent(enterKeyEvent);
}

// Define a function to wait for a specified number of milliseconds
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Periodically check if the button has been added to the page and add it if it hasn't
const targetSelector =
  ".px-3.pb-3.pt-2.text-center.md\\:px-4.md\\:pb-6.md\\:pt-3,.gmat-caption.ng-tns-c586583937-1";
const intervalId = setInterval(() => {
  const targetElement = document.querySelector(targetSelector);
  if (targetElement && !targetElement.contains(buttonWrapper)) {
    // Create a wrapper div to hold the target element and the button
    const wrapperDiv = document.createElement("div");
    wrapperDiv.style.display = "flex";
    wrapperDiv.style.flexDirection = "column";

    // Move the target element into the wrapper div
    targetElement.parentNode.insertBefore(wrapperDiv, targetElement);
    wrapperDiv.appendChild(targetElement);

    // Insert the button wrapper div after the target element
    wrapperDiv.appendChild(buttonWrapper);

    // Insert the progress bar container after the button wrapper div
    wrapperDiv.appendChild(progressContainer);

    // Insert the chunk size label and input after the progress bar container
    wrapperDiv.appendChild(chunkSizeLabel);

    // Clear the interval as the button has been added
    clearInterval(intervalId);
  }
}, 1000);

// Detect dark mode and apply styles accordingly
const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

function handleDarkModeChange(event) {
  const isDarkMode = event.matches;

  if (isDarkMode) {
    button.style.backgroundColor = "#354134";
    button.style.color = "white";
    cancelButton.style.backgroundColor = "#413434";
    cancelButton.style.color = "white";
  } else {
    button.style.backgroundColor = "#c6ffc6";
    button.style.color = "black";
    cancelButton.style.backgroundColor = "#ffc0c0";
    cancelButton.style.color = "black";
  }

  setInterval(clickContinueButton, 1300); // Check for the button every second
}

handleDarkModeChange(darkModeQuery); // Apply initial styles based on current mode

darkModeQuery.addListener(handleDarkModeChange); // Update styles when mode changes

function clickContinueButton() {
  const buttons = document.querySelectorAll(".btn");

  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].innerText.includes("Continue generating")) {
      buttons[i].click();
      break; // Exit the loop after clicking the button
    }
  }
}

setInterval(clickContinueButton, 1000); // Check for the button every second
