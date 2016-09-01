Template.postItem.onCreated( function () {
    this.state = new ReactiveDict();
    this.state.setDefault({
    editFormOpen: false,
    commentFormOpen: false,
    });
});

Template.postItem.helpers({
    ownPost: function() {
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

        if (currentRouteName === 'topicPage' || currentRouteName === 'commentChain' || currentRouteName === 'commentThread')
            return 'Back';
        return 'Discuss';
    },
    needEdit: function() {
        const instance = Template.instance();
        return instance.state.get('editFormOpen');
    }
});

Template.postItem.events({
    'click .upvotable': function(e) {
        e.preventDefault();
        Meteor.call('upvotePost', this._id);
    },
    'click .next-path': function(e, instance) {
        e.preventDefault();

        var currentRouteName = Router.current().route.getName();
        console.log('jimvon currentRouteName: ' + currentRouteName);

        var lastTopicsListPath = Session.get('lastTopicsListPath');
        console.log('jimvon Session.lastTopicsListPath: ' + lastTopicsListPath);

        if (lastTopicsListPath && lastTopicsListPath !== '') {
            if (currentRouteName === 'topicPage') {
                Router.go(lastTopicsListPath);
                return;
            } else {
                Router.go(Router.routes.topicPage.path({ _id: this._id }));
                return;
            }
        }

        var nextPath = '';
        if (Meteor.userId() && Meteor.userId() !== '') {
            if (currentRouteName === 'topicPage') {
                if (Meteor.user().userContext && Meteor.user().userContext.lastTopicsListPath !== '')
                    nextPath = Meteor.user().userContext.lastTopicsListPath;
                else
                    nextPath = '/';
            } else
                nextPath = Router.routes.topicPage.path({ _id: this._id });
        } else {
            if (currentRouteName === 'topicPage') {
                    nextPath = '/';
            } else
                nextPath = Router.routes.topicPage.path({ _id: this._id });
        }

        Router.go(nextPath);
    },
    'click .edit-toggle': function(e, instance) {
        instance.state.set('editFormOpen', !instance.state.get('editFormOpen'));
        e.preventDefault();
    },
    'click .delete-post': function(e, instance) {
        e.preventDefault();

        if (instance.data.userId != Meteor.userId()) {
            throwError('invalid user, delete denied!');
            return;
        } else if (instance.data.commentsCount !== 0) {
            throwError('can not delete a post that have children, delete denied!');
            return;
        }

        if (confirm("Delete this post?")) {
            var currentPostId = instance.data._id;
            Posts.remove(currentPostId);
            Router.go('home');
        }
    }
});