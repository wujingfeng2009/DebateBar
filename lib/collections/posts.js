Posts = new Mongo.Collection('posts');

Posts.allow({
    /*
    insert: function(userId, doc) { return !! userId; },
    update: function(userId, post) {
        return ownsDocument(userId, post);
    },
*/
    remove: function(userId, post) {
        return ownsDocument(userId, post) && post.commentsCount === 0;
    },
});

/*
Posts.deny({
    update: function(userId, post, fieldNames) {
        //if (urlRepeated(userId, post)) return true;
        // 只能更改如下两个字段：
        return (_.without(fieldNames, 'url', 'title').length > 0);
    }
});
*/

Meteor.methods({
    postInsert: function(postAttributes) {
        check(Meteor.userId(), String);
        check(postAttributes.postType, Number);

        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error('post-insert-denied', 'you are not a registered user!');

        var errors = null;
        if (postAttributes.postType === 0) { /* for topics */
            check(postAttributes, {
                title: String,
                url: String,
                postType: Number
            });
            errors = validateTopic(postAttributes);
            if (errors.title || errors.url)
                throw new Meteor.Error('post-insert-denied', "你必须为你的帖子填写标题和 URL");
        } else if (postAttributes.postType === 1) { /* for debates */
            check(postAttributes, {
                proposition: String,
                url: String,
                positiveStandpoint: String,
                negativeStandpoint: String,
                postType: Number
            });
            errors = validateDebate(postAttributes);
            if (errors.proposition || errors.positive || errors.negative)
                throw new Meteor.Error('post-insert-denied', "you should write proposition, positive and negative standpoints for your debate!");
        } else if (postAttributes.postType === 2) { /* for predictions */
            check(postAttributes, {
                title: String,
                url: String,
                postType: Number
            });
            errors = validatePrediction(postAttributes);
            if (errors.title || errors.url)
                throw new Meteor.Error('post-insert-denied', "你必须为你的帖子填写标题和 URL");
        } else {
            throw new Meteor.Error('post-insert-denied', "this new post have invalid postType!");
        }

        var postWithSameLink = Posts.findOne({ url: postAttributes.url });
        if (postWithSameLink) {
            return {
                postExists: true,
                _id: postWithSameLink._id
            }
        }

        var post = null;

        if (postAttributes.postType === 0) { /* for topics */
            post = _.extend(postAttributes, {
                userId: user._id,
                author: user.username,
                submitted: new Date(),
                commentsCount: 0,
                upvoters: [],
                votes: 0
            });
        } else if (postAttributes.postType === 1) { /* for debates */
            post = _.extend(postAttributes, {
                userId: user._id,
                author: user.username,
                submitted: new Date(),
                commentsCount: 0,
                upvoters: [],
                votes: 0,
                positiveCount: 0,
                negativeCount: 0
            });
        } else if (postAttributes.postType === 2) { /* for predictions */
            post = _.extend(postAttributes, {
                userId: user._id,
                author: user.username,
                submitted: new Date(),
                commentsCount: 0,
                upvoters: [],
                votes: 0
            });
        } else {
            throw new Meteor.Error('post-insert-denied', "this new post have invalid postType!");
        }

        var postId = Posts.insert(post);

        return {
            _id: postId
        };
    },

    postUpdate: function(currentPostId, postAttributes) {
        check(Meteor.userId(), String);
        check(currentPostId, String);
        check(postAttributes.postType, Number);

        var user = Meteor.user();
        if (!user)
            throw new Meteor.Error('post-update-denied', 'you are not a registered user!');

        var errors = null;
        if (postAttributes.postType === 0) { /* for topics */
            check(postAttributes, {
                title: String,
                url: String,
                postType: Number
            });
            errors = validateTopic(postAttributes);
            if (errors.title || errors.url)
                throw new Meteor.Error('topic-update-denied', "你必须为你的帖子填写标题和 URL");
        } else if (postAttributes.postType === 1) { /* for debates */
            check(postAttributes, {
                proposition: String,
                url: String,
                positiveStandpoint: String,
                negativeStandpoint: String,
                postType: Number
            });
            errors = validateDebate(postAttributes);
            if (errors.proposition || errors.positive || errors.negative)
                throw new Meteor.Error('debate-update-denied', "you should write proposition, positive and negative standpoints for your debate!");
        } else if (postAttributes.postType === 2) { /* for predictions */
            check(postAttributes, {
                title: String,
                url: String,
                postType: Number
            });
            errors = validatePrediction(postAttributes);
            if (errors.title || errors.url)
                throw new Meteor.Error('prediction-update-denied', "你必须为你的帖子填写标题和 URL");
        } else {
            throw new Meteor.Error('post-update-denied', "update post with an invalid postType!");
        }

        var postWithSameId = Posts.findOne({ _id: currentPostId });
        if (!postWithSameId) {
            return {
                postIdNotExists: true,
                updateSucceeded: false
            }
        }

        if (postWithSameId.votes > 10 || postWithSameId.commentsCount > 0) {
            throw new Meteor.Error('post-update-denied', "this post has already been voted or commented!");
        }

        if (postWithSameId.postType === 1
            && (postWithSameId.positiveCount > 0 || postWithSameId.negativeCount > 0)) {
            throw new Meteor.Error('debate-update-denied', "this debate has already been fired!");
        }

        if (user._id != postWithSameId.userId) {
            return {
                updateNotAllowed: true,
                updateSucceeded: false
            }
        }

        var post = _.extend(postAttributes, {
            submitted: new Date()
        });

        console.log('post update, postProperties: postType: ' + postAttributes.postType + ", date: " + postAttributes.submitted);
        Posts.update(postWithSameId._id, { $set: postAttributes });

        return {
            updateSucceeded: true
        }
    },

    upvotePost: function(postId) {
        check(postId, String);

        var userId = Meteor.userId();
        if (!userId)
            throw new Meteor.Error('upvote-post-denied', "you have no access rights, because you are not logged in!");

        var post = Posts.findOne(postId);
        if (!post)
            throw new Meteor.Error('upvote-post-denied', "You weren't able to upvote a post that doesnt exist!");
        if (userId === post.userId)
            throw new Meteor.Error('upvote-post-denied', "You can not vote on your post");

        var affected = Posts.update({
            _id: postId,
            upvoters: {$ne: post.userId}
        }, {
            $addToSet: {upvoters: userId},
            $inc: {votes: 1}
        });

        if (! affected)
            throw new Meteor.Error('invalid-post-upvote', "You weren't able to upvote that post");
    }
});