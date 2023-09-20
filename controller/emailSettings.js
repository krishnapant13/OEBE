module.exports = {
  action_auto_mailer: false,
  sendBlueMailer: false,
  sendBlue: {
    fromEmail: "team@quodeck.com",
    name: "QuoDeck",
  },
  notifications: {
    fromEmail: "QuoDeck <team@quodeck.com>",
    emailTransporter: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "team@quodeck.com",
        pass: "quodeck@123",
      },
    },
    createuser: {
      subject: "Welcome To QuoDeck LMS !!!",
      body: `<!DOCTYPE html>
            <html>
            <head>
            <style>
            div {
              background-color: #f5f5f5;
              font-family: "Times New Roman", Times, serif;
            
            }
            </style>
            </head>
            <body>
            <div>
            <center>
            <h1>Welcome To QuoDeck LMS!</h1>
            <p>QuoDeck has signed you up as 'Learner' on QuoDeck LMS.<br/>Please login directly through web link - http://localhost:3000/learner </p>
            </center>
            </div>
            </body>
            </html>        
            `,
    },
    enrolluser: {
      subject: "Course Enrollment - $coursename",
      body: `<!DOCTYPE html>
            <html>
            <head>
            <style>
            div {
              background-color: #f5f5f5;
              font-family: "Times New Roman", Times, serif;
            
            }
            </style>
            </head>
            <body>
            <div>
            <center>
            <h2>$assignor has enrolled you in to the new course - $coursename</h2>
            <p>Please login directly through web link - http://localhost:3000/learner </p>
            </center>
            </div>
            </body>
            </html>`,
    },
    forgotpassword: {
      subject: "You have requested for an password reset!!!",
      body: `<!DOCTYPE html>
              <html>
              <head>
              <style>
              div {
                background-color: #f5f5f5;
                font-family: "Times New Roman", Times, serif;
              
              }
              </style>
              </head>
              <body>
              <div>
              <p>Dear User,</p>
              <span>You have requested for a password reset for your account. Just <a href="http://localhost:3000/setpass?token=$mailToken">click this link to put in a new password</a>. In case you did not request for a password reset, we would recommend logging in and checking if everything is in order.<br/><br/></span>
              <br />
              <p>Thank You!</p>
              <p>QuoDeck Support</p>
              </div>
              </body>
              </html>`,
    },
    autoNotification: {
      subject: "Course",
      body: `<!DOCTYPE html>
            <html>
            <head>
            <style>
            div {
              background-color: #f5f5f5;
              font-family: "Times New Roman", Times, serif;
            }
            </style>
            </head>
            <body>
            <div>
            <center>
            <h2>$description.</h2>
            <p>Please login directly through web link - http://localhost:3000/learner </p>
            </center>
            </div>
            </body>
            </html>`,
    },
  },
  support: {
    action_mailer_perform_deliveries: false,
    fromEmail: "QuoDeck Support <team@quodeck.com>",
    emailTransporter: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "team@quodeck.com",
        pass: "quodeck@123",
      },
    },
    raiseticket: {
      subject: "$ticketSubject",
      body: `<!DOCTYPE html>
          <html>
          <body><div>
          <p>Dear User,</p>
          <span>Thank you for contacting Support. We have received your query. Your query has been classified as Priority</span>
          <span></span> $userspriority.
          <span>This will be resolved within</span><span></span> $usersduration
          <span>from today. You will receive an update on resolution</span>
          <br />
          <p>Thank You!</p>
          <p>QuoDeck Support</p>
          </div>
          </body>
          </html>`,
    },
    modifyticket: {
      subject: "$ticketSubject",
      body: `<!DOCTYPE html>
          <html>
          <body>
          <div>
          <span></span>$usersfeedback
          <br />
          <p>Thank You!</p>
          <p>QuoDeck Support</p>
          </div>
          </body>
          </html>`,
    },
  },
};
