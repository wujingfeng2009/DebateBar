Template.topicEdit.onCreated(function() {
    Session.set('topicsEditErrors', {});
});

Template.topicEdit.helpers({
    errorMessage: function(field) {
        return Session.get('topicsEditErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('topicsEditErrors')[field] ? 'has-error' : '';
    }
});

Template.topicEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        if (this.votes > 10 || this.commentsCount > 0) {
            return throwError('update topic denied, ' + 'this topic has already been fired!');
        }

        var currentTopicId = this._id;

        var topicProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val(),
            postType: 0
        }

        var errors = validateTopic(topicProperties);
        if (errors.title || errors.url)
            return Session.set('topicsEditErrors', errors);

        console.log('topics submit, currentTopicId: ' + currentTopicId + ', topicProperties: {url: ' + topicProperties.url + ', title: ' + topicProperties.title + '}');

        Meteor.call('postUpdate', currentTopicId, topicProperties, function(error, result) {
            // 显示错误信息并退出
            if (error)
                return throwError(error.reason);
            // 显示结果，跳转页面
            if (result.postIdNotExists)
                throwError('current TopicId[' + currentTopicId + '] does not exist!');
            else if (result.updateNotAllowed) {
                throwError('current user is not allowed to update current topic[' + currentTopicId + ']!');
            }

            Router.go('home');
        });
    }
});