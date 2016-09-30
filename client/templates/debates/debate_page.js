Template.debatePage.helpers({
    comments: function() {
        Session.set('lastChainCommentId', '');
        Session.set('lastThreadCommentId', '');
        return Comments.find({ postId: this._id, parentId: '' });
    },
    positiveStandpoints: function() {
        Session.set('lastChainCommentId', '');
        Session.set('lastThreadCommentId', '');
        return Comments.find({ postId: this._id, parentId: '', side: 0 });
    },
    negativeStandpoints: function() {
        return Comments.find({ postId: this._id, parentId: '', side: 1 });
    }
});