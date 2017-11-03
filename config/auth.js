// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
    'twitterAuth' : {
        'consumerKey'    : 'B6eaJOOiQ1srl77PAaTngY0PJ',
        'consumerSecret' : 'GKDIW8vWszHFbgtE30A5ec9zG5DGdZ10UO6PiYfmFsOEodSRDi',
        'callbackURL'    : 'https://postnpoll.herokuapp.com/auth/twitter/callback'
    },
    
   'googleAuth' : {
        'clientID'      : '762644857277-di7slrft4cvqdthb5kr4b5cg33gem016.apps.googleusercontent.com',
        'clientSecret'  : '__VRk0AkEgtU6-ERLYyazHPx',
        'callbackURL'   : 'https://postnpoll.herokuapp.com/auth/google/callback'
    }  
    
};
