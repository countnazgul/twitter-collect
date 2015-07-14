var express = require('express');
var app = express();
var config = require('./config')
var mongoose = require('mongoose');
var fs = require('fs');
var async = require('async');
var json2csv = require('json2csv');


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
    tweet_id: String,
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

var UrlsFields        = ['tweet_id', 'tweet_id_str', 'url','expanded_url','display_url'];
var MediaFields       = ['tweet_id', 'tweet_id_str', 'id_str', 'media_url', 'media_url_https', 'url', 'display_url', 'expanded_url', 'type']
var HashtagsFields    = ['tweet_id', 'tweet_id_str', 'text'];
var MentionsFields    = ['tweet_id', 'tweet_id_str', 'screen_name', 'name', 'id', 'id_str'];
var CoordinatesFields = ['tweet_id', 'tweet_id_str', 'long', 'lat'];
var UserFields        = ['id', 'id_str', 'name', 'screen_name', 'location', 'url', 'description', 'protected', 'verified', 'followers_count', 'friends_count', 'listed_count', 'favourites_count', 'statuses_count', 'created_at', 'utc_offset', 'time_zone', 'geo_enabled', 'lang', 'contributors_enabled', 'is_translator', 'profile_background_color', 'profile_background_image_url', 'profile_background_image_url_https', 'profile_background_tile', 'profile_link_color', 'profile_sidebar_border_color', 'profile_sidebar_fill_color', 'profile_text_color', 'profile_use_background_image', 'profile_image_url', 'profile_image_url_https', 'profile_banner_url', 'default_profile', 'default_profile_image','following','follow_request_sent','notifications','inserted_at'];
var TweetFields       = ['id', 'id_str', 'text', 'created_at', 'search_term', 'source', 'truncated', 'in_reply_to_status_id', 'in_reply_to_status_id_str', 'in_reply_to_user_id', 'in_reply_to_user_id_str', 'in_reply_to_screen_name', 'retweet_count', 'favorite_count', 'favorited', 'retweeted', 'possibly_sensitive', 'filter_level', 'lang', 'timestamp_ms', 'user_id', 'user_id_str'];

// var UrlsFieldsNames        = ['tweet_id_str', 'url','expanded_url','display_url'];
// var MediaFieldsNames       = ['tweet_id_str', 'media_id_str', 'media_url', 'media_url_https', 'media_url1', 'media_display_url', 'media_expanded_url', 'media_type']
// var HashtagsFieldsNames    = ['tweet_id_str', 'hashtag'];
// var MentionsFieldsNames    = ['tweet_id_str', 'mention_screen_name', 'mention_name', 'mention_id_str'];
// var CoordinatesFieldsNames = ['tweet_id_str', 'long', 'lat'];
// var UserFieldsNames        = ['user_id_str', 'user_name', 'user_screen_name', 'user_location', 'user_url', 'user_description', 'protected', 'verified', 'followers_count', 'friends_count', 'listed_count', 'favourites_count', 'statuses_count', 'user_created_at', 'utc_offset', 'time_zone', 'geo_enabled', 'user_lang', 'contributors_enabled', 'is_translator', 'profile_background_color', 'profile_background_image_url', 'profile_background_image_url_https', 'profile_background_tile', 'profile_link_color', 'profile_sidebar_border_color', 'profile_sidebar_fill_color', 'profile_text_color', 'profile_use_background_image', 'profile_image_url', 'profile_image_url_https', 'profile_banner_url', 'default_profile', 'default_profile_image','following','follow_request_sent','notifications','user_inserted_at'];
// var TweetFieldsNames       = ['tweet_id', 'tweet_id_str', 'tweet', 'tweet_created_at', 'search_term', 'source', 'truncated', 'in_reply_to_status_id', 'in_reply_to_status_id_str', 'in_reply_to_user_id', 'in_reply_to_user_id_str', 'in_reply_to_screen_name', 'retweet_count', 'favorite_count', 'favorited', 'retweeted', 'possibly_sensitive', 'filter_level', 'tweet_lang', 'timestamp_ms', 'user_id', 'user_id_str'];

      
app.get('/:type', function (req, res) {
    var type = req.params.type;
    
    //console.log(fields);
    //console.log(TweetMentions);
    
    if(type == 'media') {
        var t = TweetMedia;
        var fields = MediaFields;
        //var fieldsName = MediaFieldsNames;
    } else if(type == 'urls') {
        var t = TweetUrls;
        var fields = UrlsFields;
        //var fieldsName = UrlsFieldsNames;
    }  else if(type == 'tweet') {
        var t = Tweet;
        var fields = TweetFields;
        //var fieldsName = TweetFieldsNames;
    } else if(type == 'user') {
        var t = TweetUser;
        var fields = UserFields;
        //var fieldsName = UserFieldsNames;
    } else if(type == 'coordinate') {
        var t = TweetCoordinates;
        var fields = CoordinatesFields;
        //var fieldsName = CoordinatesFieldsNames;
    } else if(type == 'hashtag') {
        var t = TweetHashtags;
        var fields = HashtagsFields;
        //var fieldsName = HashtagsFieldsNames;
    } else if(type == 'mention') {
        var t = TweetMentions;
        var fields = MentionsFields;
        //var fieldsName = MentionsFieldsNames;
    } else {
        //error
    }
    

    t.find({}, function(err, documents) {
            json2csv( {   data: JSON.parse(JSON.stringify(documents)), fields: fields/*, fieldNames: fieldsName*/ }, function(err, csv) {  
                if (err) console.log(err);
                res.send(csv)
        });
    })          
});


var server = app.listen(8001, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Server listening at http://%s:%s', host, port)
}) 
