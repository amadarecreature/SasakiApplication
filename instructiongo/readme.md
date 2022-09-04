# InstructionGo

This application is to draw a IGO Boad for instruction.

## Description

This application is written by TypeScript.

## Features

## Requirement

- Requirement

## SampleDemo local 1

Before execute,you need to have installed docker.

```docker

docker build -t instructiongo_sample_nginx .

docker run --name InstructionGo -v /{furllPath}InstructionGo/docs/sample:/usr/share/nginx/html -p 80:80 instructiongo_sample_nginx

#accsess http://localhost on your browser

```

## SampleDemo local 2

on Ubuntu
change to project current directory

``` bash
npx http-server
# access http://localhost:8080/docs/sample/

```

## Usage

1. A
2. B
3. C

## Sample

<https://amadarecreature.github.io/SasakiApplication/instructiongo/sample/>

### gliftモード

<https://amadarecreature.github.io/SasakiApplication/instructiongo/sample/glift.html>

## Installation

$ git clone <https://github.com/amadarecreature/InstructionGo.git>
$ cd InstructionGo

## Deployment

### Test

1. execute test

[jest](https://jestjs.io/docs/ja/cli)

``` bash
    "--runInBand"
    "--noStackTrace"
    "--verbose"
```

### Deploy

1. deploy
2. deploy

## Author

[@MasafumiSasaki](https://twitter.com/)
mail to: xxxx@mail.com

## License

This software is released under the MIT License, see LICENSE.txt.

## memo

1.Jsdom without canvas dependencies will behave like '\<div\>'.

<https://www.npmjs.com/package/canvas>

<https://github.com/jsdom/jsdom>

## canvas のテスト

``` text
-imge データの構造

1 ピクセルにつき、RDGA の 4 つのデータが存在する。
RGBA はそれぞれ 0 ～ 255 の 8bit データ
つまり、1 ピクセルで配列 4 個を使用する。
ピクセル(x,y)の開始位置 index(R の位置)
index=(4*y)*幅+(4*x)=4*(y\*幅+x)
G=index+1
B=index+2
A=index+3

```

## Environment

### npminstall on WSL2

[https://docs.microsoft.com/ja-jp/windows/nodejs/setup-on-wsl2]

### package management

[https://www.npmjs.com/package/npm-check-updates]

``` bash
npm install -g npm-check-updates
ncu
ncu -u
npm install
```

### WSL2

``` bash
S# mtu change
sudo ip link set eth0 mtu 1200
```

## library

### Glift

[grlifgo](http://www.gliftgo.com/)

### wgo

[https://github.com/waltheri/wgo.js]

### use canvas on Ubuntu

[https://github.com/Automattic/node-canvas/wiki/Installation:-Ubuntu-and-other-Debian-based-systems]

## Git

[https://github.com/amadarecreature/SasakiApplication.git]

## To set commit template

git config commit.template .gitmessage

## Links

[https://zenn.dev/phi/articles/node-npx-http-server]
