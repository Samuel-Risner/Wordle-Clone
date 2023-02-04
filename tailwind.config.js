/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html",
    "./ts/game/create_keyboard.ts",
    "./ts/game/create_game_field.ts",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
