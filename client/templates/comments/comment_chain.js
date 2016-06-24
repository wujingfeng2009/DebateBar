Template.commentChain.helpers({
    comments: function() {
        return Comments.find({ _id: this._id });
    }
});