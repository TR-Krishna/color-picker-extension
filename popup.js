// document.getElementById('pickColor').addEventListener('click', async () => {
//   const status = document.getElementById('status');
//   status.textContent = "Click on any color on the page...";
  
//   try {
//     // Get the current active tab
//     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
//     // Execute the color picker script in the current tab
//     await chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       function: pickColorFromPage,
//     });
    
//   } catch (error) {
//     status.textContent = "Error: " + error.message;
//   }
// });

// // This function will be injected into the current page
// function pickColorFromPage() {
    
//   // Create a div that covers the entire page
//   const pickerOverlay = document.createElement('div');
//   pickerOverlay.style.position = 'fixed';
//   pickerOverlay.style.top = '0';
//   pickerOverlay.style.left = '0';
//   pickerOverlay.style.width = '100%';
//   pickerOverlay.style.height = '100%';
//   pickerOverlay.style.cursor = 'crosshair';
//   pickerOverlay.style.zIndex = '999999';
//   document.body.appendChild(pickerOverlay);
  
//   // Create a magnifier element
//   const magnifier = document.createElement('div');
//   magnifier.style.position = 'absolute';
//   magnifier.style.width = '50px';
//   magnifier.style.height = '50px';
//   magnifier.style.border = '2px solid #000';
//   magnifier.style.borderRadius = '50%';
//   magnifier.style.overflow = 'hidden';
//   magnifier.style.pointerEvents = 'none';
//   magnifier.style.display = 'none';
//   document.body.appendChild(magnifier);
  
//   // Create a pixel preview inside magnifier
//   const pixelPreview = document.createElement('div');
//   pixelPreview.style.width = '100%';
//   pixelPreview.style.height = '100%';
//   pixelPreview.style.transform = 'scale(5)';
//   pixelPreview.style.transformOrigin = '0 0';
//   magnifier.appendChild(pixelPreview);
  
//   // Function to get color at position
//   function getColorAtPosition(x, y) {
//     const canvas = document.createElement('canvas');
//     canvas.width = 1;
//     canvas.height = 1;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(window, x, y, 1, 1, 0, 0, 1, 1);
//     const pixel = ctx.getImageData(0, 0, 1, 1).data;
//     return `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1).toUpperCase()}`;
//   }
  
//   // Mouse move handler
//   pickerOverlay.addEventListener('mousemove', (e) => {
//     magnifier.style.display = 'block';
//     magnifier.style.left = (e.pageX + 10) + 'px';
//     magnifier.style.top = (e.pageY + 10) + 'px';
    
//     // Create a small portion of the screen for the magnifier
//     const sourceSize = 10;
//     const sourceX = e.pageX - sourceSize/2;
//     const sourceY = e.pageY - sourceSize/2;
    
//     const canvas = document.createElement('canvas');
//     canvas.width = sourceSize;
//     canvas.height = sourceSize;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(window, sourceX, sourceY, sourceSize, sourceSize, 0, 0, sourceSize, sourceSize);
    
//     pixelPreview.style.backgroundImage = `url(${canvas.toDataURL()})`;
//     pixelPreview.style.backgroundPosition = `-${sourceSize/2 - 1}px -${sourceSize/2 - 1}px`;
//   });
  
//   // Click handler to pick color
//   pickerOverlay.addEventListener('click', (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     const color = getColorAtPosition(e.pageX, e.pageY);
    
//     // Send the color back to the extension popup
//     chrome.runtime.sendMessage({ color: color }, () => {
//       // Remove the overlay after picking color
//       document.body.removeChild(pickerOverlay);
//       document.body.removeChild(magnifier);
//     });
    
//     return false;
//   });
  
//   // Right-click or escape to cancel
//   pickerOverlay.addEventListener('contextmenu', (e) => {
//     e.preventDefault();
//     document.body.removeChild(pickerOverlay);
//     document.body.removeChild(magnifier);
//   });
  
//   document.addEventListener('keydown', (e) => {
//     if (e.key === 'Escape') {
//       document.body.removeChild(pickerOverlay);
//       document.body.removeChild(magnifier);
//     }
//   });
// }

// // Listen for messages from the content script
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.color) {
//     document.getElementById('colorPreview').style.backgroundColor = request.color;
//     document.getElementById('colorValue').textContent = request.color;
//     document.getElementById('status').textContent = "Color picked!";
    
//     // Copy to clipboard
//     navigator.clipboard.writeText(request.color).then(() => {
//       document.getElementById('status').textContent = "Color copied to clipboard!";
//     }).catch(err => {
//       document.getElementById('status').textContent = "Color picked (copy failed)";
//     });
//   }
//   sendResponse({});
// });

document.getElementById("start-button").addEventListener("click", () => {
  const resultElement = document.getElementById("result");
  const previewElement = document.getElementById("colorPreview");

  if (!window.EyeDropper) {
    resultElement.textContent = "❌ EyeDropper API not supported.";
    resultElement.style.color = "#ff4d4d";
    return;
  }

  const eyeDropper = new EyeDropper();

  eyeDropper
    .open()
    .then((result) => {
      const color = result.sRGBHex;

      // Show hex code
      resultElement.textContent = color;
      resultElement.style.color = "#ffffff";
      resultElement.style.fontWeight = "500";

      // Update color preview box
      previewElement.style.backgroundColor = color;

      // Optional: copy to clipboard on click
      resultElement.style.cursor = "pointer";
      resultElement.title = "Click to copy";

      resultElement.onclick = () => {
        navigator.clipboard.writeText(color);
        resultElement.textContent = "✅ Copied!";
        setTimeout(() => (resultElement.textContent = color), 1000);
      };
    })
    .catch((e) => {
      resultElement.textContent = "❌ Cancelled or failed.";
      resultElement.style.color = "#ff4d4d";
    });
});
