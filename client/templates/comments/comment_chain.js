Template.commentChain.helpers({
    commentArgs: function(comment, align, needArrow) {
        console.log('comment[: ' + comment._id + '] align: ' + align + 'need arrow: ' + needArrow);
        return {
            comment,
            align: align,
            needArrow: needArrow,
        };
    },
    childComments: function() {
        console.log('parent comment Id: ' + this._id + '!');
        return Comments.find({ parentId: this._id });
    },
    shouldSubmitComment: function(column) {
        var children = Comments.find({ parentId: this._id });
        var columnHasChildren = false;
        children.forEach(function (child) {
            console.log('column: ' + column + ', child side: ' + child.side);
            if (child.side === column) {
                columnHasChildren = true;
            }
        });

        if (Meteor.user() && columnHasChildren)
            return true;
        return false;
    },
    commentList: function() {
        var context = new Array();
        console.log('push self: ' + this._id + ', parent: ' + this.parentId);
        context.push(this);
        var parent = Comments.findOne(this.parentId);

        while (parent) {
            console.log('push parent: ' + parent._id  + ', grandparent: ' + parent.parentId);
            context.push(parent);
            parent = Comments.findOne(parent.parentId);
        }

        context.reverse();
        return context;
    },
    parentPost: function() {
        return Posts.findOne(this.postId);
    }
});