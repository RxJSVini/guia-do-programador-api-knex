const bcryptjs = require('bcryptjs');
const knex = require('../database/connection');



class User{
    async findAll(){
        try {
            const result = await knex.select(["name", "email","role"]).from("users");
            if(result.length == 0){
                return [];
            }
            return result;
        } catch (error) {
            console.log(error)
        }
    }
    async new(name, email, password){
        const salt =  bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(password, salt);

        try {
            await knex.insert({name, email, password:hash, role:0}).into('users')
        } catch (error) {
            console.log(error)
        }
    }
    async findByEmail(email){
        try {
            const result = await knex.select(["id","name","email","role"]).table("users").where({email:email});
            if(result.length >= 0){
                return result[0];
            } else {
                return result.length
            }


        } catch (error) {
            console.log(error);
        }
    }
    async findEmail(email){
        try {
            const result = await knex.select(["name", "email","role"]).from("users").where({email:email})
            if(result.length == 0 ){
                return false
            }
            return true
        } catch (error) {
            console.log(error);
        }
    }

    async findByPk(id){
        try {
            const result = await knex.select(["id","name","email","role"]).table("users").where({id:id});
            if(result.length > 0){
                return result[0];
            } else {
                return result.length
            }


        } catch (error) {
            console.log(error);
        }
    }

    async update(id,email,name,role){

        var user = await this.findByPk(id);

        if(user != undefined){

            var editUser = {};

            if(email != undefined){ 
                if(email != user.email){
                   var result = await this.findEmail(email);
                   if(result == false){
                        editUser.email = email;
                   }else{
                        return {status: false,err: "O e-mail já está cadastrado"}
                   }
                }
            }

            if(name != undefined){
                editUser.name = name;
            }

            if(role != undefined){
                editUser.role = role;
            }

            try{
                await knex.update(editUser).where({id: id}).table("users");
                return {status: true}
            }catch(err){
                return {status: false,err: err}
            }
            
        }else{
            return {status: false,err: "O usuário não existe!"}
        }


        
    }

    async delete(id){
        const user = await this.findByPk(id);
        if(user != undefined){
            try {
                await knex.delete().where({id:id}).table("users")
                return { status:true }
            } catch (error) {
              console.log(error)  
            }
        }else {
            return {status:false,err:"Usuário não existe, portanto não pode ser deletado." }
        }

    }

    async changePassword(newpassword, id, token){
        const salt =  bcryptjs.genSaltSync(10);
        const hash = bcryptjs.hashSync(newpassword, salt);
        await knex.update({password:hash}).where({id:id}).table("users");
       
    }

    async auth(email, password){
        try{
            const result = await knex.select(["email", "password"]).from("users").where({email:email})
            if(result.length > 0){
                const verifyPassowrd = bcryptjs.compareSync(password, result[0].password)
                if(verifyPassowrd){
                    return {status:true}
                } else {
                    return {status:false};
                }
            } else {
                return {status:false};
            }
        }catch(e){
            return {status:false};
        }
    }


}

module.exports = new User();