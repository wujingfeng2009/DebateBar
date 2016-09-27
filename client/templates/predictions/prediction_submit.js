Template.predictionSubmit.events({
    'submit form': function(e) {
        e.preventDefault();

        var $urlString = $(e.target).find('[name=url]');
        var $titleString = $(e.target).find('[name=title]');
        var prediction = {
            url: $urlString.val(),
            title: $titleString.val(),
            postType: 2
        };

        var errors = validatePrediction(prediction);
        if (errors.title || errors.url)
            return Session.set('predictionSubmitErrors', errors);

        Meteor.call('postInsert', prediction, function(error, result) {
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

Template.predictionSubmit.onCreated(function() {
    Session.set('predictionSubmitErrors', {});
});

Template.predictionSubmit.helpers({
    errorMessage: function(field) {
        return Session.get('predictionSubmitErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('predictionSubmitErrors')[field] ? 'has-error' : '';
    }
});