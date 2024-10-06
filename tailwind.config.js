/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
        fontFamily: {
            sans: ['Nunito', 'sans-serif'],
            // sans: ['Gilroy-Regular', 'sans-serif'],
            'gilroy': ['Gilroy-Regular', 'sans-serif'],
            'gilroy-semibold': ['Gilroy-SemiBold', 'sans-serif'],
            'gilroy-bold': ['Gilroy-Bold', 'sans-serif'],
            'gilroy-extrabold': ['Gilroy-ExtraBold', 'sans-serif'],
            'gilroy-light': ['Gilroy-Light', 'sans-serif'],
            Nunito: ["Nunito", "sans-serif"],
            NunitoBold: ["Nunito-Bold", "sans-serif"],
            NunitoExtraBold: ["Nunito-ExtraBold", "sans-serif"],
            NunitoExtraLight: ["Nunito-ExtraLight", "sans-serif"],
            NunitoLight: ["Nunito-Light", "sans-serif"],
            NunitoMedium: ["Nunito-Medium", "sans-serif"],
            NunitoSemiBold: ["Nunito-SemiBold", "sans-serif"],
        },
        colors: {
            theme:{
                500: '#0000ff',
                
            },
            primary: {

                500: "#585FF9",
                // 500: '#191d1f',
            },
            secondary: {
                
                500: "#FFC132",
                // 500: "#FFA900",
               
            },
        },
    },
},
  plugins: [],
}

