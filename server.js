const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send(`
        <html>
        <head>
            <title>FBI Dashboard</title>
            <style>
                body{
                    background:#0d1117;
                    color:white;
                    font-family:Arial;
                    text-align:center;
                    padding-top:100px;
                }

                h1{
                    color:#00ff88;
                    font-size:50px;
                }

                p{
                    color:#aaa;
                    font-size:20px;
                }
            </style>
        </head>

        <body>
            <h1>🟢 BOT ONLINE</h1>
            <p>FBI Dashboard System Running</p>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🌐 Dashboard online on port " + PORT);
});