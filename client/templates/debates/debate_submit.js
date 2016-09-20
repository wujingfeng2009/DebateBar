Template.debateSubmit.events({
    'submit form': function(e) {
        e.preventDefault();

        var $propositionString = $(e.target).find('[name=proposition]');
        var $urlString = $(e.target).find('[name=url]');
        var $positiveString = $(e.target).find('[name=positive]');
        var $negativeString = $(e.target).find('[name=negative]');
        var debate = {
            proposition: $propositionString.val(),
            url: $urlString.val(),
            positiveStandpoint: $positiveString.val(),
            negativeStandpoint: $negativeString.val(),
            postType: 1,
        };

        var errors = validateDebate(debate);
        if (errors.proposition || errors.positive || errors.negative)
            return Session.set('debateSubmitErrors', errors);

        Meteor.call('postInsert', debate, function(error, result) {
            // 显示错误信息并退出
            if (error)
                return throwError(error.reason);
            // 显示结果，跳转页面
            if (result.postExists)
                throwError('This link has already been posted（该链接已经存在）');

            $positiveString.val('');
            $urlString.val('');
            $propositionString.val('');
            $negativeString.val('');

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