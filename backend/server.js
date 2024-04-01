const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(bodyParser.json()); 

// console.log(process.env.PORT);
const port = process.env.PORT;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);


// ping
app.get('/', (req, res) => {
    res.status(200).send({
        error: null,
        data: null,
        count: null,
        status: 200,
        statusText: "hello word"
    });
});

//crud 
app.get("/blogs", async (req, res) => {
  const { data, error } = await supabase.from("astobase-blog").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
});

app.post("/blogs", async (req, res) => {
  const { title, description } = req.body;
//  const data = title +' '+ description
  const resp = await supabase
    .from("astobase-blog")
    .insert({ title, description });

    if (resp.status != 201) {
        return res.status(500).json({ error: resp });
    } else {
        res.send(resp);
    }
});

app.put("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const resp = await supabase
    .from("astobase-blog")
    .update({ title, description })
    .eq("id", id);

  if (resp.status != 204) {
    return res.status(500).json({ resp });
  } else {
    res.json(resp);
  }
});

app.delete("/blogs/:id", async (req, res) => {
  const { id } = req.params;

  const resp = await supabase.from("astobase-blog").delete().eq("id", id);

  if (resp.status != 204) {
    return res.status(500).json({ resp });
  } else {
    res.json(resp);
  }
});

// running server
app.listen(port, () => {
  console.log('Server berjalan pada port '+port);
});