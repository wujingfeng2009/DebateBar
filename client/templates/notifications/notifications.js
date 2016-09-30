Template.notifications.helpers({
    notifications: function() {
        return Notifications.find({ userId: Meteor.userId(), read: false });
    },
    notificationCount: function() {
        return Notifications.find({ userId: Meteor.userId(), read: false }).count();
    }
});

Template.notificationItem.helpers({
    notificationPostPath: function() {
        if (this.postType === 0)
            return Router.routes.topicPage.path({ _id: this.postId });
        else if (this.postType === 1)
            return Router.routes.debatePage.path({ _id: this.postId });
        else if (this.postType === 2)
            return Router.routes.predictionPage.path({ _id: this.postId });
        else if (this.postType === 3)
            return Router.routes.betPage.path({ _id: this.postId });
    }
});

Template.notificationItem.events({
    'click a': function() {
        Notifications.update(this._id, { $set: { read: true } });
    }
});