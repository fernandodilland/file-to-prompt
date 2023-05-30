// Get local messages
const buttonText = chrome.i18n.getMessage("buttonText");
const submitFilePartText = chrome.i18n.getMessage("submitFilePartText");

// Create the button element
const button = document.createElement('button');
button.innerText = buttonText;  // Set button text from local messages
button.style.backgroundColor = 'green';
button.style.color = 'white';
button.style.padding = '5px';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.margin = '5px';

// Create the progress element
const progressElement = document.createElement('div');
progressElement.style.width = '99%';
progressElement.style.height = '5px';
progressElement.style.backgroundColor = 'grey';

// Create the progress bar
const progressBar = document.createElement('div');
progressBar.style.width = '0%';
progressBar.style.height = '100%';
progressBar.style.backgroundColor = 'blue';

// Append progress bar to progress element
progressElement.appendChild(progressBar);

// Find the target element to insert before
const targetElement = document.querySelector('.flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4');

// Insert the button and progress element before the target element
targetElement.parentNode.insertBefore(button, targetElement);
targetElement.parentNode.insertBefore(progressElement, targetElement);

// Add event listener to the button
button.addEventListener('click', async () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt, .js, .py, .html, .css, .json, .csv';

  // Handle file selection
  fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileName = file.name;
      const fileSize = file.size;
      const chunkSize = 15000;
      const numChunks = Math.ceil(fileSize / chunkSize);

      // Read the file as text
      const fileReader = new FileReader();

      fileReader.onload = async () => {
        const fileContent = fileReader.result;

        // Split the text into chunks
        const chunks = [];
        for (let i = 0; i < numChunks; i++) {
          const start = i * chunkSize;
          const end = (i + 1) * chunkSize;
          const chunk = fileContent.slice(start, end);
          chunks.push(chunk);

          // Update progress bar
          progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;
        }

        // Submit each chunk to the conversation
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          await submitConversation(chunk, i + 1, fileName);
        }

        // Check if chatgpt is ready
        let chatgptReady = false;
        while (!chatgptReady) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          chatgptReady = !document.querySelector('.text-2xl > span:not(.invisible)');
        }

        // Set progress bar to blue
        progressBar.style.backgroundColor = 'blue';
      };

      fileReader.readAsText(file);
    }
  });

  // Trigger the file input dialog
  fileInput.click();
});

// Submit conversation function
async function submitConversation(text, part, filename) {
  const textarea = document.querySelector("textarea[tabindex='0']");
  const enterKeyEvent = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });

  // Set textarea value from local messages
  textarea.value = submitFilePartText
    .replace('{part}', part)
    .replace('{filename}', filename)
    .replace('{text}', text);
    
  textarea.dispatchEvent(enterKeyEvent);
}