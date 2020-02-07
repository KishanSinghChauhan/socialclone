const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req,res){
    let posts = await  Post.find({})
        .sort('-createdAt')    
        .populate('user')
        .populate({
            path:'comments',
            populate:{
                path:'user'
        }
    });
    return res.json(200,{
        message:"List of posts",
        posts:posts
    })
}


module.exports.destroy =async function(req,res){
    try{
        let post = await Post.findById(req.params.id);
        
        // if(post.user == req.user.id){
            post.remove();
            
            await Comment.deleteMany({post:req.param.id});
            
            // if(req.xhr){
            //     return res.status(200).json({
            //         data:{
            //             post_id:req.params.id
            //         },
            //         message:"Post deleted"
            //     });
            // }

            return res.json(200,{
                message:"post deleted successfully"
                
            })

        // }else{
        //     req.flash('success','You can\'t delete this post');

        //     return res.redirect('back');

        // }
        
        } catch(err){
            console.log('error',err);
            
            

            return res.json(200,{
                message:"internal server error"
            })
        }
    }
