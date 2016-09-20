Template.commentSubmit.onCreated(function() {
    Session.set('commentSubmitErrors', {});
});

Template.commentSubmit.helpers({
    errorMessage: function(field) {
        return Session.get('commentSubmitErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('commentSubmitErrors')[field] ? 'has-error' : '';
    },
    isDebatePost: function() {
        return this.postType === 1;
     },
     isTopicPost: function() {
        return this.postType === 0;
     },
});

Template.commentSubmit.events({
    'submit form': function(e, template) {
        e.preventDefault();

        console.log('jimvon submit comment, postType: ' + template.data.postType);

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

        if (comment.postType === 1) {
            var $standpoint = $(e.target).find('input[name=standpoint]:checked');
            comment.side = $standpoint.val() === 'positive' ? 0 : 1;
        }

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