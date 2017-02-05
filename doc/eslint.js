module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        // "jquery": true,
    },
    "extends": "eslint:recommended",
    "plugins": ["html"],
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "warn",
            4
        ],
        "linebreak-style": [
            "warn",
            "windows"
        ],
        "quotes": [
            "warn",
            "single"
        ],
        "semi": [
            "warn",
            "never"
        ],
        "no-unused-vars": [
            "warn"
        ],
        "no-console": [
            "warn"
        ]
    }
};