Template.postPage.helpers({
    commentArgs: function(comment, align) {
        console.log('comment[: ' + comment._id + '] align: ' + align);
        return {
            comment,
            align: align,
        };
    },
    comments: function() {
        return Comments.find({ postId: this._id });
    }
});