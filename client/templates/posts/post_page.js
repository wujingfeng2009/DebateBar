Template.postPage.helpers({
    commentArgs: function(comment, column, needArrow) {
        //console.log('comment[: ' + comment._id + '] column: ' + column + 'need arrow: ' + needArrow);
        return {
            comment,
            column: column,
            needArrow: needArrow,
        };
    },
    comments: function() {
        Session.set('lastChainCommentId', '');
        Session.set('lastThreadCommentId', '');
        return Comments.find({ postId: this._id, parentId: '' });
    },
    oneColumnMode: function() {
        return Session.get('oneColumnMode');
    }
});