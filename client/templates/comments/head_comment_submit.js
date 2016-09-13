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

        console.log('jimvon submit comment, currentRouteName: ' + Router.current().route.getName());

        if (template.data.postType < 0 || template.data.postType > 3)
            throw new Meteor.Error('invalid-comment', 'parent post have a invalid postType[' + template.data.comment.postType + '].');

        var $body = $(e.target).find('[name=body]');
        var comment = {
            body: $body.val(),
            chainHeadId: '',
            parentId: '',
            postType: template.data.postType,
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