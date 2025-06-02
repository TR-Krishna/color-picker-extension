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

      // Update color preview
      previewElement.style.backgroundColor = color;

      // Optional: copy to clipboard on click
      resultElement.style.cursor = "pointer";
      resultElement.title = "Click to copy";
      resultElement.onclick = () => {
        navigator.clipboard.writeText(color);
        resultElement.textContent = "Copied!";
        setTimeout(() => (resultElement.textContent = color), 1000);
      };

      // ✅ Now generate palettes
      const palettes = generatePalettes(color);
      displayPalettes(palettes);
    })
    .catch((e) => {
      resultElement.textContent = "Cancelled or failed.";
      resultElement.style.color = "#ff4d4d";
    });
});

function generatePalettes(baseColor) {

  const color = chroma(baseColor);
  const [h,s,l] = color.hsl();
  const getHue=(angle)=>(h+angle+360)%360;
  return {
    analogous: [
      chroma.hsl(getHue(-30), s, l).hex(),
      baseColor,
      chroma.hsl(getHue(30), s, l).hex()
    ],
    complementary: [
      baseColor,
      chroma.hsl(getHue(180), s, l).hex()
    ],
    triadic: [
      baseColor,
      chroma.hsl(getHue(120), s, l).hex(),
      chroma.hsl(getHue(240), s, l).hex()
    ]
  };
}
function displayPalettes(palettes) {
  const container = document.getElementById("paletteContainer");
  container.innerHTML = ""; // Clear old
  

  Object.entries(palettes).forEach(([type, colors]) => {
    const section = document.createElement("div");
    section.innerHTML = `<h4 style="color:#ccc; margin: 8px 0;">${type.toUpperCase()}</h4>`;

    colors.forEach((hex) => {
      const swatch = document.createElement("div");
      swatch.style.background = hex;
      swatch.style.width = "30px";
      swatch.style.height = "30px";
      swatch.style.border = "1px solid #ccc";
      swatch.style.margin = "4px";
      swatch.title = hex;
      swatch.style.display = "inline-block";
      swatch.style.borderRadius = "4px";

      swatch.style,cursor="pointer";
      swatch.addEventListener("click",()=>{
        navigator.clipboard.writeText(hex);
        const msg=document.createElement("div");
        msg.textContent = `Copied: ${hex.toUpperCase()}`;
        msg.style.position = "fixed"; 
        msg.font="12px Arial, sans-serif";
        msg.style.color="white";
        msg.padding="4px 4px";
        msg.paddingLeft="8px";
         msg.style.bottom = "20px";
        // msg.style.left = `${swatch.offsetLeft}px`;
        
        swatch.title = "Copied!";
          swatch.parentElement.appendChild(msg);
        setTimeout(() => 
          {
            msg.remove();},1000);

      })

      section.appendChild(swatch);
    });

    container.appendChild(section);
  });
}
