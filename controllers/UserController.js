const User = require('../models/User');
const PasswordToken = require('../models/PasswordToken');
const jwtConfig = require('../config/jwtConfig')
const jwt = require('jsonwebtoken');


class UserController{
    async index(req, res){
        const users = await User.findAll();
        return res.status(200).json(users)
    }
    async create(req, res){
        const {name, email, password} = req.body;
        if(name == undefined){
            return res.status(400).json({error:'Name não pode ser vázio'})
        }else if(email == undefined){
            return res.status(400).json({error:'Email não pode ser vázio'})
        } else if(password == undefined){
            return res.status(400).json({error:'Password não pode ser vázio'})
        }
        const emailExists = await User.findEmail(email)
        if(emailExists){
            return res.status(409).json({error:'Usuário ja cadastrado no banco de dados'})
        } else {
            await User.new( name, email, password);
            return res.status(201).json({message:'Usuário criado com sucesso!'})
        }
        
    }


    async edit(req, res){
        var {id, name, role, email} = req.body;
        var result = await User.update(id,email,name,role);
        if(result != undefined){
            if(result.status){
                return res.status(201).json({message:'Usuário atualizado com sucesso!'})
            }else{
                return res.status(201).json(result.err)
            
            }
        }else{
            res.status(406).json({message:"Ocorreu um erro no servidor!"});
        }
    }

    async remove(req, res){
        const { id } = req.params
        if(isNaN(id)){
            return res.status(400).json({error:'Parametros inválidos'})
        }else {
            const result = await User.delete(id);
            if(result.status == true){
                return res.status(201).json({message:"Usuário deletado com sucesso"})
            } else {
                return res.status(406).json({error:result.err})
            }
        }
    }

    async recoveryPassword(req, res){
        const email = req.body.email;
        var result = await PasswordToken.create(email);
        if(result.status == true){
            return res.status(200).json({message:""+ result.token})
        } else {
            return res.status(406).json({error:status.err})
        }
      
    }

    async changePassword(req, res){
        const {token, password} = req.body;
        const isTokenValid = await PasswordToken.validate(token);
        if(isTokenValid.status){
            await User.changePassword(password,isTokenValid.token.user_id,isTokenValid.token.token);
            await PasswordToken.setUsed(token)
            return res.status(200).json({message:'Senha atualizada com sucesso'})
        } else {
            return res.status(406).json({error:'Erro ao processar requisição, alteração de senha não concluida!'})
        }
    }
    
    async login(req, res){
        const {email, password} = req.body;
        const user = await User.auth(email, password)
        if(user.status){
            const {secret , expiresIn} = jwtConfig;
            const tk  = jwt.sign({},secret,{subject:String(email)}, expiresIn)
            return res.json({Authentication:'Usuário Autenticado com sucesso!', token:tk})
        }
        return res.status(401).json({error:'Usuário não autenticado! Login ou senha inválidos(a)!'});
       
    }




}

module.exports  = new UserController();