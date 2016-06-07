/*
Meteor.publish("posts", function() {
    return Posts.find();
});
*/

Meteor.publish('posts', function() {
  //return Posts.find({flagged: false}); 
  return Posts.find(); 
});