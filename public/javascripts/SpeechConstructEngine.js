
// Função construtora que ira permitir o processamento dos textos

var speechConstructEngine = function(){

  // Variaveis de escopo da função
  var lastFrameSeconds;
  var currentFrameSeconds;
  var minTick;
  var lastDomObj;
  var lastCssProp;

  lastFrameSeconds = new Date().getTime();
  minTick = 300;

  // Array de objetos que ira devolver o retorno HTML baseado em palavras chaves
  var keywordHTML = [
    {keyword: 'menu', html: '<div id="menu">Menu</div>'},
    {keyword: 'rodapé', html: '<div id="rodape">Rodape</div>'},
    {keyword: 'botão', html: '<input type="button" />' },
    {keyword: 'form', html: '<form></form>'}
  ]

  var keywordCSSProp = [
    {keyword: 'esquerda', cssProp: 'float'},
    {keyword: 'right', cssProp: 'float'},
    {keyword: 'espaço interno', cssProp: 'padding'},
    {keyword: 'margem', cssProp: 'margin'},
    {keyword: 'fundo', cssProp: 'background'},
    {keyword: 'cor de fundo', cssProp: 'background'},
    {keyword: 'cor do fundo', cssProp: 'background'},
    // {keyword: 'cor de texto', cssProp: 'color'},
    // {keyword: 'cor do texto', cssProp: 'color'},
    {keyword: 'alinhar', cssProp: 'float'},
    {keyword: 'alinhado', cssProp: 'float'},
    {keyword: 'alinhamento', cssProp: 'float'},
    {keyword: 'largura', cssProp: 'width'},
    {keyword: 'altura', cssProp: 'height'},
  ]

  var keywordCSSValue = [
    {keyword: 'azul', cssValue: 'blue'},
    {keyword: 'vermelho', cssValue: 'red'},
    {keyword: 'amarelo', cssValue: 'yellow'},
    {keyword: 'cinza', cssValue: 'grey'},
    {keyword: 'verde', cssValue: 'green'},
    {keyword: 'branco', cssValue: 'white'},
    {keyword: '10 pixels', cssValue: '10px'},
    {keyword: '20 pixels', cssValue: '20px'},
    {keyword: '30 pixels', cssValue: '30px'},
    {keyword: '40 pixels', cssValue: '40px'},
    {keyword: '50 pixels', cssValue: '50px'},
    {keyword: '60 pixels', cssValue: '60px'},
    {keyword: '70 pixels', cssValue: '70px'},
    {keyword: 'esquerda', cssValue: 'left'},
    {keyword: 'direita', cssValue: 'right'},
  ]

  // Função para fazer parse do Text
  this.parseText = function(audioTranscritEvent, callback){

    currentFrameSeconds = new Date().getTime();

    // Passa para a funcao analisar o texto
    textToHTML(audioTranscritEvent, function(result){

      callback(result);

    });

  };

  function log(text){
    console.log('SpeechConstructEngine Log: ' + text);
  }

  // Função que ira aplicar analise no texto e devolver HTML
  function textToHTML(audioTranscritEvent, callback){

    var audioTranscritText = event.results[event.results.length - 1][0].transcript;

    // console.log(event);
    console.log(audioTranscritText);

    // Recupera a ultima palavra da sequencia de texto recuperada pelo Transcript
    var lastWord = audioTranscritText.split(" ");
    lastWord = lastWord[lastWord.length - 1];

    var html = '';

    // Fixa problema do Speech devolver varias vezes a mesma palavra de uma vez

    console.log(lastWord);
    console.log(audioTranscritEvent);

    var currentTick = currentFrameSeconds - lastFrameSeconds;
    // console.log(currentTick);
    //
    if(currentTick < minTick){
      callback('');
      return;
    }

    console.log('Proxima palavra a ser processada: ' + lastWord);

    // Inicia o parse HTML
    keywordHTML.forEach(function(currentValue, index, array){

      // Verifica se ultima palavra capturada pelo Speech está no array de HTML
      if(currentValue.keyword.indexOf(lastWord) != -1){

        var el =  $.parseHTML(currentValue.html);

        console.log(el);
        html = el;

        lastDomObj = el;

        return;

      }

    });

    // Inicia o parse da propriedade CSS
    keywordCSSProp.forEach(function(currentValue, index, array){

      // Verifica se ultima palavra capturada pelo Speech está no array de HTML
      if(currentValue.keyword.indexOf(lastWord) != -1){

        var el = lastDomObj;

        lastCssProp = currentValue.cssProp;

        console.log(lastCssProp);

        return;

      }

    });

    // Inicia o parse do valor CSS
    keywordCSSValue.forEach(function(currentValue, index, array){

      // Verifica se ultima palavra capturada pelo Speech está no array de HTML
      if(currentValue.keyword.indexOf(lastWord) != -1){

        var el = lastDomObj;

        $(el).css(lastCssProp, currentValue.cssValue);

        return;

      }

    });

    // lastWordRecognized = lastWord;                // Armazena a ultima palavra coletada
    lastFrameSeconds = new Date().getTime();      // Armazena o ultimo tick

    console.log('Devolvendo HTML valido');

    // Invoca callback devolvendo o HTML resultante do Parser
    callback(html);
    return;

  }

}
