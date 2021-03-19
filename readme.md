# InstructionGo

This application is to draw a IGO Boad for instruction.

## Description

This application is written by Typescript.

## Features

## Requirement

- Requirement

## SampleDemo local

Before execute,you need to have installed docker.

```docker

docker build -t instructiongo_sample_nginx .

docker run --name InstructionGo -v /{furllPath}InstructionGo/docs/sample:/usr/share/nginx/html -p 80:80 instructiongo_sample_nginx

#accsess http://localhost on your browser

 ```

## SampleDemo local 2

```
 npx http-server

# access http://localhost:8080/docs/sample/
```
## Usage

1. A
2. B
3. C

## Sample

<https://amadarecreature.github.io/InstructionGo/sample/>

## Installation

$ git clone <https://github.com/amadarecreature/InstructionGo.git>
$ cd InstructionGo

## Deployment

### Test

1. execute test

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

## canvasのテスト

 -imgeデータの構造
    1ピクセルにつき、RDGAの4つのデータが存在する。
    RGBAはそれぞれ0～255の8bitデータ
    つまり、1ピクセルで配列4個を使用する。
    ピクセル(x,y)の開始位置index(Rの位置)
    index=(4*y)*幅+(4*x)=4*(y*幅+x)
    G=index+1
    B=index+2
    A=index+3


# npminstall on WSL2

https://docs.microsoft.com/ja-jp/windows/nodejs/setup-on-wsl2




# package management

https://www.npmjs.com/package/npm-check-updates
```
npm install -g npm-check-updates
ncu
ncu -u
npm install
```


## use canvas on Ubuntu
https://github.com/Automattic/node-canvas/wiki/Installation:-Ubuntu-and-other-Debian-based-systems


# Test

https://jestjs.io/docs/ja/cli

    "--runInBand"
    "--noStackTrace"
    "--verbose"

# Git
## To set commit template
git config commit.template .gitmessage


