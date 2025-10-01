const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    require("tailwindcss"),
    require("autoprefixer"),
    purgecss({
      content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
      safelist: [/^bg-/, /^text-/], 
    }),
  ],
};
