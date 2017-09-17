# Web Speech API expreiments

https://developer.mozilla.org/ru/docs/Web/API/Web_Speech_API

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