/*
Meteor.subscribe('posts', 'Meteor');
Tracker.autorun(function() {
  alert(Session.get('pageTitle'));
});
*/

Meteor.startup(function() {
    Tracker.autorun(function() {
        //console.log('There are fucking ' + Posts.find().count() + ' posts');
        //console.log('There are fucking ' + Comments.find().count() + ' comments');
        //console.log('There are fucking ' + Posts.find().count() + ' posts');
        console.log('enableing  commentThreadMode!');
        Session.set('commentThreadMode', false);
        Session.set('animationMode', false);
        Session.set('showSiblingsMode', true);
        Session.set('oneColumnMode', false);
    });
});