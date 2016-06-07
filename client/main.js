/*
Meteor.subscribe('posts', 'Meteor');
Tracker.autorun(function() {
  alert(Session.get('pageTitle'));
});
*/

Meteor.startup(function() {
  Tracker.autorun(function() {
    console.log('There are fucking ' + Posts.find().count() + ' posts');
  });
});