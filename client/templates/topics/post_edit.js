Template.postEdit.onCreated(function() {
    Session.set('postEditErrors', {});
});

Template.postEdit.helpers({
    errorMessage: function(field) {
        return Session.get('postEditErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
    }
});

Template.postEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentPostId = this._id;

        var postProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        }

        var errors = validatePost(postProperties);
        if (errors.title || errors.url)
            return Session.set('postEditErrors', errors);

        console.log('posts submit, currentPostId: ' + currentPostId + ', postProperties: {url: ' + postProperties.url + ', title: ' + postProperties.title + '}');

        Meteor.call('postUpdate', currentPostId, postProperties, function(error, result) {
            // 显示错误信息并退出
            if (error)
                return throwError(error.reason);
            // 显示结果，跳转页面
            if (result.postIdNotExists)
                throwError('current PostId[' + currentPostId + '] does not exist!');
            else if (result.updateNotAllowed) {
                throwError('current user is not allowed to update current post[' + currentPostId + ']!');
            }

            Router.go('home');
        });
    }
});