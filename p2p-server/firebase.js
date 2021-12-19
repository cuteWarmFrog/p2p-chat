const token = 'cb1FoqSPRsmYPCuG1FCzYK:APA91bGeU48UVuUcQubSaSwIUDWlot9UvekgJjd96Ui_YBdE6MPrBMUspE6LQzaJsHCBKzQH5zwkFW0xkFdPQPYkQfqPBeCRIe1XssvFrReHOa3jf6I8NiQ7n2TPR41ppDMA8Nkta0xM';
const admin = require('firebase-admin');
const serviceAccount = require('./p2p-chat-firebase.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24
}

function generatePayload(login, roomId) {
    return {
        notification: {
            title: `${login} is calling you!`,
            body: 'tap to answer',
        },

        data: {
            roomId: roomId
        }
    }
}

export function sendMessage(token, login, roomId) {
    admin.messaging().sendToDevice(token, generatePayload(login, roomId), options)
        .then(response => {
            console.log('Successfully sent', response);
        })
        .catch(error => {
            console.log('Error sending:', error);
        })
}
