const EventEmitter = require('events');

class NotificationService extends EventEmitter {
    sendEmail(to, subject, message) {
        console.log(`Sending email to ${to}: ${subject} - ${message}`);
        this.emit('email', { to, subject, message });
    }

    sendSMS(to, message) {

        console.log(`Sending SMS to ${to}: ${message}`);
        this.emit('sms', { to, message });
    }

    sendPush(to, title, message) {

        console.log(`Sending push notification to ${to}: ${title} - ${message}`);
        this.emit('push', { to, title, message });
    }
}


const notificationService = new NotificationService();


notificationService.on('email', (notification) => {
    console.log('Email notification received:', notification);
});

notificationService.on('sms', (notification) => {
    console.log('SMS notification received:', notification);
});

notificationService.on('push', (notification) => {
    console.log('Push notification received:', notification);
});


notificationService.sendEmail('user@example.com', 'Welcome!', 'Thank you for signing up.');
notificationService.sendSMS('+1234567890', 'Your verification code is 123456.');
notificationService.sendPush('user123', 'New Message', 'You have a new message in your inbox.');
