createUserContext = function(user) {
    console.log('createUserContext: userId: ' + user._id);
    user.userContext = {
        lastPostListPath: '',
    };
};

Accounts.onCreateUser(function(options, user) {
    console.log('onCreateUser, userId: ' + user._id);
    // Generate a user ID ourselves
    if (!user._id || user._id === '')
        user._id = Random.id(); // Need to add the `random` package
    createUserContext(user);
    return user;
});

Accounts.onLogin(function() {
    console.log('jimvon onLogin, user name: ' + Meteor.userId());
});

Accounts.onLogout(function() {
    console.log('jimvon onLogout, user name: ' + Meteor.userId());
});

/*
Meteor.publish('Meteor.users.initials', function ({ userIds }) {
  // Validate the arguments to be what we expect
  new SimpleSchema({
    userIds: { type: [String] }
  }).validate({ userIds });

  // Select only the users that match the array of IDs passed in
  const selector = {
    _id: { $in: userIds }
  };

  // Only return one field, `initials`
  const options = {
    fields: { initials: 1 }
  };

  return Meteor.users.find(selector, options);
});
*/