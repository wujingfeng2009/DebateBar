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

Meteor.publish('postComments', function(postId) {
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
    return Comments.find({ postId: comment.postId, postType: comment.postType});
});

Meteor.publish('commentParentPost', function(commentId) {
    check(commentId, String);

    var comment = Comments.findOne(commentId);
    if (!comment) {
        console.log('can not find comment from comment Id: ' + commentId + '!');
        return null;
    }
    console.log('comment parent post Id: ' + comment.postId + '!');

    if (comment.postType === 0)
        return Posts.find(comment.postId);
    else if (comment.postType === 1)
        return Debates.find(comment.postId);
    else if (comment.postType === 2)
        return Debates.find(comment.postId);
    else if (comment.postType === 3)
        return Debates.find(comment.postId);

    throw new Meteor.Error('invalid-comment', 'Your comment do not have a valid postType!');
});

Meteor.publish('notifications', function() {
    return Notifications.find({ userId: this.userId, read: false });
});

Meteor.publish('Meteor.users.userContext', function (userId) {
    check(userId, String);

    // Only return one field, `userContext`
    const options = {
    fields: { userContext: 1 }
    };

  return Meteor.users.find(userId, options);
});

Meteor.publish('debates', function(options) {
    check(options, {
        sort: Object,
        limit: Number
    });
    return Debates.find({}, { sort: options.sort, limit: options.limit });
});

Meteor.publish('singleDebate', function(id) {
    check(id, String)
    console.log('single post Id: ' + id + '!');
    return Debates.find(id);
});