module.exports = {
    "roots": [
        "<rootDir>/script"
    ],
    "testMatch": [
        "**/test/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)",
        "<rootDir>/test/GoBoadManager.test.ts",

    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
}