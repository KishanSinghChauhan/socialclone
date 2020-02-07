{
    // method to post data with ajax
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type:'post',
                url:'/posts/create',
                data:newPostForm.serialize(),
                success:function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list>ul').prepend(newPost);
                    deletePost($(' .delete-post-button',newPost));
                },error:function(error){
                    console.log(error.responseText);
                }
            });
        });
    }
    //method to create a post in Dom
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">
        <p>
           
                <small>
                    <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
                </small>
               
           ${ post.content}
            <br>
            <small>
                ${post.user.name}
            </small>
        </p>
    <div class="post-comments">
  
    <form action="/comments/create" method="POST">
        <input type="text" name="content"  placeholder="comment here"></input>
        <input type="hidden" name="post" value="${post._id}">
        <input type="submit" value="comment">
    
    </form>
 
    <div class="post-comments-list">
        <ul id="post-comments-${post._id}">
          
        </ul>
    </div>
    </div>
    </li>`)
    }

    //method to delete post
    let deletePost = function(deletelink){
        $(deletelink).click(function(e){
            e.preventDefault();

            $.ajax({
                type:'get',
                url:$(deletelink).prop('href'),
                success:function(data){
                    $('#post-${data.data.post_id}').remove();
                },error:function(error){
                    console.log(error.responseText);
                }
            });
        });
    }
    createPost();
}