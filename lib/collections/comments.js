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
        if (commentAttributes.postType < 0 || commentAttributes.postType > 3)
            throw new Meteor.Error('invalid-comment', 'comment with an invalid postType: ' + commentAttributes.postType + '.');

        var post = Posts.findOne(commentAttributes.postId);

        if (!post)
            throw new Meteor.Error('invalid-comment', 'comment must be attached on a post!');
        if (post.postType !== commentAttributes.postType)
            throw new Meteor.Error('invalid-comment', 'comment must have the same postType that the post has!');

        comment = _.extend(commentAttributes, {
            userId: user._id,
            author: user.username,
            childCount: 0,
            childTotal: 0,
            submitted: new Date()
        });

        // 更新帖子的评论数
        Posts.update(comment.postId, { $inc: { commentsCount: 1 } });

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
        var children = Comments.find({ parentId: commentId, postType: comment.postType }).count();

        if (!comment)
            throw new Meteor.Error('delete-denied', 'can not find this comment!');
        else if (comment.userId !== user._id)
            throw new Meteor.Error('delete -denied', 'have no permission!');
        else if (children > 0)
            throw new Meteor.Error('delete-denied', 'can not delete a comment that have sub-comments!');

        if (comment.postType < 0 || comment.postType > 3)
            throw new Meteor.Error('delete-denied', 'comment with an invalid postType: ' + comment.postType + '.');

        // 更新帖子的评论数
        var post = Posts.findOne({ _id: comment.postId, postType: comment.postType });
        if (!post)
            throw new Meteor.Error('delete-denied', 'comment must be attached on a post!');
        if (post.postType !== comment.postType)
            throw new Meteor.Error('delete-denied', 'comment must have the same postType that the post has!');

        Posts.update(comment.postId, { $inc: { commentsCount: -1 } });

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