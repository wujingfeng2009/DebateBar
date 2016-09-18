Template.debateSubmit.events({
    'submit form': function(e) {
        e.preventDefault();

        var $urlString = $(e.target).find('[name=url]');
        var $titleString = $(e.target).find('[name=title]');
        var debate = {
            url: $urlString.val(),
            title: $titleString.val(),
            postType: 1,
            proposition: ''
        };

        var errors = validateDebate(debate);
        if (errors.title || errors.url)
            return Session.set('debateSubmitErrors', errors);

        Meteor.call('postInsert', debate, function(error, result) {
            // 显示错误信息并退出
            if (error)
                return throwError(error.reason);
            // 显示结果，跳转页面
            if (result.postExists)
                throwError('This link has already been posted（该链接已经存在）');
            $urlString.val('');
            $titleString.val('');

            //Router.go(Meteor.user().userContext.lastDebatesListPath);
        });
    }
});

Template.debateSubmit.onCreated(function() {
    Session.set('debateSubmitErrors', {});
});

Template.debateSubmit.helpers({
    errorMessage: function(field) {
        return Session.get('debateSubmitErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('debateSubmitErrors')[field] ? 'has-error' : '';
    }
});