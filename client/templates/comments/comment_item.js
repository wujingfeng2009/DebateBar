Template.commentItem.helpers({
    submittedText: function() {
        return this.comment.submitted.toString();
    },
    visibleDisallowed: function() {
        //console.log('column: ' + this.column + ', side: ' + this.comment.side);
        if (this.column === 'none')
            return false;
        if (this.column === 'left' && this.comment.side === 0)
            return false ;
        if (this.column === 'right' && this.comment.side === 1)
            return false ;
        return true;
    },
    commentChainPath: function() {
        var lastChainCommentId = Session.get('lastChainCommentId');
        var lastThreadCommentId = Session.get('lastThreadCommentId');
        //console.log("jimvon in commentChainPath, lastChainCommentId: " + lastChainCommentId);
        if (lastThreadCommentId) {
            if (this.comment.parentId !== '')
                return Router.routes.commentChain.path({ _id: this.comment.parentId});
            else {
                return Router.routes.postPage.path({ _id: this.comment.postId});
            }
        }

        if (lastChainCommentId) {
            return Router.routes.commentThread.path({ _id: this.comment._id});
        }

        return Router.routes.commentThread.path({ _id: this.comment._id});
    },
    childCount: function() {
        //return Comments.find({ parentId: this.comment._id }).count();
        return this.comment.childCount;
    },
    childTotalCount: function() {
        return this.comment.childTotal;
    },
    arrowDirection: function() {
        if (this.column === 'left')
            return 'rightArrow';
        if (this.column === 'right')
            return 'leftArrow';
        return '';
    },
    arrowNeeded: function() {
        return this.needArrow  && this.comment.needArrow;
    },
    columnSide: function() {
        if (this.column === 'left')
            return 'leftColumn';
        if (this.column === 'right')
            return 'rightColumn';
        return '';
    }
});