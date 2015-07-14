var Twit = require('twit');
var config = require('./config')
var mongoose = require('mongoose');
var fs = require('fs');
var async = require('async');

mongoose.connect(config.mongoose.url);

var T = new Twit({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token: config.twitter.access_token,
  access_token_secret: config.twitter.access_token_secret
});

var Tweet = mongoose.model('twitter', {
    id: String,
    id_str: Number,
    text: String,
    source: String,
    truncated: Boolean,
    in_reply_to_status_id: String,
    in_reply_to_status_id_str: String,
    in_reply_to_user_id: String,
    in_reply_to_user_id_str: String,
    in_reply_to_screen_name: String,  
    retweet_count : Number,
    favorite_count: Number,
    favorited: Boolean,
    retweeted: Boolean,
    possibly_sensitive: Boolean,
    filter_level: String,
    lang: String,
    timestamp_ms: String,    
    created_at: String,
    user_id: Number,
    user_id_str: String,
    search_term: String
});

var TweetUser = mongoose.model('twitter_users', {
    id: Number,
    id_str: String,
    name: String,
    screen_name: String,
    location: String,
    url: String,
    description: String,
    protected: Boolean,
    verified: Boolean,
    followers_count: Number,
    friends_count: Number,
    listed_count: Number,
    favourites_count: Number,
    statuses_count: Number,
    created_at: String,
    utc_offset: Number,
    time_zone: String,
    geo_enabled: Boolean,
    lang: Boolean,
    contributors_enabled: Boolean,
    is_translator: Boolean,
    profile_background_color: String,
    profile_background_image_url: String,
    profile_background_image_url_https: String,
    profile_background_tile: Boolean,
    profile_link_color: String,
    profile_sidebar_border_color: String,
    profile_sidebar_fill_color: String,
    profile_text_color: String,
    profile_use_background_image: Boolean,
    profile_image_url: String,
    profile_image_url_https: String,
    profile_banner_url: String,
    default_profile: Boolean,
    default_profile_image: Boolean,
    following: String,
    follow_request_sent: String,
    notifications: String,
    inserted_at: String
});

var TweetCoordinates = mongoose.model('twitter_coordinates', {
    tweet_id: Number,
    tweet_id_str: String,
    long: String,
    lat: String    
});

var TweetUrls = mongoose.model('twitter_urls', {
    tweet_id: Number,
    tweet_id_str: String,
    url: String,
    expanded_url: String,
    display_url: String
});

var TweetHashtags = mongoose.model('twitter_hashtags', {
    tweet_id: Number,
    tweet_id_str: String,
    text: String
});

var TweetMentions = mongoose.model('twitter_mentions', {
    tweet_id: Number,
    tweet_id_str: String,
    screen_name: String,                                                                                                          
    name: String,                                                                                                                        
    id: Number,                                                                                                                             
    id_str: String
});

var TweetMedia = mongoose.model('twitter_medias', {
    tweet_id: Number,
    tweet_id_str: String,
    id: Number,
    id_str: String,
    media_url: String,
    media_url_https: String,
    url: String,
    display_url: String,
    expanded_url: String,
    type: String
});

var search_term = 'virginmedia';
var terms = search_term.split(',')
var i = 0;

var stream = T.stream('statuses/filter', { track: search_term });

stream.on('tweet', function (newtweet) {
    async.each(terms, function(term, callback) {
        t = newtweet.text.toLowerCase();
       
        if(t.indexOf(term) > -1) {
            //console.log(JSON.stringify(newtweet, 0, 4))
            if(newtweet.geo) {
                console.log('GEO --> ' + JSON.stringify(newtweet.geo));
            }
            if(newtweet.coordinates) {
                console.log('COORDINATES --> ' + JSON.stringify(newtweet.coordinates));
            }
                    
            //console.log(JSON.stringify(newtweet, 0, 4));
            SaveTweet(newtweet, term, function(err) {
                SaveTweetUser(newtweet.user, newtweet.id, newtweet.id_str, function(err) {
                    SaveTweetCoordinates(newtweet.coordinates, newtweet.id, newtweet.id_str, function(err) {
                        SaveTweetUrls(newtweet.entities.urls, newtweet.id, newtweet.id_str, function(err) {
                            SaveTweetHashtags(newtweet.entities.hashtags, newtweet.id, newtweet.id_str, function(err) {
                                SaveTweetMentions(newtweet.entities.user_mentions, newtweet.id, newtweet.id_str, function(err) {
                                    SaveTweetMedia(newtweet.entities.media, newtweet.id, newtweet.id_str, function(err) {
                                        i++;
                                        console.log(i + ' tweets saved!');                                        
                                        callback();
                                    });                                
                                });
                            });
                        });
                    });
                });
            });
            
        } else {
            callback();
        }

    }, function(err){
    });       
});

function SaveTweetUrls(urls, id, id_str, callback_main) {
    //console.log(urls.length + ' --> ' + JSON.stringify(urls));
    if(urls) {
        async.each(urls, function(url, callback) {
            var tweet_url = new TweetUrls ({
                tweet_id:       id,
                tweet_id_str:   id_str,
                url:            url.url,
                expanded_url:   url.expanded_url,
                display_url:    url.display_url
            });        

            tweet_url.save(function(err) {
                callback(); 
            });                        
        }, function(err){
            callback_main();
        });       
    } else {
        callback_main();
    }
}

function SaveTweetHashtags(hashtags, id, id_str, callback_main) {
    //console.log(JSON.stringify(hashtags));
    if(hashtags) {
        async.each(hashtags, function(hashtag, callback) {
            var tweet_hashtag = new TweetHashtags ({
                tweet_id:       id,
                tweet_id_str:   id_str,
                text:           hashtag.text
            });        

            tweet_hashtag.save(function(err) {
                callback(); 
            });                        
        }, function(err){
            callback_main();
        });
    } else {
        callback_main();
    }
}

function SaveTweetMentions(mentions, id, id_str, callback_main) {
    if(mentions) {
        async.each(mentions, function(mention, callback) {
            var tweet_mention = new TweetMentions ({
                tweet_id:       id,
                tweet_id_str:   id_str,
                screen_name:    mention.screen_name,
                name:           mention.name,
                id:             mention.id,
                id_str:         mention.id_str
            });        

            tweet_mention.save(function(err) {
                callback(); 
            });                        
        }, function(err){
            callback_main();
        });          
    } else {
        callback_main();
    }
}

function SaveTweetMedia(medias, id, id_str, callback_main) {
    if(medias) {
        async.each(medias, function(media, callback) {
            var tweet_media = new TweetMedia ({
                tweet_id:           id,
                tweet_id_str:       id_str,
                id:                 media.id,
                id_str:             media.id_str,
                media_url:          media.media_url,
                media_url_https:    media.media_url_https,
                url:                media.url,
                display_url:        media.display_url,
                expanded_url:       media.expanded_url,
                type:               media.type,
            });        

            tweet_media.save(function(err) {
                callback(); 
            });                        
        }, function(err){
            //console.log('media saved')
            callback_main();
        });    
    } else {
        callback_main();
    }
}

function SaveTweetCoordinates(coordinates, id, id_str, callback_main) {    
    if(coordinates) {
        var tweet_coordinates = new TweetCoordinates ({
            tweet_id:       id,
            tweet_id_str:   id_str,
            long:           coordinates.coordinates[0],
            lat:            coordinates.coordinates[1]
        });        

        tweet_coordinates.save(function(err) {
            console.log('coordinates saved')
            callback_main(); 
        });              
    } else {
        callback_main();
    }
}

function SaveTweetUser(user, id, id_str, callback_main) {
    var tweetUser = new TweetUser({
        id: user.id,
        id_str: user.id_str,
        name: user.name,
        screen_name: user.screen_name,
        location: user.location,
        url: user.url,
        description: user.description,
        protected: user.protected,
        verified: user.verified,
        followers_count: user.followers_count,
        friends_count: user.friends_count,
        listed_count: user.listed_count,
        favourites_count: user.favourites_count,
        statuses_count: user.statuses_count,
        created_at: user.created_at,
        utc_offset: user.utc_offset,
        time_zone: user.time_zone,
        geo_enabled: user.geo_enabled,
        lang: user.lang,
        contributors_enabled: user.contributors_enabled,
        is_translator: user.is_translator,
        profile_background_color: user.profile_background_color,
        profile_background_image_url: user.profile_background_image_url,
        profile_background_image_url_https: user.profile_background_image_url_https,
        profile_background_tile: user.profile_background_tile,
        profile_link_color: user.profile_link_color,
        profile_sidebar_border_color: user.profile_sidebar_border_color,
        profile_sidebar_fill_color: user.profile_sidebar_fill_color,
        profile_text_color: user.profile_text_color,
        profile_use_background_image: user.profile_use_background_image,
        profile_image_url: user.profile_image_url,
        profile_image_url_https: user.profile_image_url_https,
        profile_banner_url: user.profile_banner_url,
        default_profile: user.default_profile_image,
        default_profile_image: user.default_profile_image,
        following: user.following,
        follow_request_sent: user.follow_request_sent,
        notifications: user.notifications,
        inserted_at: user.created_at
    });      
    
    tweetUser.save(function (err) {
        if (err) console.log(error);
        callback_main();
    });    
}

function SaveTweet(newtweet, term, callback_main) {
    var tweet = new Tweet({ 
        id: newtweet.id,
        id_str: newtweet.id_str,
        text: newtweet.text,
        created_at: newtweet.created_at,
        search_term: term,
        source: newtweet.source,
        truncated: newtweet.truncated,
        in_reply_to_status_id: newtweet.in_reply_to_status_id,
        in_reply_to_status_id_str: newtweet.in_reply_to_status_id_str,
        in_reply_to_user_id: newtweet.in_reply_to_user_id,
        in_reply_to_user_id_str: newtweet.in_reply_to_user_id_str,
        in_reply_to_screen_name: newtweet.in_reply_to_screen_name,  
        retweet_count : newtweet.retweet_count,
        favorite_count: newtweet.favorite_count,
        favorited: newtweet.favorited,
        retweeted: newtweet.retweeted,
        possibly_sensitive: newtweet.possibly_sensitive,
        filter_level: newtweet.filter_level,
        lang: newtweet.lang,
        timestamp_ms: newtweet.timestamp_ms,    
        user_id: newtweet.user.id,
        user_id_str: newtweet.user.id_str,
        search_term: term
    });

    tweet.save(function (err) {
        if (err) console.log(error);
       callback_main();
    });
}    
