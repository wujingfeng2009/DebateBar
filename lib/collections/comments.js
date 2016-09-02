Comments = new Mongo.Collection('comments');

Meteor.methods({
    commentInsert: function(commentAttributes) {
        check(this.userId, String);
        check(commentAttributes, {
            postType: Number,
            postId: String,
            chainHeadId: String,
            parentId: String,
            body: String,
            side: Number
        });

        var user = Meteor.user();
        var post = null;
        if (commentAttributes.postType === 0)
            post = Posts.findOne(commentAttributes.postId);
        else if (commentAttributes.postType === 1)
            post = Debates.findOne(commentAttributes.postId);
        else if (commentAttributes.postType === 2)
            post = Debates.findOne(commentAttributes.postId);
        else if (commentAttributes.postType === 3)
            post = Debates.findOne(commentAttributes.postId);
        else
            throw new Meteor.Error('invalid-comment', 'comment must have a postType!');

        if (!post)
            throw new Meteor.Error('invalid-comment', 'comment must be attached on a postType!');

        comment = _.extend(commentAttributes, {
            userId: user._id,
            author: user.username,
            childCount: 0,
            childTotal: 0,
            submitted: new Date()
        });

        // 更新帖子的评论数
        if (comment.postType === 0)
            Posts.update(comment.postId, { $inc: { commentsCount: 1 } });
        else if (comment.postType === 1)
            Debates.update(comment.postId, { $inc: { commentsCount: 1 } });
        else if (comment.postType === 2)
            Debates.update(comment.postId, { $inc: { commentsCount: 1 } });
        else if (comment.postType === 3)
            Debates.update(comment.postId, { $inc: { commentsCount: 1 } });
        else
            throw new Meteor.Error('invalid-comment', 'comment must have a postType!');

        // update comment child count and total child count.
        var parent = Comments.findOne(comment.parentId);
        if (parent) {
            Comments.update(parent._id, { $inc: { childCount: 1 } });

            while (parent) {
                console.log('update childTotal of parent: ' + parent._id);
                Comments.update(parent._id, { $inc: { childTotal: 1 } });
                parent = Comments.findOne(parent.parentId);
            }

        }

        // create the comment, save the id
        comment._id = Comments.insert(comment);

        if (comment.chainHeadId === '') {
            Comments.update(comment._id, { $set: {chainHeadId: comment._id} });
        }
        // now create a notification, informing the user that there's been a comment
        createCommentNotification(comment);

        return comment._id;
    },

    commentRemove: function(commentId) {
        check(this.userId, String);
        check(commentId, String);

        var user = Meteor.user();
        var comment = Comments.findOne(commentId);
        var children = Comments.find({ parentId: commentId }).count();

        if (!comment)
            throw new Meteor.Error('delete operation denied', 'can not find this comment!');
        else if (comment.userId !== user._id)
            throw new Meteor.Error('delete operation denied', 'have no permission!');
        else if (children > 0)
            throw new Meteor.Error('delete operation denied', 'can not delete a comment that have sub-comments!');

        // 更新帖子的评论数
        if (comment.postType === 0)
            Posts.update(comment.postId, { $inc: { commentsCount: -1 } });
        else if (comment.postType === 1)
            Debates.update(comment.postId, { $inc: { commentsCount: -1 } });
        else if (comment.postType === 2)
            Debates.update(comment.postId, { $inc: { commentsCount: -1 } });
        else if (comment.postType === 3)
            Debates.update(comment.postId, { $inc: { commentsCount: -1 } });
        else
            throw new Meteor.Error('invalid-comment', 'comment must have a postType!');

        // update comment child count and total child count.
        var parent = Comments.findOne(comment.parentId);
        if (parent) {
            Comments.update(parent._id, { $inc: { childCount: -1 } });

            while (parent) {
                console.log('update childTotal of parent: ' + parent._id);
                Comments.update(parent._id, { $inc: { childTotal: -1 } });
                parent = Comments.findOne(parent.parentId);
            }

        }

        // remove the comment
        Comments.remove(commentId);
    }
});