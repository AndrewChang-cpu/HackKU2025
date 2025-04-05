/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#F5FCFD',
        priamryText: '#000000',
        secondaryText: '#6200EE',
        action: '#5BD9C2',
      }
    },
  },
  plugins: [],
}