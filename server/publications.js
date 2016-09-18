Meteor.publish('topics', function(options) {
    check(options, {
        sort: Object,
        limit: Number
    });
    return Posts.find({postType: 0}, { sort: options.sort, limit: options.limit });
});

Meteor.publish('singleTopic', function(topicId) {
    check(topicId, String)
    console.log('single topic Id: ' + topicId + '!');
    var posts = Posts.find({_id: topicId, postType: 0});
    if (posts.count() === 0) {
        console.log('[publish-failed]', 'can not find any SingleTopic[' + topicId + ']!');
        return null;
    } else if (posts.count() > 1) {
        console.log('[publish-failed]', 'find more than one SingleTopic[' + topicId + '], that is impossible!');
        return null;
    }
    return posts;
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
        console.log('[publish-failed]', 'can not find comment by comment Id: ' + commentId + '!');
        return null;
    }
    console.log('comment post Id: ' + comment.postId + '!');
    return Comments.find({ postId: comment.postId, postType: comment.postType});
});

Meteor.publish('commentPost', function(commentId) {
    check(commentId, String);

    var comment = Comments.findOne(commentId);
    if (!comment) {
        console.log('can not find comment by comment Id: ' + commentId + '!');
        return null;
    }
    console.log('comment post Id: ' + comment.postId + '!');

    return Posts.find({ _id: comment.postId, postType: comment.postType});
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

// debates
Meteor.publish('debates', function(options) {
    check(options, {
        sort: Object,
        limit: Number
    });
    return Posts.find({postType: 1}, { sort: options.sort, limit: options.limit });
});

Meteor.publish('singleDebate', function(debateId) {
    check(debateId, String)
    console.log('single debate Id: ' + debateId + '!');
    return Posts.find({_id: debateId, postType: 1});
});

// predictions
Meteor.publish('predictions', function(options) {
    check(options, {
        sort: Object,
        limit: Number
    });
    return Posts.find({postType: 2}, { sort: options.sort, limit: options.limit });
});

Meteor.publish('singlePrediction', function(predictionId) {
    check(predictionId, String)
    console.log('single prediction Id: ' + predictionId + '!');
    return Posts.find({_id: predictionId, postType: 2});
});