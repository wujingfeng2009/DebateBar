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

        if (this.votes > 10 || this.commentsCount > 0 || this.positiveCount > 0 || this.negativeCount > 0) {
            //Session.set('debateItemCloseEditForm', true);
            return throwError('update debate denied, ' + 'this debate has already been fired!');
        }

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
        if (errors.proposition || errors.positive || errors.negative) {
            //Session.set('debateItemCloseEditForm', true);
            return Session.set('debateSubmitErrors', errors);
        }

        var currentDebateId = this._id;

        console.log('debate edit, currentDebateId: ' + currentDebateId + ', debate: {proposition: ' + debate.proposition + '}');

        Meteor.call('postUpdate', currentDebateId, debate, function(error, result) {
            // 显示错误信息并退出
            if (error)
                return throwError(error.reason);
            // 显示结果，跳转页面
            if (result.postIdNotExists)
                throwError('current DebateId[' + currentDebateId + '] does not exist!');
            else if (result.updateNotAllowed) {
                throwError('current user is not allowed to update current debate[' + currentDebateId + ']!');
            }

            //Router.go(Meteor.user().userContext.lastDebatesListPath);
            Session.set('debateItemCloseEditForm', true);
        });
    }
});