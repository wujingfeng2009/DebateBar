Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() {
        if (Meteor.userId() && Meteor.userId() !== '') {
            console.log('jimvon subscribe userContext!');
            Meteor.subscribe('Meteor.users.userContext', Meteor.userId());
        }
        return Meteor.subscribe('notifications');
    }
});

PostsListController = RouteController.extend({
    template: 'postsList',
    increment: 5,
    postsLimit: function() {
        return parseInt(this.params.postsLimit) || this.increment;
    },
    findOptions: function() {
        return { sort: this.sort, limit: this.postsLimit() };
    },
    subscriptions: function() {
        this.postsSub = Meteor.subscribe('posts', this.findOptions());
    },
    posts: function() {
        return Posts.find({}, this.findOptions());
    },
    data: function() {
        /* In order to trace user context data, we use Session to store it. but if user refreshes a page, the Session
             will be reset, all context will be lost. so we use a costom user.userContext to persistantly store
             user context data. 
             there are another case: user is not logged in, we have no user and its userContext to store the context
             data. in this case, we can only just route to '/'.
        */
        var currentPath = Router.current().url;
        console.log('jimvon currentPath: ' + currentPath + ', id: ' + Meteor.userId());
        Session.set('lastPostListPath', currentPath);
        if (Meteor.userId() && Meteor.userId() !== '') {
            console.log('jimvon update lastPostListPath: ' + currentPath);
            Meteor.users.update(Meteor.userId(), {$set: {userContext: { lastPostListPath: currentPath }}});
        }

        var hasMore = this.posts().count() === this.postsLimit();
        return {
            posts: this.posts(),
            ready: this.postsSub.ready,
            nextRouterPath: hasMore ? this.nextPath() : null
        };
    }
});

NewTopicsController = PostsListController.extend({
    sort: { submitted: -1, _id: -1 },
    nextPath: function() {
        return Router.routes.newTopics.path({ postsLimit: this.postsLimit() + this.increment });
    }
});

HotTopicsController = PostsListController.extend({
    sort: { votes: -1, submitted: -1, _id: -1 },
    nextPath: function() {
        return Router.routes.hotTopics.path({ postsLimit: this.postsLimit() + this.increment });
    }
});

FavoriteTopicsController = PostsListController.extend({
    sort: { votes: -1, submitted: -1, _id: -1 },
    nextPath: function() {
        return Router.routes.favoriteTopics.path({ postsLimit: this.postsLimit() + this.increment });
    }
});

Router.route('/', { name: 'home', controller: NewTopicsController });
Router.route('/newTopics/:postsLimit?', { name: 'newTopics' });
Router.route('/hotTopics/:postsLimit?', { name: 'hotTopics' });
Router.route('/favoriteTopics/:postsLimit?', { name: 'favoriteTopics' });

Router.route('/posts/:_id', {
    name: 'postPage',
    waitOn: function() {
        return [
            Meteor.subscribe('singlePost', this.params._id),
            Meteor.subscribe('comments', this.params._id)
        ];
    },
    data: function() {
        return Posts.findOne(this.params._id);
    }
})

CommentChainController = RouteController.extend({
    template: 'commentChain',
    subscriptions: function() {
        //this.singleCommentSub = Meteor.subscribe('singleComment', this.params._id);
        this.commentChainSub = Meteor.subscribe('commentsTree', this.params._id);
        this.commentParentPostSub = Meteor.subscribe('commentParentPost', this.params._id);
    },
    data: function() {
        return {
            chainComment: Comments.findOne(this.params._id),
        }
    }
});
Router.route('/posts/commentChain/:_id?', { name: 'commentChain' });

CommentThreadController = RouteController.extend({
    template: 'commentThread',
    subscriptions: function() {
        this.commentThreadSub = Meteor.subscribe('commentsTree', this.params._id);
        this.commentParentPostSub = Meteor.subscribe('commentParentPost', this.params._id);
    },
    data: function() {
        return {
            threadComment: Comments.findOne(this.params._id),
        }
    }
});
Router.route('/posts/commentThread/:_id?', { name: 'commentThread' });

var requireLogin = function() {
    if (!Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
}

Router.onBeforeAction('dataNotFound', { only: 'postPage' });
Router.onBeforeAction(requireLogin, { only: 'postSubmit' });

/* for debates */
DebatesListController = RouteController.extend({
    template: 'debatesList',
    increment: 5,
    debatesLimit: function() {
        return parseInt(this.params.debatesLimit) || this.increment;
    },
    findOptions: function() {
        return { sort: this.sort, limit: this.debatesLimit() };
    },
    subscriptions: function() {
        this.debatesSub = Meteor.subscribe('debates', this.findOptions());
    },
    debates: function() {
        return Debates.find({}, this.findOptions());
    },
    data: function() {
        /* In order to trace user context data, we use Session to store it. but if user refreshes a page, the Session
             will be reset, all context will be lost. so we use a costom user.userContext to persistantly store
             user context data. 
             there are another case: user is not logged in, we have no user and its userContext to store the context
             data. in this case, we can only just route to '/'.
        */
        var currentPath = Router.current().url;
        console.log('jimvon currentPath: ' + currentPath + ', id: ' + Meteor.userId());
        Session.set('lastDebateListPath', currentPath);
        if (Meteor.userId() && Meteor.userId() !== '') {
            console.log('jimvon update lastDebateListPath: ' + currentPath);
            Meteor.users.update(Meteor.userId(), {$set: {userContext: { lastDebateListPath: currentPath }}});
        }

        var hasMore = this.debates().count() === this.debatesLimit();
        return {
            debates: this.debates(),
            ready: this.debatesSub.ready,
            nextRouterPath: hasMore ? this.nextPath() : null
        };
    }
});

NewDebatesController = DebatesListController.extend({
    sort: { submitted: -1, _id: -1 },
    nextPath: function() {
        return Router.routes.newDebates.path({ debatesLimit: this.debatesLimit() + this.increment });
    }
});

HotDebatesController = DebatesListController.extend({
    sort: { votes: -1, submitted: -1, _id: -1 },
    nextPath: function() {
        return Router.routes.hotDebates.path({ debatesLimit: this.debatesLimit() + this.increment });
    }
});

FavoriteDebatesController = DebatesListController.extend({
    sort: { votes: -1, submitted: -1, _id: -1 },
    nextPath: function() {
        return Router.routes.favoriteDebates.path({ debatesLimit: this.debatesLimit() + this.increment });
    }
});

Router.route('/newDebates/:debatesLimit?', { name: 'newDebates' });
Router.route('/hotDebates/:debatesLimit?', { name: 'hotDebates' });
Router.route('/favoriteDebates/:debatesLimit?', { name: 'favoriteDebates' });