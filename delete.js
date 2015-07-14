var express = require('express');
var app = express();
var config = require('./config')
var mongoose = require('mongoose');

mongoose.connect(config.mongoose.url);

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

var TweetMedia = mongoose.model('twitter_media', {
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

Tweet.remove({}, function(err) {
    TweetUser.remove({}, function(err) {
        TweetCoordinates.remove({}, function(err) {
            TweetUrls.remove({}, function(err) {
                TweetHashtags.remove({}, function(err) {
                    TweetMentions.remove({}, function(err) {
                        TweetMedia.remove({}, function(err) {
                            console.log('deleted');
                        })
                    });
                });
            });
        });
    });    
});
