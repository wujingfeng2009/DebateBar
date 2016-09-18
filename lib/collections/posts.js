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
        var errors = null;
        if (postAttributes.postType === 0) {
            check(postAttributes, {
                title: String,
                url: String,
                postType: Number
            });
            errors = validateTopic(postAttributes);
            if (errors.title || errors.url)
                throw new Meteor.Error('invalid-post', "你必须为你的帖子填写标题和 URL");
        } else if (postAttributes.postType === 1) {
            check(postAttributes, {
                title: String,
                url: String,
                postType: Number,
                proposition: String
            });
            errors = validateDebate(postAttributes);
            if (errors.title || errors.url)
                throw new Meteor.Error('invalid-post', "你必须为你的帖子填写标题和 URL");
        }

        var postWithSameLink = Posts.findOne({ url: postAttributes.url });
        if (postWithSameLink) {
            return {
                postExists: true,
                _id: postWithSameLink._id
            }
        }

        var user = Meteor.user();
        var post = _.extend(postAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date(),
            commentsCount: 0,
            upvoters: [],
            votes: 0
        });

        var postId = Posts.insert(post);

        return {
            _id: postId
        };
    },

    postUpdate: function(currentPostId, postAttributes) {
        check(Meteor.userId(), String);
        check(currentPostId, String);
        check(postAttributes.postType, Number);

        var errors = null;
        if (postAttributes.postType === 0) {
            check(postAttributes, {
                title: String,
                url: String,
                postType: Number
            });
            errors = validateTopic(postAttributes);
            if (errors.title || errors.url)
                throw new Meteor.Error('invalid-post', "你必须为你的帖子填写标题和 URL");
        } else if (postAttributes.postType === 1) {
            check(postAttributes, {
                title: String,
                url: String,
                postType: Number
            });
            errors = validateDebate(postAttributes);
            if (errors.title || errors.url)
                throw new Meteor.Error('invalid-post', "你必须为你的帖子填写标题和 URL");
        }

        var postWithSameId = Posts.findOne({ _id: currentPostId });
        if (!postWithSameId) {
            return {
                postIdNotExists: true,
                updateSucceeded: false
            }
        }

        var user = Meteor.user();
        if (user._id != postWithSameId.userId) {
            return {
                updateNotAllowed: true,
                updateSucceeded: false
            }
        }

        var post = _.extend(postAttributes, {
            submitted: new Date()
        });

        console.log('post update, postProperties: url: ' + postAttributes.url + ", title: " + postAttributes.title + ", date: " + postAttributes.submitted);
        Posts.update(postWithSameId._id, { $set: postAttributes });

        return {
            updateSucceeded: true
        }
    },

    upvotePost: function(postId) {
        check(this.userId, String);
        check(postId, String);

        var affected = Posts.update({
            _id: postId,
            upvoters: {$ne: this.userId}
        }, {
            $addToSet: {upvoters: this.userId},
            $inc: {votes: 1}
        });

        if (! affected)
            throw new Meteor.Error('invalid', "You weren't able to upvote that post");
    }
});