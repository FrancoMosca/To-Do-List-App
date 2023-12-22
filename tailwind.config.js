/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{html,ts}",
];
export const theme = {
  extend: {
    fontFamily: {
      'poppins': ['Poppins', 'sans-serif']
    },
  },
};
export const plugins = [require("rippleui")];
