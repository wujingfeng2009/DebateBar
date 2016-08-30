Template.postSubmit.events({
    'submit form': function(e) {
        e.preventDefault();

        var $urlString = $(e.target).find('[name=url]');
        var $titleString = $(e.target).find('[name=title]');
        var post = {
            url: $urlString.val(),
            title: $titleString.val()
        };

        var errors = validatePost(post);
        if (errors.title || errors.url)
            return Session.set('postSubmitErrors', errors);

        Meteor.call('postInsert', post, function(error, result) {
            // 显示错误信息并退出
            if (error)
                return throwError(error.reason);
            // 显示结果，跳转页面
            if (result.postExists)
                throwError('This link has already been posted（该链接已经存在）');
            $urlString.val('');
            $titleString.val('');

            Router.go('home');
        });
    }
});

Template.postSubmit.onCreated(function() {
    Session.set('postSubmitErrors', {});
});

Template.postSubmit.helpers({
    errorMessage: function(field) {
        return Session.get('postSubmitErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
    }
});