module.exports = {
  mode: "jit",

  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ["Arimo", "Helvetica", "Arial", "sans-serif"],
      body: ["IBM Plex Sans", "sans-serif"],
    },

    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#fff",
      primary: {
        300: "#A85BF1", //-60
        400: "#9B44EF", //-40
        500: "#8F2CED", //-20
        600: "#8215EB", //00
        700: "#6811BC", //40
        800: "#4E0D8D", //80
        900: "#4E0D8D", //100
      },
      gradient: {
        start: "#7311D0",
        end: "#AC55FF",
      },
      neutral: {
        200: "#f2f2f2", //05
        200: "#f2f2f2", //05
        300: "#e6e6e6", //10
        400: "#cdcdcd", //20
        500: "#9a9a9a", //40
        600: "#686868", //60
        700: "#282828", //80
        800: "#121212", //100
        900: "#1f1f1f", //??
      },
      negative: {
        500: "#FF3D3D",
      },
    },
    extend: {
      animation: {
        grow: "grow 0.3s linear",
      },
      keyframes: {
        grow: {
          "0%": { "max-width": "0" },
          "100%": { "max-width": "100%" },
        },
      },
      spacing: {
        nav: "61px",
        content: "calc(100vh-61px)",
      },
      minHeight: {
        nav: "61px",
        content: "calc(100vh-61px)",
      },
      maxHeight: {
        nav: "61px",
        content: "calc(100vh-61px)",
      },
    },
  },
};
