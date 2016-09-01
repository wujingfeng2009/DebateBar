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
    nextRoutePath: function() {
        var currentPath = Router.current().url;
        var currentRouteName = Router.current().route.getName();
        console.log('jimvon currentPath: ' + currentPath + ', currentRouteName: ' + currentRouteName);

        if (Meteor.userId() && Meteor.userId() !== '') {
            if (currentRouteName === 'postPage') {
                if (Meteor.user().userContext && Meteor.user().userContext.lastPostListPath !== '')
                    return Meteor.user().userContext.lastPostListPath;
                else
                    return '/';
            } else
                return Router.routes.postPage.path({ _id: this._id });
        } else {
            if (currentRouteName === 'postPage') {
                var lastPostListPath = Session.get('lastPostListPath');
                if (!lastPostListPath || lastPostListPath === '')
                    return '/';
                else
                    return lastPostListPath;
            }
            else
                return Router.routes.postPage.path({ _id: this._id });
        }
    },
    navigateText: function() {
        var currentRouteName = Router.current().route.getName();

        if (currentRouteName === 'postPage' || currentRouteName === 'commentChain' || currentRouteName === 'commentThread')
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

        var lastPostListPath = Session.get('lastPostListPath');
        console.log('jimvon Session.lastPostListPath: ' + lastPostListPath);

        if (lastPostListPath && lastPostListPath !== '') {
            if (currentRouteName === 'postPage') {
                Router.go(lastPostListPath);
                return;
            } else {
                Router.go(Router.routes.postPage.path({ _id: this._id }));
                return;
            }
        }

        var nextPath = '';
        if (Meteor.userId() && Meteor.userId() !== '') {
            if (currentRouteName === 'postPage') {
                if (Meteor.user().userContext && Meteor.user().userContext.lastPostListPath !== '')
                    nextPath = Meteor.user().userContext.lastPostListPath;
                else
                    nextPath = '/';
            } else
                nextPath = Router.routes.postPage.path({ _id: this._id });
        } else {
            if (currentRouteName === 'postPage') {
                    nextPath = '/';
            } else
                nextPath = Router.routes.postPage.path({ _id: this._id });
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