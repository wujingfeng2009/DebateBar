Template.commentSubmitEmbedded.onCreated(function() {
    Session.set('commentChainSubmitErrors', {});
});

Template.commentSubmitEmbedded.helpers({
    errorMessage: function(field) {
        return Session.get('commentChainSubmitErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('commentChainSubmitErrors')[field] ? 'has-error' : '';
    }
});

Template.commentSubmitEmbedded.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var $body = $(e.target).find('[name=body]');
        var comm = {
            body: $body.val(),
            chainHeadId: template.data.comment.chainHeadId,
            parentId: template.data.comment._id,
            postId: template.data.comment.postId,
            side: template.data.comment.side === 0 ? 1 : 0,
        };

        var errors = {};
        if (!comm.body) {
            errors.body = "Please write some content";
            return Session.set('commentChainSubmitErrors', errors);
        }

        console.log("jimvon comment.parentId: " + template.data.comment._id + ", chainHeadId: " + template.data.comment.chainHeadId);
        Meteor.call('commentInsert', comm, function(error, commentId) {
            if (error) {
                throwError(error.reason);
            } else {
                $body.val('');
                Router.go(Router.routes.commentChain.path({ _id: template.data.comment._id}));
            }
        });
    }
});