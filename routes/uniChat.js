const router = require('express').Router();
const app = require('../index');
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 3700;
const UniversityRoom = require('../model/UniversityRoom');
const Message = require('../model/Message');

io.on("connection", socket => {
    console.log("a user connected :D " + socket.id);
    socket.on('room', async data => {
        console.log('joinedRoom: '+JSON.stringify(data))
        let roomId = '';
        const queryRoom = await UniversityRoom.findOne({ name: data.room.roomName })
        if (!queryRoom) {
            console.log("q3: " + JSON.stringify(data.room))
            const newRoom = new UniversityRoom({
                name: data.room.roomName,
            });
            await newRoom.save().then(() => {
                console.log("oda kaydı başarılı: " + JSON.stringify(newRoom));
            });
            roomId = newRoom._id;
        }
        else {
            roomId = queryRoom._id;
        }
        console.log("room.name: " + data.room.roomName);
        socket.join(data.room.roomName, async () => {
            console.log("odaya girdi "+data.room.roomName);
            let messages_ = [];
            Message.find({ room: roomId }, function (err, messages) {
                console.log("mesajlara girdi: " + roomId)
                messages.forEach(msg => {
                    let data = {
                        messageId: msg._id,
                        message_body: msg.message_body,
                        senderId: msg.sender,
                        created_at: msg.created_at
                    }
                    messages_.push(data)
                });
                console.log("mesajlara girdi: " + roomId + " lenght: " + messages_.length)
                socket.emit(data.room.roomName, { room: data.room.roomName, messagess: messages_ })
            });
            console.log(' room işlemleri bitti ' + socket.id)
        })
    })

    socket.on("chat message", async msg => {
        console.log("girdichat")
        console.log(socket.id + ': ' + msg.message);
        console.log("new msg: " + JSON.stringify(msg));

        const queryRoom = await UniversityRoom.findOne({ name: msg.room });
        console.log('queryRoom: '+JSON.stringify(queryRoom));
        const newMessage = new Message({
            room: queryRoom ? queryRoom._id : '5e0b88330f2313b71857b2f1',
            message_body: msg.message,
            message_status: false,
            sender: msg.senderId,
            onModelUser: msg.onModelUser,
            onModelRoom:'UniRoom'
        });
        console.log('newWW: '+JSON.stringify(newMessage));
        await newMessage.save().then(() => {
            console.log("mesaj başarıyla kaydedildi " + queryRoom._id);
        });
        let data = {
            message: msg.message,
            messageId: newMessage._id,
            senderId: msg.senderId
        }
        console.log("gidenveri: " + JSON.stringify(data))
        console.log('gidenRoom: '+JSON.stringify(msg));
        socket.to(msg.room).emit("chat message", data);
    });
});

server.listen(port, () => console.log("socket io unichatserver running on port:" + port));
module.exports = router;