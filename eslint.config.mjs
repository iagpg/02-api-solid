import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"
import unusedImports from "eslint-plugin-unused-imports"

export default [
    {
        plugins: {
            "unused-imports": unusedImports,
        },
        files: ["**/*.{js,mjs,cjs,ts}"],
    },
    
    {
        rules: {
      
            semi: ["warn", "never"],
            "@typescript-eslint/no-unused-vars": "warn",
            
            "no-undef": "warn",
            "consistent-return": 2,
            "indent"           : [1, 4],
            "no-else-return"   : 1,
            "space-unary-ops"  : 2,
            "no-multiple-empty-lines": ["warn",{"max":1,"maxEOF":0}],
        }   
    },
    {
        ignores: [
            "build/**/*",     // ignore all contents in and under `build/` directory but not the `build/` directory itself
        ]
    },
    {
        languageOptions: {
            globals: globals.browser,
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
]