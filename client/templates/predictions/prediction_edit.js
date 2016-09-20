Template.predictionEdit.onCreated(function() {
    Session.set('predictionEditErrors', {});
});

Template.predictionEdit.helpers({
    errorMessage: function(field) {
        return Session.get('predictionEditErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('predictionEditErrors')[field] ? 'has-error' : '';
    }
});

Template.predictionEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        if (this.votes > 10 || this.commentsCount > 0) {
            return throwError('update prediction denied, ' + 'this prediction has already been fired!');
        }

        var currentPredictionId = this._id;

        var predictionProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val(),
            postType: 2
        }

        var errors = validatePrediction(predictionProperties);
        if (errors.title || errors.url)
            return Session.set('predictionEditErrors', errors);

        console.log('predictions submit, currentPredictionId: ' + currentPredictionId + ', predictionProperties: {url: ' + predictionProperties.url + ', title: ' + predictionProperties.title + '}');

        Meteor.call('postUpdate', currentPredictionId, predictionProperties, function(error, result) {
            // 显示错误信息并退出
            if (error)
                return throwError(error.reason);
            // 显示结果，跳转页面
            if (result.postIdNotExists)
                throwError('currentPredictionId[' + currentPredictionId + '] does not exist!');
            else if (result.updateNotAllowed) {
                throwError('user is not allowed to update current prediction[' + currentPredictionId + ']!');
            }

            //Router.go(Meteor.user().userContext.lastDebatesListPath);
        });
    }
});