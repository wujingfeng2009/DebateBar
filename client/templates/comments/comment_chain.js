Template.commentChain.helpers({
    childComments: function() {
        //console.log('parent comment Id: ' + this.chainComment._id + '!');
        return Comments.find({ parentId: this.chainComment._id, postType: this.chainComment.postType }, {sort: { childTotal: -1, submitted: -1 }});
    },
    commentsList: function() {
        var context = new Array();
        Session.set('lastChainCommentId', this.chainComment._id);
        Session.set('lastThreadCommentId', '');

        var showSiblingsMode = Session.get('showSiblingsMode');
        var parent = this.chainComment;
        var hasChild = Comments.find({ parentId: parent._id, postType: parent.postType }, {sort: { childTotal: -1, submitted: -1}}).count() && true;
        while (parent) {
            //console.log('push parent[' + parent._id + ']: ' + parent.body);
            if (parent._id === this.chainComment._id) {
                if (hasChild)
                    parent.needArrow = true; // for arrows
            } else
                parent.needArrow = true; // for arrows

            context.push(parent);
            if (parent.parentId === '')
                break;

            if (showSiblingsMode) {
                var siblingsArray = Comments.find({ parentId: parent.parentId, postType: parent.postType }, {sort: { childTotal: -1, submitted: -1} }).fetch();
                if (siblingsArray && siblingsArray.length > 0) {
                    //console.log("siblingsArray lenght: " + siblingsArray.length);
                    var parentIndex = siblingsArray.findIndex( function (sibling, index, array) {
                        if (sibling._id === parent._id) {
                            //console.log("found parent in siblingsArray[" + index + "]: " + sibling.body);
                            return true;
                        }
                        return false;
                    });
                    //console.log("remove siblings from parentIndex[" + parentIndex + "] on.");
                    siblingsArray.splice(parentIndex);
                    //console.log("now siblingsArray lenght: " + siblingsArray.length);
                }

                if (siblingsArray) {
                    siblingsArray.reverse();
                    //console.log("context lenght: " + context.length);
                    context = context.concat(siblingsArray);
                    //console.log("after concat siblingsArray, context lenght: " + context.length);
                }
            }

            parent = Comments.findOne({_id: parent.parentId, postType: parent.postType });
        }

        context.reverse();
        this.tailComment = context[context.length - 1];
        return context;
    },
    childrenCommentSide: function() {
        return this.chainComment.side === 0 ? 1 : 0;
    },
    parentPost: function() {
        var parentPost = Posts.findOne(this.chainComment.postId);
        if (!parentPost || parentPost.postType !== this.chainComment.postType)
            throw new Meteor.Error('invalid-parentPost', 'comment must have the same postType as its parent Post has!');
        return parentPost;
    },
    getTemplate: function() {
        if (this.chainComment.postType === 0)
            return 'topicItem';
        else if (this.chainComment.postType === 1)
            return 'debateItem';
        else if (this.chainComment.postType === 2)
            return 'predictionItem';
        else if (this.chainComment.postType === 3)
            return 'betItem';

        throw new Meteor.Error('invalid-comment', 'Your comment do not have a valid postType!');
    }
});