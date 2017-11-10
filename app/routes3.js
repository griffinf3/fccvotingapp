var User       = require('../app/models/user');
var Poll       = require('../app/models/poll');
var Option     = require('../app/models/option');

module.exports = function(app, passport) {
  
var all3Polls = function (req, res, next) {
    var Polls = [{}];
    Polls[0] = {question: 'poll 1', options: [{}, {option: 'option 1', votes: 0}, {option: 'option 2', votes: 0}, {option: 'option 3', votes: 0}]};
    Polls[1] =  {question: 'poll 2', options: [{},{option: 'option 1', votes: 0}, {option: 'option 2', votes: 0}, {option: 'option 3', votes: 0}]};
    Polls[2] =  {question: 'poll 3', options: [{},{option: 'option 1', votes: 0}, {option: 'option 2', votes: 0}, {option: 'option 3', votes: 0}]};    
  req.all3Polls = Polls;
  next()
}

app.use(all3Polls)

app.get('/', isLoggedIn, function (req, res) {
   var message = req.param('alertMessage');
   // console.log('message'+ message);
   var aM ='';
   if (message != undefined && message != '')
       aM = message; else  aM = ""; 
      
var allPolls = req.all3Polls;  
var op1;
var op2;
var totalPolls=0;

Poll.find({ 'userid' :  req.user._id }, function(err, polls) {    
                 if (err) {}
                 else
                 { totalPolls = polls.length; 
				  var count = 1;
                     for (var i=0; i<totalPolls; i++)
					 {
					    if (polls[i].poll.showcase == true && count <=3)  
                         {var opts = [{}];                               
                          for (var j=1; j<polls[i].poll.options.length; j++ )
                        {opts.push({option:    polls[i].poll.options[j].option,votes:                                                 polls[i].poll.options[j].votes});
                        }
                        allPolls[count-1] = {question: polls[i].poll.question, options: opts};
						count = count + 1;
						} 
				     }
                   callback("", allPolls, totalPolls);
				  }
                   
				  });
 
  function callback(error, allPolls, totalPolls){ 
  Option.find({ 'userid' :  req.user._id }, function(err, doc) {
                  if (err) {}
                  else
                  {
                  if (doc.length >=1)
                     { op1 = doc[0].option1;
                     op2 = doc[0].option2;
                      
             res.render('index.ejs', {logstatus: ' Log out', polls: allPolls, option1: op1, option2: op2, totalPolls: totalPolls, alertMessage: aM});
                     }
                 else
                    {
                     op1 = 'block';
                     op2 = 'block';   
             res.render('index.ejs', {logstatus: ' Log out', polls: allPolls, option1: op1, option2: op2, totalPolls:totalPolls, alertMessage: aM});}}});}});

app.get('/index', function(req, res) {res.redirect('/');});
    
// PROFILE SECTION =========================
app.get('/profile', isLoggedIn, function(req, res) {  
        if (req.user.local.username) 
        {res.redirect('/');}
        else{res.redirect('/connect/local')}
        });
    
app.post('/updateOptions', isLoggedIn, function(req, res) {
        //update options here.
        var op1 = req.body.option1;
        var op2 = req.body.option2;
        var id = req.user._id;
        var id = req.user._id; 
        Option.findOne({ 'userid' :  id }, function(err, doc) {    
        if (err) {}
                   else
                   { 
                     if (doc) { 
                       var conditions = {'userid' : id};
                       var update = { $set: { 'option1': op1, 'option2': op2}}; 
                       var options ={};
                        var callback = function(){};
                       Option.update(conditions, update, options, callback); 
                     }
                     else {
                       var newUserOptions = new Option(
                           {
                       userid: req.user._id,
                       option1: op1,
                       option2: op2
                            }
                       );  
                       // save  
                        newUserOptions.save(function(err) {
                              if (err) throw err;
                              return (null, newUserOptions);   
                          });
                         }
                    res.redirect('/');
                 }    
             });      
    });
    
    app.get('/signlog', isLoggedIn2, function(req, res) {
    var allPolls = req.all3Polls;         
        req.logout();
        res.render('index.ejs',{ logstatus: ' Login/Signup', polls: allPolls, option1: 'block', option2: 'block', totalPolls: 0, alertMessage: ''});
    }); 
    
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));   
    
    
     // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', 
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
    
     app.get('/create', isLoggedIn, function(req, res) {
        var totalPolls =0;
        Poll.find({ 'userid' :  req.user._id }, function(err, polls) {    
                 if (err) {}
                 else{totalPolls = polls.length;}
        
         res.render('create.ejs', {totalPolls: totalPolls, question: 'poll 1'});
        }); 
       
    });
    
app.get('/view', isLoggedIn, function(req, res) { 
                    var viewtype = req.param('type');
                    var id = req.user._id;
                    var username = req.user.local.username;
                    var totalPolls=0;

Poll.find({ 'userid' :  req.user._id }, function(err, polls) {    
                 if (err) {}
                 else
                 { totalPolls = polls.length;
                   callback('', totalPolls);} 
});
      
 function callback(error, totalPolls)
    {
                    if (viewtype== 'public')
                    {
                        Poll.find({ 'poll.public' : true}, function(err, doc) {    
                      if (err) {}
                        else
                        {if (doc) {res.send('Ok' +doc);}}});}
                    else
                    {Poll.find({ 'userid' : id}, function(err, doc) {    
                      if (err) {}
                        else
                        {    
                            if (doc) {
                                var lg = doc.length;
                                var questionlist = [];
                                for (var i=0; i<lg; i++)
                                {
                                questionlist.push(doc[i].poll.question)}                         
                                res.render('view.ejs', {questionlist: questionlist, qnamelist: [], username: username, viewtype: viewtype, logstatus: ' Log out', totalPolls: totalPolls});
                            }
                            else  {
                               //We should probably never come here.
                               // res.send(question);
                                res.redirect('/');}}});}
    
    }
    });
  
//user not logged in and wants to view public listing of polls.
app.get('/view2', function(req, res) {
    
    Poll.find({ 'poll.public' : true}, function(err, doc) {    
                      if (err) {}
                        else
                        {if (doc) { 
                          var pusername;
                          var namelist = [];
                          var nameobj = {};
                          User.find({},function(err, puser) { 
                                 if (err) {} else { 
                                    for (var i = 0; i< puser.length; i++)  
                                    {pusername = puser[i].local.username;
                                     nameobj = {id: puser[i]._id, username: pusername};
                                     namelist.push(nameobj);} 
                                     callback("",namelist);
                                    }});
                             function callback (error, list){    
                              var lg = doc.length;
                              var qnamelist = [];
                              var qnameobj = {};
                              var pid;
                              var pq;
                              var nobj;
                             for (var i=0; i<lg; i++)
                             {pid= doc[i].userid;
                              pq = doc[i].poll.question;
                              if (list.id == pid)
                              {
                              nobj = list.filter(function (list) {return list.id == pid });
                              qnameobj = {username: nobj[0].username, question: pq};
                              qnamelist.push(qnameobj);
                             } }
                             
res.render('view.ejs', {questionlist: [], qnamelist: qnamelist, username: '', viewtype: "public", logstatus: ' Login/Signup',totalPolls:0});   
                            } }
                         else { 
                         
res.render('view.ejs', {questionlist: [], qnamelist: [], username: '', viewtype: "public", logstatus: ' Login/Signup',totalPolls:0});
                         
                         }
                        } });
});
    
 app.get('/edit', isLoggedIn, function(req, res) {
                    var id = req.user._id;
                    var username = req.user.local.username;
                    Poll.find({ 'userid' : id}, function(err, doc) {    
                    if (err) {}
                        else
                        {    
                            if (doc) {
                                var lg = doc.length;
                                var questionlist = [];
                                var sclist = [];
                                var publist = [];
                                for (i=0; i<lg; i++)
                                {
                                questionlist.push(doc[i].poll.question)
                                sclist.push(doc[i].poll.showcase)
                                publist.push(doc[i].poll.public)
                                } 
                                if (lg>0)res.render('edit.ejs', {questionlist: questionlist, username:username, sclist: sclist, publist: publist}); else res.redirect('/');
                            }
                            
                            else  {
                                res.redirect('/');
                                }               
                        }});
    });
    
function findDelete(req, res, next) {
    var id = req.user._id;      
    var question = req.body.question;
    Poll.findOneAndRemove({'userid' : id, 'poll.question' : question}, function (err, doc, next) {
    if(err)throw err;
	else if (!doc) {
    Poll.findOneAndRemove({'userid' : id, 'poll.question' : question+ '?'}, function (err, doc, next) {
    if(err)throw err;});    
    }  
    });   
return next(); 
}
    
app.post('/create', findDelete, function(req, res) { 
    var id = req.user._id;      
    var question = req.body.question;
    var options = [{}]; 
  for (i=0; i<req.body.options.length; i++)
  {options.push({option: req.body.options[i], votes: 0});}
    var showCase =  req.body.showcase;
    var SC= false;
    if (showCase =='showcase') SC = true; 
// create new poll document for the user.  
var newPollUser = new Poll({userid: req.user._id, poll: {question: question, showcase: SC,options: options, public: true}}); 
                       
// save  
newPollUser.save(function(err) {
                              if (err) throw err;
res.redirect('/');
   
});
  
    
    
    

});
      
 app.post('/create2', isLoggedIn2, function(req, res) { 
    var questionNo = req.body.question;
    var sc =  req.body.sc;
    var pub = req.body.pub;
    var qlist = JSON.parse(req.body.qlist);   
    var id = req.user._id;
    var username = req.user.local.username;
                    Poll.find({ 'userid' : id}, function(err, doc) {    
                    if (err) {}
                        else
                        {    
                            if (doc) {
                                var lg = doc.length;
                                var question= doc[questionNo-1].poll.question;
                                var options = doc[questionNo-1].poll.options; 
                                var ops =[];
                                var opt = {};
                                for (var i = 1; i<options.length; i++)
                                {opt = {option: options[i].option}
                                ops.push(opt); 
                                }
                        
                               res.render('create2.ejs', {username: username, logstatus: ' Log out', question:question, options: ops, sc:sc, pub:pub, qlist:qlist}); 
                             
                                
                            }
                            else  {
                               //We should probably never come here.
                                res.redirect('/');
                                  }               
                        }});  
}); 
       
app.post('/voting', function(req, res) {
    var question= req.body.question;
    var username = req.body.username;
    var option = req.body.option;
    var message1 = 'Your vote has been recorded.';
    var message2 = "There was an error in recording this vote."
    var status;
    if (req.user)
    {
       status = " Log out"; 
    }
    else{status = " Login/Signup";}  
//record this vote if both the username and question can be found in the polls collection.  
  User.findOne({'local.username' : username}, function(err, user) {    
           if (err) {res.send('error0');}
           else
            if (user) {
                   var id = user._id;  
                   var conditions = {'userid' : id, 'poll.question' : question, 'poll.options.option': option};
                   var update = { $inc: { 'poll.options.$.votes': 1 }};
                   var options = { multi: false};

                     Poll.update(conditions, update, options, callback);
                     function callback (err, numAffected) {
                         
                         
                          if (numAffected.n == 0)
                         
                       //try again using a trailing question mark.
                       { var conditions = {'userid' : id, 'poll.question' : question+ '?', 'poll.options.option':option};
                         var update = { $inc: { 'poll.options.$.votes': 1 }};
                         var options = { multi: false};
                         Poll.update(conditions, update, options, callback2);
                        function callback2 (err, numAffected) {if (numAffected.n == 0)
                       {
                           //polling question could not be found; 
                            callback3();
                       }
                            else {
                                //vote recorded."
                              callback3(); 
                                                       }}
                       }  
                        else {
                            //vote recorded."
                             callback3(); 
                        }}}
            else { 
                //no username found.
    callback3(); 
            }});  
    
function callback3(){ 
  var allPolls = req.all3Polls;
 User.findOne({'local.username' : username}, function(err, userdoc) {    
           if (err) { res.send('error1');}
           else
            {
            if (userdoc) 
              {//the user exists but does the poll exist?
                var id = userdoc._id;
                 Poll.findOne({ 'userid' :  id, 'poll.question' : question}, function(err, doc) {    
                  if (err) {res.send('error2');}
                  else 
                  if (doc) {
                     //the question was found
                         var opts = [{}];
                        for (var j=1; j<doc.poll.options.length; j++ )
                        {opts.push({option: doc.poll.options[j].option, votes: doc.poll.options[j].votes});}
                        allPolls[0] = {question: question, options: opts};
                       res.render('viewOne.ejs', {polls: allPolls, logstatus: status, alertMessage: message1});      
                  }
                  else { Poll.findOne({ 'userid' : id, 'poll.question' : question+ '?'}, function(err, doc) {                        if (err) {res.send('error3');}
                      else { 
                      if (doc){
                          //the question was found with ? added.
                           var opts = [{}];
                           for (var j=1; j<doc.poll.options.length; j++ )
                        {
                            opts.push({option: doc.poll.options[j].option, votes: doc.poll.options[j].votes});
                        
                        }
                        allPolls[0] = {question: question, options: opts};  
                        res.render('viewOne.ejs', {polls: allPolls, logstatus: status, alertMessage: message1}); 
                      } else {
                          //no luck with finding the poll the user was looking for,
                          res.render('index.ejs', { logstatus: ' Login/Signup', polls: allPolls, option1: 'block', option2: 'block', totalPolls:0, alertMessage: message2});     
                      }
                      }                                                                                   
                                                                                                         
                    });}
                 });
              
              }
                else {
                   //no user with this username 
                    res.render('index.ejs', { logstatus: ' Login/Signup', polls: allPolls, option1: 'block', option2: 'block', totalPolls:0, alertMessage: message2}); 
                }
              }
        
            });   
}
   });
     
app.get('/delete/*', isLoggedIn, function(req, res) {
     var _qUrl = req.url;
     var locSuffix = decodeURIComponent(_qUrl.substring(8)); 
     var n = locSuffix.indexOf("/");
     var username = locSuffix.substring(0, n);
     var question = locSuffix.substring(n+1);    
    //now get the userid 
    User.findOne({ 'local.username' : username}, function(err, user) {    
           if (err) {}
           else
            {    
              if (user) {
                     var id = user._id;
                Poll.findOneAndRemove({'userid' : id, 'poll.question' : question}, function (err, doc) {
    if(err){
        throw err;
    }
    if(doc){
        res.redirect('/view?type=local');
    }else{      
        Poll.findOneAndRemove({'userid' : id, 'poll.question' : question+ '?'}, function (err, doc) {
    if(err){
        throw err;
    }
    if(doc){res.redirect('/view?type=local');} else {
        //there was an error findng and removing the document.
        res.redirect('/view?type=local');}
        
    });}});}}});});
    
    app.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});

app.get('/loginSuccess', function(req, res, next) {
  res.send('Successfully authenticated');
}); 
    
     // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'username'}));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/profile',
            failureRedirect : '/'
        })); 
    
  // google -------------------------------
        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


   // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', 
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));   
    
    
    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'username' }));

        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));
    
    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));
    

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove username and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.username    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    });
    
    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
           res.redirect('/');
        });
    });
    
    app.get('/*', function(req, res, next) { 
        
     var username = '';
     var question = '';
     var _qUrl = req.url;   
     var qUrl = decodeURIComponent(_qUrl.substring(1));
     var n = qUrl.indexOf("/");
     username = qUrl.substring(0, n);
     var sc = req.body.showcase; 
     question = qUrl.substring(n+1); 
        
    if (username == '' || question == ''){res.redirect('/');}
    else {
        
        var status;
        var totalPolls =0;
        
    if (req.user)
    {status = " Log out";
         Poll.find({ 'userid' :  req.user._id }, function(err, polls) {    
                 if (err) {}
                 else
                 { totalPolls = polls.length;
                   callback('', totalPolls);
                 
                 } });
    
    }
    else {totalPolls = 0;
        status = " Login/Signup";
        callback("", 0);  }    
      
    function callback(error, totalPolls)  
        {User.findOne({ 'local.username' : username}, function(err, user) {    
           if (err) {}
           else
            { if (user) {
                    var id = user._id; 
                
                    Poll.findOne({ 'userid' : id, 'poll.question' : question}, function(err, doc) {    
                      if (err) {}
                        else
                        {if (doc) {
                            
                             var lg = doc.poll.options.length;
                                var optionlist = [];
                                var votelist = [];
                                var optionslist = [{}];
                                for (i=1; i<lg; i++)
                                    
                                {optionlist.push(doc.poll.options[i].option);
                                votelist.push(doc.poll.options[i].votes);
    optionslist.push({option: doc.poll.options[i].option, votes:doc.poll.options[i].votes})}
                                
                                res.render('voting.ejs', {question: question, username: username, 
                                                          optionlist: optionlist, votelist: votelist,
                              optionslist: optionslist, logstatus: status, totalPolls: totalPolls});
                            
                           }   
                          else {
                               Poll.findOne({ 'userid' : id, 'poll.question' : question + '?'}, function(err, doc) {  if (err) {}
                        else {  
                          if (doc) {
                              
                               var lg = doc.poll.options.length;
                                var optionlist = [];
                                var votelist = [];
                                var optionslist = [{}];
                                for (i=1; i<lg; i++)
                                    
                                {optionlist.push(doc.poll.options[i].option);
                                votelist.push(doc.poll.options[i].votes);
    optionslist.push({option: doc.poll.options[i].option, votes:doc.poll.options[i].votes})}
                                
                                res.render('voting.ejs', {question: question + '?', username: username, 
                                                          optionlist: optionlist, votelist: votelist,
                                                         optionslist: optionslist, logstatus: status, totalPolls: totalPolls});
                              
                         }   
                          else {res.send('could not locate question in the database; please report this error');}    
                        }});} 
                              }
                        });
            }}});
            
}
        
        
    }});
 

    app.post('/*', function(req, res) {    
     var _qUrl = req.url;   
     var qUrl = decodeURIComponent(_qUrl.substring(1));
     var n = qUrl.indexOf("/");
     var username = qUrl.substring(0, n);
     var sc = req.body.sc; 
     var pub = req.body.pub;
     var qlist = req.body.qlist;
     var ops =[];
     var opt = {};
     
     var options;
     var question = qUrl.substring(n+1);
     User.findOne({ 'local.username' : username}, function(err, user) {    
           if (err) {}
           else if (user)  
            { //user found.
                var id = user._id;  
                Poll.findOne({ 'userid' : id, 'poll.question': question}, function(err, doc) {    
                            if (err) {}
                            else
                              { if (doc) {   
                                options = doc.poll.options;
                                for (var i = 1; i<doc.poll.options.length; i++)
                                {opt = {option: doc.poll.options[i].option}
                                ops.push(opt); 
                                var conditions = {'userid' : id, 'poll.question' : question};
                                if (sc != '')     
                                {pub = doc.poll.public;
                                 var update = { $set:{'poll.showcase': sc}};}
                                else if (pub != '')      
                                {sc = doc.poll.showcase;
                                    var update = { $set:{'poll.public': pub}};
                                    
                                }
                                Poll.update(conditions, update, callback);  
                                function callback (err, numAffected) {}  
                               }
                                  res.redirect('/edit');
 //res.render('create2.ejs', {username: username, logstatus: ' Log out', question:question, options: ops, sc:sc, pub: pub, qlist:qlist});     
                              }
                               else {
                                   //append question mark to question and search again.
                                Poll.findOne({ 'userid' : id, 'poll.question': question + '?'},                                             function(err, doc) {
                                    
                                    if (err) {}
                               else { if (doc) {   
                               options = doc.poll.options;
                               for (var i = 1; i<doc.poll.options.length; i++)
                                {opt = {option: doc.poll.options[i].option}
                                ops.push(opt); 
                                var conditions = {'userid' : id, 'poll.question' : question+ '?'};
                                 if (sc != '')     
                                {pub = doc.poll.public;
                                 var update = { $set:{'poll.showcase': sc}};}
                                else if (pub != '')      
                                {sc = doc.poll.showcase;
                                    var update = { $set:{'poll.public': pub}};
                                    
                                }
                                 Poll.update(conditions, update, callback);  
                                 function callback (err, numAffected) {}  
                               }
                                res.redirect('/edit');
                                //res.render('create2.ejs', {username: username, logstatus: ' Log out', question:question, options: ops, sc:sc, pub: pub, qlist:qlist}); 
                                
                            }
                               else {
                                  //question not found in database. 
                                   res.redirect('/');
                                   
                               }}});}}});}
             else {
                 //user not found.
                 res.redirect('/');
             }});});
    
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
    {return next();}
           
// if they aren't redirect them to the home page
   var allPolls = req.all3Polls;
    res.render('index.ejs', { logstatus: ' Login/Signup', polls: allPolls, option1: 'block', option2: 'block', totalPolls:0, alertMessage: ''});};

function isLoggedIn2(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.render('signlog.ejs');}



