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
});

Router.route('/posts/:_id/edit', {
    name: 'postEdit',
    waitOn: function() {
        return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() {
        return Posts.findOne(this.params._id);
    }
});

Router.route('/submit', { name: 'postSubmit' });

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

NewPostsController = PostsListController.extend({
    sort: { submitted: -1, _id: -1 },
    nextPath: function() {
        return Router.routes.newPosts.path({ postsLimit: this.postsLimit() + this.increment });
    }
});

BestPostsController = PostsListController.extend({
    sort: { votes: -1, submitted: -1, _id: -1 },
    nextPath: function() {
        return Router.routes.bestPosts.path({ postsLimit: this.postsLimit() + this.increment });
    }
});

Router.route('/', {
    name: 'home',
    controller: NewPostsController
});

Router.route('/new/:postsLimit?', { name: 'newPosts' });

Router.route('/best/:postsLimit?', { name: 'bestPosts' });

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