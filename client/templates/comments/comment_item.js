Template.commentItem.helpers({
    submittedText: function() {
        return this.comment.submitted.toString();
    },
    commentChainPath: function() {
        var commentThreadMode = Session.get('commentThreadMode');

        var lastChainCommentId = Session.get('lastChainCommentId');
        var lastThreadCommentId = Session.get('lastThreadCommentId');
        //console.log("jimvon in commentChainPath, lastChainCommentId: " + lastChainCommentId);
        if (!commentThreadMode) {
            if (lastChainCommentId === this.comment._id) {
                if (this.comment.parentId !== '')
                    return Router.routes.commentChain.path({ _id: this.comment.parentId});
                else
                    return Router.routes.postPage.path({ _id: this.comment.postId});
            }
            return Router.routes.commentChain.path({ _id: this.comment._id});
        }

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
        return this.comment.childCount;
    },
    childTotalCount: function() {
        return this.comment.childTotal;
    },
    arrowNeeded: function() {
        return this.comment.needArrow;
    },
    arrowDirection: function() {
        if (!this.needAlign)
            return '';
        if (this.comment.side === 0)
            return 'rightArrow';
        if (this.comment.side === 1)
            return 'leftArrow';
        return '';
    },
    iconsNeeded: function() {
        return this.comment.needArrow;
    },
    iconSide: function() {
        if (!this.needAlign)
            return '';
        if (this.comment.side === 0)
            return 'rightIcon';
        if (this.comment.side === 1)
            return 'leftIcon';
        return '';
    },
    alignment: function() {
        console.log("needAlign: " + this.needAlign+ ", align side: " + this.comment.side);
        if (this.needAlign) {
            if (this.comment.side === 0)
                return 'alignLeft';
            if (this.comment.side === 1)
                return 'alignRight';
        }
        return '';
    },
    timeline: function() {
        if (!this.needAlign)
            return '';
        if (this.comment._id === this.comment.chainHeadId)
            return '';
        if (this.comment.side === 0)
            return 'timelineLeft';
        if (this.comment.side === 1)
            return 'timelineRight';
        return '';
    }
});