const parseUser = (req) =>{
    if(req.user){
        if(req.user.provider == 'facebook'){
            req.body = {}
            req.body.email = req.user.emails[0].value
            req.body.username = req.user.name.givenName+"-"+req.user.id
            req.body.password =  req.user.provider+req.user.id
            req.body.provider = req.user.provider
            req.body.provider_id = req.user.id
        }
        else if (req.user.provider == 'google'){
            req.body.email = req.user.emails[0].value
            req.body.username = req.user.emails[0].value.split('@')[0]
            req.body.password =  req.user.provider+req.user.id
            req.body.provider = req.user.provider
            req.body.provider_id = req.user.id
        }
    // setting redirect flag for social auth
    req.isSocial = true; 
    }
return req;
}

export {
    parseUser
}