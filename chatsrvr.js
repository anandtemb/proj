const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const hbs = require('hbs')
const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017',{ useNewUrlParser:true })

var PORT = process.env.PORT || 8000

server.listen(PORT,()=>{
    console.log('runninn on %s',PORT)
})

app.set('view engine','hbs')

app.use(express.static(__dirname+'/views'))

app.get('/',(req,res)=>{
    console.log('this is GET !')

    const name = req.query.name

    res.render('srvr.hbs',{
        name:name,
        port:PORT
    })
})

const setDB = dbname =>
    client.connect()
        .then(()=>client.db(dbname))
        .catch(err => console.log('Error',err))

io.on('connection',(socket)=>{
    console.log('connected')

    socket.on('senddata',(data)=>{
        console.log(data)

        setDB('chatdb2').then(db => {
            const chats = db.collection('CHAT2')

            const chatcursor = chats.find().sort({ _id:1 }).toArray()
            chatcursor.then((ch)=>{
                console.log(ch)
                socket.emit('chata',ch)
            }).catch(err => console.log(err))
            
        })
    })

    socket.on('newuser',(data)=>{
        console.log("new ",data)
        
        setDB('chatdb2').then(db => {
            const chats = db.collection('CHAT2')
            
            console.log(data.name)
            const cursor = chats.find({
                name:data.name
            }).toArray()
            
            /*.then(()=> {console.log('works')})
            .catch(err => console.log('EORORO'))*/

            if(cursor.length)
            {
                cursor.then((arr)=>{
                    console.log(arr)
                    console.log(arr[0]._id)
                    //console.log(ObjectId(arr[0]._id).getTimestamp().toString())
    
                    let date = arr[0]._id.getTimestamp()
                    console.log(date)
    
                    let date2 = new Date( parseInt(arr[0]._id.toString().substring(0,8)))
                    console.log(date2)
                })
            }

            console.log(cursor)

            chats.insertOne({
                name:data.name,
                chat:data.chat
            }).then(()=>console.log('inserted',Date()))
            .catch(err => console.log('ERROR'))
        })
        
        socket.broadcast.emit('newmsg',data)
    })

    socket.on('clear',(data)=>{
        /*console.log(chats)
        
        chats.find((ele,i,chats)=>{
            
            console.log('ele: ',ele)
            
            if(ele.name==data) 
                chats.splice(i,1)
        
            return false
        })*/

        console.log('clearing :',chats)
    })
})
