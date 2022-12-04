const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
var serviceAccount = require("./key_project.json");
var dateTime = require('node-datetime');
const IS_EMULATOR = ((typeof process.env.FUNCTIONS_EMULATOR === 'boolean' && process.env.FUNCTIONS_EMULATOR) || process.env.FUNCTIONS_EMULATOR === 'true');

if (IS_EMULATOR) {
    firestore.settings({
      host: 'localhost',
      port: '3000',
      ssl: false
    })
}

const
     { FieldValue } = require('firebase-admin/firestore');
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
var express = require('express');  
var app = express()  
var u='a';
var k = 'a';
var n= 'a';
var d='a';
var iss = 'a';
app.set('view engine','ejs');
const appLocals = require('./app-local.js');
app.locals = appLocals

app.get('/website', function(req, res){
    res.render("main",{});
})
app.get('/signup', function (req, res) { 
    res.render("signup",{});
})
app.get("/signupSubmit1", function (req, res) { 
    var arr1 = ['05', '66', '12', '04', '02'];
    var arr2 = ['1a', '1A', '5a', '5A'];
    var flag = 0;
    var f = 0;
    for(var i=0;i<arr1.length;i++){
        if(req.query.email.slice(6,8) == arr1[i]){
            flag = 1;
            break;
        }
    }
    if(flag != 0){
        flag = 0;
        for(var i=0;i<arr2.length;i++){
            if(req.query.email.slice(4,6) == arr2[i]){
                flag = 1;
                break;
            }
        }
        if(flag != 0){
            if(((req.query.email.slice(8,9) >= 'a') && (req.query.email.slice(8,8) <= 'i')) || ((req.query.email.slice(8,8) >= 'A') && (req.query.email.slice(8,8) <= 'I'))){
                if(req.query.email.slice(8,9) == 'i' || req.query.email.slice(8,9) == 'I'){
                    if(req.query.email.slice(9,10) == '0'){
                        if(req.query.email.slice(2,4) == 'wh' || req.query.email.slice(2,4) == 'WH'){
                            f = 1;
                        }
                        else{
                            f = 0;
                        }
                    }
                    else{
                        f = 0;
                    }
                }
                else{
                    if(req.query.email.slice(9,10) >= '0' && req.query.email.slice(9,9) <= '9'){
                        if(req.query.email.slice(2,4) == 'wh' || req.query.email.slice(2,4) == 'WH'){
                            f = 1;
                        }
                    }
                }
            }
            else if(req.query.email.slice(8,9) >= '1' && req.query.email.slice(8,9) <= '9'){
                if(req.query.email.slice(9,10) >= '0' && req.query.email.slice(9,10) <= '9'){
                    f = 1;
                }
                else{
                    f = 0;
                }
            }
            else if(req.query.email.slice(8,9) == '0'){
                if(req.query.email.slice(9,10) >= '1' && req.query.email.slice(9,10) <= '9'){
                    f = 1;
                }
                else{
                    f = 0;
                }
            }
            else{
                f = 0;
            }
        }
    }
    if(f == 1){
        db.collection("data_users").add({
            name: req.query.user,
            email: req.query.email,
            phone: req.query.phone,
            address: req.query.add,
            password: req.query.pass,
            rollno: req.query.roll,
            count: 0,
            gri:{}
        })
        .then(()=>{
            var obj = ["register done successfully"];
            res.render("msg", {data:obj});
        })
    }
    else{
        var obj = ["invalid credentials"];
        res.render("msg", {data:obj});
    }
});
app.get("/signupSubmit2",function(req, res){
    db.collection('data_faculty').add({
        name: req.query.user,
        email: req.query.email,
        phone: req.query.phone,
        address: req.query.add,
        password: req.query.pass,
        dep : req.query.id
    }).then(()=>{
        var obj = ["register done successfully"];
        res.render("msg", {data:obj});
    })
});        
app.get('/login', function (req, res) { 
    res.render("login", {});
})
app.get("/loginSubmit", function(req, res){
    n = req.query.type_of_login;
    u = req.query.email;
    if(n == 'user'){
        db.collection("data_users").where('email', '==', req.query.email).where('password','==',req.query.pass).get().then((docs)=>{
            var flag = false;
            docs.forEach((doc)=>{
                flag = true;
                let array1 = {rollno : doc.data().rollno};
                res.render("stuDashboard", {data: array1});
            })
            if(flag == false){
                var obj = ["invalid credentials"];
                res.render("msg", {data:obj});
            }
        })
    }
    else if(n == 'faculty'){
        db.collection("data_faculty").where('email', '==', req.query.email).where('password','==',req.query.pass).get().then((docs)=>{
            var flag = false;
            docs.forEach((doc)=>{
                flag = true;
                d = doc.data().dep;
                res.render("facDashboard", {});
            })
            if(flag == false){
                var obj = ["invalid credentials"];
                res.render("msg", {data:obj});
            }
        })
        
    }
});
app.get("/aboutcomplain_t", function(req, res){
    res.render("category", {});
});
app.get("/aboutcomplain", function(req, res){
    res.render("category", {});
});
app.get("/aboutview", function(req, res){
    db.collection("data_users").where('email', '==', u).get().then((docs)=>{
        let arr =[];
        let rollno;
        docs.forEach((doc)=>{
            rollno = doc.data().rollno;
            for(var i=0;i<doc.data().gri.length;i++){
               let a=[doc.data().gri[i].issue, doc.data().gri[i].status];
               arr.push(a);
            }
        })
        if(arr.length > 0){
            res.render('show', {data: [rollno, arr]});
        }
        else{
            var obj = ["no grievances"];
            res.render("msg", {data:obj});
        }
    })
});
app.get("/webpageSubmit", function(req, res){
    k = req.query.type1;
    if(n == 'user'){
        res.render("complain", {});
    }
    else if(n == 'faculty'){
        db.collection('data_users').where('gri','!=',[]).get().then((docs1)=>{
            let student_complaint = [];
            var flag = false;
            docs1.forEach((doc1)=>{
                flag = true;
                for(var i=0;i<doc1.data().gri.length;i++){
                    if(doc1.data().gri[i].type_complain == k){
                        if(doc1.data().gri[i].status == "pending"){
                            if(doc1.data().rollno.slice(6,8) == d){
                                let arr = {rollno : doc1.data().rollno,issue: doc1.data().gri[i].issue, time: doc1.data().gri[i].dt, type: doc1.data().gri[i].type_complain, cnt: doc1.data().gri[i].cnt};
                                student_complaint.push(arr);
                            }
                        }
                    }
                }
            });
            if(student_complaint.length > 0){
                res.render("facShow",{data: student_complaint});
            }
            else{
                var obj = ["no grievances found"];
                res.render("msg", {data:obj});
            }
        }); 
    }
});
app.get("/web1Submit", function(req, res){
    if(req.query.c == 'complain'){
        db.collection("data_users").where('email', '==', u).get().then((docs)=>{
            var flag = false;
            docs.forEach((doc)=>{
                flag = true;
                var dt = dateTime.create();
                var formatted = dt.format('Y-m-dH:M:S');
                let ar = {type_complain: k,status: "pending", issue: req.query.t,dt: formatted, cnt: doc.data().count+1};
                db.collection('data_users').doc(doc.id).update({
                    count: doc.data().count + 1,
                    gri: FieldValue.arrayUnion(ar),
                 }, { merge: true }).catch(e => {
                    console.error(e);
                 });

            }); 
            if(flag == true){
                var obj = ["Complaint sent Successfully"];
                res.render("msg", {data:obj});
            }
       });
    }
    else if(req.query.v == 'view'){
        db.collection("data_users").where('email', '==', u).get().then((docs)=>{
            let arr =[];
            let rollno;
            docs.forEach((doc)=>{
                rollno = doc.data().rollno;
                for(var i=0;i<doc.data().gri.length;i++){
                   let a=[doc.data().gri[i].issue, doc.data().gri[i].status];
                   arr.push(a);
                }
            })
            if(arr.length > 0){
                res.render('show', {data: [rollno, arr]});
            }
            else{
                var obj = ["no grievances found"];
                res.render("msg", {data:obj});
            }
        })
    }
});
app.get("/web2Submit", function(req, res){
    db.collection('data_users').where('rollno', '==', req.query.rollno).get().then((docs)=>{
        var flag = false;
        docs.forEach((doc)=>{
            flag = true;
            for(var i=0;i<doc.data().gri.length;i++){
                if(doc.data().gri[i].cnt == req.query.cnt){
                    console.log("adfafd");
                    console.log(i);
                    console.log(doc.data().gri[i]);
                    iss = doc.data().gri[i].issue;
                    const ar = {type_complain: req.query.type,status: req.query.status, issue: iss,dt: req.query.time, cnt: req.query.cnt};
                    db.collection('data_users').doc(doc.id).update({
                        gri: FieldValue.arrayRemove(doc.data().gri[i])
                    });
                    db.collection('data_users').doc(doc.id).update({
                        gri: FieldValue.arrayUnion(ar),
                     }, { merge: true }).catch(e => {
                        console.error(e);
                     });
                }
            }
        });
        if(flag == true){
            var obj = ["updated successfully"];
            res.render("msg", {data:obj});
        }
    });
});
app.listen(3000, function () {  
    console.log('Example app listening on port 3000!')  
})
