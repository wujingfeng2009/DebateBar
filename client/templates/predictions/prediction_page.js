Template.predictionPage.helpers({
    comments: function() {
        //Session.set('lastChainCommentId', '');
        //Session.set('lastThreadCommentId', '');
        return Comments.find({ postId: this._id, parentId: '' });
    }
});