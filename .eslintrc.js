module.exports = {
    "env": {
        "es2019": true,
        "node": true
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "@typescript-eslint/tslint"
    ],
    "rules": {
        "@typescript-eslint/class-name-casing": "error",
        "@typescript-eslint/member-delimiter-style": [
            "off",
            {
                "multiline": {
                    "delimiter": "none",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/semi": [
            "off",
            null
        ],
        "curly": "error",
        "eqeqeq": [
            "error",
            "always"
        ],
        "no-redeclare": "error",
        "no-unused-expressions": "error",
        "@typescript-eslint/tslint/config": [
            "error",
            {
                "rules": {
                    "no-unused-variable": true
                }
            }
        ]
    }
};
