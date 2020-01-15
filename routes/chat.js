const router = require('express').Router();
const app = require('../index');
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const port = 3600;
const Room = require('../model/Room');
const Message = require('../model/Message');

io.on("connection", socket => {
    console.log("a user connected :D " + socket.id);
    socket.on('room', async data => {
        let roomId = '';
        let lastRoomName = '';//join edilecek oda adı
        let newRoomName = data.room.roomName;//kullanıcıdan gelen oda adı
        let emails = newRoomName.split('@!@!2!@!@');//kullanıcıdan gelen oda adının kesilmiş hali
        let tempRoomName = emails[1] + '@!@!2!@!@' + emails[0];//kullanıcıdan gelen oda adının ters çevirilmiş hali
        const queryRoom2 = await Room.findOne({ name: tempRoomName });
        if (!queryRoom2) {
            const queryRoom3 = await Room.findOne({ name: newRoomName })
            if (!queryRoom3) {
                console.log("q3: " + JSON.stringify(data.room))
                const newRoom = new Room({
                    name: data.room.roomName,
                    user1: data.room.userId,
                    user2: data.room.otherUserId,
                    onModelUser1: 'TeacherUser',
                    onModelUser2: 'TeacherUser',
                });
                await newRoom.save().then(() => {
                    console.log("oda kaydı başarılı: " + JSON.stringify(newRoom));
                });
                roomId = newRoom._id;
                lastRoomName = data.room.roomName;
            }
            else {
                roomId = queryRoom3._id;
                lastRoomName = newRoomName;
            }
        }
        else {
            roomId = queryRoom2._id;
            lastRoomName = tempRoomName;
        }
        console.log("room.name: " + lastRoomName);
        socket.join(lastRoomName, async () => {
            console.log("odaya girdi");
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
                socket.emit(data.room.roomName, { room: lastRoomName, messagess: messages_ })
            });
            console.log(' room işlemleri bitti ' + socket.id)
        })
    })

    socket.on('getChatUsers', async data => {
        console.log("girdi-getchat" + JSON.stringify(data));
        let rooms=[];
        await Room.
            find({ user1: data._id }).
            populate('user1').
            populate('user2').
            exec(function (err, data) {
                if (err) return handleError(err);
                rooms = data;
                console.log(JSON.stringify(rooms));
                socket.emit('getChatUsers', rooms);
            });
    })

    socket.on("chat message", async msg => {
        console.log("girdichat")
        console.log(socket.id + ': ' + msg.message);
        console.log("new msg: " + JSON.stringify(msg));

        const queryRoom = await Room.findOne({ name: msg.room });
        const newMessage = new Message({
            room: queryRoom ? queryRoom._id : '5e0b88330f2313b71857b2f1',
            message_body: msg.message,
            message_status: false,
            sender: msg.senderId,
            onModelUser: msg.onModelUser,
            onModelRoom:'Room'
        });
        await newMessage.save().then(() => {
            console.log("mesaj başarıyla kaydedildi " + queryRoom._id);
        });
        let data = {
            message: msg.message,
            messageId: newMessage._id,
            senderId: msg.senderId
        }
        console.log("gidenveri: " + JSON.stringify(data))
        socket.to(msg.room).emit("chat message", data);
    });
});

server.listen(port, () => console.log("socket io server running on port:" + port));
module.exports = router;