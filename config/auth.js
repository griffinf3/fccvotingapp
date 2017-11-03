// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {
    'twitterAuth' : {
        'consumerKey'       : 'B6eaJOOiQ1srl77PAaTngY0PJ',
        'consumerSecret'    : 'GKDIW8vWszHFbgtE30A5ec9zG5DGdZ10UO6PiYfmFsOEodSRDi',
        'callbackURL'        : 'http://localhost:3000/auth/twitter/callback'
    },
    
   'googleAuth' : {
        'clientID'      : '762644857277-di7slrft4cvqdthb5kr4b5cg33gem016.apps.googleusercontent.com',
        'clientSecret'  : '__VRk0AkEgtU6-ERLYyazHPx',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    }  
    
};
