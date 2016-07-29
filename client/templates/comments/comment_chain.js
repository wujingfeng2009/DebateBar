Template.commentChain.helpers({
    commentArgs: function(comment, column, needArrow) {
        //console.log('comment[: ' + comment._id + '] column: ' + column + 'need arrow: ' + needArrow);
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
            //console.log('column: ' + column + ', child side: ' + child.side);
            if (child.side === column) {
                columnHasChildren = true;
            }
        });

        if (Meteor.user() && (columnHasChildren || column !== this.chainComment.side) )
            return true;
        return false;
    },
    childComments: function() {
        //console.log('parent comment Id: ' + this.chainComment._id + '!');
        return Comments.find({ parentId: this.chainComment._id }, {sort: { childTotal: -1, submitted: -1 }});
    },
    commentList: function() {
        var context = new Array();
        Session.set('lastChainCommentId', this.chainComment._id);
        Session.set('lastThreadCommentId', '');

        var parent = Comments.findOne(this.chainComment._id);
        while (parent) {
            console.log('push parent[' + parent._id + ']: ' + parent.body);
            parent.needArrow = true; // for arrows
            context.push(parent);
            if (parent.parentId === '')
                break;

            var siblingsArray = Comments.find({ parentId: parent.parentId }, {sort: { childTotal: -1, submitted: -1} }).fetch();
            if (siblingsArray && siblingsArray.length > 0) {
                console.log("siblingsArray lenght: " + siblingsArray.length);
                var parentIndex = siblingsArray.findIndex( function (sibling, index, array) {
                    if (sibling._id === parent._id) {
                        console.log("found parent in siblingsArray[" + index + "]: " + sibling.body);
                        return true;
                    }
                    return false;
                });
                console.log("remove siblings from parentIndex[" + parentIndex + "] on.");
                siblingsArray.splice(parentIndex);
                console.log("now siblingsArray lenght: " + siblingsArray.length);
            }

            if (siblingsArray) {
                siblingsArray.reverse();
                console.log("context lenght: " + context.length);
                context = context.concat(siblingsArray);
                console.log("after concat siblingsArray, context lenght: " + context.length);
            }

            parent = Comments.findOne(parent.parentId);
        }

        context.reverse();
        return context;
    },
    parentPost: function() {
        return Posts.findOne(this.chainComment.postId);
    }
});