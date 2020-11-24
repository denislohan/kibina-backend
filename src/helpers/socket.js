import TokenHelper from '../utils/authHelpers/token_util'
const map = new Map()
let token;

const io = (io_) =>{
    io_.on('connection', (socket)=>{
        token = socket.handshake.query.token

        try{
            const tokenData = TokenHelper.decodeToken(token || 'no Token', process.env.JWTSK)
            let user = tokenData
            socket.user_ref = user.id
            map.set(socket.user_ref ,socket)
            console.log(socket.id, "connected", map.size)

            console.log(map.keys())
        } catch(e){
            console.log(e,token)
            socket.emit('forceDisconnect')

        }

        socket.on('disconnect', ()=>{
            console.log(socket.id, "disconnected")
            map.delete(socket.user_ref )
        })
    })
    
}

export {
    map, io
};



