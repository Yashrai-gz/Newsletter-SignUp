const express= require("express");
const request= require("request");
const bodyParser = require("body-parser");
const https=require("https");
const {auth} =require("./demo")


const app= express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req,res)=>{

    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res)=>{

    const firstName= req.body.fname;
    const lastNmae=req.body.lname;
    const email=req.body.email;

    var data={
        members:[
            {
                email_address:email,
                status:'subscribed',
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastNmae
                }
            }
        ]
    };

    var jsonData= JSON.stringify(data);

    const url= "https://us14.api.mailchimp.com/3.0/lists/2d0b165be1";
    
    const options={
        method: "POST",
        auth:auth
    };


    const request= https.request(url, options, function(response){
        
        if(response.statusCode===200){
            res.sendFile(__dirname + "/success.html");
        }
        else{

            res.sendFile(__dirname + "/failure.html");
        }
        
        
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure",(req, res)=>{
    res.redirect("/");
} );

app.listen(process.env.PORT || 3000, ()=>{
    console.log("server is running on port: 3000");
});






