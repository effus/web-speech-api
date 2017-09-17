var SpeechAPI = {
    ifaces : {
        recognition:null,
        grammar:null,
        event:null
    },
    objects : {
        recognition:null,
        grammar:null
    },
    settings : {
        commands:[
            'start',
            'stop'
        ],
        grammar:'#JSGF V1.0; grammar effus; public <command> = ',
        language:'en-US',
        maxAlternatives:1
    },
    init : function(andStart) {
        SpeechAPI.ifaces.recognition = SpeechRecognition || webkitSpeechRecognition;
        SpeechAPI.ifaces.grammar = SpeechGrammarList || webkitSpeechGrammarList;
        SpeechAPI.ifaces.event = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
        SpeechAPI.objects.recognition = new SpeechAPI.ifaces.recognition();
        SpeechAPI.objects.grammar = new SpeechAPI.ifaces.grammar();
        SpeechAPI.settings.grammar += '( ' + SpeechAPI.settings.commands.join(' | ') + ' );';
        SpeechAPI.objects.grammar.addFromString(SpeechAPI.settings.grammar,1);
        SpeechAPI.objects.recognition.grammars = SpeechAPI.objects.grammar;
        SpeechAPI.objects.recognition.lang = SpeechAPI.settings.language;
        SpeechAPI.objects.recognition.interimResults = false;
        SpeechAPI.objects.recognition.maxAlternatives = SpeechAPI.settings.maxAlternatives;
        SpeechAPI.objects.recognition.onresult = function(){
            SpeechAPI.afterRecognition(event.results);
        };
        SpeechAPI.objects.recognition.onspeechend = function() {
          SpeechAPI.objects.recognition.stop();
        }
        SpeechAPI.objects.recognition.onnomatch = function(event) {
          console.log('No matches');
        }
        SpeechAPI.objects.recognition.onerror = function(event) {
          console.log('Error occurred in recognition: ' + event.error);
        }
        if (andStart) {
            SpeechAPI.onStartRecognition();
        }
    },
    onStartRecognition : function() {
        SpeechAPI.objects.recognition.start();
    },
    afterRecognition : function(results){
        // sample command processor
        var last = results.length - 1;
        var command = results[last][0].transcript;
        console.log('Command: '+command);
    }
};
