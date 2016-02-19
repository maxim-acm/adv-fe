$(document).ready(function(){

  var appTemplate = Handlebars.compile( $('#app').html() );
  var postContainerTemplate = Handlebars.compile( $('#post-container-template').html() );
  var currenPostImageTemplate = Handlebars.compile( $('#current-post__image-template').html() );

  Handlebars.registerPartial('post-preview', $('#post-container-template').html());
  Handlebars.registerPartial('comments-box', $('#comments-box-template').html());
  Handlebars.registerPartial('comment-preview', $('#comment-preview-template').html());

  Handlebars.registerHelper('img', function(imgUrl){
    return new Handlebars.SafeString('<img src="' + imgUrl + '"/>')
  });

  $('.body').html(appTemplate({
    user: Data.getUser('aab'),
    relatedPosts: Data.getRelatedPosts(),
    comments: Data.getPostComments()
  }))

  $('.current-post__image-box').html(currenPostImageTemplate({
    currentPost: Data.getCurrentPost()
  }))
});
