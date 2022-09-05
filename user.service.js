const Sequelize                 = require('sequelize');
const {Post, Comment, Friend}   = require('../models');
const Op = Sequelize.Op;

export class User extends ActiveRecords{
    constructor(id) {
        super(id);
    }
    async static getCommentsForPosts(){
        let posts = await Post.findAll({
            where: {
                user_id: this.id
            }
        })
        let result = [];

        for (let post of posts) {
            let comment = await Comment.findAll({
                where: {
                    post_id: post.id
                }
            })
            result.push(comment);
        }
        return result;
    }

    async getFriends(status= 1) {
        let friends = await Friend.findAll({
            where: {
                [Op.and]: [
                    { user_id: this.id },
                    { status: status}
                ]
            }
        })

        return friends;
    }

    async addFriend(userId) {
        let friend = Friend.findOne({
            where: {
                user_id: this.id
            }
        });

        friend.friend_id = userId;
        friend.status = 1;
        friend.save()


        return true;
    }

    async deleteFriend(userId){
       let friend = Friend.findOne({
           where: {
               friend_id: userId
           }
       })

        await friend.destroy();
       return true;
    }

    async hasPosts(){
        let posts = await Post.findAll({
            where: {
                user_id: this.id
            }
        })

        return posts.length > 0
    }

    async hasActivePosts(){
        let activePosts = await Post.findAll({
            where: {
                user_id: this.id,
                status: 1
            }
        })

        return activePosts.length > 0
    }
}