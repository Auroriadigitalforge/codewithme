## CodeWithMe – Birthday Greeting Page

An animated, single-page birthday greeting built with HTML, CSS, and a touch of JavaScript. The page orchestrates a celebratory sequence—balloons, cake, fireworks, floating hearts, and a flip-open letter—intended as a shareable, personalized surprise.

## Getting Started

### Prerequisites
- Modern web browser (desktop or mobile).

### Run Locally
1. Clone the repository and move into the project directory:
   ```bash
   git clone https://github.com/Auroriadigitalforge/codewithme.git
   cd codewithme
   ```
2. Open `index.html` in your browser (double-click or drag it into the browser window). No build step is required.

## Project Structure
- `index.html` – Main page wiring animations and assets.
- `style.css` – Core styling (most styles are inlined in `index.html`).
- Asset images (balloons, cake, fireworks, clouds, gift boxes, hearts, etc.).

## Customization
- **Images/text:** Replace image files with your own while keeping the same filenames, or update the `<img>` sources and text in `index.html`.
- **Colors/fonts:** Adjust gradients, colors, and font imports in the `<style>` block of `index.html` or `style.css`.
- **Letter content:** Edit the message inside the `.card2 h2` element in `index.html`.

## Usage Tips
- On load, the scene animates automatically; clicking the envelope reveals the letter.
- The heart trail follows cursor or touch movement; throttling prevents excessive DOM nodes.

## Deployment
- Host the static files on any static server (GitHub Pages, Netlify, Vercel, S3/CloudFront, etc.). No backend is needed.

## Attribution
- Original creator: [@Auroria_Digital_Forge](https://www.instagram.com/loop_and_logic/).
