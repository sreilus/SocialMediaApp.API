const router = require('express').Router();
const app = require('../index');
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 3600;
const Room = require('../model/Room');
const Message = require('../model/Message');

let messages=[];

io.on("connection", socket => {
    console.log("a user connected :D");
    socket.on('room', async data => {
        socket.join(data.room,async () => {
            
            console.log("odaya girdi");
            const queryRoom = await Room.findOne({name:data.room});
            if(!queryRoom)
            {
                const newRoom = new Room({
                    name:data.room,
                    user1:"5e04e43b7ee8c38698b1dadd",
                    user2:"5e04e3d77ee8c38698b1dadb",
                    onModelUser1:'StudentUser',
                    onModelUser2:'StudentUser',
                });
                await newRoom.save().then(()=>{
                    console.log("kayıt başarılı");
                });
            }
            console.log(' odaya giridli ' + socket.id)
            socket.emit(data.room, { room: data.room, messagess: messages })
        })
    })

    socket.on("chat message", msg => {
        console.log(socket.id + ': ' + msg.message);
        messages.push(msg.message);
        console.log(messages);
        io.emit("chat message", msg.message);
        // const chat = new Chat({
        //     text: msg
        // });
        // chat.save().then(() => console.log('kaydedildi.'));
    });
});

server.listen(port, () => console.log("socket io server running on port:" + port));
module.exports = router;