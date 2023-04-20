const bcrypt = require("bcrypt");
let jwt = require('jsonwebtoken');
const config = require('../config/config');



module.exports=  function(express,user) {
    let registerRouter = express.Router();

    registerRouter.post('', async (req,res)=>{
        let hash = await bcrypt.hash(req.body.password,10);
        let username=req.body.username;
        let email=req.body.email;
        let name=req.body.name;

        let token = jwt.sign({
        }, config.secret, {
            expiresIn: 1440
        });

        let newUser=new user({
            username:username,
            email:email,
            name:name,
            password:hash
        })
        newUser.save().then(users=>{
            res.json({
                status: 205,
                token: token,
                user:users
            });

        })

    });

    return registerRouter;

}