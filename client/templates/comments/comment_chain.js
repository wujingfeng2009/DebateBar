Template.commentChain.helpers({
    childComments: function() {
        console.log('parent comment Id: ' + this._id + '!');
        return Comments.find({ parentId: this._id });
    },
    commentContextList: function() {
        return commentContextsSorted();
    },
    parentPost: function() {
        return Posts.findOne(this.postId);
    }
});