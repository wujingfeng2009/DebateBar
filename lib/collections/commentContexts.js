CommentContexts = new Mongo.Collection(null);
gTopCommentContext = 0;

enQueueCommentContext = function(commentId) {
    var comContext = CommentContexts.findOne({ comment: commentId});

    if (comContext) {
        var seq = comContext.seqNum + 1;
        for (; seq <=  gTopCommentContext; seq++) {
            CommentContexts.remove({seqNum: seq});
        }
        gTopCommentContext = comContext.seqNum;
        return;
    }

    CommentContexts.insert({ seqNum: ++gTopCommentContext, comment: commentId, side:  (gTopCommentContext%2 === 0) ? 0 : 1});
};

commentContextAt = function(seqNum) {
    return CommentContexts.findOne({ seqNum: seqNum});
};

topCommentContext = function() {
    return gTopCommentContext;
};

commentContextsSorted = function() {
    return CommentContexts.find({ sort: { seqNum: -1}});
};

clearCommentContexts = function() {
    return CommentContexts.clear();
};