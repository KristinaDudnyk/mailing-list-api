const port = 3000;

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mailingListsData = [
  {
    name: "staff",
    members: ["talea@techtonica.org", "michelle@techtonica.org"],
  },
  {
    name: "cohort-h1-2020",
    members: [
      "ali@techtonica.org",
      "humail@techtonica.org",
      "khadar@techtonica.org",
    ],
  },
  {
    name: "tech-ed",
    members: ["mitch@curriculum.org", "sally@curriculum.org"],
  },
];

app.get("/", (req, res) => {
  res.status(200).send(mailingListsData);
});

app.get("/lists", (req, res) => {
  const data = mailingListsData.filter((element) => element.name);
  console.log(data);
  if (!data.length) {
    res.status(200).send([]);
  }
  const names = data.map((element) => element.name);
  res.status(200).send(names);
});

app.get("/lists/:name", (req, res) => {
  const parameter = req.params.name;
  console.log(parameter);

  const specificThing = mailingListsData.find(
    (element) => element.name === parameter
  );
  console.log(specificThing);
  if (!specificThing) {
    res.status(404).send(`List with the name: ${parameter} was not found`);
  }
  res.status(200).send(specificThing);
});

app.delete("/lists/:name", (req, res) => {
  const parameter = req.params.name;
  console.log(parameter);

  const indexOfSpecificThing = mailingListsData.findIndex(
    (element) => element.name === parameter
  );
  console.log(indexOfSpecificThing);

  if (indexOfSpecificThing === -1) {
    return res.status(404).send(":(");
  }

  mailingListsData.splice(indexOfSpecificThing, 1);

  if (!mailingListsData.find((element) => element.name === parameter)) {
    return res.status(200).send("success");
  }
});

app.put("/lists/:name", (req, res) => {
  const parameter = req.params.name;

  const { name: nameFromBody, members: membersFromBody } = req.body;
  // const found = mailingListsData.find((user) => user.name === paramentr);
  const foundIndex = mailingListsData.findIndex(
    (user) => user.name === parameter
  );

  if (foundIndex !== -1) {
    console.log("Object found at index:", foundIndex);
    const user = mailingListsData[foundIndex];

    user.members = membersFromBody;
    return res.status(200).json(mailingListsData);
  }
  if (foundIndex === -1) {
    console.log("Object not found in the array and then added");
    mailingListsData.push({
      name: nameFromBody,
      members: membersFromBody,
    });
    return res.status(201).json(mailingListsData);
  }
});

app.listen(port, () => {
  console.log(`Server listening on Port ${port}`);
});
