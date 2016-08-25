Template.postItem.helpers({
    ownPost: function() {
        return this.userId === Meteor.userId();
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

        if (currentRouteName === 'postPage')
            return 'Back';
        return 'Discuss';
    }
});

Template.postItem.events({
    'click .upvotable': function(e) {
        e.preventDefault();
        Meteor.call('upvote', this._id);
    },
    'click .next-path': function(e, instance) {
        e.preventDefault();

        var currentRouteName = Router.current().route.getName();
        console.log('jimvon currentRouteName: ' + currentRouteName);

        var lastPostListPath = Session.get('lastPostListPath');
        console.log('jimvon Session.lastPostListPath: ' + lastPostListPath);

        if (currentRouteName === 'postPage' && lastPostListPath && lastPostListPath !== '') {
            Router.go(lastPostListPath);
            return;
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
    }
});