/*
UserContexts = new Mongo.Collection('userContexts');

UserContexts.allow({
    update: function(userId, doc, fieldNames) {
        return ownsDocument(userId, doc);
    }
});

createUserContext = function(userID) {
    console.log('createUserContext: userId: ' + userID);
    UserContexts.insert({
        userId: userID,
        lastPostListPath: ''
    });
};

Accounts.onCreateUser(function(options, user) {
    console.log('onCreateUser, userId: ' + user._id);
    // Generate a user ID ourselves
    if (!user._id || user._id === '')
        user._id = Random.id(); // Need to add the `random` package
    createUserContext(user._id);
    return user;
});
*/

// Deny all client-side updates to user documents
/*
Meteor.users.deny({
  update() { return true; }
});
*/

Meteor.users.deny({
    update: function(userId, user, fieldNames) {
        // 只能更改UserContexts字段：
        return (_.without(fieldNames, 'userContext').length > 0);
    }
});

Meteor.users.allow({
    update: function(userId, user, fieldNames) {
        return userId === Meteor.userId();
    },
});