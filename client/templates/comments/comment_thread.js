Template.commentThread.helpers({
    commentsList: function() {
        var parent = null;
        var context = new Array();
        Session.set('lastThreadCommentId', this.threadComment._id);
        Session.set('lastChainCommentId', '');

        var showSiblingsMode = Session.get('showSiblingsMode');
        parent = Comments.findOne(this.threadComment._id);
        while (parent != null) {
            console.log('push parent[' + parent._id + ']: ' + parent.body + ', parentId:' + parent.parentId);
            parent.needArrow = true; // for arrows
            context.push(parent);
            //console.log("context lenght 1: " + context.length);
            if (parent.parentId == null || parent.parentId === '')
                break;

            //console.log('showSiblingsMode: ' + showSiblingsMode);
            if (showSiblingsMode) {
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
                    siblingsArray.splice(parentIndex);

                    if (siblingsArray) {
                        siblingsArray.reverse();
                        context = context.concat(siblingsArray);
                    }
                }
            }

            parent = Comments.findOne(parent.parentId);
        }

        context.reverse();

        var childArray = Comments.find({ parentId: this.threadComment._id }, {sort: { childTotal: -1, submitted: -1 }, limit: 1}).fetch();
        while (childArray && childArray.length > 0) {
            //console.log('childArray lenght: ' + childArray.length);
            childArray.splice(1); // just keep the first element. 
            //console.log("after slice, now childArray lenght: " + childArray.length);
            //console.log("childArray[0]: " + childArray[0].body);

            var children = Comments.find({ parentId: childArray[0]._id }, {sort: { childTotal: -1, submitted: -1 }, limit: 1}).fetch();
            //if (children && children.length > 0) {
                //console.log('childArray lenght 2: ' + children.length);
                childArray[0].needArrow = true; // for arrows
                //console.log("children[0]: " + children[0].body);
            //}

            //console.log("context lenght 3: " + context.length);
            context = context.concat(childArray);
            //console.log("after push child, now context lenght: " + context.length);
            childArray.length = 0;
            childArray = children;
        }

        this.lastCommentSide = context[context.length - 1].side;
        return context;
    },
    parentPost: function() {
        return Posts.findOne(this.threadComment.postId);
    }
});