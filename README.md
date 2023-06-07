# ExpressJs_JWT

.env 
contains a sample access_token_secret and Refresh_token_secret

# authServer
 
Making it easier to understand and code,
authServer.js contains the api's:

#
/login:- 
        
        creats a jwt token and makes it available according to the username, in refreshToken variable, ideally this variable needs to be a localStorage/sessionStorage

/token:-

    the new token is generated according to the available refreshToken, the token api generates new accesstoken with the expiry time.

/logout:- 

    The access token is deleted or killed to restrict the further use of tokens.

generating Access Token:-

        function generateAccesToken(user) {
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30s",
        });
        return accessToken;
        }


# server.js:-

application api for other uses

/post- 

    validates the token code , 
    after tat accoding to the username the relevent data is returned.
    
authenticateToken:-

            function authenticateToken(req,res,next){
            const bearerHeader = req.headers['authorization']
            if(typeof bearerHeader!== 'undefined'){
                const bearer = bearerHeader.split(' ')
                const bearerToken = bearer[1]
                jwt.verify(bearerToken,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
                    if(err){
                    return res.sendStatus(403)
                    }else{
                        req.user=user
                        next()
                    }
                })
            }else{
                res.sendStatus(401)
            }