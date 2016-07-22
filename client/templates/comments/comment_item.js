Template.commentItem.helpers({
    submittedText: function() {
        return this.comment.submitted.toString();
    },
    visibleDisallowed: function() {
        console.log('align: ' + this.align + ', side: ' + this.comment.side);
        if (this.align === 'none')
            return false;
        if (this.align === 'left' && this.comment.side === 0)
            return false ;
        if (this.align === 'right' && this.comment.side === 1)
            return false ;
        return true;
    },
    commentChainPath: function() {
        return Router.routes.commentChain.path({ _id: this.comment._id});
    },
    hasChildren: function() {
        return Comments.find({ parentId: this.comment._id }).count() && true;
    },
    arrowDirection: function() {
        if (this.align === 'left')
            return 'rightArrow';
        if (this.align === 'right')
            return 'leftArrow';
        return '';
    },
    arrowNeeded: function() {
            return this.needArrow;
    },
    columnSide: function() {
        if (this.align === 'left')
            return 'leftColumn';
        if (this.align === 'right')
            return 'rightColumn';
        return '';
    }
});