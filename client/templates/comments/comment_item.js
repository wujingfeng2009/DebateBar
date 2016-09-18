Template.commentItem.onCreated( function () {
    this.state = new ReactiveDict();
    this.state.setDefault({
    submitFormOpen: false,
    reportFormOpen: false,
    });
});

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
                else {
                    if (this.comment.postType === 0)
                        return Router.routes.topicPage.path({ _id: this.comment.postId});
                    else if (this.comment.postType === 1)
                        return Router.routes.debatePage.path({ _id: this.comment.postId});
                    else if (this.comment.postType === 2)
                        return Router.routes.predictionPage.path({ _id: this.comment.postId});
                    else if (this.comment.postType === 3)
                        return Router.routes.betPage.path({ _id: this.comment.postId});
                    else
                        throw new Meteor.Error('invalid-comment', 'Your comment do not have a valid postType!');
                }
            }
            else {
                if (this.comment.childCount === 0)
                    return '#';
                else
                    return Router.routes.commentChain.path({ _id: this.comment._id});
            }
        }
        // commentThreadMode
        if (lastThreadCommentId) {
            if (this.comment.parentId !== '')
                return Router.routes.commentChain.path({ _id: this.comment.parentId});
            else  {
                if (this.comment.postType === 0)
                    return Router.routes.topicPage.path({ _id: this.comment.postId});
                else if (this.comment.postType === 1)
                    return Router.routes.debatePage.path({ _id: this.comment.postId});
                else if (this.comment.postType === 2)
                    return Router.routes.predictionPage.path({ _id: this.comment.postId});
                else if (this.comment.postType === 3)
                    return Router.routes.betPage.path({ _id: this.comment.postId});
                else
                    throw new Meteor.Error('invalid-comment', 'Your comment do not have a valid postType!');
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
        //console.log("needAlign: " + this.needAlign+ ", align side: " + this.comment.side);
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
    },
    needSubmit: function() {
        const instance = Template.instance();
        return instance.state.get('submitFormOpen');
    },
    showLoginPrompt: function() {
        throwError("Please log in to leave a comment!");
        //alert("Please log in to leave a comment!");
    },
    canDelete: function() {
        var children = Comments.find({ parentId: this.comment._id }).count();
        return this.comment.userId === Meteor.userId() && children === 0;
    },
});

Template.commentItem.events({
    'click .submit-toggle': function(e, instance) {
        instance.state.set('submitFormOpen', !instance.state.get('submitFormOpen'));
        e.preventDefault();
    },
    'click .delete-comment': function(e, instance) {
        e.preventDefault();

        if (this.comment.userId != Meteor.userId()) {
            console.log('jimvon this.userId: ' + this.userId + 'Meteor.userId: ' + Meteor.userId());
            throwError('invalid user, delete denied!');
            return;
        }
        var children = Comments.find({ parentId: this.comment._id }).count();
        if (children > 0) {
            throwError('can not delete a comment that have sub-comments, delete denied!');
            return;
        }

        if (confirm("Delete this comment?")) {
            var nextPath = null;
            var lastChainCommentId = Session.get('lastChainCommentId');
            if (this.comment.parentId === '') {
                if (this.comment.postType === 0)
                    nextPath = Router.routes.topicPage.path({ _id: this.comment.postId });
                else if (this.comment.postType === 1)
                    nextPath = Router.routes.debatePage.path({ _id: this.comment.postId });
                else if (this.comment.postType === 2)
                    nextPath = Router.routes.predictionPage.path({ _id: this.comment.postId});
                else if (this.comment.postType === 3)
                    nextPath = Router.routes.betPage.path({ _id: this.comment.postId});
                else
                    throw new Meteor.Error('invalid-comment', 'comment with a valid postType!');
            } else if (lastChainCommentId && lastChainCommentId === this.comment._id) {
                nextPath = Router.routes.commentChain.path({ _id: this.comment.parentId});
            }

            if (nextPath)
                Router.go(nextPath);

            //Comments.remove(this.comment._id);
            Meteor.call('commentRemove', this.comment._id);

        }
    }
});