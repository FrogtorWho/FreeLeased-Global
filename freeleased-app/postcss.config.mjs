// freeleased-app uses @tailwindcss/vite (Tailwind v4 native Vite plugin),
// which does not need PostCSS. This stub prevents Vite from walking up the
// tree and loading the parent workspace's postcss.config.mjs (which references
// @tailwindcss/postcss, a package not installed here).
export default { plugins: {} };