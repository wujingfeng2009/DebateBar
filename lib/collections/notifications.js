Notifications = new Mongo.Collection('notifications');

Notifications.allow({
    update: function(userId, doc, fieldNames) {
        return ownsDocument(userId, doc) &&
            fieldNames.length === 1 && fieldNames[0] === 'read';
    }
});

createCommentNotification = function(comment) {
    console.log('createCommentNotification: comment.userId: ' + comment.userId + ', comment.postId: ' + comment.postId);
    var post = Posts.findOne(comment.postId);
    console.log('createCommentNotification: post.userId: ' + post.userId);
    if (comment.userId !== post.userId) {
        console.log('createCommentNotification: add a notification by : ' + post.userId);
        Notifications.insert({
            userId: post.userId,
            postId: post._id,
            postType: post.postType,
            commentId: comment._id,
            commenterName: comment.author,
            read: false
        });
    }
};