module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "no-plusplus": [2, { allowForLoopAfterthoughts: true }],
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    "operator-linebreak": [2, "after"],
    "comma-dangle": [
      "error",
      {
        arrays: "only-multiline",
        objects: "only-multiline",
        imports: "never",
        exports: "never",
        functions: "never",
      },
    ],
    "react/jsx-props-no-spreading": 0,
    "object-curly-newline": "off",
    "no-unused-expressions": [2, { allowShortCircuit: true }],
    "linebreak-style": ["error", "windows"],
    curly: [2, "multi-line"],
    "import/prefer-default-export": "off",
  },

  globals: {
    React: "writable",
  },
  settings: {
    "import/resolver": {
      "babel-module": {},
    },
  },
};
