Comments = new Mongo.Collection('comments');

Meteor.methods({
    commentInsert: function(commentAttributes) {
        check(this.userId, String);
        check(commentAttributes, {
            postId: String,
            chainHeadId: String,
            parentId: String,
            body: String,
            side: Number
        });

        var user = Meteor.user();
        var post = Posts.findOne(commentAttributes.postId);

        if (!post)
            throw new Meteor.Error('invalid-comment', 'You must comment on a post');

        comment = _.extend(commentAttributes, {
            userId: user._id,
            author: user.username,
            childCount: 0,
            childTotal: 0,
            submitted: new Date()
        });

        // 更新帖子的评论数
        Posts.update(comment.postId, { $inc: { commentsCount: 1 } });
        //
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

        // now create a notification, informing the user that there's been a comment
        createCommentNotification(comment);

        return comment._id;
    }
});