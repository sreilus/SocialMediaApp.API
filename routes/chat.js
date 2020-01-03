const router = require('express').Router();
const app = require('../index');
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 3600;
const Room = require('../model/Room');
const Message = require('../model/Message');

let messages=[];

io.on("connection", socket => {
    console.log("a user connected :D "+socket.id);
    socket.on('room', async data => {
        socket.join(data.room,async () => {
            
            console.log("odaya girdi");
            let messages_ =[];
            let roomId='';
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
                    console.log("oda kaydı başarılı");
                });
                roomId=newRoom._id;
            }
            else
            {
                roomId=queryRoom._id;
            }
            Message.find({room:roomId}, function (err, messages) {
                console.log("mesajlara girdi: "+roomId)
                messages.forEach(msg => {
                    let data ={
                        messageId:msg._id,
                        message_body:msg.message_body,
                        senderId:msg.sender,
                        created_at:msg.created_at
                    }
                    messages_.push(data)
                });
                console.log("mesajlara girdi: "+roomId+" lenght: "+messages_.length)
                socket.emit(data.room, { room: data.room, messagess: messages_ })
            });
            console.log(' room işlemleri bitti ' + socket.id)
            
        })
    })

    socket.on("chat message",async msg => {
        console.log("girdichat")
        console.log(socket.id + ': ' + msg.message);
        console.log("new msg: "+JSON.stringify(msg));
        
        const queryRoom = await Room.findOne({name:msg.room});
        const newMessage = new Message({
            room:queryRoom ? queryRoom._id :'5e0b88330f2313b71857b2f1',
            message_body:msg.message,
            message_status:false,
            sender:msg.senderId,
            onModelUser:'StudentUser'
        });
        await newMessage.save().then(()=>{
            console.log("mesaj başarıyla kaydedildi "+queryRoom._id);
        });
        let data= {
            message:msg.message,
            messageId:newMessage._id,
            senderId:msg.senderId
        }
        console.log("gidenveri: "+JSON.stringify(data))
        socket.to(msg.room).emit("chat message", data);
    });
});

server.listen(port, () => console.log("socket io server running on port:" + port));
module.exports = router;