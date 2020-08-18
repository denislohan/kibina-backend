
const isAdmin = (req,res,next) => {
    const user_role = req.user.role;
    console.log ("user===>", req.user)
   
    if(user_role == 'admin')
         next()
    else
        return res.status(403).send({error:"forbidden"})

}


export {
    isAdmin
}

