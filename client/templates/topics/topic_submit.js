Template.topicSubmit.events({
    'submit form': function(e) {
        e.preventDefault();
/*
        var currentRouteName = Router.current().route.getName();
        console.log('jimvon submit comment, currentRouteName: ' + currentRouteName);
        var postType = -1;
        if (currentRouteName.indexOf('Topics') >= 0 || currentRouteName.indexOf('home') >= 0)
            postType = 0;
        else if (currentRouteName.indexOf('Debates') >= 0)
            postType = 1;
        else if (currentRouteName.indexOf('Predictions') >= 0)
            postType = 2;
        else if (currentRouteName.indexOf('Bets') >= 0)
            postType = 3;

        if (postType < 0 || postType > 3)
            throw new Meteor.Error('invalid-post', 'Your post have a invalid postType[' + postType + '].');
*/
        var $urlString = $(e.target).find('[name=url]');
        var $titleString = $(e.target).find('[name=title]');
        var topic = {
            url: $urlString.val(),
            title: $titleString.val(),
            postType: 0
        };

        var errors = validateTopic(topic);
        if (errors.title || errors.url)
            return Session.set('topicSubmitErrors', errors);

        Meteor.call('postInsert', topic, function(error, result) {
            // 显示错误信息并退出
            if (error)
                return throwError(error.reason);
            // 显示结果，跳转页面
            if (result.postExists)
                throwError('This link has already been posted（该链接已经存在）');
            $urlString.val('');
            $titleString.val('');

            //Router.go('home');
        });
    }
});

Template.topicSubmit.onCreated(function() {
    Session.set('topicSubmitErrors', {});
});

Template.topicSubmit.helpers({
    errorMessage: function(field) {
        return Session.get('topicSubmitErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('topicSubmitErrors')[field] ? 'has-error' : '';
    }
});