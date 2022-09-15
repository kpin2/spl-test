/* Kevin Pinto
 * CS2421.011 Website Development
 * Professor Obetz
 * FinalProj
* */


import Express from 'express';
import router from './api.js'

let app = Express();
app.use("/", router);

/* Adding Express.static route to make all files in client folder available */
app.use('/', Express.static('../client'));

app.listen(8080, () => {
    console.log("Server started! Listening on port 8080");
});