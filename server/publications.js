Meteor.publish('posts', function() {
    //return Posts.find({flagged: false}); 
    return Posts.find();
});

Meteor.publish('comments', function() {
    return Comments.find();
});