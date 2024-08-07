import post from "../../entities/post";
import savedPost from "../../entities/savedPosts";

export default interface IPostInterface {
    createPost(post: post): Promise<post | null>,
    getPostsOne(id: string): Promise<post | null>,
    getPosts(): Promise<post | null>,
    editPost(id: string, postData: Partial<post>): Promise<boolean>,
    deletePost(id: string, userId: string): Promise<boolean | null>,
    likePost(id: string, userId: string): Promise<boolean | null>
    isLiked(id:string,userId: string): Promise<boolean | null>
    addComment(postId: string, comment: any): Promise<boolean>
    getComments(postId: string): Promise<post | null>
    reportPost(postId:string,userId:string,message:string): Promise<boolean>
    getAllReportedPosts(): Promise<post | null>,
    savedPost(post: post,userId:string): Promise<boolean | null>
    getSavedPosts(userId:string): Promise<any[] | null>
}