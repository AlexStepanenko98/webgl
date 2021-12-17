const express=require('express');


const app=express();


app.use((req,res,next)=>{
	console.log(req.url);
	next();
});


app.get('/',(req,res)=>{
	res.sendFile(__dirname+'/dist/index.html');
});


app.get('/art1',(req,res)=>{
	res.sendFile(__dirname+'/dist/art1.jpg');
});


app.get('/art2',(req,res)=>{
	res.sendFile(__dirname+'/dist/art2.jpg');
});


app.get('/bundle',(req,res)=>{
	res.sendFile(__dirname+'/dist/bundle.js');
});


app.listen(4848,'127.0.0.1',()=>{
	console.log('\x1b[1;33mServer is working...\x1b[0m\n');
});
