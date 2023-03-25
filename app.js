const express = require("express");
const { spawn } = require("child_process");
const app = express();

const io = require("socket.io")(3002, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);

  // const javaProcess = spawn("java", ["-jar", "hellohomesum2.jar"], {
  //   cwd: "./java",
  // });

  // const javaProcess = spawn("java", ["-jar", "hellohome.jar"], {
  //   cwd: "./java",
  // });

  const javaProcess = spawn("java", ["-jar", "Eutility2.jar"], {
    cwd: "./java",
  });
  
  let output = "";

  javaProcess.stdout.on("data", (data) => {
    // output += data.toString();
    output = data.toString();
    console.log(data.toString());
    io.emit("receive-message", output);
  });

  javaProcess.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  javaProcess.on("exit", (code) => {
    console.log(`Java program exited with code ${code}`);
  });

  socket.on("custom-event", (n1) => {
    javaProcess.stdin.write(String(n1) + "\n");
  });

  // setTimeout(()=>{
  //   console.log("kill")
  //   javaProcess.kill("SIGKILL");  this will kill the jar file code without any error
  // },5000)

});

app.get("/test-child-process", (req, res) => {
  console.log("hi");
  const javaProcess = spawn("java", ["-jar", "hellohome.jar"], {
    cwd: "./java",
  });
  let output = "";

  javaProcess.stdout.on("data", (data) => {
    output += data.toString();
    console.log(data.toString());
  });

  javaProcess.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  javaProcess.on("exit", (code) => {
    console.log(`Java program exited with code ${code}`);
    res.send(output);
  });

  javaProcess.stdin.write("1\n");
  javaProcess.stdin.write("2\n");
});

app.get("/sumof2", (req, res) => {
  const javaProcess = spawn("java", ["-jar", "hellohomesum2.jar"], {
    cwd: "./java",
  });
  let output = "";

  javaProcess.stdout.on("data", (data) => {
    output += data.toString();
    console.log(data.toString());
  });

  javaProcess.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  javaProcess.on("exit", (code) => {
    console.log(`Java program exited with code ${code}`);
    res.send(output);
  });

  javaProcess.stdin.write("1\n");
  javaProcess.stdin.write("2\n");
  javaProcess.stdin.write("3\n");
});

app.get("/email-utility", (req, res) => {
  const javaProcess = spawn("java", ["-jar", "Eutility2.jar"], {
    cwd: "./java",
  });

  let output = "";
  let isSend = false;

  javaProcess.stdout.on("data", (data) => {
    output += data.toString();
    console.log(data.toString());
    if (
      data.toString().includes("Set Admin Password") ||
      data.toString().includes("Confirm Password") ||
      data.toString().includes("Enter Admin Password")
    ) {
      if (!isSend) {
        isSend = true;
        res.json(output);
      }

      javaProcess.stdin.write("amanbisht\n");

      if (data.toString().includes("Confirm Password")) {
        javaProcess.stdin.write("amanbisht\n");
        javaProcess.stdin.write("g\n");
      }
    }
  });

  javaProcess.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  javaProcess.on("exit", (code) => {
    console.log(`Java program exited with code ${code}`);
    res.send(output);
  });

  //   javaProcess.stdin.write("g\n");
});

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
