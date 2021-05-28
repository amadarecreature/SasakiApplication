const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: 'development', // "production" | "development" | "none"

    // メインとなるJavaScriptファイル（エントリーポイント）
    entry: {
        "sample/js": './src/main/ts',
        "dist": './src/main/ts'
    },
    watch: true,
    watchOptions: {
        ignored: ['files/**/*.js', 'node_modules/**'],
        aggregateTimeout: 200,
        poll: 1000
    },
    output: {
        path: path.join(__dirname, "/"),
        filename: "[name]/instructiongo.bundle.js"
    },

    module: {
        rules: [{
            // 拡張子 .ts の場合
            test: /\.ts$/,
            // TypeScript をコンパイルする
            use: 'ts-loader'
        }]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "../common/src/main/ts", to: "src/main/ts/common", force: true },
                { from: "../common/src/main/stylus", to: "src/main/stylus/common", force: true },
            ],

        }),
    ],
    // import 文で .ts ファイルを解決するため
    resolve: {
        modules: [
            "node_modules", // node_modules 内も対象とする
        ],
        extensions: [
            '.ts',
            '.js' // node_modulesのライブラリ読み込みに必要
        ]
    }
};