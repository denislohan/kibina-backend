import events from "events"
import {map,io} from './socket'

const eventEmitter = new events.EventEmitter()
eventEmitter.on('topUp', (data)=>{
     const {amount,user} = data
     let socket = map.get(Number(user))  
        if(socket)
          socket.emit('topUp', amount);
    //Socket.emit(1

})
export default eventEmitter;