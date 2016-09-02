Template.commentSubmit.onCreated(function() {
    Session.set('commentSubmitErrors', {});
});

Template.commentSubmit.helpers({
    errorMessage: function(field) {
        return Session.get('commentSubmitErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('commentSubmitErrors')[field] ? 'has-error' : '';
    }
});

Template.commentSubmit.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var currentRouteName = Router.current().route.getName();
        console.log('jimvon submit comment, currentRouteName: ' + currentRouteName);
        var postType = -1;
        if (currentRouteName === 'topicPage')
            postType = 0;
        else if (currentRouteName === 'debatePage')
            postType = 1;
        else if (currentRouteName === 'predictionPage')
            postType = 2;
        else if (currentRouteName === 'betPage')
            postType = 3;

        if (postType < 0 || postType > 3)
            throw new Meteor.Error('invalid-comment', 'Your comment must have a postType!');

        var $body = $(e.target).find('[name=body]');
        var comment = {
            body: $body.val(),
            chainHeadId: '',
            parentId: '',
            postType: postType,
            postId: template.data._id,
            side: 0,
        };

        console.log('jimvon call commentInsert, postId: ' + template.data._id);
        var errors = {};
        if (!comment.body) {
            errors.body = "Please write some content";
            return Session.set('commentSubmitErrors', errors);
        }

        Meteor.call('commentInsert', comment, function(error, commentId) {
            if (error) {
                throwError(error.reason);
            } else {
                $body.val('');
            }
        });
    }
});