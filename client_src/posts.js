$(document).ready(function(){

    var userTemplate = Handlebars.compile( $('#user-template').html() );
    var currentPostTemplate = Handlebars.compile( $('#current-post-template').html() );
    var relatedPostsTemplate = Handlebars.compile( $('#related-posts-template').html() );

    Handlebars.registerPartial('post', $('#post-template').html());
    Handlebars.registerPartial('comments-box', $('#comments-box-template').html());
    Handlebars.registerPartial('comment', $('#comment-template').html());
    Handlebars.registerHelper('img', function(imgUrl){
        return new Handlebars.SafeString('<img src="' + imgUrl + '"/>')
    });

    $('.header-inner').html(userTemplate({
        user: Data.getUser('aab')
    }));

    $('.current-post').html(currentPostTemplate({
        currentPost: Data.getCurrentPost(),
        comments: Data.getPostComments()
    }));

    $('.related-posts').html(relatedPostsTemplate({
        posts: Data.getRelatedPosts()
    }));

});
