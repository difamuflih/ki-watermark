function getImageData(file, callback) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      callback(imageData);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function applyWatermark() {
  const inputFile = document.getElementById("inputImage").files[0];
  const watermarkFile = document.getElementById("watermarkImage").files[0];
  if (inputFile && watermarkFile) {
    getImageData(inputFile, (inputImageData) => {
      getImageData(watermarkFile, (watermarkImageData) => {
        const inputPixels = inputImageData.data;
        const watermarkPixels = watermarkImageData.data;

        for (let i = 0; i < inputPixels.length; i += 4) {
          inputPixels[i] =
            (inputPixels[i] & 0xfe) | ((watermarkPixels[i] & 0x80) >> 7);
          inputPixels[i + 1] =
            (inputPixels[i + 1] & 0xfe) |
            ((watermarkPixels[i + 1] & 0x80) >> 7);
          inputPixels[i + 2] =
            (inputPixels[i + 2] & 0xfe) |
            ((watermarkPixels[i + 2] & 0x80) >> 7);
        }

        const canvas = document.getElementById("watermarkedCanvas");
        canvas.width = inputImageData.width;
        canvas.height = inputImageData.height;
        const ctx = canvas.getContext("2d");
        ctx.putImageData(inputImageData, 0, 0);
      });
    });
  } else {
    alert("Please Input Image and Watermark");
  }
}

function detectWatermark() {
  const detectFile = document.getElementById("detectImage").files[0];
  if (detectFile) {
    getImageData(detectFile, (detectImageData) => {
      const detectPixels = detectImageData.data;

      for (let i = 0; i < detectPixels.length; i += 4) {
        detectPixels[i] = (detectPixels[i] & 1) * 255;
        detectPixels[i + 1] = (detectPixels[i + 1] & 1) * 255;
        detectPixels[i + 2] = (detectPixels[i + 2] & 1) * 255;
      }

      const canvas = document.getElementById("detectedCanvas");
      canvas.width = detectImageData.width;
      canvas.height = detectImageData.height;
      const ctx = canvas.getContext("2d");
      ctx.putImageData(detectImageData, 0, 0);
    });
  } else {
    alert("Please input Image for detected");
  }
}

function downloadResult() {
  const canvas = document.getElementById("watermarkedCanvas");
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "SADWatermark.png";
  link.click();
}
