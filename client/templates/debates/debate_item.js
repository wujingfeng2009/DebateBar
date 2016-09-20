Template.debateItem.onCreated( function () {
    this.state = new ReactiveDict();
    this.state.setDefault({
    editFormOpen: false,
    commentFormOpen: false,
    });
});

Template.debateItem.helpers({
    ownDebate: function() {
        return this.userId === Meteor.userId();
    },
    canDelete: function() {
        return this.userId === Meteor.userId() && this.commentsCount === 0;
    },
    domain: function() {
        var a = document.createElement('a');
        a.href = this.url;
        //console.log('post_item: { href: ' + a.href + ', hostname: ' + a.hostname + '}');
        return a.hostname;
    },
    hasUrl: function() {
        if (this.url && this.url != '')
            return true;
        return false;
    },
    commentsCount: function() {
        return this.commentsCount;
    },
    upvotedClass: function() {
        var userId = Meteor.userId();
        if (userId && !_.include(this.upvoters, userId)) {
            return 'btn-primary upvotable';
        } else {
            return 'disabled';
        }
    },
    navigateText: function() {
        var currentRouteName = Router.current().route.getName();

        if (currentRouteName === 'debatePage' || currentRouteName === 'commentChain' || currentRouteName === 'commentThread')
            return 'Back';
        return 'Discuss';
    },
    needEdit: function() {
        const instance = Template.instance();
        return instance.state.get('editFormOpen');
    }
});

Template.debateItem.events({
    'click .upvotable': function(e) {
        e.preventDefault();
        Meteor.call('upvoteDebate', this._id);
    },
    'click .next-path': function(e, instance) {
        e.preventDefault();

        var currentRouteName = Router.current().route.getName();
        console.log('jimvon currentRouteName: ' + currentRouteName);

        var lastDebatesListPath = Session.get('lastDebatesListPath');
        console.log('jimvon Session.lastDebatesListPath: ' + lastDebatesListPath);

        if (lastDebatesListPath && lastDebatesListPath !== '') {
            if (currentRouteName === 'debatePage') {
                Router.go(lastDebatesListPath);
                return;
            } else {
                Router.go(Router.routes.debatePage.path({ _id: this._id }));
                return;
            }
        }

        var nextPath = '';
        if (Meteor.userId() && Meteor.userId() !== '') {
            if (currentRouteName === 'debatePage') {
                if (Meteor.user().userContext && Meteor.user().userContext.lastDebatesListPath !== '')
                    nextPath = Meteor.user().userContext.lastDebatesListPath;
                else
                    nextPath = '/';
            } else
                nextPath = Router.routes.debatePage.path({ _id: this._id });
        } else {
            if (currentRouteName === 'debatePage') {
                    nextPath = '/';
            } else
                nextPath = Router.routes.debatePage.path({ _id: this._id });
        }

        Router.go(nextPath);
    },
    'click .edit-toggle': function(e, instance) {
        instance.state.set('editFormOpen', !instance.state.get('editFormOpen'));
        e.preventDefault();
    },
    'click .delete-debate': function(e, instance) {
        e.preventDefault();

        if (instance.data.userId != Meteor.userId()) {
            throwError('invalid user, delete denied!');
            return;
        } else if (instance.data.commentsCount !== 0) {
            throwError('can not delete a debate that have children, delete denied!');
            return;
        }

        if (confirm("Delete this debate?")) {
            var currentDebateId = instance.data._id;
            Posts.remove(currentDebateId);
            //Router.go('home');
        }
    }
});