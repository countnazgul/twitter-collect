var datum = require('datumbox').factory("f664cc04d639950ea82b4be8c84df74c");
var async = require('async');

var tweets = [
"virginmedia nice to know you don't value customer service or NPS. surprising that your quick to take my money. Maybe sky will value me more",
"Thank you! I'd like to add that @chicken_film was another favourite - so many good films...",
"we are now being advised to install something but I can't actually get online to install anything.",
"mine too..&amp; still the modem lights flicker. Working on phone :( so now @02 saying I'm running outta data",
"2 days of not working. Please sort this out"
]

// "@virginmedia 5 days for an engineer?! are you kidding!! My father is stuck at home after chemo in this heat and now no TV either? Unreal ðŸ˜¡",
// "@virginmedia after being on hold for 5 minutes it would be great if your advisors answered the phone rather than hang up. #notimpressed",
// "@virginmedia already did the Druid wedding thing, otherwise it would be on the list!",
// "@virginmedia already have you dont do internet where i live otherwise i would come with you ðŸ˜©",
// "@virginmedia certainly have a way of ruining every sports event Wimbledon now. The Masters final last time.",
// "@virginmedia fingers crossed :) getting fed up with the awful service from sky! Looking forward to hopefully getting sky soon :)",
// "@virginmedia great wifi, doesn't even bloody connect ðŸ˜Š",
// "@virginmedia Guessing they're still working on it..? If not, there's always tomorrow",
// "@virginmedia have your engineers actually established what the problem is? http://t.co/A1npjXeLwW",
// "@virginmedia hi KD could you help me please?"


async.each(tweets, function(tweet, callback) {
    tweet = tweet.replace('@', '');
    
//     datum.parallel(
//         tweet, 
//         ['SentimentAnalysis', 'TwitterSentimentAnalysis', 'GenderDetection', 'keywordExtraction'],
//         function(err, results) {
//             if ( err )
//                 return console.error(err);            
//             console.log(results);
            
            datum.topicClassification(tweet, "n", function(err, data) {
                if ( err )
                    return console.log(err);

                console.log(data);  // Remarks here.
                callback(); 
            });            
            
            
            
            // results is [] and have the output in same service format.
        //});                   
}, function(err){
    console.log('All processed!');
});  




// datum.twitterSentimentAnalysis("2 days of not working. Please sort this out", function(err, data) {
//     if ( err )
//         return console.log(err);

//     console.log(data);  // Remarks here.
// });