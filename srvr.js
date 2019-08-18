const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const hbs = require('hbs')

var PORT = process.env.PORT || 7000

server.listen(PORT,()=>{
    console.log('runninn on %s',PORT)
})

app.set('view engine','hbs')

app.use(express.static(__dirname+'/views'))

app.get('/',(req,res)=>{
    console.log('this is GET !')

    const name = req.query.name

    res.render('srvr.hbs',{
        //key pairs here !
        name:name,
        port:PORT
    })
})

app.get('/next',(req,res)=>{
    res.send(`HELLO successful`)
})

app.get('/tello',(req,res)=>{
    res.sendFile(__dirname+'/views/cover.html')
})

var chats=[]

io.on('connection',(socket)=>{
    console.log('connected')

    socket.on('newuser',(data)=>{
        console.log("new ",data)
        
        var ele = chats.find((ele,i,chats)=>{
            return ele.name==data.name
        })
        
        console.log(ele)

        /*if(chats.length==0 || !ele) chats.push(data)
        else
        {*/
            chats.push(data)
            socket.broadcast.emit('newmsg',data)
        //}
        console.log(chats)
    })

    socket.on('clear',(data)=>{
        console.log(chats)
        
        chats.find((ele,i,chats)=>{
            
            console.log('ele: ',ele)
            
            if(ele.name==data) 
                chats.splice(i,1)
        
            return false
        })

        console.log(chats)
    })
})