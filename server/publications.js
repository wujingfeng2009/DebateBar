Meteor.publish('posts', function(options) {
    check(options, {
        sort: Object,
        limit: Number
    });
    return Posts.find({}, { sort: options.sort, limit: options.limit });
});

Meteor.publish('singlePost', function(id) {
    check(id, String)
    console.log('single post Id: ' + id + '!');
    return Posts.find(id);
});

Meteor.publish('comments', function(postId) {
    check(postId, String);
    return Comments.find({ postId: postId });
});

Meteor.publish('singleComment', function(commentId) {
    check(commentId, String);
    return Comments.find(commentId);
});

Meteor.publish('commentsTree', function(commentId) {
    check(commentId, String);
    var comment = Comments.findOne(commentId);
    if (!comment) {
        console.log('can not find comment from comment Id: ' + commentId + '!');
        return null;
    }
    console.log('comment parent post Id: ' + comment.postId + '!');
    return Comments.find({ postId: comment.postId});
});

Meteor.publish('commentParentPost', function(commentId) {
    check(commentId, String)
    var comment = Comments.findOne(commentId);
    if (!comment) {
        console.log('can not find comment from comment Id: ' + commentId + '!');
        return null;
    }
    console.log('comment parent post Id: ' + comment.postId + '!');
    return Posts.find(comment.postId);
});

Meteor.publish('notifications', function() {
    return Notifications.find({ userId: this.userId, read: false });
});