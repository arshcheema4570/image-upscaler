# Image Upscaler

A free, offline-capable PWA that enlarges images **4×** in your browser using the RealESR-General x4v3 super-resolution model and LiteRT.js.

**Try it:** [Image Upscaler](https://arshcheema4570.github.io/image-upscaler/)

## Features

- Select or drop an image, choose the available processing accelerator, adjust tile overlap, and upscale locally.
- Uses WebGPU when supported; CPU processing is available as a slower fallback.
- LiteRT/WASM initialization and model compilation start after you choose an image, keeping the app shell responsive before use.
- The service worker caches the app shell, model, and runtime assets for subsequent offline use after they have downloaded successfully.
- No account or cloud image-upload service is required. Image processing runs in the browser; the initial model/runtime download can be large.

## Use and install

Open the link above in a current browser. Choose an image, select an accelerator, adjust tile overlap if needed, and start upscaling. On mobile, use the browser’s **Install app** or **Add to Home Screen** option when available.

## Model and runtime

- Model: [RealESR-General x4v3](https://huggingface.co/qualcomm/Real-ESRGAN-General-x4v3) by Qualcomm AI Hub.
- Runtime: [LiteRT.js](https://github.com/google-ai-edge/LiteRT.js).
- The model and its weights are subject to their own upstream licensing terms; review the model page and license before redistribution or commercial use.

## Deployment

This repository is deployed with GitHub Pages. For local testing, serve the repository root over HTTP (for example, `python3 -m http.server 8000`) and open `http://localhost:8000/`. Camera/file access and service-worker behavior may differ when opening the HTML directly from disk.
