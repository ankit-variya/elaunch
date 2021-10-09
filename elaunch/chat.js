const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3001;
const bodyparser = require('body-parser');
const { insert, findById } = require('./models/commonModel')

const auth = require('./middleware/auth')

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json({ type: 'application/vnd.api+json' }));
app.use(bodyparser.text());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  //res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let tableName = 'chat';
const socketActions = async (req, res, next) => {
  try {
    let body = req.body;
    let user = req.userData.email;
    const { action } = req.params;

    const record = await findById('users', { email: user });

    const chatData = await actionResponse(action, record.data[0].id, body);

    res.send({
      data: chatData,
    });
  } catch (error) {
    res.send({
      error: error.message,
    });
  }
}

const actionResponse = async (action, user, body) => {
  let table = await actionModel(action, user, body);
  // console.log("table", table);
  let socketAction = "";
  switch (action) {
    case "create":
      socketAction = "SEND_MESSAGE";
      break;

    case "history":
      socketAction = "CHAT_HISTORY";
      break;

    case "conversationList":
      socketAction = "CONVERSATION_LIST";
      break;
  }

  io.on('connection', (socket) => {
    socket.on('chat message', msg => {
      //  console.log('mmmmssgg', msg)
      //  io.emit('chat message', msg);
      socket.emit(socketAction, table)

    });
  });

  return table;
}
// console.log('auth', auth)

const actionModel = async (action, user, body) => {
  switch (action) {

    case "create":
      const createChat = await sendData(user, body);
      return createChat;

    case "history":
      const historyData = await chatHistory(user, body);
      return historyData;

    case "conversationList":
      const conversationData = await listConversation(user, body);
      return conversationData;

    default:
      throw new Error("action not proper");
  }
}

const sendData = async (user, body) => {
  console.log('body', body)

  let chatObj = {
    authorId: user,
    clientId: body.clientId,
    message: body.message
  }
  const insertedData = await insert(tableName, chatObj);
  if (!insertedData.data) throw new Error("data is not inserted");

  const record = await findById(tableName, { id: insertedData.data[0] });
  return record.data;
}

const chatHistory = async (user, body) => {
  const messages = await findById(tableName, { authorId: user });
  if (!messages.data) throw new Error("not found any chat history");
  return messages.data;
}

const listConversation = async (user, body) => {
  const list = await findById(tableName, { authorId: user });
  if (!list.data) throw new Error("not found any user");


  const users = list.data.map(e => e.clientId)
  var newarr = users.filter((x, y) => users.indexOf(x) == y);
  const listArr = await Promise.all(newarr.map(async e => {
    const listing = await findById('users', { id: e });
    const useraList = listing.data.map(e => e.firstname)
    return useraList[0];
  })
  );

  return listArr;
}



app.use("/chatAction/:action", auth, socketActions);

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});