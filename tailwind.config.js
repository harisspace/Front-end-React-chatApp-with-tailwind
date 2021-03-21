module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        outline: "0 0 5px rgba(81, 203, 238, 1)",
      },
      maxHeight: {
        fluid: "calc(100vh - 330px)",
      },
      height: {
        fluid: "calc(100vh - 330px)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
