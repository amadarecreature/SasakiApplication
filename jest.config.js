module.exports = {
    "roots": [
        "<rootDir>/src"
    ],
    "testMatch": [
        "**/test/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)",
        "!**/node_modules/**"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
        // ,"**/test/**/*.+(ts|tsx|js)": "ts-jest"
    }, "preset": 'ts-jest'
}