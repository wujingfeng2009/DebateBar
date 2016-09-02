Template.debateEdit.onCreated(function() {
    Session.set('debateEditErrors', {});
});

Template.debateEdit.helpers({
    errorMessage: function(field) {
        return Session.get('debateEditErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('debateEditErrors')[field] ? 'has-error' : '';
    }
});

Template.debateEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentDebateId = this._id;

        var debateProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        }

        var errors = validateDebate(debateProperties);
        if (errors.title || errors.url)
            return Session.set('debateEditErrors', errors);

        console.log('debates submit, currentDebateId: ' + currentDebateId + ', debateProperties: {url: ' + debateProperties.url + ', title: ' + debateProperties.title + '}');

        Meteor.call('debateUpdate', currentDebateId, debateProperties, function(error, result) {
            // 显示错误信息并退出
            if (error)
                return throwError(error.reason);
            // 显示结果，跳转页面
            if (result.debateIdNotExists)
                throwError('current DebateId[' + currentDebateId + '] does not exist!');
            else if (result.updateNotAllowed) {
                throwError('current user is not allowed to update current debate[' + currentDebateId + ']!');
            }

            //Router.go(Meteor.user().userContext.lastDebatesListPath);
        });
    }
});