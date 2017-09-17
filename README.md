# Web Speech API expreiments

https://developer.mozilla.org/ru/docs/Web/API/Web_Speech_API

How to enable in browsers: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#Browser_compatibility

## SpeechAPI JS lib
SpeechAPI
### Usage
```JS
require('WebSpeechAPI.js');
SpeechAPI.commands = ['write','save'];
SpeechAPI.language = 'en-US';
SpeechAPI.afterRecognition = function(results) {
    console.log(results);
}
SpeechAPI.init(true);
```
----
![compatible](https://img.shields.io/badge/Firefox%2044-Compatible-brightgreen.svg)
![compatible](https://img.shields.io/badge/Chrome%2033-Compatible-brightgreen.svg)
