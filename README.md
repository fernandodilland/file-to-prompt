# File to Prompt (Browser Extension)

[![Chrome Web Store Users](https://img.shields.io/chrome-web-store/users/hmhjddciebeidnliblcaonmdlknagjim?label=Chrome%20Users&style=social&logo=google)](https://chrome.google.com/webstore/detail/file-to-prompt-for-chatgp/hmhjddciebeidnliblcaonmdlknagjim) [![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=social)](LICENSE)

Multi-Language Chrome/Edge Extension that enables selecting local files and sending them as text prompts to Artificial Intelligences (OpenAI ChatGPT, Bing Chat, Google Bard) in segments.

## Description

File to Prompt is a multi-language Chrome/Edge extension that allows you to select local files and send them as text prompts to various Artificial Intelligence models such as OpenAI ChatGPT, Bing Chat, and Google Bard. This extension breaks down the selected files into segments and sends them for processing.

## Features

- Select local files and send them as text prompts.
- Works with multiple AI models.
- Segment large files for efficient processing.

## Installation

File to Prompt is available in the [Google Chrome Web Store](https://chrome.google.com/webstore/detail/file-to-prompt-for-chatgp/hmhjddciebeidnliblcaonmdlknagjim). You can also install it manually by following the steps below:

### Chrome/Edge Installation

1. Download the zip file from the [GitHub repository](https://github.com/fernandodilland/file-to-prompt/) and extract it to a local directory.
2. Open the Extensions page in Chrome/Edge by navigating to `chrome://extensions` in your browser.
3. Enable Developer Mode by toggling the switch on the top right corner.
4. Click on "Load unpacked" and select the `/chrome-edge-extension` folder from the extracted files.
5. File to Prompt is now installed and ready to use in your Chrome/Edge browser.

## Usage

Once installed, File to Prompt works seamlessly by displaying the necessary buttons in the text input field of generative text platforms (e.g., ChatGPT). Here's how to use it:

1. Open a generative text platform or application that supports text input.
2. Locate the text input field where you would normally type your prompts.
3. When the File to Prompt extension is active, you will see additional buttons appear in the text input field.
4. Click on the appropriate button to select a local file that you want to send as a text prompt.
5. Choose the AI model you want to use for processing the text prompt (e.g., OpenAI ChatGPT, Bing Chat, or Google Bard).
6. The extension will automatically segment the file into smaller parts for efficient processing.
7. Click "Send Prompt" or the corresponding button to send the file segments as text prompts to the selected AI model.

File to Prompt simplifies the process of using local files as text prompts, making it easier to interact with generative text models on supported platforms.

## Libraries Used

File to Prompt utilizes the following libraries:

1. [mammoth.browser.min.js](https://github.com/mwilliamson/mammoth.js/) - A library for converting .docx files to HTML.  
   - License: [BSD-2-Clause license](https://github.com/mwilliamson/mammoth.js/blob/master/LICENSE)
2. [pdf.min.js](https://github.com/mozilla/pdf.js) - A library for rendering PDF files in JavaScript.
   - License: [Apache-2.0 license](https://github.com/mozilla/pdf.js/blob/master/LICENSE)
3. [pdf.worker.min.js](https://github.com/mozilla/pdf.js) - A component of the pdf.js library responsible for the PDF rendering process.
   - License: [Apache-2.0 license](https://github.com/mozilla/pdf.js/blob/master/LICENSE)

## License

File to Prompt is released under the [MIT License](LICENSE). Copyright (c) [Fernando Dilland Mireles Cisneros].

For more information, visit the [official website](https://filetoprompt.com/).

---

Feel free to add or modify the content as per your preference.
