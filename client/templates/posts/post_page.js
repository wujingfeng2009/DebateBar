Template.postPage.helpers({
    commentArgs: function(comment, align, needArrow) {
        console.log('comment[: ' + comment._id + '] align: ' + align + 'need arrow: ' + needArrow);
        return {
            comment,
            align: align,
            needArrow: needArrow,
        };
    },
    comments: function() {
        return Comments.find({ postId: this._id });
    }
});