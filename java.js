let gameArea = $('#gameArea');
let apiArea = $('#apiArea');
let body = $('body');
let quotesArray = [];

var $xhr = $.getJSON('https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?');

$xhr.done(function(data) {
    if ($xhr.status !== 200) {
        return;
    }
    apiArea.append(data.quoteText);
});
