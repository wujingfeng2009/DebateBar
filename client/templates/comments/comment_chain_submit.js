Template.commentChainSubmit.onCreated(function() {
    Session.set('commentChainSubmitErrors', {});
});

Template.commentChainSubmit.helpers({
    errorMessage: function(field) {
        return Session.get('commentChainSubmitErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('commentChainSubmitErrors')[field] ? 'has-error' : '';
    },
    alignment: function() {
        if (this.alignSide === 1)
            return "alignRight";
        if (this.alignSide === 0)
            return "alignLeft";
        return '';
    },
});

Template.commentChainSubmit.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var $body = $(e.target).find('[name=body]');
        var comment ={};
        console.log('jimvon sameside: ' + template.data.sameside + ' comChain id: ' + template.data.chainCom._id );
        if (template.data.sameside) {
            comment = {
                body: $body.val(),
                chainHeadId: template.data.chainCom.chainHeadId,
                parentId: template.data.chainCom._id,
                postId: template.data.chainCom.postId,
                side: template.data.chainCom.side,
            };
        } else {
            comment = {
                body: $body.val(),
                chainHeadId: template.data.chainCom.chainHeadId,
                parentId: template.data.chainCom._id,
                postId: template.data.chainCom.postId,
                side: template.data.chainCom.side === 0 ? 1 : 0,
            };
        }

        var errors = {};
        if (!comment.body) {
            errors.body = "Please write some content";
            return Session.set('commentChainSubmitErrors', errors);
        }

        Meteor.call('commentInsert', comment, function(error, commentId) {
            if (error) {
                throwError(error.reason);
            } else {
                $body.val('');
                //Router.go(Router.routes.commentChain.path({ _id: template.data.chainCom._id}));
            }
        });
    }
});