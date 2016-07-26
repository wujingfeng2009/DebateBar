Template.commentChain.helpers({
    commentArgs: function(comment, column, needArrow) {
        console.log('comment[: ' + comment._id + '] column: ' + column + 'need arrow: ' + needArrow);
        return {
            comment,
            column: column,
            needArrow: needArrow,
        };
    },
    needCommentChainSubmit: function(column) {
        var children = Comments.find({ parentId: this.chainComment._id });
        var columnHasChildren = false;
        children.forEach(function (child) {
            console.log('column: ' + column + ', child side: ' + child.side);
            if (child.side === column) {
                columnHasChildren = true;
            }
        });

        if (Meteor.user() && (columnHasChildren === true || column !== this.chainComment.side) )
            return true;
        return false;
    },
    childComments: function() {
        console.log('parent comment Id: ' + this.chainComment._id + '!');
        return Comments.find({ parentId: this.chainComment._id });
    },
    commentList: function() {
        var context = new Array();
        console.log('push self: ' + this.chainComment._id + ', parent: ' + this.chainComment.parentId);
        context.push(this.chainComment);
        var parent = Comments.findOne(this.chainComment.parentId);

        while (parent) {
            console.log('push parent: ' + parent._id  + ', grandparent: ' + parent.parentId);
            context.push(parent);
            parent = Comments.findOne(parent.parentId);
        }

        context.reverse();
        return context;
    },
    parentPost: function() {
        return Posts.findOne(this.chainComment.postId);
    }
});