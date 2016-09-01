validateDebates = function(debate) {
    var errors = {};

    if (!debate.title)
        errors.title = "请填写标题";
    if (!debate.url)
        errors.url = "请填写 URL";

    return errors;
}

Debates = new Mongo.Collection('debates');

Debates.allow({
    /*
    insert: function(userId, doc) { return !! userId; },
    update: function(userId, debate) {
        return ownsDocument(userId, debate);
    },
*/
    remove: function(userId, debate) {
        return ownsDocument(userId, debate) && debate.commentsCount === 0;
    },
});

/*
Debates.deny({
    update: function(userId, debate, fieldNames) {
        //if (urlRepeated(userId, debate)) return true;
        // 只能更改如下两个字段：
        return (_.without(fieldNames, 'url', 'title').length > 0);
    }
});
*/

Meteor.methods({
    debateInsert: function(debateAttributes) {
        check(Meteor.userId(), String);
        check(debateAttributes, {
            title: String,
            url: String
        });

        var errors = validateDebates(debateAttributes);
        if (errors.title || errors.url)
            throw new Meteor.Error('invalid-debate', "你必须为你的帖子填写标题和 URL");

        var debateWithSameLink = Debates.findOne({ url: debateAttributes.url });
        if (debateWithSameLink) {
            return {
                debateExists: true,
                _id: debateWithSameLink._id
            }
        }

        var user = Meteor.user();
        var debate = _.extend(debateAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date(),
            commentsCount: 0,
            upvoters: [],
            votes: 0
        });

        var debateId = Debates.insert(debate);

        return {
            _id: debateId
        };
    },

    debateUpdate: function(currentDebateId, debateAttributes) {
        check(Meteor.userId(), String);
        check(currentDebateId, String);
        check(debateAttributes, {
            title: String,
            url: String
        });

        var errors = validateDebates(debateAttributes);
        if (errors.title || errors.url)
            throw new Meteor.Error('invalid-debate', "你必须为你的帖子填写标题和 URL");

        var debateWithSameId = Debates.findOne({ _id: currentDebateId });
        if (!debateWithSameId) {
            return {
                debateIdNotExists: true,
                updateSucceeded: false
            }
        }

        var user = Meteor.user();
        if (user._id != debateWithSameId.userId) {
            return {
                updateNotAllowed: true,
                updateSucceeded: false
            }
        }

        var debate = _.extend(debateAttributes, {
            submitted: new Date()
        });

        console.log('debate update, debateProperties: url: ' + debateAttributes.url + ", title: " + debateAttributes.title + ", date: " + debateAttributes.submitted);
        Debates.update(debateWithSameId._id, { $set: debateAttributes });

        return {
            updateSucceeded: true
        }
    },

    upvoteDebate: function(debateId) {
        check(this.userId, String);
        check(debateId, String);

        var affected = Debates.update({
            _id: debateId,
            upvoters: {$ne: this.userId}
        }, {
            $addToSet: {upvoters: this.userId},
            $inc: {votes: 1}
        });

        if (! affected)
            throw new Meteor.Error('invalid', "You weren't able to upvote that debate");
    }
});