ownsDocument = function(userId, doc) {
    console.log('ownsDocument: userId: ' + userId + ', doc.userId: ' + doc.userId);
    return doc && doc.userId === userId;
}

/*
urlRepeated = function(userId, doc) {
    console.log('urlRepeated: userId: ' + userId + ', doc.userId: ' + doc.userId);
    console.log('doc url: ' + doc.url + ", doc title: " + doc.title);

    var postWithSameLink = Posts.findOne({ url: doc.url });
    if (postWithSameLink) {
        console.log('url in database: ' + postWithSameLink.url + ", url from page: " + doc.url);
        return true;
    }
    return false;
}
*/
