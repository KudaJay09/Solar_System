# Solar System (three.js + React + Vite)

A small demo project that renders a solar-system-style scene in the browser using three.js and React.

This repository demonstrates building an interactive 3D scene with React, Vite, and @react-three/fiber. It includes orbiting planets, tooltips, an information panel, minimap, and controls to focus and orbit selected planets.

Key ideas:

- Use three.js for GPU-accelerated, WebGL-based rendering in the browser.
- Use React + Vite for a fast development environment (HMR).
- Use @react-three/fiber and @react-three/drei for convenient React bindings and helpers.

## Features

- Rotating/orbiting planets with textures
- Click to select a planet (shows info panel and minimap highlight)
- Orbit controls that can target the selected planet
- Tooltips rendered with `<Html />`
- Starfield/background and sun glow

## Getting started

Prerequisites:

- Node.js (16+ recommended)

Install dependencies and run the dev server (PowerShell):

```powershell
npm install
npm run dev
```

Open the URL shown by Vite in your browser (usually http://localhost:5173).

## Useful scripts

- npm run dev — start development server with HMR
- npm run build — build for production
- npm run preview — preview the production build

## Project structure (important files)

- `index.html` — app HTML
- `src/main.jsx` — React entry
- `src/App.jsx` — main scene composition and camera controller
- `src/components/Planet.jsx` — planet mesh, click/tooltip handling
- `src/components/PlanetControls.jsx` — OrbitControls wrapper that targets selected planet
- `src/components/Sun.jsx`, `StarBackground.jsx`, `OrbitRing.jsx`, `MiniMap.jsx` — scene helpers
- `public/textures/` — planet and sun textures
- `public/sounds/` — UI and zoom sounds

## Notes and troubleshooting

- If controls behave unexpectedly, check that only one `OrbitControls` instance is active in the scene. Multiple controls can conflict.
- If a planet selection doesn't behave as expected, confirm the selected object includes a `.ref` to the mesh (used to move the camera/controls target).
- Look in the browser console for runtime errors; they often indicate undefined refs or missing assets.

## Contributing

Pull requests welcome. If you add features, add small tests or a README note describing usage.

## License

This project is provided as-is. Add a license file if you plan to publish it.
